import { v4 as uuid } from 'uuid';
import { Logger } from '../../shared/logger';
import { NotFoundError, ValidationError, InternalError } from '../../shared/errors';
import {
  RegisterVideoRequest,
  UpdateVideoRequest,
  VideoResponse,
  GalleryQuery,
  CloudinarySignatureResponse,
  CloudinarySignatureRequest,
} from './types';
import { Video, VideoStatus, VideoSnapshot, VideoMetrics } from './models';
import { getSupabaseClient } from '../../config/supabase';
import crypto from 'crypto';

export class ContentService {
  private logger = new Logger('ContentService');
  private supabase = getSupabaseClient();

  async registerVideo(request: RegisterVideoRequest): Promise<VideoResponse> {
    this.logger.debug(`Registering video for artist ${request.artistId}`);

    if (!request.artistId || !request.sourceUrl) {
      throw new ValidationError('artistId and sourceUrl are required');
    }

    const videoId = uuid();
    const { data: video, error } = await this.supabase
      .from('videos')
      .insert({
        id: videoId,
        artist_id: request.artistId,
        title: request.title,
        source_url: request.sourceUrl,
        status: VideoStatus.ANALYZING,
        hashtags: request.hashtags || [],
        platforms: request.platforms || [],
        created_at: new Date(),
        updated_at: new Date(),
      })
      .select()
      .single();

    if (error) {
      this.logger.error(`Failed to register video: ${error.message}`);
      throw new ValidationError(`Failed to register video: ${error.message}`);
    }

    this.logger.info(`Video registered: ${videoId}`);

    // Enviar webhook a N8N para procesamiento
    try {
      await this.sendWebhookToN8N({
        videoId,
        artistId: request.artistId,
        sourceUrl: request.sourceUrl,
      });
    } catch (err) {
      this.logger.warn(`Failed to send webhook to N8N: ${(err as any).message}`);
    }

    return this.videoToResponse(video);
  }

  async getVideo(videoId: string): Promise<VideoResponse> {
    const { data: video, error } = await this.supabase
      .from('videos')
      .select('*')
      .eq('id', videoId)
      .single();

    if (error || !video) {
      throw new NotFoundError(`Video ${videoId} not found`);
    }

    return this.videoToResponse(video);
  }

  async getGallery(artistId: string, query: GalleryQuery = {}): Promise<{
    videos: VideoResponse[];
    total: number;
    page: number;
    limit: number;
  }> {
    const limit = query.limit || 20;
    const page = query.page || 1;
    const skip = (page - 1) * limit;

    // Construir query
    let queryBuilder = this.supabase
      .from('videos')
      .select('*', { count: 'exact' })
      .eq('artist_id', artistId)
      .is('deleted_at', null);

    // Filtrar por status si se proporciona
    if (query.status) {
      queryBuilder = queryBuilder.eq('status', query.status);
    }

    // Ordenar
    const sortMap: Record<string, string> = {
      newest: 'created_at.desc',
      oldest: 'created_at.asc',
      viral_score: 'viral_score_real.desc',
    };

    const sortBy = sortMap[query.sort as keyof typeof sortMap] || 'created_at.desc';
    queryBuilder = queryBuilder.order(sortBy);

    // Paginar
    queryBuilder = queryBuilder.range(skip, skip + limit - 1);

    const { data: videos, count, error } = await queryBuilder;

    if (error) {
      this.logger.error(`Failed to get gallery: ${error.message}`);
      throw new ValidationError(`Failed to get gallery: ${error.message}`);
    }

    return {
      videos: (videos || []).map((v) => this.videoToResponse(v)),
      total: count || 0,
      page,
      limit,
    };
  }

  async updateVideo(videoId: string, request: UpdateVideoRequest): Promise<VideoResponse> {
    const updateData: any = {
      updated_at: new Date(),
    };

    if (request.title) updateData.title = request.title;
    if (request.aiCopy) updateData.ai_copy = request.aiCopy;
    if (request.hashtags) updateData.hashtags = request.hashtags;
    if (request.platforms) updateData.platforms = request.platforms;
    if (request.hookSuggestion) updateData.hook_suggestion = request.hookSuggestion;

    const { data: video, error } = await this.supabase
      .from('videos')
      .update(updateData)
      .eq('id', videoId)
      .select()
      .single();

    if (error || !video) {
      throw new NotFoundError(`Video ${videoId} not found`);
    }

    this.logger.info(`Video updated: ${videoId}`);
    return this.videoToResponse(video);
  }

  async deleteVideo(videoId: string): Promise<void> {
    const { error } = await this.supabase
      .from('videos')
      .update({ deleted_at: new Date() })
      .eq('id', videoId);

    if (error) {
      throw new NotFoundError(`Video ${videoId} not found`);
    }

    this.logger.info(`Video deleted: ${videoId}`);
  }

  async retryVideo(videoId: string): Promise<VideoResponse> {
    const { data: video, error: getError } = await this.supabase
      .from('videos')
      .select('*')
      .eq('id', videoId)
      .single();

    if (getError || !video) {
      throw new NotFoundError(`Video ${videoId} not found`);
    }

    if (video.status !== VideoStatus.ERROR) {
      throw new ValidationError('Only videos in ERROR status can be retried');
    }

    const { data: updated, error } = await this.supabase
      .from('videos')
      .update({
        status: VideoStatus.ANALYZING,
        error_message: null,
        updated_at: new Date(),
      })
      .eq('id', videoId)
      .select()
      .single();

    if (error) {
      throw new ValidationError(`Failed to retry video: ${error.message}`);
    }

    this.logger.info(`Video retry: ${videoId}`);

    // Reenviar webhook a N8N
    try {
      await this.sendWebhookToN8N({
        videoId,
        artistId: video.artist_id,
        sourceUrl: video.source_url,
      });
    } catch (err) {
      this.logger.warn(`Failed to send webhook to N8N on retry: ${(err as any).message}`);
    }

    return this.videoToResponse(updated);
  }

  async getPublishStatus(videoId: string): Promise<any> {
    const { data: video, error } = await this.supabase
      .from('videos')
      .select('*')
      .eq('id', videoId)
      .single();

    if (error || !video) {
      throw new NotFoundError(`Video ${videoId} not found`);
    }

    return {
      videoId,
      status: video.status,
      postId: video.post_id || null,
      platforms: video.platforms,
      publishedAt: video.published_at,
    };
  }

  async getAnalytics(videoId: string): Promise<any> {
    const { data: video, error: videoError } = await this.supabase
      .from('videos')
      .select('*')
      .eq('id', videoId)
      .single();

    if (videoError || !video) {
      throw new NotFoundError(`Video ${videoId} not found`);
    }

    // Obtener snapshots de métricas
    const { data: snapshots, error: snapshotsError } = await this.supabase
      .from('post_metrics_snapshots')
      .select('*')
      .eq('video_id', videoId)
      .order('snapshot_at', { ascending: true });

    const analytics4h = video.analytics_4h || {};

    return {
      id: videoId,
      views: analytics4h.views || 0,
      likes: analytics4h.likes || 0,
      comments: analytics4h.comments || 0,
      shares: analytics4h.shares || 0,
      saves: analytics4h.saves || 0,
      reach: analytics4h.reach || 0,
      impressions: analytics4h.impressions || 0,
      engagementRate: analytics4h.engagement_rate || 0,
      viralScore: video.viral_score_real || 0,
      history: (snapshots || []).map((s) => ({
        snapshot_at: s.snapshot_at,
        platform: s.platform,
        views: s.views,
        likes: s.likes,
        comments: s.comments,
      })),
      lastUpdated: video.updated_at,
    };
  }

  async getCloudinarySignature(
    request: CloudinarySignatureRequest
  ): Promise<CloudinarySignatureResponse> {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'demo';
    const apiKey = process.env.CLOUDINARY_API_KEY || 'demo-api-key';
    const apiSecret = process.env.CLOUDINARY_API_SECRET || 'demo-secret';
    const timestamp = Math.floor(Date.now() / 1000);

    // Generar firma real
    const paramsToSign = `folder=${request.folder}&resource_type=${request.resourceType}&timestamp=${timestamp}`;
    const signature = crypto
      .createHash('sha1')
      .update(paramsToSign + apiSecret)
      .digest('hex');

    return {
      cloudName,
      apiKey,
      folder: request.folder,
      timestamp,
      signature,
      resourceType: request.resourceType,
    };
  }

  // Actualizar video cuando el webhook de procesamiento regresa
  async updateVideoFromProcessing(
    videoId: string,
    data: {
      cloudinaryUrl?: string;
      thumbnailUrl?: string;
      status: VideoStatus;
      viralScore?: number;
      aiCopy?: string;
      hookSuggestion?: string;
      hashtags?: string[];
      error?: string;
    }
  ): Promise<VideoResponse> {
    const updateData: any = {
      status: data.status,
      updated_at: new Date(),
    };

    if (data.cloudinaryUrl) updateData.cloudinary_url = data.cloudinaryUrl;
    if (data.thumbnailUrl) updateData.thumbnail_url = data.thumbnailUrl;
    if (data.viralScore) updateData.viral_score_real = data.viralScore;
    if (data.aiCopy) updateData.ai_copy = data.aiCopy;
    if (data.hookSuggestion) updateData.hook_suggestion = data.hookSuggestion;
    if (data.hashtags) updateData.hashtags = data.hashtags;
    if (data.error) updateData.error_message = data.error;

    const { data: video, error } = await this.supabase
      .from('videos')
      .update(updateData)
      .eq('id', videoId)
      .select()
      .single();

    if (error) {
      this.logger.error(`Failed to update video from processing: ${error.message}`);
      throw new ValidationError(`Failed to update video: ${error.message}`);
    }

    this.logger.info(`Video updated from processing: ${videoId} - status ${data.status}`);
    return this.videoToResponse(video);
  }

  private async sendWebhookToN8N(data: any): Promise<void> {
    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    if (!webhookUrl) {
      this.logger.warn('N8N_WEBHOOK_URL not configured');
      return;
    }

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        this.logger.warn(`N8N webhook returned ${response.status}`);
      }
    } catch (err) {
      this.logger.error(`Failed to send N8N webhook: ${(err as any).message}`);
    }
  }

  private videoToResponse(video: any): VideoResponse {
    return {
      id: video.id,
      artistId: video.artist_id,
      title: video.title,
      cloudinaryUrl: video.cloudinary_url,
      thumbnailUrl: video.thumbnail_url,
      status: video.status,
      viralScore: video.viral_score_real,
      hookSuggestion: video.hook_suggestion,
      aiCopy: video.ai_copy,
      hashtags: video.hashtags || [],
      platforms: video.platforms || [],
      scheduledAt: video.scheduled_at,
      postId: video.post_id,
      processedUrl: video.processed_url,
      createdAt: new Date(video.created_at).toISOString(),
    };
  }
}

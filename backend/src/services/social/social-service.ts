/**
 * Social Service - Vidalis.AI
 *
 * Envoltura de alto nivel para Upload-Post API
 * Maneja la lógica de negocio de publicación social
 */

import { Logger } from '../../shared/logger';
import { NotFoundError, ValidationError, AuthError } from '../../shared/errors';
import { getSupabaseClient } from '../../config/supabase';
import * as uploadPost from './uploadPostService';

export class SocialService {
  private logger = new Logger('SocialService');
  private supabase = getSupabaseClient();

  // ============================================================
  // CONECTAR REDES SOCIALES
  // ============================================================

  async getConnectUrl(artistId: string, allowedPlatforms: string[] = []): Promise<any> {
    this.logger.debug(`Getting connect URL for artist ${artistId}`);

    // Obtener artista de Supabase
    const { data: artist, error } = await this.supabase
      .from('artists')
      .select('*')
      .eq('id', artistId)
      .single();

    if (error || !artist) {
      throw new NotFoundError(`Artist ${artistId} not found`);
    }

    let profileId = artist.ayrshare_profile_key;

    // Si no tiene perfil en Upload-Post, crear uno
    if (!profileId) {
      this.logger.info(`Creating new Upload-Post profile for artist ${artist.name}`);
      profileId = await uploadPost.createProfile(artist.name, artistId);

      // Guardar profileId en DB
      await this.supabase
        .from('artists')
        .update({
          ayrshare_profile_key: profileId,
          publish_mode: 'upload-post',
        })
        .eq('id', artistId);
    }

    // Generar URL de conexión
    const connectUrl = await uploadPost.generateConnectUrl(profileId, allowedPlatforms);

    return {
      success: true,
      connectUrl,
      profileId,
    };
  }

  // ============================================================
  // OBTENER PLATAFORMAS ACTIVAS
  // ============================================================

  async getActivePlatforms(artistId: string): Promise<string[]> {
    const { data: artist, error } = await this.supabase
      .from('artists')
      .select('ayrshare_profile_key')
      .eq('id', artistId)
      .single();

    if (error || !artist || !artist.ayrshare_profile_key) {
      return [];
    }

    return uploadPost.getActivePlatforms(artist.ayrshare_profile_key);
  }

  // ============================================================
  // PUBLICAR VIDEO
  // ============================================================

  async publishVideo(
    videoId: string,
    artistId: string,
    platforms: string[],
    options: any = {}
  ): Promise<any> {
    this.logger.debug(`Publishing video ${videoId} to platforms: ${platforms.join(',')}`);

    if (!platforms || platforms.length === 0) {
      throw new ValidationError('At least one platform must be selected');
    }

    // Obtener video
    const { data: video, error: videoError } = await this.supabase
      .from('videos')
      .select('*')
      .eq('id', videoId)
      .single();

    if (videoError || !video) {
      throw new NotFoundError(`Video ${videoId} not found`);
    }

    if (video.artist_id !== artistId) {
      throw new AuthError('Video does not belong to this artist');
    }

    // Obtener artista y su profileKey
    const { data: artist, error: artistError } = await this.supabase
      .from('artists')
      .select('ayrshare_profile_key')
      .eq('id', artistId)
      .single();

    if (artistError || !artist || !artist.ayrshare_profile_key) {
      throw new ValidationError('Artist has not connected social accounts yet');
    }

    // Preparar contenido
    const title = video.title || '';
    const caption = video.ai_copy || '';
    const hashtags = (video.hashtags || []).join(' ');
    const text = `${caption}\n\n${hashtags}`.trim();
    const mediaUrl = video.cloudinary_url || video.source_url;

    if (!mediaUrl) {
      throw new ValidationError('Video has no media URL');
    }

    // Publicar
    try {
      const result = await uploadPost.publishPost(
        text,
        platforms,
        [mediaUrl],
        artist.ayrshare_profile_key,
        {
          title,
          postType: options.postType || 'REELS',
          description: caption,
          timezone: options.timezone,
        }
      );

      // Actualizar video con post ID
      await this.supabase
        .from('videos')
        .update({
          post_id: result.id,
          platforms,
          published_at: new Date(),
        })
        .eq('id', videoId);

      this.logger.info(`Video published: ${videoId} - request ID ${result.id}`);

      return {
        success: true,
        postId: result.id,
        platforms,
        message: `Video scheduled to ${platforms.join(', ')}`,
      };
    } catch (err) {
      this.logger.error(`Failed to publish video: ${(err as any).message}`);
      throw err;
    }
  }

  // ============================================================
  // PROGRAMAR VIDEO
  // ============================================================

  async scheduleVideo(
    videoId: string,
    artistId: string,
    platforms: string[],
    scheduleDate: Date,
    options: any = {}
  ): Promise<any> {
    this.logger.debug(`Scheduling video ${videoId} for ${scheduleDate}`);

    if (!platforms || platforms.length === 0) {
      throw new ValidationError('At least one platform must be selected');
    }

    // Obtener video
    const { data: video, error: videoError } = await this.supabase
      .from('videos')
      .select('*')
      .eq('id', videoId)
      .single();

    if (videoError || !video) {
      throw new NotFoundError(`Video ${videoId} not found`);
    }

    if (video.artist_id !== artistId) {
      throw new AuthError('Video does not belong to this artist');
    }

    // Obtener artista
    const { data: artist, error: artistError } = await this.supabase
      .from('artists')
      .select('ayrshare_profile_key')
      .eq('id', artistId)
      .single();

    if (artistError || !artist || !artist.ayrshare_profile_key) {
      throw new ValidationError('Artist has not connected social accounts yet');
    }

    // Preparar contenido
    const caption = video.ai_copy || '';
    const hashtags = (video.hashtags || []).join(' ');
    const text = `${caption}\n\n${hashtags}`.trim();
    const mediaUrl = video.cloudinary_url || video.source_url;

    if (!mediaUrl) {
      throw new ValidationError('Video has no media URL');
    }

    // Programar
    try {
      const result = await uploadPost.schedulePost(
        text,
        platforms,
        [mediaUrl],
        scheduleDate,
        artist.ayrshare_profile_key,
        {
          postType: options.postType || 'REELS',
          description: caption,
          timezone: options.timezone || 'UTC',
        }
      );

      // Actualizar video
      await this.supabase
        .from('videos')
        .update({
          post_id: result.id,
          platforms,
          scheduled_at: scheduleDate,
        })
        .eq('id', videoId);

      this.logger.info(`Video scheduled: ${videoId} - ${scheduleDate}`);

      return {
        success: true,
        postId: result.id,
        platforms,
        scheduledAt: scheduleDate.toISOString(),
        message: `Video scheduled for ${scheduleDate.toLocaleString()}`,
      };
    } catch (err) {
      this.logger.error(`Failed to schedule video: ${(err as any).message}`);
      throw err;
    }
  }

  // ============================================================
  // OBTENER ESTADO DE PUBLICACIÓN
  // ============================================================

  async getPublishStatus(postId: string): Promise<any> {
    try {
      const status = await uploadPost.getPostStatus(postId);
      const analytics = await uploadPost.getPostAnalytics(postId);

      return {
        success: true,
        postId,
        status: status.status,
        analytics,
      };
    } catch (err) {
      this.logger.warn(`Failed to get publish status: ${(err as any).message}`);
      return {
        success: false,
        postId,
        status: 'unknown',
      };
    }
  }

  // ============================================================
  // OBTENER ANALÍTICAS
  // ============================================================

  async getVideoAnalytics(videoId: string, artistId: string): Promise<any> {
    // Obtener video
    const { data: video, error: videoError } = await this.supabase
      .from('videos')
      .select('*')
      .eq('id', videoId)
      .single();

    if (videoError || !video) {
      throw new NotFoundError(`Video ${videoId} not found`);
    }

    if (video.artist_id !== artistId) {
      throw new AuthError('Video does not belong to this artist');
    }

    // Obtener snapshots de métricas
    const { data: snapshots } = await this.supabase
      .from('post_metrics_snapshots')
      .select('*')
      .eq('video_id', videoId)
      .order('snapshot_at', { ascending: false });

    const latest = snapshots?.[0];

    return {
      success: true,
      videoId,
      postId: video.post_id,
      viralScore: video.viral_score_real || 0,
      platforms: video.platforms || [],
      metrics: latest || {},
      history: snapshots || [],
      publishedAt: video.published_at,
      updatedAt: video.updated_at,
    };
  }

  // ============================================================
  // OBTENER ANALÍTICAS DEL PERFIL
  // ============================================================

  async getProfileAnalytics(artistId: string): Promise<any> {
    // Obtener artista
    const { data: artist, error } = await this.supabase
      .from('artists')
      .select('*')
      .eq('id', artistId)
      .single();

    if (error || !artist) {
      throw new NotFoundError(`Artist ${artistId} not found`);
    }

    if (!artist.ayrshare_profile_key) {
      return {
        success: true,
        artistId,
        platforms: [],
        totalImpressions: 0,
      };
    }

    try {
      const platforms = await uploadPost.getActivePlatforms(artist.ayrshare_profile_key);
      const impressions = await uploadPost.getTotalImpressions(artist.ayrshare_profile_key);
      const analytics = await uploadPost.getAnalytics(artist.ayrshare_profile_key, platforms);

      return {
        success: true,
        artistId,
        platforms,
        totalImpressions: impressions,
        profileAnalytics: analytics,
      };
    } catch (err) {
      this.logger.warn(`Failed to get profile analytics: ${(err as any).message}`);
      return {
        success: false,
        artistId,
        error: (err as any).message,
      };
    }
  }
}

export default SocialService;

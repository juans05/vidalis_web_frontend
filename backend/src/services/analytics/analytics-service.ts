import { Logger } from '../../shared/logger';
import { NotFoundError } from '../../shared/errors';
import { StatsResponse, AnalyticsResponse, GrowthPoint, VideoSnapshot } from './types';
import { getSupabaseClient } from '../../config/supabase';

export class AnalyticsService {
  private logger = new Logger('AnalyticsService');
  private supabase = getSupabaseClient();

  async getStats(agencyId: string, artistId?: string): Promise<StatsResponse> {
    this.logger.debug(`Getting stats for agency ${agencyId}, artist ${artistId}`);

    try {
      // Obtener videos del artista
      let query = this.supabase
        .from('videos')
        .select('viral_score_real, platforms, analytics_4h, created_at')
        .is('deleted_at', null);

      if (artistId) {
        query = query.eq('artist_id', artistId);
      }

      const { data: videos, error: videoError } = await query;

      if (videoError) {
        this.logger.warn(`Failed to get videos: ${videoError.message}`);
        videos = [];
      }

      // Obtener métricas agregadas desde post_metrics_snapshots
      let metricsQuery = this.supabase
        .from('post_metrics_snapshots')
        .select('views, likes, comments, shares, saves, reach, impressions, platform, snapshot_at');

      if (artistId) {
        metricsQuery = metricsQuery.eq('artist_id', artistId);
      }

      const { data: snapshots, error: snapshotsError } = await metricsQuery;

      if (snapshotsError) {
        this.logger.warn(`Failed to get snapshots: ${snapshotsError.message}`);
      }

      // Calcular estadísticas agregadas
      const totalViews = (snapshots || []).reduce((sum, s) => sum + (s.views || 0), 0);
      const totalLikes = (snapshots || []).reduce((sum, s) => sum + (s.likes || 0), 0);
      const totalComments = (snapshots || []).reduce((sum, s) => sum + (s.comments || 0), 0);
      const totalShares = (snapshots || []).reduce((sum, s) => sum + (s.shares || 0), 0);
      const totalSaves = (snapshots || []).reduce((sum, s) => sum + (s.saves || 0), 0);

      const publishedVideos = (videos || []).length;
      const avgViralScore =
        publishedVideos > 0
          ? (videos || []).reduce((sum, v) => sum + (v.viral_score_real || 0), 0) / publishedVideos
          : 0;

      // Desglose por plataforma
      const platformBreakdown: Record<string, number> = {};
      (snapshots || []).forEach((s) => {
        const platform = s.platform || 'unknown';
        platformBreakdown[platform] = (platformBreakdown[platform] || 0) + (s.views || 0);
      });

      // Crecimiento (últimos 30 días)
      const growthData = this.calculateGrowthData(snapshots || []);

      return {
        totalFollowers: 0, // No disponible desde Upload-Post sin conexión directa
        followersGrowth: 0,
        totalViews,
        viewsGrowth: this.calculateGrowthRate(growthData),
        totalLikes,
        totalComments,
        totalShares,
        totalSaves,
        publishedVideos,
        avgViralScore,
        growthData,
        monthlyUsage: publishedVideos,
        monthlyLimit: 100,
        planName: 'pro',
        platformBreakdown,
      };
    } catch (err) {
      this.logger.error(`Failed to get stats: ${(err as any).message}`);
      // Retornar stats vacías
      return {
        totalFollowers: 0,
        followersGrowth: 0,
        totalViews: 0,
        viewsGrowth: 0,
        totalLikes: 0,
        totalComments: 0,
        totalShares: 0,
        totalSaves: 0,
        publishedVideos: 0,
        avgViralScore: 0,
        growthData: [],
        monthlyUsage: 0,
        monthlyLimit: 100,
        planName: 'pro',
        platformBreakdown: {},
      };
    }
  }

  async getAnalytics(videoId: string): Promise<AnalyticsResponse> {
    this.logger.debug(`Getting analytics for video ${videoId}`);

    try {
      // Obtener video
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
        .order('snapshot_at', { ascending: false })
        .limit(30);

      if (snapshotsError) {
        this.logger.warn(`Failed to get snapshots: ${snapshotsError.message}`);
      }

      // Calcular totales
      const analytics4h = video.analytics_4h || {};
      const totalViews = analytics4h.views || 0;
      const totalLikes = analytics4h.likes || 0;
      const totalComments = analytics4h.comments || 0;
      const totalShares = analytics4h.shares || 0;
      const totalSaves = analytics4h.saves || 0;
      const totalReach = analytics4h.reach || 0;
      const totalImpressions = analytics4h.impressions || 0;
      const engagementRate = analytics4h.engagement_rate || 0;

      // Desglose por plataforma
      const platformBreakdown: Record<string, number> = {};
      (snapshots || []).forEach((s) => {
        const platform = s.platform || 'unknown';
        platformBreakdown[platform] = (platformBreakdown[platform] || 0) + (s.views || 0);
      });

      // Convertir snapshots a VideoSnapshot
      const history: VideoSnapshot[] = (snapshots || []).map((s) => ({
        snapshot_at: s.snapshot_at,
        views: s.views,
        likes: s.likes,
        comments: s.comments,
        shares: s.shares,
        saves: s.saves,
      }));

      return {
        id: videoId,
        views: totalViews,
        likes: totalLikes,
        comments: totalComments,
        shares: totalShares,
        saves: totalSaves,
        reach: totalReach,
        impressions: totalImpressions,
        engagementRate,
        history,
        platformBreakdown,
      };
    } catch (err: any) {
      this.logger.error(`Failed to get analytics: ${err.message}`);
      if (err.statusCode === 404) {
        throw err;
      }
      // Retornar analytics vacías
      return {
        id: videoId,
        views: 0,
        likes: 0,
        comments: 0,
        shares: 0,
        saves: 0,
        reach: 0,
        impressions: 0,
        engagementRate: 0,
        history: [],
        platformBreakdown: {},
      };
    }
  }

  /**
   * Calcular datos de crecimiento desde snapshots
   */
  private calculateGrowthData(snapshots: any[]): GrowthPoint[] {
    const grouped: Record<string, any> = {};

    // Agrupar por fecha
    snapshots.forEach((s) => {
      const date = new Date(s.snapshot_at).toISOString().split('T')[0];
      if (!grouped[date]) {
        grouped[date] = { views: 0, likes: 0, comments: 0 };
      }
      grouped[date].views += s.views || 0;
      grouped[date].likes += s.likes || 0;
      grouped[date].comments += s.comments || 0;
    });

    // Convertir a array y ordenar
    const result: GrowthPoint[] = Object.entries(grouped)
      .map(([date, data]) => ({
        date,
        followers: 0, // No disponible
        views: data.views,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return result;
  }

  /**
   * Calcular tasa de crecimiento desde datos de crecimiento
   */
  private calculateGrowthRate(growthData: GrowthPoint[]): number {
    if (growthData.length < 2) return 0;

    const first = growthData[0].views;
    const last = growthData[growthData.length - 1].views;

    if (first === 0) return 0;
    return ((last - first) / first) * 100;
  }
}

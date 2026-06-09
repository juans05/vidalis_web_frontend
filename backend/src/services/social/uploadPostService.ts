/**
 * Upload-Post Service - Vidalis.AI (TypeScript)
 *
 * Servicio para la API de upload-post.com
 * Publicación a redes sociales TikTok, Instagram, YouTube, Facebook, LinkedIn
 *
 * Base URL: https://api.upload-post.com/api
 */

import axios, { AxiosError } from 'axios';
import FormData from 'form-data';
import { getSupabaseClient } from '../../config/supabase';
import { getUploadPostClient } from '../../config/uploadpost';
import { Logger } from '../../shared/logger';

const UPLOAD_POST_BASE = 'https://api.upload-post.com/api';

const logger = new Logger('UploadPostService');
const supabase = getSupabaseClient();
const uploadPostApi = getUploadPostClient();

// ============================================================
// METRICS CALCULATION
// ============================================================

export function normalizeMetrics(raw: any) {
  if (!raw) return {
    likes: 0,
    comments: 0,
    views: 0,
    shares: 0,
    saves: 0,
    reach: 0,
    impressions: 0,
  };

  return {
    likes: raw.likes || raw.like_count || raw.heart || 0,
    comments: raw.comments || raw.comment_count || 0,
    views: raw.views || raw.view_count || raw.play_count || 0,
    shares: raw.shares || raw.share_count || raw.retweet_count || raw.reposts || 0,
    saves: raw.saves || raw.save_count || raw.bookmarks || 0,
    reach: raw.reach || raw.non_followers_reach || 0,
    impressions: raw.impressions || raw.impression_count || 0,
  };
}

export function calcEngagementRate(
  likes = 0,
  comments = 0,
  shares = 0,
  saves = 0,
  views = 0,
  impressions = 0
): number {
  const denominator = Math.max(views, impressions, 1);
  const weighted = likes + comments * 2 + shares * 3 + saves * 2;
  return (weighted / denominator) * 100;
}

export function engagementToViralScore(rate: number): number {
  if (rate >= 15) return 10;
  if (rate >= 10) return 9;
  if (rate >= 7) return 8;
  if (rate >= 5) return 7;
  if (rate >= 3) return 6;
  if (rate >= 2) return 5;
  if (rate >= 1) return 4;
  if (rate >= 0.5) return 3;
  if (rate >= 0.1) return 2;
  return 1;
}

export async function saveMetricsSnapshot(
  videoId: string,
  artistId: string,
  platform: string,
  rawMetrics: any
) {
  const m = normalizeMetrics(rawMetrics);
  const engRate = calcEngagementRate(
    m.likes,
    m.comments,
    m.shares,
    m.saves,
    m.views,
    m.impressions
  );
  const viralScore = engagementToViralScore(engRate);

  // Guardar snapshot
  const { error: snapErr } = await supabase
    .from('post_metrics_snapshots')
    .insert({
      video_id: videoId,
      artist_id: artistId,
      platform: platform || 'unknown',
      likes: m.likes,
      comments: m.comments,
      views: m.views,
      shares: m.shares,
      saves: m.saves,
      reach: m.reach,
      impressions: m.impressions,
      engagement_rate: parseFloat(engRate.toFixed(3)),
      viral_score_real: viralScore,
      raw_data: rawMetrics || {},
      snapshot_at: new Date(),
    });

  if (snapErr) {
    logger.warn(`Failed to save metrics snapshot: ${snapErr.message}`);
  }

  // Actualizar video con viral score real
  if (m.views > 0 || m.likes > 0) {
    const { error: vErr } = await supabase
      .from('videos')
      .update({
        viral_score_real: viralScore,
        analytics_4h: {
          ...m,
          engagement_rate: parseFloat(engRate.toFixed(3)),
          updated_at: new Date().toISOString(),
        },
      })
      .eq('id', videoId);

    if (vErr) {
      logger.warn(`Failed to update video viral score: ${vErr.message}`);
    }
  }

  return { ...m, engagement_rate: engRate, viral_score_real: viralScore };
}

// ============================================================
// PROFILES
// ============================================================

export async function createProfile(name: string, artistId?: string): Promise<string> {
  const shortId = artistId ? artistId.toString().split('-')[0] : '';
  let sanitizedUsername = (name || '')
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .replace(/^_+|_+$/g, '');

  if (shortId) {
    sanitizedUsername = `${sanitizedUsername}_${shortId}`;
  }

  if (!sanitizedUsername) {
    sanitizedUsername = `artista_${Date.now()}`;
  }

  logger.info(`Creating Upload-Post profile: ${sanitizedUsername}`);

  try {
    const response = await uploadPostApi().post(`${UPLOAD_POST_BASE}/uploadposts/users`, {
      username: sanitizedUsername,
    });

    return response.data.user_id || response.data.id || sanitizedUsername;
  } catch (err: any) {
    const status = err.response?.status;
    const errCode = err.response?.data?.details?.error_code || err.response?.data?.error_code;

    // Perfil ya existe
    if (status === 400 || (status === 403 && errCode === 'USERNAME_TAKEN')) {
      logger.warn(`Profile already exists, reusing: ${sanitizedUsername}`);
      return sanitizedUsername;
    }

    // Límite de perfiles alcanzado
    if (status === 403 && errCode === 'PROFILE_LIMIT_REACHED') {
      const error = new Error('PROFILE_LIMIT_REACHED');
      throw error;
    }

    logger.error(`Failed to create profile: ${err.response?.data?.message || err.message}`);
    throw err;
  }
}

export async function generateConnectUrl(
  userId: string,
  allowedPlatforms: string[] = []
): Promise<string> {
  try {
    logger.info(`Generating connect URL for ${userId}`);

    const redirectUrl = process.env.FRONTEND_URL
      ? `${process.env.FRONTEND_URL}/social-callback`
      : undefined;

    const response = await uploadPostApi().post(
      `${UPLOAD_POST_BASE}/uploadposts/users/generate-jwt`,
      {
        username: userId,
        profile_username: userId,
        platforms: allowedPlatforms.length > 0 ? allowedPlatforms : undefined,
        ...(redirectUrl && { redirect_url: redirectUrl }),
      },
      {
        timeout: 10000,
      }
    );

    if (!response.data || !response.data.access_url) {
      throw new Error('No access_url in response');
    }

    logger.info(`Connect URL generated for ${userId}`);
    return response.data.access_url;
  } catch (err: any) {
    logger.error(`Failed to generate connect URL: ${err.message}`);
    throw err;
  }
}

export async function getActivePlatforms(userId: string): Promise<string[]> {
  try {
    const response = await uploadPostApi().get(`${UPLOAD_POST_BASE}/uploadposts/users/${userId}`);
    return response.data.platforms || response.data.activeSocialAccounts || [];
  } catch (err) {
    logger.warn(`Failed to get active platforms: ${(err as any).message}`);
    return [];
  }
}

// ============================================================
// PUBLISH
// ============================================================

export async function publishPost(
  text: string,
  platforms: string[],
  mediaUrls: string[] = [],
  userId: string,
  options: any = {}
): Promise<any> {
  const form = new FormData();

  form.append('user', userId);
  platforms.forEach((p) => form.append('platform[]', p));
  form.append('title', text || '');

  if (options.description) {
    form.append('description', options.description);
  }

  form.append('async_upload', 'true');

  const mediaUrl = mediaUrls[0];
  let endpoint = '/upload_text';

  if (mediaUrl) {
    const isVideo = /\.(mp4|mov|webm)(\?|$)/i.test(mediaUrl) || mediaUrl.includes('/video/');

    if (isVideo) {
      endpoint = '/upload';
      form.append('video', mediaUrl);

      const postType = (options.postType || 'REELS').toUpperCase();

      // Instagram
      if (platforms.includes('instagram')) {
        const igType = postType === 'STORIES' ? 'STORIES' : 'REELS';
        form.append('media_type', igType);
        form.append('share_to_feed', 'true');
        form.append('instagram_title', text || '');
      }

      // Facebook
      if (platforms.includes('facebook')) {
        const fbType = ['FEED', 'STORIES', 'REELS', 'VIDEO'].includes(postType) ? postType : 'REELS';
        form.append('facebook_media_type', fbType);
      }

      // TikTok
      if (platforms.includes('tiktok')) {
        form.append('tiktok_title', text || '');
      }

      // YouTube
      if (platforms.includes('youtube')) {
        form.append('youtube_title', text || '');
      }

      // LinkedIn
      if (platforms.includes('linkedin')) {
        form.append('linkedin_title', text || '');
      }
    } else {
      // Imágenes
      endpoint = '/upload_photos';
      form.append('image[]', mediaUrl);
    }
  }

  // Scheduling
  const scheduleDate = options.scheduleDate || options.scheduled_date;
  if (scheduleDate) {
    form.append('scheduled_date', new Date(scheduleDate).toISOString());
    if (options.timezone) form.append('timezone', options.timezone);
  }

  try {
    logger.info(`Publishing to ${platforms.join(', ')} via Upload-Post`);

    const response = await axios.post(`${UPLOAD_POST_BASE}${endpoint}`, form, {
      headers: {
        ...form.getHeaders(),
        'Authorization': `Apikey ${process.env.UPLOAD_POST_API_KEY}`,
      },
    });

    logger.info(`Publish successful, request ID: ${response.data.request_id}`);

    return {
      id: response.data.request_id || response.data.id,
      status: response.data.status,
      details: response.data,
    };
  } catch (err: any) {
    const status = err.response?.status;
    const errorData = err.response?.data;

    if (status === 429) {
      if (errorData?.violations) {
        const violation = errorData.violations[0];
        const platform = violation.platform || 'social network';
        const msg = `Daily limit reached for ${platform}: ${violation.used_last_24h}/${violation.cap}`;
        throw new Error(msg);
      }
      throw new Error('Daily post limit reached');
    }

    logger.error(`Publish failed: ${errorData?.message || err.message}`);
    throw err;
  }
}

// ============================================================
// SCHEDULE
// ============================================================

export async function schedulePost(
  text: string,
  platforms: string[],
  mediaUrls: string[] = [],
  scheduleDate: Date,
  userId: string,
  options: any = {}
): Promise<any> {
  return publishPost(text, platforms, mediaUrls, userId, {
    ...options,
    scheduleDate,
  });
}

// ============================================================
// ANALYTICS
// ============================================================

export async function getAnalytics(userId: string, platforms: string[] = []): Promise<any> {
  try {
    logger.info(`Getting analytics for ${userId}`);

    const response = await uploadPostApi().get(
      `${UPLOAD_POST_BASE}/uploadposts/users/${userId}/analytics`,
      {
        params: platforms.length > 0 ? { platforms: platforms.join(',') } : undefined,
      }
    );

    return response.data;
  } catch (err) {
    logger.warn(`Failed to get analytics: ${(err as any).message}`);
    return {};
  }
}

export async function getPostStatus(requestId: string): Promise<any> {
  try {
    const response = await uploadPostApi().get(`${UPLOAD_POST_BASE}/posts/${requestId}`);
    return response.data;
  } catch (err) {
    logger.warn(`Failed to get post status: ${(err as any).message}`);
    return { status: 'unknown', id: requestId };
  }
}

export async function getPostAnalytics(requestId: string): Promise<any> {
  try {
    const response = await uploadPostApi().get(`${UPLOAD_POST_BASE}/posts/${requestId}/analytics`);
    return response.data;
  } catch (err) {
    logger.warn(`Failed to get post analytics: ${(err as any).message}`);
    return {};
  }
}

export async function getTotalImpressions(userId: string): Promise<number> {
  try {
    const response = await uploadPostApi().get(
      `${UPLOAD_POST_BASE}/uploadposts/users/${userId}/impressions`
    );
    return response.data.impressions || 0;
  } catch (err) {
    logger.warn(`Failed to get impressions: ${(err as any).message}`);
    return 0;
  }
}

export default {
  createProfile,
  generateConnectUrl,
  getActivePlatforms,
  publishPost,
  schedulePost,
  getAnalytics,
  getPostStatus,
  getPostAnalytics,
  getTotalImpressions,
  saveMetricsSnapshot,
  normalizeMetrics,
  calcEngagementRate,
  engagementToViralScore,
};

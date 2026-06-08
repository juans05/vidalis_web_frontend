/**
 * Social API Service
 *
 * Cliente para interactuar con Social Service endpoints
 * Publicación, programación y analíticas de redes sociales
 */

import { api as apiClient } from './api';

const BASE_PATH = '/vidalis/social';

// ============================================================
// CONECTAR REDES SOCIALES
// ============================================================

export async function getConnectUrl(
  artistId: string,
  platforms: string[] = []
): Promise<{ success: boolean; connectUrl: string; profileId: string }> {
  const response = await apiClient.post(`${BASE_PATH}/connect/${artistId}`, {
    platforms,
  });
  return response.data.data;
}

// ============================================================
// PUBLICAR VIDEO
// ============================================================

export interface PublishOptions {
  platforms: string[];
  postType?: 'REELS' | 'STORIES' | 'FEED' | 'VIDEO';
}

export async function publishVideo(
  videoId: string,
  options: PublishOptions
): Promise<{
  success: boolean;
  postId: string;
  platforms: string[];
  message: string;
}> {
  const response = await apiClient.post(`${BASE_PATH}/publish/${videoId}`, {
    platforms: options.platforms,
    postType: options.postType,
  });
  return response.data.data;
}

// ============================================================
// PROGRAMAR VIDEO
// ============================================================

export interface ScheduleOptions {
  platforms: string[];
  scheduleDate: Date | string;
  postType?: 'REELS' | 'STORIES' | 'FEED' | 'VIDEO';
}

export async function scheduleVideo(
  videoId: string,
  options: ScheduleOptions
): Promise<{
  success: boolean;
  postId: string;
  platforms: string[];
  scheduledAt: string;
  message: string;
}> {
  const scheduleDate = options.scheduleDate instanceof Date
    ? options.scheduleDate.toISOString()
    : options.scheduleDate;

  const response = await apiClient.post(`${BASE_PATH}/schedule/${videoId}`, {
    platforms: options.platforms,
    scheduleDate,
    postType: options.postType,
  });
  return response.data.data;
}

// ============================================================
// ESTADO DE PUBLICACIÓN
// ============================================================

export async function getPublishStatus(
  postId: string
): Promise<{
  success: boolean;
  postId: string;
  status: string;
  analytics: any;
}> {
  const response = await apiClient.get(`${BASE_PATH}/status/${postId}`);
  return response.data.data;
}

// ============================================================
// PLATAFORMAS ACTIVAS
// ============================================================

export async function getActivePlatforms(
  artistId: string
): Promise<{ platforms: string[] }> {
  const response = await apiClient.get(`${BASE_PATH}/platforms/${artistId}`);
  return response.data.data;
}

// ============================================================
// ANALÍTICAS
// ============================================================

export async function getVideoAnalytics(
  videoId: string
): Promise<{
  success: boolean;
  videoId: string;
  postId: string | null;
  viralScore: number;
  platforms: string[];
  metrics: any;
  history: any[];
  publishedAt: string | null;
  updatedAt: string;
}> {
  const response = await apiClient.get(`${BASE_PATH}/analytics/${videoId}`);
  return response.data.data;
}

export async function getProfileAnalytics(
  artistId: string
): Promise<{
  success: boolean;
  artistId: string;
  platforms: string[];
  totalImpressions: number;
  profileAnalytics: any;
}> {
  const response = await apiClient.get(`${BASE_PATH}/profile-analytics/${artistId}`);
  return response.data.data;
}

export default {
  getConnectUrl,
  publishVideo,
  scheduleVideo,
  getPublishStatus,
  getActivePlatforms,
  getVideoAnalytics,
  getProfileAnalytics,
};

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
export async function getConnectUrl(artistId, platforms = []) {
    const response = await apiClient.post(`${BASE_PATH}/connect/${artistId}`, {
        platforms,
    });
    return response.data.data;
}
export async function publishVideo(videoId, options) {
    const response = await apiClient.post(`${BASE_PATH}/publish/${videoId}`, {
        platforms: options.platforms,
        postType: options.postType,
    });
    return response.data.data;
}
export async function scheduleVideo(videoId, options) {
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
export async function getPublishStatus(postId) {
    const response = await apiClient.get(`${BASE_PATH}/status/${postId}`);
    return response.data.data;
}
// ============================================================
// PLATAFORMAS ACTIVAS
// ============================================================
export async function getActivePlatforms(artistId) {
    const response = await apiClient.get(`${BASE_PATH}/platforms/${artistId}`);
    return response.data.data;
}
// ============================================================
// ANALÍTICAS
// ============================================================
export async function getVideoAnalytics(videoId) {
    const response = await apiClient.get(`${BASE_PATH}/analytics/${videoId}`);
    return response.data.data;
}
export async function getProfileAnalytics(artistId) {
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
//# sourceMappingURL=social.js.map
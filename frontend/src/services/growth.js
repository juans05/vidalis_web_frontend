import { api } from './api';
export const growthService = {
    getInsights: async (artistId) => {
        const response = await api.get(`/vidalis/artists/${artistId}/growth/insights`);
        return response.data;
    },
    getBestTime: async (artistId) => {
        const response = await api.get(`/vidalis/artists/${artistId}/growth/best-time`);
        return response.data;
    },
    getStrategy: async (artistId) => {
        const response = await api.get(`/vidalis/artists/${artistId}/growth/strategy`);
        return response.data;
    },
    getViralHistory: async (artistId) => {
        const response = await api.get(`/vidalis/artists/${artistId}/growth/viral-history`);
        return response.data;
    },
    generateAdCopy: async (videoId) => {
        const response = await api.post(`/vidalis/videos/${videoId}/ad-copy`, {});
        return response.data;
    },
    refineCopy: async (text, artistId) => {
        const response = await api.post('/vidalis/refine-copy', {
            text,
            artist_id: artistId,
        });
        return response.data.refined;
    },
};
//# sourceMappingURL=growth.js.map
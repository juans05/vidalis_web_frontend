import { api } from './api';
export const analyticsService = {
    getStats: async (agencyId, artistId) => {
        const params = new URLSearchParams();
        if (artistId)
            params.append('artistId', artistId);
        const response = await api.get(`/vidalis/stats/${agencyId}?${params}`);
        return response.data;
    },
    getAnalytics: async (videoId) => {
        const response = await api.get(`/vidalis/analytics/${videoId}`);
        return response.data;
    },
};
//# sourceMappingURL=analytics.js.map
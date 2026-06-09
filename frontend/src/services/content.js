import { api } from './api';
export const contentService = {
    // Register video for processing
    registerVideo: async (artistId, sourceUrl, title) => {
        const response = await api.post('/vidalis/upload', {
            videoData: {
                artist_id: artistId,
                source_url: sourceUrl,
                title,
            },
        });
        return response.data;
    },
    // Get artist's video gallery
    getGallery: async (artistId, options = {}) => {
        const params = new URLSearchParams();
        if (options.limit)
            params.append('limit', options.limit.toString());
        if (options.page)
            params.append('page', options.page.toString());
        if (options.status)
            params.append('status', options.status);
        if (options.sort)
            params.append('sort', options.sort);
        const response = await api.get(`/vidalis/gallery/${artistId}?${params}`);
        return response.data;
    },
    // Get video details
    getVideo: async (videoId) => {
        const response = await api.get(`/vidalis/video/${videoId}`);
        return response.data;
    },
    // Update video metadata
    updateVideo: async (videoId, data) => {
        const response = await api.patch(`/vidalis/video/${videoId}`, data);
        return response.data;
    },
    // Delete video
    deleteVideo: async (videoId) => {
        await api.delete(`/vidalis/video/${videoId}`);
    },
    // Retry processing
    retryVideo: async (videoId) => {
        const response = await api.post(`/vidalis/video/${videoId}/retry`, {});
        return response.data;
    },
    // Get publish status
    getPublishStatus: async (videoId) => {
        const response = await api.get(`/vidalis/video/${videoId}/publish-status`);
        return response.data;
    },
    // Get video analytics
    getAnalytics: async (videoId) => {
        const response = await api.get(`/vidalis/analytics/${videoId}`);
        return response.data;
    },
    // Get Cloudinary signature for direct upload
    getCloudinarySignature: async (folder, resourceType = 'video') => {
        const response = await api.get('/vidalis/cloudinary-signature', {
            params: { folder, resourceType },
        });
        return response.data;
    },
};
//# sourceMappingURL=content.js.map
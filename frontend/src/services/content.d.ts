export interface Video {
    id: string;
    artistId: string;
    title?: string;
    cloudinaryUrl?: string;
    thumbnailUrl?: string;
    status: string;
    viralScore?: number;
    hookSuggestion?: string;
    aiCopy?: string;
    hashtags: string[];
    platforms: string[];
    scheduledAt?: string;
    postId?: string;
    processedUrl?: string;
    createdAt: string;
}
export interface GalleryResponse {
    videos: Video[];
    total: number;
    page: number;
    limit: number;
}
export interface AnalyticsResponse {
    id: string;
    views: number;
    likes: number;
    comments: number;
    shares: number;
    saves: number;
    reach: number;
    impressions: number;
    engagementRate: number;
    history: Array<{
        snapshot_at: string;
        views: number;
        likes: number;
    }>;
    platformBreakdown: Record<string, number>;
}
export interface CloudinarySignature {
    cloudName: string;
    apiKey: string;
    folder: string;
    timestamp: number;
    signature: string;
    resourceType: string;
}
export declare const contentService: {
    registerVideo: (artistId: string, sourceUrl: string, title?: string) => Promise<Video>;
    getGallery: (artistId: string, options?: {
        limit?: number;
        page?: number;
        status?: string;
        sort?: string;
    }) => Promise<GalleryResponse>;
    getVideo: (videoId: string) => Promise<Video>;
    updateVideo: (videoId: string, data: {
        title?: string;
        aiCopy?: string;
        hashtags?: string[];
        platforms?: string[];
        hookSuggestion?: string;
    }) => Promise<Video>;
    deleteVideo: (videoId: string) => Promise<void>;
    retryVideo: (videoId: string) => Promise<Video>;
    getPublishStatus: (videoId: string) => Promise<unknown>;
    getAnalytics: (videoId: string) => Promise<AnalyticsResponse>;
    getCloudinarySignature: (folder: string, resourceType?: string) => Promise<CloudinarySignature>;
};
//# sourceMappingURL=content.d.ts.map
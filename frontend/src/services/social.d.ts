/**
 * Social API Service
 *
 * Cliente para interactuar con Social Service endpoints
 * Publicación, programación y analíticas de redes sociales
 */
export declare function getConnectUrl(artistId: string, platforms?: string[]): Promise<{
    success: boolean;
    connectUrl: string;
    profileId: string;
}>;
export interface PublishOptions {
    platforms: string[];
    postType?: 'REELS' | 'STORIES' | 'FEED' | 'VIDEO';
}
export declare function publishVideo(videoId: string, options: PublishOptions): Promise<{
    success: boolean;
    postId: string;
    platforms: string[];
    message: string;
}>;
export interface ScheduleOptions {
    platforms: string[];
    scheduleDate: Date | string;
    postType?: 'REELS' | 'STORIES' | 'FEED' | 'VIDEO';
}
export declare function scheduleVideo(videoId: string, options: ScheduleOptions): Promise<{
    success: boolean;
    postId: string;
    platforms: string[];
    scheduledAt: string;
    message: string;
}>;
export declare function getPublishStatus(postId: string): Promise<{
    success: boolean;
    postId: string;
    status: string;
    analytics: any;
}>;
export declare function getActivePlatforms(artistId: string): Promise<{
    platforms: string[];
}>;
export declare function getVideoAnalytics(videoId: string): Promise<{
    success: boolean;
    videoId: string;
    postId: string | null;
    viralScore: number;
    platforms: string[];
    metrics: any;
    history: any[];
    publishedAt: string | null;
    updatedAt: string;
}>;
export declare function getProfileAnalytics(artistId: string): Promise<{
    success: boolean;
    artistId: string;
    platforms: string[];
    totalImpressions: number;
    profileAnalytics: any;
}>;
declare const _default: {
    getConnectUrl: typeof getConnectUrl;
    publishVideo: typeof publishVideo;
    scheduleVideo: typeof scheduleVideo;
    getPublishStatus: typeof getPublishStatus;
    getActivePlatforms: typeof getActivePlatforms;
    getVideoAnalytics: typeof getVideoAnalytics;
    getProfileAnalytics: typeof getProfileAnalytics;
};
export default _default;
//# sourceMappingURL=social.d.ts.map
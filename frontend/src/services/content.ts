import { api } from './api';

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
  history: Array<{ snapshot_at: string; views: number; likes: number }>;
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

export const contentService = {
  // Register video for processing
  registerVideo: async (artistId: string, sourceUrl: string, title?: string) => {
    const response = await api.post<Video>('/vidalis/upload', {
      videoData: {
        artist_id: artistId,
        source_url: sourceUrl,
        title,
      },
    });
    return response.data;
  },

  // Get artist's video gallery
  getGallery: async (
    artistId: string,
    options: { limit?: number; page?: number; status?: string; sort?: string } = {}
  ) => {
    const params = new URLSearchParams();
    if (options.limit) params.append('limit', options.limit.toString());
    if (options.page) params.append('page', options.page.toString());
    if (options.status) params.append('status', options.status);
    if (options.sort) params.append('sort', options.sort);

    const response = await api.get<GalleryResponse>(`/vidalis/gallery/${artistId}?${params}`);
    return response.data;
  },

  // Get video details
  getVideo: async (videoId: string) => {
    const response = await api.get<Video>(`/vidalis/video/${videoId}`);
    return response.data;
  },

  // Update video metadata
  updateVideo: async (
    videoId: string,
    data: {
      title?: string;
      aiCopy?: string;
      hashtags?: string[];
      platforms?: string[];
      hookSuggestion?: string;
    }
  ) => {
    const response = await api.patch<Video>(`/vidalis/video/${videoId}`, data);
    return response.data;
  },

  // Delete video
  deleteVideo: async (videoId: string) => {
    await api.delete(`/vidalis/video/${videoId}`);
  },

  // Retry processing
  retryVideo: async (videoId: string) => {
    const response = await api.post<Video>(`/vidalis/video/${videoId}/retry`, {});
    return response.data;
  },

  // Get publish status
  getPublishStatus: async (videoId: string) => {
    const response = await api.get(`/vidalis/video/${videoId}/publish-status`);
    return response.data;
  },

  // Get video analytics
  getAnalytics: async (videoId: string) => {
    const response = await api.get<AnalyticsResponse>(`/vidalis/analytics/${videoId}`);
    return response.data;
  },

  // Get Cloudinary signature for direct upload
  getCloudinarySignature: async (folder: string, resourceType: string = 'video') => {
    const response = await api.get<CloudinarySignature>('/vidalis/cloudinary-signature', {
      params: { folder, resourceType },
    });
    return response.data;
  },
};

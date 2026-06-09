export interface RegisterVideoRequest {
  artistId: string;
  sourceUrl: string;
  title?: string;
  platforms?: string[];
}

export interface UpdateVideoRequest {
  title?: string;
  aiCopy?: string;
  hashtags?: string[];
  platforms?: string[];
  hookSuggestion?: string;
}

export interface VideoResponse {
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

export interface GalleryQuery {
  limit?: number;
  page?: number;
  status?: string;
  sort?: 'newest' | 'oldest' | 'viral_score';
}

export interface CloudinarySignatureRequest {
  folder: string;
  resourceType: 'video' | 'image';
}

export interface CloudinarySignatureResponse {
  cloudName: string;
  apiKey: string;
  folder: string;
  timestamp: number;
  signature: string;
  resourceType: string;
}

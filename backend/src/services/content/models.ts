export interface Video {
  id: string;
  artistId: string;
  title?: string;
  cloudinaryUrl?: string;
  thumbnailUrl?: string;
  status: VideoStatus;
  viralScore?: number;
  hookSuggestion?: string;
  aiCopy?: string;
  hashtags: string[];
  platforms: string[];
  scheduledAt?: Date;
  postId?: string; // ayrshare_post_id
  processedUrl?: string;
  sourceUrl?: string;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export enum VideoStatus {
  ANALYZING = 'analyzing',
  PROCESSING = 'processing',
  READY = 'ready',
  NEEDS_REVIEW = 'needs_review',
  PUBLISHED = 'published',
  SCHEDULED = 'scheduled',
  ERROR = 'error',
}

export interface VideoSnapshot {
  id: string;
  videoId: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  reach: number;
  impressions: number;
  engagementRate: number;
  snapshotAt: Date;
  createdAt: Date;
}

export interface VideoMetrics {
  videoId: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  reach: number;
  impressions: number;
  engagementRate: number;
  lastUpdated: Date;
}

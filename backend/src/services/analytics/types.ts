export interface StatsRequest {
  agencyId: string;
  artistId?: string;
}

export interface StatsResponse {
  totalFollowers: number;
  followersGrowth: number;
  totalViews: number;
  viewsGrowth: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  totalSaves: number;
  publishedVideos: number;
  avgViralScore: number;
  growthData: GrowthPoint[];
  monthlyUsage: number;
  monthlyLimit: number;
  planName: string;
  platformBreakdown: Record<string, number>;
}

export interface GrowthPoint {
  date: string;
  followers: number;
  views: number;
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
  history: VideoSnapshot[];
  platformBreakdown: Record<string, number>;
}

export interface VideoSnapshot {
  snapshot_at: string;
  views: number;
  likes: number;
  comments?: number;
  shares?: number;
  saves?: number;
}

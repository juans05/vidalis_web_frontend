import { api } from './api';

export interface GrowthInsight {
  id: string;
  title: string;
  description: string;
  recommendation: string;
  impact: 'high' | 'medium' | 'low';
  actionItems: string[];
}

export interface BestTimeData {
  bestDays: string[];
  bestHours: number[];
  timeZone: string;
  engagementByHour: Record<number, number>;
  engagementByDay: Record<string, number>;
}

export interface ContentStrategyItem {
  type: 'trending' | 'underperforming' | 'evergreen';
  topic: string;
  engagementScore: number;
  recommendations: string[];
  examples: string[];
}

export interface ViralScorePoint {
  date: string;
  score: number;
  trend: 'up' | 'down' | 'stable';
}

export interface AdCopyData {
  id: string;
  copy: string;
  style: 'professional' | 'casual' | 'humorous' | 'emotional';
  estimatedEngagement: number;
  hooks: string[];
}

export const growthService = {
  getInsights: async (artistId: string) => {
    const response = await api.get<GrowthInsight[]>(`/vidalis/artists/${artistId}/growth/insights`);
    return response.data;
  },

  getBestTime: async (artistId: string) => {
    const response = await api.get<BestTimeData>(`/vidalis/artists/${artistId}/growth/best-time`);
    return response.data;
  },

  getStrategy: async (artistId: string) => {
    const response = await api.get<ContentStrategyItem[]>(
      `/vidalis/artists/${artistId}/growth/strategy`
    );
    return response.data;
  },

  getViralHistory: async (artistId: string) => {
    const response = await api.get<ViralScorePoint[]>(
      `/vidalis/artists/${artistId}/growth/viral-history`
    );
    return response.data;
  },

  generateAdCopy: async (videoId: string) => {
    const response = await api.post<AdCopyData[]>(`/vidalis/videos/${videoId}/ad-copy`, {});
    return response.data;
  },

  refineCopy: async (text: string, artistId?: string) => {
    const response = await api.post<{ refined: string }>('/vidalis/refine-copy', {
      text,
      artist_id: artistId,
    });
    return response.data.refined;
  },
};

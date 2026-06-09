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

export interface ABTestData {
  id: string;
  videoId: string;
  variants: ABVariant[];
  status: 'pending' | 'running' | 'completed';
  results?: ABTestResult;
}

export interface ABVariant {
  id: string;
  type: 'caption' | 'thumbnail' | 'hashtags';
  original: string;
  variant: string;
  views?: number;
  engagement?: number;
}

export interface ABTestResult {
  winner: 'variant_a' | 'variant_b';
  improvement: number;
  confidence: number;
}

export interface AdCopyData {
  id: string;
  copy: string;
  style: 'professional' | 'casual' | 'humorous' | 'emotional';
  estimatedEngagement: number;
  hooks: string[];
}

export interface RefineCopyRequest {
  text: string;
  artistId?: string;
}

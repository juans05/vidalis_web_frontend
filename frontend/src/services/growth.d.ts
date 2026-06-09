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
export declare const growthService: {
    getInsights: (artistId: string) => Promise<GrowthInsight[]>;
    getBestTime: (artistId: string) => Promise<BestTimeData>;
    getStrategy: (artistId: string) => Promise<ContentStrategyItem[]>;
    getViralHistory: (artistId: string) => Promise<ViralScorePoint[]>;
    generateAdCopy: (videoId: string) => Promise<AdCopyData[]>;
    refineCopy: (text: string, artistId?: string) => Promise<string>;
};
//# sourceMappingURL=growth.d.ts.map
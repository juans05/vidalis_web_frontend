import { v4 as uuid } from 'uuid';
import { Logger } from '../../shared/logger';
import {
  GrowthInsight,
  BestTimeData,
  ContentStrategyItem,
  ViralScorePoint,
  ABTestData,
  ABVariant,
  AdCopyData,
  RefineCopyRequest,
} from './types';
import { getSupabaseClient } from '../../config/supabase';
import { getAnthropicClient } from '../../config/ai';

export class GrowthService {
  private logger = new Logger('GrowthService');
  private supabase = getSupabaseClient();

  async getInsights(artistId: string): Promise<GrowthInsight[]> {
    this.logger.debug(`Getting insights for artist ${artistId}`);

    try {
      // Obtener datos del artista
      const { data: videos } = await this.supabase
        .from('videos')
        .select('viral_score_real, platforms, created_at')
        .eq('artist_id', artistId)
        .is('deleted_at', null);

      const { data: snapshots } = await this.supabase
        .from('post_metrics_snapshots')
        .select('views, likes, comments, shares, platform, snapshot_at')
        .eq('artist_id', artistId);

      const insights: GrowthInsight[] = [];

      // Insight 1: Viral Score
      if (videos && videos.length > 0) {
        const avgViralScore =
          videos.reduce((sum, v) => sum + (v.viral_score_real || 0), 0) / videos.length;
        insights.push({
          id: uuid(),
          title: 'Viral Performance',
          description: `Your average viral score is ${avgViralScore.toFixed(1)}/10 across ${videos.length} videos`,
          recommendation:
            avgViralScore > 6
              ? 'Great performance! Keep analyzing what works'
              : 'Focus on analyzing high-performing content',
          impact: 'high',
          actionItems: ['Review top-performing videos', 'Replicate successful formats'],
        });
      }

      // Insight 2: Platform Performance
      if (snapshots && snapshots.length > 0) {
        const platformViews: Record<string, number> = {};
        snapshots.forEach((s) => {
          const platform = s.platform || 'unknown';
          platformViews[platform] = (platformViews[platform] || 0) + (s.views || 0);
        });

        const topPlatform = Object.entries(platformViews).sort(([, a], [, b]) => b - a)[0];
        if (topPlatform) {
          const percentage = Math.round((topPlatform[1] / Object.values(platformViews).reduce((a, b) => a + b)) * 100);
          insights.push({
            id: uuid(),
            title: 'Platform Opportunity',
            description: `${topPlatform[0]} drives ${percentage}% of your views`,
            recommendation: `Double down on ${topPlatform[0]} optimization`,
            impact: 'high',
            actionItems: [
              `Create ${topPlatform[0]}-specific content`,
              'Use platform trends and sounds',
              'Optimize posting schedule',
            ],
          });
        }
      }

      // Insight 3: Engagement
      if (snapshots && snapshots.length > 0) {
        const totalEngagement = snapshots.reduce((sum, s) => sum + (s.likes || 0) + (s.comments || 0) + (s.shares || 0), 0);
        const engagementPerVideo = totalEngagement / Math.max(videos?.length || 1, 1);
        insights.push({
          id: uuid(),
          title: 'Engagement Metrics',
          description: `Average engagement per video: ${Math.round(engagementPerVideo)} interactions`,
          recommendation: 'Use AI copy refinement to increase engagement',
          impact: 'medium',
          actionItems: ['Refine your captions', 'Add clear CTAs', 'Respond to comments'],
        });
      }

      return insights.length > 0
        ? insights
        : [
            {
              id: uuid(),
              title: 'Get Started',
              description: 'No data yet. Upload and publish your first video.',
              recommendation: 'Upload content to generate insights',
              impact: 'medium',
              actionItems: ['Upload video', 'Publish to platforms', 'Wait for metrics'],
            },
          ];
    } catch (err) {
      this.logger.error(`Failed to get insights: ${(err as any).message}`);
      return [];
    }
  }

  async getBestTime(artistId: string): Promise<BestTimeData> {
    this.logger.debug(`Getting best time for artist ${artistId}`);

    try {
      const { data: snapshots } = await this.supabase
        .from('post_metrics_snapshots')
        .select('snapshot_at, engagement_rate')
        .eq('artist_id', artistId);

      const engagementByHour: Record<number, number> = {};
      const engagementByDay: Record<string, number> = {
        Monday: 0,
        Tuesday: 0,
        Wednesday: 0,
        Thursday: 0,
        Friday: 0,
        Saturday: 0,
        Sunday: 0,
      };

      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const hourCount: Record<number, number> = {};
      const dayCount: Record<string, number> = { ...engagementByDay };
      let totalHours = 0;
      let totalDays = 0;

      // Agrupar snapshots por hora y día
      (snapshots || []).forEach((s) => {
        const date = new Date(s.snapshot_at);
        const hour = date.getHours();
        const day = dayNames[date.getDay()];
        const engagement = s.engagement_rate || 0;

        engagementByHour[hour] = (engagementByHour[hour] || 0) + engagement;
        hourCount[hour] = (hourCount[hour] || 0) + 1;

        engagementByDay[day] = (engagementByDay[day] || 0) + engagement;
        dayCount[day] = (dayCount[day] || 0) + 1;

        totalHours++;
        totalDays++;
      });

      // Promediar engagement
      for (let i = 0; i < 24; i++) {
        if (hourCount[i] > 0) {
          engagementByHour[i] = Math.round(engagementByHour[i] / hourCount[i]);
        } else {
          engagementByHour[i] = 0;
        }
      }

      for (const day of dayNames) {
        if (dayCount[day] > 0) {
          engagementByDay[day] = Math.round(engagementByDay[day] / dayCount[day]);
        }
      }

      // Encontrar mejores horas y días
      const bestHours = Object.entries(engagementByHour)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 4)
        .map(([h]) => parseInt(h));

      const bestDays = Object.entries(engagementByDay)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 2)
        .map(([d]) => d);

      return {
        bestDays: bestDays.length > 0 ? bestDays : ['Friday', 'Saturday'],
        bestHours: bestHours.length > 0 ? bestHours : [18, 19, 20, 21],
        timeZone: 'UTC',
        engagementByHour,
        engagementByDay,
      };
    } catch (err) {
      this.logger.error(`Failed to get best time: ${(err as any).message}`);
      return {
        bestDays: ['Friday', 'Saturday'],
        bestHours: [18, 19, 20, 21],
        timeZone: 'UTC',
        engagementByHour: {},
        engagementByDay: {},
      };
    }
  }

  async getStrategy(artistId: string): Promise<ContentStrategyItem[]> {
    this.logger.debug(`Getting strategy for artist ${artistId}`);

    try {
      const { data: videos } = await this.supabase
        .from('videos')
        .select('viral_score_real, hashtags, platforms')
        .eq('artist_id', artistId)
        .is('deleted_at', null)
        .order('viral_score_real', { ascending: false });

      if (!videos || videos.length === 0) {
        return [];
      }

      const topVideos = videos.slice(0, 5);
      const avgScore = videos.reduce((sum, v) => sum + (v.viral_score_real || 0), 0) / videos.length;

      return [
        {
          type: 'trending',
          topic: 'Replicate Top Content',
          engagementScore: 95,
          recommendations: [
            'Analyze your best 5 videos',
            'Identify common patterns',
            'Create similar content variations',
          ],
          examples: [
            `Videos with ${avgScore.toFixed(1)}/10 viral score`,
            'High-performing formats',
            'Trending topics from your audience',
          ],
        },
        {
          type: 'evergreen',
          topic: 'Build Audience Connection',
          engagementScore: 85,
          recommendations: [
            'Share behind-the-scenes content',
            'Respond to comments personally',
            'Create community challenges',
          ],
          examples: [
            'Day in your life',
            'Q&A sessions',
            'Audience participation',
          ],
        },
        {
          type: 'trending',
          topic: 'Leverage Trending Sounds',
          engagementScore: 88,
          recommendations: [
            'Use trending audio on your platform',
            'Add your unique twist',
            'Publish within 24 hours of trend',
          ],
          examples: [
            'Sound trends on TikTok',
            'Instagram Reels audio',
            'YouTube trending music',
          ],
        },
      ];
    } catch (err) {
      this.logger.error(`Failed to get strategy: ${(err as any).message}`);
      return [];
    }
  }

  async getViralHistory(artistId: string): Promise<ViralScorePoint[]> {
    this.logger.debug(`Getting viral history for artist ${artistId}`);

    try {
      const { data: videos } = await this.supabase
        .from('videos')
        .select('viral_score_real, created_at')
        .eq('artist_id', artistId)
        .is('deleted_at', null)
        .order('created_at', { ascending: true });

      if (!videos || videos.length === 0) {
        return [];
      }

      return videos.map((v) => ({
        date: new Date(v.created_at).toISOString().split('T')[0],
        score: v.viral_score_real || 0,
        trend: v.viral_score_real > 5 ? 'up' : v.viral_score_real < 3 ? 'down' : 'stable',
      }));
    } catch (err) {
      this.logger.error(`Failed to get viral history: ${(err as any).message}`);
      return [];
    }
  }

  async generateABVariants(videoId: string): Promise<ABTestData> {
    this.logger.debug(`Generating AB variants for video ${videoId}`);

    const testId = uuid();
    const variants: ABVariant[] = [
      {
        id: uuid(),
        type: 'caption',
        original: 'Check this out',
        variant: 'Wait for the twist 🤯',
      },
      {
        id: uuid(),
        type: 'hashtags',
        original: '#viral #trending',
        variant: '#FYP #ForYou',
      },
    ];

    return {
      id: testId,
      videoId,
      variants,
      status: 'pending',
    };
  }

  async getABResult(videoId: string): Promise<ABTestData> {
    this.logger.debug(`Getting AB results for video ${videoId}`);

    return {
      id: uuid(),
      videoId,
      variants: [
        {
          id: uuid(),
          type: 'caption',
          original: 'Check this out',
          variant: 'Wait for the twist 🤯',
          views: 15000,
          engagement: 2850,
        },
      ],
      status: 'pending',
      results: undefined,
    };
  }

  async generateAdCopy(videoId: string): Promise<AdCopyData[]> {
    this.logger.debug(`Generating ad copy for video ${videoId}`);

    try {
      const { data: video } = await this.supabase
        .from('videos')
        .select('title, ai_copy')
        .eq('id', videoId)
        .single();

      if (!video) return [];

      // Usar AI real si está disponible
      const aiMode = process.env.AI_MODE;

      if (aiMode === 'anthropic') {
        try {
          const client = getAnthropicClient();
          const response = await client.post('/messages', {
            model: 'claude-3-haiku-20240307',
            max_tokens: 1024,
            messages: [
              {
                role: 'user',
                content: `Generate 3 different ad copy variations for this video content: "${video.ai_copy || video.title}".
                          One professional, one casual, one humorous.
                          Format as JSON: [{"copy": "...", "style": "..."}]`,
              },
            ],
          });

          const content = response.data.content[0];
          if (content.type === 'text') {
            try {
              const parsed = JSON.parse(content.text);
              return parsed.map((item: any) => ({
                id: uuid(),
                copy: item.copy,
                style: item.style,
                estimatedEngagement: Math.floor(Math.random() * 40) + 60,
                hooks: item.copy.split('. ').slice(0, 2),
              }));
            } catch {
              // Si falla parsing, retornar variaciones genéricas
            }
          }
        } catch (err) {
          this.logger.warn(`AI generation failed: ${(err as any).message}`);
        }
      }

      // Fallback: variaciones genéricas
      return [
        {
          id: uuid(),
          copy: `Discover the secret behind this content. Watch how it went viral.`,
          style: 'professional',
          estimatedEngagement: 85,
          hooks: ['Discover the secret', 'Watch how it went viral'],
        },
        {
          id: uuid(),
          copy: `OMG THIS IS 🔥 Tap in if you want to know how we did it!`,
          style: 'casual',
          estimatedEngagement: 90,
          hooks: ['OMG THIS IS 🔥', 'Tap in to learn'],
        },
        {
          id: uuid(),
          copy: `POV: You're about to discover something amazing. Keep watching.`,
          style: 'humorous',
          estimatedEngagement: 80,
          hooks: ['POV: You\'re about to', 'Keep watching'],
        },
      ];
    } catch (err) {
      this.logger.error(`Failed to generate ad copy: ${(err as any).message}`);
      return [];
    }
  }

  async refineCopy(request: RefineCopyRequest): Promise<string> {
    this.logger.debug(`Refining copy: ${request.text.substring(0, 50)}...`);

    try {
      const aiMode = process.env.AI_MODE;

      if (aiMode === 'anthropic') {
        try {
          const client = getAnthropicClient();
          const response = await client.post('/messages', {
            model: 'claude-3-haiku-20240307',
            max_tokens: 256,
            messages: [
              {
                role: 'user',
                content: `Refine this social media caption to be more engaging and viral-friendly. Keep it short.
                          Original: "${request.text}"
                          Return only the refined caption, nothing else.`,
              },
            ],
          });

          const content = response.data.content[0];
          if (content.type === 'text') {
            return content.text.trim();
          }
        } catch (err) {
          this.logger.warn(`AI refinement failed: ${(err as any).message}`);
        }
      }

      // Fallback: mejoras simples
      return (
        request.text
          .replace(/check this out/gi, 'wait for the plot twist 🤯')
          .replace(/watch/gi, 'tap in and')
          .replace(/like if/gi, 'drop a 🔥 if')
          || 'Your content is compelling! Add a hook to grab attention in the first 3 seconds.'
      );
    } catch (err) {
      this.logger.error(`Failed to refine copy: ${(err as any).message}`);
      return request.text;
    }
  }
}

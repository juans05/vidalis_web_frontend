import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../../store/auth';
import { growthService } from '../../../services/growth';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Lightbulb, TrendingUp, BookOpen, Sparkles, AlertCircle, Zap } from 'lucide-react';

export function GrowthProPage(): JSX.Element {
  const user = useAuthStore((state) => state.user);
  const artistId = user?.artistId || user?.id || '';
  const [activeTab, setActiveTab] = useState<'insights' | 'besttime' | 'strategy' | 'viral'>(
    'insights'
  );

  const { data: insights, isLoading: insightsLoading } = useQuery({
    queryKey: ['insights', artistId],
    queryFn: () => growthService.getInsights(artistId),
    enabled: !!artistId,
  });

  const { data: bestTime, isLoading: bestTimeLoading } = useQuery({
    queryKey: ['besttime', artistId],
    queryFn: () => growthService.getBestTime(artistId),
    enabled: !!artistId,
  });

  const { data: strategy, isLoading: strategyLoading } = useQuery({
    queryKey: ['strategy', artistId],
    queryFn: () => growthService.getStrategy(artistId),
    enabled: !!artistId,
  });

  const { data: viralHistory, isLoading: viralLoading } = useQuery({
    queryKey: ['viral', artistId],
    queryFn: () => growthService.getViralHistory(artistId),
    enabled: !!artistId,
  });

  // Transformar data para gráfico de best time
  const bestTimeChartData = useMemo(() => {
    if (!bestTime) return [];
    return Object.entries(bestTime.engagementByHour).map(([hour, engagement]) => ({
      hour: `${hour}h`,
      engagement,
    }));
  }, [bestTime]);

  const isLoading = insightsLoading || bestTimeLoading || strategyLoading || viralLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <p className="text-text-secondary">Loading Growth Pro data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-text-primary mb-2">Growth Pro</h1>
          <p className="text-text-muted">AI-powered insights to scale your content</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 flex-wrap">
          {[
            { key: 'insights', label: 'Insights', icon: Lightbulb },
            { key: 'besttime', label: 'Best Time', icon: TrendingUp },
            { key: 'strategy', label: 'Strategy', icon: BookOpen },
            { key: 'viral', label: 'Viral Trends', icon: Sparkles },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                activeTab === key
                  ? 'bg-primary text-white'
                  : 'bg-bg-card hover:bg-bg-secondary text-text-secondary'
              }`}
            >
              <Icon size={20} />
              {label}
            </button>
          ))}
        </div>

        {/* Insights Tab */}
        {activeTab === 'insights' && (
          <div className="space-y-6">
            {insights?.map((insight) => (
              <div key={insight.id} className="bg-bg-card rounded-lg p-6 shadow-lg border border-bg-tertiary">
                <div className="flex items-start gap-4">
                  <div
                    className={`p-3 rounded-lg ${
                      insight.impact === 'high'
                        ? 'bg-red-500/20 text-red-400'
                        : insight.impact === 'medium'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-blue-500/20 text-blue-400'
                    }`}
                  >
                    <Zap size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-text-primary mb-2">{insight.title}</h3>
                    <p className="text-text-secondary mb-3">{insight.description}</p>
                    <p className="text-primary font-semibold mb-4">💡 {insight.recommendation}</p>
                    <div>
                      <p className="text-sm font-semibold text-text-muted mb-2">Action Items:</p>
                      <ul className="space-y-1">
                        {insight.actionItems.map((item, idx) => (
                          <li key={idx} className="text-sm text-text-secondary flex items-center gap-2">
                            <span className="text-primary">→</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Best Time Tab */}
        {activeTab === 'besttime' && bestTime && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-bg-card rounded-lg p-6 shadow-lg border border-bg-tertiary">
                <h2 className="text-xl font-bold text-text-primary mb-4">Best Days</h2>
                <div className="flex gap-2 flex-wrap">
                  {bestTime.bestDays.map((day) => (
                    <span key={day} className="px-4 py-2 bg-primary text-white rounded-full font-medium">
                      {day}
                    </span>
                  ))}
                </div>

                <h3 className="text-lg font-semibold text-text-primary mt-6 mb-4">Best Hours</h3>
                <div className="flex gap-2 flex-wrap">
                  {bestTime.bestHours.map((hour) => (
                    <span key={hour} className="px-3 py-1 bg-accent/20 text-accent rounded">
                      {hour}:00
                    </span>
                  ))}
                </div>

                <p className="text-text-muted text-sm mt-6">Timezone: {bestTime.timeZone}</p>
              </div>

              <div className="bg-bg-card rounded-lg p-6 shadow-lg border border-bg-tertiary">
                <h2 className="text-xl font-bold text-text-primary mb-4">Engagement by Day</h2>
                <div className="space-y-2">
                  {Object.entries(bestTime.engagementByDay).map(([day, engagement]) => (
                    <div key={day} className="flex items-center gap-2">
                      <span className="w-20 text-text-muted text-sm">{day}</span>
                      <div className="flex-1 bg-bg-secondary h-2 rounded overflow-hidden">
                        <div
                          className="bg-primary h-full"
                          style={{ width: `${(engagement / 12000) * 100}%` }}
                        />
                      </div>
                      <span className="text-text-secondary text-sm w-12 text-right">{(engagement / 1000).toFixed(1)}k</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-bg-card rounded-lg p-6 shadow-lg border border-bg-tertiary">
              <h2 className="text-xl font-bold text-text-primary mb-4">Hourly Engagement Pattern</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={bestTimeChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#52525B" />
                  <XAxis dataKey="hour" stroke="#A1A1A8" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#A1A1A8" style={{ fontSize: '12px' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#18181D', border: '1px solid #52525B' }} />
                  <Bar dataKey="engagement" fill="#9D4EDD" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Strategy Tab */}
        {activeTab === 'strategy' && (
          <div className="space-y-6">
            {strategy?.map((item) => (
              <div key={item.topic} className="bg-bg-card rounded-lg p-6 shadow-lg border border-bg-tertiary">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-text-primary">{item.topic}</h3>
                    <p className="text-text-muted text-sm mt-1">
                      Type: <span className="capitalize font-semibold">{item.type}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-primary">{item.engagementScore}</p>
                    <p className="text-text-muted text-sm">Engagement Score</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-text-primary mb-3">Recommendations</h4>
                    <ul className="space-y-2">
                      {item.recommendations.map((rec, idx) => (
                        <li key={idx} className="text-text-secondary text-sm flex items-start gap-2">
                          <span className="text-primary mt-1">✓</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-text-primary mb-3">Examples</h4>
                    <ul className="space-y-2">
                      {item.examples.map((example, idx) => (
                        <li key={idx} className="text-text-secondary text-sm flex items-start gap-2">
                          <span className="text-accent">→</span>
                          {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Viral Trends Tab */}
        {activeTab === 'viral' && viralHistory && (
          <div className="bg-bg-card rounded-lg p-6 shadow-lg border border-bg-tertiary">
            <h2 className="text-xl font-bold text-text-primary mb-6">Viral Score History</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={viralHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#52525B" />
                <XAxis dataKey="date" stroke="#A1A1A8" style={{ fontSize: '12px' }} />
                <YAxis stroke="#A1A1A8" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#18181D', border: '1px solid #52525B' }}
                  labelStyle={{ color: '#FAFAFA' }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#9D4EDD"
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-bg-secondary p-4 rounded-lg">
                <p className="text-text-muted text-sm mb-1">Average Score</p>
                <p className="text-2xl font-bold text-primary">
                  {(
                    viralHistory.reduce((sum, p) => sum + p.score, 0) / viralHistory.length
                  ).toFixed(1)}
                </p>
              </div>
              <div className="bg-bg-secondary p-4 rounded-lg">
                <p className="text-text-muted text-sm mb-1">Highest Score</p>
                <p className="text-2xl font-bold text-green-400">
                  {Math.max(...viralHistory.map((p) => p.score))}
                </p>
              </div>
              <div className="bg-bg-secondary p-4 rounded-lg">
                <p className="text-text-muted text-sm mb-1">Current Trend</p>
                <p className="text-2xl font-bold text-primary capitalize">
                  {viralHistory[viralHistory.length - 1]?.trend}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

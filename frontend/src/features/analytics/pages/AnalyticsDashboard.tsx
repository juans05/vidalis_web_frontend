import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../../store/auth';
import { analyticsService } from '../../../services/analytics';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ArrowUp, ArrowDown, TrendingUp, Eye, ThumbsUp, Share2, Bookmark } from 'lucide-react';
import { Loader } from 'lucide-react';

export function AnalyticsDashboard(): JSX.Element {
  const user = useAuthStore((state) => state.user);

  const { data: stats, isLoading } = useQuery({
    queryKey: ['stats', user?.id],
    queryFn: () => analyticsService.getStats(user?.id || ''),
    enabled: !!user?.id,
  });

  const COLORS = ['#9D4EDD', '#3A86FF', '#FB5607', '#06A77D', '#F77F00'];

  const StatCard = ({
    title,
    value,
    growth,
    icon: Icon,
  }: {
    title: string;
    value: number;
    growth?: number;
    icon: any;
  }) => (
    <div className="bg-bg-card rounded-lg p-6 shadow-lg border border-bg-tertiary">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-text-muted text-sm mb-1">{title}</p>
          <p className="text-3xl font-bold text-text-primary">
            {value.toLocaleString()}
          </p>
          {growth !== undefined && (
            <div className={`text-sm mt-2 flex items-center gap-1 ${growth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {growth >= 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
              {Math.abs(growth).toFixed(1)}%
            </div>
          )}
        </div>
        <div className="text-primary opacity-20">
          <Icon size={32} />
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <Loader className="animate-spin" size={40} />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-bg-primary p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-primary mb-8">Analytics</h1>
          <div className="bg-red-500/20 text-red-200 p-4 rounded-lg">
            Failed to load analytics data
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-primary mb-8">Analytics</h1>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Views"
            value={stats.totalViews}
            growth={stats.viewsGrowth}
            icon={Eye}
          />
          <StatCard
            title="Total Likes"
            value={stats.totalLikes}
            growth={undefined}
            icon={ThumbsUp}
          />
          <StatCard
            title="Total Shares"
            value={stats.totalShares}
            growth={undefined}
            icon={Share2}
          />
          <StatCard
            title="Total Saves"
            value={stats.totalSaves}
            growth={undefined}
            icon={Bookmark}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Follower Stats */}
          <div className="bg-bg-card rounded-lg p-6 shadow-lg border border-bg-tertiary">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-text-primary">Followers</h2>
              <div className={`text-sm ${stats.followersGrowth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {stats.followersGrowth >= 0 ? '+' : ''}{stats.followersGrowth.toFixed(1)}%
              </div>
            </div>
            <p className="text-3xl font-bold text-primary mb-2">
              {stats.totalFollowers.toLocaleString()}
            </p>
            <p className="text-text-muted text-sm">Total followers across platforms</p>
          </div>

          {/* Engagement Stats */}
          <div className="bg-bg-card rounded-lg p-6 shadow-lg border border-bg-tertiary">
            <h2 className="text-xl font-bold text-text-primary mb-6">Engagement</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Comments</span>
                <span className="font-bold">{stats.totalComments.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Avg. Viral Score</span>
                <span className="font-bold text-primary">{stats.avgViralScore.toFixed(1)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Published Videos</span>
                <span className="font-bold">{stats.publishedVideos}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Plan</span>
                <span className="font-bold capitalize">{stats.planName}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Growth Over Time */}
          <div className="bg-bg-card rounded-lg p-6 shadow-lg border border-bg-tertiary">
            <h2 className="text-xl font-bold text-text-primary mb-6">Growth Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.growthData}>
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
                  dataKey="views"
                  stroke="#9D4EDD"
                  dot={false}
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey="followers"
                  stroke="#3A86FF"
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Platform Breakdown */}
          <div className="bg-bg-card rounded-lg p-6 shadow-lg border border-bg-tertiary">
            <h2 className="text-xl font-bold text-text-primary mb-6">Platform Breakdown</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={Object.entries(stats.platformBreakdown).map(([name, value]) => ({
                    name: name.charAt(0).toUpperCase() + name.slice(1),
                    value,
                  }))}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${(value || 0).toLocaleString()}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {Object.entries(stats.platformBreakdown).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => (value as number).toLocaleString()} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Usage Info */}
        <div className="bg-bg-card rounded-lg p-6 shadow-lg border border-bg-tertiary">
          <h2 className="text-xl font-bold text-text-primary mb-4">Monthly Usage</h2>
          <div className="w-full bg-bg-secondary rounded-full h-2 overflow-hidden">
            <div
              className="bg-primary h-full transition-all"
              style={{ width: `${(stats.monthlyUsage / stats.monthlyLimit) * 100}%` }}
            />
          </div>
          <p className="text-text-muted text-sm mt-2">
            {stats.monthlyUsage} / {stats.monthlyLimit} credits used this month
          </p>
        </div>
      </div>
    </div>
  );
}

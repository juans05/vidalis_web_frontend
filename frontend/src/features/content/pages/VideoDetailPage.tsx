import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { contentService } from '../../../services/content';
import { ArrowLeft, Edit2, Check, X, AlertCircle } from 'lucide-react';

export function VideoDetailPage(): JSX.Element {
  const { videoId } = useParams<{ videoId: string }>();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    aiCopy: '',
    hashtags: '',
    platforms: [] as string[],
  });

  const { data: video, isLoading, error } = useQuery({
    queryKey: ['video', videoId],
    queryFn: () => contentService.getVideo(videoId!),
    enabled: !!videoId,
  });

  const { data: analytics } = useQuery({
    queryKey: ['analytics', videoId],
    queryFn: () => contentService.getAnalytics(videoId!),
    enabled: !!videoId && video?.status !== 'analyzing' && video?.status !== 'processing',
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => contentService.updateVideo(videoId!, data),
    onSuccess: (updated) => {
      setFormData({
        title: updated.title || '',
        aiCopy: updated.aiCopy || '',
        hashtags: updated.hashtags?.join(', ') || '',
        platforms: updated.platforms || [],
      });
      setEditing(false);
    },
  });

  const retryMutation = useMutation({
    mutationFn: () => contentService.retryVideo(videoId!),
  });

  useEffect(() => {
    if (video) {
      setFormData({
        title: video.title || '',
        aiCopy: video.aiCopy || '',
        hashtags: video.hashtags?.join(', ') || '',
        platforms: video.platforms || [],
      });
    }
  }, [video]);

  const handleSave = () => {
    updateMutation.mutate({
      title: formData.title,
      aiCopy: formData.aiCopy,
      hashtags: formData.hashtags.split(',').map((h) => h.trim()).filter(Boolean),
      platforms: formData.platforms,
    });
  };

  if (isLoading) return <div className="min-h-screen bg-bg-primary flex items-center justify-center">Loading...</div>;
  if (error || !video)
    return (
      <div className="min-h-screen bg-bg-primary p-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-primary hover:underline mb-8"
        >
          <ArrowLeft size={20} />
          Back
        </button>
        <div className="bg-red-500 bg-opacity-20 text-danger p-4 rounded-lg">
          Video not found or error loading
        </div>
      </div>
    );

  const statusColor: Record<string, string> = {
    analyzing: 'bg-yellow-500/20 text-yellow-200',
    processing: 'bg-blue-500/20 text-blue-200',
    ready: 'bg-green-500/20 text-green-200',
    published: 'bg-purple-500/20 text-purple-200',
    error: 'bg-red-500/20 text-red-200',
  };

  return (
    <div className="min-h-screen bg-bg-primary p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-primary hover:underline mb-8"
        >
          <ArrowLeft size={20} />
          Back to Gallery
        </button>

        {/* Status */}
        <div className="mb-6">
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${statusColor[video.status] || 'bg-gray-500/20'}`}>
            {video.status.toUpperCase()}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Preview */}
          <div className="lg:col-span-2">
            <div className="bg-bg-card rounded-lg overflow-hidden shadow-lg">
              {video.thumbnailUrl && (
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="w-full h-96 object-cover"
                />
              )}
              {video.cloudinaryUrl && (
                <div className="p-4 bg-bg-secondary">
                  <a
                    href={video.cloudinaryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-sm break-all"
                  >
                    Watch Full Video
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Metrics */}
          <div className="space-y-4">
            {video.viralScore && (
              <div className="bg-bg-card p-4 rounded-lg">
                <p className="text-text-muted text-sm mb-1">Viral Score</p>
                <p className="text-3xl font-bold text-primary">{video.viralScore}</p>
              </div>
            )}

            {analytics && (
              <>
                <div className="bg-bg-card p-4 rounded-lg">
                  <p className="text-text-muted text-sm mb-1">Views</p>
                  <p className="text-2xl font-bold">{analytics.views}</p>
                </div>
                <div className="bg-bg-card p-4 rounded-lg">
                  <p className="text-text-muted text-sm mb-1">Engagement Rate</p>
                  <p className="text-2xl font-bold">{analytics.engagementRate?.toFixed(1)}%</p>
                </div>
                <div className="bg-bg-card p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-text-muted">Likes</p>
                      <p className="font-bold">{analytics.likes}</p>
                    </div>
                    <div>
                      <p className="text-text-muted">Comments</p>
                      <p className="font-bold">{analytics.comments}</p>
                    </div>
                    <div>
                      <p className="text-text-muted">Shares</p>
                      <p className="font-bold">{analytics.shares}</p>
                    </div>
                    <div>
                      <p className="text-text-muted">Saves</p>
                      <p className="font-bold">{analytics.saves}</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Edit Form */}
        <div className="mt-8 bg-bg-card rounded-lg p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-text-primary">Details</h2>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-purple-600 text-white rounded transition"
              >
                <Edit2 size={16} />
                Edit
              </button>
            )}
          </div>

          {video.status === 'error' && video.errorMessage && (
            <div className="bg-red-500/20 text-red-200 p-4 rounded mb-6 flex items-start gap-2">
              <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Processing Error</p>
                <p className="text-sm">{video.errorMessage}</p>
                <button
                  onClick={() => retryMutation.mutate()}
                  disabled={retryMutation.isPending}
                  className="mt-2 px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded text-sm transition disabled:opacity-50"
                >
                  {retryMutation.isPending ? 'Retrying...' : 'Retry Processing'}
                </button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              {editing ? (
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 bg-bg-input border border-bg-tertiary rounded-lg focus:outline-none focus:border-primary"
                />
              ) : (
                <p className="text-text-secondary">{video.title || '(No title)'}</p>
              )}
            </div>

            {/* AI Copy */}
            <div>
              <label className="block text-sm font-medium mb-2">Description/Caption</label>
              {editing ? (
                <textarea
                  value={formData.aiCopy}
                  onChange={(e) => setFormData({ ...formData, aiCopy: e.target.value })}
                  className="w-full px-4 py-2 bg-bg-input border border-bg-tertiary rounded-lg focus:outline-none focus:border-primary h-24 resize-none"
                />
              ) : (
                <p className="text-text-secondary">{video.aiCopy || '(No caption)'}</p>
              )}
            </div>

            {/* Hook */}
            {video.hookSuggestion && (
              <div>
                <label className="block text-sm font-medium mb-2">Hook Suggestion</label>
                <p className="text-text-secondary italic">"{video.hookSuggestion}"</p>
              </div>
            )}

            {/* Hashtags */}
            <div>
              <label className="block text-sm font-medium mb-2">Hashtags</label>
              {editing ? (
                <input
                  type="text"
                  value={formData.hashtags}
                  onChange={(e) => setFormData({ ...formData, hashtags: e.target.value })}
                  placeholder="#tag1, #tag2, #tag3"
                  className="w-full px-4 py-2 bg-bg-input border border-bg-tertiary rounded-lg focus:outline-none focus:border-primary"
                />
              ) : (
                <div className="flex gap-2 flex-wrap">
                  {video.hashtags.length > 0 ? (
                    video.hashtags.map((tag) => (
                      <span key={tag} className="bg-bg-secondary px-3 py-1 rounded-full text-sm">
                        {tag}
                      </span>
                    ))
                  ) : (
                    <p className="text-text-muted">(No hashtags)</p>
                  )}
                </div>
              )}
            </div>

            {/* Platforms */}
            <div>
              <label className="block text-sm font-medium mb-2">Platforms</label>
              {editing ? (
                <div className="flex gap-2 flex-wrap">
                  {['tiktok', 'instagram', 'youtube', 'facebook'].map((p) => (
                    <label
                      key={p}
                      className="flex items-center gap-2 p-2 bg-bg-secondary rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.platforms.includes(p)}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            platforms: e.target.checked
                              ? [...formData.platforms, p]
                              : formData.platforms.filter((x) => x !== p),
                          })
                        }
                        className="w-4 h-4 accent-primary"
                      />
                      <span className="capitalize">{p}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="flex gap-2 flex-wrap">
                  {video.platforms.length > 0 ? (
                    video.platforms.map((p) => (
                      <span key={p} className="bg-bg-secondary px-3 py-1 rounded-full text-sm capitalize">
                        {p}
                      </span>
                    ))
                  ) : (
                    <p className="text-text-muted">(No platforms selected)</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Edit Actions */}
          {editing && (
            <div className="flex gap-2 mt-6">
              <button
                onClick={handleSave}
                disabled={updateMutation.isPending}
                className="flex items-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-200 rounded transition disabled:opacity-50"
              >
                <Check size={16} />
                Save Changes
              </button>
              <button
                onClick={() => setEditing(false)}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded transition"
              >
                <X size={16} />
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../../store/auth';
import { useContentStore } from '../../../store/content';
import { contentService } from '../../../services/content';
import { Play, Trash2, Loader } from 'lucide-react';
export function GalleryPage() {
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);
    const { videos, setVideos } = useContentStore();
    const [status, setStatus] = useState('');
    const [sort, setSort] = useState('newest');
    const { data, isLoading, error } = useQuery({
        queryKey: ['gallery', user?.artistId || user?.id, status, sort],
        queryFn: async () => {
            const artistId = user?.artistId || user?.id;
            if (!artistId)
                return null;
            return contentService.getGallery(artistId, { status, sort });
        },
    });
    useEffect(() => {
        if (data?.videos) {
            setVideos(data.videos);
        }
    }, [data, setVideos]);
    const handleDelete = async (videoId) => {
        if (!confirm('Are you sure you want to delete this video?'))
            return;
        try {
            await contentService.deleteVideo(videoId);
            setVideos(videos.filter((v) => v.id !== videoId));
        }
        catch (err) {
            console.error('Delete failed:', err);
        }
    };
    const getStatusColor = (status) => {
        const colors = {
            analyzing: 'bg-yellow-500/20 text-yellow-200',
            processing: 'bg-blue-500/20 text-blue-200',
            ready: 'bg-green-500/20 text-green-200',
            published: 'bg-purple-500/20 text-purple-200',
            scheduled: 'bg-orange-500/20 text-orange-200',
            error: 'bg-red-500/20 text-red-200',
        };
        return colors[status] || 'bg-gray-500/20 text-gray-200';
    };
    return (<div className="min-h-screen bg-bg-primary p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Gallery</h1>
          <button onClick={() => navigate('/content/upload')} className="px-6 py-2 bg-primary hover:bg-purple-600 text-white rounded-lg transition">
            New Upload
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-4 py-2 bg-bg-input border border-bg-tertiary rounded-lg focus:outline-none focus:border-primary">
              <option value="">All Status</option>
              <option value="analyzing">Analyzing</option>
              <option value="processing">Processing</option>
              <option value="ready">Ready</option>
              <option value="published">Published</option>
              <option value="error">Error</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Sort</label>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="w-full px-4 py-2 bg-bg-input border border-bg-tertiary rounded-lg focus:outline-none focus:border-primary">
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="viral_score">Viral Score</option>
            </select>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (<div className="flex items-center justify-center h-64">
            <Loader className="animate-spin" size={40}/>
          </div>)}

        {/* Error */}
        {error && (<div className="bg-red-500 bg-opacity-20 text-danger p-4 rounded-lg">
            Failed to load videos
          </div>)}

        {/* Gallery Grid */}
        {!isLoading && data && (<>
            {data.videos.length === 0 ? (<div className="text-center py-12">
                <p className="text-text-muted mb-4">No videos yet</p>
                <button onClick={() => navigate('/content/upload')} className="px-6 py-2 bg-primary hover:bg-purple-600 text-white rounded-lg transition">
                  Upload Your First Video
                </button>
              </div>) : (<>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data.videos.map((video) => (<div key={video.id} className="bg-bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition cursor-pointer group" onClick={() => navigate(`/content/${video.id}`)}>
                      {/* Thumbnail */}
                      <div className="relative h-40 bg-bg-secondary overflow-hidden">
                        {video.thumbnailUrl ? (<img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition"/>) : (<div className="w-full h-full flex items-center justify-center">
                            <Play size={48} className="text-text-muted"/>
                          </div>)}
                        <span className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(video.status)}`}>
                          {video.status}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="p-4">
                        <h3 className="font-semibold text-text-primary mb-2 truncate">
                          {video.title || 'Untitled'}
                        </h3>

                        <div className="space-y-2 mb-4">
                          {video.viralScore !== undefined && (<div className="flex justify-between items-center">
                              <span className="text-text-muted text-sm">Viral Score</span>
                              <span className="font-bold text-primary">{video.viralScore}</span>
                            </div>)}
                          <div className="text-text-muted text-sm">
                            {new Date(video.createdAt).toLocaleDateString()}
                          </div>
                        </div>

                        {/* Platforms */}
                        {video.platforms.length > 0 && (<div className="flex gap-1 mb-4 flex-wrap">
                            {video.platforms.map((p) => (<span key={p} className="text-xs bg-bg-secondary px-2 py-1 rounded capitalize">
                                {p}
                              </span>))}
                          </div>)}

                        {/* Actions */}
                        <button onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(video.id);
                    }} className="w-full px-3 py-2 bg-red-500/20 text-danger hover:bg-red-500/30 rounded transition flex items-center justify-center gap-2">
                          <Trash2 size={16}/>
                          Delete
                        </button>
                      </div>
                    </div>))}
                </div>

                {/* Pagination Info */}
                <div className="mt-8 text-center text-text-muted">
                  Showing {data.videos.length} of {data.total} videos
                </div>
              </>)}
          </>)}
      </div>
    </div>);
}
//# sourceMappingURL=GalleryPage.js.map
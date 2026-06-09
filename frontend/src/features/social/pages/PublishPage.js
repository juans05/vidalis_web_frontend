/**
 * Publish Video Page
 *
 * Página para publicar o programar videos en redes sociales
 */
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthStore } from '../../../store/auth';
import { publishVideo, scheduleVideo, getActivePlatforms } from '../../../services/social';
import * as ContentAPI from '../../../services/content';
import { AlertCircle, Loader, CheckCircle, Calendar, Send } from 'lucide-react';
const PLATFORM_COLORS = {
    tiktok: 'bg-black text-white',
    instagram: 'bg-gradient-to-r from-pink-500 to-purple-500 text-white',
    youtube: 'bg-red-600 text-white',
    facebook: 'bg-blue-600 text-white',
    linkedin: 'bg-blue-700 text-white',
};
export function PublishPage() {
    const { videoId } = useParams();
    const user = useAuthStore((s) => s.user);
    const [loading, setLoading] = useState(true);
    const [publishing, setPublishing] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [video, setVideo] = useState(null);
    const [activePlatforms, setActivePlatforms] = useState([]);
    const [selectedPlatforms, setSelectedPlatforms] = useState([]);
    const [publishMode, setPublishMode] = useState('now');
    const [scheduleDateTime, setScheduleDateTime] = useState('');
    const [postType, setPostType] = useState('REELS');
    useEffect(() => {
        const loadData = async () => {
            if (!videoId || !user?.artistId)
                return;
            try {
                // Cargar video
                const videoData = await ContentAPI.getVideo(videoId);
                setVideo(videoData);
                // Cargar plataformas activas
                const platforms = await getActivePlatforms(user.artistId);
                setActivePlatforms(platforms.platforms || []);
            }
            catch (err) {
                setError(err.message || 'Failed to load data');
            }
            finally {
                setLoading(false);
            }
        };
        loadData();
    }, [videoId, user?.artistId]);
    const handlePublish = async () => {
        if (!videoId || !user?.artistId) {
            setError('Missing required data');
            return;
        }
        if (selectedPlatforms.length === 0) {
            setError('Please select at least one platform');
            return;
        }
        if (publishMode === 'schedule' && !scheduleDateTime) {
            setError('Please select a date and time');
            return;
        }
        setPublishing(true);
        setError(null);
        setSuccess(false);
        try {
            if (publishMode === 'now') {
                await publishVideo(videoId, {
                    platforms: selectedPlatforms,
                    postType: postType,
                });
            }
            else {
                await scheduleVideo(videoId, {
                    platforms: selectedPlatforms,
                    scheduleDate: new Date(scheduleDateTime),
                    postType: postType,
                });
            }
            setSuccess(true);
            setSelectedPlatforms([]);
            setScheduleDateTime('');
            // Reload analytics after 2 seconds
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        }
        catch (err) {
            setError(err.response?.data?.error || err.message || 'Failed to publish');
        }
        finally {
            setPublishing(false);
        }
    };
    if (loading) {
        return (<div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex items-center gap-2 text-white">
          <Loader className="w-5 h-5 animate-spin"/>
          Loading...
        </div>
      </div>);
    }
    if (!video) {
        return (<div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4"/>
          <p className="text-white text-lg">Video not found</p>
        </div>
      </div>);
    }
    return (<div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Publish Video</h1>
          <p className="text-gray-400">{video.title}</p>
        </div>

        {/* Success Alert */}
        {success && (<div className="mb-8 bg-green-500/10 border border-green-500/50 rounded-lg p-4 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"/>
            <p className="text-green-200">
              {publishMode === 'now' ? 'Video published successfully!' : 'Video scheduled successfully!'}
            </p>
          </div>)}

        {/* Error Alert */}
        {error && (<div className="mb-8 bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"/>
            <p className="text-red-200">{error}</p>
          </div>)}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Preview */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Preview</h3>

              {video.cloudinary_url && (<div className="mb-6">
                  <video src={video.cloudinary_url} controls className="w-full rounded-lg bg-black"/>
                </div>)}

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400">Viral Score</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 bg-gray-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full" style={{ width: `${(video.viral_score || 0) * 10}%` }}/>
                    </div>
                    <span className="text-white font-bold">{video.viral_score || 0}/10</span>
                  </div>
                </div>

                {video.platforms?.length > 0 && (<div>
                    <p className="text-sm text-gray-400 mb-2">Already published on:</p>
                    <div className="flex flex-wrap gap-2">
                      {video.platforms.map((platform) => (<span key={platform} className={`px-2 py-1 rounded text-xs font-semibold ${PLATFORM_COLORS[platform] || 'bg-gray-700'}`}>
                          {platform}
                        </span>))}
                    </div>
                  </div>)}
              </div>
            </div>
          </div>

          {/* Publish Form */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8">
              <h3 className="text-2xl font-semibold text-white mb-8">Publish Settings</h3>

              {/* Publish Mode */}
              <div className="mb-8">
                <label className="block text-white font-semibold mb-4">Publish Mode</label>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => setPublishMode('now')} className={`p-4 rounded-lg border-2 transition-all ${publishMode === 'now'
            ? 'border-purple-500 bg-purple-500/10 text-white'
            : 'border-gray-600 bg-gray-700/30 text-gray-300 hover:border-gray-500'}`}>
                    <Send className="w-5 h-5 mx-auto mb-2"/>
                    Publish Now
                  </button>

                  <button onClick={() => setPublishMode('schedule')} className={`p-4 rounded-lg border-2 transition-all ${publishMode === 'schedule'
            ? 'border-blue-500 bg-blue-500/10 text-white'
            : 'border-gray-600 bg-gray-700/30 text-gray-300 hover:border-gray-500'}`}>
                    <Calendar className="w-5 h-5 mx-auto mb-2"/>
                    Schedule
                  </button>
                </div>
              </div>

              {/* Schedule DateTime (if schedule mode) */}
              {publishMode === 'schedule' && (<div className="mb-8">
                  <label className="block text-white font-semibold mb-2">Date and Time</label>
                  <input type="datetime-local" value={scheduleDateTime} onChange={(e) => setScheduleDateTime(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-purple-500 focus:outline-none"/>
                </div>)}

              {/* Post Type */}
              <div className="mb-8">
                <label className="block text-white font-semibold mb-4">Post Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {['REELS', 'STORIES', 'FEED', 'VIDEO'].map((type) => (<button key={type} onClick={() => setPostType(type)} className={`p-3 rounded-lg border-2 transition-all text-sm font-semibold ${postType === type
                ? 'border-purple-500 bg-purple-500/10 text-white'
                : 'border-gray-600 bg-gray-700/30 text-gray-300 hover:border-gray-500'}`}>
                      {type}
                    </button>))}
                </div>
              </div>

              {/* Platform Selection */}
              <div className="mb-8">
                <label className="block text-white font-semibold mb-4">Select Platforms</label>

                {activePlatforms.length === 0 ? (<div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-4 text-yellow-200">
                    No social networks connected. Please connect your accounts first.
                  </div>) : (<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {activePlatforms.map((platform) => (<button key={platform} onClick={() => setSelectedPlatforms((prev) => prev.includes(platform)
                    ? prev.filter((p) => p !== platform)
                    : [...prev, platform])} className={`p-3 rounded-lg border-2 transition-all font-semibold text-sm capitalize ${selectedPlatforms.includes(platform)
                    ? `border-white ${PLATFORM_COLORS[platform]}`
                    : 'border-gray-600 bg-gray-700/30 text-gray-300 hover:border-gray-500'}`}>
                        {platform}
                      </button>))}
                  </div>)}
              </div>

              {/* Publish Button */}
              <button onClick={handlePublish} disabled={publishing || selectedPlatforms.length === 0} className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2">
                {publishing ? (<>
                    <Loader className="w-5 h-5 animate-spin"/>
                    {publishMode === 'now' ? 'Publishing...' : 'Scheduling...'}
                  </>) : (<>
                    {publishMode === 'now' ? (<>
                        <Send className="w-5 h-5"/>
                        Publish Now
                      </>) : (<>
                        <Calendar className="w-5 h-5"/>
                        Schedule Publish
                      </>)}
                  </>)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>);
}
//# sourceMappingURL=PublishPage.js.map
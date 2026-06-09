import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/auth';
import { useContentStore } from '../../../store/content';
import { contentService } from '../../../services/content';
import { Upload, AlertCircle } from 'lucide-react';
export function UploadPage() {
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);
    const addVideo = useContentStore((state) => state.addVideo);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        sourceUrl: '',
        platforms: [],
    });
    const platforms = ['tiktok', 'instagram', 'youtube', 'facebook'];
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const handlePlatformChange = (platform) => {
        setFormData((prev) => ({
            ...prev,
            platforms: prev.platforms.includes(platform)
                ? prev.platforms.filter((p) => p !== platform)
                : [...prev.platforms, platform],
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (!formData.sourceUrl) {
                throw new Error('Video URL is required');
            }
            if (!user?.artistId && user?.accountType === 'artist') {
                throw new Error('Artist ID is required');
            }
            const result = await contentService.registerVideo(user?.artistId || user?.id || '', formData.sourceUrl, formData.title || undefined);
            addVideo(result);
            setFormData({ title: '', sourceUrl: '', platforms: [] });
            navigate(`/content/${result.id}`);
        }
        catch (err) {
            setError(err.message || 'Upload failed');
        }
        finally {
            setLoading(false);
        }
    };
    return (<div className="min-h-screen bg-bg-primary p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-primary mb-8">Upload Video</h1>

        {error && (<div className="bg-red-500 bg-opacity-20 text-danger p-4 rounded-lg mb-6 flex items-center gap-2">
            <AlertCircle size={20}/>
            {error}
          </div>)}

        <div className="bg-bg-card rounded-lg p-8 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-2">
                Video Title (Optional)
              </label>
              <input id="title" type="text" name="title" value={formData.title} onChange={handleChange} placeholder="My awesome video" className="w-full px-4 py-2 bg-bg-input border border-bg-tertiary rounded-lg focus:outline-none focus:border-primary"/>
            </div>

            {/* Video URL */}
            <div>
              <label htmlFor="sourceUrl" className="block text-sm font-medium mb-2">
                Video URL *
              </label>
              <input id="sourceUrl" type="url" name="sourceUrl" value={formData.sourceUrl} onChange={handleChange} placeholder="https://example.com/video.mp4" required className="w-full px-4 py-2 bg-bg-input border border-bg-tertiary rounded-lg focus:outline-none focus:border-primary"/>
              <p className="text-text-muted text-sm mt-1">
                URL to your video (uploaded to cloud storage)
              </p>
            </div>

            {/* Platforms */}
            <div>
              <label className="block text-sm font-medium mb-3">Publish to Platforms</label>
              <div className="grid grid-cols-2 gap-3">
                {platforms.map((platform) => (<label key={platform} className="flex items-center gap-2 p-3 bg-bg-secondary rounded-lg cursor-pointer hover:bg-bg-tertiary transition">
                    <input type="checkbox" checked={formData.platforms.includes(platform)} onChange={() => handlePlatformChange(platform)} className="w-4 h-4 accent-primary"/>
                    <span className="capitalize">{platform}</span>
                  </label>))}
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-purple-600 text-white font-medium py-3 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2">
              <Upload size={20}/>
              {loading ? 'Uploading...' : 'Upload & Process'}
            </button>
          </form>

          {/* Info Box */}
          <div className="mt-8 p-4 bg-bg-secondary rounded-lg">
            <h3 className="font-medium text-text-primary mb-2">What happens next?</h3>
            <ul className="text-text-secondary text-sm space-y-1">
              <li>✓ Video is uploaded and analyzed by AI</li>
              <li>✓ AI generates hook suggestions and copy</li>
              <li>✓ Viral score is calculated</li>
              <li>✓ You can edit and publish to selected platforms</li>
            </ul>
          </div>
        </div>
      </div>
    </div>);
}
//# sourceMappingURL=UploadPage.js.map
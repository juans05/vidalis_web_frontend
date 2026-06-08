/**
 * Connect Social Networks Page
 *
 * Página para conectar redes sociales del artista
 */

import React, { useState } from 'react';
import { useAuthStore } from '../../../store/auth';
import { getConnectUrl } from '../../../services/social';
import { AlertCircle, Loader } from 'lucide-react';

const PLATFORMS = [
  { id: 'tiktok', name: 'TikTok', icon: '🎵', color: 'from-black to-gray-800' },
  { id: 'instagram', name: 'Instagram', icon: '📸', color: 'from-pink-500 to-purple-500' },
  { id: 'youtube', name: 'YouTube', icon: '▶️', color: 'from-red-600 to-red-800' },
  { id: 'facebook', name: 'Facebook', icon: '👥', color: 'from-blue-600 to-blue-800' },
  { id: 'linkedin', name: 'LinkedIn', icon: '💼', color: 'from-blue-700 to-blue-900' },
];

export function ConnectSocialPage(): JSX.Element {
  const user = useAuthStore((s) => s.user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

  const handleConnect = async () => {
    if (!user?.artistId) {
      setError('Artist ID not found');
      return;
    }

    if (selectedPlatforms.length === 0) {
      setError('Please select at least one platform');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await getConnectUrl(user.artistId, selectedPlatforms);

      if (result.success && result.connectUrl) {
        // Redirect to Upload-Post connection page
        window.location.href = result.connectUrl;
      } else {
        setError('Failed to generate connection URL');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to connect');
    } finally {
      setLoading(false);
    }
  };

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId)
        ? prev.filter((p) => p !== platformId)
        : [...prev, platformId]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Connect Social Networks</h1>
          <p className="text-gray-400 text-lg">
            Connect your social media accounts to start publishing your content
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-8 bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {/* Platform Selection */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-white mb-6">Select Platforms</h2>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {PLATFORMS.map((platform) => (
              <button
                key={platform.id}
                onClick={() => togglePlatform(platform.id)}
                className={`p-6 rounded-lg transition-all ${
                  selectedPlatforms.includes(platform.id)
                    ? `bg-gradient-to-br ${platform.color} border-2 border-white shadow-lg scale-105`
                    : 'bg-gray-700/50 border-2 border-gray-600 hover:bg-gray-700'
                }`}
              >
                <div className="text-3xl mb-2">{platform.icon}</div>
                <div className="text-sm font-semibold text-white">{platform.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Summary */}
        {selectedPlatforms.length > 0 && (
          <div className="mb-8 bg-blue-500/10 border border-blue-500/50 rounded-lg p-4">
            <p className="text-blue-200">
              You've selected <span className="font-semibold">{selectedPlatforms.length}</span>{' '}
              platform{selectedPlatforms.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}

        {/* Connect Button */}
        <div className="flex gap-4">
          <button
            onClick={handleConnect}
            disabled={loading || selectedPlatforms.length === 0}
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Connecting...
              </>
            ) : (
              'Connect Accounts'
            )}
          </button>
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-gray-800/50 border border-gray-700 rounded-lg p-8">
          <h3 className="text-lg font-semibold text-white mb-4">How It Works</h3>
          <ol className="space-y-3 text-gray-300">
            <li className="flex gap-3">
              <span className="font-semibold text-purple-400 flex-shrink-0">1.</span>
              <span>Select the social networks you want to connect</span>
            </li>
            <li className="flex gap-3">
              <span className="font-semibold text-purple-400 flex-shrink-0">2.</span>
              <span>You'll be redirected to Upload-Post to authenticate</span>
            </li>
            <li className="flex gap-3">
              <span className="font-semibold text-purple-400 flex-shrink-0">3.</span>
              <span>Log in with your social media accounts</span>
            </li>
            <li className="flex gap-3">
              <span className="font-semibold text-purple-400 flex-shrink-0">4.</span>
              <span>Return to Vidalis and start publishing</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}

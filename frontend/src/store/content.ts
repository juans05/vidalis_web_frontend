import { create } from 'zustand';
import { Video } from '../services/content';

export interface ContentState {
  videos: Video[];
  selectedVideo: Video | null;
  loading: boolean;
  error: string | null;
  setVideos: (videos: Video[]) => void;
  addVideo: (video: Video) => void;
  setSelectedVideo: (video: Video | null) => void;
  updateVideo: (id: string, updates: Partial<Video>) => void;
  removeVideo: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useContentStore = create<ContentState>((set) => ({
  videos: [],
  selectedVideo: null,
  loading: false,
  error: null,

  setVideos: (videos) => set({ videos }),

  addVideo: (video) =>
    set((state) => ({
      videos: [video, ...state.videos],
    })),

  setSelectedVideo: (video) => set({ selectedVideo: video }),

  updateVideo: (id, updates) =>
    set((state) => ({
      videos: state.videos.map((v) => (v.id === id ? { ...v, ...updates } : v)),
      selectedVideo: state.selectedVideo?.id === id ? { ...state.selectedVideo, ...updates } : state.selectedVideo,
    })),

  removeVideo: (id) =>
    set((state) => ({
      videos: state.videos.filter((v) => v.id !== id),
      selectedVideo: state.selectedVideo?.id === id ? null : state.selectedVideo,
    })),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),
}));

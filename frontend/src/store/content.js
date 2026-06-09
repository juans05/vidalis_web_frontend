import { create } from 'zustand';
export const useContentStore = create((set) => ({
    videos: [],
    selectedVideo: null,
    loading: false,
    error: null,
    setVideos: (videos) => set({ videos }),
    addVideo: (video) => set((state) => ({
        videos: [video, ...state.videos],
    })),
    setSelectedVideo: (video) => set({ selectedVideo: video }),
    updateVideo: (id, updates) => set((state) => ({
        videos: state.videos.map((v) => (v.id === id ? { ...v, ...updates } : v)),
        selectedVideo: state.selectedVideo?.id === id ? { ...state.selectedVideo, ...updates } : state.selectedVideo,
    })),
    removeVideo: (id) => set((state) => ({
        videos: state.videos.filter((v) => v.id !== id),
        selectedVideo: state.selectedVideo?.id === id ? null : state.selectedVideo,
    })),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
}));
//# sourceMappingURL=content.js.map
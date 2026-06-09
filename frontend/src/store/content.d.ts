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
export declare const useContentStore: import("zustand").UseBoundStore<import("zustand").StoreApi<ContentState>>;
//# sourceMappingURL=content.d.ts.map
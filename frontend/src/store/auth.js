import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export const useAuthStore = create()(persist((set) => ({
    user: null,
    token: null,
    refreshToken: null,
    isAuthenticated: false,
    setAuth: (user, token, refreshToken) => set({
        user,
        token,
        refreshToken,
        isAuthenticated: true,
    }),
    setUser: (user) => set({ user }),
    clearAuth: () => set({
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
    }),
}), {
    name: 'auth-storage',
}));
//# sourceMappingURL=auth.js.map
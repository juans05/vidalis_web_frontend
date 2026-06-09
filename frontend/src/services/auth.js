import { api } from './api';
export const authService = {
    login: async (request) => {
        const response = await api.post('/vidalis/login', request);
        return response.data;
    },
    register: async (request) => {
        const response = await api.post('/vidalis/register', request);
        return response.data;
    },
    googleLogin: async (request) => {
        const response = await api.post('/vidalis/google-login', request);
        return response.data;
    },
    getUser: async (userId) => {
        const response = await api.get(`/vidalis/user/${userId}`);
        return response.data;
    },
    updateUser: async (userId, data) => {
        const response = await api.patch(`/vidalis/user/${userId}`, data);
        return response.data;
    },
    purchaseSparks: async (amount) => {
        const response = await api.post('/vidalis/purchase-sparks', { amount });
        return response.data;
    },
    redeemCoupon: async (code) => {
        const response = await api.post('/vidalis/redeem-coupon', { code });
        return response.data;
    },
    refreshToken: async (refreshToken) => {
        const response = await api.post('/vidalis/refresh-token', { refreshToken });
        return response.data;
    },
};
//# sourceMappingURL=auth.js.map
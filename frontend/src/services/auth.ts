import { api } from './api';
import { User } from '../store/auth';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  birthDate: string;
  accountType: 'artist' | 'agency';
}

export interface GoogleLoginRequest {
  idToken: string;
  platform: 'web' | 'mobile';
}

export interface TokenResponse {
  token: string;
  refreshToken: string;
  expiresIn: number;
  user: User;
}

export const authService = {
  login: async (request: LoginRequest): Promise<TokenResponse> => {
    const response = await api.post<TokenResponse>('/vidalis/login', request);
    return response.data;
  },

  register: async (request: RegisterRequest): Promise<TokenResponse> => {
    const response = await api.post<TokenResponse>('/vidalis/register', request);
    return response.data;
  },

  googleLogin: async (request: GoogleLoginRequest): Promise<TokenResponse> => {
    const response = await api.post<TokenResponse>('/vidalis/google-login', request);
    return response.data;
  },

  getUser: async (userId: string): Promise<User> => {
    const response = await api.get<User>(`/vidalis/user/${userId}`);
    return response.data;
  },

  updateUser: async (userId: string, data: Partial<User>): Promise<User> => {
    const response = await api.patch<User>(`/vidalis/user/${userId}`, data);
    return response.data;
  },

  purchaseSparks: async (amount: number): Promise<User> => {
    const response = await api.post<User>('/vidalis/purchase-sparks', { amount });
    return response.data;
  },

  redeemCoupon: async (code: string): Promise<any> => {
    const response = await api.post('/vidalis/redeem-coupon', { code });
    return response.data;
  },

  refreshToken: async (refreshToken: string): Promise<TokenResponse> => {
    const response = await api.post<TokenResponse>('/vidalis/refresh-token', { refreshToken });
    return response.data;
  },
};

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
  platform: 'web' | 'mobile' | 'ios' | 'android';
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface TokenResponse {
  token: string;
  refreshToken: string;
  expiresIn: number;
  user: UserResponse;
}

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  accountType: 'artist' | 'agency';
  artistId?: string;
  onboardingCompleted: boolean;
  plan: string;
  sparksBalance: number;
  createdAt: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  birthDate?: string;
}

export interface PurchaseSparkRequest {
  amount: number;
}

export interface RedeemCouponRequest {
  code: string;
}

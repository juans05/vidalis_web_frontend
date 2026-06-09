export interface User {
  id: string;
  email: string;
  name: string;
  password: string; // hashed
  accountType: 'artist' | 'agency';
  artistId?: string;
  plan: string; // 'mini', 'pro', 'enterprise'
  sparksBalance: number;
  birthDate?: string;
  onboardingCompleted: boolean;
  googleId?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface Session {
  id: string;
  userId: string;
  token: string;
  refreshToken: string;
  expiresAt: Date;
  revokedAt?: Date;
  createdAt: Date;
}

export interface Subscription {
  id: string;
  userId: string;
  plan: string; // 'mini', 'pro', 'enterprise'
  startDate: Date;
  endDate?: Date;
  status: 'active' | 'canceled' | 'expired';
  createdAt: Date;
  updatedAt: Date;
}

export interface SparksTransaction {
  id: string;
  userId: string;
  amount: number;
  type: 'purchase' | 'usage' | 'refund' | 'promotional';
  description: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'sparks' | 'plan_upgrade';
  value: number | string; // sparks amount o plan name
  expiresAt: Date;
  maxUses: number;
  currentUses: number;
  status: 'active' | 'expired' | 'used_up';
  createdAt: Date;
}

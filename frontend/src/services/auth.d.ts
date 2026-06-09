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
export declare const authService: {
    login: (request: LoginRequest) => Promise<TokenResponse>;
    register: (request: RegisterRequest) => Promise<TokenResponse>;
    googleLogin: (request: GoogleLoginRequest) => Promise<TokenResponse>;
    getUser: (userId: string) => Promise<User>;
    updateUser: (userId: string, data: Partial<User>) => Promise<User>;
    purchaseSparks: (amount: number) => Promise<User>;
    redeemCoupon: (code: string) => Promise<any>;
    refreshToken: (refreshToken: string) => Promise<TokenResponse>;
};
//# sourceMappingURL=auth.d.ts.map
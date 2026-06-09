import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { Logger } from '../../shared/logger';
import { AuthError, ValidationError, ConflictError, NotFoundError } from '../../shared/errors';
import {
  LoginRequest,
  RegisterRequest,
  GoogleLoginRequest,
  TokenResponse,
  UserResponse,
  UpdateUserRequest,
  PurchaseSparkRequest,
  RedeemCouponRequest,
} from './types';
import { User, Session, Subscription, SparksTransaction, Coupon } from './models';
import { getSupabaseClient } from '../../config/supabase';

export class AuthService {
  private logger = new Logger('AuthService');
  private supabase = getSupabaseClient();

  async login(request: LoginRequest): Promise<TokenResponse> {
    this.logger.debug(`Login attempt for ${request.email}`);

    // Validar input
    if (!request.email || !request.password) {
      throw new ValidationError('Email and password are required');
    }

    // Buscar usuario en Supabase
    const { data: user, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('email', request.email)
      .single();

    if (error || !user) {
      this.logger.warn(`Login failed for ${request.email}: user not found`);
      throw new AuthError('Invalid credentials');
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(request.password, user.password_hash);
    if (!isValidPassword) {
      this.logger.warn(`Login failed for ${request.email}: invalid password`);
      throw new AuthError('Invalid credentials');
    }

    return this.createSession(user);
  }

  async register(request: RegisterRequest): Promise<TokenResponse> {
    this.logger.debug(`Registration attempt for ${request.email}`);

    // Validar input
    if (!request.email || !request.password || !request.name) {
      throw new ValidationError('Name, email, and password are required');
    }

    // Verificar si usuario ya existe
    const { data: existing } = await this.supabase
      .from('users')
      .select('id')
      .eq('email', request.email)
      .single();

    if (existing) {
      throw new ConflictError('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(request.password, 10);

    // Crear usuario en Supabase
    const userId = uuid();
    const { data: newUser, error } = await this.supabase
      .from('users')
      .insert({
        id: userId,
        email: request.email,
        name: request.name,
        password_hash: hashedPassword,
        account_type: request.accountType || 'artist',
        plan: 'mini',
        sparks_balance: 0,
        birth_date: request.birthDate,
        onboarding_completed: false,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .select()
      .single();

    if (error) {
      this.logger.error(`Registration failed: ${error.message}`);
      throw new ValidationError(`Registration failed: ${error.message}`);
    }

    this.logger.info(`User registered: ${userId}`);
    return this.createSession(newUser);
  }

  async googleLogin(request: GoogleLoginRequest): Promise<TokenResponse> {
    this.logger.debug(`Google login attempt from ${request.platform}`);

    if (!request.idToken) {
      throw new ValidationError('idToken is required');
    }

    // Extraer email del idToken
    const email = this.extractEmailFromGoogleToken(request.idToken);

    // Buscar usuario existente
    let { data: user } = await this.supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (!user) {
      // Crear usuario automáticamente
      const userId = uuid();
      const { data: newUser, error } = await this.supabase
        .from('users')
        .insert({
          id: userId,
          email,
          name: email.split('@')[0],
          password_hash: '',
          account_type: 'artist',
          plan: 'mini',
          sparks_balance: 0,
          onboarding_completed: false,
          google_id: request.idToken,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .select()
        .single();

      if (error) {
        this.logger.error(`Google registration failed: ${error.message}`);
        throw new ValidationError(`Google registration failed: ${error.message}`);
      }

      this.logger.info(`User created via Google: ${userId}`);
      user = newUser;
    }

    return this.createSession(user);
  }

  async getUser(userId: string): Promise<UserResponse> {
    const { data: user, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !user) {
      throw new NotFoundError('User not found');
    }

    return this.userToResponse(user);
  }

  async updateUser(userId: string, request: UpdateUserRequest): Promise<UserResponse> {
    const updateData: any = {
      updated_at: new Date(),
    };

    if (request.name) updateData.name = request.name;
    if (request.email) updateData.email = request.email;
    if (request.birthDate) updateData.birth_date = request.birthDate;

    const { data: user, error } = await this.supabase
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();

    if (error || !user) {
      throw new NotFoundError('User not found');
    }

    this.logger.info(`User updated: ${userId}`);
    return this.userToResponse(user);
  }

  async purchaseSparks(userId: string, request: PurchaseSparkRequest): Promise<UserResponse> {
    if (request.amount <= 0) {
      throw new ValidationError('Amount must be greater than 0');
    }

    // Obtener usuario actual
    const { data: user, error: userError } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      throw new NotFoundError('User not found');
    }

    // Actualizar balance
    const newBalance = (user.sparks_balance || 0) + request.amount;
    const { data: updatedUser, error: updateError } = await this.supabase
      .from('users')
      .update({
        sparks_balance: newBalance,
        updated_at: new Date(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (updateError) {
      throw new ValidationError(`Failed to purchase sparks: ${updateError.message}`);
    }

    // Registrar transacción
    const transactionId = uuid();
    await this.supabase.from('sparks_transactions').insert({
      id: transactionId,
      user_id: userId,
      amount: request.amount,
      type: 'purchase',
      description: `Purchased ${request.amount} sparks`,
      status: 'completed',
      created_at: new Date(),
    });

    this.logger.info(`Sparks purchased: ${userId} - ${request.amount}`);
    return this.userToResponse(updatedUser);
  }

  async redeemCoupon(userId: string, request: RedeemCouponRequest): Promise<any> {
    // Obtener usuario
    const { data: user, error: userError } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      throw new NotFoundError('User not found');
    }

    // Obtener cupón (si existe tabla de cupones en BD)
    // Por ahora, retornar éxito simulado
    this.logger.warn(`Coupon redemption not fully implemented yet: ${request.code}`);

    return {
      success: true,
      message: `Coupon ${request.code} processing`,
      user: this.userToResponse(user),
    };
  }

  async refreshToken(token: string): Promise<TokenResponse> {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as any;

      const { data: user, error } = await this.supabase
        .from('users')
        .select('*')
        .eq('id', decoded.userId)
        .single();

      if (error || !user) {
        throw new AuthError('User not found');
      }

      return this.createSession(user);
    } catch {
      throw new AuthError('Invalid refresh token');
    }
  }

  private async createSession(user: any): Promise<TokenResponse> {
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        accountType: user.account_type,
        artistId: user.artist_id,
      },
      process.env.JWT_SECRET || 'default-secret-change-me',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'default-secret-change-me',
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '30d' }
    );

    return {
      token,
      refreshToken,
      expiresIn: 7 * 24 * 60 * 60, // 7 días en segundos
      user: this.userToResponse(user),
    };
  }

  private userToResponse(user: any): UserResponse {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      accountType: user.account_type,
      artistId: user.artist_id,
      onboardingCompleted: user.onboarding_completed,
      plan: user.plan,
      sparksBalance: user.sparks_balance || 0,
      createdAt: new Date(user.created_at).toISOString(),
    };
  }

  private extractEmailFromGoogleToken(token: string): string {
    try {
      const decoded = jwt.decode(token) as any;
      return decoded?.email || `user-${uuid()}@google.local`;
    } catch {
      return `user-${uuid()}@google.local`;
    }
  }
}

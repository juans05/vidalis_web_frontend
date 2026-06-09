/**
 * Supabase Client Configuration
 *
 * Cliente real para Supabase.co
 * Utiliza credenciales reales de producción
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { logger } from '../shared/logger';

let supabaseClient: SupabaseClient | null = null;

export function initSupabaseClient(): SupabaseClient {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY in environment variables');
  }

  supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: false,
    },
  });

  logger.info('✅ Supabase client initialized', { url: supabaseUrl });
  return supabaseClient;
}

export function getSupabaseClient(): SupabaseClient {
  if (!supabaseClient) {
    return initSupabaseClient();
  }
  return supabaseClient;
}

/**
 * Alias corto para uso en servicios
 */
export const supabase = getSupabaseClient;

export default getSupabaseClient();

/**
 * Upload-Post API Client Configuration
 *
 * Cliente HTTP para Upload-Post.com
 * Incluye autenticación y utilidades
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import { logger } from '../shared/logger';

const UPLOAD_POST_BASE_URL = 'https://api.upload-post.com/api';

let uploadPostClient: AxiosInstance | null = null;

export function initUploadPostClient(): AxiosInstance {
  const apiKey = process.env.UPLOAD_POST_API_KEY;

  if (!apiKey) {
    throw new Error('Missing UPLOAD_POST_API_KEY in environment variables');
  }

  uploadPostClient = axios.create({
    baseURL: UPLOAD_POST_BASE_URL,
    headers: {
      'Apikey': apiKey,
      'Content-Type': 'application/json',
    },
    timeout: 30000,
  });

  // Interceptor para logging
  uploadPostClient.interceptors.response.use(
    (response) => {
      logger.debug('📤 Upload-Post API Response', {
        status: response.status,
        method: response.config.method,
        url: response.config.url,
      });
      return response;
    },
    (error: AxiosError) => {
      logger.error('❌ Upload-Post API Error', {
        status: error.response?.status,
        method: error.config?.method,
        url: error.config?.url,
        message: error.message,
        data: error.response?.data,
      });
      throw error;
    }
  );

  logger.info('✅ Upload-Post client initialized');
  return uploadPostClient;
}

export function getUploadPostClient(): AxiosInstance {
  if (!uploadPostClient) {
    return initUploadPostClient();
  }
  return uploadPostClient;
}

/**
 * Alias para uso en servicios
 */
export const uploadPostApi = getUploadPostClient;

export default getUploadPostClient();

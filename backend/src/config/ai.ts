/**
 * AI Services Configuration
 *
 * Soporta Gemini, Anthropic (Claude) y Groq
 * Basado en AI_MODE en .env
 */

import axios, { AxiosInstance } from 'axios';
import { logger } from '../shared/logger';

export interface AIConfig {
  mode: 'gemini' | 'anthropic' | 'groq' | 'internal';
  apiKey: string;
}

let aiConfig: AIConfig | null = null;
let geminiClient: AxiosInstance | null = null;
let anthropicClient: AxiosInstance | null = null;
let groqClient: AxiosInstance | null = null;

export function initAIConfig(): AIConfig {
  const mode = (process.env.AI_MODE || 'internal') as AIConfig['mode'];
  let apiKey = '';

  switch (mode) {
    case 'gemini':
      apiKey = process.env.GEMINI_API_KEY || '';
      if (!apiKey) throw new Error('Missing GEMINI_API_KEY');
      geminiClient = axios.create({
        baseURL: 'https://generativelanguage.googleapis.com/v1beta',
        params: { key: apiKey },
      });
      break;

    case 'anthropic':
      apiKey = process.env.ANTHROPIC_API_KEY || '';
      if (!apiKey) throw new Error('Missing ANTHROPIC_API_KEY');
      anthropicClient = axios.create({
        baseURL: 'https://api.anthropic.com/v1',
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
      });
      break;

    case 'groq':
      apiKey = process.env.GROQ_API_KEY || '';
      if (!apiKey) throw new Error('Missing GROQ_API_KEY');
      groqClient = axios.create({
        baseURL: 'https://api.groq.com/openai/v1',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      });
      break;

    case 'internal':
      logger.info('⚙️ Using internal AI mode (mock)');
      break;

    default:
      throw new Error(`Unknown AI_MODE: ${mode}`);
  }

  aiConfig = { mode, apiKey };
  logger.info(`✅ AI Services initialized with mode: ${mode}`);
  return aiConfig;
}

export function getAIConfig(): AIConfig {
  if (!aiConfig) {
    return initAIConfig();
  }
  return aiConfig;
}

export function getGeminiClient(): AxiosInstance {
  if (!geminiClient) {
    initAIConfig();
  }
  if (!geminiClient) throw new Error('Gemini client not initialized');
  return geminiClient;
}

export function getAnthropicClient(): AxiosInstance {
  if (!anthropicClient) {
    initAIConfig();
  }
  if (!anthropicClient) throw new Error('Anthropic client not initialized');
  return anthropicClient;
}

export function getGroqClient(): AxiosInstance {
  if (!groqClient) {
    initAIConfig();
  }
  if (!groqClient) throw new Error('Groq client not initialized');
  return groqClient;
}

export default getAIConfig();

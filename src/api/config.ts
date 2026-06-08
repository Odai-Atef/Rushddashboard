/**
 * API Configuration
 * 
 * Centralized configuration for API requests based on environment variables.
 */
import { env } from '@/lib/env';

export const API_CONFIG = {
  BASE_URL: env.get('API_BASE_URL'),
  DEFAULT_TIMEOUT: env.get('API_TIMEOUT'),
  MAX_RETRIES: env.get('API_RETRY_ATTEMPTS'),
  RETRY_DELAY_MS: 1000,
} as const;

export const AUTH_CONFIG = {
  TOKEN_KEY: env.get('AUTH_TOKEN_KEY'),
  REFRESH_TOKEN_KEY: env.get('REFRESH_TOKEN_KEY'),
  TOKEN_EXPIRY_DAYS: env.get('TOKEN_EXPIRY_DAYS'),
} as const;

export const FEATURE_FLAGS = {
  ENABLE_AI_ANALYSIS: env.get('ENABLE_AI_ANALYSIS'),
  ENABLE_REAL_TIME_NOTIFICATIONS: env.get('ENABLE_REAL_TIME_NOTIFICATIONS'),
} as const;

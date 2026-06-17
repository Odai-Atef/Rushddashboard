/**
 * Environment Configuration Manager
 * 
 * Provides type-safe access to environment variables with validation and defaults.
 * Follows the Object-Oriented design pattern for configuration management.
 */

export interface EnvironmentConfig {
  // Application
  APP_NAME: string;
  APP_VERSION: string;
  APP_DESCRIPTION: string;
  
  // API
  API_BASE_URL: string;
  API_TIMEOUT: number;
  API_RETRY_ATTEMPTS: number;
  
  // Features
  ENABLE_AI_ANALYSIS: boolean;
  ENABLE_REAL_TIME_NOTIFICATIONS: boolean;
  ENABLE_DARK_MODE_BY_DEFAULT: boolean;
  
  // Auth
  AUTH_TOKEN_KEY: string;
  REFRESH_TOKEN_KEY: string;
  TOKEN_EXPIRY_DAYS: number;
  
  // App URL (used for constructing full links like activation/reset-password URLs)
  APP_URL: string;

  // Analytics
  ENABLE_ANALYTICS: boolean;
  ANALYTICS_TRACKING_ID: string;
  
  // Dev
  DEV_MOCK_API: boolean;
  DEV_DELAY_MS: number;
}

class EnvManager {
  private static instance: EnvManager;
  private config: EnvironmentConfig;

  private constructor() {
    this.config = this.loadConfig();
  }

  static getInstance(): EnvManager {
    if (!EnvManager.instance) {
      EnvManager.instance = new EnvManager();
    }
    return EnvManager.instance;
  }

  private getEnvVar(key: string, defaultValue?: string): string {
    const value = import.meta.env[key];
    if (value === undefined && defaultValue === undefined) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
    return value !== undefined ? (value as string) : defaultValue!;
  }

  private getEnvVarAsBool(key: string, defaultValue: boolean = false): boolean {
    const value = import.meta.env[key];
    if (value === undefined) return defaultValue;
    return value === 'true' || value === '1';
  }

  private getEnvVarAsNumber(key: string, defaultValue: number = 0): number {
    const value = import.meta.env[key];
    if (value === undefined) return defaultValue;
    const parsed = Number(value);
    if (isNaN(parsed)) {
      console.warn(`Environment variable ${key} is not a valid number. Using default: ${defaultValue}`);
      return defaultValue;
    }
    return parsed;
  }

  private loadConfig(): EnvironmentConfig {
    return {
      APP_NAME: this.getEnvVar('VITE_APP_NAME', 'منصة رشد'),
      APP_VERSION: this.getEnvVar('VITE_APP_VERSION', '1.0.0'),
      APP_DESCRIPTION: this.getEnvVar('VITE_APP_DESCRIPTION', ''),
      
      API_BASE_URL: this.getEnvVar('VITE_API_BASE_URL', 'http://localhost:3000/api'),
      API_TIMEOUT: this.getEnvVarAsNumber('VITE_API_TIMEOUT', 30000),
      API_RETRY_ATTEMPTS: this.getEnvVarAsNumber('VITE_API_RETRY_ATTEMPTS', 3),
      
      ENABLE_AI_ANALYSIS: this.getEnvVarAsBool('VITE_ENABLE_AI_ANALYSIS', false),
      ENABLE_REAL_TIME_NOTIFICATIONS: this.getEnvVarAsBool('VITE_ENABLE_REAL_TIME_NOTIFICATIONS', false),
      ENABLE_DARK_MODE_BY_DEFAULT: this.getEnvVarAsBool('VITE_ENABLE_DARK_MODE_BY_DEFAULT', true),
      
      AUTH_TOKEN_KEY: this.getEnvVar('VITE_AUTH_TOKEN_KEY', 'auth_token'),
      REFRESH_TOKEN_KEY: this.getEnvVar('VITE_REFRESH_TOKEN_KEY', 'refresh_token'),
      TOKEN_EXPIRY_DAYS: this.getEnvVarAsNumber('VITE_TOKEN_EXPIRY_DAYS', 7),
      
      ANALYTICS_TRACKING_ID: this.getEnvVar('VITE_ANALYTICS_TRACKING_ID', ''),
      
      APP_URL: this.getEnvVar('VITE_APP_URL', typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173'),
      
      DEV_MOCK_API: this.getEnvVarAsBool('VITE_DEV_MOCK_API', false),
      DEV_DELAY_MS: this.getEnvVarAsNumber('VITE_DEV_DELAY_MS', 0),
    };
  }

  getConfig(): Readonly<EnvironmentConfig> {
    return Object.freeze({ ...this.config });
  }

  get<K extends keyof EnvironmentConfig>(key: K): EnvironmentConfig[K] {
    return this.config[key];
  }

  isDevelopment(): boolean {
    return import.meta.env.DEV;
  }

  isProduction(): boolean {
    return import.meta.env.PROD;
  }
}

// Export singleton instance
export const env = EnvManager.getInstance();

// Legacy support: direct access without class
export const ENV = env.getConfig();

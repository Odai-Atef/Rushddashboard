/**
 * Base API Client
 * 
 * Provides an object-oriented, type-safe HTTP client with:
 * - Authentication interceptors
 * - Request/response interceptors
 * - Retry logic with exponential backoff
 * - Error handling with typed responses
 * - Abort signal support for cancellation
 */

import { ENV, env } from '@/lib/env';
import { 
  ApiResponse, 
  ApiError, 
  RequestConfig,
} from './types';
import { AUTH_CONFIG } from './config';

// Module-level flag to prevent concurrent 401 redirects
let isRedirecting = false;

class ApiClient {
  private _baseURL: string;
  private defaultTimeout: number;
  private maxRetries: number;
  private retryDelayMs: number;

  constructor(
    baseURL: string = ENV.API_BASE_URL,
    defaultTimeout: number = ENV.API_TIMEOUT,
    maxRetries: number = ENV.API_RETRY_ATTEMPTS
  ) {
    this._baseURL = baseURL.replace(/\/$/, ''); // Remove trailing slash
    this.defaultTimeout = defaultTimeout;
    this.maxRetries = maxRetries;
    this.retryDelayMs = 1000;
  }

  /**
   * Handle 401 Unauthorized by clearing tokens and redirecting to login page
   */
  private handleUnauthorized(): void {
    if (isRedirecting) {
      return;
    }

    // Avoid redirect loop if already on login page
    if (window.location.pathname === '/auth/login') {
      return;
    }

    isRedirecting = true;
    this.clearAuthToken();

    const currentPath = window.location.pathname + window.location.search;
    const redirectUrl = `/auth/login?expired=true&redirect=${encodeURIComponent(currentPath)}`;
    window.location.href = redirectUrl;
  }

  /**
   * Expose base URL for external URL construction (e.g., EventSource SSE streams)
   */
  get defaults() {
    return {
      baseURL: this._baseURL,
      timeout: this.defaultTimeout,
    };
  }

  /**
   * Get the authentication token from storage
   */
  private getAuthToken(): string | null {
    return localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
  }

  /**
   * Build request headers with auth token when available
   */
  private buildHeaders(customHeaders?: Record<string, string>): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-App-Version': ENV.APP_VERSION,
      ...customHeaders,
    };

    const token = this.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Build URL with query parameters
   */
  private buildURL(
    endpoint: string, 
    params?: Record<string, string | number | boolean | undefined>
  ): string {
    const url = new URL(`${this._baseURL}${endpoint}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  /**
   * Execute a request with retries and timeout
   */
  private async executeRequest<T>(
    endpoint: string,
    options: RequestInit,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    const url = this.buildURL(endpoint, config?.params);
    const timeout = config?.timeout || this.defaultTimeout;
    
    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    // Use provided signal or create one
    const signal = config?.signal || controller.signal;

    // If custom signal exists, handle it properly
    let abortHandler: (() => void) | undefined;
    if (config?.signal) {
      abortHandler = () => controller.abort();
      config.signal.addEventListener('abort', abortHandler);
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers: this.buildHeaders(config?.headers),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      if (abortHandler && config?.signal) {
        config.signal.removeEventListener('abort', abortHandler);
      }

      // Handle HTTP errors
      if (!response.ok) {
        const error = await this.parseError(response);
        throw error;
      }

      // Parse JSON response
      const data = await response.json() as T;
      
      return {
        success: true,
        data,
        message: 'Success',
        meta: (data as Record<string, unknown>)?.meta,
      };
    } catch (error) {
      clearTimeout(timeoutId);
      if (abortHandler && config?.signal) {
        config.signal.removeEventListener('abort', abortHandler);
      }

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw {
            code: 'TIMEOUT',
            message: 'Request timed out. Please try again.',
            statusCode: 408,
          } as ApiError;
        }
      }
      
      throw error;
    }
  }

  /**
   * Make a request with retry logic
   */
  private async requestWithRetry<T>(
    endpoint: string,
    options: RequestInit,
    config?: RequestConfig,
    attempt: number = 1
  ): Promise<ApiResponse<T>> {
    try {
      return await this.executeRequest<T>(endpoint, options, config);
    } catch (error) {
      const apiError = error as ApiError;
      
      // Handle 401 Unauthorized: clear tokens and redirect to login
      if (apiError.statusCode === 401 && !config?.skipAuthRedirect) {
        this.handleUnauthorized();
      }
      
      // Don't retry client errors (4xx) or if max retries reached
      if (apiError.statusCode && apiError.statusCode >= 400 && apiError.statusCode < 500) {
        throw error;
      }
      
      if (attempt >= this.maxRetries) {
        throw error;
      }

      // Exponential backoff
      const delay = this.retryDelayMs * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
      
      return this.requestWithRetry<T>(endpoint, options, config, attempt + 1);
    }
  }

  /**
   * Parse error response from API
   */
  private async parseError(response: Response): Promise<ApiError> {
    try {
      const data = await response.json();
      return {
        code: data.code || 'UNKNOWN_ERROR',
        message: data.message || `HTTP Error ${response.status}`,
        details: data.details,
        errors: data.errors,
        statusCode: response.status,
      };
    } catch {
      return {
        code: 'HTTP_ERROR',
        message: `Request failed with status ${response.status}`,
        statusCode: response.status,
      };
    }
  }

  /**
   * HTTP GET request
   */
  async get<T = unknown>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.requestWithRetry<T>(endpoint, { method: 'GET' }, config);
  }

  /**
   * HTTP POST request
   */
  async post<T = unknown>(
    endpoint: string, 
    body: unknown, 
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.requestWithRetry<T>(
      endpoint, 
      { method: 'POST', body: JSON.stringify(body) }, 
      config
    );
  }

  /**
   * HTTP PUT request
   */
  async put<T = unknown>(
    endpoint: string, 
    body: unknown, 
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.requestWithRetry<T>(
      endpoint, 
      { method: 'PUT', body: JSON.stringify(body) }, 
      config
    );
  }

  /**
   * HTTP PATCH request
   */
  async patch<T = unknown>(
    endpoint: string, 
    body: unknown, 
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.requestWithRetry<T>(
      endpoint, 
      { method: 'PATCH', body: JSON.stringify(body) }, 
      config
    );
  }

  /**
   * HTTP DELETE request
   */
  async delete<T = unknown>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.requestWithRetry<T>(endpoint, { method: 'DELETE' }, config);
  }

  /**
   * Update the auth token in localStorage
   */
  setAuthToken(token: string): void {
    localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, token);
  }

  /**
   * Clear the auth token
   */
  clearAuthToken(): void {
    localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
    localStorage.removeItem(AUTH_CONFIG.REFRESH_TOKEN_KEY);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }
}

// Export singleton instance
const apiClient = new ApiClient();
export default apiClient;

// Export class for creating custom instances if needed
export { ApiClient };

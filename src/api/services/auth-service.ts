/**
 * Authentication Service
 * 
 * Handles all authentication-related API operations.
 * 
 * @example
 * const authService = new AuthService();
 * const result = await authService.login({ email, password });
 * 
 * // Using singleton instance
 * import { authService } from '@/api/services/auth-service';
 * authService.logout();
 */

import apiClient from '../client';
import { ApiResponse, ApiError } from '../types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  companyName: string;
  roleSlug: string;
  phone: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  phone?: string | null;
  jobTitle?: string | null;
  avatarUrl?: string | null;
  preferredLanguage?: string | null;
  timezone?: string | null;
  status?: string;
  role?: string | null;
  company?: string | null;
  lastLoginAt?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export class AuthService {
  private baseEndpoint = '/api/v1/auth';

  /**
   * Normalize a backend response that may be double-wrapped.
   *
   * The backend returns `{ success: true, data: T, message: '...' }`,
   * but `apiClient` already wraps again into `{ data: BackendResponse }`.
   * This helper unwraps the nested payload so callers receive the real `T`.
   */
  private unwrap<T>(response: ApiResponse<any>): ApiResponse<T> {
    const raw = response.data;
    const isWrapped =
      raw && typeof raw === 'object' && 'data' in raw;

    const payload: T = isWrapped ? (raw.data as T) : (raw as T);
    const backendSuccess = isWrapped ? (raw.success ?? true) : true;

    return {
      success: response.success && backendSuccess,
      data: payload,
      message:
        isWrapped && raw.message !== undefined
          ? String(raw.message)
          : response.message,
      meta: response.meta,
    };
  }

  /**
   * Authenticate user with credentials
   */
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthTokens>> {
    const response = await apiClient.post<AuthTokens>(
      `${this.baseEndpoint}/login`,
      credentials
    );

    const unwrapped = this.unwrap<AuthTokens>(response);
    if (unwrapped.success && unwrapped.data.accessToken) {
      apiClient.setAuthToken(unwrapped.data.accessToken);
    }

    return unwrapped;
  }



  /**
   * Logout user and clear tokens
   */
  async logout(): Promise<ApiResponse<void>> {
    try {
      await apiClient.post(`${this.baseEndpoint}/logout`, {});
    } finally {
      apiClient.clearAuthToken();
    }

    return { success: true, data: undefined };
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<ApiResponse<AuthTokens>> {
    const response = await apiClient.post<AuthTokens>(
      `${this.baseEndpoint}/refresh`,
      { refreshToken }
    );

    const unwrapped = this.unwrap<AuthTokens>(response);
    if (unwrapped.success && unwrapped.data.accessToken) {
      apiClient.setAuthToken(unwrapped.data.accessToken);
    }

    return unwrapped;
  }

  /**
   * Get current user profile.
   *
   * The endpoint may return the profile either:
   * - wrapped in an envelope (`{ data: UserProfile, ... }`), or
   * - as a plain JSON object (`UserProfile`).
   *
   * This method normalizes both shapes to `ApiResponse<UserProfile>`.
   */
  async getProfile(): Promise<ApiResponse<UserProfile>> {
    const response = await apiClient.get<any>(`${this.baseEndpoint}/me`);
    return this.unwrap<UserProfile>(response);
  }

  /**
   * Update user profile
   */
  async updateProfile(data: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> {
    return apiClient.patch<UserProfile>(`${this.baseEndpoint}/profile`, data);
  }

  /**
   * Request password reset
   */
  async forgotPassword(email: string): Promise<ApiResponse<void>> {
    const { ENV } = await import('@/lib/env');
    return apiClient.post(`${this.baseEndpoint}/forgot-password`, {
      email,
      clientUrl: ENV.APP_URL,
    });
  }

  /**
   * Register a new user and request activation email.
   */
  async register(data: RegisterData): Promise<ApiResponse<AuthTokens>> {
    const response = await apiClient.post<AuthTokens>(
      `${this.baseEndpoint}/register`,
      data
    );

    const unwrapped = this.unwrap<AuthTokens>(response);
    if (unwrapped.success && unwrapped.data.accessToken) {
      apiClient.setAuthToken(unwrapped.data.accessToken);
    }

    return unwrapped;
  }

  /**
   * Activate a newly registered account using an email activation token.
   */
  async activateAccount(token: string): Promise<ApiResponse<{ message?: string }>> {
    return apiClient.get<{ message?: string }>(
      `${this.baseEndpoint}/activate`,
      { params: { token }, skipAuthRedirect: true }
    );
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return apiClient.isAuthenticated();
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;

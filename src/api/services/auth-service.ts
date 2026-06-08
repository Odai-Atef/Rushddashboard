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
  fullName: string;
  company?: string;
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
   * Authenticate user with credentials
   */
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthTokens>> {
    const response = await apiClient.post<AuthTokens>(
      `${this.baseEndpoint}/login`,
      credentials
    );

    if (response.success && response.data.accessToken) {
      apiClient.setAuthToken(response.data.accessToken);
    }

    return response;
  }

  /**
   * Register a new user
   */
  async register(data: RegisterData): Promise<ApiResponse<AuthTokens>> {
    const response = await apiClient.post<AuthTokens>(
      `${this.baseEndpoint}/register`,
      data
    );

    if (response.success && response.data.accessToken) {
      apiClient.setAuthToken(response.data.accessToken);
    }

    return response;
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

    if (response.success && response.data.accessToken) {
      apiClient.setAuthToken(response.data.accessToken);
    }

    return response;
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
    const raw = response.data;

    // Detect wrapped envelope (common NestJS / standard API pattern)
    const profile: UserProfile =
      raw && typeof raw === 'object' && 'data' in raw && raw.data !== undefined
        ? (raw.data as UserProfile)
        : (raw as UserProfile);

    return {
      success: response.success,
      data: profile,
      message: response.message,
      meta: response.meta,
    };
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
    return apiClient.post(`${this.baseEndpoint}/forgot-password`, { email });
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<ApiResponse<void>> {
    return apiClient.post(`${this.baseEndpoint}/reset-password`, { token, newPassword });
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

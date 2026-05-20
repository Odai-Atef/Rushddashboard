import type { LoginRequest, RegisterRequest, AuthResponse, BackendValidationErrorResponse } from '../types/auth';
import { getRefreshToken, setTokens, clearTokens, setUser } from '../utils/auth';
import { parseFieldErrors, groupFieldErrors } from '../utils/fieldErrorMap';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

class AuthError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code: string,
    public fieldErrors?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));

    // Handle 400 Bad Request with array-style validation messages
    if (response.status === 400 && Array.isArray(error.message) && error.message.length > 0) {
      const { parsed, unmapped } = parseFieldErrors(error as BackendValidationErrorResponse);
      const fieldErrors = groupFieldErrors(parsed);
      const bannerMessage = (error.message as string[]).join('; ');

      throw new AuthError(
        bannerMessage,
        response.status,
        error.error || 'VALIDATION_ERROR',
        Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined
      );
    }

    throw new AuthError(
      error.message || 'حدث خطأ غير متوقع',
      response.status,
      error.error || 'UNKNOWN_ERROR'
    );
  }
  return response.json();
}

export async function login(credentials: LoginRequest): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  const data = await handleResponse<AuthResponse>(response);
  setTokens(data);
  setUser(data.user);
  return data;
}

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const result = await handleResponse<AuthResponse>(response);
  setTokens(result);
  setUser(result.user);
  return result;
}

export async function refreshToken(): Promise<AuthResponse> {
  const refresh = getRefreshToken();
  if (!refresh) {
    throw new AuthError('No refresh token available', 401, 'NO_REFRESH_TOKEN');
  }

  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken: refresh }),
  });

  const data = await handleResponse<AuthResponse>(response);
  setTokens(data);
  return data;
}

export function logout(): void {
  clearTokens();
}

export { AuthError };

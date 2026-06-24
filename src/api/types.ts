/**
 * Base API Types
 * 
 * Shared types used across all API service classes.
 */

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  meta?: PaginationMeta | Record<string, unknown>;
}

export interface PaginationMeta {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
  errors?: Array<{ field?: string; message?: string; value?: unknown }> | Record<string, string[]>;
  statusCode: number;
}

export interface RequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | undefined>;
  timeout?: number;
  signal?: AbortSignal;
  skipAuthRedirect?: boolean;
  responseType?: 'json' | 'blob' | 'text';
}

export type UploadProgressCallback = (progress: { loaded: number; total: number; percentage: number }) => void;

export interface UploadConfig extends RequestConfig {
  onProgress?: UploadProgressCallback;
}

export interface PaginatedRequest {
  page?: number;
  perPage?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

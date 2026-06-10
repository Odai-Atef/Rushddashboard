/**
 * Analysis Service
 *
 * Encapsulates all AI analysis–related API operations, including the endpoint
 * that returns the list of analysis categories used to populate the category
 * filter buttons inside the analysis library modal.
 *
 * @example
 * import { analysisService } from '@/api/services';
 * const { data } = await analysisService.getCategories();
 */

import apiClient from '../client';
import { ApiResponse } from '../types';

/** Represents a single analysis category returned by the backend. */
export interface Category {
  id: string;
  key: string;
  name: string;
  nameAr: string | null;
  description: string | null;
  descriptionAr: string | null;
  icon: string | null;
  sortOrder: number;
  count: number;
}

/** Represents a single analysis library item returned by the backend. */
export interface AnalysisLibraryItem {
  id: string;
  categoryId: string;
  key: string;
  title: string;
  titleAr: string | null;
  description: string | null;
  descriptionAr: string | null;
  complexity: string;
  impact: string;
  duration: string;
  badges: string[];
  sortOrder: number;
  isActive: boolean;
  icon: string;
  iconBackground: string;
}

export class AnalysisService {
  private baseEndpoint = '/api/v1/analysis';

  /**
   * Fetch all available analysis categories from the backend.
   */
  async getCategories(): Promise<ApiResponse<Category[]>> {
    return apiClient.get<Category[]>(`${this.baseEndpoint}/categories`);
  }

  /**
   * Fetch active analysis library items for a specific category.
   */
  async getLibraryItems(categoryId: string): Promise<ApiResponse<AnalysisLibraryItem[]>> {
    return apiClient.get<AnalysisLibraryItem[]>(
      `${this.baseEndpoint}/categories/${categoryId}/library-items`
    );
  }

  /**
   * Fetch all active analysis library items across all categories.
   */
  async getAllLibraryItems(): Promise<ApiResponse<AnalysisLibraryItem[]>> {
    return apiClient.get<AnalysisLibraryItem[]>(
      `${this.baseEndpoint}/categories/library-items`
    );
  }

  /**
   * Trigger a streaming AI analysis run.
   * Returns sessionId to connect to SSE stream.
   */
  async triggerStreamingRun(
    analysisItemId: string,
    filters?: Record<string, any>
  ): Promise<ApiResponse<{ analysisRunId: string; sessionId: string; status: string; isNew: boolean }>> {
    return apiClient.post(`${this.baseEndpoint}/streaming-run`, {
      analysisItemId,
      filters,
    });
  }

  /**
   * Connect to SSE stream for AI tokens.
   * Returns an EventSource instance - caller must handle onmessage/onerror.
   */
  connectToStream(sessionId: string): EventSource {
    const token = localStorage.getItem('access_token') || '';
    // Pass token as query param since EventSource doesn't support headers
    return new EventSource(
      `${apiClient.defaults.baseURL}${this.baseEndpoint}/stream/${sessionId}?token=${encodeURIComponent(token)}`
    );
  }

  /**
   * Ask a follow-up question about the analysis results.
   */
  async askFollowUp(
    question: string,
    sessionId?: string
  ): Promise<ApiResponse<{ answer: string; sql?: string; data?: any[]; fallback?: boolean }>> {
    return apiClient.post(`${this.baseEndpoint}/follow-up`, {
      question,
      sessionId,
    });
  }

  /**
   * Fetch paginated analysis history.
   */
  async getHistory(
    page: number = 1,
    limit: number = 20
  ): Promise<ApiResponse<{
    data: Array<{
      id: string;
      title: string;
      summary: string | null;
      status: 'COMPLETED' | 'RUNNING' | 'FAILED' | 'PENDING';
      durationMs: number | null;
      startedAt: string;
      completedAt: string | null;
      insightsCount: number | null;
      recommendationsCount: number | null;
    }>;
    meta: {
      page: number;
      limit: number;
      total: number;
      hasMore: boolean;
    };
  }>> {
    return apiClient.get(`${this.baseEndpoint}/history`, {
      params: { page, limit },
    });
  }

  /**
   * Fetch full detail for a specific analysis run.
   */
  async getRunDetail(runId: string): Promise<ApiResponse<{
    id: string;
    title: string;
    status: 'COMPLETED' | 'RUNNING' | 'FAILED' | 'PENDING';
    insights: Array<{
      id: string;
      title: string;
      content: string;
      type: string | null;
    }>;
    results: Array<{
      id: string;
      insightText: string;
      dimensionData: Record<string, any> | null;
      recommendationText: string | null;
    }>;
  }>> {
    return apiClient.get(`${this.baseEndpoint}/history/${runId}`);
  }
}

// Export singleton instance
export const analysisService = new AnalysisService();
export default analysisService;

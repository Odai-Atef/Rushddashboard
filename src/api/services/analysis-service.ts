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
  nameAr: Record<string, unknown> | null;
  description: Record<string, unknown> | null;
  descriptionAr: Record<string, unknown> | null;
  icon: Record<string, unknown> | null;
  sortOrder: number;
  count: number;
}

export class AnalysisService {
  private baseEndpoint = '/api/v1/analysis';

  /**
   * Fetch all available analysis categories from the backend.
   *
   * Categories are sorted by `sortOrder` ascending by the caller (UI layer)
   * after receiving the raw response.
   *
   * @returns A typed `ApiResponse` wrapping an array of `Category` objects.
   */
  async getCategories(): Promise<ApiResponse<Category[]>> {
    return apiClient.get<Category[]>(`${this.baseEndpoint}/categories`);
  }
}

// Export singleton instance
export const analysisService = new AnalysisService();
export default analysisService;

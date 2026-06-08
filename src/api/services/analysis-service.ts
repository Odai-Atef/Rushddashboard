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
   *
   * Categories are sorted by `sortOrder` ascending by the caller (UI layer)
   * after receiving the raw response.
   *
   * @returns A typed `ApiResponse` wrapping an array of `Category` objects.
   */
  async getCategories(): Promise<ApiResponse<Category[]>> {
    return apiClient.get<Category[]>(`${this.baseEndpoint}/categories`);
  }

  /**
   * Fetch active analysis library items for a specific category.
   *
   * @param categoryId - The backend UUID of the selected category.
   * @returns A typed `ApiResponse` wrapping an array of `AnalysisLibraryItem` objects.
   */
  async getLibraryItems(categoryId: string): Promise<ApiResponse<AnalysisLibraryItem[]>> {
    return apiClient.get<AnalysisLibraryItem[]>(
      `${this.baseEndpoint}/categories/${categoryId}/library-items`
    );
  }

  /**
   * Fetch all active analysis library items across all categories.
   *
   * @returns A typed `ApiResponse` wrapping an array of `AnalysisLibraryItem` objects.
   */
  async getAllLibraryItems(): Promise<ApiResponse<AnalysisLibraryItem[]>> {
    return apiClient.get<AnalysisLibraryItem[]>(
      `${this.baseEndpoint}/library-items`
    );
  }
}

// Export singleton instance
export const analysisService = new AnalysisService();
export default analysisService;

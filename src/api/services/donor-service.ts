/**
 * Donor API Service
 *
 * Encapsulates all donor-related API operations.
 * Follows the API Abstraction Layer principle from the constitution.
 *
 * @example
 * const donorService = new DonorService();
 * const donors = await donorService.getDonors(1, 10);
 *
 * // Using singleton instance
 * import { donorService } from '@/api/services/donor-service';
 * const page2 = await donorService.getDonors(2, 25);
 */

import apiClient from '../client';
import { ApiResponse } from '../types';
import { PaginatedDonorList } from '../../types/donors';

export class DonorService {
  private baseEndpoint = '/api/v1/api/v1/donors';

  /**
   * Fetch paginated list of donors
   *
   * @param page - Page number (1-indexed)
   * @param limit - Items per page (max 100)
   * @returns Paginated donor list with metadata
   */
  async getDonors(
    page: number = 1,
    limit: number = 10
  ): Promise<ApiResponse<PaginatedDonorList>> {
    return apiClient.get<PaginatedDonorList>(this.baseEndpoint, {
      params: { page, limit },
    });
  }
}

// Export singleton instance
export const donorService = new DonorService();
export default donorService;

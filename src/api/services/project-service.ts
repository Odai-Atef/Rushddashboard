/**
 * Project Service
 *
 * Handles project management API operations such as creating a new project.
 */

import apiClient from '../client';
import { ApiResponse, RequestConfig } from '../types';

export interface CreateProjectDto {
  name: string;
  type: string;
  category: string;
  description: string;
  budget: number;
  currencyCode: string;
  startDate: string;
  endDate: string;
  beneficiaries: string;
  geographicScope: string;
  managerId: string;
  organizationId: string;
}

export interface CreatedProjectResponse extends CreateProjectDto {
  id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * ProjectService class
 * Encapsulates all project management API operations.
 */
export class ProjectService {
  /**
   * Create a new project
   * POST /api/v1/projects
   */
  async createProject(
    data: CreateProjectDto,
    config?: RequestConfig
  ): Promise<ApiResponse<CreatedProjectResponse>> {
    return apiClient.post<CreatedProjectResponse>('/api/v1/projects', data, config);
  }
}

// Export singleton instance
export const projectService = new ProjectService();
export default projectService;

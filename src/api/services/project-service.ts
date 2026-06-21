/**
 * Project Service
 *
 * Handles project management API operations such as creating a new project.
 */

import apiClient from '../client';
import { ApiResponse, RequestConfig } from '../types';
import { Project, ProjectHealth, ProjectStatus } from '@/app/pages/project-management/project-types';

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

export interface ProjectListResponse {
  data: Project[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProjectFilters {
  page?: number;
  limit?: number;
  status?: ProjectStatus | string;
  organizationId?: string;
  managerId?: string;
  health?: ProjectHealth | string;
  type?: string;
  category?: string;
  search?: string;
}

/**
 * Build clean query params by removing empty/undefined values.
 */
function buildProjectQueryParams(filters: ProjectFilters): Record<string, string | number | undefined> {
  const params: Record<string, string | number | undefined> = {};

  if (filters.page !== undefined) params.page = filters.page;
  if (filters.limit !== undefined) params.limit = filters.limit;
  if (filters.status) params.status = filters.status;
  if (filters.organizationId) params.organizationId = filters.organizationId;
  if (filters.managerId) params.managerId = filters.managerId;
  if (filters.health) params.health = filters.health;
  if (filters.type) params.type = filters.type;
  if (filters.category) params.category = filters.category;
  if (filters.search) params.search = filters.search;

  return params;
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

  /**
   * Get paginated list of projects
   * GET /api/v1/projects
   */
  async getProjects(
    filters: ProjectFilters = {},
    config?: RequestConfig
  ): Promise<ApiResponse<ProjectListResponse>> {
    return apiClient.get<ProjectListResponse>('/api/v1/projects', {
      ...config,
      params: buildProjectQueryParams(filters),
    });
  }

  /**
   * Get a single project by ID
   * GET /api/v1/projects/:id
   * @deprecated The list endpoint now returns full project objects; only use this when an individual project is needed.
   */
  async getProjectById(id: string, config?: RequestConfig): Promise<ApiResponse<Project>> {
    return apiClient.get<Project>(`/api/v1/projects/${id}`, config);
  }
}

// Export singleton instance
export const projectService = new ProjectService();
export default projectService;

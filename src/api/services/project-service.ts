/**
 * Project Service
 *
 * Handles project management API operations such as creating a new project.
 */

import apiClient from '../client';
import { ApiResponse, RequestConfig } from '../types';
import { Project, ProjectDetails, ProjectHealth, ProjectStatus } from '@/app/pages/project-management/project-types';

export interface CreateProjectDto {
  name: string;
  description: string;
  budget: number;
  currencyCode: string;
  startDate: string;
  endDate: string;
  beneficiaries: string;
  geographicScope: string;
  managerId: string;
  organizationId: string;
  funding_areas: string[];
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

export interface ProjectDashboardStats {
  total: number;
  active: number;
  draft: number;
  awaitingApproval: number;
  approved: number;
  funded: number;
  completed: number;
}

export interface StatusDistributionItem {
  name: string;
  value: number;
  color: string;
}

export interface BudgetTrendItem {
  month: string;
  budget: number;
}

export interface RecentActivityItem {
  userName: string;
  action: string;
  projectName: string;
  timestamp: string;
}

export interface UpcomingDeadlineItem {
  projectName: string;
  deadline: string;
  daysLeft: number;
  priority: 'high' | 'medium' | 'low';
}

export interface ProjectDashboardData {
  stats: ProjectDashboardStats;
  statusDistribution: StatusDistributionItem[];
  budgetTrend: BudgetTrendItem[];
  recentActivity: RecentActivityItem[];
  upcomingDeadlines: UpcomingDeadlineItem[];
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
   */
  async getProjectById(id: string, config?: RequestConfig): Promise<ApiResponse<ProjectDetails>> {
    return apiClient.get<ProjectDetails>(`/api/v1/projects/${id}`, config);
  }

  /**
   * Get dashboard summary
   * GET /api/v1/projects/dashboard/summary
   */
  async getProjectDashboardSummary(
    config?: RequestConfig
  ): Promise<ApiResponse<ProjectDashboardData>> {
    return apiClient.get<ProjectDashboardData>('/api/v1/projects/dashboard/summary', config);
  }

  /**
   * Get project plan as markdown text
   * POST /api/v1/projects/:id/plan?format=markdown
   */
  async getProjectPlanMarkdown(id: string, config?: RequestConfig): Promise<ApiResponse<string>> {
    return apiClient.post<string>(`/api/v1/projects/${id}/plan`, undefined, {
      ...config,
      params: { format: 'markdown', ...(config?.params || {}) },
      responseType: 'text',
    });
  }

  /**
   * Get project plan as Word document
   * POST /api/v1/projects/:id/plan?format=word
   */
  async getProjectPlanWord(id: string, config?: RequestConfig): Promise<ApiResponse<Blob>> {
    return apiClient.post<Blob>(`/api/v1/projects/${id}/plan`, undefined, {
      ...config,
      params: { format: 'word', ...(config?.params || {}) },
      responseType: 'blob',
    });
  }

  /**
   * Save updated project plan markdown
   * PUT /api/v1/projects/:id/plan
   *
   * TODO: Replace with the real backend endpoint/method/body once provided.
   */
  async updateProjectPlanMarkdown(
    id: string,
    markdown: string,
    config?: RequestConfig
  ): Promise<ApiResponse<unknown>> {
    return apiClient.put<unknown>(`/api/v1/projects/${id}/plan`, { markdown }, config);
  }
}

// Export singleton instance
export const projectService = new ProjectService();
export default projectService;

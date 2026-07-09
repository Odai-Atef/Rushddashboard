/**
 * User Service
 *
 * Handles user management API operations for project managers such as listing
 * active users with their organization and documents, approving a user, and
 * requesting action from a user.
 */

import apiClient from '../client';
import { ApiResponse, RequestConfig } from '../types';

export interface OrganizationDocument {
  id: string;
  organizationId: string;
  documentType: string;
  isRequired: boolean;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  status: string;
  uploadedAt: string;
  createdAt: string;
}

export interface UserOrganization {
  id: string;
  name: string;
  licenseNumber: string;
  registrationDate: string;
  type: 'CHARITY' | 'COOP' | string;
  city: string;
  website?: string | null;
  contactPerson?: string | null;
  email?: string | null;
  mobile?: string | null;
  status: string;
  currentStep: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  jobTitle?: string | null;
  status: string;
  actionRequired?: string | null;
  createdAt: string;
  organization: UserOrganization;
  documents: OrganizationDocument[];
}

export interface AdminUsersResponse {
  data: AdminUser[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AdminUserFilters {
  page?: number;
  limit?: number;
  search?: string;
}

export interface ApproveUserResponse {
  id: string;
  companyId?: string | null;
  roleId?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  fullName: string;
  email: string;
  phone?: string | null;
  jobTitle?: string | null;
  avatarUrl?: string | null;
  preferredLanguage?: string | null;
  timezone?: string | null;
  status: string;
  actionRequired?: string | null;
  lastLoginAt?: string | null;
  emailVerifiedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RequestActionPayload {
  comment: string;
}

/**
 * Build clean query params by removing empty/undefined values.
 */
function buildAdminUsersQueryParams(
  filters: AdminUserFilters
): Record<string, string | number | undefined> {
  const params: Record<string, string | number | undefined> = {};

  if (filters.page !== undefined) params.page = filters.page;
  if (filters.limit !== undefined) params.limit = filters.limit;
  if (filters.search?.trim()) params.search = filters.search.trim();

  return params;
}

/**
 * UserService class
 * Encapsulates all user management API operations.
 */
export class UserService {
  private baseEndpoint = '/api/v1/users';

  /**
   * List active users with their organization and documents.
   * GET /api/v1/users/organizations
   */
  async getOrganizationsUsers(
    filters: AdminUserFilters = {},
    config?: RequestConfig
  ): Promise<ApiResponse<AdminUsersResponse>> {
    return apiClient.get<AdminUsersResponse>(
      `${this.baseEndpoint}/project-managers/organizations`,
      {
        ...config,
        params: buildAdminUsersQueryParams(filters),
      }
    );
  }

  /**
   * Approve a user (ACTIVE -> APPROVED).
   * POST /api/v1/users/{id}/approve
   */
  async approveUser(
    id: string,
    config?: RequestConfig
  ): Promise<ApiResponse<ApproveUserResponse>> {
    return apiClient.post<ApproveUserResponse>(
      `${this.baseEndpoint}/project-managers/${id}/approve`,
      {},
      config
    );
  }

  /**
   * Request action from a user (ACTIVE -> NEED_ACTION_FROM_ORG).
   * POST /api/v1/users/{id}/request-action
   */
  async requestAction(
    id: string,
    payload: RequestActionPayload,
    config?: RequestConfig
  ): Promise<ApiResponse<ApproveUserResponse>> {
    return apiClient.post<ApproveUserResponse>(
      `${this.baseEndpoint}/project-managers/${id}/request-action`,
      payload,
      config
    );
  }
}

// Export singleton instance
export const userService = new UserService();
export default userService;

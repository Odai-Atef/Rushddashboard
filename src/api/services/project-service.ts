/**
 * Project Service
 *
 * Handles project management API operations such as creating a new project.
 */

import apiClient from '../client';
import { ApiResponse, RequestConfig } from '../types';
import { Project, ProjectDetails, ProjectHealth, ProjectStatus, UpdateProjectDto } from '@/app/pages/project-management/project-types';

export interface CreateProjectDto {
  name: string;
  description: string;
  budget: number;
  currencyCode: string;
  startDate: string;
  endDate: string;
  beneficiaries: string;
  beneficiariesCount: number;
  geographicScope: string;
  managerId: string;
  organizationId: string;
  fundingAreaIds: string[];
}

export interface CreatedProjectResponse extends CreateProjectDto {
  id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectEligibility {
  canCreate: boolean;
  allowed: boolean;
  current: number;
  limit: number;
  remaining: number;
  reason?: 'NO_ACTIVE_SUBSCRIPTION' | 'PROJECT_LIMIT_REACHED' | string;
  message?: string;
}

export interface ProjectListResponse {
  data: Project[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface MatchDonorsSearchParameters {
  keywords: string[];
  fundingAreas: string[];
  locations: string[];
  query: string;
}

export interface MatchDonorsDonor {
  id: string;
  matchingResultId?: string;
  resultId?: string;
  name: string;
  description: string;
  matchingScore: number;
  url: string;
  source: 'online' | 'offline' | 'ONLINE' | 'OFFLINE' | 'MANUAL';
  status?: string | null;
  hasGeneratedPlan?: boolean;
  planFileUrl?: string | null;
}

export interface MatchDonorsResponse {
  id?: string;               // matchingResultId from the backend
  projectId: string;
  resultId?: string;
  matchingResultId?: string;
  cached?: boolean;
  createdAt?: string;
  searchParameters: MatchDonorsSearchParameters;
  donors: MatchDonorsDonor[];
}

export interface DonorSubmissionHistoryItem {
  id: string;
  action: string;
  fromStatus?: string;
  toStatus?: string;
  message?: string;
  details?: Record<string, unknown>;
  actorId: string;
  createdAt: string;
}

export interface UpdateDonorMatchStatusPayload {
  status: string;
  proposalSubmissionDate?: string;
  responseNotes?: string;
  responseReceivedAt?: string;
  sentProjectDocumentId?: string;
  message?: string;
}

export interface CreateManualDonorPayload {
  name: string;
  description?: string;
  website?: string;
  matchingScore?: number;
}

export interface SendPlanToDonorPayload {
  projectDocumentId: string;
  message?: string;
}

export interface OrganizationDonorMatch {
  id: string;
  matchingResultId: string;
  donorId: string | null;
  name: string;
  description: string;
  website: string;
  source: string;
  status: string;
  matchingScore: number;
  proposalSubmissionDate: string | null;
  responseNotes: string | null;
  responseReceivedAt: string | null;
  projectDocumentId: string | null;
  sentProjectDocumentId: string | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  projectId: string;
  projectName: string;
  projectBudget: number;
  projectCurrencyCode: string;
  donor?: {
    id: string;
    name: string;
    type: string;
    description: string | null;
    website: string | null;
  } | null;
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

export interface SubmitToCharityAttachment {
  id: string;
  originalName: string;
  mimeType: string;
}

export interface SubmitToCharityResponse {
  success: boolean;
  message: string;
  projectId: string;
  newStatus: string;
  conversationId: string;
  attachments: SubmitToCharityAttachment[];
}

export interface CharityDecisionPayload {
  status: 'CHARITY_APPROVAL' | 'INCUBATOR_MODIFICATIONS';
  notes?: string;
}

export interface CharityDecisionResponse {
  success: boolean;
  message: string;
  projectId: string;
  newStatus: string;
  conversationId: string;
}

export interface PresentationFile {
  id: string;
  originalName: string;
  mimeType: string;
  downloadUrl: string;
}

export interface GeneratePresentationResponse {
  success: boolean;
  message: string;
  projectId: string;
  htmlContent: string;
  pdfFile: PresentationFile;
  conversationId: string;
  aiSessionId: string;
}

export interface ProjectLifecycleChangedByUser {
  id: string;
  email: string;
}

export interface ProjectLifecycleStep {
  id: string;
  projectId: string;
  status: string;
  enteredAt: string;
  exitedAt: string | null;
  durationMs: number | null;
  notes: string | null;
  changedBy: string;
  changedByUser: ProjectLifecycleChangedByUser;
}

export interface DesignDecisionPayload {
  status: 'DESIGN_APPROVED' | 'DESIGN_REJECTED';
  notes?: string;
  internalNotes?: string;
}

export interface DesignDecisionResponse {
  success: boolean;
  message: string;
  projectId: string;
  newStatus: string;
  conversationId: string;
}

export interface PriceOfferApprovePayload {
  file: File;
  internalNotes?: string;
}

export interface PriceOfferRejectPayload {
  reason: string;
}

export interface PriceOfferDecisionResponse {
  success: boolean;
  message: string;
  projectId: string;
  newStatus: string;
  fileId: string | null;
  conversationId: string;
}

export interface SendDesignToOwnerPayload {
  file?: File;
  notes?: string;
  internalNotes?: string;
}

export interface SendDesignFileInfo {
  id: string;
  originalName: string;
  mimeType: string;
  downloadUrl: string;
}

export interface SendDesignToOwnerResponse {
  success: boolean;
  message: string;
  projectId: string;
  newStatus: string;
  conversationId?: string;
  file?: SendDesignFileInfo;
}

export interface ProjectDocumentUploader {
  id: string;
  email: string;
}

export interface ProjectDocumentFile {
  id: string;
  originalName: string;
  mimeType: string;
  size: number;
  storageKey: string;
  storageProvider: string;
  storagePath: string;
}

export interface ProjectDocument {
  id: string;
  projectId: string;
  fileId: string;
  documentType: string;
  uploadedBy: string;
  createdAt: string;
  file: ProjectDocumentFile;
  uploader: ProjectDocumentUploader;
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
  if (filters.status) params.status = filters.status.replace(/-/g, '_').toUpperCase();
  if (filters.search) params.search = filters.search;

  return params;
}

/**
 * ProjectService class
 * Encapsulates all project management API operations.
 */
export class ProjectService {
  /**
   * Check whether the current user is allowed to create a new project
   * GET /api/v1/projects/eligibility
   */
  async checkProjectCreationEligibility(
    organizationId: string,
    config?: RequestConfig
  ): Promise<ApiResponse<ProjectEligibility>> {
    return apiClient.get<ProjectEligibility>('/api/v1/projects/eligibility', {
      ...config,
      params: { organizationId, ...(config?.params || {}) },
    });
  }

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
   * Update an existing project
   * PATCH /api/v1/projects/:id
   */
  async updateProject(
    id: string,
    data: UpdateProjectDto,
    config?: RequestConfig
  ): Promise<ApiResponse<CreatedProjectResponse>> {
    return apiClient.patch<CreatedProjectResponse>(`/api/v1/projects/${id}`, data, config);
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
      timeout: 300_000, // 5 minutes
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
      timeout: 300_000, // 5 minutes
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

  /**
   * Submit a draft project to the charity for review
   * POST /api/v1/projects/:id/submit-to-charity
   */
  async submitToCharity(
    id: string,
    config?: RequestConfig
  ): Promise<ApiResponse<SubmitToCharityResponse>> {
    return apiClient.post<SubmitToCharityResponse>(`/api/v1/projects/${id}/submit-to-charity`, undefined, config);
  }

  /**
   * Entity manager makes a charity decision on a project in CHARITY_REVIEW
   * POST /api/v1/projects/:id/charity-decision
   */
  async submitCharityDecision(
    id: string,
    payload: CharityDecisionPayload,
    config?: RequestConfig
  ): Promise<ApiResponse<CharityDecisionResponse>> {
    return apiClient.post<CharityDecisionResponse>(`/api/v1/projects/${id}/charity-decision`, payload, config);
  }

  /**
   * Generate an AI presentation for a project approved by the charity
   * POST /api/v1/projects/:id/generate-presentation
   */
  async generatePresentation(
    id: string,
    options: { forceRegenerate?: boolean } = {},
    config?: RequestConfig
  ): Promise<ApiResponse<GeneratePresentationResponse>> {
    return apiClient.post<GeneratePresentationResponse>(
      `/api/v1/projects/${id}/generate-presentation`,
      {},
      {
        ...config,
        params: { forceRegenerate: options.forceRegenerate ?? true, ...(config?.params || {}) },
        timeout: 300_000,
      }
    );
  }

  /**
   * Project manager sends approved design to the charity owner
   * POST /api/v1/projects/:id/send-design-to-owner
   */
  async sendDesignToOwner(
    id: string,
    payload: SendDesignToOwnerPayload,
    config?: RequestConfig
  ): Promise<ApiResponse<SendDesignToOwnerResponse>> {
    const formData = new FormData();
    if (payload.file) {
      formData.append('file', payload.file);
    }
    if (payload.notes) {
      formData.append('notes', payload.notes);
    }
    if (payload.internalNotes) {
      formData.append('internalNotes', payload.internalNotes);
    }
    return apiClient.upload<SendDesignToOwnerResponse>(
      `/api/v1/projects/${id}/send-design-to-owner`,
      formData,
      config
    );
  }

  /**
   * Download the generated AI marketing/presentation file
   * GET /api/v1/projects/:id/presentation/download
   */
  async downloadPresentation(
    id: string,
    config?: RequestConfig
  ): Promise<ApiResponse<Blob>> {
    return apiClient.get<Blob>(`/api/v1/projects/${id}/presentation/download`, {
      ...config,
      responseType: 'blob',
    });
  }

  /**
   * Get project lifecycle history
   * GET /api/v1/projects/:id/lifecycle
   */
  async getProjectLifecycle(
    id: string,
    config?: RequestConfig
  ): Promise<ApiResponse<ProjectLifecycleStep[]>> {
    return apiClient.get<ProjectLifecycleStep[]>(`/api/v1/projects/${id}/lifecycle`, config);
  }

  /**
   * Get project documents
   * GET /api/v1/projects/:id/documents
   */
  async getProjectDocuments(
    id: string,
    config?: RequestConfig
  ): Promise<ApiResponse<ProjectDocument[]>> {
    return apiClient.get<ProjectDocument[]>(`/api/v1/projects/${id}/documents`, config);
  }

  /**
   * Entity manager makes a design decision on a project in DESIGN_REVIEW
   * POST /api/v1/projects/:id/design-decision
   */
  async submitDesignDecision(
    id: string,
    payload: DesignDecisionPayload,
    config?: RequestConfig
  ): Promise<ApiResponse<DesignDecisionResponse>> {
    return apiClient.post<DesignDecisionResponse>(`/api/v1/projects/${id}/design-decision`, payload, config);
  }

  /**
   * Download the price offer file for a project
   * GET /api/v1/projects/:id/price-offer/download
   */
  async downloadPriceOffer(
    id: string,
    type?: 'signed' | 'offer',
    config?: RequestConfig
  ): Promise<ApiResponse<Blob>> {
    return apiClient.get<Blob>(`/api/v1/projects/${id}/price-offer/download`, {
      ...config,
      params: { ...(type ? { type } : {}), ...(config?.params || {}) },
      responseType: 'blob',
    });
  }

  /**
   * Approve the price offer with a signed document
   * POST /api/v1/projects/:id/price-offer/approve
   */
  async approvePriceOffer(
    id: string,
    payload: PriceOfferApprovePayload,
    config?: RequestConfig
  ): Promise<ApiResponse<PriceOfferDecisionResponse>> {
    const formData = new FormData();
    formData.append('file', payload.file);
    if (payload.internalNotes) {
      formData.append('internalNotes', payload.internalNotes);
    }
    return apiClient.upload<PriceOfferDecisionResponse>(`/api/v1/projects/${id}/price-offer/approve`, formData, config);
  }

  /**
   * Reject the price offer with a reason
   * POST /api/v1/projects/:id/price-offer/reject
   */
  async rejectPriceOffer(
    id: string,
    payload: PriceOfferRejectPayload,
    config?: RequestConfig
  ): Promise<ApiResponse<PriceOfferDecisionResponse>> {
    return apiClient.post<PriceOfferDecisionResponse>(`/api/v1/projects/${id}/price-offer/reject`, payload, config);
  }

  /**
   * AI-powered donor matching for a specific project
   * POST /api/v1/projects/:id/match-donors
   */
  async matchDonors(
    id: string,
    options?: { searchDepth?: 'basic' | 'advanced'; maxResults?: number },
    config?: RequestConfig
  ): Promise<ApiResponse<MatchDonorsResponse>> {
    return apiClient.post<MatchDonorsResponse>(
      `/api/v1/projects/${id}/match-donors`,
      undefined,
      {
        ...config,
        timeout: 120_000, // 2 minutes for AI analysis
        params: {
          searchDepth: options?.searchDepth ?? 'basic',
          maxResults: options?.maxResults ?? 20,
          ...(config?.params || {}),
        },
      }
    );
  }

  /**
   * Generate a donor-specific project plan (.docx)
   * POST /api/v1/projects/donor-matches/:donorMatchId/generate-plan
   */
  async generateDonorPlan(
    donorMatchId: string,
    config?: RequestConfig
  ): Promise<ApiResponse<Blob>> {
    return apiClient.post<Blob>(
      `/api/v1/projects/donor-matches/${donorMatchId}/generate-plan`,
      undefined,
      {
        ...config,
        timeout: 300_000, // 5 minutes for .docx generation
        responseType: 'blob',
      }
    );
  }

  /**
   * Complete a project (mark as COMPLETED).
   * POST /api/v1/projects/:id/complete
   */
  async completeProject(
    id: string,
    config?: RequestConfig
  ): Promise<ApiResponse<{ success: boolean; message: string; projectId: string; newStatus: string; conversationId: string }>> {
    return apiClient.post(`/api/v1/projects/${id}/complete`, undefined, config);
  }

  /**
   * List existing donor matches for a project.
   * GET /api/v1/projects/:id/donor-matches
   */
  async getDonorMatches(
    projectId: string,
    options?: { status?: string; limit?: number; offset?: number }
  ): Promise<ApiResponse<{ donors: MatchDonorsDonor[]; total: number }>> {
    return apiClient.get(`/api/v1/projects/${projectId}/donor-matches`, {
      params: options,
    });
  }

  /**
   * Update donor match status.
   * PATCH /api/v1/projects/donor-matches/:matchId/status
   */
  async updateDonorMatchStatus(
    matchId: string,
    payload: UpdateDonorMatchStatusPayload
  ): Promise<ApiResponse<any>> {
    return apiClient.patch(`/api/v1/projects/donor-matches/${matchId}/status`, payload);
  }

  /**
   * Add a manual donor match.
   * POST /api/v1/projects/donor-matches/:resultId
   */
  async addManualDonor(
    resultId: string,
    payload: CreateManualDonorPayload
  ): Promise<ApiResponse<any>> {
    return apiClient.post(`/api/v1/projects/donor-matches/${resultId}`, payload);
  }

  /**
   * Get submission history for a donor match.
   * GET /api/v1/projects/donor-matches/:matchId/history
   */
  async getDonorMatchHistory(
    matchId: string
  ): Promise<ApiResponse<{ history: DonorSubmissionHistoryItem[] }>> {
    return apiClient.get(`/api/v1/projects/donor-matches/${matchId}/history`);
  }

  /**
   * Record sending a plan to a donor.
   * POST /api/v1/projects/donor-matches/:matchId/send-plan
   */
  async sendPlanToDonor(
    matchId: string,
    payload: SendPlanToDonorPayload
  ): Promise<ApiResponse<any>> {
    return apiClient.post(`/api/v1/projects/donor-matches/${matchId}/send-plan`, payload);
  }

  /**
   * Soft-delete a donor match.
   * DELETE /api/v1/projects/donor-matches/:matchId
   */
  async deleteDonorMatch(matchId: string): Promise<ApiResponse<any>> {
    return apiClient.delete(`/api/v1/projects/donor-matches/${matchId}`);
  }

  /**
   * List all submitted donor matches for the current user's organization.
   * GET /api/v1/projects/organization/donor-matches
   */
  async getOrganizationDonorMatches(
    options?: { status?: string; projectId?: string; search?: string; limit?: number; offset?: number }
  ): Promise<ApiResponse<{ data: OrganizationDonorMatch[]; total: number }>> {
    return apiClient.get('/api/v1/projects/organization/donor-matches', {
      params: options,
    });
  }
}

// Export singleton instance
export const projectService = new ProjectService();
export default projectService;

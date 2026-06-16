/**
 * Onboarding Service
 *
 * Handles all charity organization onboarding-related API operations.
 * Includes organization registration, profile creation, and funding area management.
 *
 * @example
 * import { onboardingService } from '@/api/services';
 * const { data } = await onboardingService.createOrganization({ name: '...' });
 */

import apiClient from '../client';
import { ApiResponse, ApiError } from '../types';
import { AUTH_CONFIG } from '../config';
import { ENV } from '@/lib/env';

export type OrganizationType = 'CHARITY' | 'FOUNDATION' | 'NGO' | 'COOP';
export type OrganizationStatus = 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
export type OnboardingStep = 'REGISTRATION' | 'PROFILE' | 'ASSESSMENT' | 'DOCUMENTS' | 'PROCESSING' | 'RESULTS';
export type GeographicCoverage = 'LOCAL' | 'REGIONAL' | 'NATIONAL' | 'INTERNATIONAL';

export interface OrganizationResponse {
  id: string;
  name: string;
  licenseNumber: string;
  registrationDate: string;
  type: string;
  city: string;
  website: string | null;
  contactPerson: string;
  email: string;
  mobile: string;
  status: OrganizationStatus;
  currentStep: OnboardingStep;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrganizationDto {
  name: string;
  licenseNumber: string;
  registrationDate: string;
  type: OrganizationType;
  city: string;
  website?: string;
  contactPerson: string;
  email: string;
  mobile: string;
}

/** Organization registration data */
export interface OrganizationRegistration {
  name: string;
  licenseNumber: string;
  registrationDate: string;
  type: OrganizationType;
  city: string;
  website?: string;
  contactPerson: string;
  email: string;
  mobile: string;
}

/** Organization response from backend */
export interface Organization {
  id: string;
  name: string;
  licenseNumber: string;
  registrationDate: string;
  type: string;
  city: string;
  website: string | null;
  contactPerson: string;
  email: string;
  mobile: string;
  status: OrganizationStatus;
  currentStep: OnboardingStep;
  profile?: OrganizationProfile;
  fundingAreas?: FundingArea[];
  createdAt: string;
  updatedAt: string;
}

/** Organization profile data */
export interface OrganizationProfile {
  overview: string;
  targetBeneficiaries: string;
  geographicCoverage: GeographicCoverage;
  employeeCount?: number;
  volunteerCount?: number;
  activeProjects?: number;
  areasOfWork?: string[]; // Funding area IDs
}

/** Profile response from backend */
export interface OrganizationProfileResponse {
  id: string;
  organizationId: string;
  overview: string;
  targetBeneficiaries: string;
  geographicCoverage: string;
  employeeCount: number | null;
  volunteerCount: number | null;
  activeProjects: number | null;
  fundingAreas: FundingArea[];
  createdAt: string;
}

/** Funding area from donor service */
export interface FundingArea {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Funding area assignment */
export interface FundingAreaAssignment {
  id: string;
  fundingAreaId: string;
  fundingAreaName: string;
  fundingAreaNameAr: string | null;
  customName: string | null;
}

/** Custom funding area */
export interface CustomFundingArea {
  name: string;
}

/** Funding areas request */
export interface SetFundingAreasRequest {
  fundingAreaIds: string[];
  customAreas?: CustomFundingArea[];
}

/** Question options for multiple choice */
export interface QuestionOptions {
  choices: string[];
}

/** Assessment question */
export interface AssessmentQuestion {
  id: string;
  questionText: string;
  questionType: 'SCALE' | 'YES_NO' | 'MULTIPLE_CHOICE' | 'FILE_UPLOAD' | string;
  options: QuestionOptions | null;
  isRequired: boolean;
  sortOrder: number;
}

/** Assessment category with embedded questions */
export interface AssessmentCategory {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  color: string;
  sortOrder: number;
  questions: AssessmentQuestion[];
}

/** Payload to save an assessment answer */
export interface SaveAnswerPayload {
  questionId: string;
  answerNumeric: number | null;
  answerValue: string | null;
  selectedOptions: string[] | null;
}

/** Answer returned inside the assessment state endpoint */
export interface AssessmentStateAnswer {
  questionId: string;
  questionType: 'SCALE' | 'YES_NO' | 'MULTIPLE_CHOICE' | 'FILE_UPLOAD' | string;
  answerValue: string | null;
  answerNumeric: number | null;
  selectedOptions: string[] | null;
  fileUrl: string | null;
}

/** Category returned inside the assessment state endpoint */
export interface AssessmentStateCategory {
  categoryId: string;
  categoryName: string;
  totalQuestions: number;
  answeredQuestions: number;
  isComplete: boolean;
  questions?: AssessmentQuestion[];
  answers: AssessmentStateAnswer[];
}

/** Full assessment state returned by the state endpoint */
export interface AssessmentState {
  organizationId: string;
  categories: AssessmentStateCategory[];
  overallProgress: number;
}

/** Answer returned after saving assessment answers */
export interface SavedAnswer {
  questionId: string;
  answerNumeric: number | null;
  answerValue: string | null;
  selectedOptions: string[] | null;
}

/** Assessment result returned by the results endpoint */
export interface AssessmentResult {
  organizationId: string;
  overallScore: number;
  qualificationStatus: 'QUALIFIED' | 'QUALIFIED_WITH_IMPROVEMENT' | 'NOT_QUALIFIED';
  qualificationMessage: string;
  categoryScores: {
    categoryId: string;
    categoryName: string;
    score: number;
    maxScore: number;
    color: string;
  }[];
  radarData: {
    category: string;
    score: number;
    fullMark: number;
  }[];
  strengths: {
    area: string;
    score: number;
    insight: string;
    icon: string;
  }[];
  weaknesses: {
    area: string;
    score: number;
    insight: string;
    severity: 'high' | 'medium' | 'low';
  }[];
  benchmarks: {
    yourScore: number;
    sectorAverage: number;
    topPerformer: number;
  };
  assessedAt: string;
}

export type AssessmentStatusValue = 'COMPLETED' | 'IN_PROGRESS' | 'NOT_STARTED';

/** Lightweight assessment status */
export interface AssessmentStatus {
  status: AssessmentStatusValue;
  overallScore: number | null;
  completedAt: string | null;
}

/** ISIV dimension returned by the evaluation results endpoint */
export interface IsivDimension {
  dimension: string;
  dimensionLabelAr: string;
  symbol: string;
  score: number;
  percentage: number;
  tier: string;
  tierLabelAr: string;
  color: string;
}

/** ISIV 4-layer assessment result returned by the evaluation results endpoint */
export interface IsivAssessmentResult {
  overallScore: number;
  qualificationStatus: string;
  dimensions: IsivDimension[];
  diagnosis: string;
  strengths: string[];
  weaknesses: string[];
}

/** Response from the assessment submission endpoint */
export interface AssessmentSubmissionResponse {
  organizationId: string;
  status: string;
  submittedAt: string;
}

/** Document type enum used by the backend document upload API */
export type DocumentType = 'registration' | 'financial' | 'other';

/** Lifecycle status of an uploaded organization document */
export type DocumentStatus = 'UPLOADED' | 'PENDING_REVIEW' | string;

/** Document uploaded during charity onboarding */
export interface OrganizationDocument {
  id: string;
  fileId?: string;
  fileUrl: string;
  originalName?: string;
  fileName?: string;
  documentType: DocumentType | string;
  status: DocumentStatus;
  description?: string;
  mimeType?: string;
  size?: number;
  fileSize?: number;
  isRequired?: boolean;
  uploadedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

/** Mapping from frontend slot IDs to backend document types */
export const DOCUMENT_SLOT_MAPPING: Record<string, DocumentType> = {
  license: 'registration',
  bank: 'financial',
  address: 'other',
  profile: 'other',
  projects: 'other',
  financial: 'financial',
  annual: 'other',
  brand: 'other',
};

/** Mapping from backend document type enum values to frontend slot IDs */
export const BACKEND_DOCUMENT_TYPE_TO_SLOT: Record<string, DocumentSlotId> = {
  REGISTRATION: 'license',
  LICENSE: 'license',
  FINANCIAL: 'bank',
  BANK_CERTIFICATE: 'bank',
  BANK_STATEMENT: 'bank',
  NATIONAL_ADDRESS: 'address',
  ADDRESS: 'address',
  ORG_PROFILE: 'profile',
  ORGANIZATION_PROFILE: 'profile',
  PROFILE: 'profile',
  PROJECTS: 'projects',
  PREVIOUS_PROJECTS: 'projects',
  ANNUAL_REPORT: 'annual',
  ANNUAL: 'annual',
  BRAND: 'brand',
  BRAND_IDENTITY: 'brand',
};

/** All known frontend document slot IDs */
export type DocumentSlotId = 'license' | 'bank' | 'address' | 'profile' | 'projects' | 'financial' | 'annual' | 'brand';

/**
 * Onboarding Service class
 * Encapsulates all onboarding API operations
 */
export class OnboardingService {
  /**
   * Get my organization (JWT-based)
   * GET /api/v1/onboarding/organizations/me
   */
  async getMyOrganization(): Promise<ApiResponse<OrganizationResponse>> {
    return apiClient.get('/api/v1/onboarding/organizations/me');
  }

  /**
   * Save my organization (create or update, JWT-based)
   * PUT /api/v1/onboarding/organizations/me
   */
  async saveMyOrganization(data: CreateOrganizationDto): Promise<ApiResponse<{ org: OrganizationResponse; statusCode: number }>> {
    return apiClient.put('/api/v1/onboarding/organizations/me', data);
  }

  /**
   * Create a new organization registration
   * POST /api/v1/onboarding/organizations
   */
  async createOrganization(data: OrganizationRegistration): Promise<ApiResponse<Organization>> {
    return apiClient.post('/api/v1/onboarding/organizations', data);
  }

  /**
   * Get organization by ID
   * GET /api/v1/onboarding/organizations/:id
   */
  async getOrganization(id: string): Promise<ApiResponse<Organization>> {
    return apiClient.get(`/api/v1/onboarding/organizations/${id}`);
  }

  /**
   * Update organization registration
   * PATCH /api/v1/onboarding/organizations/:id
   */
  async updateOrganization(id: string, data: Partial<OrganizationRegistration>): Promise<ApiResponse<Organization>> {
    return apiClient.patch(`/api/v1/onboarding/organizations/${id}`, data);
  }

  /**
   * Create or update organization profile
   * POST /api/v1/onboarding/organizations/:id/profile
   */
  async createProfile(id: string, data: OrganizationProfile): Promise<ApiResponse<OrganizationProfileResponse>> {
    return apiClient.post(`/api/v1/onboarding/organizations/${id}/profile`, data);
  }

  /**
   * Get organization profile
   * GET /api/v1/onboarding/organizations/:id/profile
   */
  async getProfile(id: string): Promise<ApiResponse<OrganizationProfileResponse>> {
    return apiClient.get(`/api/v1/onboarding/organizations/${id}/profile`);
  }

  /**
   * Set organization funding areas
   * POST /api/v1/onboarding/organizations/:id/funding-areas
   */
  async setFundingAreas(id: string, data: SetFundingAreasRequest): Promise<ApiResponse<FundingAreaAssignment[]>> {
    return apiClient.post(`/api/v1/onboarding/organizations/${id}/funding-areas`, data);
  }

  /**
   * Get available funding areas
   * GET /api/v1/donors/funding-areas
   */
  async getFundingAreas(): Promise<ApiResponse<FundingArea[]>> {
    return apiClient.get('/api/v1/donors/funding-areas', { skipAuthRedirect: true });
  }

  /**
   * Get assessment categories with embedded questions
   * GET /api/v1/onboarding/assessment/categories
   */
  async getAssessmentCategories(): Promise<ApiResponse<AssessmentCategory[]>> {
    return apiClient.get('/api/v1/onboarding/assessment/categories');
  }

  /**
   * Get full assessment state including categories, questions, and saved answers
   * GET /api/v1/onboarding/assessment/state?organizationId=...
   */
  async getAssessmentState(organizationId?: string): Promise<ApiResponse<AssessmentState>> {
    return apiClient.get('/api/v1/onboarding/assessment/state', {
      params: organizationId ? { organizationId } : undefined,
    });
  }

  /**
   * Get all uploaded documents for the authenticated organization
   * GET /api/v1/onboarding/documents?organizationId=...
   */
  async getOrganizationDocuments(organizationId: string): Promise<ApiResponse<OrganizationDocument[]>> {
    return apiClient.get('/api/v1/onboarding/documents', {
      params: { organizationId },
    });
  }

  /**
   * Upload a new organization document using multipart/form-data
   * POST /api/v1/onboarding/documents/upload
   */
  async uploadOrganizationDocument(
    file: File,
    documentType: string,
    organizationId: string,
    description?: string
  ): Promise<ApiResponse<OrganizationDocument>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', documentType);
    if (description) {
      formData.append('description', description);
    }

    const token = typeof localStorage !== 'undefined' ? localStorage.getItem(AUTH_CONFIG.TOKEN_KEY) : null;
    const baseURL = ENV.API_BASE_URL.replace(/\/$/, '');
    const url = new URL(`${baseURL}/api/v1/onboarding/documents/upload`);
    url.searchParams.append('organizationId', organizationId);

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: formData,
    });

    if (!response.ok) {
      const error = await this.parseUploadError(response);
      throw error;
    }

    const payload = (await response.json()) as { success?: boolean; data?: OrganizationDocument; message?: string };
    const data = payload?.data;
    if (!data) {
      throw {
        code: 'INVALID_RESPONSE',
        message: 'Upload response did not contain document data',
        statusCode: response.status,
      } as ApiError;
    }
    return {
      success: true,
      data,
      message: payload?.message || 'Upload successful',
    };
  }

  /**
   * Delete an uploaded organization document
   * DELETE /api/v1/onboarding/documents/{id}
   */
  async deleteOrganizationDocument(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/api/v1/onboarding/documents/${id}`);
  }

  private async parseUploadError(response: Response): Promise<ApiError> {
    try {
      const data = await response.json();
      return {
        code: data.code || `HTTP_${response.status}`,
        message: data.message || `Upload failed with status ${response.status}`,
        details: data.details,
        errors: data.errors,
        statusCode: response.status,
      };
    } catch {
      return {
        code: 'HTTP_ERROR',
        message: `Upload failed with status ${response.status}`,
        statusCode: response.status,
      };
    }
  }

  /**
   * Submit the assessment for evaluation
   * POST /api/v1/onboarding/assessment/submit?organizationId=...
   */
  async submitAssessment(
    organizationId: string
  ): Promise<ApiResponse<AssessmentSubmissionResponse>> {
    return apiClient.post('/api/v1/onboarding/assessment/submit', undefined, {
      params: { organizationId },
    });
  }

  /**
   * Get ISIV assessment results for an organization
   * GET /api/v1/onboarding/assessments/:organizationId/results
   */
  async getIsivAssessmentResults(organizationId: string): Promise<ApiResponse<IsivAssessmentResult>> {
    return apiClient.get(`/api/v1/onboarding/assessments/${organizationId}/results`);
  }

  /**
   * Get assessment status for an organization
   * GET /api/v1/onboarding/assessments/:organizationId/status
   */
  async getAssessmentStatus(organizationId: string): Promise<ApiResponse<AssessmentStatus>> {
    return apiClient.get(`/api/v1/onboarding/assessments/${organizationId}/status`);
  }

  /**
   * Save assessment answers for the authenticated organization (batch upsert)
   * PUT /api/v1/onboarding/assessment/answers?organizationId=...
   */
  async saveAssessmentAnswers(
    answers: SaveAnswerPayload[],
    organizationId?: string
  ): Promise<ApiResponse<SavedAnswer[]>> {
    return apiClient.put('/api/v1/onboarding/assessment/answers', { answers }, {
      params: organizationId ? { organizationId } : undefined,
    });
  }
}

// Export singleton instance
export const onboardingService = new OnboardingService();

export default onboardingService;

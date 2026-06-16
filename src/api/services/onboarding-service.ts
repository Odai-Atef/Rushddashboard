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
import { ApiResponse } from '../types';

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

/** Saved/loaded assessment answer shape used by the component */
export interface SavedAnswer extends SaveAnswerPayload {
  id?: string;
  organizationId?: string;
  createdAt?: string;
  questionType?: 'SCALE' | 'YES_NO' | 'MULTIPLE_CHOICE' | 'FILE_UPLOAD' | string;
}

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

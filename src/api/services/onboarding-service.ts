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
  dimension?: string;
  dimensionLabelAr?: string;
  nameAr?: string;
  nameEn?: string;
  symbol?: string;
  score?: number;
  percentage?: number;
  percent?: number;
  maxPoints?: number;
  rawPoints?: number;
  tier?: string;
  tierLabelAr?: string;
  color?: string;
}

export interface CategoryScore {
  categoryId: string;
  categoryName: string;
  score: number;
  maxScore: number;
  color: string;
}

export interface RadarDatum {
  category: string;
  score: number;
  fullMark: number;
}

export interface Strength {
  area: string;
  score: number;
  insight: string;
  icon: string;
}

export interface Weakness {
  area: string;
  score: number;
  insight: string;
  severity: string;
}

export interface Benchmarks {
  yourScore: number;
  sectorAverage: number;
  topPerformer: number;
}

export interface ProgressDataItem {
  month: string;
  score: number;
}

/** ISIV 4-layer assessment result returned by the evaluation results endpoint */
export interface IsivDimension {
  nameAr: string;
  nameEn?: string;
  symbol?: string;
  percent?: number;
  score?: number;
  rawPoints?: number;
  maxPoints?: number;
  dimension?: string;
  dimensionLabelAr?: string;
  dimensionLabelEn?: string;
  percentage?: number;
}

export interface IsivAssessmentResult {
  organizationId: string;
  overallScore: number;
  qualificationStatus: string;
  qualificationMessage?: string;
  comments?: EvaluationComments;
  dimensions?: IsivDimension[];
  categoryScores?: CategoryScore[];
  radarData?: RadarDatum[];
  diagnosis?: string;
  strengths: string[] | Strength[];
  weaknesses: string[] | Weakness[];
  benchmarks?: Benchmarks;
  progressData?: ProgressDataItem[];
  assessedAt?: string;
}

/** Evaluation roadmap initiative */
export interface EvaluationInitiative {
  id: number;
  title: string;
  area: string;
  dimension: string;
  priority: 'high' | 'medium' | 'low' | string;
  priorityLabelAr?: string;
  responsible: string;
  outcome: string;
  duration: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'delayed' | string;
  tasks: string[];
  kpis?: string[];
  progress: number;
}

/** Evaluation roadmap section */
export interface EvaluationRoadmap {
  totalDurationMonths: number;
  overallProgress: number;
  initiatives: EvaluationInitiative[];
}

/** Evaluation dimension score */
export interface EvaluationDimensionScore {
  percent: number;
  rawPoints: number;
  maxPoints: number;
  symbol: string;
  nameAr: string;
  nameEn: string;
}

/** Evaluation scores */
export interface EvaluationScores {
  overall: {
    percent: number;
    rawPoints: number;
    maxPoints: number;
  };
  dimensions: EvaluationDimensionScore[];
}

/** Evaluation tier */
export interface EvaluationTier {
  tier: string;
  labelAr: string;
  labelEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
}

/** Evaluation tier classification */
export interface EvaluationTierClassification {
  overall: EvaluationTier;
  perDimension: {
    symbol: string;
    tier: string;
    labelAr: string;
    labelEn: string;
  }[];
}

/** Evaluation comments */
export interface EvaluationComments {
  overall: {
    ar: string;
    en: string;
  };
  perDimension: {
    symbol: string;
    subDimension: string;
    tier: string;
    commentAr: string;
    commentEn: string;
  }[];
}

/** Maturity tier for a single evaluation comment */
export type EvaluationCommentTier = 'CRITICAL' | 'EMERGING' | 'MEDIUM' | 'ADVANCED' | 'PIONEER';

/** Single comment describing a score for a specific question */
export interface EvaluationComment {
  id: string;
  dimensionSymbol: string;
  subDimension: string;
  tier: EvaluationCommentTier;
  questionId: string;
  commentAr: string;
  commentEn: string;
  createdAt: string;
}

/** Map of questionId to its ordered list of evaluation comments */
export type EvaluationCommentsMap = Record<string, EvaluationComment[]>;

/** API response wrapper for evaluation comments endpoint */
export interface EvaluationCommentsResponse {
  success: boolean;
  data: EvaluationCommentsMap;
}

/** Score to maturity tier mapping used by the assessment scale UI */
export const SCORE_TO_TIER: Record<number, EvaluationCommentTier> = {
  0: 'CRITICAL',
  1: 'CRITICAL',
  2: 'EMERGING',
  3: 'MEDIUM',
  4: 'ADVANCED',
  5: 'PIONEER',
};

export const TIER_ORDER: EvaluationCommentTier[] = [
  'CRITICAL',
  'EMERGING',
  'MEDIUM',
  'ADVANCED',
  'PIONEER',
];

/** Evaluation recommendation */
export interface EvaluationRecommendation {
  dimension: string;
  priority: number;
  serviceNameAr: string;
  serviceNameEn: string;
  icon: any;
  packageBundle: {
    code: string;
    nameAr: string;
    nameEn: string;
  };
}

/** Full evaluation response from /evaluate endpoint */
export interface LlmRoadmapPhase {
  phase: string;
  objective: string;
  activities: string[];
  kpis: string[];
  expectedOutcome: string;
}

export interface LlmRecommendations {
  highPriority: string;
  mediumPriority: string;
  longTermDevelopment: string;
}

export interface LlmExecutiveSummary {
  overallStatus: string;
  consultantOpinion: string;
  overallAssessment: string;
}

export interface LlmOrganizationalReadiness {
  strategy: string;
  governance: string;
  operations: string;
  dataAndDigital: string;
  sustainability: string;
}

export interface LlmResponse {
  roadmap: LlmRoadmapPhase[];
  gapAnalysis: string;
  riskAssessment: string;
  recommendations: LlmRecommendations;
  executiveSummary: LlmExecutiveSummary;
  strengthsAnalysis: string;
  organizationalReadiness: LlmOrganizationalReadiness;
}

export interface EvaluationResponse {
  reportId: string;
  organizationId: string;
  generatedAt: string;
  scores: EvaluationScores;
  tierClassification: EvaluationTierClassification;
  comments: EvaluationComments;
  recommendations: EvaluationRecommendation[];
  roadmap: EvaluationRoadmap;
  qualificationStatus: string;
  llmResponse?: LlmResponse;
}

/** Request body for the evaluate endpoint */
export interface EvaluateRequest {
  forceRegenerate?: boolean;
}

/** Response from the assessment submission endpoint */
export interface AssessmentSubmissionResponse {
  organizationId: string;
  status: string;
  submittedAt: string;
}

/** Lightweight evaluation cooldown status */
export interface EvaluationCooldownStatus {
  canEvaluate: boolean;
  cooldownMinutes: number;
  remainingSeconds: number;
  firstTime: boolean;
  lastReportGeneratedAt: string | null;
  nextEvaluationAt: string | null;
}

/** Response wrapper for evaluation cooldown endpoint */
export interface EvaluationCooldownStatusResponse {
  success: boolean;
  data: EvaluationCooldownStatus;
}

/** Document type enum used by the backend document upload API */
export type DocumentType =
  | 'license'
  | 'financial'
  | 'national_address'
  | 'registration'
  | 'board_approval_letter'
  | 'other';

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
  license: 'license',
  bank: 'financial',
  address: 'national_address',
  profile: 'registration',
  board_approval: 'board_approval_letter',
  projects: 'other',
  financial: 'financial',
  annual: 'other',
  brand: 'other',
};

/** Mapping from backend document type enum values to frontend slot IDs */
export const BACKEND_DOCUMENT_TYPE_TO_SLOT: Record<string, DocumentSlotId> = {
  REGISTRATION: 'license',
  LICENSE: 'license',
  license: 'license',
  FINANCIAL: 'bank',
  BANK_CERTIFICATE: 'bank',
  BANK_STATEMENT: 'bank',
  NATIONAL_ADDRESS: 'address',
  national_address: 'address',
  ADDRESS: 'address',
  REGISTRATION: 'profile',
  ORG_PROFILE: 'profile',
  ORGANIZATION_PROFILE: 'profile',
  PROFILE: 'profile',
  BOARD_APPROVAL_LETTER: 'board_approval',
  board_approval_letter: 'board_approval',
  BOARD_APPROVAL: 'board_approval',
  PROJECTS: 'projects',
  PREVIOUS_PROJECTS: 'projects',
  ANNUAL_REPORT: 'annual',
  ANNUAL: 'annual',
  BRAND: 'brand',
  BRAND_IDENTITY: 'brand',
};

/** All known frontend document slot IDs */
export type DocumentSlotId = 'license' | 'bank' | 'address' | 'profile' | 'board_approval' | 'projects' | 'financial' | 'annual' | 'brand';

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
   * Check whether all required documents have been uploaded
   * GET /api/v1/onboarding/documents/required-check/:organizationId
   */
  async checkRequiredDocuments(
    organizationId: string
  ): Promise<ApiResponse<{ complete: boolean }>> {
    return apiClient.get(`/api/v1/onboarding/documents/required-check/${organizationId}`);
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
   * GET /api/v1/onboarding/assessments/:organizationId/isiv-results
   */
  async getIsivAssessmentResults(
    organizationId: string,
    config?: RequestConfig
  ): Promise<ApiResponse<IsivAssessmentResult>> {
    return apiClient.get(`/api/v1/onboarding/assessments/${organizationId}/isiv-results`, config);
  }

  /**
   * Get legacy assessment results for an organization (deprecated, kept for compatibility)
   * GET /api/v1/onboarding/assessments/:organizationId/results
   * @deprecated Use getIsivAssessmentResults instead.
   */
  async getAssessmentResults(organizationId: string): Promise<ApiResponse<AssessmentResult>> {
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

  /**
   * Get evaluation comments for an organization's assessment questions
   * GET /api/v1/onboarding/evaluation-comments?organizationId=...
   */
  async getEvaluationComments(organizationId: string): Promise<ApiResponse<EvaluationCommentsResponse>> {
    return apiClient.get('/api/v1/onboarding/evaluation-comments', {
      params: { organizationId },
    });
  }

  /**
   * Get evaluation cooldown status for an organization
   * GET /api/v1/onboarding/evaluation-cooldown/status?organizationId=...
   */
  async getEvaluationCooldownStatus(
    organizationId: string,
    context: 'preloader' | 'assessment' = 'preloader'
  ): Promise<ApiResponse<EvaluationCooldownStatusResponse>> {
    return apiClient.get('/api/v1/onboarding/evaluation-cooldown/status', {
      params: { organizationId, context },
    });
  }

  /**
   * Run/generate the full evaluation report for an organization
   * POST /api/v1/onboarding/assessments/:organizationId/evaluate
   */
  async evaluateAssessment(
    organizationId: string,
    payload?: EvaluateRequest
  ): Promise<ApiResponse<EvaluationResponse>> {
    return apiClient.post(`/api/v1/onboarding/assessments/${organizationId}/evaluate`, undefined, {
      params: payload?.forceRegenerate ? { forceRegenerate: String(payload.forceRegenerate) } : undefined,
    });
  }
}

// Export singleton instance
export const onboardingService = new OnboardingService();

export default onboardingService;

import { apiFetch } from './api';
import {
  type CategoriesResponse,
  type AnalyticsSummaryResponse,
  type InsightsResponse,
  type FilterParameters,
  CategoriesResponseSchema,
  AnalyticsSummaryResponseSchema,
  InsightsResponseSchema,
} from '../types/analysis';
import { serializeFilters } from '../utils/analysis';

const ANALYSIS_BASE_URL = '/analysis';

export async function getCategories(
  limit = 20,
  offset = 0
): Promise<CategoriesResponse> {
  const response = await apiFetch<CategoriesResponse>(
    `${ANALYSIS_BASE_URL}/categories?limit=${limit}&offset=${offset}`
  );
  return CategoriesResponseSchema.parse(response);
}

export async function getAnalyticsSummary(
  categoryId: string,
  filters?: FilterParameters
): Promise<AnalyticsSummaryResponse> {
  const queryString = serializeFilters(filters);
  const url = queryString
    ? `${ANALYSIS_BASE_URL}/categories/${categoryId}/summary?${queryString}`
    : `${ANALYSIS_BASE_URL}/categories/${categoryId}/summary`;

  const response = await apiFetch<AnalyticsSummaryResponse>(url);
  return AnalyticsSummaryResponseSchema.parse(response);
}

export async function getInsights(
  categoryId: string,
  filters?: FilterParameters,
  limit = 20,
  offset = 0
): Promise<InsightsResponse> {
  const queryString = serializeFilters(filters);
  const baseUrl = `${ANALYSIS_BASE_URL}/categories/${categoryId}/insights?limit=${limit}&offset=${offset}`;
  const url = queryString ? `${baseUrl}&${queryString}` : baseUrl;

  const response = await apiFetch<InsightsResponse>(url);
  return InsightsResponseSchema.parse(response);
}

// Future saved analysis endpoints (documented for extensibility)
// export async function getSavedAnalyses(): Promise<SavedAnalysisResponse> { ... }
// export async function saveAnalysis(request: SaveAnalysisRequest): Promise<SavedAnalysisResponse> { ... }
// export async function deleteSavedAnalysis(id: string): Promise<void> { ... }

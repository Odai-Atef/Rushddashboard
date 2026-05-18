import { apiFetch } from './api';
import {
  type DashboardsResponse,
  type DashboardDetailResponse,
  type WidgetDataResponse,
  type CreateDashboardRequest,
  type UpdateDashboardRequest,
  DashboardsResponseSchema,
  DashboardDetailResponseSchema,
  WidgetDataResponseSchema,
} from '../types/dashboard';

const DASHBOARD_BASE_URL = '/dashboards';

export async function getDashboards(
  companyId?: string,
  limit = 20,
  offset = 0
): Promise<DashboardsResponse> {
  const params = new URLSearchParams();
  if (companyId) params.append('companyId', companyId);
  params.append('limit', limit.toString());
  params.append('offset', offset.toString());

  const queryString = params.toString();
  const url = queryString
    ? `${DASHBOARD_BASE_URL}?${queryString}`
    : DASHBOARD_BASE_URL;

  const response = await apiFetch<DashboardsResponse>(url);
  return DashboardsResponseSchema.parse(response);
}

export async function getDashboard(id: string): Promise<DashboardDetailResponse> {
  const response = await apiFetch<DashboardDetailResponse>(
    `${DASHBOARD_BASE_URL}/${id}`
  );
  return DashboardDetailResponseSchema.parse(response);
}

export async function getWidgetData(
  dashboardId: string,
  widgetId: string,
  filters?: Record<string, unknown>
): Promise<WidgetDataResponse> {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (typeof value === 'object') {
          params.append(key, JSON.stringify(value));
        } else {
          params.append(key, String(value));
        }
      }
    });
  }

  const queryString = params.toString();
  const baseUrl = `${DASHBOARD_BASE_URL}/${dashboardId}/widgets/${widgetId}/data`;
  const url = queryString ? `${baseUrl}?${queryString}` : baseUrl;

  const response = await apiFetch<WidgetDataResponse>(url);
  return WidgetDataResponseSchema.parse(response);
}

export async function createDashboard(
  request: CreateDashboardRequest
): Promise<DashboardDetailResponse> {
  const response = await apiFetch<DashboardDetailResponse>(DASHBOARD_BASE_URL, {
    method: 'POST',
    body: JSON.stringify(request),
  });
  return DashboardDetailResponseSchema.parse(response);
}

export async function updateDashboard(
  id: string,
  request: UpdateDashboardRequest
): Promise<DashboardDetailResponse> {
  const response = await apiFetch<DashboardDetailResponse>(
    `${DASHBOARD_BASE_URL}/${id}`,
    {
      method: 'PATCH',
      body: JSON.stringify(request),
    }
  );
  return DashboardDetailResponseSchema.parse(response);
}

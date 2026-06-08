/**
 * Dashboard Data Service
 * 
 * Handles all dashboard-related API operations including KPIs, charts, and analytics.
 * 
 * @example
 * const dashboardService = new DashboardService();
 * const kpis = await dashboardService.getKPISummary();
 * 
 * // Using singleton instance
 * import { dashboardService } from '@/api/services/dashboard-service';
 * const metrics = await dashboardService.getRevenueTrend('2024-01-01', '2024-06-01');
 */

import apiClient from '../client';
import { ApiResponse, PaginatedRequest, PaginationMeta } from '../types';

export interface KPIData {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: string; // Icon name reference
}

export interface ChartDataPoint {
  label: string;
  value: number;
  secondaryValue?: number;
}

export interface RevenueTrend {
  period: string;
  revenue: number;
  target: number;
}

export interface CustomerGrowth {
  period: string;
  totalCustomers: number;
  newCustomers: number;
  churnedCustomers: number;
}

export interface AlertItem {
  id: string;
  type: 'urgent' | 'warning' | 'info';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  createdAt: string; // ISO date string
}

export interface Recommendation {
  id: string;
  title: string;
  impact: string;
  description: string;
  priority: 'urgent' | 'high' | 'medium';
  risk: 'low' | 'medium' | 'high';
  category: string;
}

export interface AIInsight {
  summary: string;
  confidence: number; // 0-100
  keyMetrics: { label: string; value: string }[];
  recommendations: Recommendation[];
  generatedAt: string; // ISO date string
}

export interface DashboardSummary {
  kpis: KPIData[];
  alerts: AlertItem[];
  topRecommendations: Recommendation[];
  aiInsight: AIInsight;
}

export class DashboardService {
  private baseEndpoint = '/dashboard';

  /**
   * Get complete dashboard summary
   */
  async getDashboardSummary(): Promise<ApiResponse<DashboardSummary>> {
    return apiClient.get<DashboardSummary>(`${this.baseEndpoint}/summary`);
  }

  /**
   * Get KPI summary cards
   */
  async getKPISummary(): Promise<ApiResponse<KPIData[]>> {
    return apiClient.get<KPIData[]>(`${this.baseEndpoint}/kpis`);
  }

  /**
   * Get revenue trend over time
   */
  async getRevenueTrend(
    fromDate: string, 
    toDate: string,
    granularity: 'daily' | 'weekly' | 'monthly' = 'monthly'
  ): Promise<ApiResponse<RevenueTrend[]>> {
    return apiClient.get<RevenueTrend[]>(
      `${this.baseEndpoint}/revenue-trend`,
      {
        params: { fromDate, toDate, granularity }
      }
    );
  }

  /**
   * Get customer growth data
   */
  async getCustomerGrowth(
    fromDate: string, 
    toDate: string
  ): Promise<ApiResponse<CustomerGrowth[]>> {
    return apiClient.get<CustomerGrowth[]>(
      `${this.baseEndpoint}/customer-growth`,
      {
        params: { fromDate, toDate }
      }
    );
  }

  /**
   * Get active alerts
   */
  async getAlerts(
    priority?: string,
    pagination?: PaginatedRequest
  ): Promise<ApiResponse<{ items: AlertItem[]; meta: PaginationMeta }>> {
    return apiClient.get(
      `${this.baseEndpoint}/alerts`,
      {
        params: {
          ...(priority && { priority }),
          ...(pagination?.page && { page: String(pagination.page) }),
          ...(pagination?.perPage && { perPage: String(pagination.perPage) })
        }
      }
    );
  }

  /**
   * Get recommendations
   */
  async getRecommendations(
    category?: string,
    limit: number = 10
  ): Promise<ApiResponse<Recommendation[]>> {
    return apiClient.get<Recommendation[]>(
      `${this.baseEndpoint}/recommendations`,
      {
        params: {
          ...(category && { category }),
          limit: String(limit)
        }
      }
    );
  }

  /**
   * Get AI Executive Summary
   */
  async getAIInsight(): Promise<ApiResponse<AIInsight>> {
    return apiClient.get<AIInsight>(`${this.baseEndpoint}/ai-insight`);
  }
}

// Export singleton instance
export const dashboardService = new DashboardService();
export default dashboardService;

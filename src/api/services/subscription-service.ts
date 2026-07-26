/**
 * Subscription Service
 *
 * Handles subscription and payment API operations.
 */

import apiClient from '../client';
import { ApiResponse, RequestConfig } from '../types';

export interface Package {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  billingCycle: string;
  projectLimit: number;
  features: string[];
  sla?: string;
  isActive: boolean;
}

export interface Subscription {
  id: string;
  userId: string;
  packageId: string;
  status: string;
  startDate: string;
  endDate?: string;
  autoRenew: boolean;
  package: {
    name: string;
    projectLimit: number;
  };
}

export interface PaymentInitiation {
  paymentId: string;
  checkoutUrl: string;
  status: string;
}

export interface PaymentStatus {
  paymentId: string;
  status: string;
  amount: number;
  currency: string;
  subscriptionId: string;
  subscriptionStatus: string;
  providerTxnId?: string;
  paidAt?: string;
  createdAt: string;
}

export interface CreateSubscriptionDto {
  packageId: string;
}

export interface InitiatePaymentDto {
  subscriptionId: string;
  returnUrl: string;
}

export interface RetryPaymentDto {
  returnUrl: string;
}

export interface ManagedSubscription {
  id: string;
  userId: string;
  packageId: string;
  status: string;
  startDate: string;
  endDate: string | null;
  autoRenew: boolean;
  extraProjects: number;
  promotionCodeId: string | null;
  organization: { id: string; name: string } | null;
  package: { id: string; name: string; nameAr: string | null };
}

export interface ManagedSubscriptionListResponse {
  data: ManagedSubscription[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Coupon {
  id: string;
  code: string;
  type: string;
  discountValue?: number;
  maxDiscountAmount?: number;
  extraMonths?: number;
  extraProjects?: number;
  currency: string;
  maxUses?: number;
  usedCount: number;
  validFrom: string;
  validUntil?: string;
  status: string;
  applicablePackageIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCouponDto {
  code: string;
  type: string;
  discountValue?: number;
  maxDiscountAmount?: number;
  extraMonths?: number;
  extraProjects?: number;
  currency?: string;
  maxUses?: number;
  validFrom: string;
  validUntil?: string;
  applicablePackageIds?: string[];
}

/**
 * SubscriptionService class
 * Encapsulates all subscription and payment API operations.
 */
export class SubscriptionService {
  /**
   * Get list of active subscription packages
   * GET /api/v1/subscriptions/packages
   */
  async getPackages(config?: RequestConfig): Promise<ApiResponse<Package[]>> {
    return apiClient.get<Package[]>('/api/v1/subscriptions/packages', config);
  }

  /**
   * Create a new subscription (status: pending)
   * POST /api/v1/subscriptions
   */
  async createSubscription(
    data: CreateSubscriptionDto,
    config?: RequestConfig
  ): Promise<ApiResponse<Subscription>> {
    return apiClient.post<Subscription>('/api/v1/subscriptions', data, config);
  }

  /**
   * Get current active subscription
   * GET /api/v1/subscriptions/me
   */
  async getMySubscription(config?: RequestConfig): Promise<ApiResponse<Subscription>> {
    return apiClient.get<Subscription>('/api/v1/subscriptions/me', config);
  }

  /**
   * Initiate a Moyasar payment
   * POST /api/v1/subscriptions/payments
   */
  async initiatePayment(
    data: InitiatePaymentDto,
    config?: RequestConfig
  ): Promise<ApiResponse<PaymentInitiation>> {
    return apiClient.post<PaymentInitiation>('/api/v1/subscriptions/payments', data, config);
  }

  /**
   * Get payment status
   * GET /api/v1/subscriptions/payments/:id/status
   */
  async getPaymentStatus(
    paymentId: string,
    config?: RequestConfig
  ): Promise<ApiResponse<PaymentStatus>> {
    return apiClient.get<PaymentStatus>(`/api/v1/subscriptions/payments/${paymentId}/status`, config);
  }

  /**
   * Retry a failed/expired payment
   * POST /api/v1/subscriptions/payments/:id/retry
   */
  async retryPayment(
    paymentId: string,
    data: RetryPaymentDto,
    config?: RequestConfig
  ): Promise<ApiResponse<PaymentInitiation>> {
    return apiClient.post<PaymentInitiation>(`/api/v1/subscriptions/payments/${paymentId}/retry`, data, config);
  }

  /**
   * List subscriptions for project managers (admin)
   * GET /api/v1/admin/subscriptions
   */
  async getManagedSubscriptions(
    params?: Record<string, string | number | undefined>,
    config?: RequestConfig
  ): Promise<ApiResponse<ManagedSubscriptionListResponse>> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, String(value));
        }
      });
    }
    const query = searchParams.toString();
    return apiClient.get<ManagedSubscriptionListResponse>(
      `/api/v1/admin/subscriptions${query ? `?${query}` : ''}`,
      config
    );
  }

  /**
   * List coupons/promotion codes for project managers
   * GET /api/v1/admin/coupons
   */
  async getCoupons(
    params?: { status?: string; code?: string },
    config?: RequestConfig
  ): Promise<ApiResponse<Coupon[]>> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, String(value));
        }
      });
    }
    const query = searchParams.toString();
    return apiClient.get<Coupon[]>(`/api/v1/admin/coupons${query ? `?${query}` : ''}`, config);
  }

  /**
   * Create a coupon/promotion code
   * POST /api/v1/admin/coupons
   */
  async createCoupon(
    data: CreateCouponDto,
    config?: RequestConfig
  ): Promise<ApiResponse<Coupon>> {
    return apiClient.post<Coupon>('/api/v1/admin/coupons', data, config);
  }
}

// Export singleton instance
export const subscriptionService = new SubscriptionService();
export default subscriptionService;

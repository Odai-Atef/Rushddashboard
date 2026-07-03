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
}

// Export singleton instance
export const subscriptionService = new SubscriptionService();
export default subscriptionService;

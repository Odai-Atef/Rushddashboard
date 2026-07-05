/**
 * Notification Service
 *
 * Handles notification-related API operations.
 */

import apiClient from '../client';
import { ApiResponse, RequestConfig } from '../types';

export type NotificationPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type NotificationChannel = 'IN_APP' | 'PUSH' | 'EMAIL';
export type NotificationStatus = 'SENT' | 'DELIVERED' | 'READ';

export interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  priority: NotificationPriority;
  channel: NotificationChannel;
  status: NotificationStatus;
  payload?: Record<string, unknown>;
  readAt: string | null;
  deliveredAt: string;
  createdAt: string;
}

export interface NotificationRecipient {
  id: string;
  notificationId: string;
  userId: string;
  deliveryStatus: NotificationStatus;
  readAt: string | null;
  deliveredAt: string;
  failedAt: string | null;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationFilters {
  unreadOnly?: boolean;
  priority?: NotificationPriority;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
}

export interface NotificationsResponse {
  data: Notification[];
  total: number;
}

export interface UnreadCountResponse {
  count: number;
}

/**
 * NotificationService class
 * Encapsulates all notification API operations.
 */
export class NotificationService {
  private baseEndpoint = '/api/v1/notifications';

  /**
   * Get list of notifications
   * GET /api/v1/notifications
   */
  async getNotifications(filters?: NotificationFilters, config?: RequestConfig): Promise<ApiResponse<NotificationsResponse>> {
    const params: Record<string, string | number | boolean> = {};
    if (filters?.unreadOnly !== undefined) params.unreadOnly = filters.unreadOnly;
    if (filters?.priority) params.priority = filters.priority;
    if (filters?.fromDate) params.fromDate = filters.fromDate;
    if (filters?.toDate) params.toDate = filters.toDate;
    if (filters?.page !== undefined) params.page = filters.page;
    if (filters?.limit !== undefined) params.limit = filters.limit;

    return apiClient.get<NotificationsResponse>(this.baseEndpoint, { ...config, params });
  }

  /**
   * Get unread notifications count
   * GET /api/v1/notifications/unread-count
   */
  async getUnreadCount(config?: RequestConfig): Promise<ApiResponse<UnreadCountResponse>> {
    return apiClient.get<UnreadCountResponse>(`${this.baseEndpoint}/unread-count`, config);
  }

  /**
   * Mark a notification as read
   * PATCH /api/v1/notifications/:id/read
   */
  async markAsRead(id: string, config?: RequestConfig): Promise<ApiResponse<NotificationRecipient>> {
    return apiClient.patch<NotificationRecipient>(`${this.baseEndpoint}/${id}/read`, undefined, config);
  }
}

// Export singleton instance
export const notificationService = new NotificationService();

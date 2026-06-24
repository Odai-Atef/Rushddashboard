/**
 * Collaboration Service
 *
 * Handles project collaboration API operations: conversations, discussions,
 * and attachments. All list endpoints return the same paginated envelope shape.
 */

import apiClient from '../client';
import { ApiResponse, RequestConfig } from '../types';

export type ConversationType = 'PROJECT_GROUP' | 'DIRECT_MESSAGE' | 'SYSTEM_ALERT';
export type ConversationStatus = 'ACTIVE' | 'ARCHIVED' | 'MUTED';

export interface Conversation {
  id: string;
  projectId: string;
  title: string | null;
  type: ConversationType;
  status: ConversationStatus;
  createdByUserId: string;
  lastMessageAt: string | null;
  lastMessageText: string | null;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export type DiscussionStatus = 'OPEN' | 'RESOLVED' | 'CLOSED';

export interface Reply {
  id: string;
  discussionId: string;
  authorUserId: string;
  content: string;
  isAccepted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Discussion {
  id: string;
  projectId: string;
  section: string;
  title: string;
  content: string;
  authorUserId: string;
  status: DiscussionStatus;
  isPinned: boolean;
  replyCount: number;
  lastReplyAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DiscussionWithReplies extends Discussion {
  replies: Reply[];
}

export interface CreateDiscussionDto {
  section: string;
  title: string;
  content: string;
  attachmentIds?: string[];
}

export interface UpdateDiscussionDto {
  title?: string;
  content?: string;
}

export interface ChangeDiscussionStatusDto {
  status: DiscussionStatus;
}

export interface CreateReplyDto {
  content: string;
}

export type AttachmentType = 'DOCUMENT' | 'IMAGE' | 'VIDEO' | 'AUDIO' | 'OTHER';

export interface Attachment {
  id: string;
  projectId: string;
  fileId: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  attachmentType: AttachmentType;
  projectStage: string | null;
  uploadedByUserId: string;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type MessageType = 'TEXT' | 'IMAGE' | 'FILE' | 'VOICE' | 'SYSTEM';
export type MessageStatus = 'SENDING' | 'SENT' | 'DELIVERED' | 'READ' | 'FAILED';

export interface Message {
  id: string;
  conversationId: string;
  senderUserId: string;
  content: string;
  messageType: MessageType;
  status: MessageStatus;
  replyToId: string | null;
  isPinned: boolean;
  editedAt: string | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MessagesResponse {
  data: Message[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface CreateMessageDto {
  content: string;
  messageType?: MessageType;
  replyToId?: string;
  attachmentIds?: string[];
}

export interface UpdateMessageDto {
  content: string;
}

export interface MessageFilters {
  cursor?: string;
  limit?: number;
}

export interface ConversationFilters {
  page?: number;
  limit?: number;
  status?: ConversationStatus;
}

export interface DiscussionFilters {
  page?: number;
  limit?: number;
  section?: string;
  status?: DiscussionStatus;
}

export interface AttachmentFilters {
  page?: number;
  limit?: number;
  type?: AttachmentType;
}

type FilterValue = string | number | boolean | undefined;

function buildQueryParams(
  filters: Record<string, FilterValue>
): Record<string, string | number | undefined> {
  const params: Record<string, string | number | undefined> = {};

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params[key] = typeof value === 'boolean' ? (value ? 'true' : 'false') : value;
    }
  });

  return params;
}

function filtersToRecord(filters: ConversationFilters): Record<string, FilterValue>;
function filtersToRecord(filters: DiscussionFilters): Record<string, FilterValue>;
function filtersToRecord(filters: AttachmentFilters): Record<string, FilterValue>;
function filtersToRecord(filters: MessageFilters): Record<string, FilterValue>;
function filtersToRecord(
  filters: ConversationFilters | DiscussionFilters | AttachmentFilters | MessageFilters
): Record<string, FilterValue> {
  return { ...filters } as Record<string, FilterValue>;
}

export class CollaborationService {
  /**
   * List project conversations
   * GET /api/v1/projects/:projectId/conversations
   */
  async getProjectConversations(
    projectId: string,
    filters: ConversationFilters = {},
    config?: RequestConfig
  ): Promise<ApiResponse<PaginatedResponse<Conversation>>> {
    return apiClient.get<PaginatedResponse<Conversation>>(
      `/api/v1/projects/${projectId}/conversations`,
      {
        ...config,
        params: buildQueryParams(filtersToRecord(filters)),
      }
    );
  }

  /**
   * Get a single conversation by ID
   * GET /api/v1/projects/:projectId/conversations/:conversationId
   */
  async getConversationById(
    projectId: string,
    conversationId: string,
    config?: RequestConfig
  ): Promise<ApiResponse<Conversation>> {
    return apiClient.get<Conversation>(
      `/api/v1/projects/${projectId}/conversations/${conversationId}`,
      config
    );
  }

  /**
   * List project discussions
   * GET /api/v1/projects/:projectId/discussions
   */
  async getProjectDiscussions(
    projectId: string,
    filters: DiscussionFilters = {},
    config?: RequestConfig
  ): Promise<ApiResponse<PaginatedResponse<Discussion>>> {
    return apiClient.get<PaginatedResponse<Discussion>>(
      `/api/v1/projects/${projectId}/discussions`,
      {
        ...config,
        params: buildQueryParams(filtersToRecord(filters)),
      }
    );
  }

  /**
   * Get a single discussion with replies
   * GET /api/v1/projects/:projectId/discussions/:discussionId
   */
  async getDiscussionById(
    projectId: string,
    discussionId: string,
    config?: RequestConfig
  ): Promise<ApiResponse<DiscussionWithReplies>> {
    return apiClient.get<DiscussionWithReplies>(
      `/api/v1/projects/${projectId}/discussions/${discussionId}`,
      config
    );
  }

  /**
   * Create a new discussion
   * POST /api/v1/projects/:projectId/discussions
   */
  async createDiscussion(
    projectId: string,
    dto: CreateDiscussionDto,
    config?: RequestConfig
  ): Promise<ApiResponse<Discussion>> {
    return apiClient.post<Discussion>(
      `/api/v1/projects/${projectId}/discussions`,
      dto,
      config
    );
  }

  /**
   * Update a discussion
   * PUT /api/v1/projects/:projectId/discussions/:discussionId
   */
  async updateDiscussion(
    projectId: string,
    discussionId: string,
    dto: UpdateDiscussionDto,
    config?: RequestConfig
  ): Promise<ApiResponse<Discussion>> {
    return apiClient.put<Discussion>(
      `/api/v1/projects/${projectId}/discussions/${discussionId}`,
      dto,
      config
    );
  }

  /**
   * Change discussion status
   * PUT /api/v1/projects/:projectId/discussions/:discussionId/status
   */
  async changeDiscussionStatus(
    projectId: string,
    discussionId: string,
    dto: ChangeDiscussionStatusDto,
    config?: RequestConfig
  ): Promise<ApiResponse<Discussion>> {
    return apiClient.put<Discussion>(
      `/api/v1/projects/${projectId}/discussions/${discussionId}/status`,
      dto,
      config
    );
  }

  /**
   * Delete a discussion
   * DELETE /api/v1/projects/:projectId/discussions/:discussionId
   */
  async deleteDiscussion(
    projectId: string,
    discussionId: string,
    config?: RequestConfig
  ): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(
      `/api/v1/projects/${projectId}/discussions/${discussionId}`,
      config
    );
  }

  /**
   * Add a reply to a discussion
   * POST /api/v1/projects/:projectId/discussions/:discussionId/replies
   */
  async createReply(
    projectId: string,
    discussionId: string,
    dto: CreateReplyDto,
    config?: RequestConfig
  ): Promise<ApiResponse<Reply>> {
    return apiClient.post<Reply>(
      `/api/v1/projects/${projectId}/discussions/${discussionId}/replies`,
      dto,
      config
    );
  }

  /**
   * Mark a reply as accepted solution
   * PUT /api/v1/projects/:projectId/discussions/:discussionId/replies/:replyId/accept
   */
  async acceptReply(
    projectId: string,
    discussionId: string,
    replyId: string,
    config?: RequestConfig
  ): Promise<ApiResponse<Reply>> {
    return apiClient.put<Reply>(
      `/api/v1/projects/${projectId}/discussions/${discussionId}/replies/${replyId}/accept`,
      {},
      config
    );
  }

  /**
   * List project attachments
   * GET /api/v1/projects/:projectId/attachments
   */
  async getProjectAttachments(
    projectId: string,
    filters: AttachmentFilters = {},
    config?: RequestConfig
  ): Promise<ApiResponse<PaginatedResponse<Attachment>>> {
    return apiClient.get<PaginatedResponse<Attachment>>(
      `/api/v1/projects/${projectId}/attachments`,
      {
        ...config,
        params: buildQueryParams(filtersToRecord(filters)),
      }
    );
  }

  /**
   * List messages in a conversation
   * GET /api/v1/projects/:projectId/conversations/:conversationId/messages
   */
  async getConversationMessages(
    projectId: string,
    conversationId: string,
    filters: MessageFilters = {},
    config?: RequestConfig
  ): Promise<ApiResponse<MessagesResponse>> {
    return apiClient.get<MessagesResponse>(
      `/api/v1/projects/${projectId}/conversations/${conversationId}/messages`,
      {
        ...config,
        params: buildQueryParams(filtersToRecord(filters)),
      }
    );
  }

  /**
   * Send a message in a conversation
   * POST /api/v1/projects/:projectId/conversations/:conversationId/messages
   */
  async sendMessage(
    projectId: string,
    conversationId: string,
    dto: CreateMessageDto,
    config?: RequestConfig
  ): Promise<ApiResponse<Message>> {
    return apiClient.post<Message>(
      `/api/v1/projects/${projectId}/conversations/${conversationId}/messages`,
      dto,
      config
    );
  }

  /**
   * Edit an existing message
   * PUT /api/v1/projects/:projectId/messages/:messageId
   */
  async editMessage(
    projectId: string,
    messageId: string,
    dto: UpdateMessageDto,
    config?: RequestConfig
  ): Promise<ApiResponse<Message>> {
    return apiClient.put<Message>(
      `/api/v1/projects/${projectId}/messages/${messageId}`,
      dto,
      config
    );
  }

  /**
   * Soft-delete a message
   * DELETE /api/v1/projects/:projectId/messages/:messageId
   */
  async deleteMessage(
    projectId: string,
    messageId: string,
    config?: RequestConfig
  ): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(
      `/api/v1/projects/${projectId}/messages/${messageId}`,
      config
    );
  }

  /**
   * Mark a message as read
   * POST /api/v1/projects/:projectId/messages/:messageId/read
   */
  async markMessageAsRead(
    projectId: string,
    messageId: string,
    config?: RequestConfig
  ): Promise<ApiResponse<{ success: boolean }>> {
    return apiClient.post<{ success: boolean }>(
      `/api/v1/projects/${projectId}/messages/${messageId}/read`,
      {},
      config
    );
  }
}

export const collaborationService = new CollaborationService();
export default collaborationService;

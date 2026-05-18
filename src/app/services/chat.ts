import { apiFetch } from './api';
import {
  type ChatSessionsResponse,
  type ChatMessagesResponse,
  type SendMessageRequest,
  type SendMessageResponse,
  type CreateSessionRequest,
  type CreateSessionResponse,
  ChatSessionsResponseSchema,
  ChatMessagesResponseSchema,
  SendMessageResponseSchema,
  CreateSessionResponseSchema,
} from '../types/chat';

const CHAT_BASE_URL = '/chat';

export async function getChatSessions(
  limit = 20,
  offset = 0
): Promise<ChatSessionsResponse> {
  const response = await apiFetch<ChatSessionsResponse>(
    `${CHAT_BASE_URL}/sessions?limit=${limit}&offset=${offset}`
  );
  return ChatSessionsResponseSchema.parse(response);
}

export async function getChatSessionMessages(
  sessionId: string,
  limit = 50,
  offset = 0
): Promise<ChatMessagesResponse> {
  const response = await apiFetch<ChatMessagesResponse>(
    `${CHAT_BASE_URL}/sessions/${sessionId}/messages?limit=${limit}&offset=${offset}`
  );
  return ChatMessagesResponseSchema.parse(response);
}

export async function createChatSession(
  request: CreateSessionRequest
): Promise<CreateSessionResponse> {
  const response = await apiFetch<CreateSessionResponse>(
    `${CHAT_BASE_URL}/sessions`,
    {
      method: 'POST',
      body: JSON.stringify(request),
    }
  );
  return CreateSessionResponseSchema.parse(response);
}

export async function sendChatMessage(
  sessionId: string,
  request: SendMessageRequest
): Promise<SendMessageResponse> {
  const response = await apiFetch<SendMessageResponse>(
    `${CHAT_BASE_URL}/sessions/${sessionId}/messages`,
    {
      method: 'POST',
      body: JSON.stringify(request),
    }
  );
  return SendMessageResponseSchema.parse(response);
}

export async function deleteChatSession(sessionId: string): Promise<void> {
  await apiFetch<void>(`${CHAT_BASE_URL}/sessions/${sessionId}`, {
    method: 'DELETE',
  });
}
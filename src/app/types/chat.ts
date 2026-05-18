import { z } from 'zod';

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant';
  content: string;
  status?: 'pending' | 'sent' | 'failed';
  createdAt: string;
}

export interface SendMessageRequest {
  content: string;
}

export interface SendMessageResponse {
  userMessage: ChatMessage;
  assistantMessage: ChatMessage;
}

export interface CreateSessionRequest {
  title?: string;
}

export interface CreateSessionResponse {
  session: ChatSession;
}

export interface ChatSessionsResponse {
  sessions: ChatSession[];
  total: number;
}

export interface ChatMessagesResponse {
  messages: ChatMessage[];
  total: number;
}

export const ChatSessionSchema = z.object({
  id: z.string().uuid(),
  title: z.string().max(200),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  messageCount: z.number().int().nonnegative(),
});

export const ChatMessageSchema = z.object({
  id: z.string().uuid(),
  sessionId: z.string().uuid(),
  role: z.enum(['user', 'assistant']),
  content: z.string().max(10000),
  status: z.enum(['pending', 'sent', 'failed']).optional(),
  createdAt: z.string().datetime(),
});

export const SendMessageRequestSchema = z.object({
  content: z.string().min(1).max(10000),
});

export const CreateSessionRequestSchema = z.object({
  title: z.string().max(200).optional(),
});

export const ChatSessionsResponseSchema = z.object({
  sessions: z.array(ChatSessionSchema),
  total: z.number().int().nonnegative(),
});

export const ChatMessagesResponseSchema = z.object({
  messages: z.array(ChatMessageSchema),
  total: z.number().int().nonnegative(),
});

export const SendMessageResponseSchema = z.object({
  userMessage: ChatMessageSchema,
  assistantMessage: ChatMessageSchema,
});

export const CreateSessionResponseSchema = z.object({
  session: ChatSessionSchema,
});
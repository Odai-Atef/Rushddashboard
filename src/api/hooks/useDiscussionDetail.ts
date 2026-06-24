/**
 * useDiscussionDetail Hook
 *
 * Manages a single discussion and its replies: detail loading, optimistic
 * reply creation, accepted-solution marking, status changes, and deletion.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  collaborationService,
  ChangeDiscussionStatusDto,
  CreateDiscussionDto,
  CreateReplyDto,
  Discussion,
  DiscussionWithReplies,
  Reply,
  UpdateDiscussionDto,
} from '@/api/services/collaboration-service';
import { ApiResponse } from '@/api/types';
import { getCollaborationErrorMessage } from '@/app/lib/error-messages';

export interface OptimisticReply extends Reply {
  pending: boolean;
  failed: boolean;
  originalContent: string;
}

export interface DiscussionDetailState {
  discussion: Discussion | null;
  replies: (Reply | OptimisticReply)[];
  isLoading: boolean;
  isMutating: boolean;
  error: string | null;
}

export interface UseDiscussionDetailReturn extends DiscussionDetailState {
  load: () => Promise<void>;
  createDiscussion: (dto: CreateDiscussionDto) => Promise<Discussion | null>;
  updateDiscussion: (dto: UpdateDiscussionDto) => Promise<void>;
  changeStatus: (status: ChangeDiscussionStatusDto['status']) => Promise<void>;
  deleteDiscussion: () => Promise<boolean>;
  createReply: (content: string) => Promise<void>;
  retryReply: (tempId: string) => Promise<void>;
  acceptReply: (replyId: string) => Promise<void>;
  clearError: () => void;
}

function generateTempId(): string {
  return `optimistic-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function isOptimisticReply(reply: Reply | OptimisticReply): reply is OptimisticReply {
  return 'pending' in reply;
}

function sortReplies(replies: (Reply | OptimisticReply)[]): (Reply | OptimisticReply)[] {
  return [...replies].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
}

export function useDiscussionDetail(
  projectId: string | undefined,
  discussionId: string | null
): UseDiscussionDetailReturn {
  const [state, setState] = useState<DiscussionDetailState>({
    discussion: null,
    replies: [],
    isLoading: false,
    isMutating: false,
    error: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef(true);

  const cleanupRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  const load = useCallback(async () => {
    if (!projectId || !discussionId) return;

    cleanupRequest();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response: ApiResponse<DiscussionWithReplies> =
        await collaborationService.getDiscussionById(projectId, discussionId, {
          signal: controller.signal,
        });

      if (!isMountedRef.current) return;

      const { replies, ...discussion } = response.data;
      setState({
        discussion,
        replies: sortReplies(replies),
        isLoading: false,
        isMutating: false,
        error: null,
      });
    } catch (err) {
      if ((err as Error)?.name === 'AbortError' && controller.signal.aborted) {
        return;
      }
      if (!isMountedRef.current) return;
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: getCollaborationErrorMessage(err),
      }));
    } finally {
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
    }
  }, [projectId, discussionId, cleanupRequest]);

  const createDiscussion = useCallback(
    async (dto: CreateDiscussionDto): Promise<Discussion | null> => {
      if (!projectId) return null;

      setState((prev) => ({ ...prev, isMutating: true, error: null }));
      try {
        const response = await collaborationService.createDiscussion(projectId, dto);
        if (!isMountedRef.current) return null;
        return response.data;
      } catch (err) {
        if (!isMountedRef.current) return null;
        setState((prev) => ({ ...prev, error: getCollaborationErrorMessage(err) }));
        return null;
      } finally {
        setState((prev) => ({ ...prev, isMutating: false }));
      }
    },
    [projectId]
  );

  const updateDiscussion = useCallback(
    async (dto: UpdateDiscussionDto) => {
      if (!projectId || !discussionId) return;

      setState((prev) => ({ ...prev, isMutating: true, error: null }));
      try {
        const response = await collaborationService.updateDiscussion(
          projectId,
          discussionId,
          dto
        );
        if (!isMountedRef.current) return;
        setState((prev) => ({
          ...prev,
          discussion: response.data,
          isMutating: false,
        }));
      } catch (err) {
        if (!isMountedRef.current) return;
        setState((prev) => ({
          ...prev,
          isMutating: false,
          error: getCollaborationErrorMessage(err),
        }));
      }
    },
    [projectId, discussionId]
  );

  const changeStatus = useCallback(
    async (status: ChangeDiscussionStatusDto['status']) => {
      if (!projectId || !discussionId) return;

      const previousStatus = state.discussion?.status;
      setState((prev) => ({
        ...prev,
        isMutating: true,
        error: null,
        discussion: prev.discussion ? { ...prev.discussion, status } : prev.discussion,
      }));

      try {
        const response = await collaborationService.changeDiscussionStatus(
          projectId,
          discussionId,
          { status }
        );
        if (!isMountedRef.current) return;
        setState((prev) => ({
          ...prev,
          discussion: response.data,
          isMutating: false,
        }));
      } catch (err) {
        if (!isMountedRef.current) return;
        setState((prev) => ({
          ...prev,
          isMutating: false,
          error: getCollaborationErrorMessage(err),
          discussion: prev.discussion
            ? { ...prev.discussion, status: previousStatus ?? prev.discussion.status }
            : prev.discussion,
        }));
      }
    },
    [projectId, discussionId, state.discussion?.status]
  );

  const deleteDiscussion = useCallback(async (): Promise<boolean> => {
    if (!projectId || !discussionId) return false;

    setState((prev) => ({ ...prev, isMutating: true, error: null }));
    try {
      await collaborationService.deleteDiscussion(projectId, discussionId);
      if (!isMountedRef.current) return false;
      setState({
        discussion: null,
        replies: [],
        isLoading: false,
        isMutating: false,
        error: null,
      });
      return true;
    } catch (err) {
      if (!isMountedRef.current) return false;
      setState((prev) => ({
        ...prev,
        isMutating: false,
        error: getCollaborationErrorMessage(err),
      }));
      return false;
    }
  }, [projectId, discussionId]);

  const createReply = useCallback(
    async (content: string) => {
      if (!projectId || !discussionId || !content.trim()) return;

      const trimmed = content.trim();
      const tempId = generateTempId();
      const now = new Date().toISOString();

      const optimisticReply: OptimisticReply = {
        id: tempId,
        discussionId,
        authorUserId: 'me',
        content: trimmed,
        isAccepted: false,
        createdAt: now,
        updatedAt: now,
        pending: true,
        failed: false,
        originalContent: trimmed,
      };

      setState((prev) => ({
        ...prev,
        isMutating: true,
        error: null,
        replies: sortReplies([...prev.replies, optimisticReply]),
      }));

      try {
        const dto: CreateReplyDto = { content: trimmed };
        const response = await collaborationService.createReply(projectId, discussionId, dto);
        if (!isMountedRef.current) return;
        const created = response.data;
        setState((prev) => ({
          ...prev,
          isMutating: false,
          replies: sortReplies(
            prev.replies.map((r) => (r.id === tempId ? created : r))
          ),
          discussion: prev.discussion
            ? {
                ...prev.discussion,
                replyCount: prev.discussion.replyCount + 1,
                lastReplyAt: created.createdAt,
                updatedAt: created.createdAt,
              }
            : prev.discussion,
        }));
      } catch (err) {
        if (!isMountedRef.current) return;
        setState((prev) => ({
          ...prev,
          isMutating: false,
          error: getCollaborationErrorMessage(err),
          replies: prev.replies.map((r) =>
            r.id === tempId ? { ...r, pending: false, failed: true } : r
          ),
        }));
      }
    },
    [projectId, discussionId]
  );

  const retryReply = useCallback(
    async (tempId: string) => {
      if (!projectId || !discussionId) return;

      const reply = state.replies.find(
        (r): r is OptimisticReply => r.id === tempId && isOptimisticReply(r)
      );
      if (!reply || !reply.failed) return;

      const content = reply.originalContent;

      setState((prev) => ({
        ...prev,
        isMutating: true,
        error: null,
        replies: prev.replies.map((r) =>
          r.id === tempId ? { ...r, pending: true, failed: false } : r
        ),
      }));

      try {
        const dto: CreateReplyDto = { content };
        const response = await collaborationService.createReply(projectId, discussionId, dto);
        if (!isMountedRef.current) return;
        const created = response.data;
        setState((prev) => ({
          ...prev,
          isMutating: false,
          replies: sortReplies(
            prev.replies.map((r) => (r.id === tempId ? created : r))
          ),
          discussion: prev.discussion
            ? {
                ...prev.discussion,
                replyCount: prev.discussion.replyCount + 1,
                lastReplyAt: created.createdAt,
                updatedAt: created.createdAt,
              }
            : prev.discussion,
        }));
      } catch (err) {
        if (!isMountedRef.current) return;
        setState((prev) => ({
          ...prev,
          isMutating: false,
          error: getCollaborationErrorMessage(err),
          replies: prev.replies.map((r) =>
            r.id === tempId ? { ...r, pending: false, failed: true } : r
          ),
        }));
      }
    },
    [projectId, discussionId, state.replies]
  );

  const acceptReply = useCallback(
    async (replyId: string) => {
      if (!projectId || !discussionId) return;

      setState((prev) => ({
        ...prev,
        isMutating: true,
        error: null,
        replies: prev.replies.map((r) =>
          r.id === replyId ? { ...r, isAccepted: true } : { ...r, isAccepted: false }
        ),
      }));

      try {
        const response = await collaborationService.acceptReply(
          projectId,
          discussionId,
          replyId
        );
        if (!isMountedRef.current) return;
        const accepted = response.data;
        setState((prev) => ({
          ...prev,
          isMutating: false,
          replies: prev.replies.map((r) =>
            r.id === accepted.id ? accepted : { ...r, isAccepted: false }
          ),
        }));
      } catch (err) {
        if (!isMountedRef.current) return;
        setState((prev) => ({
          ...prev,
          isMutating: false,
          error: getCollaborationErrorMessage(err),
        }));
        load();
      }
    },
    [projectId, discussionId, load]
  );

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  useEffect(() => {
    setState({
      discussion: null,
      replies: [],
      isLoading: false,
      isMutating: false,
      error: null,
    });
    if (projectId && discussionId) {
      load();
    }
    return () => {
      isMountedRef.current = false;
      cleanupRequest();
    };
  }, [projectId, discussionId, load, cleanupRequest]);

  return {
    ...state,
    load,
    createDiscussion,
    updateDiscussion,
    changeStatus,
    deleteDiscussion,
    createReply,
    retryReply,
    acceptReply,
    clearError,
  };
}

export default useDiscussionDetail;

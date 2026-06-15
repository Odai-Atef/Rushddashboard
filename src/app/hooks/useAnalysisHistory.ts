import { useState, useCallback, useRef, useEffect } from 'react';
import { analysisService, AnalysisMessage } from '@/api/services/analysis-service';
import { StreamMessage } from '@/app/hooks/useAnalysisStreaming';

export type AnalysisHistoryStatus = 'COMPLETED' | 'RUNNING' | 'FAILED' | 'PENDING';

export interface AnalysisHistoryEntry {
  id: string;
  sessionId: string | null;
  title: string;
  summary: string | null;
  status: AnalysisHistoryStatus;
  durationMs: number | null;
  startedAt: string;
  completedAt: string | null;
  insightsCount: number | null;
  recommendationsCount: number | null;
}

export interface HistoryPaginationState {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

export interface AnalysisSessionDetail {
  id: string;
  title: string;
  status: AnalysisHistoryStatus;
  insights: Array<{
    id: string;
    title: string;
    description: string;
    type: string | null;
  }>;
  results: Array<{
    id: string;
    insightText: string;
    dimensionData: Record<string, any> | null;
    recommendationText: string | null;
  }>;
}

export interface HistoryListState {
  entries: AnalysisHistoryEntry[];
  pagination: HistoryPaginationState;
  error: string | null;
  selectedId: string | null;
  isLoading: boolean;
  isLoadingDetail: boolean;
  detailError: string | null;
  detailSession: AnalysisSessionDetail | null;
}

export interface UseAnalysisHistoryReturn extends HistoryListState {
  fetchHistory: (page?: number) => Promise<void>;
  loadSession: (runId: string, sessionId?: string) => Promise<StreamMessage[]>;
  retry: () => Promise<void>;
  reset: () => void;
}

let messageIdCounter = 0;
function generateMessageId(): string {
  return `msg-${Date.now()}-${++messageIdCounter}`;
}

function formatDateTime(isoDate: string): { date: string; time: string } {
  const d = new Date(isoDate);
  const date = d.toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const time = d.toLocaleTimeString('ar-SA', {
    hour: '2-digit',
    minute: '2-digit',
  });
  return { date, time };
}

function getPreview(entry: AnalysisHistoryEntry): string {
  if (entry.summary) {
    return entry.summary.length > 100 ? entry.summary.slice(0, 100) + '...' : entry.summary;
  }
  return '';
}

function sessionDetailToMessages(detail: AnalysisSessionDetail): StreamMessage[] {
  const messages: StreamMessage[] = [];
  const baseTimestamp = detail.completedAt
    ? new Date(detail.completedAt)
    : new Date();

  // Add a system/user context message
  messages.push({
    id: generateMessageId(),
    role: 'user',
    content: detail.title,
    timestamp: baseTimestamp,
  });

  // Convert insights to assistant messages using `description` (corrected DTO field)
  detail.insights?.forEach((insight, index) => {
    messages.push({
      id: generateMessageId(),
      role: 'assistant',
      content: `**${insight.title}**\n\n${insight.description}`,
      isStreaming: false,
      timestamp: new Date(baseTimestamp.getTime() + index * 1000),
    });
  });

  // Convert results to assistant messages
  detail.results?.forEach((result, index) => {
    if (result.insightText) {
      messages.push({
        id: generateMessageId(),
        role: 'assistant',
        content: result.insightText,
        isStreaming: false,
        timestamp: new Date(baseTimestamp.getTime() + (index + (detail.insights?.length || 0)) * 1000),
      });
    }
    if (result.recommendationText) {
      messages.push({
        id: generateMessageId(),
        role: 'assistant',
        content: `**التوصية:**\n\n${result.recommendationText}`,
        isStreaming: false,
        timestamp: new Date(baseTimestamp.getTime() + (index + (detail.insights?.length || 0) + 1) * 1000),
      });
    }
  });

  return messages;
}

function messagesToStreamMessages(analysisMessages: AnalysisMessage[]): StreamMessage[] {
  if (!analysisMessages || analysisMessages.length === 0) {
    return [];
  }

  // Sort by sequenceNo ascending; fall back to createdAt for stability
  const sorted = [...analysisMessages].sort((a, b) => {
    if (a.sequenceNo !== b.sequenceNo) {
      return a.sequenceNo - b.sequenceNo;
    }
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  return sorted.map((msg) => {
    const roleLower = msg.role?.toLowerCase() ?? '';
    const validRole: StreamMessage['role'] =
      roleLower === 'user' || roleLower === 'assistant' || roleLower === 'system'
        ? roleLower
        : 'assistant';

    return {
      id: msg.id || generateMessageId(),
      role: validRole,
      content: msg.content ?? '',
      isStreaming: false,
      timestamp: new Date(msg.createdAt || Date.now()),
    };
  });
}

export function useAnalysisHistory(): UseAnalysisHistoryReturn {
  const [state, setState] = useState<HistoryListState>({
    entries: [],
    pagination: {
      page: 1,
      limit: 20,
      total: 0,
      hasMore: true,
    },
    error: null,
    selectedId: null,
    isLoading: false,
    isLoadingDetail: false,
    detailError: null,
    detailSession: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const detailAbortControllerRef = useRef<AbortController | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
      detailAbortControllerRef.current?.abort();
    };
  }, []);

  const fetchHistory = useCallback(async (page?: number) => {
    // Always read from current state via functional update to avoid stale closure
    let targetPage = page ?? 1;
    let currentLimit = 20;
    let hasMore = true;
    let isCurrentlyLoading = false;

    setState(prev => {
      currentLimit = prev.pagination?.limit ?? 20;
      hasMore = prev.pagination?.hasMore ?? true;
      isCurrentlyLoading = prev.isLoading;
      targetPage = page ?? prev.pagination?.page ?? 1;
      return prev;
    });

    // Prevent concurrent fetches
    if (isCurrentlyLoading) return;
    // Prevent fetching if no more pages (only when requesting a specific page > 1)
    if (page && page > 1 && !hasMore) return;

    // Abort any in-flight request
    abortControllerRef.current?.abort();
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
    }));

    try {
      const response = await analysisService.getHistory(targetPage, currentLimit);
      const { data, meta } = response.data;

      if (abortController.signal.aborted) return;

      setState(prev => ({
        ...prev,
        entries: targetPage === 1 ? data : [...prev.entries, ...data],
        pagination: {
          page: targetPage,
          limit: meta?.limit ?? currentLimit,
          total: meta?.total ?? data.length,
          hasMore: meta?.hasMore ?? false,
        },
        isLoading: false,
        error: null,
      }));
    } catch (err: any) {
      if (abortController.signal.aborted) return;

      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err?.message || 'فشل في تحميل سجل التحليلات',
      }));
    } finally {
      if (abortControllerRef.current === abortController) {
        abortControllerRef.current = null;
      }
    }
  }, []);

  const loadSession = useCallback(async (runId: string, sessionId?: string): Promise<StreamMessage[]> => {
    // Abort any in-flight detail request
    detailAbortControllerRef.current?.abort();
    const abortController = new AbortController();
    detailAbortControllerRef.current = abortController;

    setState(prev => ({
      ...prev,
      isLoadingDetail: true,
      detailError: null,
      selectedId: runId,
    }));

    try {
      // Primary: try to load actual chat messages via sessionId
      const effectiveSessionId = sessionId || runId;
      if (effectiveSessionId) {
        try {
          const msgResponse = await analysisService.getSessionMessages(effectiveSessionId);
          if (abortController.signal.aborted) return [];

          const messages = messagesToStreamMessages(msgResponse.data);

          setState(prev => ({
            ...prev,
            isLoadingDetail: false,
            detailError: null,
          }));

          return messages;
        } catch (sessionErr: any) {
          // If 404 or endpoint unavailable, fall back to legacy behavior
          console.warn('[History] getSessionMessages failed, falling back to getRunDetail:', sessionErr?.message || sessionErr);
        }
      }

      // Fallback: load structured run detail and reconstruct messages
      const response = await analysisService.getRunDetail(runId);
      const detail = response.data;

      if (abortController.signal.aborted) return [];

      const messages = sessionDetailToMessages(detail);

      setState(prev => ({
        ...prev,
        isLoadingDetail: false,
        detailError: null,
        detailSession: detail,
      }));

      return messages;
    } catch (err: any) {
      if (abortController.signal.aborted) return [];

      setState(prev => ({
        ...prev,
        isLoadingDetail: false,
        detailError: err?.message || 'فشل في تحميل تفاصيل التحليل',
      }));

      return [];
    } finally {
      if (detailAbortControllerRef.current === abortController) {
        detailAbortControllerRef.current = null;
      }
    }
  }, []);

  const retry = useCallback(async () => {
    await fetchHistory(1);
  }, [fetchHistory]);

  const reset = useCallback(() => {
    abortControllerRef.current?.abort();
    detailAbortControllerRef.current?.abort();
    setState({
      entries: [],
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        hasMore: true,
      },
      error: null,
      selectedId: null,
      isLoading: false,
      isLoadingDetail: false,
      detailError: null,
      detailSession: null,
    });
  }, []);

  return {
    ...state,
    fetchHistory,
    loadSession,
    retry,
    reset,
  };
}

export { formatDateTime, getPreview };
export default useAnalysisHistory;

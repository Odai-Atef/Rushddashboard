import { useState, useCallback, useRef, useEffect } from 'react';
import { analysisService } from '@/api/services/analysis-service';
import { StreamMessage } from '@/app/hooks/useAnalysisStreaming';

export type AnalysisHistoryStatus = 'COMPLETED' | 'RUNNING' | 'FAILED' | 'PENDING';

export interface AnalysisHistoryEntry {
  id: string;
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
    content: string;
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
  loadSession: (runId: string) => Promise<StreamMessage[]>;
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

  // Convert insights to assistant messages
  detail.insights?.forEach((insight, index) => {
    messages.push({
      id: generateMessageId(),
      role: 'assistant',
      content: `**${insight.title}**\n\n${insight.content}`,
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
    const targetPage = page ?? state.pagination.page;

    // Prevent concurrent fetches
    if (state.isLoading) return;
    // Prevent fetching if no more pages
    if (page && page > 1 && !state.pagination.hasMore) return;

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
      const response = await analysisService.getHistory(targetPage, state.pagination.limit);
      const { data, meta } = response.data;

      if (abortController.signal.aborted) return;

      setState(prev => ({
        ...prev,
        entries: targetPage === 1 ? data : [...prev.entries, ...data],
        pagination: {
          page: targetPage,
          limit: meta.limit,
          total: meta.total,
          hasMore: meta.hasMore,
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
  }, [state.pagination.page, state.pagination.limit, state.pagination.hasMore, state.isLoading]);

  const loadSession = useCallback(async (runId: string): Promise<StreamMessage[]> => {
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

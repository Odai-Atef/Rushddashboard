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
  startedAt: string | null;
  completedAt: string | null;
  createdAt?: string | null;
  insightsCount: number | null;
  recommendationsCount: number | null;
}

export interface HistoryPaginationState {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

export interface AnalysisInsight {
  id: string;
  analysisRunId: string;
  categoryId: string | null;
  title: string;
  titleAr: string | null;
  description: string;
  descriptionAr: string | null;
  type: string | null;
  insightType: string | null;
  confidenceScore: number | null;
  recommendation: string | null;
  recommendationText: string | null;
  sortOrder: number;
  generatedAt: string;
  createdAt: string;
}

export interface AnalysisSessionDetail {
  id: string;
  title: string;
  summary: string | null;
  status: AnalysisHistoryStatus;
  insights: AnalysisInsight[];
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
  loadSession: (runId: string, sessionId?: string | null) => Promise<StreamMessage[]>;
  loadRunDetail: (runId: string) => Promise<AnalysisSessionDetail | null>;
  retry: () => Promise<void>;
  reset: () => void;
}

let messageIdCounter = 0;
function generateMessageId(): string {
  return `msg-${Date.now()}-${++messageIdCounter}`;
}

function formatDateTime(isoDate: string | null | undefined): { date: string; time: string; fullDateTime: string } {
  const dateSource = isoDate || '';
  const d = dateSource ? new Date(dateSource) : new Date();
  if (!dateSource || Number.isNaN(d.getTime())) {
    return { date: '-', time: '-', fullDateTime: '-' };
  }
  const date = d.toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const time = d.toLocaleTimeString('ar-SA', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const fullDateTime = d.toLocaleString('ar-SA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
  return { date, time, fullDateTime };
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
    const title = insight.titleAr || insight.title;
    const description = insight.descriptionAr || insight.description;
    const recommendation = insight.recommendationText || insight.recommendation;
    let content = `**${title}**\n\n${description}`;
    if (recommendation) {
      content += `\n\n**التوصية:**\n\n${recommendation}`;
    }
    messages.push({
      id: generateMessageId(),
      role: 'assistant',
      content,
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
      isStreaming: msg.isStreaming ?? false,
      timestamp: new Date(msg.createdAt || Date.now()),
      data: msg.data,
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

      // Ensure newest items appear first regardless of API order.
      const sortedData = [...data].sort((a, b) => {
        const aDate = a.startedAt || (a as any).createdAt || '';
        const bDate = b.startedAt || (b as any).createdAt || '';
        return new Date(bDate).getTime() - new Date(aDate).getTime();
      });

      setState(prev => ({
        ...prev,
        entries: targetPage === 1 ? sortedData : [...prev.entries, ...sortedData],
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

  const loadRunDetail = useCallback(async (runId: string): Promise<AnalysisSessionDetail | null> => {
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
      const response = await analysisService.getHistoryRunDetail(runId);
      const detail = response.data;

      if (abortController.signal.aborted) return null;

      setState(prev => ({
        ...prev,
        isLoadingDetail: false,
        detailError: null,
        detailSession: detail,
      }));

      return detail;
    } catch (err: any) {
      if (abortController.signal.aborted) return null;

      setState(prev => ({
        ...prev,
        isLoadingDetail: false,
        detailError: err?.message || 'فشل في تحميل تفاصيل التحليل',
      }));

      return null;
    } finally {
      if (detailAbortControllerRef.current === abortController) {
        detailAbortControllerRef.current = null;
      }
    }
  }, []);

  const loadSession = useCallback(async (runId: string, sessionId?: string | null): Promise<StreamMessage[]> => {
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
      // Step 1: Fetch structured history detail for the run.
      const response = await analysisService.getHistoryRunDetail(runId);
      const detail = response.data;
      console.log('[History] getHistoryRunDetail response', { runId, detail });

      // Step 2: Always call the sessions/:sessionId/messages endpoint.
      const effectiveSessionId = sessionId?.trim() || (detail as any)?.sessionId?.trim() || runId;
      console.log('[History] fetching session messages', { runId, effectiveSessionId, sessionId });
      let sessionMessages: StreamMessage[] = [];
      try {
        const msgResponse = await analysisService.getSessionMessages(effectiveSessionId);
        console.log('[History] getSessionMessages response', { runId, data: msgResponse.data });
        const messages = (msgResponse.data as any)?.data ?? msgResponse.data;
        sessionMessages = messagesToStreamMessages(messages as AnalysisMessage[]);
      } catch {
        // Intentional no-op: this call is required to be issued regardless of success.
        console.log('[History] getSessionMessages failed, falling back to history detail');
      }

      if (abortController.signal.aborted) return [];

      const messages = sessionMessages.length > 0 ? sessionMessages : sessionDetailToMessages(detail);

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
    loadRunDetail,
    retry,
    reset,
  };
}

export { formatDateTime, getPreview };
export default useAnalysisHistory;

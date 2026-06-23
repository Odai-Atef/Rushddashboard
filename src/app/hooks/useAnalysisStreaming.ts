import { useState, useCallback, useRef, useEffect } from 'react';
import { analysisService } from '@/api/services/analysis-service';

export type StreamingStatus = 'idle' | 'connecting' | 'streaming' | 'complete' | 'error';

export interface StreamMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  isStreaming?: boolean;
  timestamp: Date;
  sql?: string;
  data?: any[] | any;
  fallback?: boolean;
  isStarter?: boolean;
  isHidden?: boolean;
}

export interface UseAnalysisStreamingReturn {
  messages: StreamMessage[];
  status: StreamingStatus;
  error: string | null;
  sessionId: string | null;
  analysisRunId: string | null;
  isLoading: boolean;
  
  // Actions
  startAnalysis: (analysisItemId: string, filters?: Record<string, any>) => Promise<void>;
  sendFollowUp: (question: string) => Promise<void>;
  stopStreaming: () => void;
  reset: () => void;
  loadMessages: (messages: StreamMessage[], sessionId: string) => void;
  onComplete: (callback: ((runId: string | null) => void) | null) => void;
}

let messageIdCounter = 0;
function generateMessageId(): string {
  return `msg-${Date.now()}-${++messageIdCounter}`;
}

/**
 * Hook for managing AI analysis streaming sessions.
 * 
 * Flow:
 * 1. startAnalysis(analysisItemId) → POST streaming-run → get sessionId
 * 2. Connect SSE to /stream/:sessionId → append tokens to assistant message
 * 3. sendFollowUp(question) → POST follow-up → append response as new message
 */
export function useAnalysisStreaming(): UseAnalysisStreamingReturn {
  const [messages, setMessages] = useState<StreamMessage[]>([]);
  const [status, setStatus] = useState<StreamingStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [analysisRunId, setAnalysisRunId] = useState<string | null>(null);

  const eventSourceRef = useRef<EventSource | null>(null);
  const currentAssistantMessageId = useRef<string | null>(null);
  const analysisRunIdRef = useRef<string | null>(null);
  const statusRef = useRef<StreamingStatus>('idle');
  const isStartingRef = useRef(false);

  // Ref to an optional callback fired when a streaming run completes successfully.
  // The callback receives the analysis run id so consumers can fetch related detail.
  const onCompleteRef = useRef<((runId: string | null) => void) | null>(null);

  // Keep a ref in sync with status so event handlers always read the latest value.
  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      eventSourceRef.current?.close();
    };
  }, []);

  const closeEventSource = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  }, []);

  const startAnalysis = useCallback(async (analysisItemId: string, filters?: Record<string, any>) => {
    // Prevent concurrent/duplicate starts (e.g. React Strict Mode double-invocation)
    if (isStartingRef.current) {
      console.log('[Streaming] startAnalysis ignored, already starting');
      return;
    }
    isStartingRef.current = true;

    console.log('[Streaming] startAnalysis', { analysisItemId, filters, existingSessionId: sessionId });

    // Reset state
    setMessages([]);
    setError(null);
    setStatus('connecting');
    statusRef.current = 'connecting';
    currentAssistantMessageId.current = null;

    try {
      // 1. Trigger streaming run
      console.log('[Streaming] triggering streaming-run for', analysisItemId);
      const response = await analysisService.triggerStreamingRun(analysisItemId, filters);
      console.log('[Streaming] triggerStreamingRun response', response.data);
      const { sessionId: newSessionId, analysisRunId: newAnalysisRunId } = response.data;

      if (!newSessionId) {
        throw new Error('No session ID returned from server');
      }

      setSessionId(newSessionId);

      // Store the analysis run id so consumers can fetch related detail (insights/recommendations)
      const resolvedRunId = newAnalysisRunId || null;
      analysisRunIdRef.current = resolvedRunId;
      setAnalysisRunId(resolvedRunId);

      // 2. Add system/user context message
      const userMessageId = generateMessageId();
      setMessages(prev => [...prev, {
        id: userMessageId,
        role: 'user',
        content: 'جاري بدء التحليل...',
        isStarter: true,
        timestamp: new Date(),
      }]);

      // 3. Connect to SSE stream
      console.log('[Streaming] connecting SSE to session', newSessionId);
      const eventSource = analysisService.connectToStream(newSessionId);
      eventSourceRef.current = eventSource;

      // Create assistant message placeholder
      const assistantMessageId = generateMessageId();
      currentAssistantMessageId.current = assistantMessageId;

      setMessages(prev => [...prev, {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        isStreaming: true,
        timestamp: new Date(),
      }]);

      setStatus('streaming');
      statusRef.current = 'streaming';

      eventSource.onmessage = (event) => {
        console.log('[SSE] raw event.data:', event.data);
        try {
          const data = JSON.parse(event.data);
          console.log('[SSE] parsed event', { type: data.type, content: data.content, data });

          if (data.type === 'partial_replay' || data.type === 'token') {
            const tokenContent = data.content || '';
            // Append token to current assistant message and hide the starter user message on first token
            setMessages(prev => {
              const updated = [...prev];
              const starterIndex = updated.findIndex(m => m.role === 'user' && m.isStarter);
              if (starterIndex !== -1 && tokenContent) {
                updated[starterIndex] = { ...updated[starterIndex], isHidden: true };
              }
              // Find the assistant placeholder by stored ref id (more reliable than last index)
              const assistantIndex = updated.findIndex(m => m.role === 'assistant' && m.id === currentAssistantMessageId.current);
              if (assistantIndex !== -1) {
                const msg = updated[assistantIndex];
                updated[assistantIndex] = {
                  ...msg,
                  content: msg.content + tokenContent,
                };
              } else {
                console.warn('[SSE] assistant placeholder not found for id', currentAssistantMessageId.current);
              }
              return updated;
            });
          } else if (data.type === 'complete') {
            console.log('[SSE] received complete event');
            setStatus('complete');
            statusRef.current = 'complete';
            setMessages(prev => {
              const assistantIndex = prev.findIndex(m => m.role === 'assistant' && m.id === currentAssistantMessageId.current);
              if (assistantIndex !== -1) {
                const updated = [...prev];
                updated[assistantIndex] = {
                  ...updated[assistantIndex],
                  isStreaming: false,
                };
                return updated;
              }
              return prev;
            });
            eventSource.close();
            eventSourceRef.current = null;
            // Refresh external history lists so the new completed analysis appears
            console.log('[SSE] complete. firing onComplete with runId:', analysisRunIdRef.current);
            onCompleteRef.current?.(analysisRunIdRef.current);
          } else if (data.type === 'error') {
            console.log('[SSE] received error event', data.message);
            setStatus('error');
            statusRef.current = 'error';
            setError(data.message || 'Streaming error occurred');
            setMessages(prev => {
              const assistantIndex = prev.findIndex(m => m.role === 'assistant' && m.id === currentAssistantMessageId.current);
              if (assistantIndex !== -1) {
                const updated = [...prev];
                updated[assistantIndex] = {
                  ...updated[assistantIndex],
                  isStreaming: false,
                  content: updated[assistantIndex].content || 'Error: ' + (data.message || 'Unknown error'),
                };
                return updated;
              }
              return prev;
            });
            eventSource.close();
            eventSourceRef.current = null;
          }
        } catch (e) {
          // Ignore parse errors for non-JSON events
          console.debug('[SSE] non-JSON event:', event.data);
        }
      };

      eventSource.onopen = () => {
        console.log('[SSE] Connection opened successfully');
      };

      eventSource.onerror = (error) => {
        console.error('[SSE] Connection error:', error);
        // Only treat as error if we haven't received complete yet
        if (statusRef.current !== 'complete') {
          setStatus('error');
          statusRef.current = 'error';
          setError('فشل الاتصال بتحليل البث المباشر. تأكد من تسجيل الدخول.');
        }
        eventSource.close();
        eventSourceRef.current = null;
      };

    } catch (err: any) {
      console.error('[Streaming] startAnalysis failed', err);
      setStatus('error');
      statusRef.current = 'error';
      setError(err.message || 'Failed to start analysis');
    } finally {
      isStartingRef.current = false;
    }
  }, []);

  const sendFollowUp = useCallback(async (question: string) => {
    if (!sessionId) {
      setError('لا يوجد جلسة تحليل نشطة. ابدأ تحليلاً أولاً.');
      return;
    }

    // Clear any previous error and set loading state
    setError(null);
    setStatus('streaming');

    // Add user question to messages
    const userMessageId = generateMessageId();
    setMessages(prev => [...prev, {
      id: userMessageId,
      role: 'user',
      content: question,
      timestamp: new Date(),
    }]);

    // Add assistant placeholder
    const assistantMessageId = generateMessageId();
    setMessages(prev => [...prev, {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      isStreaming: true,
      timestamp: new Date(),
    }]);

    try {
      const response = await analysisService.askFollowUp(question, sessionId);
      const { answer, sql, data, fallback } = response.data;

      setStatus('complete');
      setMessages(prev => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;
        if (updated[lastIndex]?.role === 'assistant') {
          updated[lastIndex] = {
            ...updated[lastIndex],
            content: answer || 'لم يتم استلام إجابة',
            isStreaming: false,
            sql,
            data,
            fallback,
          };
        }
        return updated;
      });
    } catch (err: any) {
      const errorMessage = err.message || 'فشل في الحصول على إجابة المتابعة';
      setStatus('error');
      setError(errorMessage);
      setMessages(prev => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;
        if (updated[lastIndex]?.role === 'assistant') {
          updated[lastIndex] = {
            ...updated[lastIndex],
            content: errorMessage,
            isStreaming: false,
          };
        }
        return updated;
      });
    }
  }, [sessionId]);

  const stopStreaming = useCallback(() => {
    closeEventSource();
    setStatus('complete');
    setMessages(prev => {
      const updated = [...prev];
      const lastIndex = updated.length - 1;
      if (updated[lastIndex]?.role === 'assistant' && updated[lastIndex]?.isStreaming) {
        updated[lastIndex] = {
          ...updated[lastIndex],
          isStreaming: false,
        };
      }
      return updated;
    });
  }, [closeEventSource]);

  const loadMessages = useCallback((messages: StreamMessage[], newSessionId: string) => {
    console.log('[Streaming] loadMessages', { count: messages.length, newSessionId });
    closeEventSource();
    setMessages(messages);
    setStatus('complete');
    statusRef.current = 'complete';
    setError(null);
    setSessionId(newSessionId);
    currentAssistantMessageId.current = null;
  }, [closeEventSource]);

  const reset = useCallback(() => {
    console.log('[Streaming] reset');
    closeEventSource();
    setMessages([]);
    setStatus('idle');
    statusRef.current = 'idle';
    setError(null);
    setSessionId(null);
    setAnalysisRunId(null);
    analysisRunIdRef.current = null;
    currentAssistantMessageId.current = null;
    isStartingRef.current = false;
  }, [closeEventSource]);

  return {
    messages,
    status,
    error,
    sessionId,
    analysisRunId,
    isLoading: status === 'connecting' || status === 'streaming',
    startAnalysis,
    sendFollowUp,
    stopStreaming,
    reset,
    loadMessages,
    onComplete: useCallback((callback: ((runId: string | null) => void) | null) => {
      onCompleteRef.current = callback;
    }, []),
  };
}

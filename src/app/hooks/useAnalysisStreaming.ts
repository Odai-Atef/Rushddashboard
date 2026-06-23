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
  const retryCountRef = useRef<number>(0);
  const isManualCloseRef = useRef<boolean>(false);

  // Ref to an optional callback fired when a streaming run completes successfully.
  // The callback receives the analysis run id so consumers can fetch related detail.
  const onCompleteRef = useRef<((runId: string | null) => void) | null>(null);

  // Keep a ref in sync with status so event handlers always read the latest value.
  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  // Recovery: Check for active session on mount (page refresh recovery)
  useEffect(() => {
    const recoverSession = async () => {
      try {
        const saved = sessionStorage.getItem('activeAnalysisSession');
        if (!saved) return;

        const { sessionId: savedSessionId, timestamp } = JSON.parse(saved);
        
        // Only recover if within last 10 minutes
        if (Date.now() - timestamp > 600000) {
          sessionStorage.removeItem('activeAnalysisSession');
          return;
        }

        console.log('[Streaming] Recovering session:', savedSessionId);
        
        // Check session status
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || ''}/api/v1/analysis/session/${savedSessionId}/status`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
            },
          }
        );

        if (!response.ok) {
          sessionStorage.removeItem('activeAnalysisSession');
          return;
        }

        const status = await response.json();
        console.log('[Streaming] Session status:', status);

        if (status.canReconnect && status.status === 'RUNNING') {
          // Session still running - reconnect
          console.log('[Streaming] Reconnecting to running session');
          setSessionId(savedSessionId);
          setStatus('streaming');
          statusRef.current = 'streaming';
          
          // Start streaming connection
          const eventSource = analysisService.connectToStream(savedSessionId);
          eventSourceRef.current = eventSource;
          
          // Create assistant placeholder
          const assistantMessageId = generateMessageId();
          currentAssistantMessageId.current = assistantMessageId;
          
          setMessages(prev => [...prev, {
            id: assistantMessageId,
            role: 'assistant',
            content: '',
            isStreaming: true,
            timestamp: new Date(),
          }]);
          
          // Attach handlers (same as startAnalysis)
          eventSource.onmessage = (event) => {
            // ... same handler as in startAnalysis
            try {
              const data = JSON.parse(event.data);
              
              if (data.type === 'partial_replay' || data.type === 'token') {
                const tokenContent = data.content || '';
                setMessages(prev => {
                  const updated = [...prev];
                  const assistantIndex = updated.findIndex(m => m.role === 'assistant' && m.id === currentAssistantMessageId.current);
                  if (assistantIndex !== -1) {
                    updated[assistantIndex] = {
                      ...updated[assistantIndex],
                      content: updated[assistantIndex].content + tokenContent,
                    };
                  }
                  return updated;
                });
              } else if (data.type === 'complete') {
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
              } else if (data.type === 'error') {
                setStatus('error');
                statusRef.current = 'error';
                setError(data.message || 'Streaming error');
                eventSource.close();
                eventSourceRef.current = null;
              }
            } catch (e) {
              console.debug('[SSE] non-JSON event:', event.data);
            }
          };
          
          eventSource.onerror = (error) => {
            console.error('[SSE] Recovery connection error:', error);
            if (statusRef.current !== 'complete') {
              setStatus('error');
              statusRef.current = 'error';
              setError('فشل إعادة الاتصال بالجلسة');
            }
          };
          
        } else if (status.hasResult) {
          // Session completed - load messages
          console.log('[Streaming] Loading completed session messages');
          const messagesResponse = await analysisService.getSessionMessages(savedSessionId);
          if (messagesResponse.data?.length > 0) {
            const formattedMessages = messagesResponse.data.map((msg: any) => ({
              id: msg.id,
              role: msg.role as 'user' | 'assistant' | 'system',
              content: msg.content,
              isStreaming: msg.isStreaming,
              timestamp: new Date(msg.createdAt),
            }));
            loadMessages(formattedMessages, savedSessionId);
          }
        }
      } catch (e) {
        console.error('[Streaming] Session recovery failed:', e);
        sessionStorage.removeItem('activeAnalysisSession');
      }
    };

    recoverSession();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      eventSourceRef.current?.close();
    };
  }, []);

  const closeEventSource = useCallback(() => {
    isManualCloseRef.current = true;
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  }, []);

  const startAnalysis = useCallback(async (analysisItemId: string, filters?: Record<string, any>) => {
    const startTime = Date.now();
    console.log('[Streaming] startAnalysis', { analysisItemId, filters, existingSessionId: sessionId, startTime });

    // GUARD: Prevent starting if already running
    if (statusRef.current === 'streaming' || statusRef.current === 'connecting') {
      console.warn('[Streaming] Already running, ignoring start request');
      return;
    }

    // CRITICAL FIX: Use a local variable for the new session ID to avoid stale closure
    let newSessionId: string | null = null;

    // Always close any existing connection and reset state before starting a new stream.
    closeEventSource();
    setMessages([]);
    setError(null);
    setStatus('connecting');
    statusRef.current = 'connecting';
    setSessionId(null);
    setAnalysisRunId(null);
    analysisRunIdRef.current = null;
    currentAssistantMessageId.current = null;
    retryCountRef.current = 0;
    isManualCloseRef.current = false;

    try {
      // 1. Trigger streaming run
      console.log('[Streaming] triggering streaming-run for', analysisItemId);
      const response = await analysisService.triggerStreamingRun(analysisItemId, filters);
      console.log('[Streaming] triggerStreamingRun response', { elapsedMs: Date.now() - startTime, data: response.data });
      const { sessionId: returnedSessionId, analysisRunId: newAnalysisRunId } = response.data;

      if (!returnedSessionId) {
        throw new Error('No session ID returned from server');
      }

      // Store in local variable FIRST (avoids stale closure in setTimeout)
      newSessionId = returnedSessionId;
      
      // Then update React state
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

      // Save session for recovery on refresh
      try {
        sessionStorage.setItem('activeAnalysisSession', JSON.stringify({
          sessionId: newSessionId,
          analysisItemId,
          filters,
          timestamp: Date.now(),
        }));
      } catch (e) {
        console.warn('[Streaming] Failed to save session to sessionStorage');
      }

      // 3. Connect to SSE stream
      console.log('[Streaming] connecting SSE to session', newSessionId, 'after', Date.now() - startTime, 'ms');
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
          console.log('[SSE] parsed event', { type: data.type, content: data.content, fullData: data });

          if (data.type === 'partial_replay' || data.type === 'token') {
            // Check both data.content and data.data.content (NestJS SSE wrapping)
            const tokenContent = data.content || data.data?.content || '';
            console.log('[SSE] token received:', { tokenContent, length: tokenContent.length, source: data.content ? 'data.content' : data.data?.content ? 'data.data.content' : 'empty' });
            
            const isFirstToken = tokenContent.trim().length > 0;
            // Append token to current assistant message and hide the starter user message on first real token
            setMessages(prev => {
              const updated = [...prev];
              const starterIndex = updated.findIndex(m => m.role === 'user' && m.isStarter);
              if (starterIndex !== -1 && isFirstToken) {
                updated[starterIndex] = { ...updated[starterIndex], isHidden: true };
              }
              // Find the assistant placeholder by stored ref id (more reliable than last index)
              const assistantIndex = updated.findIndex(m => m.role === 'assistant' && m.id === currentAssistantMessageId.current);
              if (assistantIndex !== -1) {
                const msg = updated[assistantIndex];
                const newContent = msg.content + tokenContent;
                console.log('[SSE] updating message content:', { oldLength: msg.content.length, newLength: newContent.length });
                updated[assistantIndex] = {
                  ...msg,
                  content: newContent,
                };
              } else {
                console.warn('[SSE] assistant placeholder not found for id', currentAssistantMessageId.current);
              }
              return updated;
            });
          } else if (data.type === 'status' && data.status === 'PENDING') {
            console.log('[SSE] Session is pending, waiting for pipeline to start...');
            // Keep connection open, pipeline will start soon
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
          } else {
            console.log('[SSE] unknown event type:', data.type);
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
        
        // If manually closed, don't treat as error
        if (isManualCloseRef.current) {
          console.log('[SSE] Connection was manually closed');
          return;
        }
        
        // If already complete, this is just the normal close
        if (statusRef.current === 'complete') {
          console.log('[SSE] Normal close after completion');
          return;
        }
        
        // Check if we should retry (network hiccup)
        if (retryCountRef.current < 3) {
          retryCountRef.current++;
          const retryDelay = Math.min(1000 * Math.pow(2, retryCountRef.current), 10000);
          console.log(`[SSE] Retrying connection in ${retryDelay}ms (attempt ${retryCountRef.current}/3)`);
          
          setStatus('connecting');
          statusRef.current = 'connecting';
          
          // CRITICAL FIX: Use the local newSessionId variable, not the React state
          setTimeout(() => {
            if (newSessionId && statusRef.current !== 'complete') {
              console.log('[SSE] Attempting reconnection with session:', newSessionId);
              const reconnectEventSource = analysisService.connectToStream(newSessionId);
              eventSourceRef.current = reconnectEventSource;
              
              // Re-attach handlers
              reconnectEventSource.onmessage = eventSource.onmessage;
              reconnectEventSource.onopen = eventSource.onopen;
              reconnectEventSource.onerror = eventSource.onerror;
            }
          }, retryDelay);
          return;
        }
        
        // Max retries exceeded - show error
        console.error('[SSE] Max retries exceeded');
        setStatus('error');
        statusRef.current = 'error';
        setError('فشل الاتصال بعد عدة محاولات. اضغط لإعادة المحاولة.');
        eventSource.close();
        eventSourceRef.current = null;
      };

    } catch (err: any) {
      console.error('[Streaming] startAnalysis failed', err);
      setStatus('error');
      statusRef.current = 'error';
      setError(err.message || 'Failed to start analysis');
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
    isManualCloseRef.current = true;
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
    isManualCloseRef.current = true;
    closeEventSource();
    setMessages(messages);
    setStatus('complete');
    statusRef.current = 'complete';
    setError(null);
    setSessionId(newSessionId);
    currentAssistantMessageId.current = null;
    retryCountRef.current = 0;
  }, [closeEventSource]);

  const reset = useCallback(() => {
    console.log('[Streaming] reset');
    isManualCloseRef.current = true;
    closeEventSource();
    setMessages([]);
    setStatus('idle');
    statusRef.current = 'idle';
    setError(null);
    setSessionId(null);
    setAnalysisRunId(null);
    analysisRunIdRef.current = null;
    currentAssistantMessageId.current = null;
    retryCountRef.current = 0;
    
    // Clear saved session
    try {
      sessionStorage.removeItem('activeAnalysisSession');
    } catch (e) {
      // Ignore
    }
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

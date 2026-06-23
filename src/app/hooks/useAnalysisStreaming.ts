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
  isLoading: boolean;
  
  // Actions
  startAnalysis: (analysisItemId: string, filters?: Record<string, any>) => Promise<void>;
  sendFollowUp: (question: string) => Promise<void>;
  stopStreaming: () => void;
  reset: () => void;
  loadMessages: (messages: StreamMessage[], sessionId: string) => void;
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
  
  const eventSourceRef = useRef<EventSource | null>(null);
  const currentAssistantMessageId = useRef<string | null>(null);

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
    // Reset state
    setMessages([]);
    setError(null);
    setStatus('connecting');
    currentAssistantMessageId.current = null;

    try {
      // 1. Trigger streaming run
      const response = await analysisService.triggerStreamingRun(analysisItemId, filters);
      const { sessionId: newSessionId } = response.data;
      
      if (!newSessionId) {
        throw new Error('No session ID returned from server');
      }
      
      setSessionId(newSessionId);

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

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'partial_replay' || data.type === 'token') {
            const tokenContent = data.content || '';
            // Append token to current assistant message and hide the starter user message on first token
            setMessages(prev => {
              const updated = [...prev];
              const starterIndex = updated.findIndex(m => m.role === 'user' && m.isStarter);
              if (starterIndex !== -1 && tokenContent) {
                updated[starterIndex] = { ...updated[starterIndex], isHidden: true };
              }
              const lastMsg = updated[updated.length - 1];
              if (lastMsg?.role === 'assistant' && lastMsg.id === assistantMessageId) {
                updated[updated.length - 1] = {
                  ...lastMsg,
                  content: lastMsg.content + tokenContent,
                };
              }
              return updated;
            });
          } else if (data.type === 'complete') {
            setStatus('complete');
            setMessages(prev => {
              const lastMsg = prev[prev.length - 1];
              if (lastMsg?.role === 'assistant') {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  ...lastMsg,
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
            setError(data.message || 'Streaming error occurred');
            setMessages(prev => {
              const lastMsg = prev[prev.length - 1];
              if (lastMsg?.role === 'assistant') {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  ...lastMsg,
                  isStreaming: false,
                  content: lastMsg.content || 'Error: ' + (data.message || 'Unknown error'),
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
          console.debug('SSE event (non-JSON):', event.data);
        }
      };

      eventSource.onopen = () => {
        console.log('[SSE] Connection opened successfully');
      };

      eventSource.onerror = (error) => {
        console.error('[SSE] Connection error:', error);
        // Only treat as error if we haven't received complete yet
        if (status !== 'complete') {
          setStatus('error');
          setError('فشل الاتصال بتحليل البث المباشر. تأكد من تسجيل الدخول.');
        }
        eventSource.close();
        eventSourceRef.current = null;
      };

    } catch (err: any) {
      setStatus('error');
      setError(err.message || 'Failed to start analysis');
      console.error('Analysis streaming error:', err);
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
    closeEventSource();
    setMessages(messages);
    setStatus('complete');
    setError(null);
    setSessionId(newSessionId);
    currentAssistantMessageId.current = null;
  }, [closeEventSource]);

  const reset = useCallback(() => {
    closeEventSource();
    setMessages([]);
    setStatus('idle');
    setError(null);
    setSessionId(null);
    currentAssistantMessageId.current = null;
  }, [closeEventSource]);

  return {
    messages,
    status,
    error,
    sessionId,
    isLoading: status === 'connecting' || status === 'streaming',
    startAnalysis,
    sendFollowUp,
    stopStreaming,
    reset,
    loadMessages,
  };
}

import { useState, useEffect, useRef } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Sparkles,
  TrendingUp,
  Users,
  AlertTriangle,
  Target,
  DollarSign,
  Package,
  Clock,
  CheckCircle,
  Brain,
  BarChart3,
  Shield,
  MoreVertical,
  Copy,
  Check,
  Loader2,
  ChevronRight,
  Search,
  Plus,
  X,
  Zap,
  Lightbulb,
  UserCog,
  Activity,
  Warehouse,
  Send,
  StopCircle,
  FileDown,
  TrendingDown,
  ArrowRight,
  MessageSquare,
  MapPin,
  Database,
  RefreshCw,
} from 'lucide-react';
import { useNavigate, useLocation, useParams } from 'react-router';
import { AnalysisLibraryModal } from '@/app/components/analysis/AnalysisLibraryModal';
import { AnalysisLibraryItem } from '@/api/services/analysis-service';
import { resolveIcon } from '@/app/utils/icon-map';
import { cn } from '@/app/utils/cn';
import { useAnalysisCategories } from '@/app/hooks/useAnalysisCategories';
import { useAnalysisLibraryItems } from '@/app/hooks/useAnalysisLibraryItems';
import { useAnalysisStreaming } from '@/app/hooks/useAnalysisStreaming';
import { useAnalysisHistory, formatDateTime, getPreview, AnalysisInsight } from '@/app/hooks/useAnalysisHistory';

interface AnalysisCard {
  id: string;
  title: string;
  description: string;
  category: string;
  estimatedTime: string;
  complexity: 'بسيط' | 'متوسط' | 'متقدم';
  impact: 'منخفض' | 'متوسط' | 'عالي' | 'حرج';
  icon: any;
  recommended?: boolean;
  trending?: boolean;
  aiGenerated?: boolean;
  color: string;
}

interface ProgressStep {
  id: number;
  label: string;
  icon: any;
  status: 'completed' | 'active' | 'pending';
}

interface AIAnalysisChatLocationState {
  selectedAnalysisId?: string;
  selectedLibraryItemId?: string;
  continueAnalysisId?: string;
  rerunAnalysisId?: string;
}

export function AIAnalysisChatPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { chatId } = useParams<{ chatId: string }>();
  const state = (location.state as AIAnalysisChatLocationState) || {};
  const { categories: apiCategories, isLoading: categoriesLoading, error: categoriesError, retry: retryCategories } = useAnalysisCategories();
  const { items: libraryItems } = useAnalysisLibraryItems('all');
  const streaming = useAnalysisStreaming();
  const history = useAnalysisHistory();

  // Refresh history when a new streaming analysis completes so it appears at the top of the sidebar.
  useEffect(() => {
    console.log('[Chat] registering onComplete callback');
    streaming.onComplete((runId) => {
      console.log('[Chat] streaming completed, refreshing history. runId:', runId);
      history.fetchHistory(1);
      // Fetch the run detail (insights/recommendations) for the newly completed analysis.
      if (runId) {
        history.loadRunDetail(runId);
      }
    });
    return () => {
      console.log('[Chat] clearing onComplete callback');
      streaming.onComplete(null);
    };
    // Only register once on mount; avoid re-registering when analysisRunId changes mid-stream.
  }, []);

  // If a stream finishes without producing any assistant content, backfill from persisted messages.
  useEffect(() => {
    if (streaming.status !== 'complete') return;
    
    // Don't backfill if we already have content
    const assistantMsg = streaming.messages.find((m) => m.role === 'assistant');
    const hasContent = assistantMsg && assistantMsg.content.trim().length > 0;
    
    if (hasContent) {
      console.log('[Chat] assistant has content, skipping backfill');
      return;
    }
    
    const runId = streaming.analysisRunId;
    const sessionIdValue = streaming.sessionId;

    console.log('[Chat] complete backfill check', { runId, sessionIdValue, hasContent, messagesCount: streaming.messages.length });

    if (runId && !hasContent) {
      console.log('[Chat] assistant content empty, will retry loading session messages for', runId);

      const attemptLoad = async (attempt: number): Promise<void> => {
        // Check if a new analysis has started
        if (streaming.status !== 'complete') {
          console.log('[Chat] status changed, skipping backfill');
          return;
        }
        
        console.log('[Chat] backfill attempt', attempt, 'for', runId);
        const messages = await history.loadSession(runId, sessionIdValue);
        if (messages.length > 0) {
          const firstContent = messages.find((m) => m.role === 'assistant')?.content?.trim() || '';
          if (firstContent.length > 0) {
            console.log('[Chat] backfilled', messages.length, 'messages with content');
            streaming.loadMessages(messages, sessionIdValue || runId);
            return;
          }
        }
        if (attempt < 3) {
          console.log('[Chat] backfill empty, retrying in', attempt * 1000, 'ms');
          await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
          return attemptLoad(attempt + 1);
        }
        console.warn('[Chat] backfill failed after 3 attempts, no persisted messages found');
      };

      // Wait a short moment before first backfill to let backend persist the result.
      const timer = setTimeout(() => {
        attemptLoad(1);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [streaming.status]);
  const [showAnalysisLibrary, setShowAnalysisLibrary] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState<string | null>(null);
  const [activeAnalysis, setActiveAnalysis] = useState<AnalysisCard | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [pendingRetryQuestion, setPendingRetryQuestion] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingHistoryId, setPendingHistoryId] = useState<string | null>(null);
  const [progressSteps, setProgressSteps] = useState<ProgressStep[]>([
    { id: 1, label: 'جلب البيانات', icon: Database, status: 'pending' },
    { id: 2, label: 'تنفيذ SQL', icon: Brain, status: 'pending' },
    { id: 3, label: 'معالجة المؤشرات', icon: BarChart3, status: 'pending' },
    { id: 4, label: 'اكتشاف المخاطر', icon: Shield, status: 'pending' },
    { id: 5, label: 'توليد التوصيات', icon: Sparkles, status: 'pending' },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const historyListRef = useRef<HTMLDivElement>(null);
  const observerTargetRef = useRef<HTMLDivElement>(null);
  const initialLoadRef = useRef(false);

  // Fetch history on mount
  useEffect(() => {
    console.log('[Chat] mount: fetching history');
    history.fetchHistory(1);
  }, []);

  // Keep selectedAnalysis in sync with URL chatId.
  useEffect(() => {
    setSelectedAnalysis(chatId ?? null);
  }, [chatId]);

  // Debug: trace all location.state changes so we can see if state leaks/reappears.
  useEffect(() => {
    console.log('[Chat] location.state changed', location.state);
  }, [location.state]);

  // Trace streaming lifecycle for debugging
  useEffect(() => {
    console.log('[Chat] streaming state', {
      status: streaming.status,
      error: streaming.error,
      messagesCount: streaming.messages.length,
      sessionId: streaming.sessionId,
      analysisRunId: streaming.analysisRunId,
      activeAnalysisId: activeAnalysis?.id ?? null,
    });
  }, [streaming.status, streaming.error, streaming.messages.length, streaming.sessionId, streaming.analysisRunId, activeAnalysis]);

  // Load chat session from URL chatId when available and not conflicting with an active stream.
  useEffect(() => {
    if (!chatId) return;
    if (streaming.status === 'streaming' || streaming.status === 'connecting') return;

    const loadFromUrl = async () => {
      const entry = history.entries.find((e) => e.id === chatId);
      if (!entry) return;

      setSelectedAnalysis(chatId);
      setActiveAnalysis(null);
      const messages = await history.loadSession(chatId, entry?.sessionId ?? undefined);
      if (messages.length > 0) {
        streaming.loadMessages(messages, entry?.sessionId || chatId);
      }
    };

    if (history.entries.length > 0) {
      loadFromUrl();
    }
    // If history hasn't loaded yet, the effect below triggered by history.entries will handle it.
  }, [chatId, history.entries.length, streaming.status]);

  // Handle location state on mount: selected analysis, continue, rerun
  useEffect(() => {
    if (initialLoadRef.current) return;
    initialLoadRef.current = true;

    // URL-based chat loading takes priority over location-state continue/rerun flows.
    if (chatId) {
      console.log('[Chat] chatId present in URL, deferring to URL-based loading', chatId);
      return;
    }

    const { selectedAnalysisId, selectedLibraryItemId, continueAnalysisId, rerunAnalysisId } = state;
    console.log('[Chat] initial location state', {
      selectedAnalysisId,
      selectedLibraryItemId,
      continueAnalysisId,
      rerunAnalysisId,
      historyEntriesCount: history.entries.length,
    });

    if (continueAnalysisId) {
      console.log('[Chat] continuing history item', continueAnalysisId);
      handleHistoryItemClick(continueAnalysisId);
      return;
    }

    if (rerunAnalysisId) {
      console.log('[Chat] rerunning history item', rerunAnalysisId);
      const entry = history.entries.find((e) => e.id === rerunAnalysisId);
      if (entry) {
        handleRerunAnalysis(entry);
      } else {
        const interval = setInterval(() => {
          const found = history.entries.find((e) => e.id === rerunAnalysisId);
          if (found) {
            handleRerunAnalysis(found);
            clearInterval(interval);
          }
        }, 200);
        setTimeout(() => clearInterval(interval), 5000);
      }
      return;
    }

    if (selectedAnalysisId) {
      console.log('[Chat] starting analysis from card', selectedAnalysisId);
      // Resolve from the real library items fetched from the API. If the id is not
      // a library item (e.g. a history rerun id), fall back to a generic card.
      const libraryItem = libraryItems.find((i) => i.id === selectedAnalysisId);
      if (libraryItem) {
        startLibraryAnalysis(libraryItem);
      } else {
        const genericCard: AnalysisCard = {
          id: selectedAnalysisId,
          title: 'تحليل ذكي',
          description: '',
          category: 'مكتبة التحليلات',
          estimatedTime: '2-3 دقائق',
          complexity: 'متوسط',
          impact: 'متوسط',
          icon: Brain,
          color: 'from-purple-500 to-blue-600',
        };
        startCardAnalysis(genericCard);
      }
      // Consume the state so a page refresh doesn't auto-restart the same analysis.
      window.history.replaceState({}, document.title, location.pathname);
      return;
    }

    if (selectedLibraryItemId) {
      console.log('[Chat] starting analysis from library', selectedLibraryItemId);
      // Prefer the full item passed through navigation state; fall back to searching the API list.
      const item = (state as any).selectedLibraryItem as AnalysisLibraryItem | undefined;
      if (item) {
        startLibraryAnalysis(item);
      } else {
        const found = libraryItems.find((i) => i.id === selectedLibraryItemId);
        if (found) {
          startLibraryAnalysis(found);
        } else {
          console.warn('[Chat] library item not found for selectedLibraryItemId', selectedLibraryItemId, 'libraryItems:', libraryItems.length);
        }
      }
      // Consume the state so a page refresh doesn't auto-restart the same analysis.
      window.history.replaceState({}, document.title, location.pathname);
    }
  }, [libraryItems]);

  // Sync streaming status to progress steps
  useEffect(() => {
    if (streaming.status === 'connecting') {
      setProgressSteps((steps) =>
        steps.map((s, i) => (i === 0 ? { ...s, status: 'active' as const } : { ...s, status: 'pending' as const }))
      );
    } else if (streaming.status === 'streaming') {
      setProgressSteps((steps) =>
        steps.map((s, i) =>
          i === 0
            ? { ...s, status: 'completed' as const }
            : i === 1
            ? { ...s, status: 'completed' as const }
            : i === 2
            ? { ...s, status: 'completed' as const }
            : i === 3
            ? { ...s, status: 'completed' as const }
            : i === 4
            ? { ...s, status: 'active' as const }
            : { ...s, status: 'pending' as const }
        )
      );
    } else if (streaming.status === 'complete' || streaming.status === 'error') {
      setProgressSteps((steps) => steps.map((s) => ({ ...s, status: 'completed' as const })));
    }
  }, [streaming.status]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [streaming.messages, streaming.status]);

  // IntersectionObserver for infinite scroll pagination
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && history.pagination.hasMore && !history.isLoading) {
          history.fetchHistory(history.pagination.page + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (observerTargetRef.current) {
      observer.observe(observerTargetRef.current);
    }

    return () => observer.disconnect();
  }, [history.pagination.hasMore, history.isLoading, history.pagination.page]);

  // Scroll active history item into view when chatId/selectedAnalysis or history entries change.
  useEffect(() => {
    const container = historyListRef.current;
    const activeId = chatId ?? selectedAnalysis;
    if (!container || !activeId) return;

    // If the entry is not present yet, keep loading more pages until we find it.
    if (!history.entries.some((e) => e.id === activeId)) {
      if (history.pagination.hasMore && !history.isLoading) {
        history.fetchHistory(history.pagination.page + 1);
      }
      return;
    }

    // Search for the active item within the history list container.
    const activeItem = Array.from(container.children).find((child) => {
      return child.getAttribute('data-history-id') === activeId;
    });

    if (activeItem) {
      activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [chatId, selectedAnalysis, history.entries, history.pagination.hasMore, history.isLoading, history.pagination.page]);

  const startCardAnalysis = async (card: AnalysisCard) => {
    console.log('[Chat] startCardAnalysis', { id: card.id, title: card.title, streamingStatus: streaming.status, sessionId: streaming.sessionId });
    setActiveAnalysis(card);
    setSelectedAnalysis(null);
    setShowAnalysisLibrary(false);
    
    // Move to base chat route before starting a new analysis so URL stays truthful.
    if (chatId) {
      navigate('/dashboard/ai-analysis/chat', { replace: true });
    }
    
    // Wait for reset to complete before starting new analysis
    streaming.reset();
    
    // Small delay to ensure reset is processed
    await new Promise(resolve => setTimeout(resolve, 100));
    
    streaming.startAnalysis(card.id, {});
  };

  const startLibraryAnalysis = (item: AnalysisLibraryItem) => {
    console.log('[Chat] startLibraryAnalysis', { id: item.id, title: item.titleAr || item.title });
    const categoryName = apiCategories.find((c: any) => c.id === item.categoryId)?.nameAr || '';
    const card: AnalysisCard = {
      id: item.id,
      title: item.titleAr || item.title,
      description: item.descriptionAr || item.description || '',
      category: categoryName,
      estimatedTime: item.duration,
      complexity: item.complexity as AnalysisCard['complexity'],
      impact: item.impact as AnalysisCard['impact'],
      icon: resolveIcon(item.icon),
      color: item.iconBackground,
    };
    startCardAnalysis(card);
  };

  const handleRerunAnalysis = (entry: { id: string; sessionId?: string | null; title: string }) => {
    const card: AnalysisCard = {
      id: entry.id,
      title: entry.title,
      description: 'إعادة تشغيل التحليل',
      category: 'سجل التحليلات',
      estimatedTime: '2-3 دقائق',
      complexity: 'متوسط',
      impact: 'متوسط',
      icon: Brain,
      color: 'from-purple-500 to-blue-600',
    };
    startCardAnalysis(card);
  };

  const handleHistoryItemClick = (itemId: string) => {
    if (chatId === itemId) return;

    const isStreamingActive = streaming.status === 'streaming' || streaming.status === 'connecting';
    if (isStreamingActive) {
      setPendingHistoryId(itemId);
      setShowConfirmDialog(true);
      return;
    }

    navigate(`/dashboard/ai-analysis/chat/${itemId}`);
  };

  const loadHistorySession = async (itemId: string) => {
    setSelectedAnalysis(itemId);
    setActiveAnalysis(null);
    const entry = history.entries.find((e) => e.id === itemId);
    const messages = await history.loadSession(itemId, entry?.sessionId ?? undefined);
    if (messages.length > 0) {
      streaming.loadMessages(messages, entry?.sessionId || itemId);
    }
  };

  const handleConfirmSwitch = () => {
    if (pendingHistoryId) {
      streaming.reset();
      navigate(`/dashboard/ai-analysis/chat/${pendingHistoryId}`);
    }
    setShowConfirmDialog(false);
    setPendingHistoryId(null);
  };

  const handleCancelSwitch = () => {
    setShowConfirmDialog(false);
    setPendingHistoryId(null);
  };

  const handleCloseAnalysis = () => {
    if (streaming.status === 'streaming' || streaming.status === 'connecting') {
      streaming.stopStreaming();
    }
    streaming.reset();
    history.reset();
    navigate('/dashboard/ai-analysis/start');
  };

  const handleSendMessage = () => {
    if (!chatInput.trim() || streaming.isLoading) return;
    setPendingRetryQuestion(chatInput);
    streaming.sendFollowUp(chatInput);
    setChatInput('');
  };

  const handleRetryFollowUp = () => {
    if (!pendingRetryQuestion || streaming.isLoading) return;
    streaming.sendFollowUp(pendingRetryQuestion);
    setPendingRetryQuestion(null);
  };

  const handleStop = () => {
    streaming.stopStreaming();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-500/20 text-green-600 dark:text-green-400';
      case 'RUNNING': return 'bg-blue-500/20 text-blue-600 dark:text-blue-400';
      case 'FAILED': return 'bg-red-500/20 text-red-600 dark:text-red-400';
      case 'PENDING': return 'bg-gray-500/10 text-gray-600 dark:text-gray-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'مكتمل';
      case 'RUNNING': return 'قيد التشغيل';
      case 'FAILED': return 'فشل';
      case 'PENDING': return 'معلق';
      default: return status;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'حرج': return 'bg-red-500/10 text-red-600 border-red-500/20';
      case 'عالي': return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
      case 'متوسط': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'منخفض': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  const isStreamingActive = streaming.status === 'streaming' || streaming.status === 'connecting';
  const isAnalysisComplete = streaming.status === 'complete';
  const hasError = streaming.status === 'error';
  const isHistoricalSessionLoaded = history.selectedId !== null && streaming.status === 'complete' && streaming.sessionId === history.selectedId;
  const isChatEnabled = isAnalysisComplete || hasError || isHistoricalSessionLoaded;
  const hasActiveSession = streaming.status !== 'idle' || activeAnalysis !== null || isHistoricalSessionLoaded;
  const isUrlChatMissing = Boolean(chatId) && !history.isLoading && history.entries.length > 0 && !history.entries.some((e) => e.id === chatId);
  // Detect when a completed stream produced no actual content (backend generation failed/lost)
  const isEmptyComplete = isAnalysisComplete && !isHistoricalSessionLoaded && !streaming.messages.some((m) => m.role === 'assistant' && m.content.trim().length > 0);

  useEffect(() => {
    if (streaming.status === 'complete') {
      setPendingRetryQuestion(null);
    }
  }, [streaming.status]);

  useEffect(() => {
    if (!hasError) {
      setPendingRetryQuestion(null);
    }
  }, [hasError]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [streaming.messages, streaming.status]);

  const renderEmptyState = () => (
    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-gradient-to-br from-background to-muted/20">
      <div className="max-w-md">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl mb-6 shadow-xl">
          <Sparkles className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold mb-3">ابدأ تحليلاً ذكياً</h2>
        <p className="text-muted-foreground mb-6 leading-relaxed">
          اختر تحليلاً من مكتبة التحليلات للبدء
        </p>
        <button
          onClick={() => setShowAnalysisLibrary(true)}
          className="px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-lg hover:from-purple-600 hover:to-blue-700 transition-all flex items-center gap-2 mx-auto shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>فتح مكتبة التحليلات</span>
        </button>
      </div>
    </div>
  );

  const renderMessage = (message: any, index: number) => {
    if (message.isHidden) return null;
    const messageContent = message.content || (message.data ? JSON.stringify(message.data, null, 2) : '');

    if (message.role === 'user') {
      return (
        <div key={message.id || index} className="flex justify-start w-full">
          <div className="max-w-4xl w-full">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-muted rounded-lg">
                <Users className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">أنت</span>
            </div>
            <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl">
              <p className="whitespace-pre-wrap break-words">{messageContent}</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div key={message.id || index} className="flex justify-end w-full">
        <div className="max-w-5xl w-full">
          <div className="flex items-center gap-2 mb-2 justify-end">
            <span className="text-sm font-medium">المحلل الذكي</span>
            <div className="p-1.5 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
          </div>

          <div className="p-5 bg-card border border-border rounded-xl w-full">
            <div className="prose prose-sm max-w-none text-right w-full break-words">
              <Markdown remarkPlugins={[remarkGfm]}>{messageContent || '\u00A0'}</Markdown>
              {message.isStreaming && <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-1"></span>}
            </div>

            {!message.isStreaming && index === streaming.messages.length - 1 && message.role === 'assistant' && (
              <div className="flex items-center gap-2 mt-3 justify-end">
                <button
                  onClick={() => {
                    if (messageContent) {
                      navigator.clipboard.writeText(messageContent).catch((err) => {
                        console.error('[Chat] failed to copy message', err);
                      });
                    }
                  }}
                  className="px-3 py-1.5 text-xs border border-border hover:bg-accent rounded-lg transition-colors flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  نسخ
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Page Header */}
      <div className="p-6 border-b border-border bg-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">المحلل التنفيذي الذكي</h1>
              <p className="text-sm text-muted-foreground">منصة التحليل المدعومة بالذكاء الاصطناعي</p>
            </div>
          </div>
          <button
            onClick={() => setShowAnalysisLibrary(true)}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-lg hover:from-purple-600 hover:to-blue-700 transition-all flex items-center gap-2 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>تحليل جديد</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Analysis History Sidebar */}
        <div className="w-80 border-l border-border bg-card flex flex-col overflow-hidden">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-medium">سجل التحليلات</h2>
              <button
                onClick={() => setShowAnalysisLibrary(true)}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="بحث..."
                className="w-full pr-10 pl-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2" ref={historyListRef}>
            {history.isLoading && history.entries.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 space-y-3">
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
                <p className="text-sm text-muted-foreground">جاري تحميل سجل التحليلات...</p>
              </div>
            )}

            {history.error && history.entries.length === 0 && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="font-medium">فشل في تحميل السجل</span>
                </div>
                <p className="mb-3">{history.error}</p>
                <button
                  onClick={() => history.retry()}
                  className="px-3 py-1.5 text-xs bg-red-100 hover:bg-red-200 rounded-lg transition-colors flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  إعادة المحاولة
                </button>
              </div>
            )}

            {!history.isLoading && !history.error && history.entries.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="p-3 bg-muted rounded-xl mb-3">
                  <Clock className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">
                  لا توجد تحليلات سابقة. ابدأ بإنشاء تحليل جديد
                </p>
              </div>
            )}

            {history.entries
              .slice()
              .sort((a, b) => {
                const aDate = a.startedAt || a.createdAt || '';
                const bDate = b.startedAt || b.createdAt || '';
                return new Date(bDate).getTime() - new Date(aDate).getTime();
              })
              .map((item) => {
                const effectiveDate = item.startedAt || item.createdAt;
                const { date, time } = formatDateTime(effectiveDate);
                const preview = getPreview(item);
                return (
                  <div
                    key={item.id}
                    data-history-id={item.id}
                    onClick={() => handleHistoryItemClick(item.id)}
                    className={`group p-3 rounded-lg mb-2 cursor-pointer transition-all ${
                      (selectedAnalysis ?? chatId) === item.id
                        ? 'bg-primary/10 border-2 border-primary'
                        : 'hover:bg-muted/50 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-medium text-sm mb-1 line-clamp-1">{item.title}</h3>
                        <p className="text-xs text-muted-foreground">{date}</p>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1 hover:bg-accent rounded">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {preview && (
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2 leading-relaxed">
                        {preview}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{time}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(item.status)}`}>
                        {getStatusLabel(item.status)}
                      </span>
                    </div>
                  </div>
                );
              })}

            {history.isLoading && history.entries.length > 0 && (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
              </div>
            )}

            <div ref={observerTargetRef} className="h-4" />
          </div>
        </div>

        {/* Main Workspace */}
        {isUrlChatMissing ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <div className="p-4 bg-yellow-500/10 rounded-xl mb-4">
              <AlertTriangle className="w-10 h-10 text-yellow-600" />
            </div>
            <h2 className="text-xl font-bold mb-2">الدردشة غير موجودة</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              لم نتمكن من العثور على هذه الدردشة في سجل التحليلات. قد تكون محذوفة أو غير متاحة.
            </p>
            <button
              onClick={() => navigate('/dashboard/ai-analysis/chat')}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              العودة إلى الدردشة
            </button>
          </div>
        ) : !hasActiveSession ? (
          renderEmptyState()
        ) : (
          <div className="flex-1 flex overflow-hidden">
            {/* Center - AI Analysis Workspace */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Analysis Header */}
              <div className="p-4 border-b border-border bg-card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {activeAnalysis ? (
                      <div className={cn('p-2 rounded-lg bg-gradient-to-br', activeAnalysis.color)}>
                        <activeAnalysis.icon className="w-5 h-5 text-white" />
                      </div>
                    ) : (
                      <div className="p-2 rounded-lg bg-gradient-to-br from-gray-500 to-gray-600">
                        <Clock className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div>
                      <h2 className="font-semibold">
                        {activeAnalysis
                          ? activeAnalysis.title
                          : history.entries.find((e) => e.id === history.selectedId)?.title || 'تحليل سابق'}
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        {activeAnalysis ? activeAnalysis.category : 'سجل التحليلات'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-accent rounded-lg transition-colors">
                      <FileDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleCloseAnalysis}
                      className="p-2 hover:bg-accent rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Progress Steps */}
              <div className="p-4 border-b border-border bg-muted/30">
                <div className="flex items-center justify-between gap-2">
                  {progressSteps.map((step, index) => {
                    const Icon = step.icon;
                    return (
                      <div key={step.id} className="flex items-center flex-1">
                        <div className="flex items-center gap-2 flex-1">
                          <div
                            className={cn(
                              'p-2 rounded-lg transition-all',
                              step.status === 'completed' && 'bg-green-500/20',
                              step.status === 'active' && 'bg-primary/20 animate-pulse',
                              step.status === 'pending' && 'bg-muted'
                            )}
                          >
                            {step.status === 'completed' ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : step.status === 'active' ? (
                              <Loader2 className="w-4 h-4 text-primary animate-spin" />
                            ) : (
                              <Icon className="w-4 h-4 text-muted-foreground" />
                            )}
                          </div>
                          <span
                            className={cn(
                              'text-xs',
                              step.status === 'completed' && 'text-green-600',
                              step.status === 'active' && 'text-primary font-medium',
                              step.status === 'pending' && 'text-muted-foreground'
                            )}
                          >
                            {step.label}
                          </span>
                        </div>
                        {index < progressSteps.length - 1 && (
                          <div
                            className={cn(
                              'h-0.5 flex-1 mx-2 transition-all',
                              step.status === 'completed' ? 'bg-green-500/40' : 'bg-muted'
                            )}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Loading Skeleton */}
              {streaming.status === 'connecting' && (
                <div className="flex-1 flex items-center justify-center p-6">
                  <div className="w-full max-w-2xl space-y-4 animate-pulse">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-full"></div>
                    <div className="h-4 bg-muted rounded w-5/6"></div>
                    <div className="h-4 bg-muted rounded w-2/3"></div>
                  </div>
                </div>
              )}

              {/* Messages Area */}
              {streaming.status !== 'connecting' && (
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {streaming.messages.map((msg, index) => {
                    console.log('[Chat] rendering message', { index, role: msg.role, content: msg.content, data: msg.data });
                    return renderMessage(msg, index);
                  })}

                  {streaming.status === 'streaming' && !streaming.messages.some(m => m.role === 'assistant' && m.content.length > 0) && (
                    <div className="flex items-center justify-center p-8">
                      <div className="flex flex-col items-center gap-3 text-muted-foreground">
                        <Loader2 className="w-8 h-8 animate-spin" />
                        <p>جاري تحميل التحليل...</p>
                      </div>
                    </div>
                  )}

                  {streaming.status === 'complete' && !streaming.messages.some(m => m.role === 'assistant' && m.content.length > 0) && (
                    <div className="flex items-center justify-center p-8">
                      <div className="flex flex-col items-center gap-3 text-yellow-600">
                        <AlertTriangle className="w-8 h-8" />
                        <p>لم يتم استلام نتيجة التحليل. يمكنك إعادة المحاولة.</p>
                        {activeAnalysis && (
                          <button
                            onClick={() => startCardAnalysis(activeAnalysis)}
                            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                          >
                            إعادة المحاولة
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {isStreamingActive && (
                    <div className="flex justify-center">
                      <button
                        onClick={handleStop}
                        className="px-4 py-2 bg-red-500/10 text-red-600 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors flex items-center gap-2"
                      >
                        <StopCircle className="w-4 h-4" />
                        إيقاف التوليد
                      </button>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              )}

              {/* Error Banner above Chat Input */}
              {(hasError || isEmptyComplete) && (
                <div className="p-4 border-t border-border bg-card">
                  <div className={`p-4 border rounded-lg text-sm ${hasError ? 'bg-red-50 border-red-200 text-red-700' : 'bg-yellow-50 border-yellow-200 text-yellow-800'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="font-medium">{hasError ? 'حدث خطأ' : 'لم يتم استلام نتيجة التحليل'}</span>
                    </div>
                    <p className="mb-3">{streaming.error || 'انتهى التحليل دون إنتاج محتوى. يمكنك إعادة تشغيل التحليل.'}</p>
                    {activeAnalysis && (
                      <button
                        onClick={() => startCardAnalysis(activeAnalysis)}
                        disabled={streaming.isLoading}
                        className="px-3 py-1.5 text-xs bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <RefreshCw className="w-3 h-3" />
                        إعادة تشغيل التحليل
                      </button>
                    )}
                    {pendingRetryQuestion && (
                      <button
                        onClick={handleRetryFollowUp}
                        disabled={streaming.isLoading}
                        className="px-3 py-1.5 text-xs bg-red-100 hover:bg-red-200 rounded-lg transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <RefreshCw className="w-3 h-3" />
                        إعادة المحاولة
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Chat Input */}
              {isChatEnabled && (
                <div className="p-4 border-t border-border bg-card">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="اطرح سؤالاً للمتابعة..."
                      disabled={streaming.isLoading}
                      className="flex-1 px-4 py-3 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!chatInput.trim() || streaming.isLoading}
                      className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>إرسال</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

              {/* Right Sidebar - Insights & Recommendations */}
            {isAnalysisComplete && (
              <div className="w-96 border-r border-border bg-card flex flex-col overflow-hidden">
                <div className="p-4 border-b border-border">
                  <h3 className="font-semibold">الرؤى والتوصيات</h3>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {/* Executive Summary */}
                  <div className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <Brain className="w-4 h-4 text-purple-600" />
                      <h4 className="font-medium text-sm">ملخص تنفيذي</h4>
                    </div>
                    <div className="prose prose-sm max-w-none text-right w-full break-words text-sm leading-relaxed text-muted-foreground">
                      <Markdown remarkPlugins={[remarkGfm]}>
                        {history.detailSession?.summary ||
                          streaming.messages.filter((m) => m.role === 'assistant').pop()?.content?.slice(0, 200) ||
                          'جاري التحليل...'}
                      </Markdown>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div>
                    <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4" />
                      التوصيات التنفيذية
                    </h4>
                    <div className="space-y-3">
                      {history.isLoadingDetail && (
                        <div className="flex items-center justify-center py-4">
                          <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
                        </div>
                      )}

                      {!history.isLoadingDetail && history.detailError && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs">
                          {history.detailError}
                        </div>
                      )}

                      {!history.isLoadingDetail && !history.detailError && history.detailSession?.insights?.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4">لا توجد رؤى متاحة</p>
                      )}

                      {!history.isLoadingDetail &&
                        history.detailSession?.insights?.map((insight: AnalysisInsight) => {
                          const type = (insight.type || insight.insightType || '').toLowerCase();
                          const isUrgent = type === 'risk' || type === 'urgent';
                          const isOpportunity = type === 'opportunity' || type === 'growth';
                          return (
                            <div
                              key={insight.id}
                              className="p-4 bg-muted/50 border border-border rounded-lg hover:shadow-md transition-all"
                            >
                              <div className="flex items-start gap-3">
                                <div
                                  className={cn(
                                    'p-2 rounded-lg',
                                    isUrgent && 'bg-red-500/10',
                                    isOpportunity && 'bg-green-500/10',
                                    !isUrgent && !isOpportunity && 'bg-blue-500/10'
                                  )}
                                >
                                  {isUrgent && <AlertTriangle className="w-4 h-4 text-red-600" />}
                                  {isOpportunity && <Target className="w-4 h-4 text-green-600" />}
                                  {!isUrgent && !isOpportunity && <Lightbulb className="w-4 h-4 text-blue-600" />}
                                </div>
                                <div className="flex-1">
                                  <h5 className="font-medium text-sm mb-1">
                                    {insight.titleAr || insight.title}
                                  </h5>
                                  <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                                    {insight.descriptionAr || insight.description}
                                  </p>
                                  {insight.recommendationText || insight.recommendation ? (
                                    <p className="text-xs text-green-600 leading-relaxed">
                                      {insight.recommendationText || insight.recommendation}
                                    </p>
                                  ) : null}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>

                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <AnalysisLibraryModal
        open={showAnalysisLibrary}
        onClose={() => setShowAnalysisLibrary(false)}
        categories={apiCategories}
        categoriesLoading={categoriesLoading}
        categoriesError={categoriesError}
        retryCategories={retryCategories}
        onSelectAnalysis={startLibraryAnalysis}
      />

      {/* Confirmation Dialog for Switching from Active Stream */}
      {showConfirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-card border border-border rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-lg">تحليل قيد التشغيل</h3>
            </div>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              هل تريد الانتقال إلى التحليل المحدد؟ سيؤدي ذلك إلى إيقاف التحليل الحالي وفقدان البيانات غير المحفوظة.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancelSwitch}
                className="px-4 py-2 border border-border hover:bg-accent rounded-lg transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={handleConfirmSwitch}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                الانتقال
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

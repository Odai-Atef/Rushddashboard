import { useEffect, useMemo, useRef, useState } from 'react';
import type { FC, FormEvent, KeyboardEvent, MouseEvent } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router';
import useProjectDiscussions from '@/api/hooks/useProjectDiscussions';
import useProjectConversations from '@/api/hooks/useProjectConversations';
import useConversationMessages from '@/api/hooks/useConversationMessages';
import useConversationRealtime from '@/api/hooks/useConversationRealtime';
import useDiscussionDetail from '@/api/hooks/useDiscussionDetail';
import useProjectAttachments from '@/api/hooks/useProjectAttachments';
import useAttachmentMutations from '@/api/hooks/useAttachmentMutations';
import { formatDateTime, formatBytes } from '@/app/lib/formatters';
import {
  Message as ApiMessage,
  ConversationStatus,
  Discussion as ApiDiscussion,
  DiscussionStatus,
  Reply,
  Attachment as ApiAttachment,
  AttachmentType,
  Conversation,
} from '@/api/services/collaboration-service';
import {
  Upload,
  Film,
  FileSpreadsheet,
  MessageSquare,
  Bell,
  Paperclip,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  Search,
  Filter,
  Send,
  Image as ImageIcon,
  File,
  Mic,
  MoreVertical,
  Check,
  CheckCheck,
  Pin,
  Archive,
  Trash2,
  Download,
  Eye,
  Edit,
  Reply as ReplyIcon,
  ThumbsUp,
  Activity,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  User,
  Building2,
  FileText,
  GitBranch,
  Target,
  Zap,
  AlertTriangle,
  XCircle,
  ChevronRight,
  ChevronLeft,
  Plus,
  X,
  Settings,
  Star,
  Flag,
  Bookmark,
  Share2,
  RefreshCw,
  Maximize2,
  Minimize2,
  LayoutDashboard,
  Loader2,
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

type ViewType = 'hub' | 'chat' | 'discussions' | 'attachments' | 'revisions' | 'notifications' | 'sla' | 'health' | 'timeline';

interface Attachment {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedBy: string;
  uploadDate: string;
  projectStage: string;
}

interface RevisionRequest {
  id: string;
  title: string;
  requestor: string;
  assignee: string;
  dueDate: string;
  status: 'open' | 'in-progress' | 'resolved' | 'rejected';
  priority: 'high' | 'medium' | 'low';
  description: string;
}

interface Notification {
  id: string;
  type: 'message' | 'attachment' | 'approval' | 'revision' | 'overdue' | 'update';
  title: string;
  content: string;
  timestamp: string;
  priority: 'high' | 'medium' | 'low';
  read: boolean;
}

export function ProjectCollaborationModule() {
  const navigate = useNavigate();
  const { view, projectId } = useParams<{ view?: ViewType; projectId?: string }>();
  const currentView: ViewType = view ?? 'hub';
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedConversation = searchParams.get('conv');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const {
    conversations,
    isLoading: conversationsLoading,
    error: conversationsError,
    refetch: refetchConversations,
  } = useProjectConversations(projectId);

  const {
    attachments,
    isLoading: attachmentsLoading,
    error: attachmentsError,
    pagination: attachmentsPagination,
    filters: attachmentsFilters,
    setPage: setAttachmentsPage,
    setFilters: setAttachmentsFilters,
    applyFilters: applyAttachmentsFilters,
    refetch: refetchAttachments,
  } = useProjectAttachments(projectId);

  const {
    discussions,
    isLoading: discussionsLoading,
    error: discussionsError,
    pagination: discussionsPagination,
    filters: discussionsFilters,
    setPage: setDiscussionsPage,
    setFilters: setDiscussionsFilters,
    applyFilters: applyDiscussionsFilters,
    refetch: refetchDiscussions,
  } = useProjectDiscussions(projectId);

  const {
    messages,
    hasMore,
    isLoading: messagesLoading,
    isSending,
    error: messagesError,
    loadMessages,
    sendMessage,
    editMessage,
    deleteMessage,
    markAsRead,
    retrySend,
    clearError,
    appendMessage,
  } = useConversationMessages(projectId, selectedConversation);

  useConversationRealtime(projectId, selectedConversation, appendMessage);

  console.log('✓ ProjectCollaborationModule rendered');

  const setCurrentView = (nextView: ViewType) => {
    if (!projectId) {
      navigate(`/dashboard/collaboration/${nextView}`);
      return;
    }
    if (nextView === 'chat') {
      navigate(`/dashboard/collaboration/${projectId}/chat`);
    } else {
      navigate(`/dashboard/collaboration/${projectId}/${nextView}`);
    }
  };

  const selectConversation = (id: string) => {
    if (!projectId) return;
    setSearchParams({ conv: id });
  };

  const currentConversation = useMemo(() => {
    return conversations.find((c) => c.id === selectedConversation) || null;
  }, [conversations, selectedConversation]);

  const filteredConversations = useMemo(() => {
    return conversations.filter((conv) => {
      const title = conv.title || '';
      const lastText = conv.lastMessageText || '';
      const matchesSearch =
        !searchQuery ||
        title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lastText.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'all' || conv.status === filterStatus.toUpperCase();
      return matchesSearch && matchesStatus;
    });
  }, [conversations, searchQuery, filterStatus]);

  const statusLabel = (status: ConversationStatus) => {
    switch (status) {
      case 'ACTIVE': return 'نشط';
      case 'ARCHIVED': return 'مؤرشف';
      case 'MUTED': return 'مكتوم';
      default: return status;
    }
  };

  const statusClass = (status: ConversationStatus) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-700';
      case 'ARCHIVED': return 'bg-gray-100 text-gray-700';
      case 'MUTED': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Sample Data
  const sampleAttachments: Attachment[] = [
    { id: '1', name: 'خطة_المشروع.pdf', type: 'pdf', size: '3.2 MB', uploadedBy: 'أحمد محمد', uploadDate: '2026-06-01', projectStage: 'تخطيط' },
    { id: '2', name: 'الميزانية_التفصيلية.xlsx', type: 'excel', size: '856 KB', uploadedBy: 'فاطمة أحمد', uploadDate: '2026-06-03', projectStage: 'مراجعة مالية' },
    { id: '3', name: 'صور_الموقع.zip', type: 'archive', size: '12.5 MB', uploadedBy: 'خالد سعيد', uploadDate: '2026-06-05', projectStage: 'دراسة ميدانية' }
  ];

  const revisions: RevisionRequest[] = [
    {
      id: '1',
      title: 'تعديل مؤشرات الأداء',
      requestor: 'أحمد محمد',
      assignee: 'فاطمة أحمد',
      dueDate: '2026-06-10',
      status: 'in-progress',
      priority: 'high',
      description: 'يرجى إضافة مؤشرات أداء كمية قابلة للقياس'
    },
    {
      id: '2',
      title: 'تحديث الجدول الزمني',
      requestor: 'خالد سعيد',
      assignee: 'محمد عبدالله',
      dueDate: '2026-06-08',
      status: 'open',
      priority: 'medium',
      description: 'تحديث الجدول الزمني ليتوافق مع الميزانية الجديدة'
    }
  ];

  const notifications: Notification[] = [
    {
      id: '1',
      type: 'message',
      title: 'رسالة جديدة',
      content: 'أحمد محمد أرسل رسالة في برنامج الأسر المنتجة',
      timestamp: 'منذ 5 دقائق',
      priority: 'medium',
      read: false
    },
    {
      id: '2',
      type: 'revision',
      title: 'طلب تعديل',
      content: 'تم تعيين طلب تعديل جديد لك',
      timestamp: 'منذ ساعة',
      priority: 'high',
      read: false
    },
    {
      id: '3',
      type: 'overdue',
      title: 'رد متأخر',
      content: 'لم يتم الرد على مشروع التدريب المهني منذ 3 أيام',
      timestamp: 'منذ 3 أيام',
      priority: 'high',
      read: true
    }
  ];

  // PAGE 1: Communications Hub
  const HubView = () => {
    const stats = {
      activeConversations: conversations.filter(c => c.status === 'ACTIVE').length,
      unreadMessages: conversations.reduce((sum, c) => sum + c.unreadCount, 0),
      pendingResponses: conversations.filter(c => c.status === 'MUTED').length,
      delayedResponses: conversations.filter(c => c.status === 'ARCHIVED').length
    };

    return (
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">مركز الاتصالات</h1>
          <p className="text-gray-600">لوحة التحكم المركزية لجميع تواصلات المشاريع</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <MessageSquare className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.activeConversations}</p>
            <p className="text-sm text-gray-600 mt-1">محادثات نشطة</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-blue-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <Bell className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-blue-600">{stats.unreadMessages}</p>
            <p className="text-sm text-gray-600 mt-1">رسائل غير مقروءة</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-yellow-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
            <p className="text-3xl font-bold text-yellow-600">{stats.pendingResponses}</p>
            <p className="text-sm text-gray-600 mt-1">بانتظار رد</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-red-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <p className="text-3xl font-bold text-red-600">{stats.delayedResponses}</p>
            <p className="text-sm text-gray-600 mt-1">ردود متأخرة</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-64">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="بحث في المحادثات..."
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>جميع المشاريع</option>
              <option>برنامج الأسر المنتجة</option>
              <option>مشروع كفالة الأيتام</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">جميع الحالات</option>
              <option value="active">نشطة</option>
              <option value="waiting">بانتظار رد</option>
              <option value="overdue">متأخرة</option>
            </select>
          </div>
        </div>

        {/* Conversations List */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold">المحادثات النشطة</h2>
            {conversationsLoading && <Loader2 className="w-5 h-5 animate-spin text-blue-600" />}
          </div>
          {conversationsError && (
            <div className="p-6 text-center">
              <p className="text-red-600 mb-3">{conversationsError}</p>
              <button
                onClick={() => refetchConversations()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto"
              >
                <RefreshCw className="w-4 h-4" />
                إعادة المحاولة
              </button>
            </div>
          )}
          {!conversationsError && conversations.length === 0 && !conversationsLoading && (
            <div className="p-6 text-center text-gray-500">لا توجد محادثات حالياً</div>
          )}
          <div className="divide-y divide-gray-200">
            {conversations.map((conv) => (
              <Link
                to={projectId ? `/dashboard/collaboration/${projectId}/chat?conv=${conv.id}` : '/dashboard/collaboration/chat'}
                key={conv.id}
                onClick={() => selectConversation(conv.id)}
                className="w-full p-6 hover:bg-gray-50 transition-colors text-right block"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-lg">{conv.title || 'محادثة'}</h3>
                      {conv.unreadCount > 0 && (
                        <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full font-medium">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{conv.type === 'PROJECT_GROUP' ? 'محادثة المشروع' : conv.type === 'DIRECT_MESSAGE' ? 'رسالة مباشرة' : 'تنبيه'}</p>
                    <p className="text-sm text-gray-700">{conv.lastMessageText || 'لا توجد رسائل'}</p>
                  </div>
                  <div className="text-left">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-2 ${statusClass(conv.status)}`}>
                      {statusLabel(conv.status)}
                    </span>
                    <p className="text-xs text-gray-500">{formatDateTime(conv.lastMessageAt)}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Attachments */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">المرفقات الأخيرة</h3>
            <Link
              to="/dashboard/collaboration/attachments"
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              عرض الكل
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {attachments.slice(0, 3).map((att) => (
              <div key={att.id} className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg">
                <Paperclip className="w-5 h-5 text-gray-400" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{att.name}</p>
                  <p className="text-xs text-gray-500">{att.uploadedBy} • {att.uploadDate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link
            to={projectId ? `/dashboard/collaboration/${projectId}/chat` : '/dashboard/collaboration/chat'}
            className="p-6 bg-white border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
          >
            <MessageSquare className="w-8 h-8 text-gray-400 mx-auto mb-3" />
            <p className="font-medium text-sm">بدء محادثة</p>
          </Link>
          <Link
            to={projectId ? `/dashboard/collaboration/${projectId}/discussions` : '/dashboard/collaboration/discussions'}
            className="p-6 bg-white border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
          >
            <GitBranch className="w-8 h-8 text-gray-400 mx-auto mb-3" />
            <p className="font-medium text-sm">المناقشات</p>
          </Link>
          <Link
            to={projectId ? `/dashboard/collaboration/${projectId}/revisions` : '/dashboard/collaboration/revisions'}
            className="p-6 bg-white border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
          >
            <Edit className="w-8 h-8 text-gray-400 mx-auto mb-3" />
            <p className="font-medium text-sm">طلبات التعديل</p>
          </Link>
          <Link
            to={projectId ? `/dashboard/collaboration/${projectId}/sla` : '/dashboard/collaboration/sla'}
            className="p-6 bg-white border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
          >
            <BarChart3 className="w-8 h-8 text-gray-400 mx-auto mb-3" />
            <p className="font-medium text-sm">التحليلات</p>
          </Link>
        </div>
      </div>
    );
  };

interface ChatViewProps {
  projectId?: string;
  selectedConversation: string | null;
  conversations: Conversation[];
  conversationsLoading: boolean;
  conversationsError: string | null;
  refetchConversations: () => void;
  currentConversation: Conversation | null;
  filteredConversations: Conversation[];
  selectConversation: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  messages: ApiMessage[];
  messagesLoading: boolean;
  messagesError: string | null;
  hasMore: boolean;
  isSending: boolean;
  loadMessages: (reset?: boolean) => void;
  sendMessage: (content: string) => Promise<void>;
  editMessage: (messageId: string, content: string) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
  markAsRead: (messageId: string) => void;
  retrySend: (messageId: string) => void;
  clearError: () => void;
  revisions: RevisionRequest[];
}

// PAGE 2: Chat Messages
function ChatView({
  projectId,
  selectedConversation,
  conversations,
  conversationsLoading,
  conversationsError,
  refetchConversations,
  currentConversation,
  filteredConversations,
  selectConversation,
  searchQuery,
  setSearchQuery,
  messages,
  messagesLoading,
  messagesError,
  hasMore,
  isSending,
  loadMessages,
  sendMessage,
  editMessage,
  deleteMessage,
  markAsRead,
  retrySend,
  clearError,
  revisions,
}: ChatViewProps) {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const currentUserId = 'me';
  const [messageInput, setMessageInput] = useState('');
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editInput, setEditInput] = useState('');
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const handleSend = async () => {
    if (!messageInput.trim() || isSending) return;
    await sendMessage(messageInput);
    setMessageInput('');
  };

  const startEdit = (msg: ApiMessage) => {
    setEditingMessageId(msg.id);
    setEditInput(msg.content);
  };

    const cancelEdit = () => {
      setEditingMessageId(null);
      setEditInput('');
    };

    const submitEdit = async (messageId: string) => {
      await editMessage(messageId, editInput);
      cancelEdit();
    };

    const confirmDelete = async () => {
      if (!deleteTargetId) return;
      await deleteMessage(deleteTargetId);
      setDeleteTargetId(null);
    };

    return (
      <div className="h-[calc(100vh-200px)] flex gap-4">
        {/* Left Panel - Conversations */}
        <div className="w-80 bg-white rounded-xl border border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="relative mb-3">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="بحث..."
                className="w-full pr-9 pl-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Link
              to={projectId ? `/dashboard/collaboration/${projectId}/hub` : '/dashboard/collaboration/hub'}
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <ChevronRight className="w-4 h-4" />
              رجوع للمركز
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversationsLoading && conversations.length === 0 && (
              <div className="p-4 space-y-3">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
                ))}
              </div>
            )}
            {conversationsError && (
              <div className="p-4 text-center">
                <p className="text-red-600 text-sm mb-2">{conversationsError}</p>
                <button
                  onClick={() => refetchConversations()}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  إعادة المحاولة
                </button>
              </div>
            )}
            {!conversationsLoading && !conversationsError && conversations.length === 0 && (
              <div className="p-4 text-center text-gray-500 text-sm">لا توجد محادثات</div>
            )}
            {filteredConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => selectConversation(conv.id)}
                className={`w-full p-4 border-b border-gray-200 hover:bg-gray-50 text-right ${
                  selectedConversation === conv.id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-sm">{conv.title || 'محادثة'}</h4>
                  {conv.unreadCount > 0 && (
                    <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 truncate">{conv.lastMessageText || 'لا توجد رسائل'}</p>
                <p className="text-xs text-gray-400 mt-1">{formatDateTime(conv.lastMessageAt)}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Center - Messages */}
        <div className="flex-1 bg-white rounded-xl border border-gray-200 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h3 className="font-semibold">{currentConversation?.title || 'المحادثة'}</h3>
              <p className="text-sm text-gray-600">
                {currentConversation?.type === 'PROJECT_GROUP' ? 'محادثة المشروع' : 'رسالة مباشرة'}
              </p>
            </div>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Search className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <MoreVertical className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto p-6 space-y-4"
          >
            {messagesError && (
              <div className="text-center p-4">
                <p className="text-red-600 mb-3">{messagesError}</p>
                <button
                  onClick={() => { clearError(); loadMessages(true); }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto"
                >
                  <RefreshCw className="w-4 h-4" />
                  إعادة المحاولة
                </button>
              </div>
            )}
            {!selectedConversation && !messagesError && (
              <div className="h-full flex items-center justify-center text-gray-500">
                اختر محادثة لعرض الرسائل
              </div>
            )}
            {selectedConversation && !messagesLoading && messages.length === 0 && !messagesError && (
              <div className="h-full flex items-center justify-center text-gray-500">
                لا توجد رسائل في هذه المحادثة
              </div>
            )}
            {selectedConversation && hasMore && !messagesLoading && (
              <div className="text-center">
                <button
                  onClick={() => loadMessages()}
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 mx-auto"
                >
                  <RefreshCw className="w-4 h-4" />
                  تحميل المزيد
                </button>
              </div>
            )}
            {messagesLoading && messages.length === 0 && (
              <div className="space-y-4">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="flex gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-24 bg-gray-100 rounded animate-pulse" />
                      <div className="h-10 w-2/3 bg-gray-100 rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            )}
            {messages.map((msg) => {
              const isOwn = msg.senderUserId === currentUserId || msg.senderUserId === 'me';
              return (
                <MessageBubble
                  key={msg.id}
                  msg={msg}
                  isOwn={isOwn}
                  editingMessageId={editingMessageId}
                  editInput={editInput}
                  setEditInput={setEditInput}
                  onStartEdit={startEdit}
                  onCancelEdit={cancelEdit}
                  onSubmitEdit={submitEdit}
                  onDelete={setDeleteTargetId}
                  onRetry={retrySend}
                  onMarkAsRead={markAsRead}
                />
              );
            })}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-3">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Paperclip className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <ImageIcon className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Mic className="w-5 h-5 text-gray-600" />
              </button>
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSend(); } }}
                placeholder="اكتب رسالتك..."
                disabled={isSending}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
              <button
                onClick={handleSend}
                disabled={isSending || !messageInput.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-60"
              >
                {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                إرسال
              </button>
            </div>
          </div>

          {/* Delete Confirmation */}
          {deleteTargetId && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 shadow-lg max-w-sm w-full mx-4">
                <h3 className="font-semibold mb-2">حذف الرسالة</h3>
                <p className="text-sm text-gray-600 mb-4">هل أنت متأكد من حذف هذه الرسالة؟</p>
                <div className="flex gap-3">
                  <button
                    onClick={confirmDelete}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    حذف
                  </button>
                  <button
                    onClick={() => setDeleteTargetId(null)}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Project Info */}
        <div className="w-80 bg-white rounded-xl border border-gray-200 overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold mb-2">ملخص المشروع</h3>
            <p className="text-sm text-gray-600">{currentConversation?.title || projectId || 'المشروع'}</p>
          </div>

          <div className="p-4 border-b border-gray-200">
            <h4 className="font-semibold text-sm mb-3">المشاركون</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-sm">أنت</span>
              </div>
            </div>
          </div>

          <div className="p-4 border-b border-gray-200">
            <h4 className="font-semibold text-sm mb-3">الطلبات المفتوحة</h4>
            <div className="space-y-2">
              {revisions.slice(0, 2).map((rev) => (
                <div key={rev.id} className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium mb-1">{rev.title}</p>
                  <p className="text-xs text-gray-600">الحالة: {rev.status === 'in-progress' ? 'قيد العمل' : 'مفتوح'}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4">
            <h4 className="font-semibold text-sm mb-3">حالة المشروع</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">التقدم</span>
                <span className="text-sm font-medium">65%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600" style={{ width: '65%' }}></div>
              </div>
              <div className="pt-2">
                <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                  قيد التنفيذ
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

function MessageBubble({
  msg,
  isOwn,
  editingMessageId,
  editInput,
  setEditInput,
  onStartEdit,
  onCancelEdit,
  onSubmitEdit,
  onDelete,
  onRetry,
  onMarkAsRead,
}: {
  msg: ApiMessage;
  isOwn: boolean;
  editingMessageId: string | null;
  editInput: string;
  setEditInput: (value: string) => void;
  onStartEdit: (msg: ApiMessage) => void;
  onCancelEdit: () => void;
  onSubmitEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onRetry: (id: string) => void;
  onMarkAsRead: (id: string) => void;
}) {
  const bubbleRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = bubbleRef.current;
    if (!node || msg.status === 'READ' || isOwn) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onMarkAsRead(msg.id);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [msg, isOwn, onMarkAsRead]);

  if (msg.deletedAt) {
    return (
      <div className="flex justify-center my-2">
        <span className="text-xs text-gray-400 italic">تم حذف هذه الرسالة</span>
      </div>
    );
  }

  if (editingMessageId === msg.id) {
    return (
      <div className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : ''}`}>
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
          <User className="w-5 h-5 text-blue-600" />
        </div>
        <div className={`flex-1 ${isOwn ? 'text-left' : 'text-right'}`}>
          <input
            type="text"
            value={editInput}
            onChange={(e) => setEditInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') { e.preventDefault(); onSubmitEdit(msg.id); }
              if (e.key === 'Escape') { onCancelEdit(); }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
            autoFocus
          />
          <div className="flex gap-2 mt-1 justify-end">
            <button
              onClick={() => onSubmitEdit(msg.id)}
              className="text-xs px-2 py-1 bg-blue-600 text-white rounded"
            >
              حفظ
            </button>
            <button
              onClick={onCancelEdit}
              className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded"
            >
              إلغاء
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={bubbleRef} className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : ''}`}>
      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
        <User className="w-5 h-5 text-blue-600" />
      </div>
      <div className={`flex-1 ${isOwn ? 'text-left' : 'text-right'}`}>
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-sm">{msg.senderUserId === 'me' ? 'أنت' : msg.senderUserId.slice(0, 8)}</span>
          {msg.editedAt && <span className="text-xs text-gray-400">(تم التعديل)</span>}
        </div>
        <div className={`inline-block p-3 rounded-lg ${isOwn ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
          <p className="text-sm">{msg.content}</p>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-gray-500">{formatDateTime(msg.createdAt)}</span>
          {msg.status === 'READ' && <CheckCheck className="w-4 h-4 text-blue-600" />}
          {msg.status === 'DELIVERED' && <CheckCheck className="w-4 h-4 text-gray-400" />}
          {msg.status === 'SENT' && <Check className="w-4 h-4 text-gray-400" />}
          {msg.status === 'SENDING' && <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />}
          {msg.status === 'FAILED' && (
            <button onClick={() => onRetry(msg.id)} className="text-xs text-red-600 underline">
              فشل - إعادة
            </button>
          )}
          {isOwn && msg.status !== 'SENDING' && (
            <>
              <button onClick={() => onStartEdit(msg)} className="text-xs text-gray-500 hover:text-blue-600">
                تعديل
              </button>
              <button onClick={() => onDelete(msg.id)} className="text-xs text-gray-500 hover:text-red-600">
                حذف
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// PAGE 3: Threaded Discussions (Figma/Notion-style)
const DiscussionsView = () => {
    const [selectedSection, setSelectedSection] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState<DiscussionStatus | 'all'>('all');
    const [showNewDiscussion, setShowNewDiscussion] = useState(false);
    const [selectedDiscussionId, setSelectedDiscussionId] = useState<string | null>(null);
    const [newDiscussionTitle, setNewDiscussionTitle] = useState('');
    const [newDiscussionSection, setNewDiscussionSection] = useState('budget');
    const [newDiscussionContent, setNewDiscussionContent] = useState('');
    const [newDiscussionErrors, setNewDiscussionErrors] = useState<Record<string, string>>({});
    const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});
    const [replyErrors, setReplyErrors] = useState<Record<string, string>>({});
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

    const {
      discussion,
      replies,
      isLoading: detailLoading,
      isMutating: detailMutating,
      error: detailError,
      load: reloadDiscussion,
      createDiscussion,
      changeStatus,
      deleteDiscussion,
      createReply,
      retryReply,
      acceptReply,
      clearError: clearDetailError,
    } = useDiscussionDetail(projectId, selectedDiscussionId);

    const statusOptions: { value: DiscussionStatus; label: string }[] = [
      { value: 'OPEN', label: 'مفتوح' },
      { value: 'RESOLVED', label: 'محلول' },
      { value: 'CLOSED', label: 'مغلق' },
    ];

    const sectionOptions = [
      { value: 'all', label: 'الكل' },
      { value: 'budget', label: 'الميزانية' },
      { value: 'timeline', label: 'الجدول الزمني' },
      { value: 'scope', label: 'النطاق' },
      { value: 'general', label: 'عام' },
    ];

    const handleSectionFilter = (section: string) => {
      setSelectedSection(section);
      setDiscussionsFilters({ section: section === 'all' ? undefined : section });
      applyDiscussionsFilters();
    };

    const handleStatusFilter = (status: DiscussionStatus | 'all') => {
      setSelectedStatus(status);
      setDiscussionsFilters({ status: status === 'all' ? undefined : status });
      applyDiscussionsFilters();
    };

    const handlePageChange = (page: number) => {
      setDiscussionsPage(page);
    };

    const handleCreateDiscussion = async () => {
      const errors: Record<string, string> = {};
      if (!newDiscussionTitle.trim()) errors.title = 'عنوان النقاش مطلوب';
      if (newDiscussionTitle.trim().length > 500) errors.title = 'العنوان يجب أن يكون أقل من 500 حرف';
      if (!newDiscussionContent.trim()) errors.content = 'محتوى النقاش مطلوب';
      if (newDiscussionContent.trim().length > 20000) errors.content = 'المحتوى يجب أن يكون أقل من 20000 حرف';
      if (!newDiscussionSection.trim()) errors.section = 'القسم مطلوب';
      if (Object.keys(errors).length > 0) {
        setNewDiscussionErrors(errors);
        return;
      }

      const created = await createDiscussion({
        section: newDiscussionSection,
        title: newDiscussionTitle.trim(),
        content: newDiscussionContent.trim(),
      });

      if (created) {
        setNewDiscussionTitle('');
        setNewDiscussionContent('');
        setNewDiscussionSection('budget');
        setNewDiscussionErrors({});
        setShowNewDiscussion(false);
        setSelectedDiscussionId(created.id);
        applyDiscussionsFilters();
      }
    };

    const handleReplySubmit = async (discussionId: string) => {
      const content = replyInputs[discussionId] || '';
      if (!content.trim()) {
        setReplyErrors((prev) => ({ ...prev, [discussionId]: 'محتوى الرد مطلوب' }));
        return;
      }
      if (content.trim().length > 20000) {
        setReplyErrors((prev) => ({ ...prev, [discussionId]: 'محتوى الرد يجب أن يكون أقل من 20000 حرف' }));
        return;
      }
      setReplyErrors((prev) => ({ ...prev, [discussionId]: '' }));
      setReplyInputs((prev) => ({ ...prev, [discussionId]: '' }));
      await createReply(content);
    };

    const handleReplyRetry = async (tempId: string, content: string) => {
      setReplyInputs((prev) => ({ ...prev, [discussionIdForReply]: content }));
      await retryReply(tempId);
    };

    const discussionIdForReply = discussion?.id || '';

    const handleStatusChange = async (status: DiscussionStatus) => {
      await changeStatus(status);
    };

    const handleDeleteDiscussion = async (id: string) => {
      setDeleteConfirmId(id);
    };

    const confirmDeleteDiscussion = async () => {
      if (!deleteConfirmId) return;
      if (deleteConfirmId === selectedDiscussionId) {
        const success = await deleteDiscussion();
        if (success) {
          setSelectedDiscussionId(null);
          setDeleteConfirmId(null);
          applyDiscussionsFilters();
        }
      } else {
        // For deleting from the list directly we would need a service call here;
        // the current hook is scoped to selectedDiscussionId. We defer to selecting first.
        setSelectedDiscussionId(deleteConfirmId);
        setDeleteConfirmId(null);
      }
    };

    const handleAcceptReply = async (replyId: string) => {
      await acceptReply(replyId);
    };

    const statusBadgeClass = (status: DiscussionStatus) => {
      switch (status) {
        case 'OPEN': return 'bg-blue-100 text-blue-700';
        case 'RESOLVED': return 'bg-green-100 text-green-700';
        case 'CLOSED': return 'bg-gray-100 text-gray-700';
        default: return 'bg-gray-100 text-gray-700';
      }
    };

    const statusBadgeLabel = (status: DiscussionStatus) => {
      switch (status) {
        case 'OPEN': return 'مفتوح';
        case 'RESOLVED': return 'محلول';
        case 'CLOSED': return 'مغلق';
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">المناقشات المترابطة</h1>
            <p className="text-gray-600">نقاشات على أقسام المشروع</p>
          </div>
          <button
            onClick={() => setShowNewDiscussion(!showNewDiscussion)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            نقاش جديد
          </button>
        </div>

        {/* Status Filter */}
        <div className="flex gap-2 flex-wrap">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleStatusFilter(option.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                selectedStatus === option.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Section Filter */}
        <div className="flex gap-2 flex-wrap">
          {sectionOptions.map((section) => (
            <button
              key={section.value}
              onClick={() => handleSectionFilter(section.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                selectedSection === section.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>

        {/* New Discussion Form */}
        {showNewDiscussion && (
          <div className="bg-white rounded-xl p-6 border border-blue-200 shadow-lg">
            <h3 className="font-semibold mb-4">نقاش جديد</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">عنوان النقاش</label>
                <input
                  type="text"
                  value={newDiscussionTitle}
                  onChange={(e) => setNewDiscussionTitle(e.target.value)}
                  placeholder="مثال: ملاحظات على توزيع الميزانية"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                {newDiscussionErrors.title && <p className="text-red-600 text-sm mt-1">{newDiscussionErrors.title}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">القسم</label>
                <select
                  value={newDiscussionSection}
                  onChange={(e) => setNewDiscussionSection(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="budget">الميزانية</option>
                  <option value="timeline">الجدول الزمني</option>
                  <option value="scope">النطاق</option>
                  <option value="general">عام</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">المحتوى</label>
                <textarea
                  rows={4}
                  value={newDiscussionContent}
                  onChange={(e) => setNewDiscussionContent(e.target.value)}
                  placeholder="اكتب تفاصيل النقاش..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                {newDiscussionErrors.content && <p className="text-red-600 text-sm mt-1">{newDiscussionErrors.content}</p>}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleCreateDiscussion}
                  disabled={detailMutating}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {detailMutating ? 'جاري النشر...' : 'نشر النقاش'}
                </button>
                <button
                  onClick={() => setShowNewDiscussion(false)}
                  className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading / Error / Empty List */}
        {discussionsLoading && discussions.length === 0 && (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-32 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        )}
        {discussionsError && (
          <div className="p-6 text-center bg-white rounded-xl border border-gray-200">
            <p className="text-red-600 mb-3">{discussionsError}</p>
            <button
              onClick={() => refetchDiscussions()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto"
            >
              <RefreshCw className="w-4 h-4" />
              إعادة المحاولة
            </button>
          </div>
        )}
        {!discussionsLoading && !discussionsError && discussions.length === 0 && (
          <div className="p-6 text-center text-gray-500 bg-white rounded-xl border border-gray-200">
            لا توجد مناقشات حالياً. ابدأ أول نقاش.
          </div>
        )}

        {/* Pagination */}
        {discussionsPagination.totalPages > 1 && (
          <div className="flex items-center justify-between bg-white rounded-xl p-4 border border-gray-200">
            <button
              onClick={() => handlePageChange(Math.max(1, discussionsPagination.page - 1))}
              disabled={discussionsPagination.page <= 1}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
            >
              السابق
            </button>
            <span className="text-sm text-gray-700">
              صفحة {discussionsPagination.page} من {discussionsPagination.totalPages}
            </span>
            <button
              onClick={() => handlePageChange(Math.min(discussionsPagination.totalPages, discussionsPagination.page + 1))}
              disabled={discussionsPagination.page >= discussionsPagination.totalPages}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
            >
              التالي
            </button>
          </div>
        )}

        {/* Discussions List */}
        <div className="space-y-4">
          {discussions.map((discussionItem) => (
            <div key={discussionItem.id} className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{discussionItem.title}</h3>
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">
                        {discussionItem.section}
                      </span>
                      <span className={`px-3 py-1 text-xs rounded-full font-medium ${statusBadgeClass(discussionItem.status)}`}>
                        {statusBadgeLabel(discussionItem.status)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{discussionItem.content}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{discussionItem.authorUserId}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{formatDateTime(discussionItem.lastReplyAt || discussionItem.updatedAt)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ReplyIcon className="w-4 h-4" />
                        <span>{discussionItem.replyCount} رد</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detail View for Selected Discussion */}
                {selectedDiscussionId === discussionItem.id && (
                  <div className="mt-6 border-t border-gray-200 pt-4">
                    {detailLoading && (
                      <div className="space-y-3">
                        <div className="h-4 bg-gray-100 rounded animate-pulse w-1/3" />
                        <div className="h-20 bg-gray-100 rounded animate-pulse" />
                        {[1, 2].map((n) => <div key={n} className="h-16 bg-gray-100 rounded animate-pulse" />)}
                      </div>
                    )}
                    {detailError && (
                      <div className="p-4 text-center">
                        <p className="text-red-600 mb-2">{detailError}</p>
                        <button
                          onClick={() => reloadDiscussion()}
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          إعادة المحاولة
                        </button>
                      </div>
                    )}
                    {discussion && !detailLoading && !detailError && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 text-xs rounded-full font-medium ${statusBadgeClass(discussion.status)}`}>
                              {statusBadgeLabel(discussion.status)}
                            </span>
                            <span className="text-sm text-gray-500">{formatDateTime(discussion.createdAt)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {(['OPEN', 'RESOLVED', 'CLOSED'] as DiscussionStatus[]).map((s) => (
                              <button
                                key={s}
                                onClick={() => handleStatusChange(s)}
                                disabled={detailMutating || discussion.status === s}
                                className={`px-3 py-1 text-xs rounded-lg border ${
                                  discussion.status === s
                                    ? 'bg-blue-600 text-white border-blue-600'
                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                } disabled:opacity-50`}
                              >
                                {statusBadgeLabel(s)}
                              </button>
                            ))}
                            <button
                              onClick={() => handleDeleteDiscussion(discussion.id)}
                              className="px-3 py-1 text-xs rounded-lg border border-red-300 text-red-700 hover:bg-red-50"
                            >
                              حذف
                            </button>
                          </div>
                        </div>

                        <div className="prose max-w-none text-sm text-gray-700">
                          {discussion.content}
                        </div>

                        {/* Replies */}
                        <div className="space-y-3">
                          {replies.map((reply) => {
                            const isOptimistic = 'pending' in reply;
                            return (
                              <div
                                key={reply.id}
                                className={`bg-gray-50 p-4 rounded-lg ${
                                  reply.isAccepted ? 'border-2 border-green-400' : 'border border-gray-200'
                                }`}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                      <User className="w-3 h-3 text-blue-600" />
                                    </div>
                                    <span className="text-sm font-medium">{reply.authorUserId}</span>
                                    <span className="text-xs text-gray-500">{formatDateTime(reply.createdAt)}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {reply.isAccepted && (
                                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                        الحل المقبول
                                      </span>
                                    )}
                                    {isOptimistic && (reply as { pending: boolean; failed: boolean }).pending && (
                                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                                        جاري الإرسال...
                                      </span>
                                    )}
                                    {isOptimistic && (reply as { pending: boolean; failed: boolean }).failed && (
                                      <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                                        فشل الإرسال
                                      </span>
                                    )}
                                    {!isOptimistic && discussion.status !== 'CLOSED' && (
                                      <button
                                        onClick={() => handleAcceptReply(reply.id)}
                                        disabled={detailMutating || reply.isAccepted}
                                        className="text-xs text-green-700 hover:text-green-800 disabled:opacity-50"
                                      >
                                        {reply.isAccepted ? 'تم القبول' : 'قبول كحل'}
                                      </button>
                                    )}
                                  </div>
                                </div>
                                <p className="text-sm text-gray-700">{reply.content}</p>
                                
                                {isOptimistic && (reply as { pending: boolean; failed: boolean }).failed && (
                                  <div className="mt-2 flex items-center gap-2">
                                    <button
                                      onClick={() => handleReplyRetry(reply.id, (reply as { originalContent: string }).originalContent)}
                                      className="px-3 py-1 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                      إعادة المحاولة
                                    </button>
                                    <span className="text-xs text-gray-600">{(reply as { originalContent: string }).originalContent}</span>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* Reply Input */}
                        {discussion.status !== 'CLOSED' && (
                          <div className="mt-4 flex flex-col gap-2">
                            <div className="flex gap-3">
                              <input
                                type="text"
                                value={replyInputs[discussion.id] || ''}
                                onChange={(e) => setReplyInputs((prev) => ({ ...prev, [discussion.id]: e.target.value }))}
                                placeholder="أضف ردك..."
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              />
                              <button
                                onClick={() => handleReplySubmit(discussion.id)}
                                disabled={detailMutating}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                              >
                                رد
                              </button>
                            </div>
                            {replyErrors[discussion.id] && <p className="text-red-600 text-sm">{replyErrors[discussion.id]}</p>}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => setSelectedDiscussionId(selectedDiscussionId === discussionItem.id ? null : discussionItem.id)}
                    className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 border border-blue-200 rounded-lg"
                  >
                    {selectedDiscussionId === discussionItem.id ? 'إخفاء التفاصيل' : 'عرض التفاصيل والردود'}
                  </button>
                  <button
                    onClick={() => handleDeleteDiscussion(discussionItem.id)}
                    className="px-4 py-2 text-sm text-red-600 hover:text-red-700 border border-red-200 rounded-lg"
                  >
                    حذف
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Delete Confirmation Modal */}
        {deleteConfirmId && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <h3 className="font-semibold text-lg mb-2">تأكيد الحذف</h3>
              <p className="text-gray-600 mb-4">هل أنت متأكد أنك تريد حذف هذا النقاش؟ سيظهر كعنصر محذوف في القائمة.</p>
              <div className="flex gap-3">
                <button
                  onClick={confirmDeleteDiscussion}
                  disabled={detailMutating}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  حذف
                </button>
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // PAGE 4: Attachments Center
  const AttachmentsView = () => {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [filterType, setFilterType] = useState<AttachmentType | 'all'>('all');
    const [showUpload, setShowUpload] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadStage, setUploadStage] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

    const {
      isUploading,
      uploadProgress,
      isDeleting,
      error: mutationError,
      upload,
      download,
      deleteAttachment,
      clearError,
    } = useAttachmentMutations(projectId);

    const typeOptions: { value: AttachmentType | 'all'; label: string }[] = [
      { value: 'all', label: 'الكل' },
      { value: 'DOCUMENT', label: 'مستند' },
      { value: 'IMAGE', label: 'صورة' },
      { value: 'VIDEO', label: 'فيديو' },
      { value: 'AUDIO', label: 'صوت' },
      { value: 'OTHER', label: 'آخر' },
    ];

    const handleFilterType = (type: AttachmentType | 'all') => {
      setFilterType(type);
      setAttachmentsFilters({ type: type === 'all' ? undefined : type });
      applyAttachmentsFilters();
    };

    const handlePageChange = (page: number) => {
      setAttachmentsPage(page);
    };

    const getFileIcon = (attachment: ApiAttachment) => {
      const mime = attachment.mimeType || '';
      if (mime.startsWith('image/')) return <ImageIcon className="w-8 h-8 text-purple-600" />;
      if (mime.startsWith('video/')) return <Film className="w-8 h-8 text-red-600" />;
      if (mime.startsWith('audio/')) return <Mic className="w-8 h-8 text-yellow-600" />;
      if (mime.includes('pdf')) return <FileText className="w-8 h-8 text-red-600" />;
      if (mime.includes('spreadsheet') || mime.includes('excel') || mime.includes('csv')) {
        return <FileSpreadsheet className="w-8 h-8 text-green-600" />;
      }
      return <File className="w-8 h-8 text-blue-600" />;
    };

    const handleFileSelect = (file: File | null) => {
      if (!file) return;
      setSelectedFile(file);
      setShowUpload(true);
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0] || null;
      handleFileSelect(file);
    };

    const handleUploadSubmit = async () => {
      if (!selectedFile) return;
      const created = await upload(selectedFile, uploadStage || undefined);
      if (created) {
        setSelectedFile(null);
        setUploadStage('');
        setShowUpload(false);
        applyAttachmentsFilters();
      }
    };

    const handleDownload = async (attachment: ApiAttachment) => {
      await download(attachment);
    };

    const handleDelete = async () => {
      if (!deleteTargetId) return;
      const success = await deleteAttachment(deleteTargetId);
      if (success) {
        setDeleteTargetId(null);
        applyAttachmentsFilters();
      }
    };

    const totalSize = attachments.reduce((sum, a) => sum + (a.fileSize || 0), 0);

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">مركز المرفقات</h1>
            <p className="text-gray-600">جميع ملفات المشروع في مكان واحد</p>
          </div>
          <button
            onClick={() => setShowUpload(!showUpload)}
            disabled={isUploading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
          >
            <Plus className="w-5 h-5" />
            رفع ملف
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <File className="w-8 h-8 text-blue-600 mb-3" />
            <p className="text-2xl font-bold">{attachmentsPagination.total}</p>
            <p className="text-sm text-gray-600">إجمالي الملفات</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <Paperclip className="w-8 h-8 text-green-600 mb-3" />
            <p className="text-2xl font-bold">{formatBytes(totalSize)}</p>
            <p className="text-sm text-gray-600">حجم التخزين</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <Users className="w-8 h-8 text-purple-600 mb-3" />
            <p className="text-2xl font-bold">{new Set(attachments.map((a) => a.uploadedByUserId)).size}</p>
            <p className="text-sm text-gray-600">المساهمون</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <Download className="w-8 h-8 text-gray-600 mb-3" />
            <p className="text-2xl font-bold">{attachmentsPagination.total}</p>
            <p className="text-sm text-gray-600">الملفات المتاحة</p>
          </div>
        </div>

        {/* Upload Area */}
        {showUpload && (
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`bg-white rounded-xl p-6 border-2 border-dashed transition-colors ${
              isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
          >
            <div className="text-center mb-4">
              <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-700">اسحب ملفاً هنا أو انقر لاختيار ملف</p>
              <input
                type="file"
                onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
                className="mt-2"
              />
            </div>
            {selectedFile && (
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <span className="text-sm font-medium">{selectedFile.name}</span>
                  <span className="text-sm text-gray-500">{formatBytes(selectedFile.size)}</span>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">المرحلة (اختياري)</label>
                  <select
                    value={uploadStage}
                    onChange={(e) => setUploadStage(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">بدون مرحلة</option>
                    <option value="planning">تخطيط</option>
                    <option value="execution">تنفيذ</option>
                    <option value="monitoring">مراقبة</option>
                    <option value="closure">إغلاق</option>
                  </select>
                </div>
                {isUploading && (
                  <div className="space-y-1">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 transition-all"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-600">{uploadProgress}%</p>
                  </div>
                )}
                {mutationError && <p className="text-red-600 text-sm">{mutationError}</p>}
                <div className="flex gap-3">
                  <button
                    onClick={handleUploadSubmit}
                    disabled={isUploading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isUploading ? 'جاري الرفع...' : 'رفع'}
                  </button>
                  <button
                    onClick={() => { setShowUpload(false); setSelectedFile(null); clearError(); }}
                    disabled={isUploading}
                    className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Filters and View Toggle */}
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex gap-2 flex-wrap">
              {typeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleFilterType(option.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    filterType === option.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
              >
                <LayoutDashboard className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
              >
                <FileText className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Loading / Error / Empty List */}
        {attachmentsLoading && attachments.length === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-48 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        )}
        {attachmentsError && (
          <div className="p-6 text-center bg-white rounded-xl border border-gray-200">
            <p className="text-red-600 mb-3">{attachmentsError}</p>
            <button
              onClick={() => refetchAttachments()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto"
            >
              <RefreshCw className="w-4 h-4" />
              إعادة المحاولة
            </button>
          </div>
        )}
        {!attachmentsLoading && !attachmentsError && attachments.length === 0 && (
          <div className="p-6 text-center text-gray-500 bg-white rounded-xl border border-gray-200">
            لا توجد مرفقات حالياً. ابدأ برفع أول ملف.
          </div>
        )}

        {/* Pagination */}
        {attachmentsPagination.totalPages > 1 && (
          <div className="flex items-center justify-between bg-white rounded-xl p-4 border border-gray-200">
            <button
              onClick={() => handlePageChange(Math.max(1, attachmentsPagination.page - 1))}
              disabled={attachmentsPagination.page <= 1}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
            >
              السابق
            </button>
            <span className="text-sm text-gray-700">
              صفحة {attachmentsPagination.page} من {attachmentsPagination.totalPages}
            </span>
            <button
              onClick={() => handlePageChange(Math.min(attachmentsPagination.totalPages, attachmentsPagination.page + 1))}
              disabled={attachmentsPagination.page >= attachmentsPagination.totalPages}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
            >
              التالي
            </button>
          </div>
        )}

        {/* Mutation Error Banner */}
        {mutationError && !showUpload && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between">
            <p className="text-red-700 text-sm">{mutationError}</p>
            <button
              onClick={() => clearError()}
              className="text-sm text-red-700 hover:text-red-800"
            >
              إخفاء
            </button>
          </div>
        )}

        {/* Files Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {attachments.map((file) => (
              <div key={file.id} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="flex flex-col items-center text-center">
                  {getFileIcon(file)}
                  <h4 className="font-semibold mt-4 mb-2 truncate w-full">{file.fileName}</h4>
                  <p className="text-sm text-gray-600 mb-1">{formatBytes(file.fileSize)}</p>
                  <p className="text-xs text-gray-500 mb-1">{file.uploadedByUserId}</p>
                  <p className="text-xs text-gray-500 mb-3">{formatDateTime(file.createdAt)}</p>
                  {file.projectStage && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full mb-4">
                      {file.projectStage}
                    </span>
                  )}
                  <div className="flex gap-2 w-full">
                    <button
                      onClick={() => handleDownload(file)}
                      className="flex-1 p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    >
                      <Download className="w-4 h-4 mx-auto" />
                    </button>
                    <button
                      onClick={() => setDeleteTargetId(file.id)}
                      disabled={isDeleting}
                      className="flex-1 p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4 mx-auto" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200">
            <table className="w-full">
              <thead className="border-b border-gray-200">
                <tr>
                  <th className="text-right p-4 font-semibold">اسم الملف</th>
                  <th className="text-right p-4 font-semibold">النوع</th>
                  <th className="text-right p-4 font-semibold">الحجم</th>
                  <th className="text-right p-4 font-semibold">رفع بواسطة</th>
                  <th className="text-right p-4 font-semibold">التاريخ</th>
                  <th className="text-right p-4 font-semibold">المرحلة</th>
                  <th className="text-right p-4 font-semibold">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {attachments.map((file) => (
                  <tr key={file.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="p-4 flex items-center gap-3">
                      {getFileIcon(file)}
                      <span className="font-medium">{file.fileName}</span>
                    </td>
                    <td className="p-4 text-sm">{file.attachmentType}</td>
                    <td className="p-4 text-sm">{formatBytes(file.fileSize)}</td>
                    <td className="p-4 text-sm">{file.uploadedByUserId}</td>
                    <td className="p-4 text-sm">{formatDateTime(file.createdAt)}</td>
                    <td className="p-4">
                      {file.projectStage && (
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                          {file.projectStage}
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDownload(file)}
                          className="p-2 hover:bg-gray-100 rounded"
                        >
                          <Download className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                          onClick={() => setDeleteTargetId(file.id)}
                          disabled={isDeleting}
                          className="p-2 hover:bg-red-100 rounded disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteTargetId && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <h3 className="font-semibold text-lg mb-2">تأكيد الحذف</h3>
              <p className="text-gray-600 mb-4">هل أنت متأكد أنك تريد حذف هذا الملف؟ لا يمكن التراجع عن هذا الإجراء.</p>
              <div className="flex gap-3">
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  حذف
                </button>
                <button
                  onClick={() => setDeleteTargetId(null)}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // PAGE 5: Revision Requests
  const RevisionsView = () => {
    const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'in-progress' | 'resolved' | 'rejected'>('all');
    const [showNewRequest, setShowNewRequest] = useState(false);

    const filteredRevisions = filterStatus === 'all'
      ? revisions
      : revisions.filter(r => r.status === filterStatus);

    const getStatusColor = (status: string) => {
      switch (status) {
        case 'open': return 'bg-blue-100 text-blue-700';
        case 'in-progress': return 'bg-yellow-100 text-yellow-700';
        case 'resolved': return 'bg-green-100 text-green-700';
        case 'rejected': return 'bg-red-100 text-red-700';
        default: return 'bg-gray-100 text-gray-700';
      }
    };

    const getPriorityColor = (priority: string) => {
      switch (priority) {
        case 'high': return 'text-red-600';
        case 'medium': return 'text-yellow-600';
        case 'low': return 'text-green-600';
        default: return 'text-gray-600';
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">طلبات التعديل</h1>
            <p className="text-gray-600">تتبع جميع طلبات التغيير والتحسينات</p>
          </div>
          <button
            onClick={() => setShowNewRequest(!showNewRequest)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            طلب تعديل جديد
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-6 border border-blue-200">
            <p className="text-2xl font-bold text-blue-600">{revisions.filter(r => r.status === 'open').length}</p>
            <p className="text-sm text-gray-600 mt-1">مفتوحة</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-yellow-200">
            <p className="text-2xl font-bold text-yellow-600">{revisions.filter(r => r.status === 'in-progress').length}</p>
            <p className="text-sm text-gray-600 mt-1">قيد العمل</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-green-200">
            <p className="text-2xl font-bold text-green-600">8</p>
            <p className="text-sm text-gray-600 mt-1">محلولة</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-red-200">
            <p className="text-2xl font-bold text-red-600">2</p>
            <p className="text-sm text-gray-600 mt-1">مرفوضة</p>
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex gap-2 flex-wrap">
          {(['all', 'open', 'in-progress', 'resolved', 'rejected'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filterStatus === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {status === 'all' ? 'الكل' : status === 'open' ? 'مفتوحة' : status === 'in-progress' ? 'قيد العمل' : status === 'resolved' ? 'محلولة' : 'مرفوضة'}
            </button>
          ))}
        </div>

        {/* New Request Form */}
        {showNewRequest && (
          <div className="bg-white rounded-xl p-6 border border-blue-200 shadow-lg">
            <h3 className="font-semibold mb-4">طلب تعديل جديد</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">عنوان الطلب</label>
                <input
                  type="text"
                  placeholder="مثال: تعديل مؤشرات الأداء"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">تعيين إلى</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option>فاطمة أحمد</option>
                  <option>محمد عبدالله</option>
                  <option>خالد سعيد</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">الأولوية</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option value="high">عالية</option>
                  <option value="medium">متوسطة</option>
                  <option value="low">منخفضة</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">تاريخ الاستحقاق</label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">الوصف</label>
                <textarea
                  rows={4}
                  placeholder="تفاصيل الطلب..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                إنشاء الطلب
              </button>
              <button
                onClick={() => setShowNewRequest(false)}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                إلغاء
              </button>
            </div>
          </div>
        )}

        {/* Requests List */}
        <div className="space-y-4">
          {filteredRevisions.map((request) => (
            <div key={request.id} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{request.title}</h3>
                    <span className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusColor(request.status)}`}>
                      {request.status === 'open' ? 'مفتوح' : request.status === 'in-progress' ? 'قيد العمل' : request.status === 'resolved' ? 'محلول' : 'مرفوض'}
                    </span>
                    <Flag className={`w-4 h-4 ${getPriorityColor(request.priority)}`} />
                  </div>
                  <p className="text-sm text-gray-700 mb-3">{request.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">طالب التعديل</p>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium">{request.requestor}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">معين إلى</p>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium">{request.assignee}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">تاريخ الاستحقاق</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium">{request.dueDate}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">الأولوية</p>
                  <span className={`text-sm font-medium ${getPriorityColor(request.priority)}`}>
                    {request.priority === 'high' ? 'عالية' : request.priority === 'medium' ? 'متوسطة' : 'منخفضة'}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 pt-3 border-t border-gray-200">
                {request.status === 'open' && (
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                    بدء العمل
                  </button>
                )}
                {request.status === 'in-progress' && (
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                    وضع علامة كمحلول
                  </button>
                )}
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm">
                  إضافة تعليق
                </button>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm">
                  عرض التفاصيل
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // PAGE 6: Notifications Center
  const NotificationsView = () => {
    const [filterType, setFilterType] = useState<'all' | 'message' | 'attachment' | 'approval' | 'revision' | 'overdue' | 'update'>('all');
    const [showUnreadOnly, setShowUnreadOnly] = useState(false);

    const filteredNotifications = notifications.filter(n => {
      if (filterType !== 'all' && n.type !== filterType) return false;
      if (showUnreadOnly && n.read) return false;
      return true;
    });

    const getNotificationIcon = (type: string) => {
      switch (type) {
        case 'message': return <MessageSquare className="w-5 h-5 text-blue-600" />;
        case 'attachment': return <Paperclip className="w-5 h-5 text-green-600" />;
        case 'approval': return <CheckCircle2 className="w-5 h-5 text-purple-600" />;
        case 'revision': return <Edit className="w-5 h-5 text-yellow-600" />;
        case 'overdue': return <AlertCircle className="w-5 h-5 text-red-600" />;
        case 'update': return <RefreshCw className="w-5 h-5 text-blue-600" />;
        default: return <Bell className="w-5 h-5 text-gray-600" />;
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">مركز الإشعارات</h1>
            <p className="text-gray-600">جميع التحديثات والتنبيهات</p>
          </div>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <CheckCheck className="w-5 h-5" />
            تعليم الكل كمقروء
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-6 border border-blue-200">
            <Bell className="w-8 h-8 text-blue-600 mb-3" />
            <p className="text-2xl font-bold text-blue-600">{notifications.filter(n => !n.read).length}</p>
            <p className="text-sm text-gray-600">إشعارات غير مقروءة</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-red-200">
            <AlertCircle className="w-8 h-8 text-red-600 mb-3" />
            <p className="text-2xl font-bold text-red-600">{notifications.filter(n => n.priority === 'high').length}</p>
            <p className="text-sm text-gray-600">أولوية عالية</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <Activity className="w-8 h-8 text-gray-600 mb-3" />
            <p className="text-2xl font-bold">{notifications.length}</p>
            <p className="text-sm text-gray-600">إجمالي الإشعارات</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex gap-2 flex-1 flex-wrap">
              {(['all', 'message', 'revision', 'approval', 'overdue'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    filterType === type
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type === 'all' ? 'الكل' : type === 'message' ? 'رسائل' : type === 'revision' ? 'تعديلات' : type === 'approval' ? 'موافقات' : 'متأخر'}
                </button>
              ))}
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showUnreadOnly}
                onChange={(e) => setShowUnreadOnly(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm">غير المقروءة فقط</span>
            </label>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`bg-white rounded-xl p-6 border ${
                !notif.read ? 'border-blue-200 shadow-md' : 'border-gray-200'
              } hover:shadow-lg transition-shadow`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-full ${!notif.read ? 'bg-blue-50' : 'bg-gray-50'}`}>
                  {getNotificationIcon(notif.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold mb-1">{notif.title}</h3>
                      <p className="text-sm text-gray-600">{notif.content}</p>
                    </div>
                    {!notif.read && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-3">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {notif.timestamp}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      notif.priority === 'high' ? 'bg-red-100 text-red-700' :
                      notif.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {notif.priority === 'high' ? 'عالية' : notif.priority === 'medium' ? 'متوسطة' : 'منخفضة'}
                    </span>
                  </div>
                  <div className="flex gap-3 mt-4">
                    {notif.type === 'message' && (
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                        عرض المحادثة
                      </button>
                    )}
                    {notif.type === 'revision' && (
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                        عرض الطلب
                      </button>
                    )}
                    {!notif.read && (
                      <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm">
                        وضع علامة كمقروء
                      </button>
                    )}
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm">
                      تجاهل
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // PAGE 7: SLA Dashboard
  const SLADashboardView = () => {
    const responseTimeData = [
      { name: 'الأحد', charity: 4, incubator: 2 },
      { name: 'الاثنين', charity: 6, incubator: 3 },
      { name: 'الثلاثاء', charity: 3, incubator: 1 },
      { name: 'الأربعاء', charity: 5, incubator: 4 },
      { name: 'الخميس', charity: 2, incubator: 2 },
      { name: 'الجمعة', charity: 7, incubator: 5 },
      { name: 'السبت', charity: 4, incubator: 3 }
    ];

    const slaComplianceData = [
      { name: 'مستوفي', value: 78 },
      { name: 'متأخر', value: 22 }
    ];

    const COLORS = ['#10b981', '#ef4444'];

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">لوحة أوقات الاستجابة وSLA</h1>
          <p className="text-gray-600">تحليلات شاملة لأوقات الرد والامتثال للمعايير</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <Clock className="w-8 h-8 text-blue-600 mb-3" />
            <p className="text-2xl font-bold">3.2 ساعة</p>
            <p className="text-sm text-gray-600">متوسط وقت الرد</p>
            <div className="flex items-center gap-1 mt-2">
              <TrendingDown className="w-4 h-4 text-green-600" />
              <span className="text-xs text-green-600">-15% من الأسبوع السابق</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-green-200">
            <CheckCircle2 className="w-8 h-8 text-green-600 mb-3" />
            <p className="text-2xl font-bold text-green-600">78%</p>
            <p className="text-sm text-gray-600">نسبة الامتثال لـ SLA</p>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-xs text-green-600">+5% من الأسبوع السابق</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-yellow-200">
            <AlertTriangle className="w-8 h-8 text-yellow-600 mb-3" />
            <p className="text-2xl font-bold text-yellow-600">3</p>
            <p className="text-sm text-gray-600">طلبات تجاوزت SLA</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <Target className="w-8 h-8 text-purple-600 mb-3" />
            <p className="text-2xl font-bold">24 ساعة</p>
            <p className="text-sm text-gray-600">هدف SLA</p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Response Time Trend */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="font-semibold mb-4">متوسط أوقات الاستجابة (ساعات)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={responseTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="charity" stroke="#3b82f6" name="الجمعية" strokeWidth={2} />
                <Line type="monotone" dataKey="incubator" stroke="#10b981" name="الحاضنة" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* SLA Compliance */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="font-semibold mb-4">نسبة الامتثال لـ SLA</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={slaComplianceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {slaComplianceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Team Performance Table */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="font-semibold">أداء فريق الحاضنة</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200">
                <tr>
                  <th className="text-right p-4 font-semibold">اسم الموظف</th>
                  <th className="text-right p-4 font-semibold">عدد الطلبات</th>
                  <th className="text-right p-4 font-semibold">متوسط وقت الرد</th>
                  <th className="text-right p-4 font-semibold">نسبة SLA</th>
                  <th className="text-right p-4 font-semibold">التقييم</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'أحمد محمد', requests: 12, avgTime: '2.5 ساعة', sla: 92, rating: 'ممتاز' },
                  { name: 'فاطمة أحمد', requests: 15, avgTime: '3.1 ساعة', sla: 87, rating: 'جيد جداً' },
                  { name: 'خالد سعيد', requests: 8, avgTime: '4.2 ساعة', sla: 75, rating: 'جيد' }
                ].map((member, idx) => (
                  <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="p-4 font-medium">{member.name}</td>
                    <td className="p-4">{member.requests}</td>
                    <td className="p-4">{member.avgTime}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden max-w-[100px]">
                          <div
                            className={`h-full ${member.sla >= 90 ? 'bg-green-600' : member.sla >= 80 ? 'bg-yellow-600' : 'bg-red-600'}`}
                            style={{ width: `${member.sla}%` }}
                          ></div>
                        </div>
                        <span className="font-medium">{member.sla}%</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        member.rating === 'ممتاز' ? 'bg-green-100 text-green-700' :
                        member.rating === 'جيد جداً' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {member.rating}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Overdue Requests */}
        <div className="bg-white rounded-xl p-6 border border-red-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              طلبات تجاوزت SLA
            </h3>
            <span className="text-sm text-red-600">3 طلبات</span>
          </div>
          <div className="space-y-3">
            {[
              { project: 'برنامج التدريب المهني', overdue: '3 أيام', assignee: 'محمد عبدالله' },
              { project: 'مشروع كفالة الأيتام', overdue: '2 يوم', assignee: 'سارة علي' },
              { project: 'برنامج الأسر المنتجة', overdue: '1 يوم', assignee: 'أحمد محمد' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                <div>
                  <p className="font-medium">{item.project}</p>
                  <p className="text-sm text-gray-600 mt-1">معين لـ: {item.assignee}</p>
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-red-600">تأخير: {item.overdue}</p>
                  <button className="text-sm text-blue-600 hover:text-blue-700 mt-1">عرض التفاصيل</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // PAGE 8: Collaboration Health Dashboard
  const HealthDashboardView = () => {
    const engagementData = [
      { name: 'السبت', messages: 45, discussions: 8, files: 12 },
      { name: 'الأحد', messages: 52, discussions: 10, files: 15 },
      { name: 'الاثنين', messages: 38, discussions: 6, files: 9 },
      { name: 'الثلاثاء', messages: 60, discussions: 12, files: 18 },
      { name: 'الأربعاء', messages: 55, discussions: 9, files: 14 },
      { name: 'الخميس', messages: 48, discussions: 11, files: 13 },
      { name: 'الجمعة', messages: 30, discussions: 5, files: 7 }
    ];

    const activityHeatmap = [
      { day: 'السبت', '9-12': 8, '12-3': 12, '3-6': 15, '6-9': 5 },
      { day: 'الأحد', '9-12': 10, '12-3': 15, '3-6': 18, '6-9': 7 },
      { day: 'الاثنين', '9-12': 6, '12-3': 9, '3-6': 12, '6-9': 4 },
      { day: 'الثلاثاء', '9-12': 12, '12-3': 18, '3-6': 20, '6-9': 8 },
      { day: 'الأربعاء', '9-12': 9, '12-3': 14, '3-6': 16, '6-9': 6 },
      { day: 'الخميس', '9-12': 11, '12-3': 13, '3-6': 14, '6-9': 5 },
      { day: 'الجمعة', '9-12': 4, '12-3': 7, '3-6': 9, '6-9': 3 }
    ];

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">لوحة صحة التعاون</h1>
          <p className="text-gray-600">مؤشرات الأداء والمشاركة في التعاون</p>
        </div>

        {/* Overall Health Score */}
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">درجة صحة التعاون الإجمالية</h2>
              <p className="text-blue-100">تقييم شامل لجودة التواصل والمشاركة</p>
            </div>
            <div className="text-center">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    className="text-blue-300/30"
                    strokeWidth="10"
                    stroke="currentColor"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    className="text-white"
                    strokeWidth="10"
                    strokeDasharray={`${85 * 2.51}, 251`}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl font-bold">85%</span>
                </div>
              </div>
              <p className="text-sm mt-2">ممتاز</p>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">معدل المشاركة</h3>
              <Zap className="w-6 h-6 text-yellow-600" />
            </div>
            <p className="text-3xl font-bold mb-2">92%</p>
            <p className="text-sm text-gray-600">من أعضاء الفريق نشطون</p>
            <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-yellow-600" style={{ width: '92%' }}></div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">جودة التواصل</h3>
              <MessageSquare className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-3xl font-bold mb-2">4.5/5</p>
            <p className="text-sm text-gray-600">تقييم متوسط للتفاعلات</p>
            <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-green-600" style={{ width: '90%' }}></div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">سرعة الحل</h3>
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-3xl font-bold mb-2">2.1 يوم</p>
            <p className="text-sm text-gray-600">متوسط وقت حل المسائل</p>
            <div className="flex items-center gap-1 mt-2">
              <TrendingDown className="w-4 h-4 text-green-600" />
              <span className="text-xs text-green-600">-18% من الشهر السابق</span>
            </div>
          </div>
        </div>

        {/* Engagement Trend */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="font-semibold mb-4">اتجاه المشاركة الأسبوعية</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="messages" fill="#3b82f6" name="رسائل" />
              <Bar dataKey="discussions" fill="#10b981" name="نقاشات" />
              <Bar dataKey="files" fill="#f59e0b" name="ملفات" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Activity Heatmap */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="font-semibold mb-4">خريطة النشاط الحرارية (حسب الوقت)</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-right p-3 font-semibold">اليوم</th>
                  <th className="text-center p-3 font-semibold">9-12 ص</th>
                  <th className="text-center p-3 font-semibold">12-3 م</th>
                  <th className="text-center p-3 font-semibold">3-6 م</th>
                  <th className="text-center p-3 font-semibold">6-9 م</th>
                </tr>
              </thead>
              <tbody>
                {activityHeatmap.map((row, idx) => (
                  <tr key={idx}>
                    <td className="p-3 font-medium">{row.day}</td>
                    <td className="p-3">
                      <div className={`h-12 rounded flex items-center justify-center font-medium ${
                        row['9-12'] > 10 ? 'bg-green-600 text-white' :
                        row['9-12'] > 6 ? 'bg-green-400 text-white' :
                        'bg-green-100 text-gray-700'
                      }`}>
                        {row['9-12']}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className={`h-12 rounded flex items-center justify-center font-medium ${
                        row['12-3'] > 15 ? 'bg-green-600 text-white' :
                        row['12-3'] > 10 ? 'bg-green-400 text-white' :
                        'bg-green-100 text-gray-700'
                      }`}>
                        {row['12-3']}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className={`h-12 rounded flex items-center justify-center font-medium ${
                        row['3-6'] > 15 ? 'bg-green-600 text-white' :
                        row['3-6'] > 10 ? 'bg-green-400 text-white' :
                        'bg-green-100 text-gray-700'
                      }`}>
                        {row['3-6']}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className={`h-12 rounded flex items-center justify-center font-medium ${
                        row['6-9'] > 7 ? 'bg-green-600 text-white' :
                        row['6-9'] > 4 ? 'bg-green-400 text-white' :
                        'bg-green-100 text-gray-700'
                      }`}>
                        {row['6-9']}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Team Member Engagement */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="font-semibold mb-4">مشاركة أعضاء الفريق</h3>
          <div className="space-y-4">
            {[
              { name: 'أحمد محمد', messages: 45, discussions: 12, files: 8, score: 95 },
              { name: 'فاطمة أحمد', messages: 52, discussions: 15, files: 10, score: 92 },
              { name: 'خالد سعيد', messages: 30, discussions: 8, files: 5, score: 78 },
              { name: 'سارة علي', messages: 38, discussions: 10, files: 7, score: 85 }
            ].map((member, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium mb-2">{member.name}</h4>
                    <div className="flex gap-4 text-sm text-gray-600">
                      <span>{member.messages} رسالة</span>
                      <span>{member.discussions} نقاش</span>
                      <span>{member.files} ملف</span>
                    </div>
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-2xl font-bold text-green-600">{member.score}%</p>
                  <p className="text-xs text-gray-600">درجة المشاركة</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // PAGE 9: Activity Timeline
  const TimelineView = () => {
    const [filterDate, setFilterDate] = useState('all');
    const [filterActivity, setFilterActivity] = useState('all');

    const timelineActivities = [
      {
        id: '1',
        type: 'message',
        user: 'أحمد محمد',
        action: 'أرسل رسالة في',
        target: 'برنامج الأسر المنتجة',
        timestamp: '2026-06-07 10:30',
        details: 'تم مراجعة الميزانية المقترحة'
      },
      {
        id: '2',
        type: 'file',
        user: 'فاطمة أحمد',
        action: 'رفعت ملف',
        target: 'الميزانية_التفصيلية.xlsx',
        timestamp: '2026-06-07 09:15',
        details: 'ملف Excel - 856 KB'
      },
      {
        id: '3',
        type: 'discussion',
        user: 'أحمد محمد',
        action: 'بدأ نقاش حول',
        target: 'مناقشة الميزانية',
        timestamp: '2026-06-06 16:45',
        details: 'يرجى مراجعة توزيع الميزانية على الأنشطة'
      },
      {
        id: '4',
        type: 'revision',
        user: 'خالد سعيد',
        action: 'طلب تعديل على',
        target: 'تحديث الجدول الزمني',
        timestamp: '2026-06-06 14:20',
        details: 'أولوية متوسطة - مستحق في 2026-06-08'
      },
      {
        id: '5',
        type: 'approval',
        user: 'أحمد محمد',
        action: 'وافق على',
        target: 'خطة المشروع',
        timestamp: '2026-06-05 11:00',
        details: 'تمت الموافقة على خطة المشروع المحدثة'
      },
      {
        id: '6',
        type: 'file',
        user: 'خالد سعيد',
        action: 'رفع ملف',
        target: 'صور_الموقع.zip',
        timestamp: '2026-06-05 09:30',
        details: 'ملف مضغوط - 12.5 MB'
      },
      {
        id: '7',
        type: 'message',
        user: 'سارة علي',
        action: 'أرسلت رسالة في',
        target: 'مشروع كفالة الأيتام',
        timestamp: '2026-06-04 15:20',
        details: 'بانتظار الموافقة على التعديلات'
      },
      {
        id: '8',
        type: 'discussion',
        user: 'فاطمة أحمد',
        action: 'ردت على نقاش',
        target: 'ملاحظات على الأهداف',
        timestamp: '2026-06-04 13:10',
        details: 'تم تعديل الأهداف حسب الملاحظات'
      }
    ];

    const getActivityIcon = (type: string) => {
      switch (type) {
        case 'message': return <MessageSquare className="w-5 h-5 text-blue-600" />;
        case 'file': return <Paperclip className="w-5 h-5 text-green-600" />;
        case 'discussion': return <GitBranch className="w-5 h-5 text-purple-600" />;
        case 'revision': return <Edit className="w-5 h-5 text-yellow-600" />;
        case 'approval': return <CheckCircle2 className="w-5 h-5 text-green-600" />;
        default: return <Activity className="w-5 h-5 text-gray-600" />;
      }
    };

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">السجل الزمني للأنشطة</h1>
          <p className="text-gray-600">تتبع تاريخي لجميع التفاعلات والأحداث</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex flex-wrap gap-3">
            <select
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">جميع الأوقات</option>
              <option value="today">اليوم</option>
              <option value="week">هذا الأسبوع</option>
              <option value="month">هذا الشهر</option>
            </select>
            <select
              value={filterActivity}
              onChange={(e) => setFilterActivity(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">جميع الأنشطة</option>
              <option value="message">رسائل</option>
              <option value="file">ملفات</option>
              <option value="discussion">نقاشات</option>
              <option value="revision">تعديلات</option>
              <option value="approval">موافقات</option>
            </select>
            <div className="flex-1"></div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <Download className="w-4 h-4" />
              تصدير السجل
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
            <MessageSquare className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <p className="text-xl font-bold">124</p>
            <p className="text-xs text-gray-600">رسالة</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
            <Paperclip className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <p className="text-xl font-bold">38</p>
            <p className="text-xs text-gray-600">ملف</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
            <GitBranch className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <p className="text-xl font-bold">22</p>
            <p className="text-xs text-gray-600">نقاش</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
            <Edit className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
            <p className="text-xl font-bold">15</p>
            <p className="text-xs text-gray-600">تعديل</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
            <CheckCircle2 className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <p className="text-xl font-bold">31</p>
            <p className="text-xs text-gray-600">موافقة</p>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="space-y-6">
            {timelineActivities.map((activity, idx) => (
              <div key={activity.id} className="flex gap-4">
                {/* Timeline Line */}
                <div className="flex flex-col items-center">
                  <div className="p-2 bg-gray-100 rounded-full">
                    {getActivityIcon(activity.type)}
                  </div>
                  {idx < timelineActivities.length - 1 && (
                    <div className="w-0.5 flex-1 bg-gray-200 my-2"></div>
                  )}
                </div>

                {/* Activity Content */}
                <div className="flex-1 pb-6">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium">
                        <span className="text-blue-600">{activity.user}</span>
                        {' '}{activity.action}{' '}
                        <span className="font-semibold">{activity.target}</span>
                      </p>
                      <p className="text-sm text-gray-600 mt-1">{activity.details}</p>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap mr-4">{activity.timestamp}</span>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex gap-2 mt-3">
                    {activity.type === 'message' && (
                      <button className="text-xs px-3 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100">
                        عرض المحادثة
                      </button>
                    )}
                    {activity.type === 'file' && (
                      <>
                        <button className="text-xs px-3 py-1 bg-green-50 text-green-600 rounded hover:bg-green-100">
                          تحميل
                        </button>
                        <button className="text-xs px-3 py-1 bg-gray-50 text-gray-600 rounded hover:bg-gray-100">
                          معاينة
                        </button>
                      </>
                    )}
                    {activity.type === 'discussion' && (
                      <button className="text-xs px-3 py-1 bg-purple-50 text-purple-600 rounded hover:bg-purple-100">
                        عرض النقاش
                      </button>
                    )}
                    {activity.type === 'revision' && (
                      <button className="text-xs px-3 py-1 bg-yellow-50 text-yellow-600 rounded hover:bg-yellow-100">
                        عرض الطلب
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center pt-6 border-t border-gray-200">
            <button className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2 mx-auto">
              <RefreshCw className="w-4 h-4" />
              تحميل المزيد
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render views
  return (
    <div className="min-h-full bg-gray-50 p-6">
      {currentView === 'hub' && <HubView />}
      {currentView === 'chat' && (
        <ChatView
          projectId={projectId}
          selectedConversation={selectedConversation}
          conversations={conversations}
          conversationsLoading={conversationsLoading}
          conversationsError={conversationsError}
          refetchConversations={refetchConversations}
          currentConversation={currentConversation}
          filteredConversations={filteredConversations}
          selectConversation={selectConversation}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          messages={messages}
          messagesLoading={messagesLoading}
          messagesError={messagesError}
          hasMore={hasMore}
          isSending={isSending}
          loadMessages={loadMessages}
          sendMessage={sendMessage}
          editMessage={editMessage}
          deleteMessage={deleteMessage}
          markAsRead={markAsRead}
          retrySend={retrySend}
          clearError={clearError}
          revisions={revisions}
        />
      )}
      {currentView === 'discussions' && <DiscussionsView />}
      {currentView === 'attachments' && <AttachmentsView />}
      {currentView === 'revisions' && <RevisionsView />}
      {currentView === 'notifications' && <NotificationsView />}
      {currentView === 'sla' && <SLADashboardView />}
      {currentView === 'health' && <HealthDashboardView />}
      {currentView === 'timeline' && <TimelineView />}
    </div>
  );
}

import { useState, useEffect, useMemo } from 'react';
import {
  CheckCircle2,
  XCircle,
  Users,
  Search,
  Loader2,
  RotateCcw,
  Eye,
  FileText,
  CheckCircle,
  AlertTriangle,
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ArrowUp,
  ArrowDown,
  Filter,
  RefreshCw,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import apiClient from '@/api/client';
import { useAdminUsers } from '@/api/hooks/useAdminUsers';
import { useOrganizationInformation } from '@/api/hooks/useOrganizationInformation';
import { AdminUser, OrganizationDocument, userService, USER_STATUS_OPTIONS } from '@/api/services/user-service';
import { ApiError } from '@/api/types';
import { useAuth } from '@/app/layouts/RootLayout';
import { Button } from '@/app/components/ui/button';
import {
  DocumentSlotId,
  documentSlots,
  getDocumentSlotLabel,
  getSlotIdByDocumentType,
  requiredDocumentSlots,
  optionalDocumentSlots,
} from '@/app/utils/document-slots';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { Badge } from '@/app/components/ui/badge';
import { DonorsPagination } from '@/app/components/donors/DonorsPagination';
import { OrganizationInformationDisplay, getExtractionStatusMeta } from '@/app/components/OrganizationInformationDisplay';

const PAGE_SIZE_OPTIONS = [10, 20, 50];

function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '-';
  try {
    return new Date(dateString).toLocaleDateString('ar-SA');
  } catch {
    return dateString;
  }
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffMins < 1) return 'الآن';
  if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
  if (diffHours < 24) return `منذ ${diffHours} ساعة`;
  if (diffDays < 7) return `منذ ${diffDays} يوم`;
  if (diffWeeks < 4) return `منذ ${diffWeeks} أسبوع`;
  if (diffMonths < 12) return `منذ ${diffMonths} شهر`;
  return `منذ ${diffYears} سنة`;
}

interface DocumentChecklistProps {
  documents: OrganizationDocument[];
}

function DocumentChecklist({ documents }: DocumentChecklistProps) {
  const documentsBySlot = useMemo(() => {
    const map = new Map<DocumentSlotId, OrganizationDocument>();
    documents.forEach((doc) => {
      const slotId = getSlotIdByDocumentType(doc.documentType);
      if (slotId && !map.has(slotId)) {
        map.set(slotId, doc);
      }
    });
    return map;
  }, [documents]);

  const renderSlot = (slot: { id: DocumentSlotId; label: string; required: boolean }) => {
    const doc = documentsBySlot.get(slot.id);
    const isPresent = !!doc;
    return (
      <div
        key={slot.id}
        className="p-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <FileText className={`w-5 h-5 ${isPresent ? 'text-blue-600' : 'text-gray-400'}`} />
          <div>
            <div className="font-medium text-base">{slot.label}</div>
            {doc && (
              <div className="text-sm text-gray-600">
                {doc.fileName || doc.originalName || getDocumentTypeLabel(doc.documentType)}
              </div>
            )}
            {doc && (
              <div className="text-xs text-gray-500">
                {formatFileSize(doc.fileSize || doc.size)} • {formatDate(doc.uploadedAt || doc.createdAt)}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isPresent ? (
            <>
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-700">
                <CheckCircle2 className="w-4 h-4" />
                مُرفق
              </span>
              <Button variant="outline" size="sm" onClick={() => doc && handleOpenDocument(doc)}>
                عرض / تحميل
              </Button>
            </>
          ) : (
            <span
              className={`inline-flex items-center gap-1.5 text-sm font-medium ${
                slot.required ? 'text-red-600' : 'text-gray-500'
              }`}
            >
              {slot.required ? <XCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
              غير مُرفق
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Required documents */}
      <div>
        <h4 className="text-sm font-semibold text-red-700 mb-2 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          المستندات الإلزامية
        </h4>
        <div className="border border-gray-200 rounded-lg divide-y divide-gray-200">
          {requiredDocumentSlots.map(renderSlot)}
        </div>
      </div>

      {/* Optional documents */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2">المستندات الاختيارية</h4>
        <div className="border border-gray-200 rounded-lg divide-y divide-gray-200">
          {optionalDocumentSlots.map(renderSlot)}
        </div>
      </div>
    </div>
  );
}

function formatFileSize(bytes: number): string {
  if (!bytes || bytes === 0) return '0 B';
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
}

function getDocumentTypeLabel(documentType: string): string {
  const labels: Record<string, string> = {
    LICENSE: 'الترخيص',
    BANK_CERTIFICATE: 'الشهادة البنكية',
    NATIONAL_ADDRESS: 'العنوان الوطني',
    ORG_PROFILE: 'بيان المنشأة',
    PROJECTS: 'المشاريع',
    FINANCIAL: 'المالية',
    ANNUAL: 'التقرير السنوي',
    BRAND: 'العلامة التجارية',
    BOARD_APPROVAL_LETTER: 'خطاب موافقة مجلس الإدارة',
    AI_PLAN_DOCX: 'دراسة المشروع - Word',
    AI_PLAN_PDF: 'دراسة المشروع - PDF',
    AI_PRESENTATION_PPTX: 'عرض تقديمي',
    PRICE_OFFER: 'عرض السعر',
    SIGNED_PRICE_OFFER: 'عرض السعر الموقع',
    AI_DONOR_PLAN: 'خطة التبرع بالذكاء الاصطناعي',
  };
  return labels[documentType] || documentType;
}

function getOrganizationTypeLabel(type: string | null | undefined): string {
  const labels: Record<string, string> = {
    CHARITY: 'جمعية خيرية',
    FOUNDATION: 'جمعية',
    NGO: 'منظمة غير حكومية',
    COOP: 'تعاونية',
  };
  if (!type) return '-';
  return labels[type] || type;
}

function getActionErrorMessage(error: unknown): string {
  const apiError = error as ApiError;
  const status = apiError.statusCode;

  if (status) {
    switch (status) {
      case 400:
        return apiError.message || 'طلب غير صحيح. يرجى التحقق والمحاولة مرة أخرى.';
      case 401:
        return 'انتهت الجلسة. يرجى تسجيل الدخول مرة أخرى.';
      case 403:
        return 'ليس لديك الصلاحية لتنفيذ هذه العملية.';
      case 404:
        return 'المستخدم غير موجود.';
      case 500:
      case 502:
      case 503:
      case 504:
        return 'حدث خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقاً.';
      default:
        return apiError.message || 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.';
    }
  }

  return 'لا يمكن الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى.';
}

function SortableHeader({
  column,
  label,
  sortBy,
  sortOrder,
  onSort,
}: {
  column: string;
  label: string;
  sortBy: string | null;
  sortOrder: 'asc' | 'desc';
  onSort: (column: string) => void;
}) {
  const isActive = sortBy === column;
  return (
    <TableHead
      className="text-right cursor-pointer select-none hover:bg-gray-100 transition-colors"
      onClick={() => onSort(column)}
    >
      <div className="flex items-center justify-start gap-1 w-full">
        <span>{label}</span>
        {isActive ? (
          sortOrder === 'asc' ? (
            <ArrowUp className="w-3 h-3 text-blue-600" />
          ) : (
            <ArrowDown className="w-3 h-3 text-blue-600" />
          )
        ) : (
          <span className="w-3 h-3 inline-block" />
        )}
      </div>
    </TableHead>
  );
}

export function UserActivationPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isProjectManager = user?.roleSlug === 'project-managers';
  const {
    users,
    pagination,
    pendingSearch,
    pendingStatus,
    isLoading,
    error,
    sortBy,
    sortOrder,
    setPage,
    setLimit,
    setSearch,
    applySearch,
    clearSearch,
    setStatus,
    clearStatus,
    refetch,
    toggleSort,
  } = useAdminUsers();

  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOrgModalOpen, setIsOrgModalOpen] = useState(false);
  const [modalOrgId, setModalOrgId] = useState<string | undefined>(undefined);
  const [actionMode, setActionMode] = useState<'view' | 'reject' | 'confirm-approve' | 'confirm-reject'>('view');
  const [rejectComment, setRejectComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [syncingOrgId, setSyncingOrgId] = useState<string | null>(null);
  const [processingOrgIds, setProcessingOrgIds] = useState<Set<string>>(new Set());

  const {
    data: orgInfo,
    isLoading: orgInfoLoading,
    isSyncing: orgInfoSyncing,
    error: orgInfoError,
    refetch: refetchOrgInfo,
    sync: syncOrgInfo,
  } = useOrganizationInformation(modalOrgId);

  useEffect(() => {
    if (modalOrgId && orgInfo && orgInfo.extractionStatus !== 'PROCESSING') {
      markOrgProcessingDone(modalOrgId);
    }
  }, [modalOrgId, orgInfo]);

  const handleOpenModal = (user: AdminUser) => {
    setSelectedUser(user);
    setActionMode('view');
    setRejectComment('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setActionMode('view');
    setRejectComment('');
  };

  const handleOpenOrgModal = (user: AdminUser) => {
    const orgId = user.organization?.id;
    setSelectedUser(user);
    setModalOrgId(orgId);
    setIsOrgModalOpen(true);
  };

  const handleCloseOrgModal = () => {
    setIsOrgModalOpen(false);
    setSelectedUser(null);
    setModalOrgId(undefined);
  };

  const handleSyncOrg = async (orgId: string) => {
    setSyncingOrgId(orgId);
    try {
      const response = await userService.triggerOrganizationInformationExtraction(orgId);
      toast.success('تم تشغيل استخراج بيانات الجهة بنجاح.');
      const extracted = response.data?.data;
      if (extracted?.extractionStatus === 'PROCESSING') {
        setProcessingOrgIds((prev) => new Set(prev).add(orgId));
      }
      if (modalOrgId === orgId) {
        await refetchOrgInfo();
      }
    } catch (err) {
      const apiError = err as ApiError;
      toast.error(apiError.message || 'تعذر تشغيل استخراج بيانات الجهة.');
    } finally {
      setSyncingOrgId(null);
    }
  };

  const markOrgProcessingDone = (orgId: string | undefined) => {
    if (!orgId) return;
    setProcessingOrgIds((prev) => {
      const next = new Set(prev);
      next.delete(orgId);
      return next;
    });
  };

  const openDirectFileUrl = (fileUrl: string, fileName: string) => {
    const base = apiClient.defaults.baseURL.replace(/\/$/, '');
    const path = fileUrl.startsWith('/') ? fileUrl : `/${fileUrl}`;
    const fullUrl = `${base}${path}`;
    const newWindow = window.open(fullUrl, '_blank', 'noopener,noreferrer');
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      const a = document.createElement('a');
      a.href = fullUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success('جاري تحميل المستند...');
    }
  };

  const openBlobUrl = (blob: Blob, fileName: string) => {
    const objectUrl = window.URL.createObjectURL(blob);
    const newWindow = window.open(objectUrl, '_blank', 'noopener,noreferrer');
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success('جاري تحميل المستند...');
    }
    setTimeout(() => window.URL.revokeObjectURL(objectUrl), 60000);
  };

  const handleOpenDocument = async (document: OrganizationDocument) => {
    try {
      const response = await apiClient.get<Blob>(document.fileUrl, {
        responseType: 'blob',
      });

      const blob = response.data;
      if (!blob || blob.size === 0) {
        openDirectFileUrl(document.fileUrl, document.fileName || 'document');
        return;
      }

      openBlobUrl(blob, document.fileName || 'document');
    } catch (err) {
      const apiError = err as ApiError;
      if (apiError.statusCode === 304) {
        openDirectFileUrl(document.fileUrl, document.fileName || 'document');
      } else {
        toast.error('فشل فتح المستند. يرجى المحاولة مرة أخرى.');
      }
    }
  };

  const canActOnUser = (status?: string | null): boolean => {
    const normalized = status?.toUpperCase() || '';
    return normalized === 'ACTIVE' || normalized === 'NEED_ACTION_FROM_ORG';
  };

  const handleApproveClick = () => {
    if (!selectedUser || !canActOnUser(selectedUser.status)) return;
    setActionMode('confirm-approve');
  };

  const handleRejectClick = () => {
    if (!selectedUser || !canActOnUser(selectedUser.status)) return;
    setActionMode('confirm-reject');
  };

  const handleApprove = async () => {
    if (!selectedUser) return;
    setIsSubmitting(true);
    try {
      const response = await userService.approveUser(selectedUser.id);
      if (response.success) {
        toast.success('تم تفعيل الجهة بنجاح.');
        await refetch();
        handleCloseModal();
      } else {
        toast.error(response.message || 'فشل تفعيل الجهة.');
      }
    } catch (err) {
      toast.error(getActionErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestAction = async () => {
    if (!selectedUser) return;
    const comment = rejectComment.trim();
    if (!comment) {
      toast.error('يرجى إدخال سبب الرفض / التعليق المطلوب.');
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await userService.requestAction(selectedUser.id, { comment });
      if (response.success) {
        toast.success('تم إرسال طلب الإجراء للجهة بنجاح.');
        await refetch();
        handleCloseModal();
      } else {
        toast.error(response.message || 'فشل إرسال طلب الإجراء.');
      }
    } catch (err) {
      toast.error(getActionErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      applySearch();
    }
  };

  const renderLoading = () => (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
    </div>
  );

  const renderError = () => (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center">
      <div className="text-red-600 mb-4">{error}</div>
      <Button onClick={() => refetch()} className="flex items-center gap-2 mx-auto">
        <RotateCcw className="w-4 h-4" />
        إعادة المحاولة
      </Button>
    </div>
  );

  const renderEmpty = () => (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
      <p className="text-gray-600 mb-4">لا يوجد جهات مطابقة للمعايير المحددة.</p>
      <div className="flex items-center justify-center gap-2">
        <Button variant="outline" onClick={() => clearSearch()}>
          مسح البحث
        </Button>
        {pendingStatus && (
          <Button variant="outline" onClick={() => clearStatus()}>
            مسح الفلتر
          </Button>
        )}
      </div>
    </div>
  );

  const getStatusBadge = (status: string) => {
    const normalized = status.toUpperCase();
    if (normalized === 'ACTIVE') {
      return <Badge variant="secondary">بانتظار التفعيل</Badge>;
    }
    if (normalized === 'APPROVED') {
      return <Badge className="bg-green-600 hover:bg-green-700">مفعل</Badge>;
    }
    if (normalized === 'NEED_ACTION_FROM_ORG') {
      return <Badge variant="destructive">مطلوب إكمال مستندات</Badge>;
    }
    return <Badge variant="outline">{status}</Badge>;
  };

  return (
    <div className="min-h-full bg-gray-50 p-6" dir="rtl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-600" />
              إدارة تفعيل الجهات
            </h1>
            <p className="text-gray-600">{pagination.total} جهة</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={pendingSearch}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder="بحث بالاسم أو البريد أو رقم الترخيص..."
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="relative min-w-[200px]">
              <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={pendingStatus}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full appearance-none pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                {USER_STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => applySearch()}>بحث</Button>
              {(pendingSearch || pendingStatus) && (
                <Button variant="outline" onClick={() => { clearSearch(); clearStatus(); }}>
                  مسح
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        {isLoading ? (
          renderLoading()
        ) : error ? (
          renderError()
        ) : users.length === 0 ? (
          renderEmpty()
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <SortableHeader column="fullName" label="المستخدم" sortBy={sortBy} sortOrder={sortOrder} onSort={toggleSort} />
                    <SortableHeader column="organization.name" label="الجهة" sortBy={sortBy} sortOrder={sortOrder} onSort={toggleSort} />
                    <SortableHeader column="organization.type" label="نوع الجهة" sortBy={sortBy} sortOrder={sortOrder} onSort={toggleSort} />
                    <SortableHeader column="organization.licenseNumber" label="رقم الترخيص" sortBy={sortBy} sortOrder={sortOrder} onSort={toggleSort} />
                    <TableHead className="text-right">المستندات</TableHead>
                    <SortableHeader column="organization.lastEvaluationScore" label="آخر تقييم" sortBy={sortBy} sortOrder={sortOrder} onSort={toggleSort} />
                    <SortableHeader column="status" label="الحالة" sortBy={sortBy} sortOrder={sortOrder} onSort={toggleSort} />
                    <SortableHeader column="organization.createdAt" label="تاريخ الإنشاء" sortBy={sortBy} sortOrder={sortOrder} onSort={toggleSort} />
                    <SortableHeader column="organization.updatedAt" label="تاريخ التحديث" sortBy={sortBy} sortOrder={sortOrder} onSort={toggleSort} />
                    <TableHead className="text-right"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => {
                    const orgId = user.organization?.id;
                    const hasScore = typeof user.organization?.lastEvaluationScore === 'number';
                    return (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        <div>{user.fullName}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </TableCell>
                      <TableCell>{user.organization?.name || '-'}</TableCell>
                      <TableCell>{getOrganizationTypeLabel(user.organization?.type)}</TableCell>
                      <TableCell>{user.organization?.licenseNumber || '-'}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {user.documents?.length || 0} مستند
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {hasScore ? (
                          isProjectManager ? (
                            <button
                              type="button"
                              onClick={() => orgId && navigate(`/dashboard/charity-assessment/results/${orgId}`)}
                              className="inline-flex items-center justify-center rounded-full bg-blue-50 px-2.5 py-0.5 text-sm font-medium text-blue-700 hover:text-blue-800 hover:bg-blue-100 transition-colors"
                            >
                              {user.organization!.lastEvaluationScore}%
                            </button>
                          ) : (
                            <span className="inline-flex items-center justify-center rounded-full bg-blue-50 px-2.5 py-0.5 text-sm font-medium text-blue-700">
                              {user.organization!.lastEvaluationScore}%
                            </span>
                          )
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>
                        <div>{formatDate(user.organization?.createdAt)}</div>
                        <div className="text-xs text-gray-500">{formatRelativeTime(user.organization?.createdAt)}</div>
                      </TableCell>
                      <TableCell>
                        <div>{formatDate(user.organization?.updatedAt)}</div>
                        <div className="text-xs text-gray-500">{formatRelativeTime(user.organization?.updatedAt)}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenModal(user)}
                            className="flex items-center gap-1.5"
                          >
                            <Eye className="w-4 h-4" />
                            عرض
                          </Button>
                          {isProjectManager && user.organization?.id && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleOpenOrgModal(user)}
                                className="flex items-center gap-1.5"
                              >
                                <Building2 className="w-4 h-4" />
                                عرض الجهة
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={
                                  syncingOrgId === user.organization.id ||
                                  processingOrgIds.has(user.organization.id)
                                }
                                onClick={() => handleSyncOrg(user.organization.id)}
                                className="flex items-center gap-1.5"
                              >
                                {syncingOrgId === user.organization.id ||
                                processingOrgIds.has(user.organization.id) ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <RefreshCw className="w-4 h-4" />
                                )}
                                مزامنة
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );})}
                </TableBody>
              </Table>
            </div>

            {pagination.totalPages > 1 && (
              <DonorsPagination
                page={pagination.page}
                totalPages={pagination.totalPages}
                limit={pagination.limit}
                total={pagination.total}
                onPageChange={setPage}
                onLimitChange={setLimit}
              />
            )}
          </div>
        )}
      </div>

      {/* User Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto" style={{ maxWidth: '72rem', width: 'calc(100% - 2rem)' }} dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              بيانات الجهة والمستخدم
            </DialogTitle>
            <DialogDescription>
              مراجعة بيانات المستخدم والمستندات المرفوعة قبل اتخاذ الإجراء.
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-6 py-4">
              {/* User Info */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <h3 className="font-semibold text-gray-900">معلومات المستخدم</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">الاسم:</span>
                    <span className="font-medium">{selectedUser.fullName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">البريد:</span>
                    <span className="font-medium">{selectedUser.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">الهاتف:</span>
                    <span className="font-medium">{selectedUser.phone || '-'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">تاريخ التسجيل:</span>
                    <span className="font-medium">{formatDate(selectedUser.createdAt)}</span>
                  </div>
                  {selectedUser.actionRequired && (
                    <div className="sm:col-span-2 flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-amber-800 font-medium">الإجراء المطلوب:</span>
                        <p className="text-amber-800 text-sm mt-0.5">{selectedUser.actionRequired}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Organization Info */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <h3 className="font-semibold text-gray-900">معلومات الجهة</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">الاسم:</span>
                    <span className="font-medium">{selectedUser.organization?.name || '-'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">رقم الترخيص:</span>
                    <span className="font-medium">{selectedUser.organization?.licenseNumber || '-'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">المدينة:</span>
                    <span className="font-medium">{selectedUser.organization?.city || '-'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">تاريخ التسجيل:</span>
                    <span className="font-medium">{formatDate(selectedUser.organization?.registrationDate)}</span>
                  </div>
                  {selectedUser.organization?.website && (
                    <div className="sm:col-span-2 flex items-center gap-2">
                      <span className="text-gray-600">الموقع الإلكتروني:</span>
                      <a
                        href={selectedUser.organization.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {selectedUser.organization.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Document Checklist */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">قائمة المستندات</h3>
                <DocumentChecklist documents={selectedUser.documents || []} />
              </div>

              {/* Reject Comment */}
              {actionMode === 'reject' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    سبب الرفض / التعليق المطلوب من الجهة
                  </label>
                  <textarea
                    value={rejectComment}
                    onChange={(e) => setRejectComment(e.target.value)}
                    placeholder="يرجى توضيح سبب الرفض أو المستندات/المعلومات المطلوبة..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
              )}

              {/* Inline Confirmation Panels */}
              {actionMode === 'confirm-approve' && selectedUser && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-slate-900">تأكيد تفعيل الجهة</h4>
                      <p className="text-sm text-slate-700 mt-1">
                        سيتم تفعيل {selectedUser.fullName} / {selectedUser.organization?.name || 'الجهة'}. لا يمكن التراجع عن هذا الإجراء.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setActionMode('view')}
                      disabled={isSubmitting}
                    >
                      إلغاء
                    </Button>
                    <Button
                      onClick={handleApprove}
                      disabled={isSubmitting}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      تأكيد التفعيل
                    </Button>
                  </div>
                </div>
              )}

              {actionMode === 'confirm-reject' && selectedUser && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg space-y-3">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-slate-900">تأكيد طلب الإجراء</h4>
                      <p className="text-sm text-slate-700 mt-1">
                        سيتم إرسال طلب إجراء إلى {selectedUser.fullName} / {selectedUser.organization?.name || 'الجهة'}.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setActionMode('view')}
                      disabled={isSubmitting}
                    >
                      إلغاء
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => setActionMode('reject')}
                      disabled={isSubmitting}
                    >
                      متابعة لإدخال السبب
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={handleCloseModal} disabled={isSubmitting}>
              إغلاق
            </Button>

            {actionMode === 'view' && (
              <>
                <Button
                  variant="destructive"
                  onClick={handleRejectClick}
                  disabled={isSubmitting || !canActOnUser(selectedUser?.status)}
                >
                  رفض / طلب إجراء
                </Button>
                <Button
                  onClick={handleApproveClick}
                  disabled={isSubmitting || !canActOnUser(selectedUser?.status)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  تفعيل
                </Button>
              </>
            )}

            {actionMode === 'reject' && (
              <>
                <Button
                  variant="outline"
                  onClick={() => setActionMode('view')}
                  disabled={isSubmitting}
                >
                  إلغاء
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleRequestAction}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <AlertTriangle className="w-4 h-4" />
                  )}
                  إرسال طلب الإجراء
                </Button>
              </>
            )}

            {(actionMode === 'confirm-approve' || actionMode === 'confirm-reject') && (
              <Button variant="outline" onClick={() => setActionMode('view')} disabled={isSubmitting}>
                إلغاء
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Organization Extra Details Modal */}
      <Dialog open={isOrgModalOpen} onOpenChange={setIsOrgModalOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto" style={{ maxWidth: '72rem', width: 'calc(100% - 2rem)' }} dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2 justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                بيانات الجهة المستخرجة بالذكاء الاصطناعي
              </div>
              {orgInfo && (
                <Badge className={getExtractionStatusMeta(orgInfo.extractionStatus).className}>
                  {(() => {
                    const StatusIcon = getExtractionStatusMeta(orgInfo.extractionStatus).icon;
                    return <StatusIcon className="w-3.5 h-3.5 ml-1" />;
                  })()}
                  {getExtractionStatusMeta(orgInfo.extractionStatus).label}
                </Badge>
              )}
            </DialogTitle>
            <DialogDescription>
              {selectedUser?.organization?.name || selectedUser?.fullName || 'الجهة'}
            </DialogDescription>
          </DialogHeader>

          {orgInfoLoading ? (
            <div className="py-12 flex items-center justify-center gap-2" dir="rtl">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              <span className="text-gray-600">جاري تحميل بيانات الجهة...</span>
            </div>
          ) : orgInfoError ? (
            <div className="py-8 text-center text-red-600" dir="rtl">
              {orgInfoError}
            </div>
          ) : orgInfo ? (
            <OrganizationInformationDisplay data={orgInfo} />
          ) : (
            <div className="py-8 text-center text-gray-600" dir="rtl">
              لا توجد بيانات مستخرجة لهذه الجهة بعد. اضغط "مزامنة" لاستخراج البيانات من المستندات.
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={handleCloseOrgModal}>
              إغلاق
            </Button>
            <Button
              variant="default"
              onClick={() => syncOrgInfo()}
              disabled={orgInfoSyncing || orgInfo?.extractionStatus === 'PROCESSING'}
            >
              {orgInfoSyncing || orgInfo?.extractionStatus === 'PROCESSING' ? (
                <Loader2 className="w-4 h-4 ml-1 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 ml-1" />
              )}
              مزامنة
            </Button>
            {modalOrgId && (
              <Button
                onClick={() => {
                  handleCloseOrgModal();
                  navigate(`/dashboard/manage/org/${modalOrgId}/details`);
                }}
              >
                عرض الصفحة الكاملة
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default UserActivationPage;

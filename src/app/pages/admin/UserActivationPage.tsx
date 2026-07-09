import { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Loader2,
  RotateCcw,
  Eye,
  FileText,
  CheckCircle,
  AlertTriangle,
  X,
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
} from 'lucide-react';
import { toast } from 'sonner';
import apiClient from '@/api/client';
import { useAdminUsers } from '@/api/hooks/useAdminUsers';
import { AdminUser, OrganizationDocument, userService } from '@/api/services/user-service';
import { ApiError } from '@/api/types';
import { Button } from '@/app/components/ui/button';
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

const PAGE_SIZE_OPTIONS = [10, 20, 50];

function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '-';
  try {
    return new Date(dateString).toLocaleDateString('ar-SA');
  } catch {
    return dateString;
  }
}

function formatFileSize(bytes: number): string {
  if (!bytes || bytes === 0) return '0 B';
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
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

export function UserActivationPage() {
  const {
    users,
    pagination,
    pendingSearch,
    isLoading,
    error,
    setPage,
    setLimit,
    setSearch,
    applySearch,
    clearSearch,
    refetch,
  } = useAdminUsers();

  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionMode, setActionMode] = useState<'view' | 'reject'>('view');
  const [rejectComment, setRejectComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      <p className="text-gray-600 mb-4">لا يوجد مستخدمون مطابقون للبحث.</p>
      <Button variant="outline" onClick={() => clearSearch()}>
        مسح البحث
      </Button>
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
      return <Badge variant="destructive">يحتاج إجراء</Badge>;
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

        {/* Search */}
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
            <div className="flex gap-2">
              <Button onClick={() => applySearch()}>بحث</Button>
              {pendingSearch && (
                <Button variant="outline" onClick={() => clearSearch()}>
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
                    <TableHead className="text-right">المستخدم</TableHead>
                    <TableHead className="text-right">الجهة</TableHead>
                    <TableHead className="text-right">نوع الجهة</TableHead>
                    <TableHead className="text-right">رقم الترخيص</TableHead>
                    <TableHead className="text-right">المستندات</TableHead>
                    <TableHead className="text-right">الحالة</TableHead>
                    <TableHead className="text-right"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        <div>{user.fullName}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </TableCell>
                      <TableCell>{user.organization?.name || '-'}</TableCell>
                      <TableCell>{user.organization?.type || '-'}</TableCell>
                      <TableCell>{user.organization?.licenseNumber || '-'}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {user.documents?.length || 0} مستند
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenModal(user)}
                          className="flex items-center gap-1.5"
                        >
                          <Eye className="w-4 h-4" />
                          عرض
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
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
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" dir="rtl">
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

              {/* Documents */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">المستندات المرفوعة</h3>
                {selectedUser.documents && selectedUser.documents.length > 0 ? (
                  <div className="border border-gray-200 rounded-lg divide-y divide-gray-200">
                    {selectedUser.documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="p-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-blue-600" />
                          <div>
                            <div className="font-medium text-sm">{doc.fileName}</div>
                            <div className="text-xs text-gray-500">
                              {doc.documentType} • {formatFileSize(doc.fileSize)} • {formatDate(doc.uploadedAt)}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenDocument(doc)}
                        >
                          عرض / تحميل
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 bg-gray-50 rounded-lg p-4">
                    لا توجد مستندات مرفوعة.
                  </div>
                )}
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
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={handleCloseModal} disabled={isSubmitting}>
              إغلاق
            </Button>

            {actionMode === 'view' ? (
              <>
                <Button
                  variant="destructive"
                  onClick={() => setActionMode('reject')}
                  disabled={isSubmitting || selectedUser?.status?.toUpperCase() !== 'ACTIVE'}
                >
                  رفض / طلب إجراء
                </Button>
                <Button
                  onClick={handleApprove}
                  disabled={isSubmitting || selectedUser?.status?.toUpperCase() !== 'ACTIVE'}
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
            ) : (
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
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default UserActivationPage;

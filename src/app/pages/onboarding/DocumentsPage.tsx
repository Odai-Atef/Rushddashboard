import { useCallback, useEffect, useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
  Loader2,
  Upload,
  X,
} from 'lucide-react';
import { useOnboardingNavigate } from '@/app/hooks/useOnboardingNavigate';
import { useOnboardingContext } from '@/app/hooks/useOnboardingContext';
import { toast } from 'sonner';
import {
  BACKEND_DOCUMENT_TYPE_TO_SLOT,
  DOCUMENT_SLOT_MAPPING,
  DocumentSlotId,
  OrganizationDocument,
} from '@/api/services/onboarding-service';

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  status: 'uploading' | 'completed' | 'error';
  progress: number;
  documentType?: string;
  backendId?: string;
  backendStatus?: string;
  fileUrl?: string;
}

const documentSlots: { id: DocumentSlotId; label: string; required: boolean }[] = [
  { id: 'license', label: 'رخصة الجمعية الخيرية', required: true },
  { id: 'bank', label: 'شهادة الحساب البنكي', required: true },
  { id: 'address', label: 'العنوان الوطني', required: true },
  { id: 'profile', label: 'الملف التعريفي للمؤسسة', required: true },
  { id: 'projects', label: 'المشاريع السابقة', required: false },
  { id: 'financial', label: 'التقارير المالية', required: false },
  { id: 'annual', label: 'التقارير السنوية', required: false },
  { id: 'brand', label: 'الهوية البصرية', required: false },
];

const mapSlotToDocumentType = (slotId: DocumentSlotId): string =>
  DOCUMENT_SLOT_MAPPING[slotId] || 'other';

const isCompletedStatus = (status?: string) =>
  !!status &&
  (status.toUpperCase() === 'UPLOADED' ||
    status.toUpperCase() === 'PENDING_REVIEW');

export function DocumentsPage() {
  const { goToStep } = useOnboardingNavigate();
  const { organization, activeOrganizationId, setAssessmentResult, setAssessmentStatus } =
    useOnboardingContext();

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [documentsLoadError, setDocumentsLoadError] = useState<string | null>(null);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);
  const [isSubmittingAssessment, setIsSubmittingAssessment] = useState(false);

  const requiredSlots = documentSlots.filter((s) => s.required);
  const optionalSlots = documentSlots.filter((s) => !s.required);

  const completedRequiredCount = requiredSlots.filter((slot) => {
    const doc = uploadedFiles.find(
      (f) => f.id === slot.id && isCompletedStatus(f.backendStatus)
    );
    return !!doc;
  }).length;

  const uploadedCount = uploadedFiles.filter(
    (f) => f.backendStatus === 'UPLOADED'
  ).length;
  const pendingReviewCount = uploadedFiles.filter(
    (f) => f.backendStatus === 'PENDING_REVIEW'
  ).length;
  const hasPendingUploads = uploadedFiles.some((f) => f.status === 'uploading');
  const isDocumentsComplete =
    completedRequiredCount === requiredSlots.length && !hasPendingUploads;

  const loadExistingDocuments = useCallback(async () => {
    const orgId = activeOrganizationId;
    if (!orgId) return;

    setIsLoadingDocuments(true);
    setDocumentsLoadError(null);
    try {
      const { onboardingService } = await import('@/api/services');
      const res = await onboardingService.getOrganizationDocuments(orgId);
      if (!res.success) {
        throw new Error(res.message || 'Failed to load documents');
      }
      const docs = (res.data || []) as OrganizationDocument[];
      const mappedFiles: UploadedFile[] = [];

      const docsBySlot = new Map<DocumentSlotId, OrganizationDocument[]>();
      for (const doc of docs) {
        const slotId = BACKEND_DOCUMENT_TYPE_TO_SLOT[doc.documentType.toUpperCase()];
        if (!slotId) continue;
        if (!docsBySlot.has(slotId)) docsBySlot.set(slotId, []);
        docsBySlot.get(slotId)!.push(doc);
      }

      for (const [slotId, slotDocs] of docsBySlot.entries()) {
        const sorted = slotDocs.sort((a, b) => {
          const aTime = a.uploadedAt || a.createdAt || '';
          const bTime = b.uploadedAt || b.createdAt || '';
          return bTime.localeCompare(aTime);
        });
        const doc = sorted[0];
        if (!doc) continue;

        mappedFiles.push({
          id: slotId,
          name: doc.fileName || doc.originalName || '',
          type: doc.mimeType || '',
          size: doc.fileSize || doc.size || 0,
          status: 'completed',
          progress: 100,
          documentType: doc.documentType,
          backendId: doc.id,
          backendStatus: doc.status,
          fileUrl: doc.fileUrl,
        });
      }

      setUploadedFiles((prev) => {
        const keep = prev.filter((f) => f.status === 'uploading');
        const keepIds = new Set(keep.map((f) => f.id));
        const merged = [
          ...keep,
          ...mappedFiles.filter((f) => !keepIds.has(f.id)),
        ];
        return merged;
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load documents';
      setDocumentsLoadError(message);
      toast.error(message);
    } finally {
      setIsLoadingDocuments(false);
    }
  }, [activeOrganizationId]);

  useEffect(() => {
    if (activeOrganizationId) {
      loadExistingDocuments();
    }
  }, [activeOrganizationId, loadExistingDocuments]);

  const handleUpload = async (slotId: DocumentSlotId, file: File) => {
    const docType = mapSlotToDocumentType(slotId);
    const previousDoc = uploadedFiles.find((f) => f.id === slotId);

    setUploadedFiles((prev) => {
      const filtered = prev.filter((f) => f.id !== slotId);
      return [
        ...filtered,
        {
          id: slotId,
          name: file.name,
          type: file.type,
          size: file.size,
          status: 'uploading',
          progress: 0,
          documentType: docType,
        },
      ];
    });

    const progressInterval = setInterval(() => {
      setUploadedFiles((prev) =>
        prev.map((f) =
          f.id === slotId && f.status === 'uploading' && f.progress < 90
            ? { ...f, progress: Math.min(f.progress + 10, 90) }
            : f
        )
      );
    }, 250);

    try {
      const { onboardingService } = await import('@/api/services');
      const res = await onboardingService.uploadOrganizationDocument(
        file,
        docType,
        activeOrganizationId || '',
        documentSlots.find((s) => s.id === slotId)?.label
      );
      clearInterval(progressInterval);

      if (!res.success) {
        throw new Error(res.message || 'Upload failed');
      }

      const data = res.data;

      if (previousDoc?.backendId) {
        try {
          await onboardingService.deleteOrganizationDocument(previousDoc.backendId);
        } catch (deleteErr) {
          console.warn('Failed to delete previous document', deleteErr);
        }
      }

      setUploadedFiles((prev) =>
        prev.map((f) =
          f.id === slotId
            ? {
                ...f,
                status: 'completed',
                progress: 100,
                name: data.originalName || data.fileName || file.name,
                documentType: data.documentType,
                backendId: data.id,
                backendStatus: data.status,
                fileUrl: data.fileUrl,
              }
            : f
        )
      );

      toast.success(
        `تم رفع ${documentSlots.find((s) => s.id === slotId)?.label} بنجاح`
      );
    } catch (err) {
      clearInterval(progressInterval);
      const message = err instanceof Error ? err.message : 'Upload failed';
      setUploadedFiles((prev) =>
        prev.map((f) =
          f.id === slotId ? { ...f, status: 'error', progress: 0 } : f
        )
      );
      toast.error(message);
    }
  };

  const handleDelete = async (slotId: DocumentSlotId) => {
    const doc = uploadedFiles.find((f) => f.id === slotId);
    if (!doc?.backendId) {
      setUploadedFiles((prev) => prev.filter((f) => f.id !== slotId));
      return;
    }

    try {
      const { onboardingService } = await import('@/api/services');
      await onboardingService.deleteOrganizationDocument(doc.backendId);
      setUploadedFiles((prev) => prev.filter((f) => f.id !== slotId));
      toast.success('تم حذف المستند بنجاح');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Delete failed';
      toast.error(message);
    }
  };

  const handleSelectFile = (slotId: DocumentSlotId) => {
    if (hasPendingUploads) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        handleUpload(slotId, target.files[0]);
      }
    };
    input.click();
  };

  const handleDocumentsNext = async () => {
    if (
      !isDocumentsComplete ||
      hasPendingUploads ||
      isSubmittingAssessment ||
      !activeOrganizationId
    )
      return;

    setIsSubmittingAssessment(true);
    goToStep('processing');

    try {
      const { onboardingService } = await import('@/api/services');
      await onboardingService.submitAssessment(activeOrganizationId);
      const evalRes = await onboardingService.getIsivAssessmentResults(
        activeOrganizationId
      );
      const resultData = (evalRes.data as any)?.data ?? evalRes.data;
      setAssessmentResult(resultData);
      setAssessmentStatus({
        status: 'COMPLETED',
        overallScore: resultData?.overallScore ?? null,
        completedAt: resultData?.assessedAt ?? null,
      });
      goToStep('results');
    } catch (err: any) {
      const message =
        err?.message || 'فشل في تقييم المؤسسة. يرجى المحاولة مرة أخرى.';
      toast.error(message);
      goToStep('documents');
    } finally {
      setIsSubmittingAssessment(false);
    }
  };

  if (!activeOrganizationId) {
    return (
      <div className="min-h-full bg-gray-50 p-6 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-lg w-full text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">تعذر تحميل المستندات</h2>
          <p className="text-gray-600 mb-6">
            لم يتم العثور على معلومات المنظمة. يرجى العودة وإكمال التسجيل أولاً.
          </p>
          <button
            onClick={() => goToStep('registration')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            العودة إلى التسجيل
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gray-50 p-6">
      {isLoadingDocuments && !uploadedFiles.length && (
        <div className="fixed inset-0 bg-white/80 z-50 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      )}
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">المستندات المطلوبة</h1>
          <p className="text-gray-600">يرجى رفع المستندات المطلوبة لإكمال التقييم</p>
        </div>

        {/* Upload Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {completedRequiredCount}/{requiredSlots.length}
                </p>
                <p className="text-sm text-gray-600">مستندات مطلوبة</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{uploadedCount}</p>
                <p className="text-sm text-gray-600">تم الرفع</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingReviewCount}</p>
                <p className="text-sm text-gray-600">قيد المراجعة</p>
              </div>
            </div>
          </div>
        </div>

        {/* Load error */}
        {documentsLoadError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-red-700">{documentsLoadError}</span>
            </div>
            <button
              onClick={loadExistingDocuments}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            >
              إعادة المحاولة
            </button>
          </div>
        )}

        {/* Required warning */}
        {!isDocumentsComplete && !hasPendingUploads && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <span className="text-yellow-700">
              يرجى رفع جميع المستندات الإلزامية الأربعة قبل المتابعة.
            </span>
          </div>
        )}

        {/* Required Documents */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            المستندات الإلزامية
          </h2>
          <div className="space-y-3">
            {requiredSlots.map((doc) => {
              const file = uploadedFiles.find((f) => f.id === doc.id);
              const isUploading = file?.status === 'uploading';
              const isCompleted = file?.status === 'completed';
              const isError = file?.status === 'error';
              return (
                <div
                  key={doc.id}
                  className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                    isCompleted
                      ? 'border-2 border-green-200 bg-green-50/50'
                      : isError
                      ? 'border-2 border-red-300 bg-red-50/50'
                      : 'border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50/50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                    ) : (
                      <FileText
                        className={`w-5 h-5 flex-shrink-0 ${
                          isError ? 'text-red-500' : 'text-gray-400'
                        }`}
                      />
                    )}
                    <div className="min-w-0">
                      <p className="font-medium truncate">{doc.label}</p>
                      {isCompleted && file?.name && (
                        <p
                          className="text-sm text-green-700 truncate max-w-xs"
                          title={file.name}
                        >
                          {file.name}
                        </p>
                      )}
                      {isUploading && (
                        <div className="w-32 mt-1">
                          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-600 transition-all duration-300"
                              style={{ width: `${file.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                      {isError && (
                        <p className="text-sm text-red-600">
                          فشل الرفع. يرجى المحاولة مرة أخرى.
                        </p>
                      )}
                      {!isCompleted && !isUploading && !isError && (
                        <p className="text-sm text-red-600">مطلوب *</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {isCompleted && (
                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="px-3 py-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors text-sm font-medium"
                        title="حذف"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleSelectFile(doc.id)}
                      disabled={hasPendingUploads}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          جارٍ الرفع
                        </>
                      ) : isCompleted ? (
                        <>
                          <Upload className="w-4 h-4" />
                          استبدال
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" />
                          رفع
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Optional Documents */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">المستندات الاختيارية</h2>
          <p className="text-sm text-gray-600 mb-4">
            رفع هذه المستندات يساعد في تحسين دقة التقييم
          </p>
          <div className="space-y-3">
            {optionalSlots.map((doc) => {
              const file = uploadedFiles.find((f) => f.id === doc.id);
              const isUploading = file?.status === 'uploading';
              const isCompleted = file?.status === 'completed';
              const isError = file?.status === 'error';
              return (
                <div
                  key={doc.id}
                  className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                    isCompleted
                      ? 'border-2 border-green-200 bg-green-50/50'
                      : isError
                      ? 'border-2 border-red-300 bg-red-50/50'
                      : 'border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                    ) : (
                      <FileText
                        className={`w-5 h-5 flex-shrink-0 ${
                          isError ? 'text-red-500' : 'text-gray-400'
                        }`}
                      />
                    )}
                    <div className="min-w-0">
                      <p className="font-medium truncate">{doc.label}</p>
                      {isCompleted && file?.name && (
                        <p
                          className="text-sm text-green-700 truncate max-w-xs"
                          title={file.name}
                        >
                          {file.name}
                        </p>
                      )}
                      {isUploading && (
                        <div className="w-32 mt-1">
                          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-600 transition-all duration-300"
                              style={{ width: `${file.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                      {isError && (
                        <p className="text-sm text-red-600">
                          فشل الرفع. يرجى المحاولة مرة أخرى.
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {isCompleted && (
                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="px-3 py-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors text-sm font-medium"
                        title="حذف"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleSelectFile(doc.id)}
                      disabled={hasPendingUploads}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          جارٍ الرفع
                        </>
                      ) : isCompleted ? (
                        <>
                          <Upload className="w-4 h-4" />
                          استبدال
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" />
                          رفع
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => goToStep('assessment')}
            disabled={hasPendingUploads}
            className="px-6 py-3 text-gray-600 hover:text-gray-900 font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
            رجوع
          </button>
          <button
            onClick={handleDocumentsNext}
            disabled={!isDocumentsComplete || isSubmittingAssessment}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmittingAssessment ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                جارٍ الإرسال...
              </>
            ) : (
              <>
                إرسال التقييم
                <ChevronLeft className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

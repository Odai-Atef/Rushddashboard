import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  ChevronRight,
  Sparkles,
  FileDown,
  Loader2,
  Building2,
  User,
  MapPin,
  GitBranch,
  Inbox,
  Activity,
  RotateCcw,
  Eye,
  Save,
  Send,
  Edit,
  Presentation,
  FileText,
  Upload,
  MessageSquare,
} from 'lucide-react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import MDEditor from '@uiw/react-md-editor';
import { useProjectDetails } from '@/api/hooks/useProjectDetails';
import { projectService } from '@/api/services/project-service';
import { ProjectNotFound } from './ProjectNotFound';
import { healthConfig, statusConfig, ProjectDetails as ProjectDetailsType, ProjectStatus, FundingAreaInfo } from './project-types';
import { formatDateTime } from '@/app/lib/formatters';
import { useAuth } from '@/app/layouts/RootLayout';

import { toast } from 'sonner';

export function getDisplayStatus(status: string): ProjectStatus {
  const normalized = status.toLowerCase().replace(/_/g, '-');
  return normalized in statusConfig ? (normalized as ProjectStatus) : 'draft';
}

function getBudgetAmount(budget: number | Record<string, unknown>): number {
  if (typeof budget === 'number') return budget;
  if (budget && typeof budget === 'object' && 's' in budget) {
    const digits = Array.isArray(budget.d) ? (budget.d as number[]) : [];
    const sign = budget.s === -1 ? -1 : 1;
    const exponent = typeof budget.e === 'number' ? budget.e : 0;
    if (digits.length === 0) return 0;
    const coefficient = digits
      .map((chunk, index) => (index === 0 ? String(chunk) : String(chunk).padStart(7, '0')))
      .join('');
    const normalizedExponent = exponent - (coefficient.length - 1);
    const amount = Number(`${coefficient}e${normalizedExponent}`);
    return Number.isFinite(amount) ? sign * amount : 0;
  }
  return 0;
}

function getManagerName(project: ProjectDetailsType): string {
  if (project.manager && typeof project.manager === 'object') {
    return project.manager.name || project.manager.email || project.managerId || 'غير محدد';
  }
  return toDisplayString(project.manager, project.managerId || 'غير محدد');
}

function getOrganizationName(project: ProjectDetailsType): string {
  if (project.organization && typeof project.organization === 'object') {
    return project.organization.name || project.organization.id || 'غير محدد';
  }
  return project.organization || project.organizationId || 'غير محدد';
}

function toDisplayString(value: unknown, fallback = 'غير محدد'): string {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (typeof value === 'object') {
    const record = value as Record<string, unknown>;
    return (record.name as string) || (record.label as string) || (record.title as string) || fallback;
  }
  return fallback;
}

export function ProjectDetailsPage() {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const { user } = useAuth();
  const { project, isLoading, error, refetch } = useProjectDetails(projectId);
  const isProjectManager = user?.roleSlug === 'project-managers';
  const [planOpen, setPlanOpen] = useState(false);
  const [planMarkdown, setPlanMarkdown] = useState<string>('');
  const [loadedPlanMarkdown, setLoadedPlanMarkdown] = useState<string>('');
  const [planLoading, setPlanLoading] = useState(false);
  const [wordLoading, setWordLoading] = useState(false);
  const [planView, setPlanView] = useState<'preview' | 'edit'>('preview');
  const [isSaving, setIsSaving] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [decisionLoading, setDecisionLoading] = useState(false);
  const [reviewNotes, setReviewNotes] = useState('');
  const [reviewStep, setReviewStep] = useState<'view' | 'notes' | 'confirm-approve'>('view');
  const [presentationLoading, setPresentationLoading] = useState(false);
  const [designReviewOpen, setDesignReviewOpen] = useState(false);
  const [designDecisionLoading, setDesignDecisionLoading] = useState(false);
  const [designNotes, setDesignNotes] = useState('');
  const [designInternalNotes, setDesignInternalNotes] = useState('');
  const [designStep, setDesignStep] = useState<'view' | 'notes'>('view');
  const [redesignLoading, setRedesignLoading] = useState(false);
  const [offerReviewOpen, setOfferReviewOpen] = useState(false);
  const [offerStep, setOfferStep] = useState<'view' | 'approve' | 'reject'>('view');
  const [offerDecisionLoading, setOfferDecisionLoading] = useState(false);
  const [offerDownloadLoading, setOfferDownloadLoading] = useState(false);
  const [offerFile, setOfferFile] = useState<File | null>(null);
  const [offerInternalNotes, setOfferInternalNotes] = useState('');
  const [offerRejectReason, setOfferRejectReason] = useState('');
  const [offerFileError, setOfferFileError] = useState('');
  const [activeDocTab, setActiveDocTab] = useState<'study' | 'presentation'>('study');

  const handleOpenPlan = async () => {
    if (!projectId) return;
    setPlanOpen(true);
    setPlanLoading(true);
    setPlanMarkdown('');
    setLoadedPlanMarkdown('');
    setPlanView('preview');
    try {
      const res = await projectService.getProjectPlanMarkdown(projectId);
      const content = res.data ?? '';
      const markdown = typeof content === 'string' ? content : JSON.stringify(content, null, 2);
      setPlanMarkdown(markdown);
      setLoadedPlanMarkdown(markdown);
    } catch (err: any) {
      toast.error(err?.message || 'فشل تحميل خطة المشروع');
    } finally {
      setPlanLoading(false);
    }
  };

  const handleSavePlan = async () => {
    if (!projectId) return;
    setIsSaving(true);
    try {
      await projectService.updateProjectPlanMarkdown(projectId, planMarkdown);
      setLoadedPlanMarkdown(planMarkdown);
      setPlanView('preview');
      toast.success('تم حفظ خطة المشروع بنجاح');
    } catch (err: any) {
      toast.error(err?.message || 'فشل حفظ خطة المشروع');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadWord = async () => {
    if (!projectId) return;
    setWordLoading(true);
    try {
      const res = await projectService.getProjectPlanWord(projectId);
      const blob = res.data;
      if (!(blob instanceof Blob)) {
        throw new Error('تعذر الحصول على ملف Word');
      }
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project?.name || 'project'}-plan.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success('تم تحميل خطة المشروع بنجاح');
    } catch (err: any) {
      toast.error(err?.message || 'فشل تحميل ملف Word');
    } finally {
      setWordLoading(false);
    }
  };

  const handleSubmitToCharity = async () => {
    if (!projectId) return;
    setSubmitLoading(true);
    try {
      const res = await projectService.submitToCharity(projectId);
      if (res.data?.success) {
        toast.success(res.data.message || 'تم إرسال المشروع للجهة الخيرية بنجاح');
        await refetch();
      } else {
        toast.success('تم إرسال المشروع للجهة الخيرية بنجاح');
        await refetch();
      }
    } catch (err: any) {
      const code = err?.code;
      const message = err?.message || 'فشل إرسال المشروع للجهة الخيرية';
      if (code === 'PROJECT_PLAN_MISSING') {
        toast.error(message, {
          action: {
            label: err?.actionLabel || 'إنشاء دراسة باستخدام الذكاء الاصطناعي',
            onClick: handleOpenPlan,
          },
        });
      } else {
        toast.error(message);
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  const getProjectStudy = (): string => {
    if (!project) return '';
    const study = project.llmResponse || project.llmResponseText || project.aiStudy || project.generatedStudy || '';
    if (typeof study === 'string') return study;
    return JSON.stringify(study, null, 2);
  };

  const handleOpenReview = () => {
    setReviewOpen(true);
    setReviewStep('view');
    setReviewNotes('');
  };

  const handleCloseReview = () => {
    setReviewOpen(false);
    setReviewStep('view');
    setReviewNotes('');
  };

  const handleConfirmApprove = () => {
    if (window.confirm('هل أنت متأكد من الموافقة على هذا المشروع؟')) {
      handleCharityDecision('CHARITY_APPROVAL');
    }
  };

  const handleGeneratePresentation = async () => {
    if (!projectId) return;
    if (!window.confirm('هل تريد إنشاء العرض التقديمي للمشروع بالذكاء الاصطناعي؟')) return;

    setPresentationLoading(true);
    try {
      const res = await projectService.generatePresentation(projectId);
      if (res.data?.success) {
        toast.success(res.data.message || 'تم إنشاء العرض التقديمي بنجاح');
        await refetch();
      } else {
        toast.success('تم إنشاء العرض التقديمي بنجاح');
        await refetch();
      }
    } catch (err: any) {
      toast.error(err?.message || 'فشل إنشاء العرض التقديمي');
    } finally {
      setPresentationLoading(false);
    }
  };

  const handleOpenDesignReview = () => {
    setDesignReviewOpen(true);
    setDesignStep('view');
    setDesignNotes('');
    setDesignInternalNotes('');
  };

  const handleCloseDesignReview = () => {
    setDesignReviewOpen(false);
    setDesignStep('view');
    setDesignNotes('');
    setDesignInternalNotes('');
  };

  const handleConfirmDesignApprove = () => {
    if (window.confirm('هل أنت متأكد من اعتماد تصميم هذا المشروع؟')) {
      handleDesignDecision('DESIGN_APPROVED');
    }
  };

  const handleDesignDecision = async (decisionStatus: 'DESIGN_APPROVED' | 'DESIGN_REJECTED') => {
    if (!projectId) return;
    setDesignDecisionLoading(true);
    try {
      const payload: {
        status: 'DESIGN_APPROVED' | 'DESIGN_REJECTED';
        notes?: string;
        internalNotes?: string;
      } = {
        status: decisionStatus,
      };
      if (decisionStatus === 'DESIGN_REJECTED') {
        payload.notes = designNotes.trim();
        if (designInternalNotes.trim()) {
          payload.internalNotes = designInternalNotes.trim();
        }
      }
      const res = await projectService.submitDesignDecision(projectId, payload);
      if (res.data?.success) {
        toast.success(res.data.message || 'تم تسجيل قرار التصميم بنجاح');
        await refetch();
        handleCloseDesignReview();
      } else {
        toast.success('تم تسجيل قرار التصميم بنجاح');
        await refetch();
        handleCloseDesignReview();
      }
    } catch (err: any) {
      toast.error(err?.message || 'فشل تسجيل قرار التصميم');
    } finally {
      setDesignDecisionLoading(false);
    }
  };

  const handleRequestRedesign = async () => {
    if (!projectId) return;
    if (!window.confirm('هل تريد طلب إعادة إنشاء التصميم؟')) return;

    setRedesignLoading(true);
    try {
      const res = await projectService.generatePresentation(projectId, { forceRegenerate: true });
      if (res.data?.success) {
        toast.success(res.data.message || 'تم طلب إعادة إنشاء التصميم بنجاح');
        await refetch();
      } else {
        toast.success('تم طلب إعادة إنشاء التصميم بنجاح');
        await refetch();
      }
    } catch (err: any) {
      toast.error(err?.message || 'فشل طلب إعادة إنشاء التصميم');
    } finally {
      setRedesignLoading(false);
    }
  };

  const getDesignHtml = (): string => {
    if (!project) return '';
    return project.presentationResponseText || '';
  };

  const handleOpenOfferReview = () => {
    setOfferReviewOpen(true);
    setOfferStep('view');
    setOfferFile(null);
    setOfferInternalNotes('');
    setOfferRejectReason('');
    setOfferFileError('');
  };

  const handleCloseOfferReview = () => {
    setOfferReviewOpen(false);
    setOfferStep('view');
    setOfferFile(null);
    setOfferInternalNotes('');
    setOfferRejectReason('');
    setOfferFileError('');
  };

  const handleDownloadPriceOffer = async () => {
    if (!projectId || !project) return;
    setOfferDownloadLoading(true);
    try {
      const res = await projectService.downloadPriceOffer(projectId, 'offer');
      const blob = res.data;
      if (!(blob instanceof Blob)) {
        throw new Error('تعذر الحصول على ملف عرض السعر');
      }
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project.name || 'project'}-price-offer`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success('تم تحميل عرض السعر بنجاح');
    } catch (err: any) {
      toast.error(err?.message || 'فشل تحميل عرض السعر');
    } finally {
      setOfferDownloadLoading(false);
    }
  };

  const validateOfferFile = (file: File): boolean => {
    const allowedExtensions = ['pdf', 'doc', 'docx'];
    const allowedMimeTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    const isValidType = allowedExtensions.includes(extension) || allowedMimeTypes.includes(file.type);
    const maxSize = 10 * 1024 * 1024;
    if (!isValidType) {
      setOfferFileError('يُسمح فقط بملفات PDF أو Word');
      return false;
    }
    if (file.size > maxSize) {
      setOfferFileError('حجم الملف يجب ألا يتجاوز 10 ميجابايت');
      return false;
    }
    setOfferFileError('');
    return true;
  };

  const handleOfferFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setOfferFile(null);
      setOfferFileError('');
      return;
    }
    if (validateOfferFile(file)) {
      setOfferFile(file);
    } else {
      setOfferFile(null);
      e.target.value = '';
    }
  };

  const handleApprovePriceOffer = async () => {
    if (!projectId || !offerFile) return;
    if (!validateOfferFile(offerFile)) return;

    setOfferDecisionLoading(true);
    try {
      const res = await projectService.approvePriceOffer(projectId, {
        file: offerFile,
        internalNotes: offerInternalNotes.trim() || undefined,
      });
      if (res.data?.success) {
        toast.success(res.data.message || 'تم اعتماد عرض السعر بنجاح');
        await refetch();
        handleCloseOfferReview();
      } else {
        toast.success('تم اعتماد عرض السعر بنجاح');
        await refetch();
        handleCloseOfferReview();
      }
    } catch (err: any) {
      toast.error(err?.message || 'فشل اعتماد عرض السعر');
    } finally {
      setOfferDecisionLoading(false);
    }
  };

  const handleRejectPriceOffer = async () => {
    if (!projectId) return;
    const reason = offerRejectReason.trim();
    if (!reason) {
      toast.error('يرجى كتابة سبب الرفض');
      return;
    }
    setOfferDecisionLoading(true);
    try {
      const res = await projectService.rejectPriceOffer(projectId, { reason });
      if (res.data?.success) {
        toast.success(res.data.message || 'تم رفض عرض السعر بنجاح');
        await refetch();
        handleCloseOfferReview();
      } else {
        toast.success('تم رفض عرض السعر بنجاح');
        await refetch();
        handleCloseOfferReview();
      }
    } catch (err: any) {
      toast.error(err?.message || 'فشل رفض عرض السعر');
    } finally {
      setOfferDecisionLoading(false);
    }
  };

  const handleCharityDecision = async (decisionStatus: 'CHARITY_APPROVAL' | 'INCUBATOR_MODIFICATIONS') => {
    if (!projectId) return;
    setDecisionLoading(true);
    try {
      const payload: { status: 'CHARITY_APPROVAL' | 'INCUBATOR_MODIFICATIONS'; notes?: string } = {
        status: decisionStatus,
      };
      if (decisionStatus === 'INCUBATOR_MODIFICATIONS') {
        payload.notes = reviewNotes.trim();
      }
      const res = await projectService.submitCharityDecision(projectId, payload);
      if (res.data?.success) {
        toast.success(res.data.message || 'تم تسجيل قرار المشروع بنجاح');
        await refetch();
        handleCloseReview();
      } else {
        toast.success('تم تسجيل قرار المشروع بنجاح');
        await refetch();
        handleCloseReview();
      }
    } catch (err: any) {
      toast.error(err?.message || 'فشل تسجيل قرار المشروع');
    } finally {
      setDecisionLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-full bg-gray-50 p-6 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-full bg-gray-50 p-6 flex flex-col items-center justify-center gap-4">
        <div className="text-red-600 text-center">{error}</div>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          إعادة المحاولة
        </button>
      </div>
    );
  }

  if (!project) {
    return <ProjectNotFound />;
  }

  const displayHealth = getDisplayStatus(project.health as string);
  const health = healthConfig[displayHealth] || { label: displayHealth, color: '#6b7280', icon: Activity };
  const HealthIcon = health.icon;
  const displayStatus = getDisplayStatus(project.status as string);
  const status = statusConfig[displayStatus] || { label: displayStatus, color: '#6b7280', bg: '#f3f4f6' };
  const isDraftProject = displayStatus === 'draft';
  const isEntityManager = user?.roleSlug === 'entity-managers';
  const rawStatus = (project.status as string).toUpperCase().replace(/-/g, '_');
  const showReviewButton = isEntityManager && rawStatus === 'CHARITY_REVIEW';
  const showGeneratePresentationButton = isProjectManager && rawStatus === 'CHARITY_APPROVAL';
  const showDesignReviewButton = isEntityManager && rawStatus === 'DESIGN_REVIEW';
  const showRedesignButton = isProjectManager && rawStatus === 'DESIGN_REJECTED';
  const isDesignRejected = rawStatus === 'DESIGN_REJECTED';
  const showOfferReviewButton = isEntityManager && rawStatus === 'OFFER_REVIEW';

  return (
    <div className="min-h-full bg-gray-50 p-6">
      <div className="space-y-6">
        <div className="mb-6">
          <button
            onClick={() => navigate('/dashboard/project-management/list')}
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 mb-4"
          >
            <ChevronRight className="w-5 h-5" />
            رجوع إلى قائمة المشاريع
          </button>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Building2 className="w-4 h-4" />
                  {getOrganizationName(project)}
                </span>
              </div>
            </div>
            <div className="flex gap-3 flex-wrap">
              {isProjectManager && (
                <>
                  <button
                    onClick={() => navigate(`/dashboard/project-management/edit/${projectId}`)}
                    className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
                  >
                    <Edit className="w-5 h-5" />
                    تعديل
                  </button>
                  {(isDraftProject || displayStatus === 'incubator-modifications' || displayStatus === 'offer-approved') && (
                    <button
                      onClick={handleOpenPlan}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                    >
                      <Sparkles className="w-5 h-5" />
                      إنشاء دراسة باستخدام الذكاء الاصطناعي
                    </button>
                  )}
                  {isDraftProject && (
                    <button
                      onClick={handleSubmitToCharity}
                      disabled={submitLoading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                      إرسال إلى الجهة للموافقة
                    </button>
                  )}
                  {(rawStatus === 'DESIGN_APPROVED' || rawStatus === 'READY_DONOR') && (
                    <button
                      onClick={() => {
                        if (window.confirm('هل أنت متأكد من البحث عن المانحين لهذا المشروع؟')) {
                          navigate(`/dashboard/donor-matching/recommended/${projectId}`);
                        }
                      }}
                      className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors flex items-center gap-2"
                    >
                      <Sparkles className="w-5 h-5" />
                      بحث عن المانحين
                    </button>
                  )}
                </>
              )}
              {showReviewButton && (
                <button
                  onClick={handleOpenReview}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <Eye className="w-5 h-5" />
                  مراجعة مسودة المشروع
                </button>
              )}
              {showGeneratePresentationButton && (
                <button
                  onClick={handleGeneratePresentation}
                  disabled={presentationLoading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {presentationLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Presentation className="w-5 h-5" />
                  )}
                  إنشاء العرض التقديمي بالذكاء الاصطناعي
                </button>
              )}
              {showDesignReviewButton && (
                <button
                  onClick={handleOpenDesignReview}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  <Eye className="w-5 h-5" />
                  اعتماد تصميم المشروع
                </button>
              )}
              {showRedesignButton && (
                <button
                  onClick={handleRequestRedesign}
                  disabled={redesignLoading}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {redesignLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Presentation className="w-5 h-5" />
                  )}
                  طلب إعادة التصميم
                </button>
              )}
              {showOfferReviewButton && (
                <button
                  onClick={handleOpenOfferReview}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <FileText className="w-5 h-5" />
                  اعتماد عرض السعر
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <p className="text-sm text-gray-600 mb-2">حالة المشروع</p>
            <span
              className="inline-block px-3 py-1 rounded-full text-sm font-medium"
              style={{ backgroundColor: status.bg, color: status.color }}
            >
              {status.label}
            </span>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <p className="text-sm text-gray-600 mb-2">نسبة الإنجاز</p>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600"
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
              <span className="text-2xl font-bold text-blue-600">{project.progress}%</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="text-xl font-semibold mb-4">نظرة عامة</h2>
              <p className="text-gray-700 leading-relaxed">{project.description}</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="text-xl font-semibold mb-4">معلومات المشروع</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">الفئة المستهدفة</p>
                  <p className="font-medium">{toDisplayString(project.beneficiaries)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">النطاق الجغرافي</p>
                  <p className="font-medium flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    {toDisplayString(project.geographicScope)}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:col-span-2">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">عدد المستفيدين</p>
                    <p className="font-medium">
                      {typeof project.beneficiariesCount === 'number' ? project.beneficiariesCount.toLocaleString('ar-SA') : '—'}
                    </p>
                  </div>
                  {(project.fundingAreaIds?.length > 0 || project.fundingAreas?.length > 0) && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">مجالات العمل</p>
                      <div className="flex flex-wrap gap-2">
                        {(project.fundingAreas || project.fundingAreaIds?.map((id) => ({ id, name: id })) || []).map((area: FundingAreaInfo | { id: string; name: string }) => (
                          <span
                            key={area.id}
                            className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700"
                          >
                            {area.nameAr || area.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="text-xl font-semibold mb-4">ملخص الميزانية</h2>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-600">إجمالي الميزانية</span>
                <span className="text-2xl font-bold text-gray-900">
                  {getBudgetAmount(project.budget).toLocaleString('ar-SA')} ر.س
                </span>
              </div>
            </div>

            {(project.llmResponseText || project.presentationResponseText) && (
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center gap-4 border-b border-gray-200 mb-4">
                  {project.llmResponseText && (
                    <button
                      onClick={() => setActiveDocTab('study')}
                      className={`pb-2 px-2 text-sm font-medium border-b-2 transition-colors ${activeDocTab === 'study' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                      دراسة المشروع
                    </button>
                  )}
                  {project.presentationResponseText && (
                    <button
                      onClick={() => setActiveDocTab('presentation')}
                      className={`pb-2 px-2 text-sm font-medium border-b-2 transition-colors ${activeDocTab === 'presentation' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                      تصميم العرض
                    </button>
                  )}
                </div>
                {activeDocTab === 'study' && project.llmResponseText && (
                  <div dir="rtl" className="bg-white rounded-xl border border-gray-200 min-h-[300px] text-right">
                    <MDEditor
                      value={project.llmResponseText}
                      onChange={() => {}}
                      height="400px"
                      visibleDragBar={false}
                      preview="preview"
                      hideToolbar={true}
                      className="w-full [&_*]:text-right"
                      data-color-mode="light"
                    />
                  </div>
                )}
                {activeDocTab === 'presentation' && project.presentationResponseText && (
                  <div dir="rtl" className="bg-white rounded-xl border border-gray-200 p-6 min-h-[300px] text-right">
                    <div
                      className="prose prose-sm max-w-none w-full break-words [&>*]:text-right"
                      dangerouslySetInnerHTML={{ __html: project.presentationResponseText }}
                    />
                  </div>
                )}
              </div>
            )}

            {project.budgets && project.budgets.length > 0 && (
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h2 className="text-xl font-semibold mb-4">تفاصيل الميزانية</h2>
                <div className="space-y-3">
                  {project.budgets.map((budget) => (
                    <div key={budget.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">{budget.category}</span>
                      <div className="text-sm text-gray-600">
                        مخصص: {budget.allocated.toLocaleString('ar-SA')} / منفق: {budget.spent.toLocaleString('ar-SA')} {budget.currencyCode}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {project.milestones && project.milestones.length > 0 && (
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h2 className="text-xl font-semibold mb-4">المعالم الرئيسية</h2>
                <div className="space-y-3">
                  {project.milestones.map((milestone) => (
                    <div key={milestone.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{milestone.title}</span>
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">{milestone.status}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{milestone.description}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>تاريخ الاستحقاق: {new Date(milestone.dueDate).toLocaleDateString('ar-SA')}</span>
                        <span>التقدم: {milestone.progress}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="font-semibold mb-4">إجراءات سريعة</h3>
              <div className="space-y-2">
                <button
                  onClick={() => navigate(`/dashboard/project-management/lifecycle/${project.id}`)}
                  className="w-full px-4 py-3 text-right border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3"
                >
                  <GitBranch className="w-5 h-5 text-gray-400" />
                  <span>عرض دورة الحياة</span>
                </button>
                <button
                  onClick={() => navigate(`/dashboard/project-management/versions/${project.id}`)}
                  className="w-full px-4 py-3 text-right border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3"
                >
                  <Inbox className="w-5 h-5 text-gray-400" />
                  <span>البريد الوارد</span>
                </button>
                <button
                  onClick={() => navigate(`/dashboard/collaboration/${project.id}/chat`)}
                  className="w-full px-4 py-3 text-right border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3"
                >
                  <MessageSquare className="w-5 h-5 text-gray-400" />
                  <span>المحادثة</span>
                </button>
                <button
                  onClick={() => navigate(`/dashboard/project-management/activity/${project.id}`)}
                  className="w-full px-4 py-3 text-right border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3"
                >
                  <Activity className="w-5 h-5 text-gray-400" />
                  <span>النشاط</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="font-semibold mb-4">الفريق المسؤول</h3>
              <div className="space-y-3">
                {['مدير المشروع', 'مسؤول مالي', 'ممثل الجمعية'].map((role) => (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {project.activities && project.activities.length > 0 && (
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="font-semibold mb-4">آخر الأنشطة</h3>
                <div className="space-y-3">
                  {project.activities.slice(0, 5).map((activity) => (
                    <div key={activity.id} className="text-sm">
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-gray-600 text-xs">{activity.description}</p>
                      <p className="text-gray-400 text-xs mt-1">
                        {new Date(activity.createdAt).toLocaleDateString('ar-SA')} ({formatDateTime(activity.createdAt)})
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {planOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setPlanOpen(false)}
          />
          <div dir="rtl" className="relative z-10 flex flex-col w-full h-[90vh] max-w-[90vw] bg-white rounded-xl shadow-2xl overflow-hidden text-right">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
              <div>
                <h2 className="text-xl font-semibold">خطة المشروع</h2>
                <p className="text-sm text-gray-500 mt-1">تحرير ومعاينة خطة المشروع</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-gray-100 rounded-lg p-1 ml-2">
                  <button
                    onClick={() => setPlanView('preview')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${
                      planView === 'preview'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Eye className="w-4 h-4" />
                    معاينة
                  </button>
                  <button
                    onClick={() => setPlanView('edit')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${
                      planView === 'edit'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Edit className="w-4 h-4" />
                    تحرير
                  </button>
                </div>
                <button
                  onClick={handleSavePlan}
                  disabled={isSaving || planMarkdown === loadedPlanMarkdown}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  حفظ
                </button>
                <button
                  onClick={handleDownloadWord}
                  disabled={wordLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {wordLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <FileDown className="w-4 h-4" />
                  )}
                  تحميل Word
                </button>
                <button
                  onClick={() => setPlanOpen(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
              {planLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
              ) : planView === 'preview' ? (
                <div className="prose prose-sm max-w-none text-right w-full break-words bg-white rounded-xl p-6 border border-gray-200 min-h-full [&>*]:text-right">
                  <Markdown remarkPlugins={[remarkGfm]}>{planMarkdown || '\u00A0'}</Markdown>
                </div>
              ) : (
                <div dir="rtl" data-color-mode="light" className="bg-white rounded-xl border border-gray-200 min-h-full h-full">
                  <MDEditor
                    value={planMarkdown}
                    onChange={(val) => setPlanMarkdown(val || '')}
                    height="100%"
                    visibleDragBar={false}
                    preview="edit"
                    className="w-full h-full"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {reviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={handleCloseReview}
          />
          <div dir="rtl" className="relative z-10 flex flex-col w-full h-[90vh] max-w-[90vw] bg-white rounded-xl shadow-2xl overflow-hidden text-right">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
              <div>
                <h2 className="text-xl font-semibold">مراجعة مسودة المشروع</h2>
                <p className="text-sm text-gray-500 mt-1">يرجى مراجعة الدراسة المُولدة ثم اختيار القرار المناسب</p>
              </div>
              <button
                onClick={handleCloseReview}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
              {reviewStep === 'view' ? (
                <div className="space-y-6">
                  <div className="prose prose-sm max-w-none text-right w-full break-words bg-white rounded-xl p-6 border border-gray-200 min-h-full [&>*]:text-right">
                    <Markdown remarkPlugins={[remarkGfm]}>{getProjectStudy() || 'لا توجد دراسة مُولدة لهذا المشروع'}</Markdown>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 max-w-2xl mx-auto bg-white rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold">طلب تعديلات</h3>
                  <p className="text-sm text-gray-600">يرجى إرسال ملاحظات توضيحية حول التعديلات المطلوبة.</p>
                  <textarea
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    placeholder="اكتب ملاحظاتك هنا..."
                    rows={8}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right resize-none"
                  />
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 bg-white flex items-center justify-between gap-3 flex-wrap">
              {reviewStep === 'view' ? (
                <>
                  <button
                    onClick={handleCloseReview}
                    className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                  >
                    إلغاء
                  </button>
                  <div className="flex items-center gap-3 flex-wrap">
                    <button
                      onClick={() => setReviewStep('notes')}
                      className="px-5 py-2.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm font-medium flex items-center gap-2"
                    >
                      طلب تعديلات
                    </button>
                    <button
                      onClick={handleConfirmApprove}
                      disabled={decisionLoading}
                      className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {decisionLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : null}
                      موافقة
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setReviewStep('view')}
                    className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                  >
                    رجوع
                  </button>
                  <button
                    onClick={() => handleCharityDecision('INCUBATOR_MODIFICATIONS')}
                    disabled={decisionLoading || !reviewNotes.trim()}
                    className="px-5 py-2.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {decisionLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : null}
                    إرسال طلب التعديلات
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {designReviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={handleCloseDesignReview}
          />
          <div dir="rtl" className="relative z-10 flex flex-col w-full h-[90vh] bg-white rounded-xl shadow-2xl overflow-hidden text-right">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
              <div>
                <h2 className="text-xl font-semibold">اعتماد تصميم المشروع</h2>
                <p className="text-sm text-gray-500 mt-1">يرجى مراجعة التصميم المعروض أدناه ثم اختيار القرار المناسب</p>
              </div>
              <button
                onClick={handleCloseDesignReview}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
              {designStep === 'view' ? (
                <div className="space-y-6 w-full">
                  {getDesignHtml() ? (
                    <div
                      className="w-full bg-white rounded-xl border border-gray-200 min-h-full"
                      dangerouslySetInnerHTML={{ __html: getDesignHtml() }}
                    />
                  ) : (
                    <div className="prose prose-sm max-w-none text-right w-full break-words bg-white rounded-xl p-6 border border-gray-200 min-h-full [&>*]:text-right">
                      لا يوجد تصميم معتمد لهذا المشروع
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4 max-w-2xl mx-auto bg-white rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold">طلب تعديل على التصميم</h3>
                  <p className="text-sm text-gray-600">يرجى إرسال ملاحظات توضيحية حول التعديلات المطلوبة.</p>
                  <textarea
                    value={designNotes}
                    onChange={(e) => setDesignNotes(e.target.value)}
                    placeholder="اكتب ملاحظات التعديلات هنا..."
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right resize-none"
                  />
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">ملاحظات داخلية (اختياري)</label>
                    <textarea
                      value={designInternalNotes}
                      onChange={(e) => setDesignInternalNotes(e.target.value)}
                      placeholder="ملاحظات داخلية غير مرسلة للجهة..."
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right resize-none"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 bg-white flex items-center justify-between gap-3 flex-wrap">
              {designStep === 'view' ? (
                <>
                  <button
                    onClick={handleCloseDesignReview}
                    className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                  >
                    إلغاء
                  </button>
                  <div className="flex items-center gap-3 flex-wrap">
                    <button
                      onClick={() => setDesignStep('notes')}
                      className="px-5 py-2.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm font-medium flex items-center gap-2"
                    >
                      طلب تعديل
                    </button>
                    <button
                      onClick={handleConfirmDesignApprove}
                      disabled={designDecisionLoading}
                      className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {designDecisionLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : null}
                      اعتماد التصميم
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setDesignStep('view')}
                    className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                  >
                    رجوع
                  </button>
                  <button
                    onClick={() => handleDesignDecision('DESIGN_REJECTED')}
                    disabled={designDecisionLoading || !designNotes.trim()}
                    className="px-5 py-2.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {designDecisionLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : null}
                    إرسال طلب التعديل
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {offerReviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={handleCloseOfferReview}
          />
          <div dir="rtl" className="relative z-10 flex flex-col w-full h-[90vh] bg-white rounded-xl shadow-2xl overflow-hidden text-right">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
              <div>
                <h2 className="text-xl font-semibold">اعتماد عرض السعر</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {offerStep === 'view'
                    ? 'يرجى تحميل عرض السعر المُولد ومراجعته قبل اتخاذ القرار'
                    : offerStep === 'approve'
                    ? 'ارفع عرض السعر الموقع لإتمام الاعتماد'
                    : 'اكتب سبب رفض عرض السعر'}
                </p>
              </div>
              <button
                onClick={handleCloseOfferReview}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
              {offerStep === 'view' && (
                <div className="space-y-6 max-w-3xl mx-auto">
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 text-center space-y-4">
                    <FileText className="w-16 h-16 text-blue-600 mx-auto" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">عرض السعر</h3>
                      <p className="text-sm text-gray-600">يمكنك تحميل عرض السعر المُولد لمراجعته قبل اتخاذ القرار.</p>
                    </div>
                    <button
                      onClick={handleDownloadPriceOffer}
                      disabled={offerDownloadLoading}
                      className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {offerDownloadLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <FileDown className="w-4 h-4" />
                      )}
                      تحميل عرض السعر
                    </button>
                  </div>
                </div>
              )}

              {offerStep === 'approve' && (
                <div className="space-y-4 max-w-2xl mx-auto bg-white rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold">رفع عرض السعر الموقع</h3>
                  <p className="text-sm text-gray-600">يرجى رفع نسخة عرض السعر الموقع بصيغة PDF أو Word فقط (بحد أقصى 10 ميجابايت).</p>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">الملف الموقع</label>
                    <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col items-center gap-2 text-gray-600">
                        <Upload className="w-8 h-8" />
                        <span className="text-sm font-medium">
                          {offerFile ? offerFile.name : 'انقر لاختيار ملف PDF أو Word'}
                        </span>
                        <span className="text-xs text-gray-400">PDF أو Word - بحد أقصى 10 ميجابايت</span>
                      </div>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        onChange={handleOfferFileChange}
                        className="hidden"
                      />
                    </label>
                    {offerFileError && (
                      <p className="text-sm text-red-600">{offerFileError}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">ملاحظات داخلية (اختياري)</label>
                    <textarea
                      value={offerInternalNotes}
                      onChange={(e) => setOfferInternalNotes(e.target.value)}
                      placeholder="ملاحظات داخلية غير مرسلة للجهة..."
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right resize-none"
                    />
                  </div>
                </div>
              )}

              {offerStep === 'reject' && (
                <div className="space-y-4 max-w-2xl mx-auto bg-white rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold">رفض عرض السعر</h3>
                  <p className="text-sm text-gray-600">يرجى توضيح سبب رفض عرض السعر ليتم إرساله إلى مدير المشروع.</p>
                  <textarea
                    value={offerRejectReason}
                    onChange={(e) => setOfferRejectReason(e.target.value)}
                    placeholder="اكتب سبب الرفض هنا..."
                    rows={8}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right resize-none"
                  />
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 bg-white flex items-center justify-between gap-3 flex-wrap">
              {offerStep === 'view' ? (
                <>
                  <button
                    onClick={handleCloseOfferReview}
                    className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                  >
                    إلغاء
                  </button>
                  <div className="flex items-center gap-3 flex-wrap">
                    <button
                      onClick={() => setOfferStep('reject')}
                      className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium flex items-center gap-2"
                    >
                      رفض
                    </button>
                    <button
                      onClick={() => setOfferStep('approve')}
                      className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center gap-2"
                    >
                      موافقة
                    </button>
                  </div>
                </>
              ) : offerStep === 'approve' ? (
                <>
                  <button
                    onClick={() => setOfferStep('view')}
                    className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                  >
                    رجوع
                  </button>
                  <button
                    onClick={handleApprovePriceOffer}
                    disabled={offerDecisionLoading || !offerFile}
                    className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {offerDecisionLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : null}
                    إرسال الموافقة مع الملف
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setOfferStep('view')}
                    className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                  >
                    رجوع
                  </button>
                  <button
                    onClick={handleRejectPriceOffer}
                    disabled={offerDecisionLoading || !offerRejectReason.trim()}
                    className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {offerDecisionLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : null}
                    إرسال سبب الرفض
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

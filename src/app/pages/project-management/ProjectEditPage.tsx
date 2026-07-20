import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ChevronRight, Save, RotateCcw } from 'lucide-react';
import { useProjectDetails } from '@/api/hooks/useProjectDetails';
import { ProjectNotFound } from './ProjectNotFound';
import { toast } from 'sonner';
import { projectService } from '@/api/services/project-service';
import { onboardingService } from '@/api/services/onboarding-service';
import type { FundingArea } from '@/api/services/onboarding-service';
import { statusConfig, ProjectStatus, UpdateProjectDto, ProjectDetails as ProjectDetailsType } from './project-types';
import { useAuth } from '@/app/layouts/RootLayout';
import MDEditor from '@uiw/react-md-editor';

const STATUS_OPTIONS: ProjectStatus[] = Object.keys(statusConfig) as ProjectStatus[];

function daysBetween(start: string, end: string): number | null {
  if (!start || !end) return null;
  const s = new Date(start);
  const e = new Date(end);
  if (isNaN(s.getTime()) || isNaN(e.getTime())) return null;
  const diff = e.getTime() - s.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return days >= 0 ? days : null;
}

function getDisplayStatus(status: string): ProjectStatus {
  const normalized = status.toLowerCase().replace(/_/g, '-');
  return normalized in statusConfig ? (normalized as ProjectStatus) : 'draft';
}

function toApiStatus(status: string): string {
  return status.toUpperCase().replace(/-/g, '_');
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

function extractFundingAreaIds(project: ProjectDetailsType): string[] {
  if (Array.isArray(project.fundingAreaIds) && project.fundingAreaIds.length > 0) {
    return project.fundingAreaIds.filter((id): id is string => typeof id === 'string');
  }
  if (Array.isArray(project.fundingAreas)) {
    return project.fundingAreas.map((area) => area.id).filter(Boolean);
  }
  return [];
}

export function ProjectEditPage() {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const { user } = useAuth();
  const isProjectManager = user?.roleSlug === 'project-managers';
  const { project, isLoading: isLoadingProject, error, refetch } = useProjectDetails(projectId);
  const [isSaving, setIsSaving] = useState(false);
  const [localFieldErrors, setLocalFieldErrors] = useState<Record<string, string>>({});
  const [fundingAreas, setFundingAreas] = useState<FundingArea[]>([]);
  const [isLoadingFundingAreas, setIsLoadingFundingAreas] = useState(true);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    fundingAreaIds: [] as string[],
    organizationId: '',
    description: '',
    beneficiaries: '',
    beneficiariesCount: '',
    geographicScope: '',
    budget: '',
    currencyCode: 'SAR',
    startDate: '',
    endDate: '',
    status: '' as ProjectStatus | string,
    llmResponseText: '',
  });

  const startDateRef = useRef<HTMLInputElement | null>(null);
  const endDateRef = useRef<HTMLInputElement | null>(null);

  // Redirect non-project-managers away from this page
  useEffect(() => {
    if (!isProjectManager) {
      navigate('/dashboard/project-management/list', { replace: true });
    }
  }, [isProjectManager, navigate]);

  useEffect(() => {
    let cancelled = false;

    async function loadFundingAreas() {
      setIsLoadingFundingAreas(true);
      try {
        const response = await onboardingService.getFundingAreas();
        if (!cancelled && response.success && Array.isArray(response.data)) {
          setFundingAreas(response.data);
        }
      } catch {
        // Silently ignore; empty list is acceptable
      } finally {
        if (!cancelled) {
          setIsLoadingFundingAreas(false);
        }
      }
    }

    loadFundingAreas();

    return () => {
      cancelled = true;
    };
  }, []);

  function toDateInputValue(value: string | undefined): string {
    if (!value) return '';
    const date = new Date(value);
    if (isNaN(date.getTime())) return value.slice(0, 10);
    return date.toISOString().slice(0, 10);
  }

  useEffect(() => {
    if (!project) return;
    const budgetAmount = getBudgetAmount(project.budget as number | Record<string, unknown>);
    setFormData({
      name: project.name || '',
      fundingAreaIds: extractFundingAreaIds(project),
      organizationId: project.organizationId || '',
      description: project.description || '',
      beneficiaries: project.beneficiaries || '',
      beneficiariesCount: typeof project.beneficiariesCount === 'number' ? String(project.beneficiariesCount) : '',
      geographicScope: project.geographicScope || '',
      budget: budgetAmount ? String(budgetAmount) : '',
      currencyCode: project.currencyCode || 'SAR',
      startDate: toDateInputValue(project.startDate),
      endDate: toDateInputValue(project.endDate),
      status: getDisplayStatus(project.status as string),
      llmResponseText: project.llmResponseText || '',
    });
  }, [project]);

  const updateField = (field: keyof typeof formData, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setLocalFieldErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
    if (saveError) setSaveError(null);
  };

  const toggleFundingArea = (areaId: string) => {
    setFormData((prev) => {
      const nextAreas = prev.fundingAreaIds.includes(areaId)
        ? prev.fundingAreaIds.filter((id) => id !== areaId)
        : [...prev.fundingAreaIds, areaId];
      return { ...prev, fundingAreaIds: nextAreas };
    });
    setLocalFieldErrors((prev) => {
      const next = { ...prev };
      delete next.fundingAreaIds;
      return next;
    });
    if (saveError) setSaveError(null);
  };

  function getFieldError(field: string): string | undefined {
    return localFieldErrors[field];
  }

  const durationDays = daysBetween(formData.startDate, formData.endDate);

  function validateForm(): Record<string, string> {
    const errors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      errors.name = 'اسم المشروع مطلوب.';
    } else if (formData.name.trim().length < 3) {
      errors.name = 'اسم المشروع يجب أن يكون 3 أحرف على الأقل.';
    } else if (formData.name.trim().length > 255) {
      errors.name = 'اسم المشروع يجب أن لا يتجاوز 255 حرفاً.';
    }

    if (formData.fundingAreaIds.length === 0) {
      errors.fundingAreaIds = 'يجب تحديد مجال تمويل واحد على الأقل.';
    }

    if (!formData.description?.trim()) {
      errors.description = 'وصف المشروع مطلوب.';
    } else if (formData.description.trim().length < 10) {
      errors.description = 'وصف المشروع يجب أن يكون 10 أحرف على الأقل.';
    }

    if (!formData.budget) {
      errors.budget = 'الميزانية التقديرية مطلوبة.';
    } else {
      const budgetNum = Number(formData.budget);
      if (isNaN(budgetNum) || budgetNum < 0) {
        errors.budget = 'الميزانية يجب أن تكون صفر أو أكثر.';
      }
    }

    if (!formData.beneficiaries?.trim()) {
      errors.beneficiaries = 'الفئة المستفيدة مطلوبة.';
    }

    if (!formData.beneficiariesCount) {
      errors.beneficiariesCount = 'عدد المستفيدين مطلوب.';
    } else {
      const countNum = Number(formData.beneficiariesCount);
      if (isNaN(countNum) || countNum < 0 || !Number.isInteger(countNum)) {
        errors.beneficiariesCount = 'عدد المستفيدين يجب أن يكون عدداً صحيحاً 0 أو أكثر.';
      }
    }

    if (!formData.geographicScope?.trim()) {
      errors.geographicScope = 'النطاق الجغرافي مطلوب.';
    }

    if (!formData.startDate) {
      errors.startDate = 'تاريخ بدء المشروع مطلوب.';
    }

    if (!formData.endDate) {
      errors.endDate = 'تاريخ انتهاء المشروع مطلوب.';
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end < start) {
        errors.endDate = 'تاريخ الانتهاء يجب أن يكون بعد تاريخ البدء.';
      }
    }

    if (!formData.status) {
      errors.status = 'حالة المشروع مطلوبة.';
    }

    return errors;
  }

  const handleSubmit = async () => {
    if (!projectId || !isProjectManager) return;
    setSaveError(null);
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setLocalFieldErrors(validationErrors);
      return;
    }
    setLocalFieldErrors({});

    const dto: UpdateProjectDto = {
      name: formData.name,
      description: formData.description,
      budget: Number(formData.budget) || 0,
      currencyCode: formData.currencyCode,
      startDate: formData.startDate,
      endDate: formData.endDate,
      beneficiaries: formData.beneficiaries,
      beneficiariesCount: Number(formData.beneficiariesCount) || 0,
      geographicScope: formData.geographicScope,
      managerId: user?.id || project?.managerId || '',
      fundingAreaIds: formData.fundingAreaIds,
      status: toApiStatus(formData.status),
      llmResponseText: formData.llmResponseText,
    };

    setIsSaving(true);
    try {
      await projectService.updateProject(projectId, dto);
      toast.success('تم حفظ التعديلات بنجاح');
      navigate(`/dashboard/project-management/details/${projectId}`);
    } catch (err: any) {
      const message = err?.message || err?.response?.data?.message || 'تعذر حفظ التعديلات. يرجى المحاولة مرة أخرى.';
      setSaveError(message);
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isProjectManager) {
    return (
      <div className="min-h-full bg-gray-50 p-6 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isLoadingProject) {
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

  return (
    <div className="min-h-full bg-gray-50 p-6">
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate(`/dashboard/project-management/details/${projectId}`)}
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 mb-4"
          >
            <ChevronRight className="w-5 h-5" />
            رجوع إلى تفاصيل المشروع
          </button>
          <h1 className="text-3xl font-bold mb-2">تعديل المشروع</h1>
          <p className="text-gray-600">تحديث تفاصيل المشروع</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            {saveError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {saveError}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">اسم المشروع *</label>
              {getFieldError('name') && <p className="text-red-600 text-sm mb-1">{getFieldError('name')}</p>}
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="مثال: برنامج الأسر المنتجة"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">مجالات العمل *</label>
              {getFieldError('fundingAreaIds') && <p className="text-red-600 text-sm mb-1">{getFieldError('fundingAreaIds')}</p>}
              {isLoadingFundingAreas ? (
                <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500">
                  جاري تحميل مجالات العمل...
                </div>
              ) : fundingAreas.length === 0 ? (
                <p className="text-sm text-gray-500">لا توجد مجالات عمل متاحة حالياً.</p>
              ) : (
                <div className={`grid grid-cols-2 md:grid-cols-3 gap-3 p-2 rounded-lg border ${getFieldError('fundingAreaIds') ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}>
                  {fundingAreas.map((area) => (
                    <label
                      key={area.id}
                      className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer bg-white"
                    >
                      <input
                        type="checkbox"
                        checked={formData.fundingAreaIds.includes(area.id)}
                        onChange={() => toggleFundingArea(area.id)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="text-sm">{area.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">وصف المشروع *</label>
              {getFieldError('description') && <p className="text-red-600 text-sm mb-1">{getFieldError('description')}</p>}
              <textarea
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="اكتب وصفاً تفصيلياً للمشروع..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">الميزانية التقديرية (ر.س) *</label>
                {getFieldError('budget') && <p className="text-red-600 text-sm mb-1">{getFieldError('budget')}</p>}
                <input
                  type="number"
                  value={formData.budget}
                  onChange={(e) => updateField('budget', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="250000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">الفئة المستفيدة *</label>
                {getFieldError('beneficiaries') && <p className="text-red-600 text-sm mb-1">{getFieldError('beneficiaries')}</p>}
                <input
                  type="text"
                  value={formData.beneficiaries}
                  onChange={(e) => updateField('beneficiaries', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="مثال: الأسر المحتاجة"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">عدد المستفيدين *</label>
                {getFieldError('beneficiariesCount') && <p className="text-red-600 text-sm mb-1">{getFieldError('beneficiariesCount')}</p>}
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={formData.beneficiariesCount}
                  onChange={(e) => updateField('beneficiariesCount', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="مثال: 500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">النطاق الجغرافي *</label>
                {getFieldError('geographicScope') && <p className="text-red-600 text-sm mb-1">{getFieldError('geographicScope')}</p>}
                <input
                  type="text"
                  value={formData.geographicScope}
                  onChange={(e) => updateField('geographicScope', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="مثال: الرياض"
                />
              </div>
            </div>

            <input type="hidden" value={formData.organizationId} readOnly />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">حالة المشروع *</label>
                {getFieldError('status') && <p className="text-red-600 text-sm mb-1">{getFieldError('status')}</p>}
                <select
                  value={formData.status}
                  onChange={(e) => updateField('status', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">اختر الحالة</option>
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {statusConfig[status]?.label || status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">فترة المشروع *</label>
              {(getFieldError('startDate') || getFieldError('endDate')) && (
                <p className="text-red-600 text-sm mb-1">{getFieldError('startDate') || getFieldError('endDate')}</p>
              )}
              <div className={`flex items-stretch border rounded-lg overflow-hidden ${(getFieldError('startDate') || getFieldError('endDate')) ? 'border-red-500 bg-red-50' : 'border-gray-300 focus-within:ring-2 focus-within:ring-blue-500'}`}>
                <div
                  className="flex-1 flex flex-col px-4 py-2 cursor-pointer"
                  onClick={() => startDateRef.current?.showPicker?.()}
                >
                  <span className="text-[10px] text-gray-400 mb-0.5">من</span>
                  <input
                    ref={startDateRef}
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => updateField('startDate', e.target.value)}
                    className="w-full bg-transparent outline-none text-sm text-gray-900 cursor-pointer"
                  />
                </div>
                <div className="w-px bg-gray-200 self-stretch my-2" />
                <div
                  className="flex-1 flex flex-col px-4 py-2 cursor-pointer"
                  onClick={() => endDateRef.current?.showPicker?.()}
                >
                  <span className="text-[10px] text-gray-400 mb-0.5">إلى</span>
                  <input
                    ref={endDateRef}
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => updateField('endDate', e.target.value)}
                    className="w-full bg-transparent outline-none text-sm text-gray-900 cursor-pointer"
                  />
                </div>
              </div>
              {durationDays !== null && (
                <p className="text-gray-500 text-xs mt-2">مدة المشروع: {durationDays} يوم</p>
              )}
            </div>

            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-lg font-semibold">بيانات إضافية للمدير</h3>
              <div>
                <label className="block text-sm font-medium mb-2">نص الدراسة (Markdown)</label>
                <style>{`
                  .md-editor-rtl .w-md-editor-text-pre,
                  .md-editor-rtl .w-md-editor-text-input {
                    text-align: right !important;
                  }
                `}</style>
                <div dir="rtl" data-color-mode="light" className="bg-white rounded-xl border border-gray-200 min-h-[300px]">
                  <MDEditor
                    value={formData.llmResponseText}
                    onChange={(val) => updateField('llmResponseText', val || '')}
                    height="300px"
                    visibleDragBar={false}
                    preview="edit"
                    className="w-full md-editor-rtl"
                    textareaProps={{ style: { textAlign: 'right' } }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t">
              <button
                type="button"
                onClick={() => navigate(`/dashboard/project-management/details/${projectId}`)}
                className="px-6 py-3 text-gray-600 hover:text-gray-900 font-medium"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
              >
                <Save className="w-5 h-5" />
                {isSaving ? 'جاري الحفظ...' : 'حفظ التعديلات'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProjectEditPage;

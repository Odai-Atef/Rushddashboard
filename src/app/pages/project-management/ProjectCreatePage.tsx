import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { ChevronRight, Loader2 } from 'lucide-react';
import { useProjectCreate } from '@/api/hooks/useProjectCreate';
import { useProjectEligibility } from '@/api/hooks/useProjectEligibility';
import { useEligibleProjectOrganizations } from '@/api/hooks/useEligibleProjectOrganizations';
import { CreateProjectDto, ProjectEligibility } from '@/api/services/project-service';
import { onboardingService } from '@/api/services/onboarding-service';
import type { FundingArea } from '@/api/services/onboarding-service';
import { useAuth } from '@/app/layouts/RootLayout';
import { MultiSelect } from '@/app/components/ui/multi-select';
import { toast } from 'sonner';

function daysBetween(start: string, end: string): number | null {
  if (!start || !end) return null;
  const s = new Date(start);
  const e = new Date(end);
  if (isNaN(s.getTime()) || isNaN(e.getTime())) return null;
  const diff = e.getTime() - s.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return days >= 0 ? days : null;
}

function normalizeForMatch(value?: string | null): string {
  return (value || '').trim().toLowerCase();
}

function extractProfilePayload(data: unknown): any {
  if (!data || typeof data !== 'object') return null;
  const d = data as Record<string, any>;
  // Backend may return either the raw profile object or a wrapped envelope { success, data, message }
  if ('data' in d && typeof d.data === 'object' && d.data !== null && 'fundingAreas' in d.data) {
    return d.data;
  }
  return d;
}

export function ProjectCreatePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Both entity-managers and project-managers can create projects
  const isEntityManager = user?.roleSlug === 'entity-managers';
  const isProjectManager = user?.roleSlug === 'project-managers';
  const canCreateProject = isEntityManager || isProjectManager;

  useEffect(() => {
    if (!canCreateProject) {
      navigate('/dashboard/project-management/list', { replace: true });
    }
  }, [canCreateProject, navigate]);

  const [localFieldErrors, setLocalFieldErrors] = useState<Record<string, string>>({});
  const [organizationOptions, setOrganizationOptions] = useState<{ id: string; name: string; quota?: { remaining: number } }[]>([]);
  const [isLoadingOrganization, setIsLoadingOrganization] = useState(true);
  const [organizationError, setOrganizationError] = useState<string | null>(null);
  const [fundingAreas, setFundingAreas] = useState<FundingArea[]>([]);
  const [isLoadingFundingAreas, setIsLoadingFundingAreas] = useState(true);
  const [allowedFundingAreaIds, setAllowedFundingAreaIds] = useState<Set<string> | null>(null);
  const [allowedFundingAreaNames, setAllowedFundingAreaNames] = useState<Set<string> | null>(null);
  const [createErrorReason, setCreateErrorReason] = useState<ProjectEligibility['reason'] | null>(null);
  const [eligibilityToastShown, setEligibilityToastShown] = useState(false);
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
  });

  const {
    organizations: eligibleOrganizations,
    isLoading: isLoadingEligibleOrganizations,
    error: eligibleOrganizationsError,
  } = useEligibleProjectOrganizations(isProjectManager);

  const {
    data: eligibility,
    isLoading: isLoadingEligibility,
    error: eligibilityError,
    reason: eligibilityReason,
  } = useProjectEligibility(isEntityManager ? formData.organizationId : null);

  // Destructure errorCode from the hook to detect eligibility-related failures
  const { create, isLoading, error, errorCode, fieldErrors, clearFieldError, clearError } = useProjectCreate();

  const startDateRef = useRef<HTMLInputElement | null>(null);
  const endDateRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadOrganization() {
      setIsLoadingOrganization(true);
      setOrganizationError(null);
      try {
        const response = await onboardingService.getMyOrganization();
        const org = response.data;
        if (!cancelled) {
          if (org?.id) {
            setOrganizationOptions([{ id: org.id, name: org.name }]);
            setFormData((prev) => ({ ...prev, organizationId: org.id }));
            // For entity-managers, restrict work areas to those selected during onboarding
            if (isEntityManager) {
              try {
                const profileRes = await onboardingService.getProfile(org.id);
                const profile = extractProfilePayload(profileRes.data);
                const selectedFundingAreas = profile?.fundingAreas ?? [];
                const selectedIds = new Set(
                  selectedFundingAreas
                    .map((fa: any) => fa.fundingAreaId || fa.id)
                    .filter(Boolean)
                );
                const selectedNames = new Set(
                  selectedFundingAreas
                    .map((fa: any) => normalizeForMatch(fa.nameAr || fa.name))
                    .filter(Boolean)
                );
                setAllowedFundingAreaIds(selectedIds);
                setAllowedFundingAreaNames(selectedNames);
              } catch {
                // Fallback: allow all funding areas if profile cannot be loaded
                setAllowedFundingAreaIds(null);
                setAllowedFundingAreaNames(null);
              }
            }
          } else {
            setOrganizationError('لم يتم العثور على جهه مرتبطة بحسابك.');
          }
        }
      } catch (err) {
        if (!cancelled) {
          setOrganizationError('تعذر تحميل بيانات الجهه. يرجى المحاولة مرة أخرى.');
        }
      } finally {
        if (!cancelled) {
          setIsLoadingOrganization(false);
        }
      }
    }

    function loadProjectManagerOrganizations() {
      setIsLoadingOrganization(true);
      setOrganizationError(eligibleOrganizationsError);
      if (eligibleOrganizationsError) {
        setIsLoadingOrganization(false);
        return;
      }

      if (!cancelled) {
        const options = eligibleOrganizations.map((org) => ({
          id: org.id,
          name: org.name,
          quota: { remaining: org.quota.remaining },
        }));
        setOrganizationOptions(options);
        if (options.length > 0) {
          setFormData((prev) => ({
            ...prev,
            organizationId: prev.organizationId || options[0].id,
          }));
        } else {
          setOrganizationError('لا توجد جهات مؤهلة لإنشاء مشروع حالياً.');
        }
        setIsLoadingOrganization(false);
      }
    }

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

    if (isEntityManager) {
      loadOrganization();
    } else if (isProjectManager) {
      loadProjectManagerOrganizations();
    } else {
      setIsLoadingOrganization(false);
    }

    loadFundingAreas();

    return () => {
      cancelled = true;
    };
  }, [isEntityManager, isProjectManager, eligibleOrganizations, eligibleOrganizationsError]);

  const isEligible = isProjectManager
    ? organizationOptions.length > 0 && !!formData.organizationId
    : Boolean(eligibility?.canCreate ?? eligibility?.allowed);
  const effectiveEligibilityReason = eligibilityReason || createErrorReason;
  const showPricingCta =
    effectiveEligibilityReason === 'NO_ACTIVE_SUBSCRIPTION' ||
    effectiveEligibilityReason === 'PROJECT_LIMIT_REACHED';
  const formDisabled =
    isLoading ||
    (isEntityManager && isLoadingEligibility) ||
    (isProjectManager && isLoadingEligibleOrganizations) ||
    !!organizationError ||
    !isEligible;

  useEffect(() => {
    if (
      isEntityManager &&
      !isLoadingEligibility &&
      !isEligible &&
      eligibilityError &&
      !eligibilityToastShown
    ) {
      toast.error(eligibilityError);
      setEligibilityToastShown(true);
    }
  }, [isEntityManager, isLoadingEligibility, isEligible, eligibilityError, eligibilityToastShown]);

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    clearFieldError(field);
    setLocalFieldErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
    if (error) clearError();
  };

  const toggleFundingArea = (areaId: string) => {
    setFormData((prev) => {
      const nextAreas = prev.fundingAreaIds.includes(areaId)
        ? prev.fundingAreaIds.filter((id) => id !== areaId)
        : [...prev.fundingAreaIds, areaId];
      return { ...prev, fundingAreaIds: nextAreas };
    });
    clearFieldError('fundingAreaIds');
    setLocalFieldErrors((prev) => {
      const next = { ...prev };
      delete next.fundingAreaIds;
      return next;
    });
    if (error) clearError();
  };

  function getFieldError(field: string): string | undefined {
    return localFieldErrors[field] || fieldErrors[field];
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

    return errors;
  }

  const handleSubmit = async () => {
    clearError();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setLocalFieldErrors(validationErrors);
      return;
    }
    setLocalFieldErrors({});

    const dto: CreateProjectDto = {
      name: formData.name,
      description: formData.description,
      budget: Number(formData.budget) || 0,
      currencyCode: formData.currencyCode,
      startDate: formData.startDate,
      endDate: formData.endDate,
      beneficiaries: formData.beneficiaries,
      beneficiariesCount: Number(formData.beneficiariesCount) || 0,
      geographicScope: formData.geographicScope,
      managerId: user?.id || '',
      organizationId: formData.organizationId,
      fundingAreaIds: formData.fundingAreaIds,
    };

    try {
      setCreateErrorReason(null);
      const response = await create(dto);
      const createdId = response.data?.id;

      if (createdId) {
        navigate(`/dashboard/project-management/details/${createdId}`);
      } else {
        toast.warning('تم إنشاء المشروع بنجاح ولكن لا يمكن فتح تفاصيله حالياً.');
        navigate('/dashboard/project-management/list');
      }
    } catch (err: any) {
      const specificErrorCode = err?.code || err?.data?.code || err?.response?.data?.code || errorCode;
      if (specificErrorCode === 'NO_ACTIVE_SUBSCRIPTION' || specificErrorCode === 'PROJECT_LIMIT_REACHED') {
        setCreateErrorReason(specificErrorCode);
      }
      // Errors are already surfaced by the hook. If no field errors exist, toast the global error.
      if (error && Object.keys(fieldErrors).length === 0) {
        toast.error(error);
      }
    }
  };

  if (isEntityManager && isLoadingEligibility) {
    return (
      <div className="min-h-full bg-gray-50 p-6 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-gray-600">جارٍ التحقق من إمكانية إنشاء المشاريع...</p>
        </div>
      </div>
    );
  }

  if (isProjectManager && isLoadingEligibleOrganizations) {
    return (
      <div className="min-h-full bg-gray-50 p-6 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-gray-600">جارٍ تحميل الجهات المؤهلة...</p>
        </div>
      </div>
    );
  }

  const eligibilityBannerMessage =
    (isEntityManager ? eligibilityError : eligibleOrganizationsError) || error || null;

  return (
    <div className="min-h-full bg-gray-50 p-6">
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate('/dashboard/project-management/list')}
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 mb-4"
          >
            <ChevronRight className="w-5 h-5" />
            رجوع إلى قائمة المشاريع
          </button>
          <h1 className="text-3xl font-bold mb-2">إنشاء مشروع جديد</h1>
          <p className="text-gray-600">املأ التفاصيل الأساسية للمشروع</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            {eligibilityBannerMessage && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {eligibilityBannerMessage}
                {showPricingCta && (
                  <p className="mt-2">
                    اختر باقتك واشترك الآن{" "}
                    <button
                      type="button"
                      onClick={() => navigate('/dashboard/pricing')}
                      className="font-medium underline hover:no-underline text-blue-600"
                    >
                      من هنا
                    </button>
                    .
                  </p>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">الجهة *</label>
              {organizationError && <p className="text-red-600 text-sm mb-1">{organizationError}</p>}
              {isLoadingOrganization ? (
                <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500">
                  جاري تحميل الجهات...
                </div>
              ) : (
                <select
                  value={formData.organizationId}
                  onChange={(e) => updateField('organizationId', e.target.value)}
                  disabled={formDisabled || organizationOptions.length === 0}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                >
                  {organizationOptions.map((org) => (
                    <option key={org.id} value={org.id}>
                      {org.name}
                      {isProjectManager && org.quota !== undefined
                        ? ` (متبقي ${org.quota.remaining})`
                        : ''}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">اسم المشروع *</label>
              {getFieldError('name') && <p className="text-red-600 text-sm mb-1">{getFieldError('name')}</p>}
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                disabled={formDisabled}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                placeholder="مثال: برنامج الأسر المنتجة"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">مجالات المشاريع *</label>
              {getFieldError('fundingAreaIds') && <p className="text-red-600 text-sm mb-1">{getFieldError('fundingAreaIds')}</p>}
              {isLoadingFundingAreas ? (
                <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500">
                  جاري تحميل مجالات المشاريع...
                </div>
              ) : visibleFundingAreas.length === 0 ? (
                <p className="text-sm text-gray-500">لا توجد مجالات مشاريع متاحة حالياً.</p>
              ) : (
                <MultiSelect
                  options={visibleFundingAreas.map((area) => ({ value: area.id, label: area.name }))}
                  selected={formData.fundingAreaIds}
                  onChange={(next) => {
                    setFormData((prev) => ({ ...prev, fundingAreaIds: next }));
                    clearFieldError('fundingAreaIds');
                    setLocalFieldErrors((prev) => {
                      const nextErrors = { ...prev };
                      delete nextErrors.fundingAreaIds;
                      return nextErrors;
                    });
                    if (error) clearError();
                  }}
                  placeholder="اختر مجالات المشاريع"
                  searchPlaceholder="ابحث في مجالات المشاريع..."
                  emptyMessage="لا توجد نتائج مطابقة"
                  disabled={formDisabled}
                  error={!!getFieldError('fundingAreaIds')}
                  className="min-h-[46px]"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">وصف المشروع *</label>
              {getFieldError('description') && <p className="text-red-600 text-sm mb-1">{getFieldError('description')}</p>}
              <textarea
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                rows={4}
                disabled={formDisabled}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
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
                  disabled={formDisabled}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
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
                  disabled={formDisabled}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
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
                  disabled={formDisabled}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
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
                  disabled={formDisabled}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                  placeholder="مثال: الرياض"
                />
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
                    disabled={formDisabled}
                    className="w-full bg-transparent outline-none text-sm text-gray-900 cursor-pointer disabled:cursor-not-allowed disabled:text-gray-500"
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
                    disabled={formDisabled}
                    className="w-full bg-transparent outline-none text-sm text-gray-900 cursor-pointer disabled:cursor-not-allowed disabled:text-gray-500"
                  />
                </div>
              </div>
              {(fieldErrors.startDate || fieldErrors.endDate) && (
                <p className="text-red-600 text-sm mt-1">{fieldErrors.startDate || fieldErrors.endDate}</p>
              )}
              {durationDays !== null && (
                <p className="text-gray-500 text-xs mt-2">مدة المشروع: {durationDays} يوم</p>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
                {showPricingCta && (
                  <p className="mt-2">
                    اختر باقتك واشترك الآن{" "}
                    <button
                      type="button"
                      onClick={() => navigate('/dashboard/pricing')}
                      className="font-medium underline hover:no-underline text-blue-600"
                    >
                      من هنا
                    </button>
                    .
                  </p>
                )}
              </div>
            )}

            <div className="flex items-center justify-between pt-6 border-t">
              <button
                type="button"
                onClick={() => navigate('/dashboard/project-management/list')}
                className="px-6 py-3 text-gray-600 hover:text-gray-900 font-medium"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={formDisabled}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isLoading ? 'جاري الإنشاء...' : 'إنشاء المشروع'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

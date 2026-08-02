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
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
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
  const [organizationOptions, setOrganizationOptions] = useState<{ id: string; name: string; ownerId?: string; quota?: { remaining: number } }[]>([]);
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
            setOrganizationOptions([{ id: org.id, name: org.name, ownerId: org.ownerId }]);
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
          ownerId: org.ownerId,
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
  const inputsDisabled =
    isLoading ||
    (isEntityManager && (isLoadingEligibility || !isEligible)) ||
    (isProjectManager && isLoadingEligibleOrganizations);
  const submitDisabled =
    isLoading ||
    (isEntityManager && (isLoadingEligibility || !isEligible)) ||
    (isProjectManager && (!formData.organizationId || organizationOptions.length === 0));

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

    const selectedOrg = organizationOptions.find((org) => org.id === formData.organizationId);
    const ownerId = selectedOrg?.ownerId || '';

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
      creatorId: user?.id || '',
      ownerId,
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
      <div className="min-h-full bg-background p-[var(--spacing-card-padding)] sm:p-[var(--spacing-card-padding)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-[var(--spacing-grid-gap)]">
          <Loader2 className="w-8 h-8 text-[var(--secondary)] animate-spin" />
          <p className="text-muted-foreground">جارٍ التحقق من إمكانية إنشاء المشاريع...</p>
        </div>
      </div>
    );
  }

  if (isProjectManager && isLoadingEligibleOrganizations) {
    return (
      <div className="min-h-full bg-background p-[var(--spacing-card-padding)] sm:p-[var(--spacing-card-padding)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-[var(--spacing-grid-gap)]">
          <Loader2 className="w-8 h-8 text-[var(--secondary)] animate-spin" />
          <p className="text-muted-foreground">جارٍ تحميل الجهات المؤهلة...</p>
        </div>
      </div>
    );
  }

  const eligibilityBannerMessage =
    (isEntityManager ? eligibilityError : null) || error || null;
  const projectManagerOrgError = isProjectManager ? eligibleOrganizationsError : null;

  return (
    <div className="min-h-full bg-background p-[var(--spacing-card-padding)] sm:p-[var(--spacing-card-padding)]">
      <div className="space-y-[var(--spacing-section-gap)] sm:space-y-[var(--spacing-section-gap)] max-w-4xl mx-auto">
        <div className="mb-4 sm:mb-6">
          <button
            onClick={() => navigate('/dashboard/project-management/list')}
            className="text-[var(--secondary)] hover:text-[var(--secondary)] font-medium flex items-center gap-[var(--spacing-small-gap)] mb-3 sm:mb-4 text-sm sm:text-base"
          >
            <ChevronRight className="w-4 sm:w-5 h-4 sm:h-5" />
            رجوع إلى قائمة المشاريع
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">إنشاء مشروع جديد</h1>
          <p className="text-muted-foreground text-sm sm:text-base">املأ التفاصيل الأساسية للمشروع</p>
        </div>

        <div className="bg-card rounded-xl border border-border shadow-sm p-[var(--spacing-card-padding)] sm:p-8">
          <form className="space-y-[var(--spacing-section-gap)]" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            {eligibilityBannerMessage && (
              <div className="bg-[var(--destructive)]/[0.08] border border-[var(--destructive)]/[0.3] text-[var(--destructive)] px-4 py-3 rounded-lg">
                {eligibilityBannerMessage}
                {showPricingCta && (
                  <p className="mt-2">
                    اختر باقتك واشترك الآن{" "}
                    <button
                      type="button"
                      onClick={() => navigate('/dashboard/pricing')}
                      className="font-medium underline hover:no-underline text-[var(--secondary)]"
                    >
                      من هنا
                    </button>
                    .
                  </p>
                )}
              </div>
            )}

            {isProjectManager && (
              <div>
                <label className="block text-sm font-medium mb-2">الجهة *</label>
                {projectManagerOrgError && (
                  <p className="text-[var(--destructive)] text-sm mb-1">{projectManagerOrgError}</p>
                )}
                {organizationError && (
                  <p className="text-[var(--destructive)] text-sm mb-1">{organizationError}</p>
                )}
                {isLoadingOrganization ? (
                  <div className="w-full px-4 py-3 border border-border rounded-lg bg-secondary text-muted-foreground">
                    جاري تحميل الجهات...
                  </div>
                ) : (
                  <Select
                    value={formData.organizationId}
                    onValueChange={(value) => updateField('organizationId', value)}
                    disabled={inputsDisabled || organizationOptions.length === 0}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="اختر الجهة" />
                    </SelectTrigger>
                    <SelectContent>
                      {organizationOptions.map((org) => (
                        <SelectItem key={org.id} value={org.id}>
                          {org.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">اسم المشروع *</label>
              {getFieldError('name') && <p className="text-[var(--destructive)] text-sm mb-1">{getFieldError('name')}</p>}
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                disabled={inputsDisabled}
                placeholder="مثال: برنامج الأسر المنتجة"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">مجالات المشاريع *</label>
              {getFieldError('fundingAreaIds') && <p className="text-[var(--destructive)] text-sm mb-1">{getFieldError('fundingAreaIds')}</p>}
              {isLoadingFundingAreas ? (
                <div className="w-full px-4 py-3 border border-border rounded-lg bg-secondary text-muted-foreground">
                  جاري تحميل مجالات المشاريع...
                </div>
              ) : fundingAreas.length === 0 ? (
                <p className="text-sm text-muted-foreground">لا توجد مجالات مشاريع متاحة حالياً.</p>
              ) : (
                <MultiSelect
                  options={fundingAreas.map((area) => ({ value: area.id, label: area.name }))}
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
                  disabled={inputsDisabled}
                  error={!!getFieldError('fundingAreaIds')}
                  className="min-h-[46px]"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">وصف المشروع *</label>
              {getFieldError('description') && <p className="text-[var(--destructive)] text-sm mb-1">{getFieldError('description')}</p>}
              <Textarea
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                rows={4}
                disabled={inputsDisabled}
                placeholder="اكتب وصفاً تفصيلياً للمشروع..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--spacing-grid-gap)]">
              <div>
                <label className="block text-sm font-medium mb-2">الميزانية التقديرية (ر.س) *</label>
                {getFieldError('budget') && <p className="text-[var(--destructive)] text-sm mb-1">{getFieldError('budget')}</p>}
                <Input
                  type="number"
                  value={formData.budget}
                  onChange={(e) => updateField('budget', e.target.value)}
                  disabled={inputsDisabled}
                  placeholder="250000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">الفئة المستفيدة *</label>
                {getFieldError('beneficiaries') && <p className="text-[var(--destructive)] text-sm mb-1">{getFieldError('beneficiaries')}</p>}
                <Input
                  type="text"
                  value={formData.beneficiaries}
                  onChange={(e) => updateField('beneficiaries', e.target.value)}
                  disabled={inputsDisabled}
                  placeholder="مثال: الأسر المحتاجة"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--spacing-grid-gap)]">
              <div>
                <label className="block text-sm font-medium mb-2">عدد المستفيدين *</label>
                {getFieldError('beneficiariesCount') && <p className="text-[var(--destructive)] text-sm mb-1">{getFieldError('beneficiariesCount')}</p>}
                <Input
                  type="number"
                  min="0"
                  step="1"
                  value={formData.beneficiariesCount}
                  onChange={(e) => updateField('beneficiariesCount', e.target.value)}
                  disabled={inputsDisabled}
                  placeholder="مثال: 500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">النطاق الجغرافي *</label>
                {getFieldError('geographicScope') && <p className="text-[var(--destructive)] text-sm mb-1">{getFieldError('geographicScope')}</p>}
                <Input
                  type="text"
                  value={formData.geographicScope}
                  onChange={(e) => updateField('geographicScope', e.target.value)}
                  disabled={inputsDisabled}
                  placeholder="مثال: الرياض"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">فترة المشروع *</label>
              {(getFieldError('startDate') || getFieldError('endDate')) && (
                <p className="text-[var(--destructive)] text-sm mb-1">{getFieldError('startDate') || getFieldError('endDate')}</p>
              )}
              <div className={`flex items-stretch border rounded-lg overflow-hidden ${(getFieldError('startDate') || getFieldError('endDate')) ? 'border-red-500 bg-[var(--destructive)]/[0.08]' : 'border-border focus-within:ring-2 focus-within:ring-ring'}`}>
                <div
                  className="flex-1 flex flex-col px-4 py-2 cursor-pointer"
                  onClick={() => startDateRef.current?.showPicker?.()}
                >
                  <span className="text-xs text-muted-foreground mb-0.5">من</span>
                  <input
                    ref={startDateRef}
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => updateField('startDate', e.target.value)}
                    disabled={inputsDisabled}
                    className="w-full bg-transparent outline-none text-sm text-foreground cursor-pointer disabled:cursor-not-allowed disabled:text-muted-foreground"
                  />
                </div>
                <div className="w-px bg-muted self-stretch my-2" />
                <div
                  className="flex-1 flex flex-col px-4 py-2 cursor-pointer"
                  onClick={() => endDateRef.current?.showPicker?.()}
                >
                  <span className="text-xs text-muted-foreground mb-0.5">إلى</span>
                  <input
                    ref={endDateRef}
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => updateField('endDate', e.target.value)}
                    disabled={inputsDisabled}
                    className="w-full bg-transparent outline-none text-sm text-foreground cursor-pointer disabled:cursor-not-allowed disabled:text-muted-foreground"
                  />
                </div>
              </div>
              {(fieldErrors.startDate || fieldErrors.endDate) && (
                <p className="text-[var(--destructive)] text-sm mt-1">{fieldErrors.startDate || fieldErrors.endDate}</p>
              )}
              {durationDays !== null && (
                <p className="text-muted-foreground text-xs mt-2">مدة المشروع: {durationDays} يوم</p>
              )}
            </div>

            {error && (
              <div className="bg-[var(--destructive)]/[0.08] border border-[var(--destructive)]/[0.3] text-[var(--destructive)] px-4 py-3 rounded-lg">
                {error}
                {showPricingCta && (
                  <p className="mt-2">
                    اختر باقتك واشترك الآن{" "}
                    <button
                      type="button"
                      onClick={() => navigate('/dashboard/pricing')}
                      className="font-medium underline hover:no-underline text-[var(--secondary)]"
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
                className="px-6 py-3 text-muted-foreground hover:text-foreground font-medium"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={submitDisabled}
                className="px-6 py-3 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg hover:bg-[var(--primary)]/90 disabled:bg-[var(--primary)]/[0.6] disabled:cursor-not-allowed transition-colors font-medium"
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

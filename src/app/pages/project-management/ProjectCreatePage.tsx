import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { ChevronRight } from 'lucide-react';
import { useProjectCreate } from '@/api/hooks/useProjectCreate';
import { CreateProjectDto } from '@/api/services/project-service';
import { onboardingService } from '@/api/services/onboarding-service';
import type { FundingArea } from '@/api/services/onboarding-service';
import { useAuth } from '@/app/layouts/RootLayout';
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

export function ProjectCreatePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { create, isLoading, error, fieldErrors, clearFieldError, clearError } = useProjectCreate();
  const [organizationOptions, setOrganizationOptions] = useState<{ id: string; name: string }[]>([]);
  const [isLoadingOrganization, setIsLoadingOrganization] = useState(true);
  const [organizationError, setOrganizationError] = useState<string | null>(null);
  const [fundingAreas, setFundingAreas] = useState<FundingArea[]>([]);
  const [isLoadingFundingAreas, setIsLoadingFundingAreas] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    fundingAreaIds: [] as string[],
    organizationId: '',
    description: '',
    beneficiaries: '',
    geographicScope: '',
    budget: '',
    currencyCode: 'SAR',
    startDate: '',
    endDate: '',
  });

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

    loadOrganization();
    loadFundingAreas();

    return () => {
      cancelled = true;
    };
  }, []);

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    clearFieldError(field);
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
    if (error) clearError();
  };

  const durationDays = daysBetween(formData.startDate, formData.endDate);

  const handleSubmit = async () => {
    const dto: CreateProjectDto = {
      name: formData.name,
      description: formData.description,
      budget: Number(formData.budget) || 0,
      currencyCode: formData.currencyCode,
      startDate: formData.startDate,
      endDate: formData.endDate,
      beneficiaries: formData.beneficiaries,
      geographicScope: formData.geographicScope,
      managerId: user?.id || '',
      organizationId: formData.organizationId,
      fundingAreaIds: formData.fundingAreaIds,
    };

    try {
      const response = await create(dto);
      const createdId = response.data?.id;

      if (createdId) {
        navigate(`/dashboard/project-management/details/${createdId}`);
      } else {
        toast.warning('تم إنشاء المشروع بنجاح ولكن لا يمكن فتح تفاصيله حالياً.');
        navigate('/dashboard/project-management/list');
      }
    } catch {
      // Errors are already surfaced by the hook. If no field errors exist, toast the global error.
      if (error && Object.keys(fieldErrors).length === 0) {
        toast.error(error);
      }
    }
  };

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
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">اسم المشروع *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="مثال: برنامج الأسر المنتجة"
              />
              {fieldErrors.name && <p className="text-red-600 text-sm mt-1">{fieldErrors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">مجالات العمل *</label>
              {isLoadingFundingAreas ? (
                <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500">
                  جاري تحميل مجالات العمل...
                </div>
              ) : fundingAreas.length === 0 ? (
                <p className="text-sm text-gray-500">لا توجد مجالات عمل متاحة حالياً.</p>
              ) : (
                <div className={`grid grid-cols-2 md:grid-cols-3 gap-3 p-2 rounded-lg border ${fieldErrors.fundingAreaIds ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}>
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
              {fieldErrors.fundingAreaIds && <p className="text-red-600 text-sm mt-1">{fieldErrors.fundingAreaIds}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">وصف المشروع *</label>
              <textarea
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="اكتب وصفاً تفصيلياً للمشروع..."
              />
              {fieldErrors.description && <p className="text-red-600 text-sm mt-1">{fieldErrors.description}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">الميزانية التقديرية (ر.س) *</label>
                <input
                  type="number"
                  value={formData.budget}
                  onChange={(e) => updateField('budget', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="250000"
                />
                {fieldErrors.budget && <p className="text-red-600 text-sm mt-1">{fieldErrors.budget}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">الفئة المستفيدة *</label>
                <input
                  type="text"
                  value={formData.beneficiaries}
                  onChange={(e) => updateField('beneficiaries', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="مثال: الأسر المحتاجة"
                />
                {fieldErrors.beneficiaries && <p className="text-red-600 text-sm mt-1">{fieldErrors.beneficiaries}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">النطاق الجغرافي *</label>
                <input
                  type="text"
                  value={formData.geographicScope}
                  onChange={(e) => updateField('geographicScope', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="مثال: الرياض"
                />
                {fieldErrors.geographicScope && <p className="text-red-600 text-sm mt-1">{fieldErrors.geographicScope}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">فترة المشروع *</label>
              <div className={`flex items-stretch border rounded-lg overflow-hidden ${fieldErrors.startDate || fieldErrors.endDate ? 'border-red-500 bg-red-50' : 'border-gray-300 focus-within:ring-2 focus-within:ring-blue-500'}`}>
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
              {(fieldErrors.startDate || fieldErrors.endDate) && (
                <p className="text-red-600 text-sm mt-1">{fieldErrors.startDate || fieldErrors.endDate}</p>
              )}
              {durationDays !== null && (
                <p className="text-gray-500 text-xs mt-2">مدة المشروع: {durationDays} يوم</p>
              )}
            </div>

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
                disabled={isLoading || isLoadingOrganization || !!organizationError}
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

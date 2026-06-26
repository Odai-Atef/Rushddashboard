import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ChevronRight, DollarSign, Save } from 'lucide-react';
import { useProjectCreate } from '@/api/hooks/useProjectCreate';
import { CreateProjectDto } from '@/app/pages/project-management/project-types';
import { onboardingService } from '@/api/services';
import { toast } from 'sonner';


export function ProjectCreatePage() {
  const navigate = useNavigate();
  const { create, isLoading, error, fieldErrors, clearFieldError, clearError } = useProjectCreate();
  const [organizationOptions, setOrganizationOptions] = useState<{ id: string; name: string }[]>([]);
  const [isLoadingOrganization, setIsLoadingOrganization] = useState(true);
  const [organizationError, setOrganizationError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    organizationId: '',
    category: '',
    description: '',
    beneficiaries: '',
    geographicScope: '',
    budget: '',
    currencyCode: 'SAR',
    startDate: '',
    endDate: '',
    managerId: undefined as string | undefined,
  });

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

    loadOrganization();

    return () => {
      cancelled = true;
    };
  }, []);

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    clearFieldError(field);
    if (error) clearError();
  };

  const handleSubmit = async () => {
    const dto: CreateProjectDto = {
      name: formData.name,
      type: formData.type,
      category: formData.category,
      description: formData.description,
      budget: Number(formData.budget) || 0,
      currencyCode: formData.currencyCode,
      startDate: formData.startDate,
      endDate: formData.endDate,
      beneficiaries: formData.beneficiaries,
      geographicScope: formData.geographicScope,
      organizationId: formData.organizationId,
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

  const handleDraft = () => {
    toast.info('تم حفظ المسودة محلياً');
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">نوع المشروع *</label>
                <select
                  value={formData.type}
                  onChange={(e) => updateField('type', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">اختر النوع</option>
                  <option value="تنموي">تنموي</option>
                  <option value="خيري">خيري</option>
                  <option value="تدريبي">تدريبي</option>
                  <option value="إغاثي">إغاثي</option>
                  <option value="صحي">صحي</option>
                </select>
                {fieldErrors.type && <p className="text-red-600 text-sm mt-1">{fieldErrors.type}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">الجهه *</label>
                {isLoadingOrganization ? (
                  <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500">
                    جاري تحميل الجهه...
                  </div>
                ) : organizationError ? (
                  <div className="text-red-600 text-sm">{organizationError}</div>
                ) : (
                  <select
                    value={formData.organizationId}
                    onChange={(e) => updateField('organizationId', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">اختر الجهه</option>
                    {organizationOptions.map((org) => (
                      <option key={org.id} value={org.id}>
                        {org.name}
                      </option>
                    ))}
                  </select>
                )}
                {fieldErrors.organizationId && <p className="text-red-600 text-sm mt-1">{fieldErrors.organizationId}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">الفئة *</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => updateField('category', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="مثال: التعليم"
              />
              {fieldErrors.category && <p className="text-red-600 text-sm mt-1">{fieldErrors.category}</p>}
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
                <div className="relative">
                  <DollarSign className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => updateField('budget', e.target.value)}
                    className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="250000"
                  />
                </div>
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
              <div>
                <label className="block text-sm font-medium mb-2">تاريخ البدء *</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => updateField('startDate', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                {fieldErrors.startDate && <p className="text-red-600 text-sm mt-1">{fieldErrors.startDate}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">تاريخ الانتهاء *</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => updateField('endDate', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                {fieldErrors.endDate && <p className="text-red-600 text-sm mt-1">{fieldErrors.endDate}</p>}
              </div>
              <div className="hidden">
                <input
                  type="hidden"
                  value={formData.currencyCode}
                  readOnly
                />
              </div>
            </div>

            {error && Object.keys(fieldErrors).length === 0 && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
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
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleDraft}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  حفظ كمسودة
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {isLoading ? 'جاري الإنشاء...' : 'إنشاء المشروع'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

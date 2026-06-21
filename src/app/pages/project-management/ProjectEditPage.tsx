import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ChevronRight, DollarSign, Save } from 'lucide-react';
import { useProjectDetails } from '@/api/hooks/useProjectDetails';
import { ProjectNotFound } from './ProjectNotFound';
import { RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

const MANAGER_OPTIONS = [
  { id: 'manager-1', name: 'أحمد محمد' },
  { id: 'manager-2', name: 'سارة عبدالله' },
  { id: 'manager-3', name: 'خالد العلي' },
];

export function ProjectEditPage() {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const { project, isLoading: isLoadingProject, error, refetch } = useProjectDetails(projectId);
  const [isSaving, setIsSaving] = useState(false);
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
    managerId: '',
  });

  useEffect(() => {
    if (!project) return;
    setFormData({
      name: project.name || '',
      type: project.type || '',
      organizationId: project.organizationId || '',
      category: project.category || '',
      description: project.description || '',
      beneficiaries: project.beneficiaries || '',
      geographicScope: project.geographicScope || '',
      budget: typeof project.budget === 'number' ? String(project.budget) : '',
      currencyCode: project.currencyCode || 'SAR',
      startDate: project.startDate || '',
      endDate: project.endDate || '',
      managerId: project.managerId || '',
    });
  }, [project]);

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      // TODO: Replace with actual update API call once backend endpoint is available.
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success('تم حفظ التعديلات بنجاح');
      navigate(`/dashboard/project-management/details/${projectId}`);
    } catch {
      toast.error('تعذر حفظ التعديلات. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSaving(false);
    }
  };

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
            <div>
              <label className="block text-sm font-medium mb-2">اسم المشروع *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="مثال: برنامج الأسر المنتجة"
              />
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
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">المؤسسة *</label>
                <input
                  type="text"
                  value={formData.organizationId}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">الفئة *</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => updateField('category', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="مثال: التعليم"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">مدير المشروع *</label>
                <select
                  value={formData.managerId}
                  onChange={(e) => updateField('managerId', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">اختر المدير</option>
                  {MANAGER_OPTIONS.map((manager) => (
                    <option key={manager.id} value={manager.id}>
                      {manager.name}
                    </option>
                  ))}
                </select>
              </div>
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
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">تاريخ البدء *</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => updateField('startDate', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
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
              </div>
              <div className="hidden">
                <input
                  type="hidden"
                  value={formData.currencyCode}
                  readOnly
                />
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
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  {isSaving ? 'جاري الحفظ...' : 'حفظ التعديلات'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProjectEditPage;

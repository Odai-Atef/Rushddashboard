import { useNavigate } from 'react-router';
import { ChevronRight, BarChart3 } from 'lucide-react';

export function ProjectReportingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-full bg-gray-50 p-6">
      <div className="space-y-6">
        <button
          onClick={() => navigate('/dashboard/project-management')}
          className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 mb-4"
        >
          <ChevronRight className="w-5 h-5" />
          رجوع إلى لوحة القيادة
        </button>
        <h1 className="text-3xl font-bold mb-4">التقارير الإدارية</h1>
        <div className="bg-white rounded-xl p-8 border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-xl font-bold">تقارير تنفيذية شاملة</p>
          </div>
          <p className="text-gray-600 text-center">تقارير تنفيذية شاملة - قريباً</p>
        </div>
      </div>
    </div>
  );
}

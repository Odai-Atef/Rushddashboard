import { useNavigate } from 'react-router';
import { AlertCircle, ArrowRight } from 'lucide-react';

export function ProjectNotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-full bg-gray-50 p-6 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-sm border border-red-200 p-8 max-w-md w-full text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h1 className="text-xl font-bold mb-2">المشروع غير موجود</h1>
        <p className="text-gray-600 mb-6">
          لم يتم العثور على المشروع المطلوب. ربما تم حذفه أو أن الرابط غير صحيح.
        </p>
        <button
          onClick={() => navigate('/dashboard/project-management/list')}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2 mx-auto"
        >
          <span>العودة إلى قائمة المشاريع</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

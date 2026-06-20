import { useNavigate, useParams } from 'react-router';
import { ChevronRight, GitBranch } from 'lucide-react';
import { findProjectById } from './project-data';
import { ProjectNotFound } from './ProjectNotFound';

export function ProjectLifecyclePage() {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const selectedProject = findProjectById(projectId);

  if (!selectedProject) {
    return <ProjectNotFound />;
  }

  return (
    <div className="min-h-full bg-gray-50 p-6">
      <div className="space-y-6">
        <button
          onClick={() => navigate(`/dashboard/project-management/details/${selectedProject.id}`)}
          className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 mb-4"
        >
          <ChevronRight className="w-5 h-5" />
          رجوع إلى تفاصيل المشروع
        </button>
        <h1 className="text-3xl font-bold mb-4">دورة حياة المشروع</h1>
        <div className="bg-white rounded-xl p-8 border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <GitBranch className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">المشروع</p>
              <p className="text-xl font-bold">{selectedProject.name}</p>
            </div>
          </div>
          <p className="text-gray-600 text-center">14 مرحلة من مسودة إلى مغلق - قريباً</p>
        </div>
      </div>
    </div>
  );
}

import { useNavigate, useParams } from 'react-router';
import {
  ChevronRight,
  Edit,
  Building2,
  User,
  MapPin,
  GitBranch,
  History,
  Activity,
} from 'lucide-react';
import { findProjectById } from './project-data';
import { ProjectNotFound } from './ProjectNotFound';
import { healthConfig, statusConfig } from './project-types';

export function ProjectDetailsPage() {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const selectedProject = findProjectById(projectId);

  if (!selectedProject) {
    return <ProjectNotFound />;
  }

  const health = healthConfig[selectedProject.health];
  const HealthIcon = health.icon;
  const status = statusConfig[selectedProject.status];

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
              <h1 className="text-3xl font-bold mb-2">{selectedProject.name}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Building2 className="w-4 h-4" />
                  {selectedProject.organization}
                </span>
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {selectedProject.manager}
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                <Edit className="w-5 h-5" />
                تعديل
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
            <p className="text-sm text-gray-600 mb-2">صحة المشروع</p>
            <div className="flex items-center gap-2">
              <HealthIcon className="w-5 h-5" style={{ color: health.color }} />
              <span className="font-medium" style={{ color: health.color }}>{health.label}</span>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <p className="text-sm text-gray-600 mb-2">نسبة الإنجاز</p>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600"
                  style={{ width: `${selectedProject.progress}%` }}
                ></div>
              </div>
              <span className="text-2xl font-bold text-blue-600">{selectedProject.progress}%</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="text-xl font-semibold mb-4">نظرة عامة</h2>
              <p className="text-gray-700 leading-relaxed">{selectedProject.description}</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="text-xl font-semibold mb-4">معلومات المشروع</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">نوع المشروع</p>
                  <p className="font-medium">{selectedProject.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">التصنيف</p>
                  <p className="font-medium">{selectedProject.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">الفئة المستهدفة</p>
                  <p className="font-medium">{selectedProject.beneficiaries}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">النطاق الجغرافي</p>
                  <p className="font-medium flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    {selectedProject.geographicScope}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="text-xl font-semibold mb-4">ملخص الميزانية</h2>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-600">إجمالي الميزانية</span>
                <span className="text-2xl font-bold text-gray-900">{selectedProject.budget.toLocaleString('ar-SA')} ر.س</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="font-semibold mb-4">إجراءات سريعة</h3>
              <div className="space-y-2">
                <button
                  onClick={() => navigate(`/dashboard/project-management/lifecycle/${selectedProject.id}`)}
                  className="w-full px-4 py-3 text-right border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3"
                >
                  <GitBranch className="w-5 h-5 text-gray-400" />
                  <span>عرض دورة الحياة</span>
                </button>
                <button
                  onClick={() => navigate(`/dashboard/project-management/versions/${selectedProject.id}`)}
                  className="w-full px-4 py-3 text-right border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3"
                >
                  <History className="w-5 h-5 text-gray-400" />
                  <span>الإصدارات</span>
                </button>
                <button
                  onClick={() => navigate(`/dashboard/project-management/activity/${selectedProject.id}`)}
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
                {[
                  { name: selectedProject.manager, role: 'مدير المشروع' },
                  { name: 'محمد أحمد', role: 'مسؤول مالي' },
                  { name: 'نورة خالد', role: 'ممثل الجمعية' },
                ].map((user, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="text-xs text-gray-600">{user.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

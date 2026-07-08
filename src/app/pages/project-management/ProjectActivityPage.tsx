import { useNavigate, useParams } from 'react-router';
import {
  ChevronRight,
  Activity,
  Loader2,
  RotateCcw,
  Clock,
  User,
  FileText,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { useProjectDetails } from '@/api/hooks/useProjectDetails';
import { useProjectLifecycle } from '@/api/hooks/useProjectLifecycle';
import { ProjectNotFound } from './ProjectNotFound';
import { statusConfig, ProjectStatus } from './project-types';
import { formatDateTime } from '@/app/lib/formatters';

function formatDuration(ms: number | null): string {
  if (ms === null || ms === undefined) return '-';
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} يوم${days > 1 ? '' : ''}`;
  if (hours > 0) return `${hours} ساعة`;
  if (minutes > 0) return `${minutes} دقيقة`;
  return `${seconds} ثانية`;
}

function getStatusLabel(status: string): string {
  const normalized = status.toLowerCase().replace(/_/g, '-');
  return statusConfig[normalized as ProjectStatus]?.label || status;
}

function getStatusStyle(status: string): { bg: string; color: string } {
  const normalized = status.toLowerCase().replace(/_/g, '-');
  return (
    statusConfig[normalized as ProjectStatus] || {
      label: status,
      color: '#6b7280',
      bg: '#f3f4f6',
    }
  );
}

export function ProjectActivityPage() {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const { project, isLoading: projectLoading, error: projectError, refetch: refetchProject } = useProjectDetails(projectId);
  const { steps, isLoading: lifecycleLoading, error: lifecycleError, refetch: refetchLifecycle } = useProjectLifecycle(projectId);

  const isLoading = projectLoading || lifecycleLoading;
  const error = projectError || lifecycleError;

  if (isLoading) {
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
          onClick={() => {
            refetchProject();
            refetchLifecycle();
          }}
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
      <div className="space-y-6">
        <button
          onClick={() => navigate(`/dashboard/project-management/details/${project.id}`)}
          className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 mb-4"
        >
          <ChevronRight className="w-5 h-5" />
          رجوع إلى تفاصيل المشروع
        </button>
        <h1 className="text-3xl font-bold mb-4">سجل النشاط</h1>
        <div className="bg-white rounded-xl p-8 border border-gray-200">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">المشروع</p>
              <p className="text-xl font-bold">{project.name}</p>
            </div>
          </div>

          {steps.length === 0 ? (
            <div className="text-center py-12 text-gray-500">لا توجد أنشطة مسجلة لهذا المشروع</div>
          ) : (
            <div className="relative">
              <div className="absolute right-6 top-0 bottom-0 w-0.5 bg-gray-200" />
              <div className="space-y-6">
                {steps.map((step, index) => {
                  const style = getStatusStyle(step.status);
                  const isLast = index === steps.length - 1;
                  const isCurrent = step.exitedAt === null;
                  return (
                    <div key={step.id} className="relative flex gap-4 pr-3">
                      <div className="relative z-10 flex-shrink-0 w-6 h-6 mt-1">
                        {isCurrent ? (
                          <div className="w-6 h-6 rounded-full border-2 border-blue-600 bg-white flex items-center justify-center">
                            <div className="w-3 h-3 rounded-full bg-blue-600" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 bg-gray-50 rounded-xl p-5 border border-gray-200">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-3">
                          <div className="flex items-center gap-3">
                            <span
                              className="inline-block px-3 py-1 rounded-full text-xs font-medium"
                              style={{ backgroundColor: style.bg, color: style.color }}
                            >
                              {getStatusLabel(step.status)}
                            </span>
                            {isCurrent && (
                              <span className="text-xs font-medium text-blue-600">الحالة الحالية</span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {formatDuration(step.durationMs)}
                            </span>
                            <span className="flex items-center gap-1">
                              <User className="w-3.5 h-3.5" />
                              {step.changedByUser?.email || step.changedBy}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">تاريخ الدخول</p>
                            <p>{new Date(step.enteredAt).toLocaleString('ar-SA')} ({formatDateTime(step.enteredAt)})</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">تاريخ الخروج</p>
                            <p>{step.exitedAt ? `${new Date(step.exitedAt).toLocaleString('ar-SA')} (${formatDateTime(step.exitedAt)})` : '—'}</p>
                          </div>
                        </div>

                        {step.notes && (
                          <div className="bg-white rounded-lg p-3 border border-gray-200">
                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                              <FileText className="w-3.5 h-3.5" />
                              ملاحظات
                            </div>
                            <p className="text-sm text-gray-700">{step.notes}</p>
                          </div>
                        )}

                        {!isLast && steps[index + 1] && (
                          <div className="hidden md:flex items-center gap-2 mt-3 text-xs text-gray-400">
                            <ArrowRight className="w-3.5 h-3.5 rotate-90" />
                            <span>انتقل إلى {getStatusLabel(steps[index + 1].status)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

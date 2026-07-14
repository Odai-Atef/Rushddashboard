import { useNavigate, useParams } from 'react-router';
import {
  ChevronRight,
  GitBranch,
  Loader2,
  RotateCcw,
  Clock,
  User,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Circle,
} from 'lucide-react';
import { useProjectDetails } from '@/api/hooks/useProjectDetails';
import { useProjectLifecycle } from '@/api/hooks/useProjectLifecycle';
import { ProjectNotFound } from './ProjectNotFound';
import { getDisplayStatus } from './ProjectDetailsPage';
import { statusConfig, ProjectStatus } from './project-types';
import type { ProjectLifecycleStep } from '@/api/services/project-service';

function getStatusLabel(status: string): string {
  const normalized = status.toLowerCase().replace(/_/g, '-');
  return statusConfig[normalized as ProjectStatus]?.label || status;
}

// ─── Phase definitions ───
type PhaseStatus = 'completed' | 'current' | 'pending' | 'stopped';

interface PhaseDef {
  id: number;
  title: string;
  statuses: string[]; // backend statuses that belong to this phase
}

const PHASES: PhaseDef[] = [
  {
    id: 1,
    title: 'بدء المشروع',
    statuses: ['created', 'offer-generated', 'offer-review', 'offer-approved', 'offer-rejected'],
  },
  {
    id: 2,
    title: 'مراجعة الجهة',
    statuses: ['draft', 'pm-approval', 'charity-review', 'charity-decision', 'incubator-modifications', 'charity-approval'],
  },
  {
    id: 3,
    title: 'مرحلة التصميم',
    statuses: ['design-team', 'design-review', 'design-decision', 'design-approved', 'design-rejected'],
  },
  {
    id: 4,
    title: 'التمويل والتنفيذ',
    statuses: ['ready-donor', 'submitted-donor', 'funded', 'execution'],
  },
  {
    id: 5,
    title: 'النهائي',
    statuses: ['completed', 'closed'],
  },
];

// Map a backend status string to its phase id
function getPhaseIdByStatus(status: string): number | null {
  const normalized = status.toLowerCase().replace(/_/g, '-');
  for (const phase of PHASES) {
    if (phase.statuses.includes(normalized)) return phase.id;
  }
  return null;
}

// Determine the overall phase status from its steps
function getPhaseStatus(steps: ProjectLifecycleStep[]): PhaseStatus {
  if (steps.length === 0) return 'pending';

  const hasCurrent = steps.some((s) => s.exitedAt === null);
  const allCompleted = steps.every((s) => s.exitedAt !== null);
  const hasStopped = steps.some(
    (s) =>
      s.status.toLowerCase().includes('rejected') ||
      s.status.toLowerCase().includes('stopped') ||
      s.status.toLowerCase().includes('refused')
  );

  if (hasCurrent) return 'current';
  if (hasStopped) return 'stopped';
  if (allCompleted) return 'completed';
  return 'pending';
}

function getPhaseStatusColor(status: PhaseStatus): { bg: string; border: string; text: string } {
  switch (status) {
    case 'completed':
      return { bg: 'bg-emerald-500', border: 'border-emerald-500', text: 'text-emerald-600' };
    case 'current':
      return { bg: 'bg-blue-500', border: 'border-blue-500', text: 'text-blue-600' };
    case 'stopped':
      return { bg: 'bg-red-500', border: 'border-red-500', text: 'text-red-600' };
    case 'pending':
    default:
      return { bg: 'bg-gray-300', border: 'border-gray-300', text: 'text-gray-400' };
  }
}

function getStepStatusColor(step: ProjectLifecycleStep): { bg: string; border: string; icon: 'completed' | 'current' | 'stopped' | 'pending' } {
  if (step.exitedAt === null) {
    return { bg: 'bg-blue-500', border: 'border-blue-500', icon: 'current' };
  }
  const normalized = step.status.toLowerCase();
  if (normalized.includes('rejected') || normalized.includes('stopped') || normalized.includes('refused')) {
    return { bg: 'bg-red-500', border: 'border-red-500', icon: 'stopped' };
  }
  return { bg: 'bg-emerald-500', border: 'border-emerald-500', icon: 'completed' };
}

function StatusIcon({ type, className }: { type: 'completed' | 'current' | 'stopped' | 'pending'; className?: string }) {
  switch (type) {
    case 'completed':
      return <CheckCircle2 className={className || 'w-4 h-4 text-white'} />;
    case 'current':
      return <div className={className ? className : 'w-3 h-3 rounded-full bg-white'} />;
    case 'stopped':
      return <XCircle className={className || 'w-4 h-4 text-white'} />;
    case 'pending':
      return <Circle className={className || 'w-4 h-4 text-gray-400'} />;
  }
}

export function ProjectLifecyclePage() {
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

  const isDraft = getDisplayStatus(project.status as string) === 'draft';

  // Group steps into phases
  const phaseMap: Record<number, ProjectLifecycleStep[]> = {};
  for (const step of steps) {
    const phaseId = getPhaseIdByStatus(step.status);
    if (phaseId) {
      if (!phaseMap[phaseId]) phaseMap[phaseId] = [];
      phaseMap[phaseId].push(step);
    }
  }

  // Sort steps inside each phase by enteredAt
  for (const id of Object.keys(phaseMap)) {
    phaseMap[Number(id)].sort((a, b) => new Date(a.enteredAt).getTime() - new Date(b.enteredAt).getTime());
  }

  return (
    <div className="min-h-full bg-gray-50 p-6">
      <div className="space-y-6 max-w-4xl mx-auto">
        <button
          onClick={() => navigate(`/dashboard/project-management/details/${project.id}`)}
          className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 mb-4"
        >
          <ChevronRight className="w-5 h-5" />
          رجوع إلى تفاصيل المشروع
        </button>

        <div className="text-center mb-8">
          <h1 className={`text-3xl font-bold text-gray-900 ${isDraft ? 'opacity-50' : ''}`}>
            مسار دورة حياة المشروع
          </h1>
          <p className="text-gray-500 mt-2">يعرض جميع المراحل من البداية حتى الإغلاق</p>
        </div>

        <div className="bg-white rounded-xl p-8 border border-gray-200">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <GitBranch className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">المشروع</p>
              <p className={`text-xl font-bold text-gray-900 ${isDraft ? 'opacity-50' : ''}`}>{project.name}</p>
            </div>
          </div>

          {steps.length === 0 ? (
            <div className="text-center py-12 text-gray-500">لا توجد خطوات مسجلة لدورة حياة هذا المشروع</div>
          ) : (
            <div className="relative">
              {/* Vertical connector line */}
              <div className="absolute right-[27px] top-4 bottom-4 w-0.5 bg-gray-200" />

              <div className="space-y-8">
                {PHASES.map((phase) => {
                  const phaseSteps = phaseMap[phase.id] || [];
                  const phaseStatus = getPhaseStatus(phaseSteps);
                  const colors = getPhaseStatusColor(phaseStatus);
                  const isLastPhase = phase.id === 6;

                  // Build lookup map for API steps in this phase
                  const stepByStatus: Record<string, ProjectLifecycleStep> = {};
                  for (const s of phaseSteps) {
                    stepByStatus[s.status.toLowerCase().replace(/_/g, '-')] = s;
                  }

                  return (
                    <div key={phase.id} className="relative flex gap-6">
                      {/* Phase number node */}
                      <div className="relative z-10 flex-shrink-0">
                        <div
                          className={`w-14 h-14 rounded-full border-2 flex items-center justify-center font-bold text-lg ${colors.border} ${
                            phaseStatus === 'completed' || phaseStatus === 'current' ? colors.bg : 'bg-white'
                          }`}
                        >
                          <span
                            className={
                              phaseStatus === 'completed' || phaseStatus === 'current' ? 'text-white' : colors.text
                            }
                          >
                            {phase.id}
                          </span>
                        </div>
                      </div>

                      {/* Phase content */}
                      <div className="flex-1 pt-2">
                        <h3 className={`font-bold text-lg mb-4 ${colors.text}`}>{phase.title}</h3>

                        <div className="space-y-3">
                          {phase.statuses.map((statusKey) => {
                            const step = stepByStatus[statusKey];
                            const hasStep = !!step;
                            let stepColors: ReturnType<typeof getStepStatusColor>;
                            if (hasStep) {
                              stepColors = getStepStatusColor(step);
                            } else {
                              stepColors = { bg: 'bg-gray-300', border: 'border-gray-300', icon: 'pending' };
                            }
                            return (
                              <div key={statusKey} className="flex items-start gap-3 pr-2">
                                {/* Small status circle */}
                                <div
                                  className={`flex-shrink-0 w-6 h-6 rounded-full border-2 mt-0.5 flex items-center justify-center ${stepColors.border} ${
                                    hasStep && (stepColors.icon === 'completed' || stepColors.icon === 'current')
                                      ? stepColors.bg
                                      : 'bg-white'
                                  }`}
                                >
                                  <StatusIcon
                                    type={stepColors.icon}
                                    className={
                                      hasStep && (stepColors.icon === 'completed' || stepColors.icon === 'current')
                                        ? 'w-3 h-3 text-white'
                                        : 'w-3 h-3 text-gray-400'
                                    }
                                  />
                                </div>

                                <div className="flex-1">
                                  <p className={`text-sm font-medium ${hasStep ? 'text-gray-900' : 'text-gray-400'}`}>
                                    {getStatusLabel(statusKey)}
                                  </p>
                                  {hasStep && step.enteredAt && (
                                    <p className="text-xs text-gray-500 mt-0.5">
                                      <span className="inline-flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {new Date(step.enteredAt).toLocaleDateString('ar-SA', {
                                          year: 'numeric',
                                          month: 'short',
                                          day: 'numeric',
                                        })}
                                      </span>
                                      {step.exitedAt && (
                                        <span>
                                          {' '}
                                          →{' '}
                                          {new Date(step.exitedAt).toLocaleDateString('ar-SA', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                          })}
                                        </span>
                                      )}
                                    </p>
                                  )}
                                  {hasStep && step.notes && (
                                    <p className="text-xs text-gray-600 mt-1">{step.notes}</p>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Legend */}
          <div className="mt-12 pt-6 border-t border-gray-200">
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-500" />
                <span className="text-gray-600">متوقف مع إعادة المراجعة</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                <span className="text-gray-600">باقي</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-blue-500" />
                <span className="text-gray-600">الحالة الحالية</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-emerald-500" />
                <span className="text-gray-600">مكتمل</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

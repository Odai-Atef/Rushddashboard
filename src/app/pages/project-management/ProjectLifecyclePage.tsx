import { useNavigate, useParams } from 'react-router';
import {
 ChevronRight,
 GitBranch,
 Loader2,
 RotateCcw,
 Clock,
 CheckCircle2,
 XCircle,
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
type StepVisualStatus = 'completed' | 'current' | 'stopped' | 'pending';

interface PhaseDef {
 id: number;
 title: string;
 statuses: string[];
}

const PHASES: PhaseDef[] = [
 {
 id: 1,
 title: 'بدء المشروع',
 statuses: ['created', 'offer-review', 'offer-approved', 'offer-rejected'],
 },
 {
 id: 2,
 title: 'مراجعة الجهة',
 statuses: ['draft', 'pm-approval', 'charity-review', 'incubator-modifications', 'modifications-done-waiting-for-review', 'charity-approval'],
 },
 {
 id: 3,
 title: 'مرحلة التصميم',
 statuses: ['design-team', 'design-team-approval', 'design-review', 'design-approved', 'design-rejected'],
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

// ─── Decision points: status → {approvedOutcome, rejectedOutcome} ───
interface DecisionBranch {
 decision: string;
 approved: string;
 rejected: string;
 label: string;
}

const DECISIONS: DecisionBranch[] = [
 { decision: 'offer-review', approved: 'offer-approved', rejected: 'offer-rejected', label: 'عرض السعر' },
 { decision: 'design-review', approved: 'design-approved', rejected: 'design-rejected', label: 'قرار التصميم' },
];

function findDecision(status: string): DecisionBranch | undefined {
 return DECISIONS.find((d) => d.decision === status);
}

// ─── Helpers ───
function getStepVisualStatus(step: ProjectLifecycleStep | undefined): StepVisualStatus {
 if (!step) return 'pending';
 if (step.exitedAt === null) return 'current';
 const normalized = step.status.toLowerCase();
 if (normalized.includes('rejected') || normalized.includes('stopped')) return 'stopped';
 return 'completed';
}

function getStepStatusColor(type: StepVisualStatus): { bg: string; border: string; text: string; line: string } {
 switch (type) {
 case 'completed':
 return { bg: 'bg-[var(--primary)]/[0.08]0', border: 'border-emerald-500', text: 'text-[var(--primary)]', line: 'bg-[var(--primary)]/[0.08]0' };
 case 'current':
 return { bg: 'bg-[var(--primary)]', border: 'border-ring', text: 'text-[var(--secondary)]', line: 'bg-[var(--primary)]' };
 case 'stopped':
 return { bg: 'bg-[var(--destructive)]', border: 'border-red-500', text: 'text-[var(--destructive)]', line: 'bg-[var(--destructive)]' };
 case 'pending':
 default:
 return { bg: 'bg-muted', border: 'border-border', text: 'text-muted-foreground', line: 'bg-muted' };
 }
}

function StatusCircle({ type, size = 'sm' }: { type: StepVisualStatus; size?: 'sm' | 'md' }) {
 const colors = getStepStatusColor(type);
 const sizeClasses = size === 'md' ? 'w-8 h-8' : 'w-6 h-6';
 const iconSize = size === 'md' ? 'w-5 h-5' : 'w-3.5 h-3.5';

 return (
 <div
 className={`flex-shrink-0 ${sizeClasses} rounded-full border-2 flex items-center justify-center ${colors.border} ${
 type === 'completed' || type === 'current' || type === 'stopped' ? colors.bg : 'bg-card'
 }`}
 >
 {type === 'completed' && <CheckCircle2 className={`${iconSize} text-[var(--primary-foreground)]`} />}
 {type === 'current' && <div className={`${size === 'md' ? 'w-3 h-3' : 'w-2 h-2'} rounded-full bg-[var(--card)]`} />}
 {type === 'stopped' && <XCircle className={`${iconSize} text-[var(--primary-foreground)]`} />}
 {type === 'pending' && <Circle className={`${iconSize} text-muted-foreground`} />}
 </div>
 );
}

function StatusRow({
 statusKey,
 step,
 isBranch = false,
 branchType,
}: {
 statusKey: string;
 step: ProjectLifecycleStep | undefined;
 isBranch?: boolean;
 branchType?: 'approved' | 'rejected';
}) {
 const type = getStepVisualStatus(step);
 const colors = getStepStatusColor(type);
 const hasStep = !!step;

 return (
 <div className={`flex items-start gap-[var(--spacing-small-gap)] ${isBranch ? 'pr-0' : 'pr-2'}`}>
 <StatusCircle type={type} />
 <div className="flex-1 min-w-0">
 <p className={`text-sm font-medium ${hasStep ? colors.text : 'text-muted-foreground'}`}>
 {getStatusLabel(statusKey)}
 {isBranch && branchType === 'approved' && (
 <span className="inline-block mr-1.5 px-2 py-0.5 bg-emerald-100 text-[var(--primary)] text-xs rounded-full font-medium">
 تمت الموافقة
 </span>
 )}
 {isBranch && branchType === 'rejected' && (
 <span className="inline-block mr-1.5 px-2 py-0.5 bg-[var(--destructive)]/[0.1] text-[var(--destructive)] text-xs rounded-full font-medium">
 تم الرفض
 </span>
 )}
 </p>
 {hasStep && step.enteredAt && (
 <p className="text-xs text-muted-foreground mt-0.5">
 <span className="inline-flex items-center gap-[var(--spacing-small-gap)]">
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
 {hasStep && step.notes && <p className="text-xs text-muted-foreground mt-1">{step.notes}</p>}
 </div>
 </div>
 );
}

function DecisionFork({
 decision,
 stepByStatus,
}: {
 decision: DecisionBranch;
 stepByStatus: Record<string, ProjectLifecycleStep>;
}) {
 const decisionStep = stepByStatus[decision.decision];
 const approvedStep = stepByStatus[decision.approved];
 const rejectedStep = stepByStatus[decision.rejected];

 const decisionType = getStepVisualStatus(decisionStep);
 const approvedType = getStepVisualStatus(approvedStep);
 const rejectedType = getStepVisualStatus(rejectedStep);

 const decisionColors = getStepStatusColor(decisionType);

 return (
 <div className="relative">
 {/* Decision point */}
 <StatusRow statusKey={decision.decision} step={decisionStep} />

 {/* Fork container */}
 <div className="relative mt-2 mr-8">
 {/* Vertical line from decision down */}
 <div className={`absolute right-[11px] top-0 bottom-0 w-0.5 ${decisionColors.line} ${decisionType === 'pending' ? 'opacity-30' : ''}`} />

 {/* Horizontal split line */}
 <div className="absolute right-[11px] top-4 w-16 h-0.5 bg-muted" />

 {/* Branches */}
 <div className="flex gap-8">
 {/* Approved branch - left */}
 <div className="flex-1 relative">
 {/* Connecting line from split to branch */}
 <div className={`absolute right-[-20px] top-4 w-5 h-0.5 ${approvedType === 'pending' ? 'bg-muted' : 'bg-[var(--primary)]/[0.08]0'}`} />
 <div className={`absolute right-[-20px] top-4 w-0.5 h-full ${approvedType === 'pending' ? 'bg-muted' : 'bg-[var(--primary)]/[0.08]0'} ${approvedType === 'pending' ? 'opacity-40' : ''}`} />

 <div className="bg-[var(--primary)]/[0.08]/50 rounded-lg p-[var(--spacing-card-padding)] border border-[var(--primary)]/[0.2]">
 <p className="text-xs font-semibold text-[var(--primary)] mb-2 flex items-center gap-[var(--spacing-small-gap)]">
 <CheckCircle2 className="w-3.5 h-3.5" />
 مسار الموافقة
 </p>
 <StatusRow statusKey={decision.approved} step={approvedStep} isBranch branchType="approved" />
 </div>
 </div>

 {/* Rejected branch - right */}
 <div className="flex-1 relative">
 {/* Connecting line from split to branch */}
 <div className={`absolute right-[-20px] top-4 w-5 h-0.5 ${rejectedType === 'pending' ? 'bg-muted' : 'bg-red-400'} ${rejectedType === 'pending' ? 'border-dashed' : ''}`} style={rejectedType === 'pending' ? { borderTop: '2px dashed var(--border)' } : undefined} />
 <div className={`absolute right-[-20px] top-4 w-0.5 h-full ${rejectedType === 'pending' ? 'bg-muted' : 'bg-red-400'} ${rejectedType === 'pending' ? 'opacity-40' : ''}`} />

 <div className="bg-[var(--destructive)]/[0.08]/50 rounded-lg p-[var(--spacing-card-padding)] border border-[var(--destructive)]/[0.2]">
 <p className="text-xs font-semibold text-[var(--destructive)] mb-2 flex items-center gap-[var(--spacing-small-gap)]">
 <XCircle className="w-3.5 h-3.5" />
 مسار الرفض
 </p>
 <StatusRow statusKey={decision.rejected} step={rejectedStep} isBranch branchType="rejected" />
 </div>
 </div>
 </div>
 </div>
 </div>
 );
}

// ─── Phase status helpers ───
type PhaseStatus = 'completed' | 'current' | 'pending' | 'stopped';

function getPhaseStatus(steps: ProjectLifecycleStep[]): PhaseStatus {
 if (steps.length === 0) return 'pending';
 const hasCurrent = steps.some((s) => s.exitedAt === null);
 const allCompleted = steps.every((s) => s.exitedAt !== null);
 const hasStopped = steps.some(
 (s) =>
 s.status.toLowerCase().includes('rejected') ||
 s.status.toLowerCase().includes('stopped')
 );
 if (hasCurrent) return 'current';
 if (hasStopped) return 'stopped';
 if (allCompleted) return 'completed';
 return 'pending';
}

function getPhaseStatusColor(status: PhaseStatus): { bg: string; border: string; text: string } {
 switch (status) {
 case 'completed':
 return { bg: 'bg-[var(--primary)]/[0.08]0', border: 'border-emerald-500', text: 'text-[var(--primary)]' };
 case 'current':
 return { bg: 'bg-[var(--primary)]', border: 'border-ring', text: 'text-[var(--secondary)]' };
 case 'stopped':
 return { bg: 'bg-[var(--destructive)]', border: 'border-red-500', text: 'text-[var(--destructive)]' };
 case 'pending':
 default:
 return { bg: 'bg-muted', border: 'border-border', text: 'text-muted-foreground' };
 }
}

// Map a backend status string to its phase id
function getPhaseIdByStatus(status: string): number | null {
 const normalized = status.toLowerCase().replace(/_/g, '-');
 for (const phase of PHASES) {
 if (phase.statuses.includes(normalized)) return phase.id;
 }
 return null;
}

// ─── Main component ───
export function ProjectLifecyclePage() {
 const navigate = useNavigate();
 const { projectId } = useParams<{ projectId: string }>();
 const { project, isLoading: projectLoading, error: projectError, refetch: refetchProject } = useProjectDetails(projectId);
 const { steps, isLoading: lifecycleLoading, error: lifecycleError, refetch: refetchLifecycle } = useProjectLifecycle(projectId);

 const isLoading = projectLoading || lifecycleLoading;
 const error = projectError || lifecycleError;

 if (isLoading) {
 return (
 <div className="min-h-full bg-background p-[var(--spacing-card-padding)] sm:p-[var(--spacing-card-padding)] flex items-center justify-center">
 <div className="w-8 h-8 border-4 border-ring border-t-transparent rounded-full animate-spin" />
 </div>
 );
 }

 if (error) {
 return (
 <div className="min-h-full bg-background p-[var(--spacing-card-padding)] sm:p-[var(--spacing-card-padding)] flex flex-col items-center justify-center gap-[var(--spacing-grid-gap)]">
 <div className="text-[var(--destructive)] text-center">{error}</div>
 <button
 onClick={() => {
 refetchProject();
 refetchLifecycle();
 }}
 className="px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg hover:bg-[var(--primary)]/90 transition-colors font-medium flex items-center gap-[var(--spacing-small-gap)]"
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

 return (
 <div className="min-h-full bg-background p-[var(--spacing-card-padding)] sm:p-[var(--spacing-card-padding)]">
 <div className="space-y-[var(--spacing-section-gap)] max-w-5xl mx-auto">
 <button
 onClick={() => navigate(`/dashboard/project-management/details/${project.id}`)}
 className="text-[var(--secondary)] font-medium flex items-center gap-[var(--spacing-small-gap)] mb-4"
 >
 <ChevronRight className="w-5 h-5" />
 رجوع إلى تفاصيل المشروع
 </button>

 <div className="text-center mb-8">
 <h1 className={`text-3xl font-bold text-foreground ${isDraft ? 'opacity-50' : ''}`}>
 مسار دورة حياة المشروع
 </h1>
 <p className="text-muted-foreground mt-2">يعرض جميع المراحل من البداية حتى الإغلاق مع مسارات القرارات</p>
 </div>

 <div className="bg-card rounded-xl p-8 border border-border">
 <div className="flex items-center gap-[var(--spacing-small-gap)] mb-8">
 <div className="w-12 h-12 bg-muted/[0.1] rounded-lg flex items-center justify-center">
 <GitBranch className="w-6 h-6 text-[var(--secondary)]" />
 </div>
 <div>
 <p className="text-sm text-muted-foreground">المشروع</p>
 <p className={`text-xl font-bold text-foreground ${isDraft ? 'opacity-50' : ''}`}>{project.name}</p>
 </div>
 </div>

 {steps.length === 0 ? (
 <div className="text-center py-12 text-muted-foreground">لا توجد خطوات مسجلة لدورة حياة هذا المشروع</div>
 ) : (
 <div className="relative">
 {/* Vertical connector line */}
 <div className="absolute right-[27px] top-4 bottom-4 w-0.5 bg-muted" />

 <div className="space-y-10">
 {PHASES.map((phase) => {
 const phaseSteps = phaseMap[phase.id] || [];
 const phaseStatus = getPhaseStatus(phaseSteps);
 const colors = getPhaseStatusColor(phaseStatus);

 // Build lookup map for API steps in this phase
 const stepByStatus: Record<string, ProjectLifecycleStep> = {};
 for (const s of phaseSteps) {
 stepByStatus[s.status.toLowerCase().replace(/_/g, '-')] = s;
 }

 // Track which statuses have been rendered (for decision branches)
 const rendered = new Set<string>();

 return (
 <div key={phase.id} className="relative flex gap-[var(--spacing-grid-gap)]">
 {/* Phase number node */}
 <div className="relative z-10 flex-shrink-0">
 <div
 className={`w-14 h-14 rounded-full border-2 flex items-center justify-center font-bold text-lg ${colors.border} ${
 phaseStatus === 'completed' || phaseStatus === 'current' ? colors.bg : 'bg-card'
 }`}
 >
 <span
 className={
 phaseStatus === 'completed' || phaseStatus === 'current' ? 'text-[var(--primary-foreground)]' : colors.text
 }
 >
 {phase.id}
 </span>
 </div>
 </div>

 {/* Phase content */}
 <div className="flex-1 pt-2">
 <h3 className={`font-bold text-lg mb-5 ${colors.text}`}>{phase.title}</h3>

 <div className="space-y-[var(--spacing-section-gap)]">
 {phase.statuses.map((statusKey) => {
 // Skip if already rendered as part of a decision branch
 if (rendered.has(statusKey)) return null;

 // Check if this status is a decision point
 const decision = findDecision(statusKey);
 if (decision) {
 // Mark branches as rendered
 rendered.add(decision.approved);
 rendered.add(decision.rejected);
 return (
 <DecisionFork
 key={statusKey}
 decision={decision}
 stepByStatus={stepByStatus}
 />
 );
 }

 // Normal status
 const step = stepByStatus[statusKey];
 return <StatusRow key={statusKey} statusKey={statusKey} step={step} />;
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
 <div className="mt-12 pt-6 border-t border-border">
 <div className="flex flex-wrap items-center justify-center gap-[var(--spacing-grid-gap)] text-sm">
 <div className="flex items-center gap-[var(--spacing-small-gap)]">
 <div className="w-4 h-4 rounded-full bg-[var(--destructive)]" />
 <span className="text-muted-foreground">متوقف مع إعادة المراجعة</span>
 </div>
 <div className="flex items-center gap-[var(--spacing-small-gap)]">
 <div className="w-4 h-4 rounded-full border-2 border-border" />
 <span className="text-muted-foreground">باقي</span>
 </div>
 <div className="flex items-center gap-[var(--spacing-small-gap)]">
 <div className="w-4 h-4 rounded-full bg-[var(--primary)]" />
 <span className="text-muted-foreground">الحالة الحالية</span>
 </div>
 <div className="flex items-center gap-[var(--spacing-small-gap)]">
 <div className="w-4 h-4 rounded-full bg-[var(--primary)]/[0.08]0" />
 <span className="text-muted-foreground">مكتمل</span>
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>
 );
}

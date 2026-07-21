import { useState, useMemo } from 'react';
import {
  Search, Sparkles, ExternalLink, FileText, Download, Loader2, Plus, User
} from 'lucide-react';
import { toast } from 'sonner';
import type { MatchDonorsResponse } from '@/api/services/project-service';
import { projectService } from '@/api/services/project-service';
import type { ProjectDetails } from '@/app/pages/project-management/project-types';
import { statusConfig as projectStatusConfig, ProjectStatus } from '@/app/pages/project-management/project-types';
import { useConfirm } from '@/app/hooks/useConfirm.tsx';
import { DonorStatusActions } from './DonorStatusActions';
import { DonorHistoryAccordion } from './DonorHistoryAccordion';
import { DonorDetailDrawer } from './DonorDetailDrawer';
import { AddManualDonorModal } from './AddManualDonorModal';

function getDisplayStatus(status: string): ProjectStatus {
  const normalized = status.toLowerCase().replace(/_/g, '-');
  return normalized in projectStatusConfig ? (normalized as ProjectStatus) : 'draft';
}

export interface AIRecommendedDonorsProps {
  project: ProjectDetails | null;
  isLoadingProject: boolean;
  projectError: string | null;
  matchData: MatchDonorsResponse | null;
  isMatching: boolean;
  error: string | null;
  refetch?: () => void;
}

function ScoreRing({ score }: { score: number }) {
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#6366f1' : score >= 40 ? '#f59e0b' : '#94a3b8';
  const r = 28;
  const c = 2 * Math.PI * r;
  const dash = (score / 100) * c;
  return (
    <div className="relative w-16 h-16 flex-shrink-0">
      <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={r} fill="none" stroke="var(--muted)" strokeWidth="5" />
        <circle
          cx="32"
          cy="32"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeDasharray={`${dash} ${c}`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-sm text-foreground leading-none">{score}%</span>
        <span className="text-[9px] text-muted-foreground">تطابق</span>
      </div>
    </div>
  );
}

const DONOR_STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  MATCHED: { label: 'مطابق', color: '#10b981', bg: '#d1fae5' },
  SUBMITTED: { label: 'تم الإرسال', color: '#3b82f6', bg: '#dbeafe' },
  ACCEPTED: { label: 'تم القبول', color: '#059669', bg: '#d1fae5' },
  REJECTED: { label: 'تم الاعتذار', color: '#ef4444', bg: '#fee2e2' },
  FUNDED: { label: 'تم التمويل', color: '#d97706', bg: '#fef3c7' },
  GENERATED: { label: 'تم إنشاء الخطة', color: '#8b5cf6', bg: '#ede9fe' },
};

export function AIRecommendedDonors({
  project,
  isLoadingProject,
  projectError,
  matchData,
  isMatching,
  error,
  refetch,
}: AIRecommendedDonorsProps) {
  const [search, setSearch] = useState('');
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const { confirm, dialog: confirmDialog } = useConfirm();
  const [selectedDonor, setSelectedDonor] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [manualModalOpen, setManualModalOpen] = useState(false);

  const donors = matchData?.donors ?? [];
  const isExecution = project?.status === 'EXECUTION';

  const filtered = useMemo(() => {
    return donors.filter((d) => {
      const matchSearch =
        search === '' ||
        d.name?.includes(search) ||
        d.description?.includes(search);
      return matchSearch;
    });
  }, [donors, search]);

  const handleGeneratePlan = async (donorMatchId: string, donorName: string) => {
    const confirmed = await confirm({
      title: 'هل أنت متأكد من إنشاء نسخة مشروع خاصة بهذه الجهة؟',
    });
    if (!confirmed) {
      return;
    }
    setGeneratingId(donorMatchId);
    try {
      const res = await projectService.generateDonorPlan(donorMatchId);
      const blob = res.data;
      if (!(blob instanceof Blob)) {
        throw new Error('تعذر الحصول على ملف الخطة');
      }
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${donorName}-plan.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success('تم إنشاء خطة المشروع وتحميلها بنجاح');
      if (refetch) refetch();
    } catch (err: any) {
      toast.error(err?.message || 'فشل إنشاء خطة المشروع. يرجى المحاولة لاحقاً.');
    } finally {
      setGeneratingId(null);
    }
  };

  const openDonorDetail = (donor: any) => {
    setSelectedDonor(donor);
    setDrawerOpen(true);
  };

  const handleStatusChange = () => {
    if (refetch) refetch();
  };

  if (isMatching) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <Loader2 className="w-10 h-10 animate-spin text-violet-600 mb-4" />
        <p className="text-lg font-medium">جارٍ تحليل الجهات المانحة...</p>
        <p className="text-sm mt-1">قد يستغرق ذلك بضع لحظات</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Project Info */}
      {(isLoadingProject || project || projectError) && (
        <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
          {isLoadingProject && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Loader2 className="w-4 h-4 animate-spin" />
              جارٍ تحميل بيانات المشروع...
            </div>
          )}
          {projectError && (
            <p className="text-sm text-red-600 text-right">{projectError}</p>
          )}
          {project && (
            <div className="flex items-center justify-between">
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1">
                  نتائج التطابق للمشروع: <strong className="text-foreground">{project.name}</strong>
                </p>
                <div className="flex items-center gap-2">
                  {(() => {
                    const displayStatus = getDisplayStatus(project.status as string);
                    const cfg = projectStatusConfig[displayStatus];
                    return cfg ? (
                      <span
                        className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ backgroundColor: cfg.bg, color: cfg.color }}
                      >
                        {cfg.label}
                      </span>
                    ) : null;
                  })()}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm text-right">
          {error}
        </div>
      )}

      {/* Search + Add Manual */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="ابحث عن جهة مانحة..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pr-10 pl-4 py-2.5 text-sm border border-border rounded-lg bg-background text-foreground text-right"
          />
        </div>
        {!isExecution && (
          <button
            onClick={() => setManualModalOpen(true)}
            disabled={!matchData?.resultId}
            title={matchData?.resultId ? '' : 'لم يتم العثور على معرف نتيجة التطابق. يرجى تحديث الصفحة.'}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            إضافة جهة يدوياً
          </button>
        )}
      </div>

      {matchData && (
        <p className="text-sm text-muted-foreground text-right">
          عرض {filtered.length} من {donors.length} جهة مانحة
        </p>
      )}

      {/* Donor Cards */}
      <div className="space-y-4">
        {filtered.map((donor, idx) => {
          const donorStatus = donor.status ?? 'MATCHED';
          const statusCfg = DONOR_STATUS_CONFIG[donorStatus] || DONOR_STATUS_CONFIG.MATCHED;

          return (
            <div
              key={donor.id || idx}
              className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-4">
                {/* Logo */}
                <div
                  className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-lg flex-shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => openDonorDetail(donor)}
                >
                  {donor.name?.charAt(0) || <User className="w-6 h-6" />}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 text-right">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1">
                      <div className="flex items-center justify-start gap-2 mb-0.5 flex-wrap">
                        <h3
                          className="text-foreground font-semibold cursor-pointer hover:text-primary transition-colors"
                          onClick={() => openDonorDetail(donor)}
                        >
                          {donor.name}
                        </h3>
                        <span
                          className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{ backgroundColor: statusCfg.bg, color: statusCfg.color }}
                        >
                          {statusCfg.label}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
                            donor.source === 'online'
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400'
                              : donor.source === 'MANUAL'
                                ? 'bg-sky-100 text-sky-700 dark:bg-sky-950/50 dark:text-sky-400'
                                : 'bg-slate-100 text-slate-700 dark:bg-slate-950/50 dark:text-slate-400'
                          }`}
                        >
                          {donor.source === 'online'
                            ? 'عبر الإنترنت'
                            : donor.source === 'MANUAL'
                              ? 'تمت الإضافة يدوياً'
                              : 'قواعد البيانات'}
                        </span>
                      </div>
                    </div>
                    <ScoreRing score={donor.matchingScore} />
                  </div>

                  {/* AI Note */}
                  <div className="flex items-start gap-2 mb-3 p-2.5 rounded-lg bg-violet-50 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-900"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-violet-500 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-violet-700 dark:text-violet-300 text-right">{donor.description || 'لا يوجد وصف'}</p>
                  </div>

                  {/* Inline Status Actions */}
                  {!isExecution && (
                    <div className="mb-3">
                      <DonorStatusActions
                        matchId={donor.id}
                        currentStatus={donorStatus}
                        onStatusChange={handleStatusChange}
                      />
                    </div>
                  )}

                  {/* History Accordion */}
                  <DonorHistoryAccordion matchId={donor.id} />

                  {/* Actions */}
                  <div className="flex items-center justify-start gap-2 flex-wrap mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                    <a
                      href={donor.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> زيارة الموقع
                    </a>
                    {!isExecution && (
                      donor.hasGeneratedPlan ? (
                        <button
                          onClick={() => handleGeneratePlan(donor.id, donor.name)}
                          disabled={generatingId === donor.id}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {generatingId === donor.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Download className="w-3.5 h-3.5" />
                          )}
                          {generatingId === donor.id ? 'جارٍ التحميل...' : 'تحميل الملف المطور'}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleGeneratePlan(donor.id, donor.name)}
                          disabled={generatingId === donor.id}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {generatingId === donor.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <FileText className="w-3.5 h-3.5" />
                          )}
                          {generatingId === donor.id ? 'جارٍ إنشاء النسخة...' : 'إنشاء نسخة مشروع خاصة بهذه الجهة'}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Drawer */}
      <DonorDetailDrawer
        donor={selectedDonor}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onStatusChange={handleStatusChange}
        projectId={project?.id}
        isExecution={isExecution}
      />

      {/* Manual Donor Modal */}
      <AddManualDonorModal
        resultId={matchData?.resultId || ''}
        isOpen={manualModalOpen}
        onClose={() => setManualModalOpen(false)}
        onSuccess={handleStatusChange}
      />

      {confirmDialog}
    </div>
  );
}

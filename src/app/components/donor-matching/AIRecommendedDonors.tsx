import { useState, useMemo } from 'react';
import {
  Search, Bookmark, Send, Eye, Sparkles, ChevronDown,
  CheckCircle2, AlertCircle, Clock, BookmarkCheck, ExternalLink,
  Loader2, FolderKanban
} from 'lucide-react';
import type { Project } from '@/app/pages/project-management/project-types';
import type { MatchDonorsResponse } from '@/api/services/project-service';

export interface AIRecommendedDonorsProps {
  projects: Project[];
  selectedProjectId: string | null;
  onSelectProject: (id: string | null) => void;
  onExecuteMatch: () => void;
  matchData: MatchDonorsResponse | null;
  isMatching: boolean;
  isLoadingProjects: boolean;
  error: string | null;
  onNavigate: (view: string, donorId?: string) => void;
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  open: { label: 'مفتوح', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400', icon: CheckCircle2 },
  closing: { label: 'ينتهي قريباً', color: 'bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400', icon: AlertCircle },
  review: { label: 'قيد المراجعة', color: 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400', icon: Clock },
  closed: { label: 'مغلق', color: 'bg-muted text-muted-foreground', icon: AlertCircle },
};

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

export function AIRecommendedDonors({
  projects,
  selectedProjectId,
  onSelectProject,
  onExecuteMatch,
  matchData,
  isMatching,
  isLoadingProjects,
  error,
  onNavigate,
}: AIRecommendedDonorsProps) {
  const [search, setSearch] = useState('');
  const [savedDonors, setSavedDonors] = useState<Set<number>>(new Set());

  const selectedProject = useMemo(
    () => projects.find((p) => p.id === selectedProjectId) || null,
    [projects, selectedProjectId]
  );

  const donors = matchData?.donors ?? [];

  const filtered = useMemo(() => {
    return donors.filter((d) => {
      const matchSearch =
        search === '' ||
        d.name.includes(search) ||
        d.description.includes(search);
      return matchSearch;
    });
  }, [donors, search]);

  const toggleSave = (idx: number) => {
    setSavedDonors((prev) => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  };

  const hasProjects = projects.length > 0;

  return (
    <div className="space-y-5">
      {/* Project Selector + Analyze */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
        <div className="flex-1 w-full">
          <label className="block text-sm font-medium mb-1.5 text-right">اختر المشروع</label>
          <div className="relative">
            <FolderKanban className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <select
              value={selectedProjectId ?? ''}
              onChange={(e) => onSelectProject(e.target.value || null)}
              disabled={isLoadingProjects || !hasProjects}
              className="w-full pr-10 pl-4 py-2.5 text-sm border border-border rounded-lg bg-background text-foreground text-right disabled:opacity-50"
            >
              <option value="">{isLoadingProjects ? 'جارٍ تحميل المشاريع...' : hasProjects ? '-- اختر مشروعاً --' : 'لا توجد مشاريع'}</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={onExecuteMatch}
          disabled={isMatching || !selectedProjectId}
          className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:bg-violet-300 disabled:cursor-not-allowed transition-colors text-sm font-medium"
        >
          {isMatching ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              جارٍ التحليل...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              تحليل الجهات المانحة
            </>
          )}
        </button>
      </div>

      {/* AI Header */}
      {matchData && selectedProject && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800">
          <Sparkles className="w-5 h-5 text-violet-600 flex-shrink-0" />
          <p className="text-sm text-violet-800 dark:text-violet-300 text-right flex-1">
            حلّل الذكاء الاصطناعي المشروع <strong>{selectedProject.name}</strong> ووجد{' '}
            <strong>{matchData.donors?.length ?? 0} جهات مانحة</strong> متطابقة بناءً على معايير البحث.
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm text-right">
          {error}
        </div>
      )}

      {/* Search */}
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

      {matchData && (
        <p className="text-sm text-muted-foreground text-right">
          عرض {filtered.length} من {donors.length} جهة مانحة
        </p>
      )}

      {/* Donor Cards */}
      <div className="space-y-4">
        {filtered.map((donor, idx) => {
          const isSaved = savedDonors.has(idx);
          // Use a generic status fallback since API doesn't return status
          const statusKey = 'open';
          const StatusIcon = statusConfig[statusKey].icon;
          return (
            <div
              key={idx}
              className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-4">
                {/* Logo */}
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-lg flex-shrink-0">
                  {donor.name.charAt(0)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 text-right">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1">
                      <div className="flex items-center justify-start gap-2 mb-0.5">
                        <h3 className="text-foreground font-semibold">{donor.name}</h3>
                        <span
                          className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${statusConfig[statusKey].color}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {statusConfig[statusKey].label}
                        </span>
                        <span
                          className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
                            donor.source === 'online'
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400'
                              : 'bg-slate-100 text-slate-700 dark:bg-slate-950/50 dark:text-slate-400'
                          }`}
                        >
                          {donor.source === 'online' ? 'عبر الإنترنت' : 'قواعد البيانات'}
                        </span>
                      </div>
                    </div>
                    <ScoreRing score={donor.matchingScore} />
                  </div>

                  {/* AI Note */}
                  <div className="flex items-start gap-2 mb-3 p-2.5 rounded-lg bg-violet-50 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-900"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-violet-500 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-violet-700 dark:text-violet-300 text-right">{donor.description}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-start gap-2 flex-wrap">
                    <a
                      href={donor.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> زيارة الموقع
                    </a>
                    <button
                      onClick={() => toggleSave(idx)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs border rounded-lg transition-colors ${
                        isSaved
                          ? 'border-amber-300 text-amber-600 bg-amber-50 dark:bg-amber-950/30'
                          : 'border-border text-foreground hover:bg-muted'
                      }`}
                    >
                      {isSaved ? (
                        <BookmarkCheck className="w-3.5 h-3.5" />
                      ) : (
                        <Bookmark className="w-3.5 h-3.5" />
                      )}
                      {isSaved ? 'محفوظ' : 'حفظ'}
                    </button>
                    <button
                      onClick={() => onNavigate('analysis', String(idx))}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" /> تحليل التطابق
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {!matchData && !isMatching && !error && (
        <div className="text-center py-16 text-muted-foreground">
          <Sparkles className="w-12 h-12 mx-auto mb-4 text-violet-300" />
          <p className="text-lg font-medium mb-2">ابدأ بتحليل الجهات المانحة</p>
          <p className="text-sm">اختر مشروعاً من القائمة ثم اضغط على "تحليل الجهات المانحة" للحصول على توصيات مدعومة بالذكاء الاصطناعي.</p>
        </div>
      )}
    </div>
  );
}

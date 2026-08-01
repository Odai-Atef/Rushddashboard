/**
 * LatestProjectsTable — Bottom Analytics Left Column
 *
 * Modern table with columns, pagination, sorting placeholder, search.
 * Responsive: converts to mobile cards on small screens.
 */

import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/app/utils/cn';
import { Search, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { WidgetCard } from '../widgets/WidgetCard';
import { StatusBadge } from '../widgets/StatusBadge';
import { ProgressBar } from '../widgets/ProgressBar';
import type { LatestProject } from '../../types/analytics';

export interface LatestProjectsTableProps {
  projects?: LatestProject[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  onViewProject?: (project: LatestProject) => void;
  className?: string;
}

const DEFAULT_PROJECTS: LatestProject[] = [
  {
    id: 'proj-001',
    name: 'Digital Education Initiative',
    nameAr: 'مبادرة التعليم الرقمي',
    region: 'Riyadh',
    regionAr: 'الرياض',
    sector: 'Education',
    sectorAr: 'التعليم',
    status: 'running',
    funding: 45000000,
    beneficiaries: 8500,
    progress: 72,
    organization: 'Future Skills Foundation',
  },
  {
    id: 'proj-002',
    name: 'Community Health Program',
    nameAr: 'برنامج الصحة المجتمعية',
    region: 'Makkah',
    regionAr: 'مكة المكرمة',
    sector: 'Health',
    sectorAr: 'الصحة',
    status: 'completed',
    funding: 32000000,
    beneficiaries: 12000,
    progress: 100,
    organization: 'Al-Birr Medical Society',
  },
  {
    id: 'proj-003',
    name: 'Vocational Training Centers',
    nameAr: 'مراكز التدريب المهني',
    region: 'Eastern Province',
    regionAr: 'المنطقة الشرقية',
    sector: 'Employment',
    sectorAr: 'التوظيف',
    status: 'running',
    funding: 28000000,
    beneficiaries: 5600,
    progress: 58,
    organization: 'Tamkeen Development',
  },
  {
    id: 'proj-004',
    name: 'Orphan Care Program',
    nameAr: 'برنامج رعاية الأيتام',
    region: 'Asir',
    regionAr: 'عسير',
    sector: 'Social Care',
    sectorAr: 'الرعاية الاجتماعية',
    status: 'delayed',
    funding: 15000000,
    beneficiaries: 3200,
    progress: 35,
    organization: 'Atheer Charity',
  },
  {
    id: 'proj-005',
    name: 'Cultural Heritage Festival',
    nameAr: 'مهرجان التراث الثقافي',
    region: 'Madinah',
    regionAr: 'المدينة المنورة',
    sector: 'Culture',
    sectorAr: 'الثقافة',
    status: 'planned',
    funding: 8000000,
    beneficiaries: 15000,
    progress: 0,
    organization: 'Heritage Preservation Org',
  },
  {
    id: 'proj-007',
    name: 'Agricultural Innovation Lab',
    nameAr: 'معمل الابتكار الزراعي',
    region: 'Qassim',
    regionAr: 'القصيم',
    sector: 'Agriculture',
    sectorAr: 'الزراعة',
    status: 'running',
    funding: 18500000,
    beneficiaries: 2800,
    progress: 48,
    organization: 'Green Fields Cooperative',
  },
  {
    id: 'proj-008',
    name: 'Youth Sports Complex',
    nameAr: 'مجمع الرياضات الشبابية',
    region: 'Jeddah',
    regionAr: 'جدة',
    sector: 'Sports',
    sectorAr: 'الرياضة',
    status: 'completed',
    funding: 35000000,
    beneficiaries: 9500,
    progress: 100,
    organization: 'Active Youth Foundation',
  },
  {
    id: 'proj-009',
    name: 'Sustainable Energy Pilot',
    nameAr: 'برنامج الطاقة المستدامة',
    region: 'Tabuk',
    regionAr: 'تبوك',
    sector: 'Environment',
    sectorAr: 'البيئة',
    status: 'running',
    funding: 42000000,
    beneficiaries: 1800,
    progress: 33,
    organization: 'Clean Energy Alliance',
  },
  {
    id: 'proj-010',
    name: 'Elderly Care Centers',
    nameAr: 'مراكز رعاية المسنين',
    region: 'Hail',
    regionAr: 'حائل',
    sector: 'Social Care',
    sectorAr: 'الرعاية الاجتماعية',
    status: 'planned',
    funding: 12000000,
    beneficiaries: 1200,
    progress: 0,
    organization: 'Silver Wings Association',
  },
];

const ITEMS_PER_PAGE = 5;

function formatFunding(amount: number): string {
  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(0)}M ر.س.`;
  }
  return `${(amount / 1_000).toFixed(0)}K ر.س.`;
}

/* ─── Mobile Card View ─────────────────────────────────────────── */

function MobileProjectCard({
  project,
  index,
  onView,
}: {
  project: LatestProject;
  index: number;
  onView?: (project: LatestProject) => void;
}) {
  return (
    <motion.div
      className={cn(
        'p-4 rounded-xl border border-[var(--border)]',
        'bg-[var(--card)]',
        'transition-all duration-150',
        'hover:shadow-[var(--shadow-sm)]'
      )}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <StatusBadge status={project.status} />
        <span className="text-xs text-[var(--text-muted)]">{project.regionAr}</span>
      </div>
      <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-1 truncate">
        {project.nameAr}
      </h4>
      <p className="text-xs text-[var(--text-muted)] mb-2">{project.organization}</p>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--text-muted)] mb-3">
        <span>{formatFunding(project.funding)}</span>
        <span>{project.beneficiaries.toLocaleString('ar-SA')} مستفيد</span>
      </div>
      <ProgressBar progress={project.progress} showLabel />
      <button
        className={cn(
          'mt-3 w-full flex items-center justify-center gap-2',
          'px-3 py-2 rounded-lg text-xs font-medium',
          'bg-[var(--primary)]/10 text-[var(--primary)]',
          'hover:bg-[var(--primary)]/20 transition-colors',
          'min-h-[36px]'
        )}
        onClick={() => onView?.(project)}
      >
        <Eye className="w-3.5 h-3.5" />
        عرض المشروع
      </button>
    </motion.div>
  );
}

/* ─── Table View ───────────────────────────────────────────────── */

function DesktopTable({
  projects,
  onView,
}: {
  projects: LatestProject[];
  onView?: (project: LatestProject) => void;
}) {
  return (
    <div className="overflow-x-auto -mx-2 px-2">
      <table className="w-full min-w-[640px]">
        <thead>
          <tr className="border-b border-[var(--border)]">
            {['المشروع', 'المنظمة', 'المنطقة', 'التمويل', 'المستفيدين', 'الحالة', 'التقدم', ''].map(
              (header) => (
                <th
                  key={header}
                  className={cn(
                    'text-start text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider',
                    'pb-3 pt-1 px-2'
                  )}
                >
                  {header}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border)]">
          {projects.map((project, index) => (
            <motion.tr
              key={project.id}
              className={cn(
                'group transition-colors duration-150',
                'hover:bg-[var(--hover)]/50'
              )}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: index * 0.04 }}
            >
              <td className="py-3 px-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[var(--hover)] flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-[var(--text-muted)]">
                      {project.nameAr.charAt(0)}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-[var(--text-primary)] truncate max-w-[140px]">
                    {project.nameAr}
                  </span>
                </div>
              </td>
              <td className="py-3 px-2">
                <span className="text-sm text-[var(--text-muted)] truncate max-w-[120px] block">
                  {project.organization}
                </span>
              </td>
              <td className="py-3 px-2">
                <span className="text-sm text-[var(--text-muted)]">{project.regionAr}</span>
              </td>
              <td className="py-3 px-2">
                <span className="text-sm font-medium text-[var(--text-primary)]">
                  {formatFunding(project.funding)}
                </span>
              </td>
              <td className="py-3 px-2">
                <span className="text-sm text-[var(--text-muted)]">
                  {project.beneficiaries.toLocaleString('ar-SA')}
                </span>
              </td>
              <td className="py-3 px-2">
                <StatusBadge status={project.status} />
              </td>
              <td className="py-3 px-2 w-28">
                <ProgressBar progress={project.progress} showLabel />
              </td>
              <td className="py-3 px-2">
                <button
                  className={cn(
                    'p-2 rounded-lg',
                    'text-[var(--text-muted)] hover:text-[var(--primary)]',
                    'hover:bg-[var(--primary)]/10 transition-colors',
                    'min-h-[36px] min-w-[36px]'
                  )}
                  onClick={() => onView?.(project)}
                  aria-label={`عرض مشروع ${project.nameAr}`}
                >
                  <Eye className="w-4 h-4" />
                </button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─── Main Component ───────────────────────────────────────────── */

export function LatestProjectsTable({
  projects = DEFAULT_PROJECTS,
  isLoading,
  isError,
  onRetry,
  onViewProject,
  className,
}: LatestProjectsTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return projects;
    const q = searchQuery.toLowerCase();
    return projects.filter(
      (p) =>
        p.nameAr.toLowerCase().includes(q) ||
        p.organization.toLowerCase().includes(q) ||
        p.regionAr.toLowerCase().includes(q)
    );
  }, [projects, searchQuery]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  return (
    <WidgetCard
      title="أحدث المشاريع المدعومة"
      description={`${filtered.length} مشروع مدعوم`}
      isLoading={isLoading}
      isError={isError}
      onRetry={onRetry}
      emptyTitle="لا توجد مشاريع"
      className={className}
    >
      <div className="space-y-4">
        {/* Search bar */}
        <div className="relative">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="بحث عن مشروع..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className={cn(
              'w-full ps-10 pe-4 py-2.5 rounded-lg text-sm',
              'bg-[var(--hover)]/30 border border-[var(--border)]',
              'text-[var(--text-primary)] placeholder:text-[var(--text-muted)]',
              'focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40 focus:border-[var(--primary)]',
              'transition-colors min-h-[44px]'
            )}
          />
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block">
          <DesktopTable projects={paginated} onView={onViewProject} />
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3">
          {paginated.map((project, index) => (
            <MobileProjectCard
              key={project.id}
              project={project}
              index={index}
              onView={onViewProject}
            />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-[var(--text-muted)]">
              {filtered.length} مشروع
            </span>
            <div className="flex items-center gap-2">
              <button
                className={cn(
                  'p-2 rounded-lg border border-[var(--border)]',
                  'text-[var(--text-muted)] hover:text-[var(--text-primary)]',
                  'hover:bg-[var(--hover)] transition-colors',
                  'disabled:opacity-40 disabled:cursor-not-allowed',
                  'min-h-[36px] min-w-[36px]'
                )}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                aria-label="الصفحة السابقة"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <span className="text-sm font-medium text-[var(--text-primary)] px-2">
                {currentPage} / {totalPages}
              </span>
              <button
                className={cn(
                  'p-2 rounded-lg border border-[var(--border)]',
                  'text-[var(--text-muted)] hover:text-[var(--text-primary)]',
                  'hover:bg-[var(--hover)] transition-colors',
                  'disabled:opacity-40 disabled:cursor-not-allowed',
                  'min-h-[36px] min-w-[36px]'
                )}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                aria-label="الصفحة التالية"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </WidgetCard>
  );
}

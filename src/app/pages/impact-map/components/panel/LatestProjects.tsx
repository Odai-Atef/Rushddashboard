/**
 * LatestProjects — Right Panel Section 4
 *
 * Card list of latest projects with status badges, funding, beneficiaries, progress.
 */

import { motion } from 'motion/react';
import { cn } from '@/app/utils/cn';
import { Eye } from 'lucide-react';
import { WidgetCard } from '../widgets/WidgetCard';
import { StatusBadge } from '../widgets/StatusBadge';
import { ProgressBar } from '../widgets/ProgressBar';
import type { LatestProject } from '../../types/analytics';

export interface LatestProjectsProps {
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
];

function formatFunding(amount: number): string {
  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(0)}M ر.س.`;
  }
  return `${(amount / 1_000).toFixed(0)}K ر.س.`;
}

export function LatestProjects({
  projects = DEFAULT_PROJECTS,
  isLoading,
  isError,
  onRetry,
  onViewProject,
  className,
}: LatestProjectsProps) {
  return (
    <WidgetCard
      title="أحدث المشاريع"
      description="آخر المشاريع المضافة"
      isLoading={isLoading}
      isError={isError}
      onRetry={onRetry}
      emptyTitle="لا توجد مشاريع"
      className={className}
    >
      <div className="space-y-3">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            className={cn(
              'p-4 rounded-xl border border-[var(--border)]',
              'bg-[var(--card)]',
              'transition-all duration-150 ease-out',
              'hover:translate-y-[-2px] hover:shadow-[var(--shadow-md)]',
              'cursor-pointer',
              'focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40'
            )}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              delay: index * 0.06,
              ease: 'easeOut',
            }}
            onClick={() => onViewProject?.(project)}
            tabIndex={0}
            role="button"
            aria-label={`عرض مشروع ${project.nameAr}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onViewProject?.(project);
              }
            }}
          >
            {/* Header: Status + Region */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <StatusBadge status={project.status} />
              <span className="text-xs text-[var(--text-muted)]">
                {project.regionAr}
              </span>
            </div>

            {/* Project Name */}
            <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-1 truncate">
              {project.nameAr}
            </h4>

            {/* Sector */}
            <p className="text-xs text-[var(--text-muted)] mb-3">
              {project.sectorAr}
            </p>

            {/* Metrics */}
            <div className="flex items-center gap-3 text-xs text-[var(--text-muted)] mb-3">
              <span>{formatFunding(project.funding)}</span>
              <span className="text-[var(--border)]">|</span>
              <span>{project.beneficiaries.toLocaleString('ar-SA')} مستفيد</span>
            </div>

            {/* Progress */}
            <div className="mb-3">
              <ProgressBar
                progress={project.progress}
                showLabel
                color={
                  project.status === 'completed'
                    ? '#22C55E'
                    : project.status === 'delayed'
                      ? '#F59E0B'
                      : '#2563EB'
                }
              />
            </div>

            {/* Action */}
            <button
              className={cn(
                'w-full flex items-center justify-center gap-2',
                'px-3 py-2 rounded-lg text-xs font-medium',
                'bg-[var(--primary)]/10 text-[var(--primary)]',
                'hover:bg-[var(--primary)]/20 transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40',
                'min-h-[36px]'
              )}
              onClick={(e) => {
                e.stopPropagation();
                onViewProject?.(project);
              }}
              aria-label={`عرض المشروع ${project.nameAr}`}
            >
              <Eye className="w-3.5 h-3.5" />
              عرض المشروع
            </button>
          </motion.div>
        ))}
      </div>
    </WidgetCard>
  );
}

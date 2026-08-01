/**
 * Impact Map Dashboard — Main Page
 *
 * Executive dashboard page "خارطة الأثر" accessible only to project-manager role.
 * Foundation: routing, permissions, layout, and reusable page structure.
 */

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/app/components/ui/breadcrumb';
import {
  ImpactHeader,
  ImpactStatsGrid,
  ImpactMapSection,
  ImpactLeftPanel,
  ImpactRightPanel,
  ImpactSROISection,
  ImpactSectorSection,
  ImpactBeneficiariesSection,
  ImpactFundingSection,
  ImpactRegionalSection,
  ImpactProjectsSection,
  LatestProjects,
  RecentActivity,
} from './components';
import {
  mockKPIs,
  mockRegions,
  mockSectors,
  mockProjects,
  mockSROI,
  mockActivities,
  beneficiariesDistribution,
  sroiTrendData,
  projectsBySector,
  fundingGrowthData,
  regionalImpactData,
  /* ─── Analytics Mock Data ─── */
  mockImpactSummaryMetrics,
  mockBeneficiaryCategories,
  mockRegionalSummary,
  mockLatestProjects,
  mockRecentActivity,
  mockQuickStatistics,
  mockLatestSupportedProjects,
  mockTopPerformingRegions,
  mockBottomKpiMetrics,
} from './mock';
import { useAuth } from '@/app/layouts/RootLayout';
import { cn } from '@/app/utils/cn';
import './styles/impact-theme.css';

export function ImpactPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const roleSlug = user?.roleSlug ?? null;

  // UI State
  const [isLoading] = useState(false);
  const [isError] = useState(false);
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);

  // Filters state (reserved for future implementation)
  const [filters] = useState({
    year: null as number | null,
    regionId: null as string | null,
    sectorId: null as string | null,
    fundingProgramId: null as string | null,
    organizationId: null as string | null,
    searchQuery: '',
  });

  // Date range state (reserved for future implementation)
  const [dateRange] = useState({
    start: null as string | null,
    end: null as string | null,
  });

  const handleRegionSelect = useCallback((regionId: string) => {
    setSelectedRegionId((prev) => (prev === regionId ? null : regionId));
  }, []);

  const handleRetry = useCallback(() => {
    // Retry logic will be implemented with API integration
    // Retry logic placeholder
  }, []);

  const handleViewAllProjects = useCallback(() => {
    navigate('/dashboard/project-management/list');
  }, [navigate]);

  const handleViewProject = useCallback((project: { id: string; nameAr: string }) => {
    navigate(`/dashboard/project-management/${project.id}`);
  }, [navigate]);

  // If user manually navigates here without permission, RoleRouteGuard will redirect them.
  // We add a secondary guard here for defense-in-depth.
  if (roleSlug !== 'project-managers') {
    return null; // RoleRouteGuard handles the redirect
  }

  return (
    <div className="min-h-full bg-background space-y-[var(--spacing-section-gap)] animate-fade-in">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-2">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink onClick={() => navigate('/dashboard')} className="cursor-pointer">
                لوحة التحكم
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>خارطة الأثر</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </nav>

      {/* Filter Bar — Reserved for future filters */}
      <div
        className={cn(
          'bg-[var(--card)] rounded-[var(--radius-card)] border border-[var(--border)]',
          'shadow-[var(--shadow-card)] p-[var(--spacing-card-padding)]',
          'flex flex-wrap items-center gap-[var(--spacing-small-gap)]'
        )}
      >
        <span className="text-sm font-medium text-[var(--text-muted)] flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[var(--primary)]"></span>
          الفلاتر:
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <FilterPlaceholder label="السنة" />
          <FilterPlaceholder label="المنطقة" />
          <FilterPlaceholder label="القطاع" />
          <FilterPlaceholder label="برنامج التمويل" />
          <FilterPlaceholder label="الجهة" />
          <FilterPlaceholder label="البحث" />
        </div>
      </div>

      {/* Executive Header */}
      <ImpactHeader />

      {/* Top KPI Section */}
      <section aria-label="المؤشرات الرئيسية">
        <ImpactStatsGrid
          kpis={mockKPIs}
          isLoading={isLoading}
          isError={isError}
          onRetry={handleRetry}
        />
      </section>

      {/* Map Row — Three balanced columns */}
      <section aria-label="الخارطة ولوحة التحليلات">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[var(--spacing-grid-gap)] items-stretch">
          {/* Left Analytics — 3 columns */}
          <div className="hidden lg:flex lg:col-span-3 flex-col h-full min-h-[420px] md:min-h-[550px] lg:min-h-[720px]">
            <ImpactLeftPanel
              summaryMetrics={mockImpactSummaryMetrics}
              quickStatistics={mockQuickStatistics}
              isLoading={isLoading}
              isError={isError}
              onRetry={handleRetry}
              className="h-full overflow-y-auto"
            />
          </div>

          {/* Map — 6 columns, visually dominant */}
          <div className="lg:col-span-6 flex flex-col h-full min-h-[420px] md:min-h-[550px] lg:min-h-[720px]">
            <ImpactMapSection
              regions={mockRegions}
              isLoading={isLoading}
              isError={isError}
              onRetry={handleRetry}
              selectedRegionId={selectedRegionId}
              onRegionSelect={handleRegionSelect}
              className="h-full"
            />
          </div>

          {/* Right Analytics — 3 columns */}
          <div className="hidden lg:flex lg:col-span-3 flex-col h-full min-h-[420px] md:min-h-[550px] lg:min-h-[720px]">
            <ImpactRightPanel
              beneficiaryCategories={mockBeneficiaryCategories}
              regionalSummary={mockRegionalSummary}
              isLoading={isLoading}
              isError={isError}
              onRetry={handleRetry}
              className="h-full overflow-y-auto"
            />
          </div>

          {/* Tablet/Mobile: full-width widgets stacked below map */}
          <div className="lg:hidden flex flex-col gap-[var(--spacing-grid-gap)]">
            <ImpactLeftPanel
              summaryMetrics={mockImpactSummaryMetrics}
              quickStatistics={mockQuickStatistics}
              isLoading={isLoading}
              isError={isError}
              onRetry={handleRetry}
            />
            <ImpactRightPanel
              beneficiaryCategories={mockBeneficiaryCategories}
              regionalSummary={mockRegionalSummary}
              isLoading={isLoading}
              isError={isError}
              onRetry={handleRetry}
            />
          </div>
        </div>
      </section>

      {/* Row 3: Detailed Analytics — 3 medium cards */}
      <section aria-label="التحليلات التفصيلية">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[var(--spacing-grid-gap)]">
          <ImpactBeneficiariesSection
            data={beneficiariesDistribution}
            isLoading={isLoading}
            isError={isError}
            onRetry={handleRetry}
          />
          <ImpactSROISection
            sroiData={mockSROI}
            isLoading={isLoading}
            isError={isError}
            onRetry={handleRetry}
          />
          <ImpactFundingSection
            data={fundingGrowthData}
            isLoading={isLoading}
            isError={isError}
            onRetry={handleRetry}
          />
        </div>
      </section>

      {/* Row 4: Sector + Regional */}
      <section aria-label="التحليل حسب القطاع والمنطقة">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[var(--spacing-grid-gap)]">
          <ImpactSectorSection
            sectors={mockSectors}
            isLoading={isLoading}
            isError={isError}
            onRetry={handleRetry}
          />
          <ImpactRegionalSection
            data={regionalImpactData}
            isLoading={isLoading}
            isError={isError}
            onRetry={handleRetry}
          />
        </div>
      </section>

      {/* Row 5: Bottom KPI Strip + Projects Table + Regional Ranking */}
      <section aria-label="المشاريع والأداء الإقليمي">
        <div className="space-y-[var(--spacing-grid-gap)]">
          <ImpactProjectsSection
            latestSupportedProjects={mockLatestSupportedProjects}
            topPerformingRegions={mockTopPerformingRegions}
            bottomKpiMetrics={mockBottomKpiMetrics}
            isLoading={isLoading}
            isError={isError}
            onRetry={handleRetry}
            onViewProject={handleViewProject}
          />
        </div>
      </section>

      {/* Row 6: Latest Projects + Recent Activity */}
      <section aria-label="المشاريع والنشاطات الأخيرة">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[var(--spacing-grid-gap)]">
          <LatestProjects
            projects={mockLatestProjects}
            isLoading={isLoading}
            isError={isError}
            onRetry={handleRetry}
            onViewProject={handleViewProject}
          />
          <RecentActivity
            activities={mockRecentActivity}
            isLoading={isLoading}
            isError={isError}
            onRetry={handleRetry}
          />
        </div>
      </section>

      {/* Row 7: Recent Projects (full-width list) */}
      <section aria-label="أحدث المشاريع المدعومة">
        <ImpactProjectsSection
          projects={mockProjects}
          isLoading={isLoading}
          isError={isError}
          onRetry={handleRetry}
          onViewAll={handleViewAllProjects}
        />
      </section>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────── */
/*  Filter Placeholder Component                                    */
/* ──────────────────────────────────────────────────────────────── */

function FilterPlaceholder({ label }: { label: string }) {
  return (
    <button
      disabled
      className={cn(
        'px-3 py-1.5 rounded-[12px] text-sm text-[var(--text-muted)]',
        'bg-[var(--hover)]/50 border border-[var(--border)]',
        'cursor-not-allowed opacity-60',
        'focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30',
        'min-h-[32px]'
      )}
      aria-label={`فلتر ${label} - قيد التطوير`}
    >
      {label}
    </button>
  );
}

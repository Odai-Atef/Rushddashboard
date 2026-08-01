/**
 * Impact Map Dashboard — Main Page
 *
 * Executive dashboard page "خارطة الأثر" accessible only to project-manager role.
 * Foundation: routing, permissions, layout, and reusable page structure.
 * Charts and interactive map will be implemented in future iterations.
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
  ImpactSidebar,
  ImpactSROISection,
  ImpactSectorSection,
  ImpactProjectsSection,
} from './components';
import {
  mockKPIs,
  mockRegions,
  mockSectors,
  mockProjects,
  mockSROI,
  mockActivities,
} from './mock';
import { cn } from '@/app/utils/cn';
import { useAuth } from '@/app/layouts/RootLayout';

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
    console.log('Retry loading data...');
  }, []);

  const handleViewAllProjects = useCallback(() => {
    navigate('/dashboard/project-management/list');
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

      {/* Map & Analytics Panel */}
      <section aria-label="الخارطة ولوحة التحليلات">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-[var(--spacing-grid-gap)]">
          {/* Map — takes 2 columns on desktop */}
          <div className="lg:col-span-2">
            <ImpactMapSection
              regions={mockRegions}
              isLoading={isLoading}
              isError={isError}
              onRetry={handleRetry}
              selectedRegionId={selectedRegionId}
              onRegionSelect={handleRegionSelect}
            />
          </div>

          {/* Right Analytics Panel */}
          <div className="lg:col-span-1">
            <ImpactSidebar
              regions={mockRegions}
              isLoading={isLoading}
              isError={isError}
              onRetry={handleRetry}
              selectedRegionId={selectedRegionId}
            />
          </div>
        </div>
      </section>

      {/* SROI Analytics & Projects by Sector */}
      <section aria-label="تحليلات SROI والقطاعات">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[var(--spacing-grid-gap)]">
          <ImpactSROISection
            sroiData={mockSROI}
            isLoading={isLoading}
            isError={isError}
            onRetry={handleRetry}
          />
          <ImpactSectorSection
            sectors={mockSectors}
            isLoading={isLoading}
            isError={isError}
            onRetry={handleRetry}
          />
        </div>
      </section>

      {/* Recent Projects */}
      <section aria-label="أحدث المشاريع">
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
        'px-3 py-1.5 rounded-md text-sm text-[var(--text-muted)]',
        'bg-[var(--hover)]/50 border border-[var(--border)]',
        'cursor-not-allowed opacity-60',
        'focus:outline-none'
      )}
      aria-label={`فلتر ${label} - قيد التطوير`}
    >
      {label}
    </button>
  );
}

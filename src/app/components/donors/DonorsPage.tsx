/**
 * Donors Page
 *
 * Main container component for the donors list feature.
 * Provides a dashboard landing view with KPI cards and quick actions,
 * plus a detailed table view with pagination, filters, and a detail drawer.
 */

import { useState, useMemo } from 'react';
import {
  Building2,
  CheckCircle2,
  Target,
  AlertCircle,
  TrendingUp,
  ArrowRight,
  List,
  Bell,
  BarChart3,
  Clock,
  Plus,
  Activity,
} from 'lucide-react';
import { useDonors } from '@/api/hooks/useDonors';
import { useDebounce } from '@/app/hooks/useDebounce';
import { DonorsTable } from './DonorsTable';
import { DonorsPagination } from './DonorsPagination';
import { DonorsFilters } from './DonorsFilters';
import { LoadingState } from './LoadingState';
import { EmptyState } from './EmptyState';
import { ErrorState } from './ErrorState';
import { DonorDetailDrawer } from './DonorDetailDrawer';
import { Donor, DonorType } from '@/types/donors';

type ViewType = 'dashboard' | 'table';

export function DonorsPage() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<DonorType | null>(null);
  const [selectedFundingArea, setSelectedFundingArea] = useState<string | null>(null);
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 300);

  const { data: donors, total, totalPages, isLoading, isError, error, refetch } = useDonors(page, limit);

  // Stats derived from real data
  const stats = useMemo(() => {
    const withWebsite = donors.filter((d) => d.website).length;
    const withContact = donors.filter((d) => d.email || d.phone).length;
    const areas = new Set<string>();
    donors.forEach((d) =>
      d.fundingAreas.forEach((r) => areas.add(r.fundingArea.name))
    );
    return {
      totalDonors: total,
      withWebsite,
      withContact,
      totalFundingAreas: areas.size,
    };
  }, [donors, total]);

  // Extract unique funding areas from all donors for the filter dropdown
  const availableFundingAreas = useMemo(() => {
    const areas = new Set<string>();
    donors.forEach((donor) => {
      donor.fundingAreas.forEach((relation) => {
        areas.add(relation.fundingArea.name);
      });
    });
    return Array.from(areas).sort();
  }, [donors]);

  // Apply client-side filtering
  const filteredDonors = useMemo(() => {
    return donors.filter((donor) => {
      if (debouncedSearch) {
        const searchLower = debouncedSearch.toLowerCase();
        const nameMatch = donor.name.toLowerCase().includes(searchLower);
        if (!nameMatch) return false;
      }
      if (selectedType && donor.type !== selectedType) {
        return false;
      }
      if (selectedFundingArea) {
        const hasArea = donor.fundingAreas.some(
          (relation) => relation.fundingArea.name === selectedFundingArea
        );
        if (!hasArea) return false;
      }
      return true;
    });
  }, [donors, debouncedSearch, selectedType, selectedFundingArea]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (debouncedSearch) count++;
    if (selectedType) count++;
    if (selectedFundingArea) count++;
    return count;
  }, [debouncedSearch, selectedType, selectedFundingArea]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

  const handleTypeChange = (type: DonorType | null) => {
    setSelectedType(type);
    setPage(1);
  };

  const handleFundingAreaChange = (area: string | null) => {
    setSelectedFundingArea(area);
    setPage(1);
  };

  const handleClearAll = () => {
    setSearchQuery('');
    setSelectedType(null);
    setSelectedFundingArea(null);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleRowClick = (donor: Donor) => {
    setSelectedDonor(donor);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setTimeout(() => setSelectedDonor(null), 300);
  };

  const hasFilters = activeFiltersCount > 0;

  const goToTable = () => {
    setCurrentView('table');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToDashboard = () => {
    setCurrentView('dashboard');
    setPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6 p-6">
      {currentView === 'dashboard' && (
        <>
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold mb-2">لوحة قاعدة الجهات المانحة</h1>
            <p className="text-muted-foreground">نظرة شاملة على الجهات المانحة وفرص التمويل</p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-chart-1/10 rounded-lg">
                  <Building2 className="w-5 h-5 text-chart-1" />
                </div>
                <span className="text-sm text-green-600 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  +12%
                </span>
              </div>
              <p className="text-3xl font-bold">{stats.totalDonors}</p>
              <p className="text-sm text-muted-foreground mt-1">إجمالي الجهات المانحة</p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-chart-2/10 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-chart-2" />
                </div>
              </div>
              <p className="text-3xl font-bold text-green-600">{stats.withContact}</p>
              <p className="text-sm text-muted-foreground mt-1">جهات بها بيانات تواصل</p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-chart-3/10 rounded-lg">
                  <Target className="w-5 h-5 text-chart-3" />
                </div>
              </div>
              <p className="text-3xl font-bold text-chart-3">{stats.totalFundingAreas}</p>
              <p className="text-sm text-muted-foreground mt-1">مجالات تمويل مسجلة</p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-chart-4/10 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-chart-4" />
                </div>
              </div>
              <p className="text-3xl font-bold text-chart-4">{stats.withWebsite}</p>
              <p className="text-sm text-muted-foreground mt-1">جهات لديها موقع إلكتروني</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={goToTable}
              className="p-6 bg-card border-2 border-dashed border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-colors text-center"
            >
              <List className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <p className="font-medium text-sm">تصفح الجهات المانحة</p>
            </button>
            <button
              onClick={goToTable}
              className="p-6 bg-card border-2 border-dashed border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-colors text-center"
            >
              <Target className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <p className="font-medium text-sm">فرص التمويل</p>
            </button>
            <button
              onClick={goToTable}
              className="p-6 bg-card border-2 border-dashed border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-colors text-center"
            >
              <Bell className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <p className="font-medium text-sm">التنبيهات والمتابعة</p>
            </button>
            <button
              onClick={goToTable}
              className="p-6 bg-card border-2 border-dashed border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-colors text-center"
            >
              <BarChart3 className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <p className="font-medium text-sm">التحليلات</p>
            </button>
          </div>

          {/* Recent Updates */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="p-6 border-b border-border">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-purple-600" />
                  <h3 className="text-lg">آخر التحديثات</h3>
                </div>
              </div>
              <div className="p-4 space-y-3">
                {donors.slice(0, 3).map((donor, idx) => (
                  <div key={donor.id} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      {idx === 0 ? (
                        <Plus className="w-4 h-4 text-primary" />
                      ) : idx === 1 ? (
                        <Clock className="w-4 h-4 text-primary" />
                      ) : (
                        <Activity className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{donor.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {donor.fundingAreas.length > 0
                          ? donor.fundingAreas.map((r) => r.fundingArea.name).slice(0, 2).join('، ')
                          : 'تحديث بيانات'}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {new Date(donor.lastUpdatedAt).toLocaleDateString('ar-SA')}
                      </span>
                    </div>
                  </div>
                ))}
                {donors.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">لا توجد بيانات حالياً</p>
                )}
              </div>
            </div>

            {/* Upcoming Deadlines (placeholder using lastUpdatedAt) */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="p-6 border-b border-border">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-red-600" />
                  <h3 className="text-lg">آخر التحديثات القادمة</h3>
                </div>
              </div>
              <div className="p-4 space-y-3">
                {donors.slice(0, 3).map((donor) => (
                  <div
                    key={donor.id}
                    className="flex items-start justify-between p-3 bg-red-500/5 rounded-lg border border-red-500/10"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">{donor.name}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {donor.geographicScope || '—'}
                      </p>
                    </div>
                    <div className="text-left">
                      <span className="text-xs font-medium text-red-600">
                        {new Date(donor.lastUpdatedAt).toLocaleDateString('ar-SA')}
                      </span>
                    </div>
                  </div>
                ))}
                {donors.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">لا توجد بيانات حالياً</p>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {currentView === 'table' && (
        <>
          {/* Back + Header */}
          <div className="flex items-center gap-4">
            <button
              onClick={goToDashboard}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold mb-2">قاعدة الجهات المانحة</h1>
              <p className="text-muted-foreground">تصفح وابحث في قائمة الجهات المانحة</p>
            </div>
          </div>

          {/* Filters */}
          <DonorsFilters
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            selectedType={selectedType}
            onTypeChange={handleTypeChange}
            selectedFundingArea={selectedFundingArea}
            onFundingAreaChange={handleFundingAreaChange}
            availableFundingAreas={availableFundingAreas}
            activeFiltersCount={activeFiltersCount}
            onClearAll={handleClearAll}
          />

          {/* Content */}
          <div className="bg-card rounded-xl border border-border shadow-sm">
            {isLoading && <LoadingState />}

            {isError && !isLoading && (
              <ErrorState error={error} onRetry={refetch} />
            )}

            {!isLoading && !isError && filteredDonors.length === 0 && (
              <EmptyState hasFilters={hasFilters} onClearFilters={hasFilters ? handleClearAll : undefined} />
            )}

            {!isLoading && !isError && filteredDonors.length > 0 && (
              <>
                <DonorsTable donors={filteredDonors} onRowClick={handleRowClick} />
                <DonorsPagination
                  page={page}
                  totalPages={totalPages}
                  limit={limit}
                  total={total}
                  onPageChange={handlePageChange}
                  onLimitChange={handleLimitChange}
                />
              </>
            )}
          </div>
        </>
      )}

      {/* Detail Drawer */}
      <DonorDetailDrawer
        donor={selectedDonor}
        open={drawerOpen}
        onClose={handleCloseDrawer}
      />
    </div>
  );
}

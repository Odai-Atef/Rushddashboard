/**
 * Donors Page
 *
 * Main container component for the donors list feature.
 * Wires together the table, pagination, filters, loading states, and error handling.
 */

import { useState, useMemo } from 'react';
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

export function DonorsPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<DonorType | null>(null);
  const [selectedFundingArea, setSelectedFundingArea] = useState<string | null>(null);
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 300);

  const { data: donors, total, totalPages, isLoading, isError, error, refetch } = useDonors(page, limit);

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
      // Search by name (case-insensitive)
      if (debouncedSearch) {
        const searchLower = debouncedSearch.toLowerCase();
        const nameMatch = donor.name.toLowerCase().includes(searchLower);
        if (!nameMatch) return false;
      }

      // Filter by type
      if (selectedType && donor.type !== selectedType) {
        return false;
      }

      // Filter by funding area
      if (selectedFundingArea) {
        const hasArea = donor.fundingAreas.some(
          (relation) => relation.fundingArea.name === selectedFundingArea
        );
        if (!hasArea) return false;
      }

      return true;
    });
  }, [donors, debouncedSearch, selectedType, selectedFundingArea]);

  // Calculate active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (debouncedSearch) count++;
    if (selectedType) count++;
    if (selectedFundingArea) count++;
    return count;
  }, [debouncedSearch, selectedType, selectedFundingArea]);

  // Reset to page 1 when filters change
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

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">قاعدة الجهات المانحة</h1>
        <p className="text-muted-foreground">تصفح وابحث في قائمة الجهات المانحة</p>
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

      {/* Detail Drawer */}
      <DonorDetailDrawer
        donor={selectedDonor}
        open={drawerOpen}
        onClose={handleCloseDrawer}
      />
    </div>
  );
}

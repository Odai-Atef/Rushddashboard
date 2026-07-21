import { useState, useEffect } from 'react';
import { Building2 } from 'lucide-react';
import { useOrganizationDonors } from '@/api/hooks/useOrganizationDonors';
import { projectService } from '@/api/services/project-service';
import { OrganizationDonorMatch } from '@/api/services/project-service';
import { DonorDetailDrawer } from '@/app/components/donor-matching/DonorDetailDrawer';
import { OrganizationDonorsFilters } from './OrganizationDonorsFilters';
import { OrganizationDonorsTable } from './OrganizationDonorsTable';

export function OrganizationDonorsPage() {
  const {
    donors,
    total,
    isLoading,
    error,
    applyFilters,
    clearFilters,
    refetch,
  } = useOrganizationDonors();

  const [projects, setProjects] = useState<{ id: string; name: string }[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [projectFilter, setProjectFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Drawer state
  const [selectedDonor, setSelectedDonor] = useState<OrganizationDonorMatch | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Fetch projects for the dropdown
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await projectService.getProjects({ page: 1, limit: 100 });
        const body = res.data as any;
        const list = body?.data ?? [];
        setProjects(
          list.map((p: any) => ({ id: p.id, name: p.name })).sort((a: any, b: any) =>
            a.name.localeCompare(b.name, 'ar')
          )
        );
      } catch (err) {
        // silently fail
      }
    };
    loadProjects();
  }, []);

  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
    applyFilters({
      status: status || undefined,
      projectId: projectFilter || undefined,
      search: searchQuery || undefined,
    });
  };

  const handleProjectChange = (projectId: string) => {
    setProjectFilter(projectId);
    applyFilters({
      status: statusFilter || undefined,
      projectId: projectId || undefined,
      search: searchQuery || undefined,
    });
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    applyFilters({
      status: statusFilter || undefined,
      projectId: projectFilter || undefined,
      search: query || undefined,
    });
  };

  const handleClear = () => {
    setStatusFilter('');
    setProjectFilter('');
    setSearchQuery('');
    clearFilters();
  };

  const handleRowClick = (donor: OrganizationDonorMatch) => {
    setSelectedDonor(donor);
    setDrawerOpen(true);
  };

  return (
    <div className="space-y-5" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold">الجهات المانحة</h1>
            <p className="text-sm text-muted-foreground">
              عرض {donors.length} من {total} جهة مانحة مقدمة
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <OrganizationDonorsFilters
        projects={projects}
        statusFilter={statusFilter}
        projectFilter={projectFilter}
        searchQuery={searchQuery}
        onStatusChange={handleStatusChange}
        onProjectChange={handleProjectChange}
        onSearchChange={handleSearchChange}
        onClear={handleClear}
        isLoading={isLoading}
      />

      {/* Error */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm text-right">
          {error}
          <button
            onClick={refetch}
            className="mr-3 text-sm text-red-600 hover:text-red-800 underline"
          >
            إعادة المحاولة
          </button>
        </div>
      )}

      {/* Table */}
      <OrganizationDonorsTable
        donors={donors}
        onRowClick={handleRowClick}
      />

      {/* Detail Drawer */}
      <DonorDetailDrawer
        donor={selectedDonor}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onStatusChange={refetch}
        isExecution={true}
      />
    </div>
  );
}

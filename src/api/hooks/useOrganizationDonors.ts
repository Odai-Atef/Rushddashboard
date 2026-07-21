import { useState, useEffect, useCallback, useRef } from 'react';
import { projectService, OrganizationDonorMatch } from '@/api/services/project-service';
import { toast } from 'sonner';

export interface OrganizationDonorsFilters {
  status?: string;
  projectId?: string;
  search?: string;
}

export interface UseOrganizationDonorsReturn {
  donors: OrganizationDonorMatch[];
  total: number;
  isLoading: boolean;
  error: string | null;
  filters: OrganizationDonorsFilters;
  setFilters: (filters: OrganizationDonorsFilters) => void;
  applyFilters: () => void;
  clearFilters: () => void;
  refetch: () => void;
}

export function useOrganizationDonors(): UseOrganizationDonorsReturn {
  const [donors, setDonors] = useState<OrganizationDonorMatch[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<OrganizationDonorsFilters>({});
  const [activeFilters, setActiveFilters] = useState<OrganizationDonorsFilters>({});
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const res = await projectService.getEntityManagerDonorMatches({
        status: activeFilters.status,
        projectId: activeFilters.projectId,
        search: activeFilters.search,
        limit: 200,
        offset: 0,
      });

      // apiClient returns { success, data } where data is the raw API body
      // Raw body: { success: true, data: [...donors], total: N }
      const body = res.data as any;
      const donorsData = Array.isArray(body?.data) ? body.data : [];
      const totalCount = body?.total ?? 0;

      if (res.success) {
        setDonors(donorsData);
        setTotal(totalCount);
      } else {
        throw new Error(res.message || 'فشل تحميل بيانات الجهات المانحة');
      }
    } catch (err: any) {
      if (err?.name === 'AbortError') return;
      const message = err?.message || 'حدث خطأ أثناء تحميل البيانات';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [activeFilters]);

  useEffect(() => {
    fetch();
    return () => {
      abortControllerRef.current?.abort();
    };
  }, [fetch]);

  const applyFilters = useCallback(() => {
    setActiveFilters(filters);
  }, [filters]);

  const clearFilters = useCallback(() => {
    setFilters({});
    setActiveFilters({});
  }, []);

  const refetch = useCallback(() => {
    fetch();
  }, [fetch]);

  return {
    donors,
    total,
    isLoading,
    error,
    filters,
    setFilters,
    applyFilters,
    clearFilters,
    refetch,
  };
}

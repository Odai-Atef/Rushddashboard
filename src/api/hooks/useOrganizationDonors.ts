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
  applyFilters: (filters: OrganizationDonorsFilters) => void;
  clearFilters: () => void;
  refetch: () => void;
}

export function useOrganizationDonors(): UseOrganizationDonorsReturn {
  const [donors, setDonors] = useState<OrganizationDonorMatch[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<OrganizationDonorsFilters>({});
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetch = useCallback(async (filters: OrganizationDonorsFilters = {}) => {
    setIsLoading(true);
    setError(null);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const res = await projectService.getEntityManagerDonorMatches({
        status: filters.status,
        projectId: filters.projectId,
        search: filters.search,
        limit: 200,
        offset: 0,
      });

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
  }, []);

  useEffect(() => {
    fetch(activeFilters);
    return () => {
      abortControllerRef.current?.abort();
    };
  }, [fetch, activeFilters]);

  const applyFilters = useCallback((filters: OrganizationDonorsFilters) => {
    setActiveFilters(filters);
  }, []);

  const clearFilters = useCallback(() => {
    setActiveFilters({});
  }, []);

  const refetch = useCallback(() => {
    fetch(activeFilters);
  }, [fetch, activeFilters]);

  return {
    donors,
    total,
    isLoading,
    error,
    applyFilters,
    clearFilters,
    refetch,
  };
}

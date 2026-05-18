import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Dashboard, Widget, FilterValue } from '../types/dashboard';

interface DashboardContextType {
  // Dashboard list state
  dashboards: Dashboard[];
  setDashboards: (dashboards: Dashboard[]) => void;
  isLoadingDashboards: boolean;
  setIsLoadingDashboards: (loading: boolean) => void;
  dashboardsError: string | null;
  setDashboardsError: (error: string | null) => void;

  // Selected dashboard state
  selectedDashboard: Dashboard | null;
  setSelectedDashboard: (dashboard: Dashboard | null) => void;
  widgets: Widget[];
  setWidgets: (widgets: Widget[]) => void;
  isLoadingDashboard: boolean;
  setIsLoadingDashboard: (loading: boolean) => void;
  dashboardError: string | null;
  setDashboardError: (error: string | null) => void;

  // Filter state
  activeFilters: FilterValue[];
  setActiveFilters: (filters: FilterValue[]) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  // Dashboard list state
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [isLoadingDashboards, setIsLoadingDashboards] = useState(false);
  const [dashboardsError, setDashboardsError] = useState<string | null>(null);

  // Selected dashboard state
  const [selectedDashboard, setSelectedDashboard] = useState<Dashboard | null>(null);
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(false);
  const [dashboardError, setDashboardError] = useState<string | null>(null);

  // Filter state
  const [activeFilters, setActiveFilters] = useState<FilterValue[]>([]);

  const value: DashboardContextType = {
    dashboards,
    setDashboards: useCallback((d) => setDashboards(d), []),
    isLoadingDashboards,
    setIsLoadingDashboards: useCallback((l) => setIsLoadingDashboards(l), []),
    dashboardsError,
    setDashboardsError: useCallback((e) => setDashboardsError(e), []),
    selectedDashboard,
    setSelectedDashboard: useCallback((d) => setSelectedDashboard(d), []),
    widgets,
    setWidgets: useCallback((w) => setWidgets(w), []),
    isLoadingDashboard,
    setIsLoadingDashboard: useCallback((l) => setIsLoadingDashboard(l), []),
    dashboardError,
    setDashboardError: useCallback((e) => setDashboardError(e), []),
    activeFilters,
    setActiveFilters: useCallback((f) => setActiveFilters(f), []),
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboardContext() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboardContext must be used within a DashboardProvider');
  }
  return context;
}

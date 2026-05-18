import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { AnalysisCategory, FilterParameters, SavedAnalysis } from '../types/analysis';

interface AnalysisState {
  categories: AnalysisCategory[];
  selectedCategory: AnalysisCategory | null;
  filters: FilterParameters;
  savedAnalyses: SavedAnalysis[];
  isLoadingCategories: boolean;
  isLoadingAnalytics: boolean;
  isLoadingInsights: boolean;
  categoriesError: string | null;
  analyticsError: string | null;
  insightsError: string | null;
}

interface AnalysisContextType extends AnalysisState {
  setCategories: (categories: AnalysisCategory[]) => void;
  setSelectedCategory: (category: AnalysisCategory | null) => void;
  setFilters: (filters: FilterParameters) => void;
  setSavedAnalyses: (analyses: SavedAnalysis[]) => void;
  setIsLoadingCategories: (loading: boolean) => void;
  setIsLoadingAnalytics: (loading: boolean) => void;
  setIsLoadingInsights: (loading: boolean) => void;
  setCategoriesError: (error: string | null) => void;
  setAnalyticsError: (error: string | null) => void;
  setInsightsError: (error: string | null) => void;
  clearErrors: () => void;
}

const AnalysisContext = createContext<AnalysisContextType | null>(null);

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<AnalysisCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<AnalysisCategory | null>(null);
  const [filters, setFilters] = useState<FilterParameters>({});
  const [savedAnalyses, setSavedAnalyses] = useState<SavedAnalysis[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [analyticsError, setAnalyticsError] = useState<string | null>(null);
  const [insightsError, setInsightsError] = useState<string | null>(null);

  const clearErrors = useCallback(() => {
    setCategoriesError(null);
    setAnalyticsError(null);
    setInsightsError(null);
  }, []);

  return (
    <AnalysisContext.Provider
      value={{
        categories,
        selectedCategory,
        filters,
        savedAnalyses,
        isLoadingCategories,
        isLoadingAnalytics,
        isLoadingInsights,
        categoriesError,
        analyticsError,
        insightsError,
        setCategories,
        setSelectedCategory,
        setFilters,
        setSavedAnalyses,
        setIsLoadingCategories,
        setIsLoadingAnalytics,
        setIsLoadingInsights,
        setCategoriesError,
        setAnalyticsError,
        setInsightsError,
        clearErrors,
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysisContext() {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error('useAnalysisContext must be used within an AnalysisProvider');
  }
  return context;
}

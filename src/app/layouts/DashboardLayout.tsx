import { useState } from 'react';
import { Outlet, Navigate, useOutletContext, useLocation } from 'react-router';
import { useAuth } from './RootLayout';
import { Sidebar } from '../components/Sidebar';
import { TopBar } from '../components/TopBar';
import { MobileNav } from '../components/MobileNav';

interface ThemeContext {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

export function DashboardLayout() {
  const { isAuthenticated } = useAuth();
  const context = useOutletContext<ThemeContext>();
  const location = useLocation();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  // Map URL paths to activeView values for Sidebar/MobileNav
  const pathToView: Record<string, string> = {
    '/dashboard': 'executive',
    '/dashboard/ai-analysis': 'ai-analysis',
    '/dashboard/ai-innovation': 'ai-innovation',
    '/dashboard/analysis-history': 'analysis-history',
    '/dashboard/project-journey': 'project-journey',
    '/dashboard/project-management': 'project-management',
    '/dashboard/collaboration': 'collaboration',
    '/dashboard/donors': 'donors',
    '/dashboard/incubator-overview': 'incubator-overview',
    '/dashboard/charity-analytics': 'charity-analytics',
    '/dashboard/project-analytics': 'project-analytics',
    '/dashboard/funding-analytics': 'funding-analytics',
    '/dashboard/operations-analytics': 'operations-analytics',
    '/dashboard/donor-matching': 'donor-matching',
    '/dashboard/charity-assessment': 'charity-assessment',
    '/dashboard/onboarding': 'onboarding',
    '/dashboard/notifications': 'notifications',
    '/dashboard/data-sources': 'data-sources',
    '/dashboard/compliance-risk': 'compliance-risk',
    '/dashboard/sales': 'sales',
    '/dashboard/customers': 'customers',
    '/dashboard/profitability': 'profitability',
    '/dashboard/inventory': 'inventory',
    '/dashboard/operations': 'operations',
    '/dashboard/hr': 'hr',
    '/dashboard/marketing': 'marketing',
    '/dashboard/recommendations': 'recommendations',
    '/dashboard/opportunities': 'opportunities',
    '/dashboard/settings': 'settings',
  };

  const activeView =
    pathToView[location.pathname] ||
    (location.pathname.startsWith('/dashboard/onboarding') ? 'onboarding' :
     location.pathname.startsWith('/dashboard/project-management') ? 'project-management' :
     'executive');

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar activeView={activeView} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar
          theme={context.theme}
          onThemeToggle={() => context.setTheme(context.theme === 'dark' ? 'light' : 'dark')}
          onMenuClick={() => setIsMobileNavOpen(true)}
        />

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        activeView={activeView}
      />
    </div>
  );
}

import { Outlet, Navigate, useOutletContext } from 'react-router';
import { useAuth } from './RootLayout';

interface ThemeContext {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

export function AuthLayout() {
  const { isAuthenticated, user } = useAuth();
  const context = useOutletContext<ThemeContext>();

  if (isAuthenticated) {
    const isProjectManager = user?.roleSlug === 'project-managers';
    return (
      <Navigate
        to={isProjectManager ? '/dashboard/project-management/list' : '/dashboard/charity-assessment'}
        replace
      />
    );
  }

  return <Outlet context={context} />;
}

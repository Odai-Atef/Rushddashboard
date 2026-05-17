import { Outlet, Navigate, useOutletContext } from 'react-router';
import { useAuth } from '../hooks/useAuth';

interface ThemeContext {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

export function AuthLayout() {
  const { isAuthenticated } = useAuth();
  const context = useOutletContext<ThemeContext>();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet context={context} />;
}

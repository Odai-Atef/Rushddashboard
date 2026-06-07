import { Outlet, Navigate, useOutletContext } from 'react-router';
import { useAuth } from './RootLayout';

interface ThemeContext {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

export function AuthLayout() {
  const { isAuthenticated } = useAuth();
  const context = useOutletContext<ThemeContext>();

  const noAuth = import.meta.env.VITE_NO_AUTH !== 'false';

  if (isAuthenticated && !noAuth) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet context={context} />;
}

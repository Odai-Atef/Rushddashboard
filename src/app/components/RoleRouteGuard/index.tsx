import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../../layouts/RootLayout';
import { isRouteAllowed } from '@/config/menuAccess';

export interface MenuItemDefinition {
  id: string;
  label: string;
  path: string;
}

interface RoleRouteGuardProps {
  menuItems: MenuItemDefinition[];
  children: React.ReactNode;
}

/**
 * Route guard that redirects to the safe fallback route when the current user
 * does not have access to the requested path based on their role slug.
 */
export function RoleRouteGuard({ menuItems, children }: RoleRouteGuardProps) {
  const { user } = useAuth();
  const location = useLocation();
  const roleSlug = user?.roleSlug ?? null;
  const currentPath = location.pathname;

  if (!isRouteAllowed(roleSlug, currentPath, menuItems)) {
    return <Navigate to="/dashboard/charity-assessment" replace />;
  }

  return <>{children}</>;
}

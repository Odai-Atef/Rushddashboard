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
 *
 * The charity-assessment landing page is always allowed regardless of role so
 * it can serve as the application's default entry point.
 */
export function RoleRouteGuard({ menuItems, children }: RoleRouteGuardProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const roleSlug = user?.roleSlug ?? null;
  const currentPath = location.pathname;

  if (isLoading) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const allowed = isRouteAllowed(roleSlug, currentPath, menuItems);

  if (currentPath === '/dashboard/charity-assessment') {
    return <>{children}</>;
  }

  if (!allowed) {
    return <Navigate to="/dashboard/charity-assessment" replace />;
  }

  return <>{children}</>;
}

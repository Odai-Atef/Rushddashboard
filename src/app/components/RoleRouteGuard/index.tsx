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

const DEFAULT_FALLBACK = '/dashboard/charity-assessment';
const PROJECT_MANAGER_FALLBACK = '/dashboard/project-management/list';

function getDefaultFallback(roleSlug: string | null): string {
  return roleSlug === 'project-managers' ? PROJECT_MANAGER_FALLBACK : DEFAULT_FALLBACK;
}

/**
 * Route guard that redirects to the safe fallback route when the current user
 * does not have access to the requested path based on their role slug.
 *
 * Project-managers are redirected to the project-management list as their default,
 * while other roles fall back to the charity-assessment landing page.
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

  if (!allowed) {
    return <Navigate to={getDefaultFallback(roleSlug)} replace />;
  }

  return <>{children}</>;
}

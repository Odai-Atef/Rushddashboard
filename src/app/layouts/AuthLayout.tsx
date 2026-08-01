import { Outlet, Navigate } from 'react-router';
import { useAuth } from './RootLayout';

export function AuthLayout() {
 const { isAuthenticated, user } = useAuth();

 if (isAuthenticated) {
 const isProjectManager = user?.roleSlug === 'project-managers';
 return (
 <Navigate
 to={isProjectManager ? '/dashboard/project-management/list' : '/dashboard/charity-assessment'}
 replace
 />
 );
 }

 return <Outlet />;
}

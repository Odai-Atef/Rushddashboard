import { Outlet } from 'react-router';
import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import apiClient from '@/api/client';
import { authService, UserProfile, UserRole } from '@/api/services/auth-service';
import { Toaster } from '@/app/components/ui/sonner';
import { ThemeProvider } from '@/app/components/ThemeProvider';

interface AuthContextType {
 isAuthenticated: boolean;
 isLoading: boolean;
 user: UserProfile | null;
 login: () => void;
 logout: () => void;
}

// Removed inline ThemeContext — use the ThemeProvider from @/app/components/ThemeProvider

const AuthContext = createContext<AuthContextType | null>(null);

function isUserRole(role: unknown): role is UserRole {
 return (
 typeof role === 'object' &&
 role !== null &&
 'slug' in role &&
 typeof (role as UserRole).slug === 'string'
 );
}

function extractRoleSlug(role: string | UserRole | null | undefined): string | null {
 if (!role) return null;
 if (typeof role === 'string') return role;
 if (isUserRole(role)) return role.slug;
 return null;
}

function normalizeRoleSlug(data: UserProfile): UserProfile {
 return {
 ...data,
 roleSlug: data.roleSlug ?? extractRoleSlug(data.role) ?? null,
 };
}

export const useAuth = () => {
 const context = useContext(AuthContext);
 if (!context) {
 throw new Error('useAuth must be used within RootLayout');
 }
 return context;
};

export function RootLayout() {
 const [isAuthenticated, setIsAuthenticated] = useState(() => apiClient.isAuthenticated());
 const [isLoading, setIsLoading] = useState(isAuthenticated);
 const [user, setUser] = useState<UserProfile | null>(null);
 // Load user profile on mount if authenticated
 useEffect(() => {
 if (apiClient.isAuthenticated()) {
 setIsLoading(true);
 authService.getProfile().then((response) => {
 if (response.success && response.data) {
 setUser(normalizeRoleSlug(response.data));
 }
 }).catch(() => {
 // Silently ignore profile fetch errors
 }).finally(() => {
 setIsLoading(false);
 });
 }
 }, []);

 useEffect(() => {
 document.documentElement.setAttribute('dir', 'rtl');
 document.documentElement.setAttribute('lang', 'ar');
 }, []);

 const login = useCallback(() => {
 setIsAuthenticated(true);
 setIsLoading(true);
 authService.getProfile().then((response) => {
 if (response.success && response.data) {
 setUser(normalizeRoleSlug(response.data));
 }
 }).catch(() => {
 // Silently ignore profile fetch errors
 }).finally(() => {
 setIsLoading(false);
 });
 }, []);

 const logout = useCallback(async () => {
 try {
 await authService.logout();
 } catch {
 // If the server call fails, still clear local token state
 apiClient.clearAuthToken();
 } finally {
 setIsAuthenticated(false);
 setUser(null);
 }
 }, []);

 const authValue = {
 isAuthenticated,
 isLoading,
 user,
 login,
 logout,
 };

 return (
 <ThemeProvider>
 <AuthContext.Provider value={authValue}>
 <Outlet />
 <Toaster position="top-center" richColors duration={5000} />
 </AuthContext.Provider>
 </ThemeProvider>
 );
}

// Removed inline useTheme — import from @/app/hooks/useTheme

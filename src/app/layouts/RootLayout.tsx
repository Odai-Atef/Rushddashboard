import { Outlet } from 'react-router';
import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import apiClient from '@/api/client';
import { authService, UserProfile } from '@/api/services/auth-service';

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  login: () => void;
  logout: () => void;
}

interface ThemeContext {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within RootLayout');
  }
  return context;
};

export function RootLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => apiClient.isAuthenticated());
  const [user, setUser] = useState<UserProfile | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('rushd_theme');
    return (saved === 'dark' || saved === 'light') ? saved : 'light';
  });

  // Load user profile on mount if authenticated
  useEffect(() => {
    if (apiClient.isAuthenticated()) {
      authService.getProfile().then((response) => {
        if (response.success && response.data) {
          setUser(response.data);
        }
      }).catch(() => {
        // Silently ignore profile fetch errors
      });
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('dir', 'rtl');
    document.documentElement.setAttribute('lang', 'ar');
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('rushd_theme', theme);
  }, [theme]);

  const login = useCallback(() => {
    setIsAuthenticated(true);
    authService.getProfile().then((response) => {
      if (response.success && response.data) {
        setUser(response.data);
      }
    }).catch(() => {
      // Silently ignore profile fetch errors
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
    user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authValue}>
      <div className={theme}>
        <Outlet context={{ theme, setTheme } satisfies ThemeContext} />
      </div>
    </AuthContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(AuthContext);
  return context;
};

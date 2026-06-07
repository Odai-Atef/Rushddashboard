import { Outlet } from 'react-router';
import { useState, useEffect, createContext, useContext } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
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
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('rushd_auth') === 'true';
  });
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('rushd_theme');
    return (saved === 'dark' || saved === 'light') ? saved : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('dir', 'rtl');
    document.documentElement.setAttribute('lang', 'ar');
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('rushd_theme', theme);
  }, [theme]);

  const login = () => {
    setIsAuthenticated(true);
    localStorage.setItem('rushd_auth', 'true');
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('rushd_auth');
  };

  const authValue = {
    isAuthenticated,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authValue}>
      <div className={theme}>
        <Outlet context={{ theme, setTheme }} />
      </div>
    </AuthContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(AuthContext);
  return context;
};

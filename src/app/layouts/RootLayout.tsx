import { Outlet } from 'react-router';
import { useState, useEffect, createContext, useContext } from 'react';
import { AuthProvider } from '../hooks/useAuth';

const ThemeContext = createContext<{
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
} | null>(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within RootLayout');
  }
  return context;
};

export function RootLayout() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('rushd_theme');
    return saved === 'dark' || saved === 'light' ? saved : 'light';
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

  return (
    <AuthProvider>
      <ThemeContext.Provider value={{ theme, setTheme }}>
        <div className={theme}>
          <Outlet context={{ theme, setTheme }} />
        </div>
      </ThemeContext.Provider>
    </AuthProvider>
  );
}

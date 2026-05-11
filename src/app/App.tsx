import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { MobileNav } from './components/MobileNav';
import { DashboardContent } from './components/DashboardContent';
import { LoginPage } from './components/LoginPage';
import { RegistrationPage } from './components/RegistrationPage';
import { ForgetPasswordPage } from './components/ForgetPasswordPage';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authPage, setAuthPage] = useState<'login' | 'register' | 'forget'>('login');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [activeView, setActiveView] = useState('executive');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;

    // Apply theme
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Apply RTL/LTR
    if (language === 'ar') {
      root.setAttribute('dir', 'rtl');
      root.setAttribute('lang', 'ar');
    } else {
      root.setAttribute('dir', 'ltr');
      root.setAttribute('lang', 'en');
    }
  }, [theme, language]);

  const handleThemeToggle = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleLanguageToggle = () => {
    setLanguage(prev => prev === 'ar' ? 'en' : 'ar');
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleRegister = () => {
    setIsAuthenticated(true);
  };

  // Show authentication pages if not authenticated
  if (!isAuthenticated) {
    if (authPage === 'register') {
      return (
        <RegistrationPage
          onRegister={handleRegister}
          onNavigateLogin={() => setAuthPage('login')}
        />
      );
    }
    if (authPage === 'forget') {
      return <ForgetPasswordPage onBack={() => setAuthPage('login')} />;
    }
    return (
      <LoginPage
        onLogin={handleLogin}
        onNavigateRegister={() => setAuthPage('register')}
        onNavigateForget={() => setAuthPage('forget')}
      />
    );
  }

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <Sidebar
        activeItem={activeView}
        onItemClick={setActiveView}
        className="hidden lg:flex w-80 flex-shrink-0"
      />

      {/* Mobile Navigation */}
      <MobileNav
        isOpen={mobileMenuOpen}
        activeItem={activeView}
        onItemClick={setActiveView}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar
          theme={theme}
          language={language}
          onThemeToggle={handleThemeToggle}
          onLanguageToggle={handleLanguageToggle}
          onMenuClick={() => setMobileMenuOpen(true)}
        />

        <main className={`flex-1 ${activeView === 'ai-analysis' ? 'overflow-hidden' : 'overflow-y-auto'}`}>
          <DashboardContent activeView={activeView} />
        </main>
      </div>
    </div>
  );
}
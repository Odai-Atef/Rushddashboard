import React, {
 createContext,
 useState,
 useEffect,
 useCallback,
 useMemo,
 type ReactNode,
} from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export interface ThemeContextValue {
 /** The currently selected theme mode (light, dark, or system) */
 theme: ThemeMode;
 /** Set the active theme mode */
 setTheme: (mode: ThemeMode) => void;
 /** The resolved actual theme after accounting for system preference */
 resolvedTheme: ResolvedTheme;
}

const THEME_STORAGE_KEY = 'rushd-theme';

export const ThemeContext = createContext<ThemeContextValue | null>(null);

function getSystemTheme(): ResolvedTheme {
 if (typeof window === 'undefined') return 'light';
 return window.matchMedia('(prefers-color-scheme: dark)').matches
 ? 'dark'
 : 'light';
}

function getStoredTheme(): ThemeMode | null {
 if (typeof window === 'undefined') return null;
 try {
 const stored = localStorage.getItem(THEME_STORAGE_KEY);
 if (stored === 'light' || stored === 'dark' || stored === 'system') {
 return stored;
 }
 } catch {
 // localStorage may be unavailable in some environments
 }
 return null;
}

interface ThemeProviderProps {
 children: ReactNode;
 /** Default theme if nothing is stored (defaults to system) */
 defaultTheme?: ThemeMode;
 /** Storage key override (defaults to "rushd-theme") */
 storageKey?: string;
}

export function ThemeProvider({
 children,
 defaultTheme = 'system',
 storageKey = THEME_STORAGE_KEY,
}: ThemeProviderProps) {
 const [theme, setThemeState] = useState<ThemeMode>(() => {
 return getStoredTheme() ?? defaultTheme;
 });
 const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => {
 const stored = getStoredTheme();
 if (stored === 'light' || stored === 'dark') return stored;
 return getSystemTheme();
 });

 const applyTheme = useCallback((mode: ThemeMode) => {
 const resolved: ResolvedTheme =
 mode === 'system' ? getSystemTheme() : mode;
 setResolvedTheme(resolved);

 const root = document.documentElement;
 root.classList.remove('light', 'dark');
 root.classList.add(resolved);
 }, []);

 // Apply theme on initial mount and whenever it changes
 useEffect(() => {
 applyTheme(theme);
 }, [theme, applyTheme]);

 // Listen for system theme changes when in "system" mode
 useEffect(() => {
 if (typeof window === 'undefined') return;
 const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
 const handleChange = () => {
 if (theme === 'system') {
 applyTheme('system');
 }
 };
 mediaQuery.addEventListener('change', handleChange);
 return () => mediaQuery.removeEventListener('change', handleChange);
 }, [theme, applyTheme]);

 const setTheme = useCallback(
 (mode: ThemeMode) => {
 setThemeState(mode);
 try {
 localStorage.setItem(storageKey, mode);
 } catch {
 // localStorage may be unavailable
 }
 },
 [storageKey]
 );

 const value = useMemo<ThemeContextValue>(
 () => ({ theme, setTheme, resolvedTheme }),
 [theme, setTheme, resolvedTheme]
 );

 return (
 <ThemeContext.Provider value={value}>
 {children}
 </ThemeContext.Provider>
 );
}

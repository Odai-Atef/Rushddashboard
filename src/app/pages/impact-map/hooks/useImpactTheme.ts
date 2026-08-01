/**
 * Impact Map Dashboard — useImpactTheme Hook
 *
 * React hook for accessing and responding to the Impact theme system.
 * Provides reactive theme state, CSS variable helpers, and
 * convenience functions for building themed component styles.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
 getCurrentThemeMode,
 onThemeChange,
 getColorToken,
 getShadow,
 getRadius,
 getSpacingPx,
 getTransitionDuration,
 getGradientClass,
 type ImpactThemeMode,
 type ImpactColorToken,
 type ImpactShadowLevel,
 type ImpactRadiusToken,
 type ImpactSpacingToken,
 type ImpactTransitionToken,
 type ImpactGradient,
} from '../utils/theme-utils';

/* ────────────────────────────────────────────────────────────────
 Hook Return Type
 ──────────────────────────────────────────────────────────────── */

export interface UseImpactThemeReturn {
 /** Current theme mode: 'light' or 'dark' */
 mode: ImpactThemeMode;
 /** True if currently in dark mode */
 isDark: boolean;
 /** True if currently in light mode */
 isLight: boolean;
 /** Get CSS variable reference for a color token */
 color: (token: ImpactColorToken) => string;
 /** Get CSS variable reference for a shadow level */
 shadow: (level: ImpactShadowLevel) => string;
 /** Get CSS variable reference for a radius token */
 radius: (token: ImpactRadiusToken) => string;
 /** Get pixel value for a spacing token */
 spacing: (token: ImpactSpacingToken) => string;
 /** Get CSS duration for a transition token */
 transition: (token: ImpactTransitionToken) => string;
 /** Get gradient CSS class name */
 gradient: (name: ImpactGradient) => string;
 /** Reactive CSS variable style object for inline use */
 cssVar: (token: ImpactColorToken, property?: string) => React.CSSProperties;
 /** Force re-read of current theme (useful after manual class toggle) */
 refresh: () => void;
}

/* ────────────────────────────────────────────────────────────────
 Hook Implementation
 ──────────────────────────────────────────────────────────────── */

export function useImpactTheme(): UseImpactThemeReturn {
 const [mode, setMode] = useState<ImpactThemeMode>(() => getCurrentThemeMode());

 // Subscribe to theme changes
 useEffect(() => {
 return onThemeChange((newMode) => {
 setMode(newMode);
 });
 }, []);

 // Manual refresh helper
 const refresh = useCallback(() => {
 setMode(getCurrentThemeMode());
 }, []);

 // Derived state
 const isDark = mode === 'dark';
 const isLight = mode === 'light';

 // Memoized helper functions
 const helpers = useMemo(() => ({
 color: getColorToken,
 shadow: getShadow,
 radius: getRadius,
 spacing: getSpacingPx,
 transition: getTransitionDuration,
 gradient: getGradientClass,
 }), []);

 /**
  * Generate an inline style object with a CSS variable.
  * Example: cssVar('impact-primary', 'color') → { color: 'var(--impact-primary)' }
  */
 const cssVar = useCallback(
 (token: ImpactColorToken, property: string = 'color'): React.CSSProperties => {
 return { [property]: getColorToken(token) };
 },
 []
 );

 return {
 mode,
 isDark,
 isLight,
 ...helpers,
 cssVar,
 refresh,
 };
}

/* ────────────────────────────────────────────────────────────────
 Additional Themed Hooks
 ──────────────────────────────────────────────────────────────── */

/**
 * Hook that returns theme-aware class names for common patterns.
 */
export function useImpactClasses() {
 const { isDark } = useImpactTheme();

 return useMemo(() => ({
 /** Page background class */
 pageBg: isDark ? 'impact-gradient-bg-dark' : 'impact-gradient-bg-light',
 /** Card surface class */
 cardSurface: isDark ? 'impact-gradient-card-dark' : 'impact-gradient-card-light',
 /** Primary button gradient class */
 btnGradient: isDark
 ? 'impact-gradient-primary-dark'
 : 'impact-gradient-primary-light',
 /** Text color classes */
 textPrimary: 'text-[var(--impact-text-primary)]',
 textSecondary: 'text-[var(--impact-text-secondary)]',
 textMuted: 'text-[var(--impact-text-muted)]',
 /** Surface classes */
 surface: 'bg-[var(--impact-surface)] dark:bg-[var(--impact-main-surface)]',
 surfaceSecondary: 'bg-[var(--impact-surface-secondary)]',
 /** Border class */
 border: 'border-[var(--impact-border)]',
 /** Shadow class */
 shadow: 'shadow-[var(--impact-shadow-1)]',
 shadowHover: 'hover:shadow-[var(--impact-shadow-2)]',
 }), [isDark]);
}

/**
 * Hook for building responsive impact grid layouts.
 */
export function useImpactResponsive() {
 return useMemo(() => ({
 /** Desktop: 4 columns, Laptop: 2, Mobile: 1 */
 kpiGrid:
 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[var(--spacing-grid-gap)]',
 /** Desktop: 3/2 split, Tablet: stack */
 mapLayout:
 'grid grid-cols-1 lg:grid-cols-3 gap-[var(--spacing-grid-gap)]',
 mapMain: 'lg:col-span-2',
 mapSidebar: 'lg:col-span-1',
 /** Desktop: 2 columns, Tablet: stack */
 analyticsLayout:
 'grid grid-cols-1 lg:grid-cols-2 gap-[var(--spacing-grid-gap)]',
 /** Single column that never overflows */
 singleColumn: 'w-full min-w-0 overflow-hidden',
 }), []);
}

/**
 * Hook for animation timing values.
 */
export function useImpactAnimation() {
 return useMemo(() => ({
 /** Quick hover transitions (150ms) */
 hover: 'transition-all duration-[var(--impact-transition-hover)] ease-in-out',
 /** Card transitions (200ms) */
 card: 'transition-all duration-[var(--impact-transition-card)] ease-in-out',
 /** Page transitions (250ms) */
 page: 'transition-all duration-[var(--impact-transition-page)] ease-in-out',
 /** Fade in animation */
 fadeIn: 'impact-animate-fade-in',
 /** Staggered children animation */
 stagger: 'impact-animate-stagger',
 /** Map marker pulse */
 markerPulse: 'impact-transition-map-marker',
 /** Hover lift effect */
 hoverLift: 'hover:translate-y-[-2px] hover:shadow-[var(--impact-shadow-2)]',
 }), []);
}

/**
 * Hook for accessibility utilities.
 */
export function useImpactA11y() {
 return useMemo(() => ({
 /** Focus visible ring */
 focusVisible: 'impact-focus-visible focus-visible:outline-2 focus-visible:outline-offset-2',
 /** Keyboard navigation support */
 keyboardNav: 'impact-keyboard-nav',
 /** Minimum touch target */
 touchTarget: 'impact-touch-target',
 /** Small touch target */
 touchTargetSm: 'impact-touch-target-sm',
 /** Screen reader only text */
 srOnly: 'sr-only',
 /** ARIA live region for announcements */
 liveRegion: 'sr-only aria-live="polite"',
 }), []);
}

/* ────────────────────────────────────────────────────────────────
 Preset Style Objects
 ──────────────────────────────────────────────────────────────── */

/**
 * Pre-built style objects for common Impact components.
 * Useful when inline styles are preferred over Tailwind classes.
 */
export const impactCardStyles: React.CSSProperties = {
 borderRadius: 'var(--impact-radius-card)',
 border: '1px solid var(--impact-border)',
 boxShadow: 'var(--impact-shadow-1)',
 padding: 'var(--impact-card-padding)',
 background: 'var(--impact-surface)',
 transition: 'box-shadow var(--impact-transition-card) ease-in-out, transform var(--impact-transition-card) ease-in-out',
};

export const impactCardHoverStyles: React.CSSProperties = {
 boxShadow: 'var(--impact-shadow-2)',
 transform: 'translateY(-2px)',
};

export const impactButtonPrimaryStyles: React.CSSProperties = {
 display: 'inline-flex',
 alignItems: 'center',
 justifyContent: 'center',
 gap: '8px',
 padding: '12px 24px',
 borderRadius: 'var(--impact-radius-button)',
 fontSize: '14px',
 fontWeight: 600,
 color: '#FFFFFF',
 background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)',
 border: 'none',
 cursor: 'pointer',
 minHeight: '44px',
};

export const impactPageWrapperStyles: React.CSSProperties = {
 backgroundColor: 'var(--impact-page-bg)',
 minHeight: '100vh',
 transition: 'background-color var(--impact-transition-page) ease-in-out',
};

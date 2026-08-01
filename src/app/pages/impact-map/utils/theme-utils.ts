/**
 * Impact Map Dashboard — Theme Utility Functions
 *
 * TypeScript helpers for working with the Impact theme system.
 * All functions are pure and framework-agnostic.
 */

import type { CSSProperties } from 'react';

/* ────────────────────────────────────────────────────────────────
 Type Definitions
 ──────────────────────────────────────────────────────────────── */

export type ImpactThemeMode = 'light' | 'dark';

export type ImpactColorToken =
 | 'impact-page-bg'
 | 'impact-section-bg'
 | 'impact-surface'
 | 'impact-surface-secondary'
 | 'impact-elevated'
 | 'impact-text-primary'
 | 'impact-text-secondary'
 | 'impact-text-muted'
 | 'impact-border'
 | 'impact-divider'
 | 'impact-primary'
 | 'impact-primary-hover'
 | 'impact-primary-active'
 | 'impact-success'
 | 'impact-warning'
 | 'impact-danger'
 | 'impact-info';

export type ImpactShadowLevel = 0 | 1 | 2 | 3;

export type ImpactRadiusToken =
 | 'button'
 | 'card'
 | 'chart'
 | 'dialog'
 | 'map-panel'
 | 'search';

export type ImpactSpacingToken =
 | 4
 | 8
 | 12
 | 16
 | 20
 | 24
 | 32
 | 40
 | 48
 | 64;

export type ImpactTransitionToken =
 | 'hover'
 | 'card'
 | 'page'
 | 'counter'
 | 'chart';

/* ────────────────────────────────────────────────────────────────
 CSS Variable Helpers
 ──────────────────────────────────────────────────────────────── */

/**
 * Get a CSS variable reference string for use in inline styles or Tailwind.
 * Example: getCssVar('impact-primary') → 'var(--impact-primary)'
 */
export function getCssVar(token: ImpactColorToken | string): string {
 return `var(--${token})`;
}

/**
 * Build a CSSProperties object with a CSS variable value.
 * Useful for React inline styles.
 */
export function cssVarStyle(
 token: ImpactColorToken | string
): CSSProperties {
 return { ['--tmp' as string]: `var(--${token})` };
}

/**
 * Get the raw CSS custom property string for a color token.
 */
export function getColorToken(token: ImpactColorToken): string {
 return `var(--${token})`;
}

/* ────────────────────────────────────────────────────────────────
 Shadow Utilities
 ──────────────────────────────────────────────────────────────── */

/**
 * Get the CSS variable reference for an elevation shadow level.
 */
export function getShadow(level: ImpactShadowLevel): string {
 return `var(--impact-shadow-${level})`;
}

/**
 * Get shadow as a React CSSProperties entry.
 */
export function getShadowStyle(level: ImpactShadowLevel): CSSProperties {
 return { boxShadow: getShadow(level) };
}

/* ────────────────────────────────────────────────────────────────
 Radius Utilities
 ──────────────────────────────────────────────────────────────── */

/**
 * Get the CSS variable reference for a border radius token.
 */
export function getRadius(token: ImpactRadiusToken): string {
 const map: Record<ImpactRadiusToken, string> = {
 button: 'var(--impact-radius-button)',
 card: 'var(--impact-radius-card)',
 chart: 'var(--impact-radius-chart)',
 dialog: 'var(--impact-radius-dialog)',
 'map-panel': 'var(--impact-radius-map-panel)',
 search: 'var(--impact-radius-search)',
 };
 return map[token];
}

/**
 * Get radius as a React CSSProperties entry.
 */
export function getRadiusStyle(token: ImpactRadiusToken): CSSProperties {
 return { borderRadius: getRadius(token) };
}

/* ────────────────────────────────────────────────────────────────
 Spacing Utilities
 ──────────────────────────────────────────────────────────────── */

/**
 * Get spacing value in pixels (just the number, no unit).
 * Returns the token value directly since our system uses px.
 */
export function getSpacing(token: ImpactSpacingToken): number {
 return token;
}

/**
 * Get spacing with px suffix as a string.
 */
export function getSpacingPx(token: ImpactSpacingToken): string {
 return `${token}px`;
}

/**
 * Get spacing as a React CSSProperties entry for a given property.
 */
export function getSpacingStyle(
 property: 'margin' | 'padding' | 'gap',
 token: ImpactSpacingToken
): CSSProperties {
 return { [property]: getSpacingPx(token) };
}

/* ────────────────────────────────────────────────────────────────
 Transition Utilities
 ──────────────────────────────────────────────────────────────── */

/**
 * Get transition duration in milliseconds.
 */
export function getTransitionMs(token: ImpactTransitionToken): number {
 const map: Record<ImpactTransitionToken, number> = {
 hover: 150,
 card: 200,
 page: 250,
 counter: 600,
 chart: 700,
 };
 return map[token];
}

/**
 * Get transition duration as CSS string (e.g., '150ms').
 */
export function getTransitionDuration(token: ImpactTransitionToken): string {
 return `${getTransitionMs(token)}ms`;
}

/**
 * Build a CSS transition string for a set of properties.
 */
export function buildTransition(
 token: ImpactTransitionToken,
 properties: string[],
 easing: string = 'ease-in-out'
): string {
 const duration = getTransitionDuration(token);
 return properties.map((prop) => `${prop} ${duration} ${easing}`).join(', ');
}

/* ────────────────────────────────────────────────────────────────
 Gradient Utilities
 ──────────────────────────────────────────────────────────────── */

export type ImpactGradient =
 | 'bg-light'
 | 'bg-dark'
 | 'primary-light'
 | 'primary-dark'
 | 'card-light'
 | 'card-dark'
 | 'highlight';

/**
 * Get the CSS class name for a gradient.
 */
export function getGradientClass(gradient: ImpactGradient): string {
 const map: Record<ImpactGradient, string> = {
 'bg-light': 'impact-gradient-bg-light',
 'bg-dark': 'impact-gradient-bg-dark',
 'primary-light': 'impact-gradient-primary-light',
 'primary-dark': 'impact-gradient-primary-dark',
 'card-light': 'impact-gradient-card-light',
 'card-dark': 'impact-gradient-card-dark',
 highlight: 'impact-gradient-highlight',
 };
 return map[gradient];
}

/* ────────────────────────────────────────────────────────────────
 Theme Detection
 ──────────────────────────────────────────────────────────────── */

/**
 * Check if the document currently has dark mode active.
 * Safe for SSR (returns 'light' if document is undefined).
 */
export function getCurrentThemeMode(): ImpactThemeMode {
 if (typeof document === 'undefined') return 'light';
 return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

/**
 * Subscribe to theme changes by observing the document classList.
 * Returns an unsubscribe function.
 */
export function onThemeChange(
 callback: (mode: ImpactThemeMode) => void
): () => void {
 if (typeof document === 'undefined') return () => {};

 const observer = new MutationObserver(() => {
 callback(getCurrentThemeMode());
 });

 observer.observe(document.documentElement, {
 attributes: true,
 attributeFilter: ['class'],
 });

 return () => observer.disconnect();
}

/* ────────────────────────────────────────────────────────────────
 Contrast & Accessibility Helpers
 ──────────────────────────────────────────────────────────────── */

/**
 * Calculate relative luminance of a hex color.
 * Used for contrast ratio calculations.
 */
function getLuminance(hex: string): number {
 const rgb = hex
 .replace('#', '')
 .match(/.{2}/g)
 ?.map((x) => {
 const v = parseInt(x, 16) / 255;
 return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
 }) ?? [0, 0, 0];
 return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}

/**
 * Calculate contrast ratio between two hex colors.
 * WCAG AA requires 4.5:1 for normal text, 3:1 for large text.
 */
export function getContrastRatio(color1: string, color2: string): number {
 const lum1 = getLuminance(color1);
 const lum2 = getLuminance(color2);
 const lighter = Math.max(lum1, lum2);
 const darker = Math.min(lum1, lum2);
 return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if a color combination meets WCAG AA standards.
 */
export function meetsWcagAA(
 foreground: string,
 background: string,
 isLargeText: boolean = false
): boolean {
 const ratio = getContrastRatio(foreground, background);
 return isLargeText ? ratio >= 3 : ratio >= 4.5;
}

/* ────────────────────────────────────────────────────────────────
 Class Name Builders
 ──────────────────────────────────────────────────────────────── */

/**
 * Build a conditional class string from an object.
 * Lightweight alternative to cn() for impact-specific classes.
 */
export function impactClass(classes: Record<string, boolean>): string {
 return Object.entries(classes)
 .filter(([, enabled]) => enabled)
 .map(([cls]) => cls)
 .join(' ');
}

/**
 * Combine base classes with conditional modifiers.
 */
export function impactClasses(
 base: string,
 ...modifiers: Array<string | undefined | false>
): string {
 return [base, ...modifiers.filter(Boolean)].join(' ');
}

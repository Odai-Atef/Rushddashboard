/**
 * Border radius tokens for Rushd theming system.
 */

export type RadiusToken = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export const radius: Record<RadiusToken, string> = {
  sm: '0.375rem',  // 6px
  md: '0.625rem',  // 10px (default)
  lg: '0.75rem',   // 12px
  xl: '1rem',      // 16px
  full: '9999px',
};

export type RadiusTokens = typeof radius;

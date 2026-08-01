/**
 * Spacing tokens for Rushd theming system.
 * Updated with new design system — exact spacing values.
 * All values use rem units for consistent scaling.
 */

export type SpacingToken = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | 'pagePadding' | 'cardPadding' | 'gridGap' | 'sectionGap';

export const spacing: Record<SpacingToken, string> = {
  xs: '0.25rem',       // 4px
  sm: '0.5rem',        // 8px (Small Gap)
  md: '1rem',          // 16px
  lg: '1.5rem',        // 24px (Card Padding, Grid Gap)
  xl: '2rem',          // 32px (Page Padding, Section Gap)
  '2xl': '3rem',       // 48px
  '3xl': '4rem',       // 64px
  '4xl': '6rem',       // 96px
  pagePadding: '2rem', // 32px
  cardPadding: '1.5rem',// 24px
  gridGap: '1.5rem',   // 24px
  sectionGap: '2rem',  // 32px
};

export type SpacingTokens = typeof spacing;

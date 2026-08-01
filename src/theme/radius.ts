/**
 * Border radius tokens for Rushd theming system.
 * Updated with new design system — exact radius values.
 */

export type RadiusToken = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full' | 'card' | 'button' | 'input' | 'dialog' | 'table' | 'badge';

export const radius: Record<RadiusToken, string> = {
  sm: '0.5rem',     // 8px
  md: '0.75rem',    // 12px (Buttons, Inputs)
  lg: '1rem',       // 16px (Tables)
  xl: '1.125rem',   // 18px (Cards)
  '2xl': '1.25rem', // 20px (Dialogs)
  '3xl': '1.5rem',  // 24px
  full: '9999px',   // Badges
  card: '1.125rem', // 18px
  button: '0.75rem', // 12px
  input: '0.75rem', // 12px
  dialog: '1.25rem',// 20px
  table: '1rem',    // 16px
  badge: '9999px',  // Full rounded
};

export type RadiusTokens = typeof radius;

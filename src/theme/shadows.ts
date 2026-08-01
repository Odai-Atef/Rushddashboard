/**
 * Shadow tokens for Rushd theming system.
 * Updated with new design system — exact shadow values.
 */

export interface ShadowToken {
 light: string;
 dark: string;
}

export interface ShadowTokens {
 /** Extra small shadow */
 sm: ShadowToken;
 /** Small shadow */
 md: ShadowToken;
 /** Medium shadow */
 lg: ShadowToken;
 /** Large shadow */
 xl: ShadowToken;
 /** Focus ring shadow */
 focusRing: ShadowToken;
 /** Card shadow */
 card: ShadowToken;
 /** Glow effect (dark mode) */
 glow: ShadowToken;
}

export const shadows: ShadowTokens = {
 sm: {
 light: '0 1px 3px rgba(15, 23, 42, 0.05)',
 dark: '0 1px 3px rgba(0, 0, 0, 0.25)',
 },
 md: {
 light: '0 4px 12px rgba(15, 23, 42, 0.06)',
 dark: '0 4px 12px rgba(0, 0, 0, 0.3)',
 },
 lg: {
 light: '0 6px 18px rgba(15, 23, 42, 0.08)',
 dark: '0 12px 30px rgba(0, 0, 0, 0.35)',
 },
 xl: {
 light: '0 12px 30px rgba(15, 23, 42, 0.12)',
 dark: '0 20px 40px rgba(0, 0, 0, 0.45)',
 },
 focusRing: {
 light: '0 0 0 2px rgba(31, 169, 122, 0.3)',
 dark: '0 0 0 2px rgba(31, 199, 166, 0.3)',
 },
 card: {
 light: '0 6px 18px rgba(15, 23, 42, 0.08)',
 dark: '0 12px 30px rgba(0, 0, 0, 0.35)',
 },
 glow: {
 light: 'none',
 dark: '0 0 20px rgba(31, 199, 166, 0.12)',
 },
};

/**
 * Resolve a shadow token to its CSS value for a given theme mode.
 */
export function resolveShadow(
 token: keyof ShadowTokens,
 mode: 'light' | 'dark'
): string {
 return shadows[token][mode];
}

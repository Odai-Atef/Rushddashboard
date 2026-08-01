/**
 * Shadow tokens for Rushd theming system.
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
}

export const shadows: ShadowTokens = {
  sm: {
    light: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    dark: '0 1px 2px 0 rgb(0 0 0 / 0.25)',
  },
  md: {
    light: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    dark: '0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.3)',
  },
  lg: {
    light: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    dark: '0 10px 15px -3px rgb(0 0 0 / 0.3), 0 4px 6px -4px rgb(0 0 0 / 0.3)',
  },
  xl: {
    light: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    dark: '0 20px 25px -5px rgb(0 0 0 / 0.35), 0 8px 10px -6px rgb(0 0 0 / 0.35)',
  },
  focusRing: {
    light: '0 0 0 2px var(--ring, oklch(0.708 0 0))',
    dark: '0 0 0 2px var(--ring, oklch(0.439 0 0))',
  },
  card: {
    light: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    dark: '0 1px 3px 0 rgb(0 0 0 / 0.3), 0 1px 2px -1px rgb(0 0 0 / 0.3)',
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

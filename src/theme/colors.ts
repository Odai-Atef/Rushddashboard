/**
 * Semantic color tokens for Rushd theming system.
 * Each token exposes light and dark values.
 */

export type ThemeMode = 'light' | 'dark';

export interface ColorToken {
  light: string;
  dark: string;
}

export interface SemanticColors {
  /** Primary brand color */
  primary: ColorToken;
  /** Secondary / subtle accent */
  secondary: ColorToken;
  /** Accent for highlights, badges, pills */
  accent: ColorToken;
  /** Muted / subtle backgrounds */
  muted: ColorToken;
  /** Destructive / error actions */
  destructive: ColorToken;
  /** Page background */
  background: ColorToken;
  /** Surface above background (cards, panels) */
  surface: ColorToken;
  /** Card background */
  card: ColorToken;
  /** Borders and dividers */
  border: ColorToken;
  /** Primary text color */
  textPrimary: ColorToken;
  /** Secondary / muted text color */
  textSecondary: ColorToken;
  /** Success / positive state */
  success: ColorToken;
  /** Warning / caution state */
  warning: ColorToken;
  /** Danger / error state */
  danger: ColorToken;
  /** Info / neutral state */
  info: ColorToken;
  /** Sidebar background */
  sidebar: ColorToken;
  /** Topbar background */
  topbar: ColorToken;
  /** Chart colors */
  chart: {
    1: ColorToken;
    2: ColorToken;
    3: ColorToken;
    4: ColorToken;
    5: ColorToken;
  };
}

export const colors: SemanticColors = {
  primary: {
    light: '#030213',
    dark: 'oklch(0.985 0 0)',
  },
  secondary: {
    light: 'oklch(0.95 0.0058 264.53)',
    dark: 'oklch(0.269 0 0)',
  },
  accent: {
    light: '#e9ebef',
    dark: 'oklch(0.269 0 0)',
  },
  muted: {
    light: '#ececf0',
    dark: 'oklch(0.269 0 0)',
  },
  destructive: {
    light: '#d4183d',
    dark: 'oklch(0.396 0.141 25.723)',
  },
  background: {
    light: '#ffffff',
    dark: 'oklch(0.145 0 0)',
  },
  surface: {
    light: '#ffffff',
    dark: 'oklch(0.205 0 0)',
  },
  card: {
    light: '#ffffff',
    dark: 'oklch(0.145 0 0)',
  },
  border: {
    light: 'rgba(0, 0, 0, 0.1)',
    dark: 'oklch(0.269 0 0)',
  },
  textPrimary: {
    light: 'oklch(0.145 0 0)',
    dark: 'oklch(0.985 0 0)',
  },
  textSecondary: {
    light: '#717182',
    dark: 'oklch(0.708 0 0)',
  },
  success: {
    light: '#22c55e',
    dark: '#4ade80',
  },
  warning: {
    light: '#f59e0b',
    dark: '#fbbf24',
  },
  danger: {
    light: '#ef4444',
    dark: '#f87171',
  },
  info: {
    light: '#3b82f6',
    dark: '#60a5fa',
  },
  sidebar: {
    light: 'oklch(0.985 0 0)',
    dark: 'oklch(0.205 0 0)',
  },
  topbar: {
    light: '#ffffff',
    dark: 'oklch(0.145 0 0)',
  },
  chart: {
    1: {
      light: 'oklch(0.646 0.222 41.116)',
      dark: 'oklch(0.488 0.243 264.376)',
    },
    2: {
      light: 'oklch(0.6 0.118 184.704)',
      dark: 'oklch(0.696 0.17 162.48)',
    },
    3: {
      light: 'oklch(0.398 0.07 227.392)',
      dark: 'oklch(0.769 0.188 70.08)',
    },
    4: {
      light: 'oklch(0.828 0.189 84.429)',
      dark: 'oklch(0.627 0.265 303.9)',
    },
    5: {
      light: 'oklch(0.769 0.188 70.08)',
      dark: 'oklch(0.645 0.246 16.439)',
    },
  },
};

/**
 * Resolve a color token to its CSS value for a given theme mode.
 */
export function resolveColor<T extends keyof SemanticColors>(
  token: T,
  mode: ThemeMode
): string {
  const value = colors[token];
  if (typeof value === 'object' && value !== null && 'light' in value && 'dark' in value) {
    return value[mode];
  }
  throw new Error(`Color token "${String(token)}" is not a simple ColorToken.`);
}

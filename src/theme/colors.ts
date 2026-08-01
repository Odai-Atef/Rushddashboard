/**
 * Semantic color tokens for Rushd theming system.
 * Updated with new design system — exact hex values.
 */

export type ThemeMode = 'light' | 'dark';

export interface ColorToken {
  light: string;
  dark: string;
}

export interface SemanticColors {
  /** Primary brand color */
  primary: ColorToken;
  /** Secondary accent */
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
  /** Hover background */
  hover: ColorToken;
  /** Primary text color */
  textPrimary: ColorToken;
  /** Secondary / muted text color */
  textSecondary: ColorToken;
  /** Tertiary / very muted text color */
  textMuted: ColorToken;
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
  /** Shadow color token */
  shadow: ColorToken;
  /** Glow effect (dark mode only) */
  glow: ColorToken;
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
    light: '#1FA97A',
    dark: '#1FC7A6',
  },
  secondary: {
    light: '#2563EB',
    dark: '#3B82F6',
  },
  accent: {
    light: '#1FA97A',
    dark: '#1FC7A6',
  },
  muted: {
    light: '#F1F5F9',
    dark: '#0C2238',
  },
  destructive: {
    light: '#DC2626',
    dark: '#EF4444',
  },
  background: {
    light: '#F5F7FB',
    dark: '#071626',
  },
  surface: {
    light: '#FFFFFF',
    dark: '#0C2238',
  },
  card: {
    light: '#FFFFFF',
    dark: '#102942',
  },
  border: {
    light: '#E2E8F0',
    dark: 'rgba(255, 255, 255, 0.08)',
  },
  hover: {
    light: '#F1F5F9',
    dark: 'rgba(31, 199, 166, 0.08)',
  },
  textPrimary: {
    light: '#1E293B',
    dark: '#FFFFFF',
  },
  textSecondary: {
    light: '#64748B',
    dark: '#B7C7D8',
  },
  textMuted: {
    light: '#94A3B8',
    dark: '#7C95AA',
  },
  success: {
    light: '#16A34A',
    dark: '#22C55E',
  },
  warning: {
    light: '#F59E0B',
    dark: '#F59E0B',
  },
  danger: {
    light: '#DC2626',
    dark: '#EF4444',
  },
  info: {
    light: '#0284C7',
    dark: '#38BDF8',
  },
  sidebar: {
    light: '#0B2742',
    dark: '#081A2E',
  },
  topbar: {
    light: '#FFFFFF',
    dark: '#081A2E',
  },
  shadow: {
    light: '0 6px 18px rgba(15, 23, 42, 0.08)',
    dark: '0 12px 30px rgba(0, 0, 0, 0.35)',
  },
  glow: {
    light: 'none',
    dark: '0 0 20px rgba(31, 199, 166, 0.12)',
  },
  chart: {
    1: {
      light: '#1FA97A',
      dark: '#1FC7A6',
    },
    2: {
      light: '#2563EB',
      dark: '#3B82F6',
    },
    3: {
      light: '#0284C7',
      dark: '#38BDF8',
    },
    4: {
      light: '#F59E0B',
      dark: '#F59E0B',
    },
    5: {
      light: '#DC2626',
      dark: '#EF4444',
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

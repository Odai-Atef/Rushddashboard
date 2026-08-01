/**
 * Typography tokens for Rushd theming system.
 * Updated with new design system — Modern Arabic + English.
 */

export type FontSizeToken = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | 'pageTitle' | 'sectionTitle' | 'cardNumber' | 'cardLabel' | 'caption';
export type FontWeightToken = 'normal' | 'medium' | 'semibold' | 'bold';
export type LineHeightToken = 'none' | 'tight' | 'snug' | 'normal' | 'relaxed' | 'loose';
export type LetterSpacingToken = 'tighter' | 'tight' | 'normal' | 'wide' | 'wider' | 'widest';

export const fontSizes: Record<FontSizeToken, string> = {
 xs: '0.75rem', // 12px
 sm: '0.8125rem', // 13px (Caption)
 base: '1rem', // 16px (Normal Text)
 lg: '1.125rem', // 18px
 xl: '1.25rem', // 20px
 '2xl': '1.5rem', // 24px (Section Title)
 '3xl': '1.875rem', // 30px (Card Number)
 '4xl': '2rem', // 32px (Page Title)
 pageTitle: '2rem', // 32px Bold
 sectionTitle: '1.5rem',// 24px Bold
 cardNumber: '1.875rem',// 30px Bold
 cardLabel: '0.875rem', // 14px Normal
 caption: '0.8125rem', // 13px Normal
};

export const fontWeights: Record<FontWeightToken, number> = {
 normal: 400,
 medium: 500,
 semibold: 600,
 bold: 700,
};

export const lineHeights: Record<LineHeightToken, string | number> = {
 none: 1,
 tight: 1.25,
 snug: 1.375,
 normal: 1.5,
 relaxed: 1.625,
 loose: 2,
};

export const letterSpacings: Record<LetterSpacingToken, string> = {
 tighter: '-0.05em',
 tight: '-0.025em',
 normal: '0em',
 wide: '0.025em',
 wider: '0.05em',
 widest: '0.1em',
};

export interface TypographyTokens {
 fontSizes: typeof fontSizes;
 fontWeights: typeof fontWeights;
 lineHeights: typeof lineHeights;
 letterSpacings: typeof letterSpacings;
}

export const typography: TypographyTokens = {
 fontSizes,
 fontWeights,
 lineHeights,
 letterSpacings,
};

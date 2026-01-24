/**
 * Theme Color Definitions
 * Matches the CSS variables defined in src/shared/styles/theme/default-colors.css
 * Used by Material-UI theme to avoid race conditions with CSS variable computation
 */

export interface ThemeColorPalette {
  primary: string;
  primaryEmphasis: string;
  lightPrimary: string;
  secondary: string;
  secondaryEmphasis: string;
  lightSecondary: string;
}

export const THEME_COLORS: Record<string, ThemeColorPalette> = {
  BLUE_THEME: {
    primary: '#0152EA',
    primaryEmphasis: '#0152EA',
    lightPrimary: 'rgba(93, 135, 255, 0.1)',
    secondary: '#16CDC7',
    secondaryEmphasis: '#1cc3bd',
    lightSecondary: 'rgba(22, 205, 199, 0.25)',
  },
  AQUA_THEME: {
    primary: '#0074BA',
    primaryEmphasis: '#00639e',
    lightPrimary: 'rgba(0, 116, 186, 0.125)',
    secondary: '#47D7BC',
    secondaryEmphasis: '#3cb7a0',
    lightSecondary: 'rgba(71, 215, 188, 0.125)',
  },
  PURPLE_THEME: {
    primary: '#763EBD',
    primaryEmphasis: '#6435a1',
    lightPrimary: 'rgba(118, 62, 189, 0.125)',
    secondary: '#49BEFF',
    secondaryEmphasis: '#7fb0b5',
    lightSecondary: 'rgba(73, 190, 255, 0.125)',
  },
  GREEN_THEME: {
    primary: '#0A7EA4',
    primaryEmphasis: '#096b8b',
    lightPrimary: 'rgba(10, 126, 164, 0.125)',
    secondary: '#CCDA4E',
    secondaryEmphasis: '#d4e069',
    lightSecondary: 'rgba(204, 218, 78, 0.125)',
  },
  CYAN_THEME: {
    primary: '#01C0C8',
    primaryEmphasis: '#01a3aa',
    lightPrimary: 'rgba(1, 192, 200, 0.125)',
    secondary: '#FB9678',
    secondaryEmphasis: '#d58066',
    lightSecondary: 'rgba(251, 150, 120, 0.125)',
  },
  ORANGE_THEME: {
    primary: '#FA896B',
    primaryEmphasis: '#d5745b',
    lightPrimary: 'rgba(250, 137, 107, 0.125)',
    secondary: '#0074BA',
    secondaryEmphasis: '#00639e',
    lightSecondary: 'rgba(0, 116, 186, 0.125)',
  },
};

// Default theme colors (fallback)
export const DEFAULT_THEME_COLORS = THEME_COLORS.BLUE_THEME;

/**
 * Get theme colors for a specific theme
 */
export const getThemeColors = (themeName: string): ThemeColorPalette => {
  return THEME_COLORS[themeName] || DEFAULT_THEME_COLORS;
};

import { createTheme, Theme } from '@mui/material/styles';
import { getMuiComponentOverrides } from './muiComponentOverrides';
import { getThemeColors } from './themeColors';

/**
 * Get CSS variable value from the document root
 * Used as fallback for non-theme-specific colors
 */
const getCSSVariable = (variable: string, fallback: string = ''): string => {
  if (typeof window !== 'undefined') {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(variable)
      .trim() || fallback;
  }
  return fallback;
};

/**
 * Material-UI Theme Configuration
 * Integrates with theme color constants for instant updates and CSS variables for consistency
 */
const createAgrofyTheme = (
  mode: 'light' | 'dark' = 'light',
  activeTheme: string = 'BLUE_THEME'
): Theme => {
  // Get theme-specific colors from JavaScript constants
  const themeColors = getThemeColors(activeTheme);
  // Create base theme first
  const baseTheme = createTheme({
    palette: {
      mode,
      primary: {
        main: themeColors.primary,
        dark: themeColors.primaryEmphasis,
        light: themeColors.lightPrimary,
        contrastText: '#ffffff',
      },
      secondary: {
        main: themeColors.secondary,
        dark: themeColors.secondaryEmphasis,
        light: themeColors.lightSecondary,
        contrastText: '#ffffff',
      },
      error: {
        main: getCSSVariable('--color-error', '#FF6692'),
        dark: getCSSVariable('--color-error-emphasis', '#d9577c'),
        light: getCSSVariable('--color-lighterror', 'rgba(255, 102, 146, 0.38)'),
        contrastText: '#ffffff',
      },
      warning: {
        main: getCSSVariable('--color-warning', '#f8c20a'),
        dark: getCSSVariable('--color-warning-emphasis', '#d3a509'),
        light: getCSSVariable('--color-lightwarning', 'rgba(248, 194, 10, 0.25)'),
        contrastText: '#ffffff',
      },
      info: {
        main: getCSSVariable('--color-info', '#46CAEB'),
        dark: getCSSVariable('--color-info-emphasis', '#3cacc8'),
        light: getCSSVariable('--color-lightinfo', 'rgba(70, 202, 235, 0.25)'),
        contrastText: '#ffffff',
      },
      success: {
        main: getCSSVariable('--color-success', '#36c96c'),
        dark: getCSSVariable('--color-success-emphasis', '#2ea95c'),
        light: getCSSVariable('--color-lightsuccess', 'rgba(46, 169, 92, 0.25)'),
        contrastText: '#ffffff',
      },
      grey: {
        50: getCSSVariable('--color-lightgray', '#F4F7FB'),
        100: getCSSVariable('--color-lighthover', '#f6f7f9'),
        200: getCSSVariable('--color-muted', '#EFF4FA'),
        300: getCSSVariable('--color-border', '#e0e6eb'),
        400: getCSSVariable('--color-bodytext', '#98A4AE'),
        500: getCSSVariable('--color-link', '#2a3547'),
        600: getCSSVariable('--color-darklink', '#29343d'),
        700: getCSSVariable('--color-dark', '#1F2A3D'),
        800: getCSSVariable('--color-darkgray', '#1A2537'),
        900: getCSSVariable('--color-sky', '#0A2540'),
      },
      background: {
        default: mode === 'light'
          ? getCSSVariable('--color-lightgray', '#F4F7FB')
          : getCSSVariable('--color-darkgray', '#1A2537'),
        paper: mode === 'light'
          ? '#ffffff'
          : getCSSVariable('--color-darkgray', '#1A2537'),
      },
      text: {
        primary: mode === 'light'
          ? getCSSVariable('--color-dark', '#1F2A3D')
          : '#ffffff',
        secondary: getCSSVariable('--color-bodytext', '#98A4AE'),
        disabled: getCSSVariable('--color-bodytext', '#98A4AE'),
      },
      divider: mode === 'light'
        ? getCSSVariable('--color-border', '#e0e6eb')
        : getCSSVariable('--color-darkborder', '#333F55'),
    },
    typography: {
      fontFamily: 'Manrope, system-ui, serif',
      fontSize: 14,
      h1: {
        fontSize: '2.5rem',
        fontWeight: 600,
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 600,
      },
      h3: {
        fontSize: '1.75rem',
        fontWeight: 600,
      },
      h4: {
        fontSize: '1.5rem',
        fontWeight: 600,
      },
      h5: {
        fontSize: '1.25rem',
        fontWeight: 600,
      },
      h6: {
        fontSize: '1rem',
        fontWeight: 600,
      },
      body1: {
        fontSize: "14px",
      },
      body2: {
        fontSize: "13px",
      },
      button: {
        fontSize: "14px",
        fontWeight: 500,
      },
    },
    shape: {
      borderRadius: 8,
    },
    shadows: [
      'none',
      '0px 2px 4px -1px rgba(175, 182, 201, 0.2)', // md
      '0px 2px 4px -1px rgba(175, 182, 201, 0.2)',
      '0px 2px 4px -1px rgba(175, 182, 201, 0.2)',
      'rgba(145, 158, 171, 0.3) 0px 0px 2px 0px, rgba(145, 158, 171, 0.02) 0px 12px 24px -4px', // dark-md
      '0 6px 24.2px -10px rgba(41, 52, 61, .22)',
      '0 6px 24.2px -10px rgba(41, 52, 61, .22)',
      '0 6px 24.2px -10px rgba(41, 52, 61, .22)',
      '0 6px 24.2px -10px rgba(41, 52, 61, .22)',
      '0 6px 24.2px -10px rgba(41, 52, 61, .22)',
      '0 6px 24.2px -10px rgba(41, 52, 61, .22)',
      '0 6px 24.2px -10px rgba(41, 52, 61, .22)',
      '0 6px 24.2px -10px rgba(41, 52, 61, .22)',
      '0 6px 24.2px -10px rgba(41, 52, 61, .22)',
      '0 6px 24.2px -10px rgba(41, 52, 61, .22)',
      '0 6px 24.2px -10px rgba(41, 52, 61, .22)',
      '0 6px 24.2px -10px rgba(41, 52, 61, .22)',
      '0 6px 24.2px -10px rgba(41, 52, 61, .22)',
      '0 6px 24.2px -10px rgba(41, 52, 61, .22)',
      '0 6px 24.2px -10px rgba(41, 52, 61, .22)',
      '0 6px 24.2px -10px rgba(41, 52, 61, .22)',
      '0 6px 24.2px -10px rgba(41, 52, 61, .22)',
      '0 6px 24.2px -10px rgba(41, 52, 61, .22)',
      '0 6px 24.2px -10px rgba(41, 52, 61, .22)',
      '0 6px 24.2px -10px rgba(41, 52, 61, .22)',
    ],
  });

  // Apply component overrides
  return createTheme({
    ...baseTheme,
    components: getMuiComponentOverrides(baseTheme),
  });
};

export default createAgrofyTheme;

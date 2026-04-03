import { SxProps } from '@mui/material';

export interface ThemeCardTokens {
  // Base shadow token to be used on cards and panels
  ShadowTheme: SxProps;
}

export type ThemeCardKey = keyof ThemeCardTokens;

export const ShadowTheme: ThemeCardTokens = {
  // Figma spec: X:0 Y:2 Blur:8 Spread:0 Color: #636363 12%
  ShadowTheme: {
    boxShadow: '0px 2px 8px rgba(99,99,99,0.12)'
  }
};

export default ShadowTheme;

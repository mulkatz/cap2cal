/**
 * Design tokens for colors
 * Single source of truth for all color values in the application
 */

export const colors = {
  // Base colors
  secondary: '#E0FDDCFF',
  accent: '#2C4156',
  accentElevated: '#41526a',
  primary: '#1E2E3F',
  primaryElevated: '#2C4156',
  primaryDark: '#1A2632',

  // Utility colors
  warn: '#FF2929',
  highlight: '#e6de4d',
  clickHighLight: '#e6de4d',

  // Gradient colors for cards
  gradientFrom: '#1D2E3F',
  gradientTo: '#243445',

  // Feedback colors
  ideaHighlight: '#FF0000',
  bugHighlight: '#FFFF00',

  // Overlay colors
  backdropOverlay: 'rgba(0, 0, 0, 0.7)',

  // Toast notification color
  toastBackground: '#1E2938',

  // Button gradient colors
  buttonGradientFrom: '#1f2e3d',
  buttonGradientTo: '#2C4156',

  // Loader/Spinner colors
  loaderPrimary: '#19D8E0',
  loaderSecondary: '#A0AEC0',
  loaderWhite: '#FFFFFF',

  // Window/Modal background
  windowBackground: '#080D11',

  // Special colors
  black: '#000000',
  transparent: 'transparent',
  white: '#FFFFFF',
} as const;

export type ColorToken = keyof typeof colors;

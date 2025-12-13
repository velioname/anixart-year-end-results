'use client';

import { createTheme, ThemeOptions } from '@mui/material/styles';

export type ColorScheme = 'light' | 'dark' | 'auto';
export type ColorPalette = 'default' | 'blue' | 'purple' | 'green' | 'orange' | 'red';

const colorPalettes: Record<ColorPalette, { primary: string; secondary: string }> = {
  default: { primary: '#6750A4', secondary: '#625B71' },
  blue: { primary: '#1976d2', secondary: '#42a5f5' },
  purple: { primary: '#9c27b0', secondary: '#ba68c8' },
  green: { primary: '#2e7d32', secondary: '#66bb6a' },
  orange: { primary: '#ed6c02', secondary: '#ff9800' },
  red: { primary: '#d32f2f', secondary: '#f44336' },
};

export function createAppTheme(
  colorScheme: ColorScheme,
  colorPalette: ColorPalette = 'default'
): ThemeOptions {
  const isDark = colorScheme === 'dark' || 
    (colorScheme === 'auto' && typeof window !== 'undefined' && 
     window.matchMedia('(prefers-color-scheme: dark)').matches);

  const colors = colorPalettes[colorPalette];

  return {
    palette: {
      mode: isDark ? 'dark' : 'light',
      primary: {
        main: colors.primary,
      },
      secondary: {
        main: colors.secondary,
      },
      background: {
        default: isDark ? '#121212' : '#ffffff',
        paper: isDark ? '#1e1e1e' : '#f5f5f5',
      },
    },
    typography: {
      fontFamily: [
        'Roboto',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Arial',
        'sans-serif',
      ].join(','),
      h1: {
        fontSize: '3rem',
        fontWeight: 700,
        lineHeight: 1.2,
      },
      h2: {
        fontSize: '2.5rem',
        fontWeight: 700,
        lineHeight: 1.3,
      },
      h3: {
        fontSize: '2rem',
        fontWeight: 600,
        lineHeight: 1.4,
      },
      h4: {
        fontSize: '1.75rem',
        fontWeight: 600,
        lineHeight: 1.4,
      },
      h5: {
        fontSize: '1.5rem',
        fontWeight: 500,
        lineHeight: 1.5,
      },
      h6: {
        fontSize: '1.25rem',
        fontWeight: 500,
        lineHeight: 1.5,
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 24,
            padding: '12px 32px',
            fontWeight: 500,
            fontSize: '1rem',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: isDark 
                ? '0px 4px 12px rgba(0, 0, 0, 0.3)'
                : '0px 4px 12px rgba(0, 0, 0, 0.15)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 20,
            boxShadow: isDark
              ? '0px 4px 16px rgba(0, 0, 0, 0.4)'
              : '0px 4px 16px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            letterSpacing: '0.01em',
          },
        },
      },
    },
  };
}

export function getStoredThemeSettings(): { colorScheme: ColorScheme; colorPalette: ColorPalette } {
  if (typeof window === 'undefined') {
    return { colorScheme: 'auto', colorPalette: 'default' };
  }

  const stored = localStorage.getItem('anixart_theme_settings');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return { colorScheme: 'auto', colorPalette: 'default' };
    }
  }

  return { colorScheme: 'auto', colorPalette: 'default' };
}

export function saveThemeSettings(
  colorScheme: ColorScheme,
  colorPalette: ColorPalette
) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(
      'anixart_theme_settings',
      JSON.stringify({ colorScheme, colorPalette })
    );
  }
}


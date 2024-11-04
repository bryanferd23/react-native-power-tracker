import { createTheme } from '@shopify/restyle';

const palette = {
  primary50: '#EEF2FF',
  primary100: '#E0E7FF',
  primary500: '#6366F1',
  primary600: '#4F46E5',
  primary700: '#4338CA',
  
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
  
  success50: '#F0FDF4',
  success500: '#22C55E',
  success600: '#16A34A',
  
  error50: '#FEF2F2',
  error500: '#EF4444',
  error600: '#DC2626',
  
  white: '#FFFFFF',
  transparent: 'transparent',
};

const theme = createTheme({
  colors: {
    ...palette,
    mainBackground: palette.gray50,
    cardBackground: palette.white,
    primaryText: palette.gray900,
    secondaryText: palette.gray500,
    primary: palette.primary600,
    error: palette.error500,
    success: palette.success500,
  },
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadii: {
    s: 4,
    m: 8,
    l: 12,
    xl: 16,
    xxl: 24,
    round: 9999,
  },
  textVariants: {
    header: {
      fontSize: 24,
      fontWeight: 'bold',
      color: 'primaryText',
    },
    subheader: {
      fontSize: 18,
      fontWeight: '600',
      color: 'primaryText',
    },
    body: {
      fontSize: 16,
      color: 'primaryText',
    },
    caption: {
      fontSize: 14,
      color: 'secondaryText',
    },
  },
});

export type Theme = typeof theme;
export default theme; 
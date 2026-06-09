import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Design token system - Single source of truth for spacing, typography, and radius
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const TYPOGRAPHY = {
  sizes: {
    xs: 10,
    sm: 12,
    base: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
    '5xl': 40,
  },
  weights: {
    light: '300' as const,
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
  families: {
    default: 'Poppins_400Regular' as const,
    defaultBold: 'Poppins_700Bold' as const,
    persian: 'Vazirmatn_400Regular' as const,
    persianBold: 'Vazirmatn_700Bold' as const,
  },
} as const;

export const RADIUS = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 20,
  '2xl': 28,
  full: 9999,
} as const;

// Shadow system — soft, warm, dialed back (warm & approachable)
const SHADOW_TINT = '#785C1C'; // warm brown shadow tint

export const SHADOWS = {
  none: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  small: {
    shadowColor: SHADOW_TINT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
  },
  medium: {
    shadowColor: SHADOW_TINT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 3,
  },
  large: {
    shadowColor: SHADOW_TINT,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  elevated: {
    shadowColor: SHADOW_TINT,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 28,
    elevation: 8,
  },
  glow: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 4,
  }),
} as const;

export interface Theme {
  colors: {
    // Background layers (darkest to lightest)
    background: string;
    backgroundSecondary: string;
    backgroundTertiary: string;
    backgroundQuaternary: string;

    // Primary color variations (for depth)
    primary: string;
    primaryLight: string;
    primaryLighter: string;
    primaryDark: string;

    // Gradients (Start/End)
    primaryGradient: [string, string];
    cardGradient: [string, string];
    cardGradientHighlight: [string, string];

    // Text hierarchy
    text: string;
    textSecondary: string;
    textTertiary: string;

    // Card/Surface layers
    card: string;
    cardElevated: string;
    cardHighlight: string;
    cardBorder: string;

    // Inset/field surface (warm sunken background for inputs)
    inset: string;

    // Border variations
    border: string;
    borderLight: string;

    // Gold accent variations (warm honey-amber signifier for طلا)
    goldSoft: string;
    goldSoftAlt: string;

    // Status colors
    success: string;
    successDeep: string;
    successLight: string;
    greenSoft: string;
    warning: string;
    warningLight: string;
    error: string;
    errorLight: string;

    // Overlay and glass effects
    overlay: string;
    glass: string;
    glassBorder: string;
  };
  spacing: typeof SPACING;
  typography: typeof TYPOGRAPHY;
  radius: typeof RADIUS;
  shadows: typeof SHADOWS;
  isDark: boolean;
}

const darkTheme: Theme = {
  colors: {
    // Background layers — warm espresso, never harsh black
    background: '#17130F', // Warm espresso
    backgroundSecondary: '#1E1813', // Slightly lifted warm
    backgroundTertiary: '#241E18', // Card-level warm
    backgroundQuaternary: '#2C261E', // Elevated warm

    // Primary gold — softened honey-amber (طلا signifier)
    primary: '#EAC257', // Honey gold
    primaryLight: '#F2D173', // Bright honey
    primaryLighter: '#F8E2A6', // Pale honey
    primaryDark: '#C99A2E', // Deep gold

    // Gradients
    primaryGradient: ['#F2D173', '#EAC257'], // Warm honey gradient
    cardGradient: ['#2C261E', '#241E18'], // Subtle warm card gradient
    cardGradientHighlight: ['#3A2F1A', '#2C261E'], // Active gold-tinted card

    // Text hierarchy (lighter = higher importance)
    text: '#F6EFE3', // Warm cream
    textSecondary: '#A89D8B', // Warm muted
    textTertiary: '#6E6557', // Warm faint

    // Card/Surface layers (lighter colors = elevated surfaces)
    card: '#241E18', // Base warm card
    cardElevated: '#2C261E', // Elevated warm card
    cardHighlight: '#3A2F1A', // Gold-tinted highlight
    cardBorder: '#332C23', // Warm subtle border

    // Inset/field surface
    inset: '#201A14',

    // Borders
    border: '#332C23',
    borderLight: '#2A241D',

    // Gold accent variations
    goldSoft: '#2E2616', // Warm gold wash
    goldSoftAlt: '#3A2F1A', // Stronger gold wash

    // Status colors — muted emerald (پول signifier)
    success: '#4FC18C',
    successDeep: '#6FD6A6',
    successLight: 'rgba(79, 193, 140, 0.16)',
    greenSoft: '#173026', // Warm emerald wash
    warning: '#E0A85A',
    warningLight: 'rgba(224, 168, 90, 0.16)',
    error: '#E08068', // Warm coral red
    errorLight: '#2E1C16',

    // Overlay and glass effects
    overlay: 'rgba(20, 12, 2, 0.55)',
    glass: 'rgba(36, 30, 24, 0.72)',
    glassBorder: 'rgba(246, 239, 227, 0.08)',
  },
  spacing: SPACING,
  typography: TYPOGRAPHY,
  radius: RADIUS,
  shadows: SHADOWS,
  isDark: true,
};

const lightTheme: Theme = {
  colors: {
    // Background layers — warm cream paper
    background: '#FAF6EF', // Warm cream
    backgroundSecondary: '#FCF9F3', // Lighter cream
    backgroundTertiary: '#F5EFE4', // Warm sand
    backgroundQuaternary: '#F0E8D9', // Deeper sand

    // Primary gold — softened honey-amber
    primary: '#D69A2C', // Honey gold
    primaryLight: '#ECB849', // Bright honey
    primaryLighter: '#F7E6C2', // Pale honey
    primaryDark: '#B07C18', // Deep gold

    // Gradients
    primaryGradient: ['#ECB849', '#D69A2C'],
    cardGradient: ['#FFFFFF', '#FAF6EF'],
    cardGradientHighlight: ['#FBEFD4', '#FFFFFF'],

    // Text hierarchy — warm espresso ink
    text: '#2B2620', // Espresso
    textSecondary: '#8B8174', // Warm gray
    textTertiary: '#B7AE9F', // Warm faint

    // Card/Surface layers
    card: '#FFFFFF', // White card
    cardElevated: '#FFFFFF', // Elevated white card
    cardHighlight: '#FBEFD4', // Gold-tinted highlight
    cardBorder: '#ECE3D3',

    // Inset/field surface
    inset: '#F7F2E9',

    // Borders
    border: '#ECE3D3',
    borderLight: '#F2EADC',

    // Gold accent variations
    goldSoft: '#FBEFD4', // Warm gold wash
    goldSoftAlt: '#F7E6C2', // Stronger gold wash

    // Status colors — muted emerald
    success: '#2E9E6B',
    successDeep: '#1E7A50',
    successLight: 'rgba(46, 158, 107, 0.12)',
    greenSoft: '#E2F2E9', // Soft emerald wash
    warning: '#C98A2E',
    warningLight: 'rgba(201, 138, 46, 0.12)',
    error: '#D9694F', // Warm coral red
    errorLight: '#FBE9E3',

    // Overlay and glass effects
    overlay: 'rgba(43, 38, 32, 0.4)',
    glass: 'rgba(255, 255, 255, 0.8)',
    glassBorder: 'rgba(43, 38, 32, 0.06)',
  },
  spacing: SPACING,
  typography: TYPOGRAPHY,
  radius: RADIUS,
  shadows: SHADOWS,
  isDark: false,
};

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@affordly_theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(true); // Default to dark theme

  useEffect(() => {
    void loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme !== null) {
        setIsDark(savedTheme === 'dark');
      }
    } catch (error) {
      console.error('Failed to load theme:', error);
    }
  };

  const toggleTheme = async () => {
    try {
      const newTheme = !isDark;
      setIsDark(newTheme);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme ? 'dark' : 'light');
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  };

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

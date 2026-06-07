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
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  full: 9999,
} as const;

// Shadow system for depth
export const SHADOWS = {
  none: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 8,
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 12,
  },
  glow: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
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

    // Border variations
    border: string;
    borderLight: string;

    // Status colors
    success: string;
    successLight: string;
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
    // Background layers (darkest to lightest for depth)
    background: '#050505', // Deep absolute black/gray
    backgroundSecondary: '#0F0F0F', // Slightly lighter
    backgroundTertiary: '#181818', // More definition
    backgroundQuaternary: '#222222', // Elements

    // Primary gold with depth variations
    primary: '#D4AF37', // Metallic Gold
    primaryLight: '#F3D060', // Lighter Gold
    primaryLighter: '#FAE596', // Pale Gold
    primaryDark: '#AA8C2C', // Darkened Gold
    
    // Gradients
    primaryGradient: ['#D4AF37', '#F3D060'], // Rich Gold Gradient
    cardGradient: ['#1A1A1A', '#121212'], // Subtle Card Gradient
    cardGradientHighlight: ['#252525', '#1A1A1A'], // Active Card Gradient

    // Text hierarchy (lighter = higher importance)
    text: '#FFFFFF', // Pure White
    textSecondary: '#CCCCCC', // Light Gray
    textTertiary: '#888888', // Muted Gray

    // Card/Surface layers (lighter colors = elevated surfaces)
    card: '#141414', // Base dark card
    cardElevated: '#1E1E1E', // Elevated card
    cardHighlight: '#2A2A2A', // Highlight state
    cardBorder: '#333333', // Subtle border

    // Borders (lighter for emphasis)
    border: '#2A2A2A',
    borderLight: '#444444',

    // Status colors with light variations
    success: '#10B981',
    successLight: 'rgba(16, 185, 129, 0.15)',
    warning: '#F59E0B',
    warningLight: 'rgba(245, 158, 11, 0.15)',
    error: '#EF4444',
    errorLight: 'rgba(239, 68, 68, 0.15)',

    // Overlay and glass effects
    overlay: 'rgba(0, 0, 0, 0.85)',
    glass: 'rgba(26, 26, 26, 0.65)',
    glassBorder: 'rgba(255, 255, 255, 0.08)',
  },
  spacing: SPACING,
  typography: TYPOGRAPHY,
  radius: RADIUS,
  shadows: SHADOWS,
  isDark: true,
};

const lightTheme: Theme = {
  colors: {
    // Background layers (darkest to lightest for depth)
    background: '#F8F9FA', // Cool gray white
    backgroundSecondary: '#FFFFFF', // Pure white
    backgroundTertiary: '#F0F2F5', // Off-white
    backgroundQuaternary: '#E9ECEF', // Subtle gray

    // Primary gold with depth variations
    primary: '#D4AF37', // Metallic Gold
    primaryLight: '#E6C24A', // Lighter Gold
    primaryLighter: '#FBE8A6', // Pale Gold
    primaryDark: '#B8962D', // Dark Gold
    
    // Gradients
    primaryGradient: ['#D4AF37', '#E6C24A'],
    cardGradient: ['#FFFFFF', '#F8F9FA'],
    cardGradientHighlight: ['#FFFBF0', '#FFFDF5'],

    // Text hierarchy (darker = higher importance in light mode)
    text: '#111111', // Almost Black
    textSecondary: '#555555', // Medium Gray
    textTertiary: '#888888', // Light Gray

    // Card/Surface layers (lighter = elevated in light mode)
    card: '#FFFFFF', // White card
    cardElevated: '#FFFFFF', // Elevated white card
    cardHighlight: '#FEFCF5', // Warm tint for highlight
    cardBorder: '#EDEEF0',

    // Borders (darker for definition)
    border: '#E2E4E8',
    borderLight: '#EEEFF2',

    // Status colors with light variations
    success: '#059669',
    successLight: 'rgba(5, 150, 105, 0.1)',
    warning: '#D97706',
    warningLight: 'rgba(217, 119, 6, 0.1)',
    error: '#DC2626',
    errorLight: 'rgba(220, 38, 38, 0.1)',

    // Overlay and glass effects
    overlay: 'rgba(0, 0, 0, 0.4)',
    glass: 'rgba(255, 255, 255, 0.75)',
    glassBorder: 'rgba(255, 255, 255, 0.5)',
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

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtext?: string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  style?: StyleProp<ViewStyle>;
}

/**
 * StatCard - Glassmorphism style card for displaying statistics
 */
export default function StatCard({
  icon,
  label,
  value,
  subtext,
  variant = 'default',
  style,
}: StatCardProps) {
  const { theme, isDark } = useTheme();

  const getAccentColor = () => {
    switch (variant) {
      case 'primary':
        return theme.colors.primary;
      case 'success':
        return theme.colors.success;
      case 'warning':
        return theme.colors.warning;
      case 'error':
        return theme.colors.error;
      default:
        return theme.colors.primary;
    }
  };

  const accentColor = getAccentColor();

  return (
    <View
      style={[
        styles.container,
        {
          borderColor: theme.colors.glassBorder,
        },
        theme.shadows.medium,
        style,
      ]}
    >
      <BlurView intensity={isDark ? 30 : 50} tint={isDark ? 'dark' : 'light'} style={styles.blur}>
        <LinearGradient
          colors={
            isDark
              ? ['rgba(255,255,255,0.03)', 'rgba(255,255,255,0.01)']
              : ['rgba(255,255,255,0.6)', 'rgba(255,255,255,0.4)']
          }
          style={styles.gradient}
        >
          <View style={[styles.iconContainer, { backgroundColor: accentColor + '15' }]}>
            {icon}
          </View>
          
          <Text
            style={[
              styles.label,
              {
                color: theme.colors.textSecondary,
              },
            ]}
          >
            {label}
          </Text>
          
          <Text
            style={[
              styles.value,
              {
                color: theme.colors.text, // Use main text color for cleaner look
              },
            ]}
          >
            {value}
          </Text>
          
          {subtext && (
            <Text
              style={[
                styles.subtext,
                {
                  color: accentColor, // Accent color for subtext/trend
                },
              ]}
            >
              {subtext}
            </Text>
          )}
        </LinearGradient>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  blur: {
    width: '100%',
  },
  container: {
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
  },
  gradient: {
    alignItems: 'center',
    padding: 24,
  },
  iconContainer: {
    alignItems: 'center',
    borderRadius: 20,
    height: 64,
    justifyContent: 'center',
    marginBottom: 16,
    width: 64,
  },
  label: {
    fontFamily: 'Vazirmatn_400Regular',
    fontSize: 14,
    letterSpacing: 0.5,
    marginBottom: 4,
    textAlign: 'center',
  },
  subtext: {
    fontFamily: 'Vazirmatn_500Medium',
    fontSize: 13,
    marginTop: 8,
    textAlign: 'center',
  },
  value: {
    fontFamily: 'Vazirmatn_700Bold',
    fontSize: 32,
    textAlign: 'center',
  },
});

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
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
 * StatCard - Warm, clean hero card for displaying statistics.
 */
export default function StatCard({
  icon,
  label,
  value,
  subtext,
  variant = 'default',
  style,
}: StatCardProps) {
  const { theme } = useTheme();

  const getAccentColor = () => {
    switch (variant) {
      case 'success':
        return theme.colors.success;
      case 'warning':
        return theme.colors.warning;
      case 'error':
        return theme.colors.error;
      case 'primary':
      default:
        return theme.colors.primary;
    }
  };

  const accentColor = getAccentColor();
  const gradientColors: [string, string] =
    variant === 'primary' ? [theme.colors.goldSoft, theme.colors.card] : theme.colors.cardGradient;

  return (
    <View
      style={[
        styles.container,
        {
          borderColor: variant === 'primary' ? theme.colors.goldSoftAlt : theme.colors.border,
        },
        theme.shadows.small,
        style,
      ]}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={styles.gradient}
      >
        <View style={[styles.iconContainer, { backgroundColor: accentColor + '1A' }]}>{icon}</View>

        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>{label}</Text>

        <Text style={[styles.value, { color: theme.colors.text }]}>{value}</Text>

        {subtext && (
          <Text style={[styles.subtext, { color: theme.colors.primaryDark }]}>{subtext}</Text>
        )}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 28,
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
    fontFamily: 'Vazirmatn_500Medium',
    fontSize: 14,
    letterSpacing: 0.3,
    marginBottom: 4,
    textAlign: 'center',
  },
  subtext: {
    fontFamily: 'Vazirmatn_700Bold',
    fontSize: 13,
    marginTop: 8,
    textAlign: 'center',
  },
  value: {
    fontFamily: 'Vazirmatn_700Bold',
    fontSize: 32,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
});

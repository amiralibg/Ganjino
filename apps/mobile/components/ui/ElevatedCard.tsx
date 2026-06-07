import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface ElevatedCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  elevation?: 'base' | 'elevated' | 'highlight';
  shadowLevel?: 'none' | 'small' | 'medium' | 'large';
}

/**
 * ElevatedCard - A depth-aware card component
 *
 * Uses color layering and shadows to create visual hierarchy:
 * - base: Standard card (card color + small shadow)
 * - elevated: Raised card (cardElevated color + medium shadow)
 * - highlight: Active/selected card (cardHighlight color + medium shadow)
 */
export default function ElevatedCard({
  children,
  style,
  elevation = 'base',
  shadowLevel = 'medium',
}: ElevatedCardProps) {
  const { theme } = useTheme();

  const getBackgroundColor = () => {
    switch (elevation) {
      case 'elevated':
        return theme.colors.cardElevated;
      case 'highlight':
        return theme.colors.cardHighlight;
      case 'base':
      default:
        return theme.colors.card;
    }
  };

  const getShadow = () => {
    switch (shadowLevel) {
      case 'none':
        return theme.shadows.none;
      case 'small':
        return theme.shadows.small;
      case 'large':
        return theme.shadows.large;
      case 'medium':
      default:
        return theme.shadows.medium;
    }
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: theme.colors.cardBorder,
          borderRadius: theme.radius.lg,
        },
        getShadow(),
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    overflow: 'hidden',
  },
});

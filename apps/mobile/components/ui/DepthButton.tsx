import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  StyleProp,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';

interface DepthButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

/**
 * DepthButton - Premium 3D-feel button with gradients
 */
export default function DepthButton({
  children,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
  iconPosition = 'left',
}: DepthButtonProps) {
  const { theme } = useTheme();

  const getGradientColors = () => {
    if (disabled) {
      return [theme.colors.cardBorder, theme.colors.cardBorder];
    }
    
    if (variant === 'primary') {
      return theme.colors.primaryGradient;
    }
    if (variant === 'secondary') {
      return [theme.colors.cardElevated, theme.colors.cardElevated];
    }
    return ['transparent', 'transparent'];
  };

  const getTextColor = () => {
    if (disabled) {
      return theme.colors.textTertiary;
    }

    switch (variant) {
      case 'primary':
        return theme.isDark ? '#0A0A0A' : '#FFFFFF';
      case 'secondary':
        return theme.colors.text;
      case 'outline':
        return theme.colors.primary;
      case 'ghost':
        return theme.colors.text;
      default:
        return '#FFFFFF';
    }
  };

  const getShadow = () => {
    if (disabled || variant === 'ghost' || variant === 'outline') {
      return theme.shadows.none;
    }

    if (variant === 'primary') {
      return theme.shadows.glow(theme.colors.primary);
    }

    return theme.shadows.small;
  };

  const getPadding = () => {
    switch (size) {
      case 'small':
        return { paddingVertical: 10, paddingHorizontal: 16 };
      case 'large':
        return { paddingVertical: 16, paddingHorizontal: 32 };
      case 'medium':
      default:
        return { paddingVertical: 14, paddingHorizontal: 24 };
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'small':
        return 14;
      case 'large':
        return 18;
      case 'medium':
      default:
        return 16;
    }
  };

  const ButtonContent = () => (
    <View style={styles.contentContainer}>
       {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <>
          {icon && iconPosition === 'left' && <View style={styles.iconLeft}>{icon}</View>}
          <Text
            style={[
              styles.text,
              {
                color: getTextColor(),
                fontSize: getFontSize(),
              },
              textStyle,
            ]}
          >
            {children}
          </Text>
          {icon && iconPosition === 'right' && <View style={styles.iconRight}>{icon}</View>}
        </>
      )}
    </View>
  );

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        styles.container,
        getShadow(),
        style,
      ]}
    >
      <LinearGradient
        colors={getGradientColors() as [string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[
          styles.gradient,
          {
            borderRadius: theme.radius.xl,
            ...getPadding(),
          },
          variant === 'outline' && {
            borderWidth: 2,
            borderColor: disabled ? theme.colors.cardBorder : theme.colors.primary,
          },
        ]}
      >
        <ButtonContent />
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    // Container handles the shadow
  },
  contentContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  gradient: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    marginRight: 10,
  },
  iconRight: {
    marginLeft: 10,
  },
  text: {
    fontFamily: 'Vazirmatn_700Bold',
  },
});

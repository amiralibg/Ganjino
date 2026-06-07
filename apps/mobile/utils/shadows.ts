import { Platform, ViewStyle } from 'react-native';

/**
 * Creates cross-platform shadow styles
 * iOS uses shadow properties, Android uses elevation
 *
 * @param elevation - Shadow depth (1-24, recommended: 2, 4, 8, 16)
 * @param color - Shadow color (default: '#000')
 * @returns Platform-specific shadow styles
 */
export const createShadow = (elevation: number = 2, color: string = '#000'): ViewStyle => {
  return Platform.select({
    ios: {
      shadowColor: color,
      shadowOffset: {
        width: 0,
        height: elevation,
      },
      shadowOpacity: 0.2,
      shadowRadius: elevation * 2,
    },
    android: {
      elevation,
    },
    default: {},
  }) as ViewStyle;
};

/**
 * Predefined shadow presets for common use cases
 */
export const shadows = {
  none: createShadow(0),
  small: createShadow(2),
  medium: createShadow(4),
  large: createShadow(8),
  xlarge: createShadow(16),
};

import React from 'react';
import { View, TextInput, StyleSheet, TextInputProps, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface GlassInputProps extends TextInputProps {
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  containerStyle?: StyleProp<ViewStyle>;
  /**
   * Swap the underlying input element (e.g. gorhom's BottomSheetTextInput when
   * used inside a bottom sheet so the keyboard avoidance works correctly).
   */
  InputComponent?: React.ComponentType<TextInputProps>;
}

/**
 * GlassInput - Warm, solid inset input field (RTL-aware).
 */
export default function GlassInput({
  icon,
  iconPosition = 'left',
  containerStyle,
  style,
  InputComponent = TextInput,
  ...textInputProps
}: GlassInputProps) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.inset,
          borderColor: theme.colors.border,
          borderRadius: theme.radius.lg,
        },
        containerStyle,
      ]}
    >
      {icon && iconPosition === 'left' && <View style={styles.iconLeft}>{icon}</View>}
      <InputComponent
        {...textInputProps}
        style={[styles.input, { color: theme.colors.text }, style]}
        placeholderTextColor={theme.colors.textTertiary}
      />
      {icon && iconPosition === 'right' && <View style={styles.iconRight}>{icon}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderWidth: 1,
    flexDirection: 'row',
    height: 56,
    paddingHorizontal: 16,
  },
  iconLeft: {
    marginRight: 12,
  },
  iconRight: {
    marginLeft: 12,
  },
  input: {
    flex: 1,
    fontFamily: 'Vazirmatn_400Regular',
    fontSize: 16,
    height: '100%',
    textAlign: 'right',
  },
});

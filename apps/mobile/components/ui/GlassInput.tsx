import React from 'react';
import { View, TextInput, StyleSheet, TextInputProps, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { BlurView } from 'expo-blur';

interface GlassInputProps extends TextInputProps {
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  containerStyle?: StyleProp<ViewStyle>;
}

/**
 * GlassInput - A glassmorphism input component
 */
export default function GlassInput({
  icon,
  iconPosition = 'left',
  containerStyle,
  style,
  ...textInputProps
}: GlassInputProps) {
  const { theme, isDark } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          borderColor: theme.colors.glassBorder,
        },
        theme.shadows.small,
        containerStyle,
      ]}
    >
      <BlurView
        intensity={isDark ? 20 : 40}
        tint={isDark ? 'dark' : 'light'}
        style={styles.blur}
      >
        <View style={[styles.contentContainer, { backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.4)' }]}>
            {icon && iconPosition === 'left' && <View style={styles.iconLeft}>{icon}</View>}
            <TextInput
                {...textInputProps}
                style={[
                styles.input,
                {
                    color: theme.colors.text,
                },
                style,
                ]}
                placeholderTextColor={theme.colors.textTertiary}
            />
            {icon && iconPosition === 'right' && <View style={styles.iconRight}>{icon}</View>}
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  blur: {
    height: '100%',
    width: '100%',
  },
  container: {
    borderRadius: 16,
    borderWidth: 1,
    height: 56,
    overflow: 'hidden',
  },
  contentContainer: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
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

import React from 'react';
import {
  Modal,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { X } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface AppBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  /** Sticky footer (e.g. primary action buttons) pinned to the bottom. */
  footer?: React.ReactNode;
  /** Wrap children in a scroll view (default true). Disable for short content. */
  scrollable?: boolean;
}

/**
 * AppBottomSheet — a themed, RTL-aware bottom sheet built on React Native's
 * core Modal (slide-up, dimmed backdrop, grabber, optional sticky footer).
 *
 * Uses the platform Modal rather than a gesture/portal based sheet so it
 * renders reliably across platforms and the new architecture.
 */
export default function AppBottomSheet({
  visible,
  onClose,
  title,
  children,
  footer,
  scrollable = true,
}: AppBottomSheetProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const header = title ? (
    <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
      <TouchableOpacity onPress={onClose} hitSlop={8}>
        <X size={24} color={theme.colors.textSecondary} strokeWidth={2} />
      </TouchableOpacity>
    </View>
  ) : null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        style={styles.fill}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.fill}>
          <Pressable style={styles.backdrop} onPress={onClose} />

          <View
            style={[
              styles.sheet,
              { borderColor: theme.colors.border, paddingBottom: (insets.bottom || 0) + 8 },
            ]}
          >
            <LinearGradient
              colors={[theme.colors.background, theme.colors.backgroundSecondary]}
              style={StyleSheet.absoluteFill}
            />

            <View style={[styles.grabber, { backgroundColor: theme.colors.border }]} />

            {scrollable ? (
              <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.content}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                {header}
                {children}
              </ScrollView>
            ) : (
              <View style={styles.content}>
                {header}
                {children}
              </View>
            )}

            {footer && (
              <View style={[styles.footer, { borderTopColor: theme.colors.border }]}>{footer}</View>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 4,
  },
  fill: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  footer: {
    borderTopWidth: 1,
    gap: 12,
    marginTop: 24,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  grabber: {
    alignSelf: 'center',
    borderRadius: 999,
    height: 5,
    marginBottom: 8,
    marginTop: 10,
    width: 44,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingBottom: 16,
  },
  scroll: {
    flexGrow: 0,
    flexShrink: 1,
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    maxHeight: '90%',
    overflow: 'hidden',
  },
  title: {
    fontFamily: 'Vazirmatn_700Bold',
    fontSize: 22,
  },
});

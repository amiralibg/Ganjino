import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import DepthButton from './DepthButton';
import { TEXT } from '@/constants/text';

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * ConfirmDialog — a themed centered alert dialog used for destructive
 * confirmations. Restyled to match the app's bottom sheets.
 */
export default function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel = TEXT.common.delete,
  cancelLabel = TEXT.common.cancel,
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    buttons: {
      flexDirection: 'row',
      gap: 12,
    },
    card: {
      backgroundColor: theme.colors.card,
      borderColor: theme.colors.border,
      borderRadius: 24,
      borderWidth: 1,
      maxWidth: 420,
      padding: 24,
      width: '100%',
    },
    flex: {
      flex: 1,
    },
    message: {
      color: theme.colors.textSecondary,
      fontFamily: 'Vazirmatn_400Regular',
      fontSize: 15,
      lineHeight: 24,
      marginBottom: 24,
      textAlign: 'right',
    },
    overlay: {
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.55)',
      flex: 1,
      justifyContent: 'center',
      padding: 24,
    },
    title: {
      color: theme.colors.text,
      fontFamily: 'Vazirmatn_700Bold',
      fontSize: 19,
      marginBottom: 10,
      textAlign: 'right',
    },
  });

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onCancel}>
      <Pressable style={styles.overlay} onPress={onCancel}>
        <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.buttons}>
            <DepthButton onPress={onCancel} variant="outline" size="medium" style={styles.flex}>
              {cancelLabel}
            </DepthButton>
            <DepthButton
              onPress={onConfirm}
              disabled={loading}
              variant="primary"
              size="medium"
              style={styles.flex}
            >
              {loading ? TEXT.common.loading : confirmLabel}
            </DepthButton>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

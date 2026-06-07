import Toast, { BaseToast, ErrorToast, BaseToastProps } from 'react-native-toast-message';

// Extracted style constants to avoid inline styles
const contentContainerStyle = { paddingHorizontal: 15 };

const successStyle = {
  borderLeftColor: '#10B981',
  backgroundColor: '#065F46',
  borderRadius: 12,
  height: 60,
};

const successText1Style = {
  fontSize: 15,
  fontWeight: '600' as const,
  color: '#ECFDF5',
  fontFamily: 'Vazirmatn_700Bold',
};

const successText2Style = {
  fontSize: 13,
  color: '#D1FAE5',
  fontFamily: 'Vazirmatn_400Regular',
};

const errorStyle = {
  borderLeftColor: '#EF4444',
  backgroundColor: '#7F1D1D',
  borderRadius: 12,
  height: 60,
};

const errorText1Style = {
  fontSize: 15,
  fontWeight: '600' as const,
  color: '#FEE2E2',
  fontFamily: 'Vazirmatn_700Bold',
};

const errorText2Style = {
  fontSize: 13,
  color: '#FECACA',
  fontFamily: 'Vazirmatn_400Regular',
};

const infoStyle = {
  borderLeftColor: '#3B82F6',
  backgroundColor: '#1E3A8A',
  borderRadius: 12,
  height: 60,
};

const infoText1Style = {
  fontSize: 15,
  fontWeight: '600' as const,
  color: '#DBEAFE',
  fontFamily: 'Vazirmatn_700Bold',
};

const infoText2Style = {
  fontSize: 13,
  color: '#BFDBFE',
  fontFamily: 'Vazirmatn_400Regular',
};

export const toastConfig = {
  success: (props: BaseToastProps) => (
    <BaseToast
      {...props}
      style={successStyle}
      contentContainerStyle={contentContainerStyle}
      text1Style={successText1Style}
      text2Style={successText2Style}
    />
  ),
  error: (props: BaseToastProps) => (
    <ErrorToast
      {...props}
      style={errorStyle}
      contentContainerStyle={contentContainerStyle}
      text1Style={errorText1Style}
      text2Style={errorText2Style}
    />
  ),
  info: (props: BaseToastProps) => (
    <BaseToast
      {...props}
      style={infoStyle}
      contentContainerStyle={contentContainerStyle}
      text1Style={infoText1Style}
      text2Style={infoText2Style}
    />
  ),
};

// Helper function to show toast notifications
export const showToast = {
  success: (title: string, message?: string) => {
    Toast.show({
      type: 'success',
      text1: title,
      text2: message,
      position: 'top',
      visibilityTime: 3000,
      topOffset: 60,
    });
  },
  error: (title: string, message?: string) => {
    Toast.show({
      type: 'error',
      text1: title,
      text2: message,
      position: 'top',
      visibilityTime: 4000,
      topOffset: 60,
    });
  },
  info: (title: string, message?: string) => {
    Toast.show({
      type: 'info',
      text1: title,
      text2: message,
      position: 'top',
      visibilityTime: 3000,
      topOffset: 60,
    });
  },
};

import { TextStyle } from 'react-native';
import { TYPOGRAPHY } from '@/contexts/ThemeContext';

// App is Persian-only, always use Persian fonts
export const useLocalizedFont = (weight?: 'regular' | 'bold'): TextStyle => {
  return {
    fontFamily: weight === 'bold' ? TYPOGRAPHY.families.persianBold : TYPOGRAPHY.families.persian,
  };
};

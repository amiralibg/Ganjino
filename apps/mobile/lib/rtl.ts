import { I18nManager } from 'react-native';

// App is Persian-only, so we always enable RTL
export const setupRTL = () => {
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(true);
};

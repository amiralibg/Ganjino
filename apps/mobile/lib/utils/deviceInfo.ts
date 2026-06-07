import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

export interface DeviceInfo {
  deviceId: string;
  deviceName: string;
  platform: 'ios' | 'android' | 'web';
  appVersion?: string;
  osVersion?: string;
}

export const getDeviceInfo = (): DeviceInfo => {
  // Generate a unique device ID if not available
  const deviceId = Constants.deviceId || Constants.sessionId || `${Platform.OS}-${Date.now()}`;

  const deviceName = Device.deviceName || Device.modelName || `${Platform.OS} Device`;

  const platform = Platform.OS === 'ios' ? 'ios' : Platform.OS === 'android' ? 'android' : 'web';

  return {
    deviceId,
    deviceName,
    platform,
    appVersion: Constants.expoConfig?.version,
    osVersion: Device.osVersion ?? undefined,
  };
};

import apiClient from './client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDeviceInfo } from '../utils/deviceInfo';

export interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
}

export interface SignUpData {
  email: string;
  password: string;
  name: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  accessToken: string;
  refreshToken: string;
  warning?: string;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string; // NEW: Backend now returns new refresh token
}

export interface ValidateResponse {
  valid: boolean;
  user: User;
}

export interface Session {
  id: string;
  device: {
    deviceId: string;
    deviceName: string;
    platform: string;
  };
  lastUsed: Date;
  usageCount: number;
  suspicious: boolean;
  createdAt: Date;
}

export const authApi = {
  signUp: async (data: SignUpData): Promise<AuthResponse> => {
    const deviceInfo = getDeviceInfo();
    const response = await apiClient.post<AuthResponse>('/auth/signup', {
      ...data,
      ...deviceInfo,
    });
    await AsyncStorage.setItem('accessToken', response.data.accessToken);
    await AsyncStorage.setItem('refreshToken', response.data.refreshToken);
    return response.data;
  },

  signIn: async (data: SignInData): Promise<AuthResponse> => {
    const deviceInfo = getDeviceInfo();
    const response = await apiClient.post<AuthResponse>('/auth/signin', {
      ...data,
      ...deviceInfo,
    });
    await AsyncStorage.setItem('accessToken', response.data.accessToken);
    await AsyncStorage.setItem('refreshToken', response.data.refreshToken);
    return response.data;
  },

  refreshToken: async (refreshToken: string): Promise<RefreshResponse> => {
    const response = await apiClient.post<RefreshResponse>('/auth/refresh', {
      refreshToken,
    });
    // IMPORTANT: Store BOTH tokens (backend now returns new refresh token)
    await AsyncStorage.setItem('accessToken', response.data.accessToken);
    await AsyncStorage.setItem('refreshToken', response.data.refreshToken);
    return response.data;
  },

  validate: async (): Promise<ValidateResponse> => {
    const response = await apiClient.get<ValidateResponse>('/auth/validate');
    return response.data;
  },

  getMe: async (): Promise<{ user: User }> => {
    const response = await apiClient.get<{ user: User }>('/auth/me');
    return response.data;
  },

  signOut: async (refreshToken: string): Promise<void> => {
    try {
      await apiClient.post('/auth/logout', { refreshToken });
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
    }
  },

  // NEW: Logout from all devices
  signOutAllDevices: async (): Promise<{ message: string; revokedCount: number }> => {
    const response = await apiClient.post<{ message: string; revokedCount: number }>(
      '/auth/logout-all'
    );
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken');
    return response.data;
  },

  // NEW: Get active sessions
  getActiveSessions: async (): Promise<{ sessions: Session[] }> => {
    const response = await apiClient.get<{ sessions: Session[] }>('/auth/sessions');
    return response.data;
  },

  // NEW: Revoke specific session
  revokeSession: async (sessionId: string): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(`/auth/sessions/${sessionId}`);
    return response.data;
  },
};

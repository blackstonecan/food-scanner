import * as Application from 'expo-application';
import { Platform } from 'react-native';

let cachedDeviceId: string | null = null;

/**
 * Get a unique identifier for this device
 * Uses expo-application to get device-specific IDs
 */
export const getDeviceId = async (): Promise<string> => {
  if (cachedDeviceId) {
    return cachedDeviceId;
  }

  try {
    // Try to get Android ID or iOS Vendor ID
    let deviceId: string | null = null;

    if (Platform.OS === 'android') {
      deviceId = Application.getAndroidId();
    } else if (Platform.OS === 'ios') {
      deviceId = await Application.getIosIdForVendorAsync();
    } else {
      // Fallback for web or other platforms
      deviceId = `web-${Date.now()}-${Math.random()}`;
    }

    if (!deviceId) {
      // Ultimate fallback: generate and store in memory
      deviceId = `device-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    }

    cachedDeviceId = deviceId;
    return deviceId;
  } catch (error) {
    console.error('Error getting device ID:', error);
    // Fallback
    const fallbackId = `fallback-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    cachedDeviceId = fallbackId;
    return fallbackId;
  }
};

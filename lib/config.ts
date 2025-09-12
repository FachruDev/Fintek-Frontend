export const BASE_URL =
  process.env.EXPO_PUBLIC_BASE_URL ||
  process.env.BASE_URL ||
  'http://10.0.2.2:8080'; // Android emulator default

export const API = `${BASE_URL.replace(/\/$/, '')}/api`;

export const GOOGLE_WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || '';
export const GOOGLE_ANDROID_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || '';


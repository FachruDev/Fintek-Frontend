import { Platform } from 'react-native';

let memoryToken: string | null = null;

export function getToken(): string | null {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    try {
      return window.localStorage.getItem('auth_token');
    } catch {}
  }
  return memoryToken;
}

export function setToken(token: string | null) {
  memoryToken = token;
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    try {
      if (token) window.localStorage.setItem('auth_token', token);
      else window.localStorage.removeItem('auth_token');
    } catch {}
  }
}


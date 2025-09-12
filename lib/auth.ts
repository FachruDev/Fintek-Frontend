import { request } from './api';
import { setToken } from './token-store';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  is_verified: boolean;
  created_at: string;
};

export async function signIn(email: string, password: string) {
  const data = await request<{ token: string; user: AuthUser }>(`/auth/login`, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  setToken(data.token);
  return data.user;
}

export async function signUp(name: string, email: string, password: string) {
  const data = await request<{ token: string; user: AuthUser }>(`/auth/register`, {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
  // backend masih butuh OTP verification; tidak set token dulu
  return data.user;
}

export async function signInWithGoogle(id_token: string) {
  const data = await request<{ token: string; user: AuthUser }>(`/auth/google`, {
    method: 'POST',
    body: JSON.stringify({ id_token }),
  });
  setToken(data.token);
  try {
    const u = await me();
    return u;
  } catch {
    return data.user;
  }
}

export async function me() {
  return request<AuthUser>(`/me`, { method: 'GET' });
}

export function signOut() {
  setToken(null);
}

// OTP flows
export async function requestOtp(email: string) {
  return request<{ ok: boolean }>(`/auth/request-otp`, {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function verifyOtp(email: string, code: string) {
  return request<{ verified: boolean }>(`/auth/verify-otp`, {
    method: 'POST',
    body: JSON.stringify({ email, code }),
  });
}

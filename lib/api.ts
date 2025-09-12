import { API } from './config';
import { getToken } from './token-store';

type Json = Record<string, unknown>;

export async function request<T>(path: string, opts?: RequestInit): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(opts?.headers || {}),
    },
    ...opts,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json?.success === false) {
    const message = json?.error?.message || res.statusText;
    throw new Error(message);
  }
  return (json?.data ?? json) as T;
}

export async function apiRegister(payload: { name: string; email: string; password: string }) {
  return request<{ token: string; user: Json }>(`/auth/register`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function apiLogin(payload: { email: string; password: string }) {
  return request<{ token: string; user: Json }>(`/auth/login`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function apiGoogleLogin(id_token: string) {
  return request<{ token: string; user: Json }>(`/auth/google`, {
    method: 'POST',
    body: JSON.stringify({ id_token }),
  });
}

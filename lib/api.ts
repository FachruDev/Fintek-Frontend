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
    const message =
      (typeof (json as any)?.error === 'string' ? (json as any).error : (json as any)?.error?.message) ||
      (json as any)?.message ||
      res.statusText;
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

// Categories
export type Category = {
  id: string;
  user_id: string;
  name: string;
  kind: 'income' | 'expense';
  color?: string;
  created_at: string;
};

export async function listCategories() {
  return request<Category[]>(`/categories`, { method: 'GET' });
}

export async function createCategory(payload: { name: string; kind: 'income' | 'expense'; color?: string }) {
  return request<Category>(`/categories`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateCategory(id: string, payload: Partial<{ name: string; kind: 'income' | 'expense'; color?: string }>) {
  return request<Category>(`/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function deleteCategory(id: string) {
  return request<{ success: boolean; message?: string }>(`/categories/${id}`, {
    method: 'DELETE',
  });
}

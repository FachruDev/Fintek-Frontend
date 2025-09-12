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

// Transactions
export type Transaction = {
  id: string;
  user_id: string;
  category_id: string;
  amount: string; // server returns string decimal
  occurred_on: string; // YYYY-MM-DD
  description?: string;
};

export async function listTransactions(params?: { category_id?: string; start_date?: string; end_date?: string }) {
  const qs = new URLSearchParams();
  if (params?.category_id) qs.set('category_id', params.category_id);
  if (params?.start_date) qs.set('start_date', params.start_date);
  if (params?.end_date) qs.set('end_date', params.end_date);
  const suffix = qs.toString() ? `?${qs.toString()}` : '';
  // API docs show plain array without wrapper for list
  return request<Transaction[]>(`/transactions${suffix}`, { method: 'GET' });
}

export async function createTransaction(payload: { category_id: string; amount: string | number; occurred_on: string; description?: string }) {
  return request<Transaction>(`/transactions`, {
    method: 'POST',
    body: JSON.stringify({ ...payload, amount: String(payload.amount) }),
  });
}

export async function updateTransaction(id: string, payload: Partial<{ category_id: string; amount: string | number; occurred_on: string; description?: string }>) {
  const body: any = { ...payload };
  if (typeof body.amount !== 'undefined') body.amount = String(body.amount);
  return request<Transaction>(`/transactions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

export async function deleteTransaction(id: string) {
  return request<{ success: boolean; message?: string }>(`/transactions/${id}`, {
    method: 'DELETE',
  });
}

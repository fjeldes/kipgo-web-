const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

function getStoredAuth(): { token?: string; refreshToken?: string } {
  try {
    const raw = localStorage.getItem('admin_auth');
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function storeAuth(auth: { token?: string; refreshToken?: string; user?: any }) {
  const existing = getStoredAuth();
  localStorage.setItem('admin_auth', JSON.stringify({ ...existing, ...auth }));
}

async function refreshAccessToken(): Promise<string | null> {
  const { refreshToken } = getStoredAuth();
  if (!refreshToken) return null;

  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    storeAuth({ token: data.accessToken, refreshToken: data.refreshToken });
    return data.accessToken;
  } catch {
    return null;
  }
}

interface RequestOptions extends RequestInit {
  token?: string;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { token, ...fetchOptions } = options;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string>),
  };

  let activeToken = token || getStoredAuth().token;
  if (activeToken) headers['Authorization'] = `Bearer ${activeToken}`;

  let res = await fetch(`${API_URL}${path}`, { ...fetchOptions, headers });

  if (res.status === 401 && activeToken) {
    if (!isRefreshing) {
      isRefreshing = true;
      refreshPromise = refreshAccessToken();
    }
    const newToken = await refreshPromise;
    isRefreshing = false;
    refreshPromise = null;

    if (newToken) {
      headers['Authorization'] = `Bearer ${newToken}`;
      res = await fetch(`${API_URL}${path}`, { ...fetchOptions, headers });
    }
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  get: <T>(path: string, token?: string) => request<T>(path, { token }),
  post: <T>(path: string, body?: any, token?: string) => request<T>(path, { method: 'POST', body: JSON.stringify(body), token }),
  patch: <T>(path: string, body?: any, token?: string) => request<T>(path, { method: 'PATCH', body: JSON.stringify(body), token }),
  delete: <T>(path: string, token?: string) => request<T>(path, { method: 'DELETE', token }),
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ApiOptions {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
  token?: string;
}

export async function apiRequest<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const {
    method = 'GET',
    body,
    headers = {},
    token,
  } = options;

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers: requestHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
}

export const api = {
  get: <T>(endpoint: string, token?: string) => 
    apiRequest<T>(endpoint, { method: 'GET', token }),
  
  post: <T>(endpoint: string, body: any, token?: string) =>
    apiRequest<T>(endpoint, { method: 'POST', body, token }),
  
  put: <T>(endpoint: string, body: any, token?: string) =>
    apiRequest<T>(endpoint, { method: 'PUT', body, token }),
  
  delete: <T>(endpoint: string, token?: string) =>
    apiRequest<T>(endpoint, { method: 'DELETE', token }),
}; 
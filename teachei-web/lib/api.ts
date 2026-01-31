import { env } from "@/config/env";
import Cookies from "js-cookie";

const TOKEN_COOKIE = "teachei_token";

// Get auth token from cookies
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return Cookies.get(TOKEN_COOKIE) || null;
}

// Set auth token in cookies
export function setToken(token: string): void {
  Cookies.set(TOKEN_COOKIE, token, {
    expires: 1 / 24, // 1 hour
    secure: env.IS_PRODUCTION,
    sameSite: "lax",
  });
}

// Remove auth token from cookies
export function removeToken(): void {
  Cookies.remove(TOKEN_COOKIE);
}

// Custom fetch wrapper with auth
interface FetchOptions extends RequestInit {
  requireAuth?: boolean;
}

export async function apiFetch<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { requireAuth = true, ...fetchOptions } = options;
  
  const url = `${env.API_URL}${endpoint}`;
  
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Add auth header if token exists and auth is required
  if (requireAuth) {
    const token = getToken();
    if (token) {
      (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
    }
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  });

  // Handle 401 - redirect to login
  if (response.status === 401) {
    removeToken();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new Error("Unauthorized");
  }

  // Handle 429 - rate limited
  if (response.status === 429) {
    const retryAfter = response.headers.get("Retry-After");
    const message = retryAfter 
      ? `Muitas tentativas. Tente novamente em ${retryAfter} segundos.`
      : "Muitas tentativas. Tente novamente mais tarde.";
    throw new Error(message);
  }

  // Handle non-2xx responses
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    
    // Parse field-specific validation errors
    if (errorData.fieldErrors && Array.isArray(errorData.fieldErrors) && errorData.fieldErrors.length > 0) {
      const fieldMessages = errorData.fieldErrors
        .map((fe: { field: string; message: string }) => `${fe.field}: ${fe.message}`)
        .join("; ");
      throw new Error(fieldMessages);
    }
    
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  // Handle empty responses
  const text = await response.text();
  if (!text) return {} as T;
  
  return JSON.parse(text) as T;
}

// Convenience methods
export const api = {
  get: <T>(endpoint: string, options?: FetchOptions) =>
    apiFetch<T>(endpoint, { ...options, method: "GET" }),

  post: <T>(endpoint: string, body?: unknown, options?: FetchOptions) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T>(endpoint: string, body?: unknown, options?: FetchOptions) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: <T>(endpoint: string, body?: unknown, options?: FetchOptions) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(endpoint: string, options?: FetchOptions) =>
    apiFetch<T>(endpoint, { ...options, method: "DELETE" }),
};

export default api;




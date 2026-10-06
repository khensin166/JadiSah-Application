export class ApiError extends Error {
  public status: number;
  public data: Record<string, unknown>;

  constructor(status: number, message: string, data?: Record<string, unknown>) {
    super(message);
    this.status = status;
    this.data = data || {};
    this.name = "ApiError";
  }
}

/**
 * Core API Client function.
 * Wraps the native fetch API to automatically handle JSON parsing,
 * error throwing, and base URL resolution.
 */
export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // Proxy URL goes to /api/... which is rewritten in next.config.ts
  const url = endpoint.startsWith("http") ? endpoint : `/api${endpoint}`;

  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  let data;
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    data = await response.json().catch(() => null);
  }

  if (!response.ok) {
    const errorMessage = data?.message || response.statusText || "Terjadi kesalahan pada server.";
    throw new ApiError(response.status, errorMessage, data);
  }

  return data as T;
}

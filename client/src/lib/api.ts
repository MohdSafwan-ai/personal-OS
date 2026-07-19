/**
 * Minimal fetch wrapper for the API.
 * - Access token lives in memory only (never localStorage).
 * - On a 401, one silent refresh via the httpOnly cookie is attempted,
 *   then the original request is retried once.
 */

export interface PublicUser {
  id: string;
  email: string;
  name: string;
  settings: {
    theme: "light" | "dark" | "system";
    pomodoro: {
      focusMin: number;
      shortBreakMin: number;
      longBreakMin: number;
      longBreakEvery: number;
    };
  };
  createdAt: string;
}

export class ApiRequestError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = "ApiRequestError";
  }
}

let accessToken: string | null = null;
let onSessionExpired: (() => void) | null = null;

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

/** Called when refresh fails — the auth store uses this to force logout. */
export function setSessionExpiredHandler(handler: () => void): void {
  onSessionExpired = handler;
}

let refreshPromise: Promise<boolean> | null = null;

/** Single-flight refresh so parallel 401s don't race the rotating token. */
async function tryRefresh(): Promise<boolean> {
  refreshPromise ??= (async () => {
    try {
      const res = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) return false;
      const data = (await res.json()) as { accessToken: string };
      accessToken = data.accessToken;
      return true;
    } catch {
      return false;
    } finally {
      refreshPromise = null;
    }
  })();
  return refreshPromise;
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  /** Skip the 401→refresh→retry dance (used by auth endpoints themselves). */
  skipRefresh?: boolean;
}

export async function api<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, skipRefresh } = options;

  const doFetch = () =>
    fetch(path, {
      method,
      credentials: "include",
      headers: {
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

  let res = await doFetch();

  if (res.status === 401 && !skipRefresh) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      res = await doFetch();
    } else {
      onSessionExpired?.();
    }
  }

  if (res.status === 204) return undefined as T;

  const data = (await res.json().catch(() => null)) as
    | ({ error?: string; details?: unknown } & T)
    | null;

  if (!res.ok) {
    throw new ApiRequestError(res.status, data?.error ?? res.statusText, data?.details);
  }
  return data as T;
}

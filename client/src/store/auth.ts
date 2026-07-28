import { create } from "zustand";
import {
  api,
  setAccessToken,
  setSessionExpiredHandler,
  type PublicUser,
} from "@/lib/api";

interface AuthState {
  user: PublicUser | null;
  /** True while the app is checking for an existing session on boot. */
  initializing: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  /** Attempt silent session restore via the refresh cookie. */
  bootstrap: () => Promise<void>;
}

interface AuthResponse {
  user: PublicUser;
  accessToken: string;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  initializing: true,

  login: async (email, password) => {
    const data = await api<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: { email, password },
      skipRefresh: true,
    });
    setAccessToken(data.accessToken);
    set({ user: data.user });
  },

  register: async (name, email, password) => {
    const data = await api<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: { name, email, password },
      skipRefresh: true,
    });
    setAccessToken(data.accessToken);
    set({ user: data.user });
  },

  logout: async () => {
    try {
      await api("/api/auth/logout", { method: "POST", skipRefresh: true });
    } finally {
      setAccessToken(null);
      set({ user: null });
    }
  },

  bootstrap: async () => {
    try {
      const { accessToken, user } = await api<{ accessToken: string; user: PublicUser }>(
        "/api/auth/refresh",
        { method: "POST", skipRefresh: true }
      );
      setAccessToken(accessToken);
      set({ user, initializing: false });
    } catch {
      set({ user: null, initializing: false });
    }
  },
}));

setSessionExpiredHandler(() => {
  setAccessToken(null);
  useAuthStore.setState({ user: null });
});

import { jwtDecode } from "jwt-decode";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { loginApi } from "../api/authApi";
import { AuthUser, JwtClaims, LoginCredentials } from "../types/auth";

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

/**
 * Safely decodes a JWT token into an AuthUser object and verifies its expiration.
 */
function decodeTokenToUser(token: string): AuthUser | null {
  try {
    const decoded = jwtDecode<JwtClaims>(token);
    // Expiration check (exp is in seconds)
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      return null;
    }
    return {
      id: decoded.id,
      name: decoded.name,
      role: decoded.role,
      iss: decoded.iss,
      exp: decoded.exp,
    };
  } catch (error) {
    console.error("Failed to decode JWT token:", error);
    return null;
  }
}

/**
 * Custom storage engine:
 * - Keeps localStorage minimal by persisting only `{ token }`.
 * - On load (getItem), automatically decodes `token` into `user` and `isAuthenticated`.
 */
const customStorage = createJSONStorage(() => ({
  getItem: (name: string): string | null => {
    const str = localStorage.getItem(name);
    if (!str) return null;
    try {
      const parsed = JSON.parse(str);
      const token = parsed?.state?.token;
      if (token) {
        const user = decodeTokenToUser(token);
        if (!user) {
          localStorage.removeItem(name);
          return null;
        }
        return JSON.stringify({
          state: {
            token,
            user,
            isAuthenticated: true,
          },
          version: parsed.version,
        });
      }
    } catch (error) {
      console.error("Failed to parse auth_storage from localStorage:", error);
    }
    return str;
  },
  setItem: (name: string, value: string): void => {
    localStorage.setItem(name, value);
  },
  removeItem: (name: string): void => {
    localStorage.removeItem(name);
  },
}));

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (credentials: LoginCredentials) => {
        const data = await loginApi(credentials);
        const user = data.token ? decodeTokenToUser(data.token) : null;

        set({
          token: data.token,
          user: user,
          isAuthenticated: Boolean(data.token && user),
        });
      },

      logout: () => {
        set({
          token: null,
          user: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: "auth_storage",
      storage: customStorage,
      // Persist ONLY token in localStorage for security
      partialize: (state) => ({ token: state.token }),
    },
  ),
);

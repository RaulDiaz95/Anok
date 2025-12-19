import {
  LoginRequest,
  User,
  AuthResponse,
  RegisterRequest,
} from "../types/auth";
import { buildApiUrl } from "../config/env";

const API_URL = buildApiUrl("/auth");

class AuthService {
  async register(data: RegisterRequest): Promise<User> {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Registration failed");
    }

    const result: AuthResponse = await response.json();
    return result.user;
  }

  async login(credentials: LoginRequest): Promise<User> {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Important: Send cookies with request
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Login failed");
    }

    const data: AuthResponse = await response.json();
    if (data.token) {
      localStorage.setItem("anok_access_token", data.token);
    }
    return data.user;
  }

  async googleLogin(idToken: string): Promise<User> {
    const response = await fetch(`${API_URL}/google`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ idToken }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Google login failed");
    }

    const data: AuthResponse = await response.json();
    if (data.token) {
      localStorage.setItem("anok_access_token", data.token);
    }
    return data.user;
  }

  async getCurrentUser(): Promise<User> {
    const response = await fetch(`${API_URL}/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Important: Send cookies with request
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }

    return response.json();
  }

  async logout(): Promise<void> {
    const response = await fetch(`${API_URL}/logout`, {
      method: "POST",
      credentials: "include", // Important: Send cookies with request
    });

    if (!response.ok) {
      throw new Error("Logout failed");
    }

    localStorage.removeItem("anok_access_token");
  }
}

export const authService = new AuthService();

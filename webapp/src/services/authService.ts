import { LoginRequest, User, AuthResponse } from "../types/auth";

const API_URL = "http://localhost:8080/api/auth";

class AuthService {
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
  }
}

export const authService = new AuthService();

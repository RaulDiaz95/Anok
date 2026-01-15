export interface User {
  id: string;
  email: string;
  fullName: string;
  isActive: boolean;
  validatedUser: boolean;
  trustedValidator: boolean;
  roles: string[];
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token?: string;
}

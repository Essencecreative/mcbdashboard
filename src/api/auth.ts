// Authentication API functions
import { apiRequest } from "./client";

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: string;
    username: string;
    role: string;
    photo?: string;
  };
}

export interface User {
  id: string;
  username: string;
  role: string;
  photo?: string;
}

// Login user
export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  return apiRequest<LoginResponse>("/users/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
};

// Verify token (optional - can be used to check if token is still valid)
export const verifyToken = async (): Promise<{ valid: boolean; user?: User }> => {
  try {
    const response = await apiRequest<{ user: User }>("/users/verify", {
      method: "GET",
    });
    return { valid: true, user: response.user };
  } catch (error) {
    return { valid: false };
  }
};

// Logout (client-side only, but can be extended for server-side logout)
export const logout = (): void => {
  localStorage.removeItem("token");
};


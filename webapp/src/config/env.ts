const DEFAULT_API_URL = "http://localhost:8080/api";

// Append /api suffix to VITE_API_URL if it's set from environment
const envApiUrl = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : DEFAULT_API_URL;

export const API_BASE_URL = envApiUrl;

export const buildApiUrl = (path = "") => `${API_BASE_URL}${path}`;

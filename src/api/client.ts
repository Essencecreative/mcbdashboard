// API Client with automatic token handling and error interception
const API_BASE = process.env.REACT_APP_API_URL || "https://service.mwalimubank.co.tz";

// Get token from localStorage
const getToken = (): string | null => {
  return localStorage.getItem("token");
};

// Set token expiration callback
let onTokenExpired: (() => void) | null = null;

export const setTokenExpiredCallback = (callback: () => void) => {
  onTokenExpired = callback;
};

// Enhanced fetch wrapper with automatic token handling
export const apiClient = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = getToken();

  // Merge headers - use Record type for type safety
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  // Add authorization header if token exists
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Make the request
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle token expiration (401 or 403)
  if (response.status === 401 || response.status === 403) {
    const errorData = await response.json().catch(() => ({}));
    
    // Check if it's a token expiration error
    if (
      errorData.message?.toLowerCase().includes("expired") ||
      errorData.message?.toLowerCase().includes("invalid") ||
      errorData.message?.toLowerCase().includes("token")
    ) {
      // Clear token
      localStorage.removeItem("token");
      
      // Trigger logout callback if set
      if (onTokenExpired) {
        onTokenExpired();
      }
    }
  }

  return response;
};

// Helper for JSON requests
export const apiRequest = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const response = await apiClient(endpoint, options);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: "An error occurred",
    }));
    throw new Error(errorData.message || `Request failed with status ${response.status}`);
  }

  return response.json();
};

// Helper for FormData requests (for file uploads)
export const apiFormDataRequest = async <T = any>(
  endpoint: string,
  formData: FormData,
  method: string = "POST"
): Promise<T> => {
  const token = getToken();
  const headers: Record<string, string> = {};

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers,
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: "An error occurred",
    }));
    
    // Handle token expiration
    if (response.status === 401 || response.status === 403) {
      if (
        errorData.message?.toLowerCase().includes("expired") ||
        errorData.message?.toLowerCase().includes("invalid") ||
        errorData.message?.toLowerCase().includes("token")
      ) {
        localStorage.removeItem("token");
        if (onTokenExpired) {
          onTokenExpired();
        }
      }
    }
    
    throw new Error(errorData.message || `Request failed with status ${response.status}`);
  }

  return response.json();
};

export default apiClient;


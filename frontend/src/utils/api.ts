// API configuration and utility functions

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000';

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
}

/**
 * Make a request to the API
 */
async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Add auth token if available
  const token = localStorage.getItem('access_token');
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        error: data.error || data.message || 'An error occurred',
        status: response.status,
      };
    }

    return {
      data,
      status: response.status,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Network error',
      status: 0,
    };
  }
}

// Auth API calls
export const authApi = {
  /**
   * Login with email and password
   */
  login: async (email: string, password: string) => {
    return apiRequest<{ access_token: string; user_id: number }>(
      '/api/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }
    );
  },

  /**
   * Sign up a new user
   */
  signup: async (email: string, password: string, name?: string) => {
    return apiRequest<{ message: string }>(
      '/api/auth/signup',
      {
        method: 'POST',
        body: JSON.stringify({ email, password, name }),
      }
    );
  },

  /**
   * Request password reset
   */
  requestPasswordReset: async (email: string) => {
    return apiRequest<{ reset_token?: string; message?: string }>(
      '/api/auth/request-password-reset',
      {
        method: 'POST',
        body: JSON.stringify({ email }),
      }
    );
  },

  /**
   * Reset password with token
   */
  resetPassword: async (token: string, newPassword: string) => {
    return apiRequest<{ message: string }>(
      '/api/auth/reset-password',
      {
        method: 'POST',
        body: JSON.stringify({ token, new_password: newPassword }),
      }
    );
  },
};

// Profile API calls
export const profileApi = {
  /**
   * Get user profile
   */
  getProfile: async () => {
    return apiRequest('/api/profile/');
  },

  /**
   * Update user profile
   */
  updateProfile: async (profileData: {
    full_name?: string;
    program?: string;
    year?: string;
    bio?: string;
    skills?: string;
  }) => {
    return apiRequest(
      '/api/profile/',
      {
        method: 'PUT',
        body: JSON.stringify(profileData),
      }
    );
  },
};

// Auth utilities
export const authUtils = {
  /**
   * Store access token
   */
  setToken: (token: string) => {
    localStorage.setItem('access_token', token);
  },

  /**
   * Get access token
   */
  getToken: () => {
    return localStorage.getItem('access_token');
  },

  /**
   * Remove access token
   */
  removeToken: () => {
    localStorage.removeItem('access_token');
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('access_token');
  },
};

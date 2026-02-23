// API configuration and utility functions

export const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000';

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
      // Handle 401 - clear stale token and redirect to login
      if (response.status === 401) {
        localStorage.removeItem('access_token');
        // Only redirect if we're not already on login page
        if (!window.location.hash.includes('/login')) {
          window.location.hash = '#/login';
        }
      }
      return {
        error: data.error || data.msg || data.message || 'An error occurred',
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

// Project API calls
export const projectApi = {
  /**
   * Get user's own projects
   */
  getMyProjects: async () => {
    return apiRequest('/api/projects/me');
  },

  /**
   * Get projects for a specific user (public)
   */
  getUserProjects: async (userId: number) => {
    return apiRequest(`/api/projects/user/${userId}`);
  },

  /**
   * Update a project
   */
  updateProject: async (projectId: number, projectData: {
    title?: string;
    description?: string;
    category?: string;
    skills?: string;
  }) => {
    return apiRequest(
      `/api/projects/${projectId}`,
      {
        method: 'PUT',
        body: JSON.stringify(projectData),
      }
    );
  },

  /**
   * Delete a project
   */
  deleteProject: async (projectId: number) => {
    return apiRequest(
      `/api/projects/${projectId}`,
      {
        method: 'DELETE',
      }
    );
  },

  /**
   * Search projects with filters
   */
  searchProjects: async (params?: {
    q?: string;
    skills?: string;
    category?: string;
    sort?: 'newest' | 'az' | 'most_applications';
    page?: number;
    limit?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.q) searchParams.append('q', params.q);
    if (params?.skills) searchParams.append('skills', params.skills);
    if (params?.category) searchParams.append('category', params.category);
    if (params?.sort) searchParams.append('sort', params.sort);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());

    const query = searchParams.toString();
    return apiRequest(`/api/projects/search${query ? '?' + query : ''}`);
  },

  /**
   * Create a new project
   */
  createProject: async (projectData: {
    title: string;
    description: string;
    category: string;
    skills?: string;
  }) => {
    return apiRequest(
      '/api/projects/',
      {
        method: 'POST',
        body: JSON.stringify(projectData),
      }
    );
  },

  /**
   * Apply to a project
   */
  applyToProject: async (projectId: number, role: string) => {
    return apiRequest(
      `/api/projects/${projectId}/apply`,
      {
        method: 'POST',
        body: JSON.stringify({ role }),
      }
    );
  },

  /**
   * Get user's applications
   */
  getMyApplications: async () => {
    return apiRequest('/api/projects/applications/me');
  },

  /**
   * Get applications for a project (owner-only)
   */
  getProjectApplications: async (projectId: number) => {
    return apiRequest(`/api/projects/${projectId}/applications`);
  },

  /**
   * Update application status
   */
  updateApplicationStatus: async (applicationId: number, status: 'accepted' | 'rejected') => {
    return apiRequest(
      `/api/projects/applications/${applicationId}/status`,
      {
        method: 'PUT',
        body: JSON.stringify({ status }),
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
   * Get another user's public profile (no auth required)
   */
  getPublicProfile: async (userId: number) => {
    return apiRequest(`/api/profile/${userId}`);
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

  /**
   * Upload resume PDF
   */
  uploadResume: async (file: File) => {
    const formData = new FormData();
    formData.append('resume', file);

    const token = localStorage.getItem('access_token');
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/profile/resume`, {
        method: 'POST',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        return {
          error: data.error || 'Failed to upload resume',
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
  },

  /**
   * Get resume download URL
   */
  getResumeUrl: () => {
    const token = localStorage.getItem('access_token');
    return `${API_BASE_URL}/api/profile/resume?token=${token}`;
  },

  /**
   * Delete resume
   */
  deleteResume: async () => {
    return apiRequest('/api/profile/resume', {
      method: 'DELETE',
    });
  },

  /**
   * Upload avatar image
   */
  uploadAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);

    const token = localStorage.getItem('access_token');

    try {
      const response = await fetch(`${API_BASE_URL}/api/profile/avatar`, {
        method: 'POST',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        return {
          error: data.error || 'Failed to upload avatar',
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
  },

  /**
   * Get avatar URL for a user (public, no auth needed)
   */
  getAvatarUrl: (userId: number) => {
    return `${API_BASE_URL}/api/profile/avatar/${userId}`;
  },

  /**
   * Delete avatar
   */
  deleteAvatar: async () => {
    return apiRequest('/api/profile/avatar', {
      method: 'DELETE',
    });
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

// HTF (Hack the Future) API calls
export const htfApi = {
  /**
   * Get all HTF submissions (public)
   */
  getSubmissions: async () => {
    return apiRequest<{
      submissions: Array<{
        id: number;
        project_name: string;
        youtube_url: string;
        description: string | null;
        created_at: string;
        submitter: {
          id: number;
          name: string;
        };
      }>;
    }>('/api/htf/');
  },

  /**
   * Create a new HTF submission (requires auth)
   */
  createSubmission: async (data: {
    project_name: string;
    youtube_url: string;
    description?: string;
  }) => {
    return apiRequest('/api/htf/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete an HTF submission (owner only)
   */
  deleteSubmission: async (submissionId: number) => {
    return apiRequest(`/api/htf/${submissionId}`, {
      method: 'DELETE',
    });
  },
};

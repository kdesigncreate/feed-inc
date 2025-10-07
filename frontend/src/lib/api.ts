import axios from 'axios';
import type {
  LoginCredentials,
  LoginResponse,
  Article,
  ArticleFormData,
  Category,
} from '@/types';
import { API_CONFIG } from './constants';
import { secureStorage } from './secureStorage';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  withCredentials: true, // Enable cookies for SPA authentication
});

// Request interceptor to get CSRF cookie before authenticated requests
api.interceptors.request.use(
  async (config) => {
    if (typeof window !== 'undefined') {
      // For authenticated API requests, ensure CSRF cookie is available
      if (['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase() || '') || 
          config.url?.includes('/user') || config.url?.includes('/admin/')) {
        // Always get fresh CSRF token for authenticated requests to ensure session consistency
        try {
          await axios.get(`${API_CONFIG.BASE_URL}/sanctum/csrf-cookie`, { 
            withCredentials: true,
            timeout: 5000 
          });
          // Small delay to ensure cookie is set
          await new Promise(resolve => setTimeout(resolve, 50));
        } catch (error) {
          console.warn('Failed to get CSRF cookie:', error);
          // Don't throw error here, let the original request continue
        }
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle authentication errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Check if we're not already on the login page to avoid infinite redirect
      if (!window.location.pathname.includes('/admin/login')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// 型定義は@/typesからインポート


export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    // CSRF cookie will be handled by the request interceptor
    const response = await api.post('/login', credentials);
    return {
      user: response.data.user,
      access_token: response.data.access_token || '', // Not needed for SPA Cookie authentication
      token_type: response.data.token_type || 'cookie'
    };
  },
  
  logout: async (): Promise<void> => {
    await api.post('/logout');
  },
  
  getCurrentUser: async () => {
    try {
      const response = await api.get('/user');
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        // Clear any potentially stale session data
        throw new Error('Unauthenticated');
      }
      throw error;
    }
  },
};

export const articleApi = {
  getArticles: async (params?: {
    category?: string;
    search?: string;
    published_only?: boolean;
    page?: number;
  }) => {
    const response = await api.get('/articles', { params });
    return response.data;
  },

  getArticle: async (slug: string): Promise<Article> => {
    const response = await api.get(`/articles/${slug}`);
    return response.data;
  },

  getCategories: async (): Promise<Category[]> => {
    const response = await api.get('/categories');
    return response.data;
  },

  createArticle: async (data: ArticleFormData): Promise<Article> => {
    const response = await api.post('/articles', data);
    return response.data;
  },

  updateArticle: async (id: number, data: ArticleFormData): Promise<Article> => {
    const response = await api.put(`/articles/${id}`, data);
    return response.data;
  },

  deleteArticle: async (id: number): Promise<void> => {
    await api.delete(`/articles/${id}`);
  },

  getAdminArticles: async (params?: {
    category?: string;
    search?: string;
    published?: boolean;
    page?: number;
  }) => {
    const response = await api.get('/admin/articles', { params });
    return response.data;
  },
};

export default api;
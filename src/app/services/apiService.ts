import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { storageService } from './storageService';
import { progressService } from './progressService';
import type { QueryClient } from '@tanstack/react-query';

/**
 * API Service
 * HTTP client with automatic token injection, refresh logic, 401 handling, and cache invalidation
 */

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status?: number;
}

class ApiService {
  private api: AxiosInstance;
  private apiUrl: string;
  private isRefreshing = false;
  private refreshSubscribers: ((token: string) => void)[] = [];
  private queryClient: QueryClient | null = null;

  constructor() {
    this.apiUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
    this.api = axios.create({
      baseURL: this.apiUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  /**
   * Set the QueryClient instance for cache invalidation
   * This should be called once during app initialization
   */
  setQueryClient(queryClient: QueryClient) {
    this.queryClient = queryClient;
  }

  private setupInterceptors() {
    this.api.interceptors.request.use(
      (config) => {
        // Start tracking this request for progress bar
        progressService.startRequest();

        const token = storageService.get<string>('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Auto-detect FormData and remove Content-Type to let browser set it with boundary
        if (config.data instanceof FormData) {
          delete config.headers['Content-Type'];
        }

        return config;
      },
      (error) => {
        // End tracking on request error
        progressService.endRequest();
        return Promise.reject(error);
      },
    );

    this.api.interceptors.response.use(
      (response) => {
        // End tracking this request for progress bar
        progressService.endRequest();

        // Invalidate all cache on successful mutations (POST, PUT, PATCH, DELETE)
        const method = response.config.method?.toUpperCase();
        const isMutation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method || '');

        if (isMutation && this.queryClient) {
          // Invalidate all queries to ensure fresh data after mutations
          this.queryClient.invalidateQueries();
        }

        return response;
      },
      async (error) => {
        // End tracking on response error
        progressService.endRequest();
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 401 && !originalRequest._retry) {
          const refreshToken = storageService.get<string>('refresh_token');

          // If no refresh token or already retried, logout
          if (!refreshToken || originalRequest._retry) {
            this.handleAuthFailure();
            return Promise.reject(error);
          }

          // If already refreshing, queue this request
          if (this.isRefreshing) {
            return new Promise((resolve) => {
              this.refreshSubscribers.push((token: string) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                resolve(this.api(originalRequest));
              });
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            // Attempt token refresh
            const response = await axios.post(`${this.apiUrl}/core/v1/refresh`, {
              refresh_token: refreshToken,
            });

            const { token: newToken, refresh_token: newRefreshToken } = response.data.data;

            // Store new tokens
            storageService.set('token', newToken);
            if (newRefreshToken) {
              storageService.set('refresh_token', newRefreshToken);
            }

            // Retry all queued requests with new token
            this.refreshSubscribers.forEach((callback) => callback(newToken));
            this.refreshSubscribers = [];

            // Retry original request
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return this.api(originalRequest);
          } catch (refreshError) {
            // Refresh failed, logout
            this.handleAuthFailure();
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      },
    );
  }

  private handleAuthFailure(): void {
    storageService.remove('token');
    storageService.remove('refresh_token');

    const currentPath = window.location.pathname;
    const isAuthPage = currentPath.includes('/auth/');

    if (!isAuthPage) {
      window.location.href = '/auth/login';
    }
  }

  private buildUrl(url: string): string {
    const fullUrl = url.startsWith('http://') || url.startsWith('https://') ? url : `${this.apiUrl}${url}`;
    const [path, query] = fullUrl.split('?');
    const cleanPath = path.replace(/\/$/, '');
    return query ? `${cleanPath}?${query}` : cleanPath;
  }

  /** GET request with automatic query param filtering */
  async get<T = any>(url: string, params: Record<string, any> = {}): Promise<AxiosResponse<T>> {
    const queryParams = Object.fromEntries(
      Object.entries(params).filter(
        ([_, value]) => value !== undefined && value !== null && value !== '',
      ),
    );

    return this.api.get<T>(this.buildUrl(url), { params: queryParams });
  }

  /** GET request for blob/file downloads */
  async getBlob(url: string, params: Record<string, any> = {}): Promise<AxiosResponse<Blob>> {
    const queryParams = Object.fromEntries(
      Object.entries(params).filter(
        ([_, value]) => value !== undefined && value !== null && value !== '',
      ),
    );

    return this.api.get<Blob>(this.buildUrl(url), { 
      params: queryParams,
      responseType: 'blob'
    });
  }

  /** POST request with JSON body */
  async post<T = any>(url: string, payloads: any = {}): Promise<AxiosResponse<T>> {
    return this.api.post<T>(this.buildUrl(url), payloads);
  }

  /** POST with URL-encoded form data */
  async postForm<T = any>(
    url: string,
    payloads: Record<string, any> = {},
  ): Promise<AxiosResponse<T>> {
    const formData = new URLSearchParams();

    Object.entries(payloads).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    return this.api.post<T>(this.buildUrl(url), formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  }

  /** PUT request with JSON body */
  async put<T = any>(url: string, payloads: any = {}): Promise<AxiosResponse<T>> {
    return this.api.put<T>(this.buildUrl(url), payloads);
  }

  /** PATCH request with JSON body */
  async patch<T = any>(url: string, payloads: any = {}): Promise<AxiosResponse<T>> {
    return this.api.patch<T>(this.buildUrl(url), payloads);
  }

  /** DELETE request */
  async delete<T = any>(url: string): Promise<AxiosResponse<T>> {
    return this.api.delete<T>(this.buildUrl(url));
  }
}

export const apiService = new ApiService();
export default apiService;

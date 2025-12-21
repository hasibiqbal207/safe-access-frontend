import axios from "axios";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const options = {
  baseURL: backendUrl,
  withCredentials: true,
  timeout: 10000,
};

const API = axios.create(options);

export const APIRefresh = axios.create(options);
APIRefresh.interceptors.response.use((response) => response);

// Flag to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

const clearAuthAndRedirect = () => {
  // Clear tokens from localStorage
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
  // Redirect to login page
  window.location.href = "/";
};

// REQUEST INTERCEPTOR - Attach access token to all requests
API.interceptors.request.use(
  (config) => {
    // Skip adding token for public auth endpoints
    const publicEndpoints = [
      '/auth/login',
      '/auth/register',
      '/auth/verify-email',
      '/auth/resend-verification',
      '/auth/password/forgot',
      '/auth/password/reset',
      '/auth/mfa/verify-login'
    ];

    const isPublicEndpoint = publicEndpoints.some(endpoint =>
      config.url?.includes(endpoint)
    );

    if (isPublicEndpoint) {
      return config;
    }

    // Get access token from localStorage
    const accessToken = typeof window !== 'undefined'
      ? localStorage.getItem('accessToken')
      : null;

    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR - Handle token refresh
API.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Check if error response exists
    if (!error.response) {
      return Promise.reject(error);
    }

    const { data, status } = error.response;

    // Handle token-related errors (401 Unauthorized)
    const isTokenError = status === 401 && (
      data.errorCode === "AUTH_TOKEN_NOT_FOUND" ||
      data.errorCode === "TOKEN_EXPIRED" ||
      data.errorCode === "INVALID_TOKEN" ||
      data.error?.code === "AUTH_REQUIRED" ||
      data.error?.code === "TOKEN_EXPIRED" ||
      data.error?.code === "INVALID_TOKEN" ||
      data.message?.toLowerCase().includes('token') ||
      data.message?.toLowerCase().includes('unauthorized')
    );

    // Don't retry if this is already a retry or if it's not a token error
    if (originalRequest._retry || !isTokenError) {
      // If it's an auth error but we've already tried to refresh, logout
      if (isTokenError && originalRequest._retry) {
        clearAuthAndRedirect();
      }
      return Promise.reject(data);
    }

    // Don't try to refresh on auth endpoints
    if (originalRequest.url?.includes('/auth/login') ||
      originalRequest.url?.includes('/auth/register') ||
      originalRequest.url?.includes('/auth/refresh')) {
      return Promise.reject(data);
    }

    // Mark this request as a retry
    originalRequest._retry = true;

    if (isRefreshing) {
      // If already refreshing, queue this request
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => {
          return API(originalRequest);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    }

    isRefreshing = true;

    try {
      console.log('Access token expired, attempting to refresh...');

      // Get refresh token from localStorage
      const refreshToken = typeof window !== 'undefined'
        ? localStorage.getItem('refreshToken')
        : null;

      if (!refreshToken) {
        console.error('No refresh token found');
        throw new Error('No refresh token available');
      }

      // POST /auth/refresh with refreshToken in body
      // No Authorization header needed since backend middleware was removed
      const response = await APIRefresh.post("/auth/refresh", { refreshToken });

      console.log('Token refresh successful');

      // Extract new tokens from response
      const newTokens = response.data.data || response.data;
      const newAccessToken = newTokens.accessToken;
      const newRefreshToken = newTokens.refreshToken;

      // Store new tokens in localStorage
      if (typeof window !== 'undefined' && newAccessToken) {
        localStorage.setItem('accessToken', newAccessToken);
        if (newRefreshToken) {
          localStorage.setItem('refreshToken', newRefreshToken);
        }
        console.log('New tokens stored in localStorage');
      }

      // Update the authorization header for the failed request
      if (newAccessToken) {
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
      }

      // Process queued requests
      processQueue(null, newAccessToken);

      isRefreshing = false;

      // Retry the original request with new token
      return API(originalRequest);
    } catch (refreshError) {
      console.error('Token refresh failed:', refreshError);

      // Process queued requests with error
      processQueue(refreshError, null);

      isRefreshing = false;

      // Clear auth data and redirect to login
      clearAuthAndRedirect();

      return Promise.reject(refreshError);
    }
  }
);

export default API;

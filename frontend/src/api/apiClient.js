// API client for backend communication with JWT Refresh Token Rotation support

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

let accessToken = '';
let isRefreshing = false;
let refreshQueue = [];

/**
 * Get the in-memory access token.
 */
export const getAccessToken = () => accessToken;

/**
 * Set the in-memory access token.
 */
export const setAccessToken = (token) => {
  accessToken = token;
};

/**
 * Queue a request to be retried after a successful token refresh.
 */
const queueRequest = (callback) => {
  refreshQueue.push(callback);
};

/**
 * Process the queue of pending requests with the new access token.
 */
const processQueue = (err, token = null) => {
  refreshQueue.forEach((callback) => {
    callback(err, token);
  });
  refreshQueue = [];
};

/**
 * Global custom fetch wrapper that handles auth headers, CORS cookies, and automatic refresh on 401.
 */
export const request = async (endpoint, options = {}) => {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  // Set default options
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const fetchOptions = {
    ...options,
    headers,
    credentials: 'include', // Crucial to allow HTTP-Only cookies to be sent/received
  };

  try {
    const response = await fetch(url, fetchOptions);

    // If unauthorized, attempt to refresh token
    if (response.status === 401) {
      // Prevent refreshing for refresh endpoint itself to avoid loops
      if (endpoint.includes('/api/auth/refresh')) {
        throw new Error('Refresh token expired');
      }

      if (isRefreshing) {
        // If already refreshing, wait for it to complete
        return new Promise((resolve, reject) => {
          queueRequest((err, token) => {
            if (err) {
              reject(err);
            } else {
              // Retry the request with new token
              headers['Authorization'] = `Bearer ${token}`;
              resolve(fetch(url, { ...fetchOptions, headers }));
            }
          });
        }).then((res) => res.json());
      }

      isRefreshing = true;

      try {
        const refreshResponse = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        if (!refreshResponse.ok) {
          throw new Error('Failed to refresh token');
        }

        const refreshData = await refreshResponse.json();
        const newAccessToken = refreshData.data?.accessToken;

        if (!newAccessToken) {
          throw new Error('No access token returned from refresh');
        }

        setAccessToken(newAccessToken);
        processQueue(null, newAccessToken);
        isRefreshing = false;

        // Retry the original request with the new access token
        headers['Authorization'] = `Bearer ${newAccessToken}`;
        const retriedResponse = await fetch(url, { ...fetchOptions, headers });
        return await retriedResponse.json();
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        isRefreshing = false;
        setAccessToken('');
        
        // Trigger a custom event to notify components/Context about logout
        window.dispatchEvent(new CustomEvent('auth-expired'));
        
        throw refreshErr;
      }
    }

    // Return the response as JSON (if it has content)
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
      return data;
    }

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    return response;
  } catch (error) {
    if (error.message !== 'Failed to refresh token' && error.message !== 'Refresh token expired' && !error.message.includes('401')) {
      console.error('API request failed:', error);
    }
    throw error;
  }
};

/**
 * Auth actions helper
 */
export const authApi = {
  login: async (email, password) => {
    const response = await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (response.success && response.data?.accessToken) {
      setAccessToken(response.data.accessToken);
    }
    return response;
  },

  register: async (username, email, password) => {
    return await request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });
  },

  logout: async () => {
    try {
      await request('/api/auth/logout', { method: 'POST' });
    } finally {
      setAccessToken('');
      // Clean up local storage if any auth info is cached
    }
  },

  getProfile: async () => {
    return await request('/api/users/me');
  },
};

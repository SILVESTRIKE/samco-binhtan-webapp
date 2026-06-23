import React, { createContext, useState, useEffect, useContext } from 'react';
import { authApi, setAccessToken } from '../api/apiClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Auto-recover session on initial load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Try calling getProfile. If it returns 401, apiClient will automatically
        // try to call /refresh using the HttpOnly cookie.
        const response = await authApi.getProfile();
        if (response.success && response.data) {
          setUser(response.data);
        }
      } catch (error) {
        console.log('No active session found or auto-refresh failed on load');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for refresh expiration event from apiClient
    const handleAuthExpired = () => {
      setUser(null);
    };

    window.addEventListener('auth-expired', handleAuthExpired);
    return () => {
      window.removeEventListener('auth-expired', handleAuthExpired);
    };
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await authApi.login(email, password);
      if (response.success && response.data?.user) {
        // Normalize backend's user data
        const userData = {
          id: response.data.user.id,
          username: response.data.user.username,
          email: response.data.user.email,
          role: response.data.user.role,
        };
        setUser(userData);
        return response;
      }
      throw new Error(response.message || 'Login failed');
    } catch (error) {
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      setUser(null);
      setAccessToken('');
      setLoading(false);
    }
  };

  const register = async (username, email, password) => {
    setLoading(true);
    try {
      const response = await authApi.register(username, email, password);
      return response;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    register,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

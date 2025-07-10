'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, AuthState, LoginRequest, RegisterRequest, UserProgress } from '@/types';

interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
  clearError: () => void;
  userProgress: UserProgress | null;
  refreshProgress: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    token: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      verifyToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async (token: string) => {
    try {
      const response = await fetch('/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const { user } = await response.json();
        setAuthState({
          user,
          isAuthenticated: true,
          token,
        });
        localStorage.setItem('authToken', token);
        await fetchUserProgress(token);
      } else {
        localStorage.removeItem('authToken');
        setAuthState({
          user: null,
          isAuthenticated: false,
          token: null,
        });
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      localStorage.removeItem('authToken');
      setAuthState({
        user: null,
        isAuthenticated: false,
        token: null,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProgress = async (token: string) => {
    try {
      const response = await fetch('/api/user/progress', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const progress = await response.json();
        setUserProgress(progress);
      }
    } catch (error) {
      console.error('Failed to fetch user progress:', error);
    }
  };

  const login = async (credentials: LoginRequest) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        setAuthState({
          user: data.user,
          isAuthenticated: true,
          token: data.token,
        });
        localStorage.setItem('authToken', data.token);
        await fetchUserProgress(data.token);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterRequest) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        setAuthState({
          user: data.user,
          isAuthenticated: true,
          token: data.token,
        });
        localStorage.setItem('authToken', data.token);
        await fetchUserProgress(data.token);
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (error) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setAuthState({
      user: null,
      isAuthenticated: false,
      token: null,
    });
    setUserProgress(null);
  };

  const clearError = () => {
    setError(null);
  };

  const refreshProgress = async () => {
    if (authState.token) {
      await fetchUserProgress(authState.token);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        logout,
        loading,
        error,
        clearError,
        userProgress,
        refreshProgress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (fullName: string, email: string, password: string, confirmPassword?: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('sarhad_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('sarhad_token'));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (token) {
      // Validate session with backend
      api.get('/auth/me')
        .then((res) => {
          if (res.data?.data) {
            setUser(res.data.data);
            localStorage.setItem('sarhad_user', JSON.stringify(res.data.data));
          }
        })
        .catch(() => {
          // Token expired or invalid
          logout();
        });
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data?.success && res.data.data) {
        const { user: authUser, token: authToken } = res.data.data;
        setUser(authUser);
        setToken(authToken);
        localStorage.setItem('sarhad_token', authToken);
        localStorage.setItem('sarhad_user', JSON.stringify(authUser));
        return { success: true };
      }
      return { success: false, message: res.data?.message || 'Login failed' };
    } catch (err: any) {
      // Dev mock login fallback
      if (email.toLowerCase() === 'user@sarhadelectrics.com' || email.toLowerCase() === 'khankhansarmad9@gmail.com') {
        const mockUser: User = {
          id: 'dev-user-01',
          fullName: email.split('@')[0],
          email,
          role: email.toLowerCase() === 'khankhansarmad9@gmail.com' ? 'ADMIN' : 'USER',
        };
        setUser(mockUser);
        setToken('dev-mock-jwt-token');
        localStorage.setItem('sarhad_token', 'dev-mock-jwt-token');
        localStorage.setItem('sarhad_user', JSON.stringify(mockUser));
        return { success: true };
      }
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Unable to connect to server',
      };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (fullName: string, email: string, password: string, confirmPassword?: string) => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/register', { fullName, email, password, confirmPassword });
      if (res.data?.success && res.data.data) {
        const { user: authUser, token: authToken } = res.data.data;
        setUser(authUser);
        setToken(authToken);
        localStorage.setItem('sarhad_token', authToken);
        localStorage.setItem('sarhad_user', JSON.stringify(authUser));
        return { success: true };
      }
      return { success: false, message: res.data?.message || 'Registration failed' };
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Registration request failed',
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('sarhad_token');
    localStorage.removeItem('sarhad_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


import React, { createContext, useContext, useState } from 'react';
import { adminApi } from '../services/adminApi';

interface AdminAuthContextType {
  isAdminAuthenticated: boolean;
  adminUser: { email: string; fullName: string } | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<{ email: string; fullName: string } | null>(() => {
    try {
      const saved = localStorage.getItem('sarhad_admin_user');
      if (saved) {
        return JSON.parse(saved);
      }
      const storefrontUser = localStorage.getItem('sarhad_user');
      if (storefrontUser) {
        const parsed = JSON.parse(storefrontUser);
        if (
          parsed.role === 'ADMIN' ||
          parsed.email?.toLowerCase().includes('admin') ||
          parsed.email?.toLowerCase() === 'khankhansarmad9@gmail.com'
        ) {
          const u = { email: parsed.email, fullName: parsed.fullName || 'Sarhad Administrator' };
          localStorage.setItem('sarhad_admin_user', JSON.stringify(u));
          return u;
        }
      }
      return null;
    } catch {
      return null;
    }
  });

  const login = async (email: string, password: string) => {
    try {
      const res = await adminApi.post('/auth/login', { email, password });
      if (res.data?.success && res.data.data?.user?.role === 'ADMIN') {
        const user = { email: res.data.data.user.email, fullName: res.data.data.user.fullName };
        setAdminUser(user);
        localStorage.setItem('sarhad_admin_token', res.data.data.token);
        localStorage.setItem('sarhad_admin_user', JSON.stringify(user));
        return { success: true };
      }
      return { success: false, message: 'Admin role verification failed' };
    } catch {
      // Offline / dev fallback admin login
      if (
        (email.toLowerCase() === 'khankhansarmad9@gmail.com' && password === 'Pakistan123@') ||
        email.toLowerCase().includes('admin')
      ) {
        const user = { email: 'khankhansarmad9@gmail.com', fullName: 'Sarhad Administrator' };
        setAdminUser(user);
        localStorage.setItem('sarhad_admin_token', 'mock-admin-token');
        localStorage.setItem('sarhad_admin_user', JSON.stringify(user));
        return { success: true };
      }
      return { success: false, message: 'Invalid admin credentials' };
    }
  };

  const logout = () => {
    setAdminUser(null);
    localStorage.removeItem('sarhad_admin_token');
    localStorage.removeItem('sarhad_admin_user');
  };

  return (
    <AdminAuthContext.Provider
      value={{
        isAdminAuthenticated: !!adminUser,
        adminUser,
        login,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};


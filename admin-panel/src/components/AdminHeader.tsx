import React from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ title, subtitle }) => {
  const { adminUser } = useAdminAuth();
  const firstName = (adminUser?.fullName || 'Admin').split(' ')[0];

  return (
    <header className="px-10 pt-10 pb-2 flex items-start justify-between">
      <div>
        <h1 className="text-4xl font-bold text-body tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-muted mt-1.5">{subtitle}</p>}
      </div>
      <span className="text-sm text-muted pt-2">Welcome, {firstName}</span>
    </header>
  );
};
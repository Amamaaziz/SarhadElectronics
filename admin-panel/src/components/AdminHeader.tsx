import React from 'react';
import { Bell, ShieldCheck } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ title, subtitle }) => {
  const { adminUser } = useAdminAuth();

  return (
    <header className="h-20 bg-navy-950/80 backdrop-blur-md border-b border-surface-border px-8 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold font-['Space_Grotesk'] text-white">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs text-textMuted mt-0.5">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface/50 border border-surface-border text-xs text-textMuted">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Supabase PostgreSQL Active</span>
        </div>

        <div className="flex items-center gap-3 pl-2 border-l border-surface-border">
          <div className="w-8 h-8 rounded-full bg-cyan-neon/20 text-cyan-neon border border-cyan-neon/40 flex items-center justify-center font-bold text-xs font-mono">
            AD
          </div>
          <span className="text-xs font-medium text-white hidden md:inline">
            {adminUser?.fullName || 'Sarhad Admin'}
          </span>
        </div>
      </div>
    </header>
  );
};


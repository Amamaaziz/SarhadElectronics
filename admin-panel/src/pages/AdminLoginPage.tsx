import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, AlertCircle, Zap } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('admin@sarhadelectrics.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const { login } = useAdminAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = await login(email, password);
    if (!res.success) {
      setError(res.message || 'Invalid administrator credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-950 px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-neon to-magenta-purple flex items-center justify-center mx-auto shadow-neon-cyan">
            <Zap className="w-7 h-7 text-navy-950 fill-navy-950" />
          </div>
          <h1 className="text-2xl font-extrabold font-['Space_Grotesk'] text-white">
            Sarhad Electrics <span className="text-cyan-neon">Control</span>
          </h1>
          <p className="text-xs text-textMuted">
            Restricted administrative portal for operations and inventory management.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-surface-card border border-surface-border shadow-glass">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-textMuted block mb-1 font-medium">
                Admin Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-900 border border-surface-border text-xs text-white focus:outline-hidden focus:border-cyan-neon"
                />
                <Mail className="w-4 h-4 text-textMuted absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="text-xs text-textMuted block mb-1 font-medium">
                Security Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-900 border border-surface-border text-xs text-white focus:outline-hidden focus:border-cyan-neon"
                />
                <Lock className="w-4 h-4 text-textMuted absolute left-3 top-3" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-cyan-neon text-navy-950 font-bold text-xs uppercase tracking-wider font-['Space_Grotesk'] hover:shadow-neon-cyan transition-all"
            >
              Authenticate as Administrator
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-surface-border text-center">
            <span className="text-[11px] text-textMuted">
              Pre-filled with demo administrator credentials for evaluation.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};


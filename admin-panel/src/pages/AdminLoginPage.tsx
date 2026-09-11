import React, { useState } from 'react';
import { Lock, Mail, AlertCircle, Zap } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    <div className="min-h-screen flex items-center justify-center bg-page px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-ink flex items-center justify-center mx-auto">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-body">
            Sarhad Electrics Control
          </h1>
          <p className="text-sm text-muted">
            Restricted administrative portal for operations and inventory management.
          </p>
        </div>

        <div className="p-8 rounded-card bg-card border border-line shadow-card">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-100 text-rose-600 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-muted block mb-1 font-medium">
                Admin Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="khankhansarmad9@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-page border border-line text-sm text-body focus:outline-hidden focus:border-body"
                />
                <Mail className="w-4 h-4 text-muted absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="text-xs text-muted block mb-1 font-medium">
                Security Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-page border border-line text-sm text-body focus:outline-hidden focus:border-body"
                />
                <Lock className="w-4 h-4 text-muted absolute left-3 top-3" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-ink text-white font-semibold text-sm hover:bg-ink-soft transition-all"
            >
              Authenticate as Administrator
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
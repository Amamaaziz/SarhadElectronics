import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Lock, Mail, AlertCircle, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = await login(email, password);
    if (res.success) {
      navigate('/');
    } else {
      setError(res.message || 'Invalid credentials');
    }
  };

  const fillDemoCustomer = () => {
    setEmail('user@sarhadelectrics.com');
    setPassword('demo123');
  };

  const fillDemoAdmin = () => {
    setEmail('admin@sarhadelectrics.com');
    setPassword('admin123');
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-neon to-magenta-purple flex items-center justify-center mx-auto shadow-neon-cyan">
            <Zap className="w-7 h-7 text-navy-950 fill-navy-950" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-['Space_Grotesk'] text-white">
            Welcome Back
          </h1>
          <p className="text-xs text-textMuted">
            Authenticate to access your orders, tracking history, and personalized hardware pricing.
          </p>
        </div>

        {/* Card */}
        <div className="p-8 rounded-3xl bg-surface-card border border-surface-border shadow-glass">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-textMuted block mb-1.5 font-medium">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-navy-900 border border-surface-border text-sm text-white placeholder:text-textMuted/40 focus:outline-hidden focus:border-cyan-neon transition-all"
                />
                <Mail className="w-4 h-4 text-textMuted absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs text-textMuted font-medium">
                  Password
                </label>
                <span className="text-[11px] text-cyan-neon hover:underline cursor-pointer">
                  Forgot Password?
                </span>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-navy-900 border border-surface-border text-sm text-white placeholder:text-textMuted/40 focus:outline-hidden focus:border-cyan-neon transition-all"
                />
                <Lock className="w-4 h-4 text-textMuted absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-cyan-neon text-navy-950 font-bold text-xs uppercase tracking-wider font-['Space_Grotesk'] hover:shadow-neon-cyan transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <span>Verifying credentials...</span>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Quick fill buttons */}
          <div className="mt-6 pt-4 border-t border-surface-border text-center space-y-2">
            <span className="text-[11px] text-textMuted block">Quick Test Logins:</span>
            <div className="flex justify-center gap-2">
              <button
                type="button"
                onClick={fillDemoCustomer}
                className="px-2.5 py-1 text-[11px] rounded-lg bg-surface border border-surface-border text-slate-300 hover:text-cyan-neon"
              >
                Customer Demo
              </button>
              <button
                type="button"
                onClick={fillDemoAdmin}
                className="px-2.5 py-1 text-[11px] rounded-lg bg-surface border border-surface-border text-slate-300 hover:text-cyan-neon"
              >
                Admin Demo
              </button>
            </div>
          </div>
        </div>

        {/* Footer Link */}
        <p className="text-center text-xs text-textMuted">
          Don't have an account yet?{' '}
          <Link to="/register" className="text-cyan-neon font-semibold hover:underline">
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
};


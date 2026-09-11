import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, User, Lock, Mail, AlertCircle, CheckCircle2, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const RegisterPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectParam = searchParams.get('redirect');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    const res = await register(fullName, email, password, confirmPassword);
    if (res.success) {
      if (redirectParam === 'cart') {
        navigate('/?openCart=true');
      } else if (redirectParam) {
        navigate(redirectParam);
      } else {
        navigate('/');
      }
    } else {
      setError(res.message || 'Registration failed');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="min-h-[75vh] flex items-center justify-center px-4 py-12"
    >
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-neon to-magenta-purple flex items-center justify-center mx-auto shadow-neon-cyan">
            <Zap className="w-7 h-7 text-navy-950 fill-navy-950" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-['Space_Grotesk'] text-white">
            Create Account
          </h1>
          <p className="text-xs text-textMuted">
            Join the Sarhad Electrics platform to access exclusive deals and swift checkout.
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
                Full Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Kamran Afridi"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-navy-900 border border-surface-border text-sm text-white placeholder:text-textMuted/40 focus:outline-hidden focus:border-cyan-neon transition-all"
                />
                <User className="w-4 h-4 text-textMuted absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="text-xs text-textMuted block mb-1.5 font-medium">
                Email Address *
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="kamran@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-navy-900 border border-surface-border text-sm text-white placeholder:text-textMuted/40 focus:outline-hidden focus:border-cyan-neon transition-all"
                />
                <Mail className="w-4 h-4 text-textMuted absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="text-xs text-textMuted block mb-1.5 font-medium">
                Password *
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-navy-900 border border-surface-border text-sm text-white placeholder:text-textMuted/40 focus:outline-hidden focus:border-cyan-neon transition-all"
                />
                <Lock className="w-4 h-4 text-textMuted absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="text-xs text-textMuted block mb-1.5 font-medium">
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
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
                <span>Registering Account...</span>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer Link */}
        <p className="text-center text-xs text-textMuted">
          Already have an account?{' '}
          <Link
            to={redirectParam ? `/login?redirect=${encodeURIComponent(redirectParam)}` : '/login'}
            className="text-cyan-neon font-semibold hover:underline"
          >
            Sign In Here
          </Link>
        </p>
      </div>
    </motion.div>
  );
};


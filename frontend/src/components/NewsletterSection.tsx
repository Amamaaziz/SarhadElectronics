import React, { useState } from 'react';
import { Mail, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { subscribeNewsletterApi } from '../services/api';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      await subscribeNewsletterApi(email);
      setStatus('success');
      setMessage('Welcome to the vanguard. Check your inbox for exclusive release drops.');
      setEmail('');
    } catch {
      setStatus('error');
      setMessage('Subscription failed. Please try again later.');
    }
  };

  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative rounded-3xl bg-surface/30 border border-surface-border p-8 sm:p-14 text-center overflow-hidden">
        <div className="max-w-2xl mx-auto space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-neon/10 text-cyan-neon text-xs font-semibold uppercase tracking-wider border border-cyan-neon/20">
            <Mail className="w-3.5 h-3.5" />
            Sarhad Electrics Dispatch
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-['Space_Grotesk'] tracking-tight text-white">
            Join The <span className="text-cyan-neon">Future</span>
          </h2>
          <p className="text-sm sm:text-base text-textMuted">
            Subscribe to receive direct firmware notifications, priority access to high-demand smart gadgets,
            and exclusive member pricing.
          </p>

          <form onSubmit={handleSubmit} className="pt-4 flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto">
            <div className="relative w-full">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="w-full px-4 py-3 rounded-xl bg-navy-900 border border-surface-border text-sm text-white placeholder:text-textMuted/60 focus:outline-hidden focus:border-cyan-neon focus:ring-1 focus:ring-cyan-neon transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-neon to-magenta-purple text-navy-950 font-bold text-sm tracking-wider uppercase font-['Space_Grotesk'] hover:shadow-neon-cyan transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
            >
              <span>{status === 'loading' ? 'Subscribing...' : 'Subscribe'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {status === 'success' && (
            <div className="pt-2 text-xs text-emerald-400 flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> {message}
            </div>
          )}
          {status === 'error' && (
            <div className="pt-2 text-xs text-rose-400 flex items-center justify-center gap-1.5">
              <AlertCircle className="w-4 h-4" /> {message}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};


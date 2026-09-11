import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle } from 'lucide-react';
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
      setMessage('Welcome to the vanguard! Check your inbox for exclusive drops.');
      setEmail('');
    } catch {
      setStatus('error');
      setMessage('Subscription failed. Please try again later.');
    }
  };

  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
        className="relative rounded-[28px] bg-[rgba(255,255,255,0.05)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.08)] p-8 sm:p-12 lg:p-14 text-center overflow-hidden shadow-2xl"
      >
        {/* Top-Left STAY UPDATED Label */}
        <div className="absolute top-6 left-6 sm:top-8 sm:left-10 flex items-center gap-2.5">
          <span className="w-5 h-[2px] bg-[#00E5FF] rounded-full" />
          <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-widest text-[#00E5FF] font-['Space_Grotesk']">
            STAY UPDATED
          </span>
        </div>

        {/* Center Content */}
        <div className="max-w-2xl mx-auto space-y-3 pt-6 sm:pt-4">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-['Space_Grotesk'] text-white tracking-tight">
            Join the Future
          </h2>

          <p className="text-xs sm:text-sm text-slate-300/80 max-w-xl mx-auto leading-relaxed">
            Subscribe to our newsletter for exclusive tech drops, project updates, and member-only discounts.
          </p>

          {/* Unified Input and Subscribe Bar */}
          <form onSubmit={handleSubmit} className="pt-6 max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center gap-2.5 p-2 rounded-2xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] backdrop-blur-md">
              <div className="relative flex-1 w-full">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-xl bg-[rgba(7,16,30,0.6)] border border-[rgba(255,255,255,0.12)] text-sm text-white placeholder:text-slate-400 focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] transition-all"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={status === 'loading'}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#0B6CCF] hover:bg-[#00E5FF] hover:text-[#07101E] text-white font-extrabold text-xs sm:text-sm tracking-wider uppercase font-['Space_Grotesk'] shadow-neon-blue hover:shadow-neon-cyan transition-all shrink-0 disabled:opacity-50 btn-shine"
              >
                {status === 'loading' ? 'SUBSCRIBING...' : 'SUBSCRIBE'}
              </motion.button>
            </div>
          </form>

          {/* Status Feedback */}
          {status === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="pt-3 text-xs text-emerald-400 flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" /> {message}
            </motion.div>
          )}
          {status === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="pt-3 text-xs text-rose-400 flex items-center justify-center gap-1.5"
            >
              <AlertCircle className="w-4 h-4" /> {message}
            </motion.div>
          )}
        </div>
      </motion.div>
    </section>
  );
};

export default NewsletterSection;



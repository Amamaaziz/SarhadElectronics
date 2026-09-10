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
      {/* Exact Right-Side Electric Blue Radiant Glow from Reference Screenshot 2 */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[650px] h-[450px] bg-gradient-to-l from-[#0B6CCF]/65 via-[#0B6CCF]/30 to-transparent rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[400px] h-[300px] bg-[#040813]/80 rounded-full blur-3xl pointer-events-none -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
        className="relative rounded-3xl bg-gradient-to-r from-[#07101E]/90 via-[#091B3A]/75 to-[#0B3970]/55 backdrop-blur-2xl border border-cyan-neon/35 p-8 sm:p-12 lg:p-14 text-center overflow-hidden shadow-[0_0_45px_rgba(11,108,207,0.22)]"
      >
        {/* Top-Left STAY UPDATED Label matching reference screenshot */}
        <div className="absolute top-6 left-6 sm:top-8 sm:left-10 flex items-center gap-2.5">
          <span className="w-5 h-[2px] bg-cyan-neon rounded-full" />
          <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-widest text-cyan-neon font-['Space_Grotesk']">
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

          {/* Unified Input and Subscribe Pill Bar */}
          <form onSubmit={handleSubmit} className="pt-6 max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center gap-2.5 p-2 rounded-2xl bg-[#09152b]/85 border border-[#0B6CCF]/30 backdrop-blur-md shadow-inner">
              <div className="relative flex-1 w-full">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-xl bg-[#060D1E]/70 border border-[#0B6CCF]/25 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-neon focus:ring-1 focus:ring-cyan-neon transition-all"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={status === 'loading'}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#0B6CCF] hover:bg-cyan-neon hover:text-navy-950 text-white font-extrabold text-xs sm:text-sm tracking-wider uppercase font-['Space_Grotesk'] shadow-neon-blue hover:shadow-neon-cyan transition-all shrink-0 disabled:opacity-50 btn-shine"
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


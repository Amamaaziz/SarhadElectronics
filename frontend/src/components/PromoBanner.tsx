import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const PromoBanner: React.FC = () => {
  return (
    <div className="my-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      {/* Exact Right-Side Electric Blue Ambient Glow from Reference Screenshot */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-l from-[#0B6CCF]/60 via-[#0B6CCF]/25 to-transparent rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[400px] h-[300px] bg-[#040813]/80 rounded-full blur-3xl pointer-events-none -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
        className="relative rounded-3xl bg-gradient-to-r from-[#07101E]/90 via-[#091B3A]/75 to-[#0B3970]/55 backdrop-blur-2xl border border-cyan-neon/35 p-8 sm:p-14 text-center overflow-hidden shadow-[0_0_45px_rgba(11,108,207,0.22)]"
      >
        {/* Top-Right Badge matching screenshot */}
        <div className="absolute top-5 right-5 sm:top-6 sm:right-8">
          <span className="px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full bg-cyan-neon text-navy-950 font-extrabold text-[10px] sm:text-[11px] uppercase tracking-wider font-['Space_Grotesk'] shadow-neon-cyan">
            SUMMER TECH
          </span>
        </div>

        {/* Center Content */}
        <div className="max-w-2xl mx-auto space-y-4 py-4 sm:py-2">
          {/* Headline */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-['Space_Grotesk'] text-white tracking-tight">
            Limited Summer Offer!
          </h2>

          {/* Subtext */}
          <p className="text-sm sm:text-base text-slate-300/80 leading-relaxed">
            Get up to <strong className="text-white font-bold">40% OFF</strong> on all Smart Home systems and Audio Gear.
          </p>

          {/* Centered CTA Button */}
          <div className="pt-4 flex justify-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/shop"
                className="inline-block px-8 py-3.5 rounded-xl bg-cyan-neon text-navy-950 font-extrabold text-xs sm:text-sm tracking-wider uppercase font-['Space_Grotesk'] shadow-neon-cyan hover:shadow-neon-cyan-lg transition-all btn-shine"
              >
                EXPLORE OFFERS
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PromoBanner;

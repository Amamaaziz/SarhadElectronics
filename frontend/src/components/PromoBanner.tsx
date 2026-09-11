import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const PromoBanner: React.FC = () => {
  return (
    <div className="my-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
        className="relative rounded-[28px] bg-[rgba(255,255,255,0.05)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.08)] p-8 sm:p-14 text-center overflow-hidden shadow-2xl"
      >
        {/* Top-Right Badge */}
        <div className="absolute top-5 right-5 sm:top-6 sm:right-8">
          <span className="px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full bg-[#00E5FF] text-[#07101E] font-extrabold text-[10px] sm:text-[11px] uppercase tracking-wider font-['Space_Grotesk'] shadow-neon-cyan">
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
                className="inline-block px-8 py-3.5 rounded-xl bg-[#00E5FF] text-[#07101E] font-extrabold text-xs sm:text-sm tracking-wider uppercase font-['Space_Grotesk'] shadow-neon-cyan hover:shadow-neon-cyan-lg transition-all btn-shine"
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


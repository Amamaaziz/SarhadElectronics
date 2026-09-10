import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Zap } from 'lucide-react';

export const PromoBanner: React.FC = () => {
  return (
    <div className="my-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#0B132B] via-[#1E1B4B] to-[#131D33] border border-cyan-neon/30 p-8 sm:p-12 shadow-neon-magenta/20 shadow-2xl">
        {/* Glow orb */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-magenta-purple/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-neon/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 text-center md:text-left max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-magenta-neon/20 text-magenta-neon text-xs font-semibold uppercase tracking-wider border border-magenta-neon/30">
              <Sparkles className="w-3.5 h-3.5" />
              Limited Cyber Season Promo
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-['Space_Grotesk'] tracking-tight text-white">
              Upgrade Your Setup: Get Up To{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-neon to-magenta-neon">
                40% OFF
              </span>
            </h2>
            <p className="text-sm sm:text-base text-textMuted leading-relaxed">
              Experience the convergence of industrial grade reliability and smart home automation.
              Exclusive discounts on Smart Gadgets, Modern Lighting, and Cordless Tools.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link
              to="/shop"
              className="px-6 py-3.5 rounded-xl bg-cyan-neon text-navy-950 font-bold text-sm tracking-wider uppercase font-['Space_Grotesk'] hover:shadow-neon-cyan-lg hover:scale-105 transition-all flex items-center gap-2"
            >
              <Zap className="w-4 h-4 fill-navy-950" />
              Claim Offer Now
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};


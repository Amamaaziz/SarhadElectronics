import React from 'react';
import { motion } from 'framer-motion';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 lg:py-20 relative overflow-hidden bg-navy-950">
      {/* Background radial blue glow */}
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-r from-cyan-neon/10 via-blue-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Text & Stats */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 space-y-8"
          >
            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-['Space_Grotesk'] text-white leading-[1.15] tracking-tight">
              Innovation in Every <br />
              <span className="text-slate-200">Component</span>
            </h1>

            {/* Narrative Paragraphs */}
            <div className="space-y-4 text-sm sm:text-base text-textMuted leading-relaxed">
              <p>
                Founded with a vision to revolutionize the electrical and electronics market,
                Sarhad Electrics brings together cutting-edge technology and premium design.
              </p>
              <p>
                We specialize in high-performance gadgets, smart home ecosystems, and industrial-grade electrical solutions.
                Our mission is to provide reliability and sophistication to every customer.
              </p>
            </div>

            {/* Metric Stat Cards */}
            <div className="grid grid-cols-2 gap-4 sm:gap-6 pt-2">
              <motion.div
                whileHover={{ y: -4, borderColor: 'rgba(0, 229, 255, 0.4)' }}
                className="p-6 rounded-2xl bg-surface/40 border border-surface-border backdrop-blur-md transition-all duration-300 shadow-glass"
              >
                <div className="text-3xl sm:text-4xl font-extrabold font-['Space_Grotesk'] text-cyan-neon drop-shadow-[0_0_12px_rgba(0,229,255,0.4)]">
                  10k+
                </div>
                <div className="text-xs text-textMuted font-medium mt-1">
                  Happy Clients
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -4, borderColor: 'rgba(0, 229, 255, 0.4)' }}
                className="p-6 rounded-2xl bg-surface/40 border border-surface-border backdrop-blur-md transition-all duration-300 shadow-glass"
              >
                <div className="text-3xl sm:text-4xl font-extrabold font-['Space_Grotesk'] text-cyan-neon drop-shadow-[0_0_12px_rgba(0,229,255,0.4)]">
                  15+
                </div>
                <div className="text-xs text-textMuted font-medium mt-1">
                  Global Partners
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Column: Framed Team Workspace Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 flex justify-center"
          >
            <div className="relative w-full rounded-3xl p-3 bg-surface/30 border border-surface-border shadow-2xl backdrop-blur-xl group">
              {/* Outer subtle glow */}
              <div className="absolute inset-0 rounded-3xl bg-cyan-neon/5 blur-xl pointer-events-none group-hover:bg-cyan-neon/10 transition-colors duration-500" />

              <div className="aspect-4/3 w-full rounded-2xl overflow-hidden bg-navy-900 border border-surface-border/50 relative">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80"
                  alt="Sarhad Electrics Collaborative Team Workspace"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

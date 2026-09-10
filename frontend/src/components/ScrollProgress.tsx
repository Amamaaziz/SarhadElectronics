import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

export const ScrollProgress: React.FC = () => {
  const { scrollYProgress } = useScroll();

  // Smooth physics spring for silky scrolling reaction
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 25,
    restDelta: 0.001,
  });

  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-50 pointer-events-none bg-navy-950/40 backdrop-blur-xs">
      <motion.div
        className="h-full bg-gradient-to-r from-cyan-neon via-cyan-hover to-magenta-neon shadow-[0_0_12px_rgba(0,229,255,0.8)] origin-left"
        style={{ scaleX }}
      />
    </div>
  );
};


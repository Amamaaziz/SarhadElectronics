import React from 'react';
import { Link } from 'react-router-dom';

interface BrandMarqueeProps {
  children?: React.ReactNode;
}

export const BrandMarquee: React.FC<BrandMarqueeProps> = ({ children }) => {
  const brands = [
    { name: 'SAMSUNG', desc: 'DISPLAY & SILICON' },
    { name: 'PHILIPS', desc: 'SMART LIGHTING' },
    { name: 'LG', desc: 'INVERTER LIVING' },
    { name: 'BOSE', desc: 'ACOUSTIC ENGINEERING' },
    { name: 'DYSON', desc: 'DIGITAL MOTORS' },
    { name: 'TESLA', desc: 'ENERGY & AUTOMATION' },
    { name: 'SARHAD TOOLS', desc: 'INDUSTRIAL HEAVY' },
    { name: 'PANASONIC', desc: 'ECO ELECTRONICS' },
  ];

  return (
    <section className="relative overflow-hidden bg-transparent pt-10 pb-12 sm:pt-14 sm:pb-16">
      {/* Background Texture: Subtle Grid */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,229,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,229,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>



      {/* Marquee Top Sub-Header */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 text-center mb-6">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[rgba(19,29,51,0.65)] backdrop-blur-md border border-[rgba(0,229,255,0.2)] text-[#00E5FF] text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] font-['Space_Grotesk'] shadow-[0_0_15px_rgba(0,229,255,0.1)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse" />
          Authorized Partner Brands & Engineering Alliances
        </span>
      </div>

      {/* Top: Full-Width Horizontal Infinite Scrolling Brand Wordmarks in Cyber Glass Ribbon */}
      <div className="relative z-10 w-full bg-[rgba(19,29,51,0.55)] backdrop-blur-xl border-y border-[rgba(0,229,255,0.28)] py-6 sm:py-8 shadow-[0_0_35px_rgba(0,229,255,0.08),inset_0_1px_0_rgba(255,255,255,0.1),inset_0_-1px_0_rgba(255,255,255,0.05)] overflow-hidden">
        {/* Inner Marquee track with soft edge mask so borders remain full length */}
        <div className="w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
          <div className="flex w-max animate-marquee-continuous hover:[animation-play-state:paused]">
            {/* Logo set 1 */}
            <div className="flex items-center gap-16 sm:gap-24 shrink-0 pr-16 sm:pr-24">
              {brands.map((brand, idx) => (
                <div
                  key={`b1-${idx}`}
                  className="flex flex-col items-center justify-center group cursor-pointer select-none transition-transform duration-300"
                >
                  <span className="text-xl sm:text-2xl md:text-3xl font-extrabold font-['Space_Grotesk'] tracking-[0.25em] text-white/85 uppercase transition-all duration-300 group-hover:text-[#00E5FF] group-hover:drop-shadow-[0_0_18px_rgba(0,229,255,0.85)] group-hover:scale-105">
                    {brand.name}
                  </span>
                  <span className="text-[10px] font-semibold tracking-[0.22em] text-[#94A3B8] uppercase mt-1 group-hover:text-cyan-300 transition-colors">
                    {brand.desc}
                  </span>
                </div>
              ))}
            </div>

            {/* Logo set 2 (Identical duplicate for seamless 0-jump loop) */}
            <div className="flex items-center gap-16 sm:gap-24 shrink-0 pr-16 sm:pr-24" aria-hidden="true">
              {brands.map((brand, idx) => (
                <div
                  key={`b2-${idx}`}
                  className="flex flex-col items-center justify-center group cursor-pointer select-none transition-transform duration-300"
                >
                  <span className="text-xl sm:text-2xl md:text-3xl font-extrabold font-['Space_Grotesk'] tracking-[0.25em] text-white/85 uppercase transition-all duration-300 group-hover:text-[#00E5FF] group-hover:drop-shadow-[0_0_18px_rgba(0,229,255,0.85)] group-hover:scale-105">
                    {brand.name}
                  </span>
                  <span className="text-[10px] font-semibold tracking-[0.22em] text-[#94A3B8] uppercase mt-1 group-hover:text-cyan-300 transition-colors">
                    {brand.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content Block below Marquee: CURATION label + New Arrivals heading + VIEW ALL link */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            {/* Teal/Cyan Uppercase Label with a long glowing horizontal accent line before it */}
            <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-cyan-400 font-['Space_Grotesk'] mb-2">
              <span className="w-14 sm:w-20 h-[3px] bg-gradient-to-r from-[#00E5FF] to-cyan-300 rounded-full inline-block shrink-0 shadow-[0_0_12px_rgba(0,229,255,0.85)]" />
              <span>CURATION</span>
            </div>

            {/* Large Bold White Heading */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-['Space_Grotesk'] text-white tracking-tight">
              New Arrivals
            </h2>
          </div>

          {/* VIEW ALL → Link aligned to the right on the same row */}
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-cyan-400 hover:text-white tracking-[0.2em] uppercase transition-all group font-['Space_Grotesk'] py-1 self-start sm:self-end"
          >
            <span>VIEW ALL</span>
            <span className="group-hover:translate-x-1.5 transition-transform duration-300 text-base">→</span>
          </Link>
        </div>

        {/* Children (e.g. Products Grid) */}
        {children && <div className="mt-8">{children}</div>}
      </div>

      {/* Pure CSS Keyframes for Seamless Continuous Marquee Scrolling */}
      <style>{`
        @keyframes marqueeScroll {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee-continuous {
          animation: marqueeScroll 24s linear infinite;
        }
      `}</style>
    </section>
  );
};



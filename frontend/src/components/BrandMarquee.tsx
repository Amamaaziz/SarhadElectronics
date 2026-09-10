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
    <section className="relative overflow-hidden bg-gradient-to-b from-[#05080F] via-[#090D1C] to-[#13162C] border-y border-white/[0.06] pt-10 pb-12 sm:pt-14 sm:pb-16">
      {/* Background Texture: Subtle Grid + Faint Diagonal Light-Beam Glow Streak */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtle grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,229,255,0.018)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,229,255,0.018)_1px,transparent_1px)] bg-[size:40px_40px]" />

        {/* Faint diagonal light-beam / glow streak crossing the section */}
        <div className="absolute -inset-x-32 top-0 bottom-0 bg-[linear-gradient(115deg,transparent_20%,rgba(0,229,255,0.035)_44%,rgba(59,130,246,0.06)_50%,rgba(0,229,255,0.035)_56%,transparent_75%)] opacity-90" />

        {/* Ambient background soft glow spots */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[160px] bg-cyan-400/5 blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-[450px] h-[220px] bg-blue-600/10 blur-[110px]" />
      </div>

      {/* Marquee Top Sub-Header */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 text-center mb-6">
        <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.3em] text-white/30 font-['Space_Grotesk']">
          Authorized Partner Brands & Engineering Alliances
        </span>
      </div>

      {/* Top: Full-Width Horizontal Infinite Scrolling Brand Wordmarks */}
      <div className="relative z-10 w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] py-2">
        <div className="flex w-max animate-marquee-continuous hover:[animation-play-state:paused]">
          {/* Logo set 1 */}
          <div className="flex items-center gap-14 sm:gap-20 shrink-0 pr-14 sm:pr-20">
            {brands.map((brand, idx) => (
              <div
                key={`b1-${idx}`}
                className="flex flex-col items-center justify-center group cursor-default select-none transition-transform duration-300 hover:scale-105"
              >
                <span className="text-xl sm:text-2xl md:text-3xl font-extrabold font-['Space_Grotesk'] tracking-[0.25em] text-white/20 uppercase transition-all duration-300 group-hover:text-white/80 group-hover:drop-shadow-[0_0_15px_rgba(0,229,255,0.6)]">
                  {brand.name}
                </span>
                <span className="text-[9px] font-medium tracking-[0.22em] text-white/15 uppercase mt-0.5 group-hover:text-cyan-400/70 transition-colors">
                  {brand.desc}
                </span>
              </div>
            ))}
          </div>

          {/* Logo set 2 (Identical duplicate for seamless 0-jump loop) */}
          <div className="flex items-center gap-14 sm:gap-20 shrink-0 pr-14 sm:pr-20" aria-hidden="true">
            {brands.map((brand, idx) => (
              <div
                key={`b2-${idx}`}
                className="flex flex-col items-center justify-center group cursor-default select-none transition-transform duration-300 hover:scale-105"
              >
                <span className="text-xl sm:text-2xl md:text-3xl font-extrabold font-['Space_Grotesk'] tracking-[0.25em] text-white/20 uppercase transition-all duration-300 group-hover:text-white/80 group-hover:drop-shadow-[0_0_15px_rgba(0,229,255,0.6)]">
                  {brand.name}
                </span>
                <span className="text-[9px] font-medium tracking-[0.22em] text-white/15 uppercase mt-0.5 group-hover:text-cyan-400/70 transition-colors">
                  {brand.desc}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content Block below Marquee: CURATION label + New Arrivals heading + VIEW ALL link */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            {/* Teal/Cyan Uppercase Label with a short horizontal line before it */}
            <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.25em] text-cyan-400 font-['Space_Grotesk'] mb-2">
              <span className="w-6 h-[2px] bg-cyan-400 rounded-full inline-block shrink-0 shadow-[0_0_8px_rgba(0,229,255,0.7)]" />
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



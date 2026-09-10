import React from 'react';

export const BrandMarquee: React.FC = () => {
  const brands = [
    { name: 'SAMSUNG', desc: 'Display & Silicon' },
    { name: 'PHILIPS', desc: 'Smart Lighting' },
    { name: 'LG ELECTRONICS', desc: 'Inverter Living' },
    { name: 'BOSE', desc: 'Acoustic Engineering' },
    { name: 'DYSON', desc: 'Digital Motors' },
    { name: 'SARHAD TOOLS', desc: 'Industrial Heavy' },
  ];

  return (
    <div className="py-8 bg-navy-950/60 overflow-hidden border-b border-surface-border">
      <div className="max-w-7xl mx-auto px-4 mb-4 text-center">
        <span className="text-xs uppercase tracking-[0.25em] text-textMuted font-semibold">
          Authorized Partner Brands & Engineering Alliances
        </span>
      </div>

      <div className="flex items-center justify-around flex-wrap gap-8 px-4 opacity-70 hover:opacity-100 transition-opacity">
        {brands.map((brand, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center justify-center p-3 rounded-xl hover:bg-surface/30 transition-all cursor-default group"
          >
            <span className="text-lg md:text-xl font-black font-['Space_Grotesk'] tracking-widest text-slate-300 group-hover:text-cyan-neon transition-colors">
              {brand.name}
            </span>
            <span className="text-[10px] text-textMuted tracking-wider uppercase">
              {brand.desc}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};


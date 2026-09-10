import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-navy-950 border-t border-surface-border mt-20 pt-16 pb-12 relative overflow-hidden">
      {/* Background neon ambient highlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-cyan-neon/10 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Column 1: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-neon to-magenta-purple flex items-center justify-center shadow-neon-cyan">
                <Zap className="w-5 h-5 text-navy-950 fill-navy-950" />
              </div>
              <span className="text-xl font-bold font-['Space_Grotesk'] tracking-wider text-white">
                SARHAD <span className="text-cyan-neon font-black">ELECTRICS</span>
              </span>
            </Link>
            <p className="text-sm text-textMuted leading-relaxed max-w-sm">
              Empowering homes and modern industries with next-generation smart electronics,
              ambient architectural lighting, and high-precision electrical tools. Innovation in every component.
            </p>

            {/* SSL Badge & Security */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-lg bg-surface/50 border border-surface-border text-xs text-textMuted">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>256-Bit SSL Encrypted & Verified Safe Checkout</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold tracking-wider uppercase text-white font-['Space_Grotesk']">
              Explore
            </h4>
            <ul className="space-y-2 text-sm text-textMuted">
              <li>
                <Link to="/shop" className="hover:text-cyan-neon transition-colors">All Products</Link>
              </li>
              <li>
                <Link to="/shop?category=smart-gadgets" className="hover:text-cyan-neon transition-colors">Smart Gadgets</Link>
              </li>
              <li>
                <Link to="/shop?category=modern-lighting" className="hover:text-cyan-neon transition-colors">Modern Lighting</Link>
              </li>
              <li>
                <Link to="/shop?category=home-appliances" className="hover:text-cyan-neon transition-colors">Home Appliances</Link>
              </li>
              <li>
                <Link to="/shop?category=electrical-tools" className="hover:text-cyan-neon transition-colors">Electrical Tools</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold tracking-wider uppercase text-white font-['Space_Grotesk']">
              Company
            </h4>
            <ul className="space-y-2 text-sm text-textMuted">
              <li>
                <Link to="/about" className="hover:text-cyan-neon transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-cyan-neon transition-colors">Contact & Support</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-cyan-neon transition-colors">Store Locator</Link>
              </li>
              <li>
                <span className="cursor-pointer hover:text-cyan-neon transition-colors">Privacy Policy</span>
              </li>
              <li>
                <span className="cursor-pointer hover:text-cyan-neon transition-colors">Terms of Service</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Socials & Physical Location */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold tracking-wider uppercase text-white font-['Space_Grotesk']">
              Connect
            </h4>
            <div className="flex flex-wrap gap-2 text-xs">
              {['Facebook', 'Twitter', 'Instagram', 'LinkedIn'].map((platform) => (
                <a
                  key={platform}
                  href={`https://${platform.toLowerCase()}.com`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-surface hover:bg-cyan-neon/10 hover:text-cyan-neon border border-surface-border text-textMuted transition-all flex items-center gap-1"
                >
                  {platform} <ArrowUpRight className="w-3 h-3" />
                </a>
              ))}
            </div>
            <div className="pt-2 text-xs text-textMuted">
              <p className="font-medium text-white">Physical Showroom:</p>
              <p>Shop No. 57 Raheem Plaza, Board Bazar, University Road, Peshawar</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-surface-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-textMuted">
          <p>© {new Date().getFullYear()} Sarhad Electrics. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Designed for Modern High-Tech Living</span>
            <span className="text-cyan-neon font-medium">Peshawar, Pakistan</span>
          </div>
        </div>
      </div>
    </footer>
  );
};


import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#07101E] border-t border-surface-border/60 pt-16 pb-12 relative overflow-hidden text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 3-Column Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16 mb-12">
          {/* Column 1: Brand Logo, Description & Social Icons (Span 6) */}
          <div className="md:col-span-6 space-y-5">
            {/* Brand Logo */}
            <Link to="/" className="inline-flex items-center text-xl font-black font-['Space_Grotesk'] tracking-wider text-white">
              <span>SARHAD</span>
              <span className="text-cyan-neon">ELECTRICS</span>
              <span className="w-2 h-2 rounded-full bg-cyan-neon ml-1 shadow-[0_0_8px_rgba(0,229,255,0.8)] inline-block"></span>
            </Link>

            <p className="text-sm text-textMuted leading-relaxed max-w-md">
              Leading the future of electronics with premium design and cutting-edge performance.
              Your trusted partner for high-end technology solutions.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-4 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="text-textMuted hover:text-white transition-colors"
              >
                <Facebook className="w-4 h-4 fill-current" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
                className="text-textMuted hover:text-white transition-colors"
              >
                <Twitter className="w-4 h-4 fill-current" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="text-textMuted hover:text-white transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="text-textMuted hover:text-white transition-colors"
              >
                <Linkedin className="w-4 h-4 fill-current" />
              </a>
            </div>
          </div>

          {/* Column 2: Shop (Span 3) */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-base font-bold text-white font-['Space_Grotesk']">
              Shop
            </h4>
            <ul className="space-y-2.5 text-sm text-textMuted">
              <li>
                <Link to="/shop" className="hover:text-cyan-neon transition-colors">
                  All Products
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company (Span 3) */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-base font-bold text-white font-['Space_Grotesk']">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm text-textMuted">
              <li>
                <Link to="/about" className="hover:text-cyan-neon transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-cyan-neon transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-cyan-neon transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-cyan-neon transition-colors">
                  Privacy & Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Horizontal Bar */}
        <div className="pt-8 border-t border-surface-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-textMuted">
          <p>© 2026 Sarhad Electrics. All Rights Reserved.</p>
          <p>Secured By: SSL Encryption</p>
        </div>
      </div>
    </footer>
  );
};

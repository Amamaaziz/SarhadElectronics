import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#07101E] border-t border-[rgba(255,255,255,0.08)] pt-16 pb-12 relative z-20 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 3-Column Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16 mb-12">
          {/* Column 1: Brand Logo, Description & Social Icons (Left - Span 6) */}
          <div className="md:col-span-6 space-y-5">
            {/* Brand Logo */}
            <Link to="/" className="inline-flex items-center text-xl font-black font-['Space_Grotesk'] tracking-wider text-white">
              <span>SARHAD</span>
              <span className="text-[#00E5FF]">ELECTRICS</span>
              <span className="w-2 h-2 rounded-full bg-[#00E5FF] ml-1 shadow-[0_0_8px_rgba(0,229,255,0.8)] inline-block"></span>
            </Link>

            <p className="text-sm text-[#94A3B8] leading-relaxed max-w-md">
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
                className="text-[#94A3B8] hover:text-[#00E5FF] transition-colors"
              >
                <Facebook className="w-4 h-4 fill-current" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
                className="text-[#94A3B8] hover:text-[#00E5FF] transition-colors"
              >
                <Twitter className="w-4 h-4 fill-current" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="text-[#94A3B8] hover:text-[#00E5FF] transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="text-[#94A3B8] hover:text-[#00E5FF] transition-colors"
              >
                <Linkedin className="w-4 h-4 fill-current" />
              </a>
            </div>
          </div>

          {/* Column 2: Shop (Middle - Span 3) */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-base font-bold text-white font-['Space_Grotesk']">
              Shop
            </h4>
            <ul className="space-y-2.5 text-sm text-[#94A3B8]">
              <li>
                <Link to="/shop" className="hover:text-[#00E5FF] transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/shop?sort=newest" className="hover:text-[#00E5FF] transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link to="/shop?featured=true" className="hover:text-[#00E5FF] transition-colors">
                  Featured Items
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company (Right - Span 3) */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-base font-bold text-white font-['Space_Grotesk']">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm text-[#94A3B8]">
              <li>
                <Link to="/about" className="hover:text-[#00E5FF] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#00E5FF] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar Separated by Thin Divider */}
        <div className="pt-8 border-t border-[rgba(255,255,255,0.08)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#94A3B8]">
          <p>© 2026 Sarhad Electrics. All Rights Reserved.</p>
          <p>Secured By: SSL Encryption</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


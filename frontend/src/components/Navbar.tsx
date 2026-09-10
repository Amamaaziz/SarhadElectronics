import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ShoppingBag, User as UserIcon, Menu, X, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const { totalItems, setIsCartOpen } = useCart();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'HOME', path: '/' },
    { name: 'SHOP', path: '/shop' },
    { name: 'ABOUT', path: '/about' },
    { name: 'CONTACT', path: '/contact' },
  ];

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
      className={`sticky top-0 z-40 transition-all duration-500 ${
        isScrolled ? 'pt-3 sm:pt-4 px-3 sm:px-6' : 'pt-0 px-0'
      }`}
    >
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 260, damping: 25 }}
        className={`mx-auto transition-all duration-500 flex items-center justify-between ${
          isScrolled
            ? 'max-w-6xl h-14 sm:h-16 px-5 sm:px-8 rounded-2xl bg-[#07101E]/85 backdrop-blur-2xl border border-cyan-neon/30 shadow-[0_12px_40px_rgba(0,0,0,0.6),0_0_20px_rgba(0,229,255,0.15)]'
            : 'max-w-7xl h-20 px-4 sm:px-6 lg:px-8 bg-[#07101E]/90 backdrop-blur-xl border-b border-surface-border/70'
        }`}
      >
        {/* Brand Logo */}
        <Link to="/" className="flex items-center text-lg sm:text-xl font-black font-['Space_Grotesk'] tracking-wider text-white group">
          <span>SARHAD</span>
          <span className="text-cyan-neon drop-shadow-[0_0_8px_rgba(0,229,255,0.4)]">ELECTRICS</span>
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-neon ml-1 shadow-[0_0_8px_rgba(0,229,255,0.8)] inline-block"></span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `text-xs font-bold tracking-widest uppercase transition-colors duration-200 relative py-1 ${
                  isActive ? 'text-cyan-neon' : 'text-slate-300 hover:text-cyan-neon'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span>{link.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-neon shadow-neon-cyan"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}

          {/* User Auth Link / Button */}
          {user ? (
            <div className="relative group">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 py-1 px-2.5 rounded-lg bg-surface/60 hover:bg-surface border border-surface-border text-xs text-white uppercase font-bold tracking-wider transition-all"
              >
                <UserIcon className="w-3.5 h-3.5 text-cyan-neon" />
                <span className="max-w-[100px] truncate">{user.fullName}</span>
              </motion.button>
              <div className="absolute right-0 mt-2 w-48 py-2 bg-surface-card border border-surface-border rounded-xl shadow-glass opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all z-50">
                <div className="px-4 py-2 border-b border-surface-border text-xs text-textMuted">
                  Signed in as <strong className="text-white block truncate">{user.email}</strong>
                </div>
                {user.role === 'ADMIN' && (
                  <a
                    href="http://localhost:5174"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full text-left px-4 py-2 text-xs text-cyan-neon hover:bg-navy-900 block font-medium"
                  >
                    Admin Dashboard ↗
                  </a>
                )}
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-xs text-rose-400 hover:bg-navy-900 flex items-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" /> Logout
                </button>
              </div>
            </div>
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `text-xs font-bold tracking-widest uppercase transition-colors duration-200 ${
                  isActive ? 'text-cyan-neon' : 'text-slate-300 hover:text-cyan-neon'
                }`
              }
            >
              LOGIN
            </NavLink>
          )}
        </nav>

        {/* Right Action Icons: Cart with Cyan Circular Counter */}
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setIsCartOpen(true)}
            aria-label="Open Cart"
            className="relative p-2 text-slate-300 hover:text-cyan-neon transition-colors"
          >
            <ShoppingBag className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 bg-cyan-neon text-navy-950 font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-neon-cyan">
              {totalItems}
            </span>
          </motion.button>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-textMuted hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </motion.div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-[#07101E]/98 backdrop-blur-2xl border-b border-surface-border px-6 py-4 space-y-3 overflow-hidden"
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-bold tracking-wider uppercase text-textMuted hover:text-cyan-neon py-2"
              >
                {link.name}
              </Link>
            ))}
            {!user ? (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-bold tracking-wider uppercase text-cyan-neon py-2 border-t border-surface-border"
              >
                LOGIN
              </Link>
            ) : (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left text-sm font-bold tracking-wider uppercase text-rose-400 py-2 border-t border-surface-border"
              >
                Sign Out ({user.fullName})
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

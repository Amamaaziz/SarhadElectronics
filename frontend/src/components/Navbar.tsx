import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ShoppingBag, User as UserIcon, Menu, X, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const { totalItems, setIsCartOpen } = useCart();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'HOME', path: '/' },
    { name: 'SHOP', path: '/shop' },
    { name: 'ABOUT', path: '/about' },
    { name: 'CONTACT', path: '/contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-[#07101E]/90 backdrop-blur-[20px] border-b border-[rgba(0,229,255,0.15)]">
      <div className="max-w-7xl mx-auto h-20 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center text-lg sm:text-xl font-extrabold font-['Space_Grotesk'] tracking-tight text-white group">
          <span>SARHAD</span>
          <span className="text-[#00E5FF] drop-shadow-[0_0_8px_rgba(0,229,255,0.4)]">ELECTRICS</span>
          <span className="w-2 h-2 rounded-full bg-[#00E5FF] ml-1 shadow-[0_0_8px_rgba(0,229,255,0.8)] inline-block" />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `text-xs font-bold tracking-widest uppercase transition-colors duration-200 relative py-1 ${
                  isActive ? 'text-[#00E5FF]' : 'text-[#94A3B8] hover:text-[#00E5FF]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span>{link.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00E5FF] shadow-[0_0_10px_rgba(0,229,255,0.8)]"
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
              <button
                className="flex items-center gap-2 py-1.5 px-3 rounded-lg bg-surface/60 hover:bg-surface border border-[rgba(0,229,255,0.15)] text-xs text-white uppercase font-bold tracking-wider transition-all"
              >
                <UserIcon className="w-3.5 h-3.5 text-[#00E5FF]" />
                <span className="max-w-[100px] truncate">{user.fullName}</span>
              </button>
              <div className="absolute right-0 mt-2 w-48 py-2 bg-[#131D33] border border-[rgba(0,229,255,0.15)] rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all z-50">
                <div className="px-4 py-2 border-b border-[rgba(0,229,255,0.1)] text-xs text-[#94A3B8]">
                  Signed in as <strong className="text-white block truncate">{user.email}</strong>
                </div>
                {user.role === 'ADMIN' && (
                  <a
                    href="http://localhost:5174"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full text-left px-4 py-2 text-xs text-[#00E5FF] hover:bg-navy-900 block font-medium"
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
                  isActive ? 'text-[#00E5FF]' : 'text-[#94A3B8] hover:text-[#00E5FF]'
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
            className="relative p-2 text-[#94A3B8] hover:text-[#00E5FF] transition-colors"
          >
            <ShoppingBag className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 bg-[#00E5FF] text-[#07101E] font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(0,229,255,0.6)]">
              {totalItems}
            </span>
          </motion.button>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-[#94A3B8] hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-[#07101E]/98 backdrop-blur-[20px] border-b border-[rgba(0,229,255,0.15)] px-6 py-4 space-y-3 overflow-hidden"
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-bold tracking-wider uppercase text-[#94A3B8] hover:text-[#00E5FF] py-2"
              >
                {link.name}
              </Link>
            ))}
            {!user ? (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-bold tracking-wider uppercase text-[#00E5FF] py-2 border-t border-[rgba(0,229,255,0.15)]"
              >
                LOGIN
              </Link>
            ) : (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left text-sm font-bold tracking-wider uppercase text-rose-400 py-2 border-t border-[rgba(0,229,255,0.15)]"
              >
                Sign Out ({user.fullName})
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

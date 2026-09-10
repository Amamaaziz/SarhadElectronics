import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingBag, User as UserIcon, Menu, X, Zap, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const { totalItems, setIsCartOpen } = useCart();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-navy-950/80 backdrop-blur-md border-b border-surface-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-neon to-magenta-purple flex items-center justify-center shadow-neon-cyan group-hover:scale-105 transition-transform duration-300">
            <Zap className="w-6 h-6 text-navy-950 fill-navy-950" />
          </div>
          <div>
            <div className="text-xl font-bold tracking-wider font-['Space_Grotesk'] text-white flex items-center gap-1">
              SARHAD <span className="text-cyan-neon font-black">ELECTRICS</span>
            </div>
            <p className="text-[10px] text-textMuted uppercase tracking-widest -mt-1 font-medium">Smart Tech & Industrial</p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `text-sm font-medium tracking-wide transition-all duration-200 relative py-1 ${
                  isActive
                    ? 'text-cyan-neon font-semibold after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-cyan-neon after:shadow-neon-cyan'
                    : 'text-textMuted hover:text-white'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* Right Action Icons */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* User Auth */}
          {user ? (
            <div className="relative group">
              <button className="flex items-center gap-2 py-1.5 px-3 rounded-lg bg-surface hover:bg-surface/80 border border-surface-border text-sm text-white transition-all">
                <UserIcon className="w-4 h-4 text-cyan-neon" />
                <span className="max-w-[100px] truncate hidden sm:inline">{user.fullName}</span>
              </button>
              <div className="absolute right-0 mt-2 w-48 py-2 bg-surface-card border border-surface-border rounded-xl shadow-glass opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all z-50">
                <div className="px-4 py-2 border-b border-surface-border text-xs text-textMuted">
                  Signed in as <strong className="text-white block truncate">{user.email}</strong>
                </div>
                {user.role === 'ADMIN' && (
                  <a
                    href="http://localhost:5174"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full text-left px-4 py-2 text-xs text-cyan-neon hover:bg-navy-900 block"
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
            <Link
              to="/login"
              className="flex items-center gap-1.5 text-sm font-medium text-textMuted hover:text-cyan-neon transition-colors"
            >
              <UserIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Login</span>
            </Link>
          )}

          {/* Cart Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            aria-label="Open Cart"
            className="relative p-2.5 rounded-xl bg-surface/60 hover:bg-surface border border-surface-border text-cyan-neon hover:shadow-neon-cyan transition-all"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-cyan-neon to-magenta-purple text-navy-950 font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center shadow-neon-cyan animate-pulse">
                {totalItems}
              </span>
            )}
          </button>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-textMuted hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-navy-900/95 backdrop-blur-xl border-b border-surface-border px-6 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-medium text-textMuted hover:text-cyan-neon py-2"
            >
              {link.name}
            </Link>
          ))}
          {!user ? (
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-semibold text-cyan-neon py-2 border-t border-surface-border"
            >
              Sign In / Register
            </Link>
          ) : (
            <button
              onClick={() => {
                logout();
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left text-base text-rose-400 py-2 border-t border-surface-border"
            >
              Sign Out ({user.fullName})
            </button>
          )}
        </div>
      )}
    </header>
  );
};


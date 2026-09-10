import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, MessageSquare, ExternalLink, Zap, LogOut } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

export const AdminSidebar: React.FC = () => {
  const { logout, adminUser } = useAdminAuth();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Manage Products', path: '/products', icon: Package },
    { name: 'Orders & Fulfillment', path: '/orders', icon: ShoppingCart },
    { name: 'Inquiries & Messages', path: '/messages', icon: MessageSquare },
  ];

  return (
    <aside className="w-64 bg-navy-950 border-r border-surface-border flex flex-col justify-between shrink-0 min-h-screen">
      <div>
        {/* Brand header */}
        <div className="h-20 px-6 flex items-center gap-3 border-b border-surface-border">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-neon to-magenta-purple flex items-center justify-center shadow-neon-cyan">
            <Zap className="w-5 h-5 text-navy-950 fill-navy-950" />
          </div>
          <div>
            <div className="text-sm font-bold tracking-wider font-['Space_Grotesk'] text-white">
              SARHAD <span className="text-cyan-neon">CONTROL</span>
            </div>
            <p className="text-[10px] text-textMuted uppercase tracking-wider">Admin Console</p>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'bg-cyan-neon/15 text-cyan-neon border border-cyan-neon/30 shadow-neon-cyan/50'
                      : 'text-textMuted hover:text-white hover:bg-surface/50'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer info & Logout */}
      <div className="p-4 border-t border-surface-border space-y-3">
        <a
          href="http://localhost:5173"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between px-3 py-2 rounded-lg bg-surface/30 hover:bg-surface border border-surface-border text-xs text-textMuted hover:text-cyan-neon transition-colors"
        >
          <span>Customer Storefront</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        <div className="px-3 py-2 text-xs text-textMuted flex items-center justify-between">
          <div className="truncate mr-2">
            <span className="block font-medium text-white truncate">{adminUser?.fullName || 'Administrator'}</span>
            <span className="text-[10px] text-textMuted truncate">{adminUser?.email}</span>
          </div>
          <button
            onClick={logout}
            title="Logout"
            className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 hover:text-rose-300"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};


import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Mail, Globe, LogOut } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

export const AdminSidebar: React.FC = () => {
  const { logout } = useAdminAuth();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Products', path: '/products', icon: Package },
    { name: 'Orders', path: '/orders', icon: ShoppingCart },
    { name: 'Messages', path: '/messages', icon: Mail },
  ];

  return (
    <aside className="w-64 bg-ink flex flex-col justify-between shrink-0 min-h-screen">
      <div>
        <div className="h-20 px-7 flex items-center">
          <span className="text-white text-lg font-bold tracking-wide">
            ADMIN HUB
          </span>
        </div>

        <nav className="px-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    isActive
                      ? 'bg-white/10 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <Icon className="w-[18px] h-[18px]" strokeWidth={1.8} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}

          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <Globe className="w-[18px] h-[18px]" strokeWidth={1.8} />
            <span>View Site</span>
          </a>
        </nav>
      </div>

      <div className="p-4">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-rose-400 hover:bg-rose-400/10 transition-colors w-full"
        >
          <LogOut className="w-[18px] h-[18px]" strokeWidth={1.8} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
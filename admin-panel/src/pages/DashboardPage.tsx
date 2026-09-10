import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, ShoppingCart, Package, MessageSquare, ArrowUpRight, Clock, Plus } from 'lucide-react';
import { getAdminProducts, getAdminOrders, getAdminMessages } from '../services/adminApi';
import { AdminProduct, AdminOrder, AdminContactMessage } from '../types';

export const DashboardPage: React.FC = () => {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [messages, setMessages] = useState<AdminContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAdminProducts(), getAdminOrders(), getAdminMessages()]).then(
      ([prods, ords, msgs]) => {
        setProducts(prods);
        setOrders(ords);
        setMessages(msgs);
        setLoading(false);
      }
    );
  }, []);

  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);
  const pendingOrders = orders.filter((o) => o.status === 'PENDING' || o.status === 'PROCESSING');

  const stats = [
    {
      title: 'Gross Platform Sales',
      value: `$${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      subtitle: '+18.4% vs last cycle',
      icon: DollarSign,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
    },
    {
      title: 'Active Orders',
      value: orders.length.toString(),
      subtitle: `${pendingOrders.length} requiring dispatch`,
      icon: ShoppingCart,
      color: 'text-cyan-neon',
      bg: 'bg-cyan-neon/10',
      border: 'border-cyan-neon/20',
    },
    {
      title: 'Catalog Hardware',
      value: products.length.toString(),
      subtitle: 'Across 4 core categories',
      icon: Package,
      color: 'text-magenta-purple',
      bg: 'bg-magenta-purple/10',
      border: 'border-magenta-purple/20',
    },
    {
      title: 'Customer Inquiries',
      value: messages.length.toString(),
      subtitle: 'From showroom & contact',
      icon: MessageSquare,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
    },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-surface-card border border-surface-border space-y-4 shadow-glass"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-textMuted uppercase tracking-wider">
                  {s.title}
                </span>
                <div className={`p-2.5 rounded-xl ${s.bg} ${s.color} border ${s.border}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-3xl font-black font-['Space_Grotesk'] text-white">
                  {s.value}
                </div>
                <div className="text-xs text-textMuted mt-1">{s.subtitle}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column Layout: Recent Orders & Catalog Quick Action */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders Table */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-surface-card border border-surface-border space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold font-['Space_Grotesk'] text-white">
                Recent Orders & Fulfillment
              </h3>
              <p className="text-xs text-textMuted">Orders placed across Peshawar & online storefront</p>
            </div>
            <Link
              to="/orders"
              className="text-xs font-semibold text-cyan-neon hover:underline flex items-center gap-1"
            >
              View All <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-navy-900/60 uppercase text-textMuted font-semibold border-b border-surface-border">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border/50">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-surface/30">
                    <td className="py-3.5 px-4 font-mono font-semibold text-cyan-neon">
                      {order.id}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-white">
                      ${Number(order.totalAmount).toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-surface border border-surface-border text-[11px]">
                        {order.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          order.status === 'DELIVERED'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : order.status === 'PROCESSING'
                            ? 'bg-cyan-neon/10 text-cyan-neon border border-cyan-neon/30'
                            : order.status === 'SHIPPED'
                            ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-textMuted">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Catalog Highlights & Quick Add */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-3xl bg-surface-card border border-surface-border space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-['Space_Grotesk'] text-white">
                Hardware Catalog
              </h3>
              <Link
                to="/products"
                className="p-1.5 rounded-lg bg-cyan-neon/10 text-cyan-neon hover:bg-cyan-neon hover:text-navy-950 transition-all"
              >
                <Plus className="w-4 h-4" />
              </Link>
            </div>
            <p className="text-xs text-textMuted leading-relaxed">
              Manage inventory levels, price overrides, and Cloudinary product photography.
            </p>

            <div className="space-y-3 pt-2">
              {products.slice(0, 4).map((prod) => (
                <div
                  key={prod.id}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-surface/30 border border-surface-border"
                >
                  <img
                    src={prod.imageUrl}
                    alt={prod.name}
                    className="w-10 h-10 object-cover rounded-lg bg-navy-900"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-semibold text-white truncate">{prod.name}</h5>
                    <span className="text-[11px] text-cyan-neon font-bold">
                      ${Number(prod.price).toFixed(2)}
                    </span>
                  </div>
                  <span className="text-[11px] text-textMuted px-2 py-0.5 rounded bg-surface">
                    {prod.stock} left
                  </span>
                </div>
              ))}
            </div>

            <Link
              to="/products"
              className="block w-full text-center py-2.5 rounded-xl bg-surface hover:bg-surface/80 border border-surface-border text-xs font-semibold text-white transition-colors"
            >
              Open Inventory Manager
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};


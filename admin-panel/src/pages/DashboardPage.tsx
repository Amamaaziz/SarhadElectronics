import React, { useEffect, useState } from 'react';
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
  // Distinct customers by userId, falling back to shipping address when userId is absent
  const customerCount = new Set(orders.map((o) => o.userId || o.shippingAddress)).size;

  const stats = [
    {
      label: 'Total Revenue',
      value: `Rs.${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
    },
    {
      label: 'Orders',
      value: orders.length.toString(),
    },
    {
      label: 'Products',
      value: products.length.toString(),
    },
    {
      label: 'Customers',
      value: customerCount.toString(),
    },
  ];

  return (
    <div className="px-10 pb-10 pt-6 space-y-8">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s) => (
          <div
            key={s.label}
            className="p-6 rounded-card bg-card border border-line shadow-card"
          >
            <div className="text-xs font-semibold text-muted tracking-wide">
              {s.label.toUpperCase()}
            </div>
            <div className="text-3xl font-bold text-body mt-3">
              {loading ? '—' : s.value}
            </div>
          </div>
        ))}
      </div>

      {/* Latest Orders */}
      <div className="rounded-card bg-card border border-line shadow-card overflow-hidden">
        <div className="px-7 pt-6 pb-4">
          <h3 className="text-lg font-bold text-body">Latest Orders</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-y border-line text-body">
                <th className="py-3 px-7 font-semibold">ID</th>
                <th className="py-3 px-7 font-semibold">Shipping To</th>
                <th className="py-3 px-7 font-semibold">Amount</th>
                <th className="py-3 px-7 font-semibold">Status</th>
                <th className="py-3 px-7 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id}>
                  <td className="py-4 px-7 text-body">#{order.id.replace(/\D/g, '') || order.id}</td>
                  <td className="py-4 px-7 text-body max-w-[220px] truncate">
                    {order.shippingAddress}
                  </td>
                  <td className="py-4 px-7 text-body">Rs.{Number(order.totalAmount).toFixed(2)}</td>
                  <td className="py-4 px-7">
                    <span className="px-3 py-1 rounded-full bg-ink text-white text-xs">
                      {order.status.toLowerCase()}
                    </span>
                  </td>
                  <td className="py-4 px-7 text-muted">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>
                </tr>
              ))}
              {!loading && orders.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 px-7 text-center text-muted">
                    No orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
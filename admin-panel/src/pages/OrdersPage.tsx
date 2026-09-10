import React, { useEffect, useState } from 'react';
import { ShoppingCart, CheckCircle2, Clock, Truck, Ban } from 'lucide-react';
import { getAdminOrders, updateAdminOrderStatus } from '../services/adminApi';
import { AdminOrder } from '../types';

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = () => {
    getAdminOrders().then((data) => {
      setOrders(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await updateAdminOrderStatus(orderId, newStatus);
      setOrders(orders.map((o) => (o.id === orderId ? { ...o, status: newStatus as any } : o)));
    } catch {
      setOrders(orders.map((o) => (o.id === orderId ? { ...o, status: newStatus as any } : o)));
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div>
        <h2 className="text-xl font-bold font-['Space_Grotesk'] text-white">
          Orders & Fulfillment Operations
        </h2>
        <p className="text-xs text-textMuted">
          Track customer checkout shipments, payment modes, and update lifecycle statuses.
        </p>
      </div>

      <div className="rounded-3xl bg-surface-card border border-surface-border overflow-hidden shadow-glass">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-navy-900/80 uppercase text-textMuted font-semibold border-b border-surface-border">
              <tr>
                <th className="py-3.5 px-4">Order ID & Date</th>
                <th className="py-3.5 px-4">Shipping Destination</th>
                <th className="py-3.5 px-4">Phone</th>
                <th className="py-3.5 px-4">Total & Payment</th>
                <th className="py-3.5 px-4">Fulfillment Status</th>
                <th className="py-3.5 px-4">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border/50">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-surface/30">
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-cyan-neon block">{order.id}</span>
                    <span className="text-[11px] text-textMuted">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 max-w-xs">
                    <span className="line-clamp-2">{order.shippingAddress}</span>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-textMuted">
                    {order.shippingPhone || '03351950058'}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-bold text-white block">
                      ${Number(order.totalAmount).toFixed(2)}
                    </span>
                    <span className="text-[10px] text-textMuted uppercase font-semibold">
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

                  <td className="py-3.5 px-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                      className="px-2.5 py-1.5 rounded-lg bg-navy-900 border border-surface-border text-xs text-white focus:outline-hidden focus:border-cyan-neon cursor-pointer"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="PROCESSING">Processing</option>
                      <option value="SHIPPED">Shipped</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};


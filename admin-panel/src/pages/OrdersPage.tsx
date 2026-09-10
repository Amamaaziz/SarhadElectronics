import React, { useEffect, useState } from 'react';
import { getAdminOrders, updateAdminOrderStatus } from '../services/adminApi';
import { AdminOrder } from '../types';

const statusStyles: Record<string, string> = {
  DELIVERED: 'bg-emerald-50 text-emerald-700',
  PROCESSING: 'bg-slate-100 text-slate-700',
  SHIPPED: 'bg-indigo-50 text-indigo-700',
  PENDING: 'bg-amber-50 text-amber-700',
  CANCELLED: 'bg-rose-50 text-rose-600',
};

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
    } catch {
      // fall through to local update regardless
    }
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus as any } : o)));
  };

  return (
    <div className="px-10 pb-10 pt-6 space-y-6">
      <div className="rounded-card bg-card border border-line shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line text-muted text-xs font-semibold tracking-wide">
                <th className="py-3.5 px-7">Order ID & Date</th>
                <th className="py-3.5 px-7">Shipping Destination</th>
                <th className="py-3.5 px-7">Phone</th>
                <th className="py-3.5 px-7">Total & Payment</th>
                <th className="py-3.5 px-7">Fulfillment Status</th>
                <th className="py-3.5 px-7">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-page/60">
                  <td className="py-3.5 px-7">
                    <span className="font-semibold text-body block">{order.id}</span>
                    <span className="text-xs text-muted">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </td>

                  <td className="py-3.5 px-7 max-w-xs text-body">
                    <span className="line-clamp-2">{order.shippingAddress}</span>
                  </td>

                  <td className="py-3.5 px-7 text-muted">
                    {order.shippingPhone || '—'}
                  </td>

                  <td className="py-3.5 px-7">
                    <span className="font-semibold text-body block">
                      Rs.{Number(order.totalAmount).toFixed(2)}
                    </span>
                    <span className="text-xs text-muted uppercase">
                      {order.paymentMethod}
                    </span>
                  </td>

                  <td className="py-3.5 px-7">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        statusStyles[order.status] || 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-7">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                      className="px-2.5 py-1.5 rounded-lg bg-page border border-line text-sm text-body focus:outline-hidden focus:border-body cursor-pointer"
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
              {!loading && orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 px-7 text-center text-muted">
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
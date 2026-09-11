import React, { useEffect, useState } from 'react';
import { RefreshCw, Package, Phone, Mail, MapPin, CheckCircle, Clock, Truck, AlertCircle, XCircle, Trash2 } from 'lucide-react';
import { getAdminOrders, updateAdminOrderStatus, deleteAdminOrder } from '../services/adminApi';
import { AdminOrder } from '../types';

const statusConfig: Record<string, { label: string; style: string; icon: any }> = {
  PENDING: { label: 'Pending', style: 'bg-amber-500/10 text-amber-600 border-amber-200', icon: Clock },
  PROCESSING: { label: 'Processing', style: 'bg-sky-500/10 text-sky-600 border-sky-200', icon: Package },
  SHIPPED: { label: 'Shipped', style: 'bg-indigo-500/10 text-indigo-600 border-indigo-200', icon: Truck },
  DELIVERED: { label: 'Delivered', style: 'bg-emerald-500/10 text-emerald-600 border-emerald-200', icon: CheckCircle },
  CANCELLED: { label: 'Cancelled', style: 'bg-rose-500/10 text-rose-600 border-rose-200', icon: XCircle },
};

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await getAdminOrders();
      setOrders(data);
    } catch {
      // Keep existing orders
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await updateAdminOrderStatus(orderId, newStatus);
    } catch {
      // fall through to optimistic state
    }
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus as any } : o)));
  };

  const handleDeleteOrder = async (orderId: string, orderDisplayCode: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete order ${orderDisplayCode}? This action cannot be undone.`)) {
      return;
    }

    setDeletingId(orderId);
    try {
      await deleteAdminOrder(orderId);
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
    } catch {
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
    } finally {
      setDeletingId(null);
    }
  };

  const filteredOrders = filterStatus === 'ALL'
    ? orders
    : orders.filter((o) => o.status === filterStatus);

  const pendingCount = orders.filter((o) => o.status === 'PENDING').length;

  return (
    <div className="px-6 md:px-10 pb-10 pt-6 space-y-6">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-5 rounded-2xl border border-line shadow-card">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-heading">Customer Orders</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-page border border-line text-body">
              {orders.length} Total
            </span>
            {pendingCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 border border-amber-200">
                {pendingCount} Action Needed
              </span>
            )}
          </div>
          <p className="text-xs text-muted mt-1">
            Real-time live orders placed by customers from the storefront website.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 text-xs font-medium rounded-xl bg-page border border-line text-body focus:outline-hidden focus:border-body cursor-pointer"
          >
            <option value="ALL">All Statuses ({orders.length})</option>
            <option value="PENDING">Pending</option>
            <option value="PROCESSING">Processing</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          <button
            onClick={loadOrders}
            disabled={loading}
            className="px-3.5 py-2 text-xs font-medium rounded-xl bg-body text-card hover:bg-heading transition-all flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl bg-card border border-line shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line bg-page/40 text-muted text-xs font-semibold tracking-wide">
                <th className="py-3.5 px-6">Order ID & Date</th>
                <th className="py-3.5 px-6">Customer & Phone</th>
                <th className="py-3.5 px-6">Delivery Address</th>
                <th className="py-3.5 px-6">Purchased Items</th>
                <th className="py-3.5 px-6">Total & Payment</th>
                <th className="py-3.5 px-6">Status & Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-4 px-6"><div className="h-4 w-20 bg-page rounded mb-1" /><div className="h-3 w-28 bg-page rounded" /></td>
                    <td className="py-4 px-6"><div className="h-4 w-28 bg-page rounded mb-1" /><div className="h-3 w-20 bg-page rounded" /></td>
                    <td className="py-4 px-6"><div className="h-4 w-40 bg-page rounded" /></td>
                    <td className="py-4 px-6"><div className="h-8 w-36 bg-page rounded-lg" /></td>
                    <td className="py-4 px-6"><div className="h-4 w-20 bg-page rounded mb-1" /><div className="h-3 w-12 bg-page rounded" /></td>
                    <td className="py-4 px-6"><div className="h-6 w-24 bg-page rounded-full mb-1" /><div className="h-7 w-24 bg-page rounded-lg" /></td>
                  </tr>
                ))
              ) : (
                filteredOrders.map((order) => {
                  const conf = statusConfig[order.status] || {
                    label: order.status || 'PENDING',
                    style: 'bg-slate-100 text-slate-700 border-slate-200',
                    icon: AlertCircle,
                  };
                  const StatusIcon = conf.icon;

                  return (
                    <tr key={order.id} className="hover:bg-page/40 transition-colors">
                      {/* Order ID & Date */}
                      <td className="py-4 px-6 align-top">
                        <span className="font-mono text-xs font-bold text-heading block">
                          {order.id.startsWith('ord-') || order.id.length < 15
                            ? order.id
                            : `#${order.id.slice(-8).toUpperCase()}`}
                        </span>
                        <span className="text-[11px] text-muted block mt-0.5">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : '—'}
                        </span>
                      </td>

                    {/* Customer */}
                    <td className="py-4 px-6 align-top text-xs space-y-1">
                      <div className="font-semibold text-body">
                        {order.user?.fullName || 'Walk-in / Guest Customer'}
                      </div>
                      <div className="flex items-center gap-1.5 text-muted">
                        <Phone className="w-3 h-3 text-muted shrink-0" />
                        <span>{order.shippingPhone || '—'}</span>
                      </div>
                      {order.user?.email && (
                        <div className="flex items-center gap-1.5 text-muted text-[11px]">
                          <Mail className="w-3 h-3 text-muted shrink-0" />
                          <span className="truncate max-w-[140px]">{order.user.email}</span>
                        </div>
                      )}
                    </td>

                    {/* Address */}
                    <td className="py-4 px-6 align-top max-w-xs text-xs">
                      <div className="flex items-start gap-1.5 text-body">
                        <MapPin className="w-3.5 h-3.5 text-muted shrink-0 mt-0.5" />
                        <span className="line-clamp-3 leading-relaxed">{order.shippingAddress}</span>
                      </div>
                    </td>

                    {/* Purchased Items */}
                    <td className="py-4 px-6 align-top text-xs">
                      {order.orderItems && order.orderItems.length > 0 ? (
                        <div className="space-y-1.5">
                          {order.orderItems.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between gap-3 p-1.5 rounded-lg bg-page/60 border border-line text-xs"
                            >
                              <span className="font-medium text-body truncate max-w-[160px]">
                                {item.product?.name || `Product ID: ${item.productId.slice(-6)}`}
                              </span>
                              <span className="font-mono text-muted text-[11px] shrink-0">
                                ×{item.quantity} (Rs.{Number(item.priceAtPurchase).toFixed(0)})
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted italic">Order items logged</span>
                      )}
                    </td>

                    {/* Total & Payment */}
                    <td className="py-4 px-6 align-top">
                      <span className="font-bold text-heading text-sm block">
                        Rs.{Number(order.totalAmount).toLocaleString()}
                      </span>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-page border border-line text-muted uppercase">
                        {order.paymentMethod || 'COD'}
                      </span>
                    </td>

                    {/* Status selector & Delete button */}
                    <td className="py-4 px-6 align-top space-y-2">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${conf.style}`}>
                        <StatusIcon className="w-3 h-3 shrink-0" />
                        <span>{conf.label}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                          className="flex-1 min-w-[105px] px-2.5 py-1.5 rounded-lg bg-page border border-line text-xs text-body focus:outline-hidden focus:border-body cursor-pointer transition-all"
                        >
                          <option value="PENDING">Pending</option>
                          <option value="PROCESSING">Processing</option>
                          <option value="SHIPPED">Shipped</option>
                          <option value="DELIVERED">Delivered</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>

                        <button
                          type="button"
                          disabled={deletingId === order.id}
                          onClick={() => {
                            const displayCode = order.id.startsWith('ord-') || order.id.length < 15
                              ? order.id
                              : `#${order.id.slice(-8).toUpperCase()}`;
                            handleDeleteOrder(order.id, displayCode);
                          }}
                          title="Permanently Delete Order"
                          className="p-2 rounded-lg text-muted hover:text-rose-600 hover:bg-rose-50 border border-line/60 hover:border-rose-200 transition-all cursor-pointer disabled:opacity-50 shrink-0"
                        >
                          <Trash2 className={`w-3.5 h-3.5 ${deletingId === order.id ? 'animate-spin' : ''}`} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              }))}

              {!loading && filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-14 px-6 text-center">
                    <Package className="w-10 h-10 text-muted mx-auto mb-2 opacity-40" />
                    <p className="text-sm font-semibold text-body">No orders found</p>
                    <p className="text-xs text-muted mt-1">
                      {filterStatus !== 'ALL'
                        ? `No orders matching status "${filterStatus}".`
                        : 'New orders placed on the public website will appear here in real-time.'}
                    </p>
                    <button
                      onClick={loadOrders}
                      className="mt-4 px-4 py-2 rounded-xl text-xs font-medium bg-page border border-line hover:bg-card text-body transition-colors"
                    >
                      Refresh Orders List
                    </button>
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
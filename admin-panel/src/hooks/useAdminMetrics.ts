import { useState, useEffect } from 'react';
import { getAdminOrders, getAdminProducts, getAdminMessages } from '../services/adminApi';

export function useAdminMetrics() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    productsCount: 0,
    ordersCount: 0,
    messagesCount: 0,
    grossRevenue: 0,
  });

  useEffect(() => {
    Promise.all([getAdminProducts(), getAdminOrders(), getAdminMessages()])
      .then(([prods, ords, msgs]) => {
        const grossRevenue = ords.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);
        setMetrics({
          productsCount: prods.length,
          ordersCount: ords.length,
          messagesCount: msgs.length,
          grossRevenue,
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return { metrics, loading };
}

export default useAdminMetrics;


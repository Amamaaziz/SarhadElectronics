import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import { AdminSidebar } from './components/AdminSidebar';
import { AdminHeader } from './components/AdminHeader';
import { DashboardPage } from './pages/DashboardPage';
import { ManageProductsPage } from './pages/ManageProductsPage';
import { OrdersPage } from './pages/OrdersPage';
import { MessagesPage } from './pages/MessagesPage';
import { AdminLoginPage } from './pages/AdminLoginPage';

const AdminLayout: React.FC<{ children: React.ReactNode; title: string; subtitle?: string }> = ({
  children,
  title,
  subtitle,
}) => {
  const { isAdminAuthenticated } = useAdminAuth();

  if (!isAdminAuthenticated) {
    return <AdminLoginPage />;
  }

  return (
    <div className="flex min-h-screen bg-navy-950 text-white">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-x-hidden">
        <AdminHeader title={title} subtitle={subtitle} />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <Routes>
          <Route
            path="/"
            element={
              <AdminLayout title="Operational Command" subtitle="Executive KPI overview & telemetry">
                <DashboardPage />
              </AdminLayout>
            }
          />
          <Route
            path="/products"
            element={
              <AdminLayout title="Hardware Inventory" subtitle="Manage electronics, appliances, and tools">
                <ManageProductsPage />
              </AdminLayout>
            }
          />
          <Route
            path="/orders"
            element={
              <AdminLayout title="Order Processing" subtitle="Customer orders and dispatch tracking">
                <OrdersPage />
              </AdminLayout>
            }
          />
          <Route
            path="/messages"
            element={
              <AdminLayout title="Communications" subtitle="Customer contact inquiries & bulk requests">
                <MessagesPage />
              </AdminLayout>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AdminAuthProvider>
    </BrowserRouter>
  );
};

export default App;


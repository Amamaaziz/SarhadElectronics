import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { ScrollProgress } from './components/ScrollProgress';
import { BackToTop } from './components/BackToTop';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen flex flex-col bg-navy-950 text-white selection:bg-cyan-neon selection:text-navy-950 relative overflow-hidden cyber-grid-bg">
            {/* Top Glowing Scroll Progress Bar */}
            <ScrollProgress />

            {/* Ambient Background Glow Lights */}
            <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-[#0B6CCF]/15 rounded-full blur-[150px] pointer-events-none -z-10 animate-pulse-glow" />
            <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-[#0E1E3E]/70 rounded-full blur-[150px] pointer-events-none -z-10 animate-pulse-glow [animation-delay:2s]" />
            <div className="fixed top-1/2 right-10 w-[500px] h-[500px] bg-[#0B6CCF]/10 rounded-full blur-[180px] pointer-events-none -z-10" />

            <Navbar />
            <main className="flex-1 relative z-10 pt-20">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
              </Routes>
            </main>
            <Footer />
            <CartDrawer />
            <BackToTop />
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;

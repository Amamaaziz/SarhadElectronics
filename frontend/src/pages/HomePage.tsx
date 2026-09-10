import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Shield, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { fetchProductsApi } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { TrustMetrics } from '../components/TrustMetrics';
import { BrandMarquee } from '../components/BrandMarquee';
import { PromoBanner } from '../components/PromoBanner';
import { NewsletterSection } from '../components/NewsletterSection';
import { useCart } from '../context/CartContext';

export const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProductsApi()
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const heroFeatured = products.find((p) => p.name.includes('Aura')) || products[0];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-20 lg:pt-16 lg:pb-28">
        {/* Glow backdrop effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-hero-glow rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface/70 border border-cyan-neon/30 text-cyan-neon text-xs font-semibold uppercase tracking-wider backdrop-blur-md shadow-neon-cyan">
                <Sparkles className="w-3.5 h-3.5" />
                Next-Gen Electrical & Smart Engineering
              </div>

              <h1 className="text-4xl sm:text-6xl font-extrabold font-['Space_Grotesk'] tracking-tight text-white leading-[1.1]">
                Power Your Future With{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-neon via-cyan-hover to-magenta-purple">
                  Precision Hardware
                </span>
              </h1>

              <p className="text-base sm:text-lg text-textMuted max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Discover flagship smart gadgets, energy-efficient home appliances,
                and industrial-grade electrical tools crafted for durability, performance, and seamless automation.
              </p>

              {/* Call To Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/shop"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-cyan-neon text-navy-950 font-bold text-sm tracking-wider uppercase font-['Space_Grotesk'] hover:shadow-neon-cyan-lg hover:scale-105 transition-all flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4 fill-navy-950" />
                  Shop Now
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/about"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-surface/60 hover:bg-surface border border-surface-border hover:border-cyan-neon text-white font-medium text-sm transition-all text-center"
                >
                  Our Mission & Story
                </Link>
              </div>

              {/* Fast trust highlights */}
              <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs text-textMuted">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-cyan-neon" />
                  <span>Official Brand Warranty</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-magenta-neon" />
                  <span>Same-Day Dispatch in Peshawar</span>
                </div>
              </div>
            </div>

            {/* Right Hero Product Showcase (Aura Noise Cancelling Pro) */}
            <div className="lg:col-span-5 flex justify-center">
              {heroFeatured ? (
                <div className="relative w-full max-w-md group">
                  {/* Subtle pulsing cyber halo */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-cyan-neon/30 to-magenta-purple/30 rounded-3xl blur-2xl group-hover:blur-3xl transition-all opacity-80" />

                  <div className="relative rounded-3xl bg-surface-card border border-cyan-neon/30 p-6 overflow-hidden shadow-2xl backdrop-blur-xl">
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 text-xs font-bold rounded-lg bg-cyan-neon/10 text-cyan-neon border border-cyan-neon/30 font-['Space_Grotesk'] uppercase">
                        Spotlight Featured
                      </span>
                      <span className="text-xs text-textMuted font-mono">
                        Model: {heroFeatured.slug || 'SE-2026'}
                      </span>
                    </div>

                    <div className="aspect-4/3 w-full bg-navy-950/60 rounded-2xl overflow-hidden flex items-center justify-center p-4 relative">
                      <img
                        src={heroFeatured.imageUrl}
                        alt={heroFeatured.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    <div className="mt-6 space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold font-['Space_Grotesk'] text-white">
                          {heroFeatured.name}
                        </h3>
                        <span className="text-2xl font-black font-['Space_Grotesk'] text-cyan-neon">
                          ${Number(heroFeatured.price).toFixed(2)}
                        </span>
                      </div>
                      <p className="text-xs text-textMuted line-clamp-2">
                        {heroFeatured.description}
                      </p>

                      <div className="pt-4 flex items-center gap-3">
                        <button
                          onClick={() => addToCart(heroFeatured)}
                          className="flex-1 py-3 rounded-xl bg-cyan-neon text-navy-950 font-bold text-xs uppercase tracking-wider font-['Space_Grotesk'] hover:shadow-neon-cyan transition-all"
                        >
                          Add to Cart
                        </button>
                        <Link
                          to={`/product/${heroFeatured.id}`}
                          className="px-4 py-3 rounded-xl bg-surface hover:bg-surface/80 border border-surface-border text-xs text-white"
                        >
                          Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Metrics Display */}
      <TrustMetrics />

      {/* Scrolling Brand Marquee */}
      <BrandMarquee />

      {/* Curated "New Arrivals" Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest text-cyan-neon uppercase font-['Space_Grotesk'] mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Curated Catalog
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-['Space_Grotesk'] text-white">
              New Arrivals & Best Sellers
            </h2>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-neon hover:text-white transition-colors"
          >
            <span>Explore All Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-80 rounded-2xl bg-surface/30 animate-pulse border border-surface-border" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Promotional Banner */}
      <PromoBanner />

      {/* Newsletter Section */}
      <NewsletterSection />
    </div>
  );
};


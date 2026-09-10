import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Sparkles, Volume2 } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Product } from '../types';
import { fetchProductsApi } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { BrandMarquee } from '../components/BrandMarquee';
import { PromoBanner } from '../components/PromoBanner';
import { NewsletterSection } from '../components/NewsletterSection';
import { useCart } from '../context/CartContext';

export const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  // Parallax transforms for hero ambient layers
  const heroGlowY = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const heroGlowOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.2]);
  const heroContentY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);

  useEffect(() => {
    fetchProductsApi()
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const heroFeatured = products.find((p) => p.name.includes('Aura')) || products[0];

  const heroVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
  };

  return (
    <div className="space-y-12">
      {/* Hero Section with Parallax */}
      <section ref={heroRef} className="relative overflow-hidden pt-8 pb-20 lg:pt-16 lg:pb-28">
        {/* Parallax Glow backdrop effects */}
        <motion.div
          style={{ y: heroGlowY, opacity: heroGlowOpacity }}
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-hero-glow rounded-full blur-3xl pointer-events-none animate-pulse-glow"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div style={{ y: heroContentY }} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Copy */}
            <motion.div
              variants={heroVariants}
              initial="hidden"
              animate="visible"
              className="lg:col-span-7 space-y-6 text-center lg:text-left"
            >
              <motion.div variants={itemVariants}>
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface/70 border border-cyan-neon/30 text-cyan-neon text-xs font-semibold uppercase tracking-wider backdrop-blur-md shadow-neon-cyan">
                  <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
                  Premium Selection 2026
                </span>
              </motion.div>

              <motion.h1
                variants={itemVariants}
                className="text-4xl sm:text-6xl font-extrabold font-['Space_Grotesk'] tracking-tight text-white leading-[1.1]"
              >
                Power Your Future With{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-neon via-cyan-hover to-magenta-purple drop-shadow-[0_0_15px_rgba(0,229,255,0.4)]">
                  Precision Hardware
                </span>
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="text-base sm:text-lg text-textMuted max-w-2xl mx-auto lg:mx-0 leading-relaxed"
              >
                Discover flagship smart gadgets, energy-efficient home appliances,
                and industrial-grade electrical tools crafted for durability, performance, and seamless automation.
              </motion.p>

              {/* Call To Actions */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/shop"
                    className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-cyan-neon text-navy-950 font-bold text-sm tracking-wider uppercase font-['Space_Grotesk'] shadow-neon-cyan-lg hover:shadow-neon-cyan transition-all flex items-center justify-center gap-2 btn-shine"
                  >
                    <Zap className="w-4 h-4 fill-navy-950" />
                    Shop Now
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/shop"
                    className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-transparent hover:bg-surface/40 text-textMuted hover:text-white font-bold text-xs tracking-widest uppercase font-['Space_Grotesk'] transition-all text-center block"
                  >
                    View Deals
                  </Link>
                </motion.div>
              </motion.div>

              {/* Fast trust stats row */}
              <motion.div
                variants={itemVariants}
                className="pt-6 flex items-center justify-center lg:justify-start gap-8 sm:gap-10"
              >
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold font-['Space_Grotesk'] text-white">
                    50k+
                  </div>
                  <div className="text-[11px] text-textMuted uppercase tracking-wider mt-0.5">
                    Products Sold
                  </div>
                </div>
                <div className="h-10 w-px bg-surface-border hidden sm:block" />
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold font-['Space_Grotesk'] text-white">
                    4.9/5
                  </div>
                  <div className="text-[11px] text-textMuted uppercase tracking-wider mt-0.5">
                    User Rating
                  </div>
                </div>
                <div className="h-10 w-px bg-surface-border hidden sm:block" />
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold font-['Space_Grotesk'] text-white">
                    24/7
                  </div>
                  <div className="text-[11px] text-textMuted uppercase tracking-wider mt-0.5">
                    Tech Support
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Hero Product Showcase with Floating Levitation */}
            <div className="lg:col-span-5 flex justify-center">
              {heroFeatured ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="relative w-full max-w-md group"
                >
                  {/* Rotating Neon Aura Ring */}
                  <div className="absolute -inset-1.5 bg-gradient-to-tr from-cyan-neon via-magenta-purple to-cyan-neon rounded-3xl opacity-30 blur-xl group-hover:opacity-60 transition duration-700 animate-spin-slow" />

                  <div className="relative rounded-3xl bg-surface-card/90 border border-cyan-neon/30 p-6 overflow-hidden shadow-2xl backdrop-blur-2xl">
                    {/* Top Row: Spotlight Pill & Equalizer Soundwave */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 text-xs font-bold rounded-lg bg-cyan-neon/15 text-cyan-neon border border-cyan-neon/30 font-['Space_Grotesk'] uppercase flex items-center gap-1.5 shadow-neon-cyan">
                        <span className="w-2 h-2 rounded-full bg-cyan-neon animate-ping" />
                        Spotlight Featured
                      </span>

                      {/* Equalizer audio animation */}
                      <div className="flex items-end gap-1 px-2.5 py-1 rounded-lg bg-navy-900 border border-surface-border">
                        <Volume2 className="w-3.5 h-3.5 text-cyan-neon mr-1" />
                        <span className="w-0.5 bg-cyan-neon rounded-full animate-soundwave-1" />
                        <span className="w-0.5 bg-cyan-neon rounded-full animate-soundwave-2" />
                        <span className="w-0.5 bg-magenta-neon rounded-full animate-soundwave-3" />
                        <span className="w-0.5 bg-cyan-neon rounded-full animate-soundwave-4" />
                      </div>
                    </div>

                    {/* Floating Product Image Container */}
                    <div className="aspect-4/3 w-full bg-navy-950/60 rounded-2xl overflow-hidden flex items-center justify-center p-4 relative animate-float-slow">
                      <img
                        src={heroFeatured.imageUrl}
                        alt={heroFeatured.name}
                        className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-500 drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)]"
                      />
                    </div>

                    <div className="mt-6 space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold font-['Space_Grotesk'] text-white">
                          {heroFeatured.name}
                        </h3>
                        <span className="text-2xl font-black font-['Space_Grotesk'] text-cyan-neon drop-shadow-[0_0_8px_rgba(0,229,255,0.4)]">
                          Rs.{Number(heroFeatured.price).toFixed(2)}
                        </span>
                      </div>
                      <p className="text-xs text-textMuted line-clamp-2">
                        {heroFeatured.description}
                      </p>

                      <div className="pt-4 flex items-center gap-3">
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => addToCart(heroFeatured)}
                          className="flex-1 py-3.5 rounded-xl bg-cyan-neon text-navy-950 font-bold text-xs uppercase tracking-wider font-['Space_Grotesk'] shadow-neon-cyan hover:shadow-neon-cyan-lg transition-all btn-shine"
                        >
                          Add to Cart
                        </motion.button>
                        <Link
                          to={`/product/${heroFeatured.id}`}
                          className="px-5 py-3.5 rounded-xl bg-surface hover:bg-surface/80 border border-surface-border text-xs text-white transition-colors"
                        >
                          Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </div>
          </motion.div>
        </div>

        {/* Explore scroll-down hint centered with bouncing motion */}
        <div className="hidden lg:flex absolute bottom-4 left-1/2 -translate-x-1/2 flex-col items-center gap-2 text-textMuted/60 z-20">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-[10px] uppercase tracking-[0.3em] font-['Space_Grotesk'] font-medium">
              Explore
            </span>
            <span className="w-px h-8 bg-gradient-to-b from-cyan-neon to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* Scrolling Brand Marquee */}
      <BrandMarquee />

      {/* Curated "New Arrivals" Grid with Stagger Reveals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 relative">
        {/* Right side ambient electric blue glow */}
        <div className="absolute right-0 top-1/3 w-[500px] h-[500px] bg-gradient-to-l from-[#0B6CCF]/20 via-[#0B6CCF]/10 to-transparent rounded-full blur-[120px] pointer-events-none -z-10" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8"
        >
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest text-cyan-neon uppercase font-['Space_Grotesk'] mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Curated Catalog
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold font-['Space_Grotesk'] text-white">
              New Arrivals & Best Sellers
            </h2>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-neon hover:text-white transition-colors group"
          >
            <span>Explore All Products</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-80 rounded-2xl bg-surface/30 animate-pulse border border-surface-border" />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {products.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        )}
      </section>

      {/* Promotional Banner */}
      <PromoBanner />

      {/* Newsletter Section */}
      <NewsletterSection />
    </div>
  );
};
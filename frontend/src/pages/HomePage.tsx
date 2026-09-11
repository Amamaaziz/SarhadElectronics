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

  const spotlightProduct = heroFeatured || {
    name: 'Smart Apex Hub Pro',
    price: 14999,
    imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80',
  };

  return (
    <div className="space-y-12">
      {/* Hero Section with Parallax */}
      <section ref={heroRef} className="relative overflow-hidden bg-gradient-to-b from-[#07101E] to-[#081021] pt-8 pb-20 lg:pt-16 lg:pb-28">
        {/* Parallax Glow backdrop effects */}
        <motion.div
          style={{ y: heroGlowY, opacity: heroGlowOpacity }}
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-hero-glow rounded-full blur-3xl pointer-events-none animate-pulse-glow"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div style={{ y: heroContentY }} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Headline Block */}
            <motion.div
              variants={heroVariants}
              initial="hidden"
              animate="visible"
              className="lg:col-span-7 space-y-6 text-center lg:text-left"
            >
              <motion.div variants={itemVariants}>
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface/70 border border-[rgba(0,229,255,0.15)] text-[#00E5FF] text-xs font-semibold uppercase tracking-wider backdrop-blur-md shadow-neon-cyan">
                  <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
                  Premium Selection 2026
                </span>
              </motion.div>

              <motion.h1
                variants={itemVariants}
                className="text-4xl sm:text-6xl font-extrabold font-['Space_Grotesk'] tracking-tight text-white leading-[1.1]"
              >
                Power Your Future With{' '}
                <span className="text-transparent bg-clip-text bg-[linear-gradient(90deg,#FFFFFF_0%,#00E5FF_35%,#0B6CCF_70%,#A855F7_100%)]">
                  Precision Hardware
                </span>
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="text-base sm:text-lg text-[#94A3B8] font-['Plus_Jakarta_Sans'] font-normal max-w-2xl mx-auto lg:mx-0 leading-relaxed"
              >
                Discover flagship smart gadgets, energy-efficient home appliances,
                and industrial-grade electrical tools crafted for durability, performance, and seamless automation.
              </motion.p>

              {/* Call To Actions */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
              >
                <motion.div
                  whileHover={{
                    scale: 1.05,
                    boxShadow: '0 0 25px rgba(0, 229, 255, 0.5)',
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="rounded-[16px] w-full sm:w-auto"
                >
                  <Link
                    to="/shop"
                    className="block w-full sm:w-auto px-[32px] py-[16px] rounded-[16px] bg-[#00E5FF] text-[#07101E] font-extrabold text-sm tracking-widest uppercase font-['Space_Grotesk'] text-center"
                  >
                    Shop Now
                  </Link>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/shop"
                    className="w-full sm:w-auto px-8 py-4 rounded-[16px] bg-transparent hover:bg-surface/40 text-[#94A3B8] hover:text-white font-bold text-xs tracking-widest uppercase font-['Space_Grotesk'] transition-all text-center block"
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
                  <div className="text-[11px] text-[#94A3B8] uppercase tracking-wider mt-0.5">
                    Products Sold
                  </div>
                </div>
                <div className="h-10 w-px bg-surface-border hidden sm:block" />
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold font-['Space_Grotesk'] text-white">
                    4.9/5
                  </div>
                  <div className="text-[11px] text-[#94A3B8] uppercase tracking-wider mt-0.5">
                    User Rating
                  </div>
                </div>
                <div className="h-10 w-px bg-surface-border hidden sm:block" />
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold font-['Space_Grotesk'] text-white">
                    24/7
                  </div>
                  <div className="text-[11px] text-[#94A3B8] uppercase tracking-wider mt-0.5">
                    Tech Support
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Product Spotlight Card (Minimal Glassmorphism) */}
            <div className="lg:col-span-5 flex justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="w-full max-w-md bg-[rgba(19,29,51,0.65)] backdrop-blur-[16px] border border-[rgba(0,229,255,0.12)] rounded-[24px] p-[24px] shadow-2xl"
              >
                {/* 1. Small centered caption label at top */}
                <div className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-[#94A3B8] mb-4 font-['Space_Grotesk']">
                  Spotlight
                </div>

                {/* 2. Rounded product image below it (16px radius) */}
                <div className="w-full aspect-square rounded-[16px] overflow-hidden bg-[#07101E]/60 flex items-center justify-center p-6">
                  <img
                    src={spotlightProduct.imageUrl}
                    alt={spotlightProduct.name}
                    className="w-full h-full object-contain hover:scale-105 transition-transform duration-500 drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)]"
                  />
                </div>

                {/* 3. Bold product name */}
                <h3 className="text-xl sm:text-2xl font-bold font-['Space_Grotesk'] text-white mt-4 text-center">
                  {spotlightProduct.name}
                </h3>

                {/* 4. Price displayed in neon cyan underneath */}
                <div className="text-2xl font-extrabold font-['Space_Grotesk'] text-[#00E5FF] mt-1 text-center">
                  Rs.{Number(spotlightProduct.price).toFixed(2)}
                </div>
              </motion.div>
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

      {/* Scrolling Brand Marquee & New Arrivals Hero Section */}
      <BrandMarquee>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-80 rounded-2xl bg-surface/30 animate-pulse border border-surface-border" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 px-6 rounded-3xl bg-surface/20 border border-surface-border space-y-4">
            <Zap className="w-10 h-10 text-cyan-neon mx-auto opacity-70 animate-pulse" />
            <h3 className="text-xl font-bold font-['Space_Grotesk'] text-white">New Products Arriving Soon</h3>
            <p className="text-sm text-textMuted max-w-md mx-auto">
              Our catalog is ready for real inventory. Use the Admin Panel to add new products and manage inventory live.
            </p>
            <Link
              to="/shop"
              className="inline-block px-6 py-2.5 rounded-xl bg-cyan-neon text-navy-950 font-bold text-xs uppercase tracking-wider font-['Space_Grotesk'] shadow-neon-cyan"
            >
              Browse Shop
            </Link>
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
      </BrandMarquee>

      {/* Promotional Banner */}
      <PromoBanner />

      {/* Newsletter Section */}
      <NewsletterSection />
    </div>
  );
};
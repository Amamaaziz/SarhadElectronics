import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Lightbulb,
  Cpu,
  Zap,
  Tv,
  ShoppingCart,
  ArrowLeft,
  Check,
} from 'lucide-react';
import { Product } from '../types';
import { fetchProductByIdApi, fetchProductsApi } from '../services/api';
import { useCart } from '../context/CartContext';
import { ProductCard } from '../components/ProductCard';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchProductByIdApi(id)
      .then((data) => {
        setProduct(data);
        if (data) {
          // Fetch related products
          fetchProductsApi({ category: data.categorySlug }).then((all) => {
            setRelated(all.filter((p) => p.id !== data.id).slice(0, 4));
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const getCategoryIcon = (categorySlug?: string, categoryName?: string) => {
    const cat = (categorySlug || categoryName || '').toLowerCase();
    if (cat.includes('light') || cat.includes('neon') || cat.includes('lamp')) {
      return <Lightbulb className="w-8 h-8 text-slate-400" strokeWidth={1.75} />;
    }
    if (cat.includes('gadget') || cat.includes('wearable') || cat.includes('watch') || cat.includes('sensor')) {
      return <Cpu className="w-8 h-8 text-slate-400" strokeWidth={1.75} />;
    }
    if (cat.includes('tool') || cat.includes('appliance') || cat.includes('electric')) {
      return <Zap className="w-8 h-8 text-slate-400" strokeWidth={1.75} />;
    }
    if (cat.includes('tv') || cat.includes('audio') || cat.includes('sound')) {
      return <Tv className="w-8 h-8 text-slate-400" strokeWidth={1.75} />;
    }
    return <Lightbulb className="w-8 h-8 text-slate-400" strokeWidth={1.75} />;
  };

  const getFormattedParagraphs = (desc?: string, name?: string, brand?: string, price?: number | string): string[] => {
    if (!desc || !desc.trim()) {
      return [
        `Engineered with precision for peak electrical efficiency, long-term durability, and seamless daily operation.`,
        `Built from premium components with integrated overload protection and optimized thermal regulation.`,
        `Includes standard manufacturer warranty with 24/7 dedicated support from ${brand || 'Sarhad Electronics'}.`,
      ];
    }

    const cleanName = (name || '').trim().toLowerCase();
    const priceNum = price !== undefined ? Number(price) : NaN;
    const priceNumStr = !isNaN(priceNum) ? String(Math.round(priceNum)) : '';

    // Split by newlines first
    let rawLines = desc
      .split(/[\r\n]+/)
      .map((p) => p.trim())
      .filter(Boolean);

    // If single long block, split by sentences
    if (rawLines.length === 1) {
      const single = rawLines[0];
      const sentences = single.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean);
      if (sentences.length > 1) {
        rawLines = sentences;
      }
    }

    const filtered = rawLines.filter((p) => {
      if (!p) return false;
      const lower = p.toLowerCase().trim();

      // 1. Remove if duplicates product name / title
      if (cleanName) {
        if (
          lower === cleanName ||
          lower === `name: ${cleanName}` ||
          lower === `title: ${cleanName}` ||
          (lower.startsWith('name:') && lower.includes(cleanName)) ||
          lower.replace(/[^a-z0-9]/g, '') === cleanName.replace(/[^a-z0-9]/g, '')
        ) {
          return false;
        }
      }

      // 2. Remove if just repeats the price
      if (/^(price\s*:\s*)?(rs\.?|pkr|\$)?\s*[\d,]+(\.\d+)?$/i.test(lower)) {
        return false;
      }
      if (priceNumStr && lower.replace(/[^0-9]/g, '') === priceNumStr && lower.length < 15) {
        return false;
      }

      return true;
    });

    if (filtered.length > 0) {
      return filtered;
    }

    return [
      `Engineered with precision for peak electrical efficiency, long-term durability, and seamless daily operation.`,
      `Built from premium components with integrated overload protection and optimized thermal regulation.`,
      `Includes standard manufacturer warranty with 24/7 dedicated support from ${brand || 'Sarhad Electronics'}.`,
    ];
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-pulse">
          <div className="lg:col-span-6 h-[460px] rounded-[28px] bg-slate-800/40 border border-[rgba(0,229,255,0.12)]" />
          <div className="lg:col-span-6 space-y-6 pt-4">
            <div className="h-10 bg-slate-800/40 rounded-xl w-3/4" />
            <div className="w-8 h-8 bg-slate-800/40 rounded-lg" />
            <div className="h-10 bg-slate-800/40 rounded-xl w-1/3" />
            <div className="space-y-3">
              <div className="h-4 bg-slate-800/40 rounded w-full" />
              <div className="h-4 bg-slate-800/40 rounded w-5/6" />
              <div className="h-4 bg-slate-800/40 rounded w-4/6" />
            </div>
            <div className="h-16 bg-slate-800/40 rounded-[14px] w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold font-['Space_Grotesk'] text-white">Product Not Found</h2>
        <p className="text-[#94A3B8] text-sm">The hardware item you requested is not listed in our active catalog.</p>
        <button
          onClick={() => navigate('/shop')}
          className="px-6 py-2.5 rounded-xl bg-[#00E5FF] text-[#07101E] font-bold text-xs uppercase hover:bg-cyan-300 transition-colors"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  const descriptionParagraphs = getFormattedParagraphs(product.description, product.name, product.brand, product.price);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      {/* Back to Catalog button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm text-[#94A3B8] hover:text-[#00E5FF] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Catalog
      </button>

      {/* Two-column Main Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left column — Image Card */}
        <div className="lg:col-span-6">
          {/* Outer dark glass panel */}
          <div className="rounded-[28px] p-4 sm:p-6 bg-[#131D33]/70 backdrop-blur-xl border border-[rgba(0,229,255,0.12)] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            {/* Inner solid white card */}
            <div className="rounded-[20px] bg-white p-6 sm:p-8 aspect-square flex items-center justify-center overflow-hidden relative shadow-inner">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-contain transition-transform duration-500 hover:scale-105"
              />

              {product.featured && (
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 text-xs font-extrabold rounded-lg bg-[#07101E] text-[#00E5FF] border border-[rgba(0,229,255,0.3)] font-['Space_Grotesk'] uppercase tracking-wider shadow-lg">
                    Featured
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right column — Details */}
        <div className="lg:col-span-6 flex flex-col space-y-6 sm:space-y-7">
          {/* 1. Product Title */}
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold font-['Space_Grotesk'] text-white leading-[1.1] tracking-tight">
              {product.name}
            </h1>
          </div>

          {/* 2. Category / Type Icon */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center">
              {getCategoryIcon(product.categorySlug, product.categoryName)}
            </div>
            <span className="text-sm font-semibold uppercase tracking-wider text-slate-400 font-['Space_Grotesk']">
              {product.categoryName || 'General Electronics'}
            </span>
          </div>

          {/* 3. Price */}
          <div className="pt-1">
            <div className="text-3xl sm:text-4xl lg:text-[40px] font-black font-['Space_Grotesk'] text-[#00E5FF] tracking-tight">
              Rs. {Number(product.price).toLocaleString()}
            </div>
          </div>

          {/* 4. Description (multiple short separate paragraphs) */}
          <div className="space-y-3.5 text-base sm:text-[17px] text-[#94A3B8] font-normal leading-relaxed">
            {descriptionParagraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {/* Quantity & Add to Cart Controls */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-bold font-['Space_Grotesk']">
                Quantity:
              </span>
              <div className="inline-flex items-center rounded-xl bg-[#131D33] border border-[rgba(0,229,255,0.15)] p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white transition-colors text-lg"
                >
                  -
                </button>
                <span className="w-10 text-center text-sm font-bold text-white font-mono">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white transition-colors text-lg"
                >
                  +
                </button>
              </div>

              <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5 ml-auto">
                <Check className="w-4 h-4" />
                <span>In Stock ({product.stock} available)</span>
              </div>
            </div>

            {/* 5. Add to Cart Button (Full width, Solid blue #0B6CCF, generous padding) */}
            <button
              onClick={handleAddToCart}
              className={`w-full py-[18px] px-8 rounded-[14px] font-extrabold text-base sm:text-lg uppercase tracking-wider font-['Space_Grotesk'] flex items-center justify-center gap-3 transition-all duration-300 shadow-[0_0_20px_rgba(11,108,207,0.35)] hover:shadow-[0_0_30px_rgba(11,108,207,0.65)] active:scale-[0.99] ${
                addedAnimation
                  ? 'bg-emerald-500 text-[#07101E]'
                  : 'bg-[#0B6CCF] hover:bg-[#0959aa] text-white'
              }`}
            >
              {addedAnimation ? (
                <>
                  <Check className="w-6 h-6" />
                  <span>ADDED TO CART!</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-6 h-6" />
                  <span>ADD TO CART</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="space-y-6 pt-10 border-t border-[rgba(0,229,255,0.12)]">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#00E5FF]" />
            <h3 className="text-xl sm:text-2xl font-bold font-['Space_Grotesk'] text-white">
              Related Hardware in This Category
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default ProductDetailPage;
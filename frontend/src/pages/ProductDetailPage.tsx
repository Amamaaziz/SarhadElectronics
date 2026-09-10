import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, ShieldCheck, Truck, RefreshCw, ShoppingCart, ArrowLeft, Check, Zap } from 'lucide-react';
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
  const [activeImage, setActiveImage] = useState<string>('');
  const [addedAnimation, setAddedAnimation] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchProductByIdApi(id)
      .then((data) => {
        setProduct(data);
        if (data) {
          setActiveImage(data.imageUrl);
          // Fetch related
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

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="h-96 rounded-3xl bg-surface/30 animate-pulse border border-surface-border" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold font-['Space_Grotesk'] text-white">Product Not Found</h2>
        <p className="text-textMuted text-sm">The hardware spec you requested is not listed in our active catalog.</p>
        <button
          onClick={() => navigate('/shop')}
          className="px-6 py-2.5 rounded-xl bg-cyan-neon text-navy-950 font-bold text-xs uppercase"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  const gallery = [product.imageUrl, ...(product.galleryUrls || [])].filter(Boolean);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm text-textMuted hover:text-cyan-neon transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* Main Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Gallery on Left */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-square rounded-3xl bg-surface-card border border-surface-border p-6 flex items-center justify-center overflow-hidden relative group">
            <img
              src={activeImage || product.imageUrl}
              alt={product.name}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
            />
            {product.featured && (
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 text-xs font-bold rounded-lg bg-gradient-to-r from-cyan-neon to-magenta-purple text-navy-950 font-['Space_Grotesk'] uppercase">
                  Featured Product
                </span>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {gallery.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-20 rounded-xl bg-surface-card border p-2 shrink-0 transition-all ${
                    activeImage === img ? 'border-cyan-neon shadow-neon-cyan' : 'border-surface-border opacity-70'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details on Right */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-surface text-cyan-neon text-xs font-semibold mb-3 border border-surface-border">
              {product.categoryName || 'Smart Electronics'}
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-['Space_Grotesk'] text-white">
              {product.name}
            </h1>
            <p className="text-xs text-textMuted mt-1">
              Brand: <strong className="text-slate-300">{product.brand || 'Sarhad Electrics'}</strong>
            </p>
          </div>

          {/* Ratings & Stock */}
          <div className="flex items-center gap-6 py-2 border-y border-surface-border">
            <div className="flex items-center gap-1.5 text-amber-400 text-sm">
              <Star className="w-4 h-4 fill-amber-400" />
              <span className="font-bold text-white">{Number(product.rating || 4.9).toFixed(1)}</span>
              <span className="text-textMuted text-xs">({product.reviewsCount || 15} reviews)</span>
            </div>
            <div className="h-4 w-px bg-surface-border" />
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
              <Check className="w-4 h-4" />
              <span>In Stock ({product.stock} units available)</span>
            </div>
          </div>

          {/* Price */}
          <div className="space-y-1">
            <span className="text-xs text-textMuted block">Retail Price</span>
            <div className="text-4xl font-black font-['Space_Grotesk'] text-cyan-neon">
              Rs.{Number(product.price).toFixed(2)}
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-textMuted leading-relaxed">
            {product.description}
          </p>

          {/* Quantity and Add to Cart */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center rounded-xl bg-surface border border-surface-border p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-textMuted hover:text-white"
                >
                  -
                </button>
                <span className="px-4 text-sm font-bold text-white font-mono">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 text-textMuted hover:text-white"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className={`flex-1 py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-wider font-['Space_Grotesk'] flex items-center justify-center gap-2 transition-all ${
                  addedAnimation
                    ? 'bg-emerald-500 text-navy-950'
                    : 'bg-cyan-neon text-navy-950 hover:shadow-neon-cyan hover:scale-[1.02]'
                }`}
              >
                {addedAnimation ? (
                  <>
                    <Check className="w-4 h-4" /> Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" /> Add to Cart
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Trust Value Propositions */}
          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-surface-border text-xs text-textMuted">
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-surface/30 border border-surface-border">
              <Truck className="w-4 h-4 text-cyan-neon shrink-0" />
              <span>Free expedited shipping on orders over $150</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-surface/30 border border-surface-border">
              <ShieldCheck className="w-4 h-4 text-magenta-purple shrink-0" />
              <span>1-Year Official Manufacturer Warranty</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="space-y-6 pt-10 border-t border-surface-border">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-cyan-neon" />
            <h3 className="text-xl font-bold font-['Space_Grotesk'] text-white">
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
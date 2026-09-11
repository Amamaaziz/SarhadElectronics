import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Eye, ArrowUpRight } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const formattedPrice = `Rs. ${Number(product.price).toLocaleString('en-US')}`;

  return (
    <div className="group relative rounded-[20px] bg-[rgba(19,29,51,0.55)] backdrop-blur-md border border-[rgba(0,229,255,0.1)] overflow-hidden flex flex-col hover:border-[rgba(0,229,255,0.35)] hover:shadow-[0_12px_30px_rgba(0,229,255,0.15)] transition-all duration-300">
      {/* Product Image Container with Colored Inner Border Frame */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#07101E]/40 border-b border-[rgba(0,229,255,0.1)] flex items-center justify-center p-5">
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Brand or Category Pill */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md bg-[#07101E]/80 backdrop-blur-md text-[#00E5FF] border border-[rgba(0,229,255,0.2)] font-['Space_Grotesk']">
            {product.categoryName || product.brand || 'Electronics'}
          </span>
        </div>

        {/* Featured Badge */}
        {product.featured && (
          <div className="absolute top-3 right-3">
            <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider rounded-md bg-gradient-to-r from-[#00E5FF] to-[#A855F7] text-[#07101E] font-['Space_Grotesk'] shadow-sm">
              Featured
            </span>
          </div>
        )}

        {/* Quick Action Overlay on hover */}
        <div className="absolute inset-0 bg-[#07101E]/60 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <Link
            to={`/product/${product.id}`}
            aria-label={`View details of ${product.name}`}
            className="p-2.5 rounded-xl bg-[#1E293B] border border-[rgba(0,229,255,0.2)] text-white hover:text-[#00E5FF] hover:border-[#00E5FF] transition-all"
          >
            <Eye className="w-5 h-5" />
          </Link>
          <button
            onClick={() => addToCart(product)}
            aria-label={`Add ${product.name} to cart`}
            className="p-2.5 rounded-xl bg-[#00E5FF] text-[#07101E] font-bold hover:shadow-[0_0_15px_rgba(0,229,255,0.5)] transition-all"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Rating */}
          <div className="flex items-center gap-1 text-amber-400 text-xs mb-1.5">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span className="font-semibold text-white">{Number(product.rating || 4.9).toFixed(1)}</span>
            <span className="text-[#94A3B8] text-[11px]">({product.reviewsCount || 10})</span>
          </div>

          {/* Title */}
          <Link to={`/product/${product.id}`}>
            <h3 className="text-base font-semibold text-white group-hover:text-[#00E5FF] transition-colors line-clamp-1 font-['Space_Grotesk']">
              {product.name}
            </h3>
          </Link>

          {/* Short description */}
          <p className="text-xs text-[#94A3B8] line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Action Row */}
        <div className="pt-3 border-t border-[rgba(0,229,255,0.08)] flex items-center justify-between">
          <div>
            <span className="text-[11px] text-[#94A3B8] uppercase tracking-wider block font-['Space_Grotesk']">Price</span>
            <span className="text-lg font-extrabold font-['Space_Grotesk'] text-[#00E5FF]">
              {formattedPrice}
            </span>
          </div>

          {/* Muted VIEW DETAILS label */}
          <Link
            to={`/product/${product.id}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#94A3B8] hover:text-[#00E5FF] uppercase tracking-wider font-['Space_Grotesk'] transition-colors"
          >
            <span>VIEW DETAILS</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
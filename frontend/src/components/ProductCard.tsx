import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Eye } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const formattedPrice = Number(product.price).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return (
    <div className="group relative rounded-2xl bg-surface-card border border-surface-border overflow-hidden flex flex-col hover:border-cyan-neon/40 hover:shadow-neon-cyan transition-all duration-300">
      {/* Product Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-navy-900/60 flex items-center justify-center p-4">
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Brand or Category Pill */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 text-[11px] font-semibold tracking-wide rounded-md bg-navy-950/80 backdrop-blur-md text-cyan-neon border border-cyan-neon/20">
            {product.categoryName || product.brand || 'Electronics'}
          </span>
        </div>

        {/* Featured Badge */}
        {product.featured && (
          <div className="absolute top-3 right-3">
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-gradient-to-r from-cyan-neon to-magenta-purple text-navy-950 font-['Space_Grotesk']">
              Featured
            </span>
          </div>
        )}

        {/* Quick Action Overlay on hover */}
        <div className="absolute inset-0 bg-navy-950/50 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <Link
            to={`/product/${product.id}`}
            aria-label={`View details of ${product.name}`}
            className="p-2.5 rounded-xl bg-surface border border-surface-border text-white hover:text-cyan-neon hover:border-cyan-neon transition-colors"
          >
            <Eye className="w-5 h-5" />
          </Link>
          <button
            onClick={() => addToCart(product)}
            aria-label={`Add ${product.name} to cart`}
            className="p-2.5 rounded-xl bg-cyan-neon text-navy-950 font-bold hover:shadow-neon-cyan transition-all"
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
            <span className="text-textMuted text-[11px]">({product.reviewsCount || 10})</span>
          </div>

          {/* Title */}
          <Link to={`/product/${product.id}`}>
            <h3 className="text-base font-semibold text-white group-hover:text-cyan-neon transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {/* Short description */}
          <p className="text-xs text-textMuted line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Action */}
        <div className="pt-2 border-t border-surface-border flex items-center justify-between">
          <div>
            <span className="text-xs text-textMuted block">Price</span>
            <span className="text-lg font-bold font-['Space_Grotesk'] text-cyan-neon">
              {formattedPrice}
            </span>
          </div>

          <button
            onClick={() => addToCart(product)}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-surface hover:bg-cyan-neon hover:text-navy-950 border border-surface-border hover:border-cyan-neon transition-all"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};


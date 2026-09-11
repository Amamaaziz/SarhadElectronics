import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, ArrowUpDown, RefreshCw, X } from 'lucide-react';
import { Product, Category } from '../types';
import { fetchProductsApi, fetchCategoriesApi } from '../services/api';
import { ProductCard } from '../components/ProductCard';

export const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const currentCategory = searchParams.get('category') || 'all-items';
  const currentSearch = searchParams.get('search') || '';
  const currentSort = searchParams.get('sort') || 'newest';

  const [searchInput, setSearchInput] = useState(currentSearch);

  useEffect(() => {
    fetchCategoriesApi().then(setCategories);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchProductsApi({
      category: currentCategory,
      search: currentSearch,
      sort: currentSort,
    })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [currentCategory, currentSearch, currentSort]);

  const handleCategorySelect = (slug: string) => {
    const params = new URLSearchParams(searchParams);
    if (slug === 'all-items' || slug === 'all') {
      params.delete('category');
    } else {
      params.set('category', slug);
    }
    setSearchParams(params);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchInput.trim()) {
      params.set('search', searchInput.trim());
    } else {
      params.delete('search');
    }
    setSearchParams(params);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', e.target.value);
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchInput('');
    setSearchParams({});
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8"
    >
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold font-['Space_Grotesk'] text-white">
          Product <span className="text-cyan-neon">Catalog</span>
        </h1>
        <p className="text-sm text-textMuted max-w-2xl">
          Browse through our high-performance inventory of smart electronics, industrial tools, and modern architectural lighting.
        </p>
      </div>

      {/* Control Bar: Search + Category Pills + Sort */}
      <div className="space-y-4 p-5 rounded-2xl bg-surface/40 border border-surface-border backdrop-blur-md">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-lg">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by name, spec, or brand (e.g. Bose, Drill, Philips)..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-navy-900 border border-surface-border text-sm text-white placeholder:text-textMuted/60 focus:outline-hidden focus:border-cyan-neon transition-all"
            />
            <Search className="w-4 h-4 text-textMuted absolute left-3.5 top-3" />
            {searchInput && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput('');
                  const params = new URLSearchParams(searchParams);
                  params.delete('search');
                  setSearchParams(params);
                }}
                className="absolute right-3 top-3 text-textMuted hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5 text-xs text-textMuted uppercase font-semibold">
              <ArrowUpDown className="w-3.5 h-3.5 text-cyan-neon" />
              <span>Sort By:</span>
            </div>
            <select
              value={currentSort}
              onChange={handleSortChange}
              className="px-3 py-2 rounded-xl bg-navy-900 border border-surface-border text-xs text-white focus:outline-hidden focus:border-cyan-neon cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 pb-1 scrollbar-none">
          <div className="flex items-center gap-1.5 text-xs text-textMuted uppercase font-semibold mr-1 shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-neon" />
            <span>Category:</span>
          </div>
          {categories.map((cat) => {
            const isActive =
              currentCategory === cat.slug ||
              (cat.slug === 'all-items' && !searchParams.get('category'));
            return (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.slug)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-cyan-neon text-navy-950 shadow-neon-cyan'
                    : 'bg-navy-900/80 text-textMuted hover:text-white hover:bg-surface border border-surface-border'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active filters breadcrumb */}
      {(currentSearch || (currentCategory && currentCategory !== 'all-items')) && (
        <div className="flex items-center gap-3 text-xs text-textMuted">
          <span>Active Filters:</span>
          {currentSearch && (
            <span className="px-2.5 py-1 rounded-md bg-surface text-cyan-neon border border-surface-border flex items-center gap-1">
              Search: "{currentSearch}"
            </span>
          )}
          {currentCategory && currentCategory !== 'all-items' && (
            <span className="px-2.5 py-1 rounded-md bg-surface text-cyan-neon border border-surface-border flex items-center gap-1">
              Category: {categories.find((c) => c.slug === currentCategory)?.name || currentCategory}
            </span>
          )}
          <button
            onClick={clearFilters}
            className="text-cyan-neon hover:underline flex items-center gap-1 ml-2"
          >
            <RefreshCw className="w-3 h-3" /> Reset
          </button>
        </div>
      )}

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-80 rounded-2xl bg-surface/30 animate-pulse border border-surface-border" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 p-8 rounded-3xl bg-surface/20 border border-surface-border space-y-4">
          <Search className="w-12 h-12 text-cyan-neon mx-auto opacity-60" />
          <h3 className="text-xl font-bold font-['Space_Grotesk'] text-white">
            {currentSearch || (currentCategory && currentCategory !== 'all-items')
              ? 'No products matched your query'
              : 'No products in catalog yet'}
          </h3>
          <p className="text-sm text-textMuted max-w-md mx-auto">
            {currentSearch || (currentCategory && currentCategory !== 'all-items')
              ? 'Try adjusting your search terms or select another category from the filters above.'
              : 'Our store catalog is ready. New real inventory is being added via the Admin Panel.'}
          </p>
          {(currentSearch || (currentCategory && currentCategory !== 'all-items')) && (
            <button
              onClick={clearFilters}
              className="px-6 py-2.5 rounded-xl bg-cyan-neon text-navy-950 font-bold text-xs uppercase tracking-wider font-['Space_Grotesk'] shadow-neon-cyan"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div>
          <div className="text-xs text-textMuted mb-4">
            Showing <strong className="text-white">{products.length}</strong> items
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};


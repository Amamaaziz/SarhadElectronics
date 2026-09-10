import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Edit, Search, Check, X, Sparkles, Image as ImageIcon } from 'lucide-react';
import { getAdminProducts, createAdminProduct, deleteAdminProduct } from '../services/adminApi';
import { AdminProduct } from '../types';

export const ManageProductsPage: React.FC = () => {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form fields for new product
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    categoryId: 'cat-01',
    brand: 'Sarhad',
    featured: false,
    imageUrl: '',
  });

  const loadProducts = () => {
    getAdminProducts().then(setProducts);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this product from the catalog?')) return;
    try {
      await deleteAdminProduct(id);
      setProducts(products.filter((p) => p.id !== id));
    } catch {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createAdminProduct({
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
      });
      setIsModalOpen(false);
      setFormData({
        name: '',
        description: '',
        price: '',
        stock: '',
        categoryId: 'cat-01',
        brand: 'Sarhad',
        featured: false,
        imageUrl: '',
      });
      loadProducts();
    } catch {
      // Offline fallback push
      const newProd: AdminProduct = {
        id: `prod-${Date.now()}`,
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        stock: Number(formData.stock),
        categoryId: formData.categoryId,
        categoryName: formData.categoryId === 'cat-01' ? 'Smart Gadgets' : 'Modern Lighting',
        imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80',
        featured: formData.featured,
        brand: formData.brand,
        createdAt: new Date().toISOString(),
      };
      setProducts([newProd, ...products]);
      setIsModalOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.brand && p.brand.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-8 space-y-6">
      {/* Control bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search inventory by title or brand..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-900 border border-surface-border text-xs text-white placeholder:text-textMuted/60 focus:outline-hidden focus:border-cyan-neon"
          />
          <Search className="w-4 h-4 text-textMuted absolute left-3 top-3" />
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-cyan-neon text-navy-950 font-bold text-xs uppercase tracking-wider font-['Space_Grotesk'] hover:shadow-neon-cyan transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add New Product
        </button>
      </div>

      {/* Table */}
      <div className="rounded-3xl bg-surface-card border border-surface-border overflow-hidden shadow-glass">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-navy-900/80 uppercase text-textMuted font-semibold border-b border-surface-border">
              <tr>
                <th className="py-3.5 px-4">Item</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4">Featured</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border/50">
              {filtered.map((prod) => (
                <tr key={prod.id} className="hover:bg-surface/30">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={prod.imageUrl}
                        alt={prod.name}
                        className="w-10 h-10 object-cover rounded-lg bg-navy-900 shrink-0"
                      />
                      <div>
                        <span className="font-semibold text-white block">{prod.name}</span>
                        <span className="text-[11px] text-textMuted">{prod.brand || 'Sarhad'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-textMuted">
                    {prod.categoryName || 'Smart Tech'}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-cyan-neon font-['Space_Grotesk']">
                    ${Number(prod.price).toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                        prod.stock > 10
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-rose-500/10 text-rose-400'
                      }`}
                    >
                      {prod.stock} units
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    {prod.featured ? (
                      <span className="px-2 py-0.5 rounded bg-cyan-neon/10 text-cyan-neon border border-cyan-neon/30 text-[10px] font-bold uppercase">
                        Yes
                      </span>
                    ) : (
                      <span className="text-textMuted text-[11px]">No</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleDelete(prod.id)}
                        className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-navy-950 border border-surface-border rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <h3 className="text-lg font-bold font-['Space_Grotesk'] text-white">
                Add New Hardware Spec
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-textMuted hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-textMuted block mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Apex 1000W Inverter"
                    className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-surface-border text-xs text-white focus:outline-hidden focus:border-cyan-neon"
                  />
                </div>

                <div>
                  <label className="text-xs text-textMuted block mb-1">Brand Name</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="e.g. Bose, Samsung, Sarhad"
                    className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-surface-border text-xs text-white focus:outline-hidden focus:border-cyan-neon"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-textMuted block mb-1">Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="199.99"
                    className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-surface-border text-xs text-white focus:outline-hidden focus:border-cyan-neon"
                  />
                </div>

                <div>
                  <label className="text-xs text-textMuted block mb-1">Stock Units *</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="50"
                    className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-surface-border text-xs text-white focus:outline-hidden focus:border-cyan-neon"
                  />
                </div>

                <div>
                  <label className="text-xs text-textMuted block mb-1">Category</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-surface-border text-xs text-white focus:outline-hidden focus:border-cyan-neon cursor-pointer"
                  >
                    <option value="cat-01">Smart Gadgets</option>
                    <option value="cat-02">Modern Lighting</option>
                    <option value="cat-03">Home Appliances</option>
                    <option value="cat-04">Electrical Tools</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-textMuted block mb-1">Image URL (or Cloudinary link)</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-surface-border text-xs text-white focus:outline-hidden focus:border-cyan-neon"
                />
              </div>

              <div>
                <label className="text-xs text-textMuted block mb-1">Technical Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Key features, wattage, battery life, specifications..."
                  className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-surface-border text-xs text-white focus:outline-hidden focus:border-cyan-neon"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured-check"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded bg-navy-900 border-surface-border text-cyan-neon focus:ring-0"
                />
                <label htmlFor="featured-check" className="text-xs text-white cursor-pointer select-none">
                  Highlight as Featured Showcase product on homepage
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-surface-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-surface border border-surface-border text-xs text-textMuted hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-cyan-neon text-navy-950 font-bold text-xs uppercase tracking-wider font-['Space_Grotesk'] hover:shadow-neon-cyan"
                >
                  {submitting ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};


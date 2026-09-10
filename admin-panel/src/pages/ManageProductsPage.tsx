import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Pencil, Search, X } from 'lucide-react';
import {
  getAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
} from '../services/adminApi';
import { AdminProduct } from '../types';

const emptyForm = {
  name: '',
  description: '',
  price: '',
  stock: '',
  categoryId: 'cat-01',
  brand: 'Sarhad',
  featured: false,
  imageUrl: '',
};

export const ManageProductsPage: React.FC = () => {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState(emptyForm);

  const loadProducts = () => {
    getAdminProducts().then(setProducts);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setIsModalOpen(true);
  };

  const openEditModal = (prod: AdminProduct) => {
    setEditingId(prod.id);
    setFormData({
      name: prod.name,
      description: prod.description || '',
      price: String(prod.price),
      stock: String(prod.stock),
      categoryId: prod.categoryId || 'cat-01',
      brand: prod.brand || 'Sarhad',
      featured: prod.featured,
      imageUrl: prod.imageUrl || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this product from the catalog?')) return;
    try {
      await deleteAdminProduct(id);
    } catch {
      // fall through to local removal regardless
    }
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
    };

    try {
      if (editingId) {
        await updateAdminProduct(editingId, payload);
        setProducts((prev) =>
          prev.map((p) => (p.id === editingId ? { ...p, ...payload } : p))
        );
      } else {
        await createAdminProduct(payload);
        loadProducts();
      }
      setIsModalOpen(false);
    } catch {
      // Offline fallback: apply the change locally
      if (editingId) {
        setProducts((prev) =>
          prev.map((p) => (p.id === editingId ? { ...p, ...payload } : p))
        );
      } else {
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
        setProducts((prev) => [newProd, ...prev]);
      }
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
    <div className="px-10 pb-10 pt-6 space-y-6">
      {/* Control bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search inventory by title or brand..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-card border border-line text-sm text-body placeholder:text-muted focus:outline-hidden focus:border-body"
          />
          <Search className="w-4 h-4 text-muted absolute left-3 top-3" />
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 rounded-lg bg-ink text-white font-semibold text-sm hover:bg-ink-soft transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add New Product
        </button>
      </div>

      {/* Table */}
      <div className="rounded-card bg-card border border-line shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line text-muted text-xs font-semibold tracking-wide">
                <th className="py-3.5 px-7">Item</th>
                <th className="py-3.5 px-7">Category</th>
                <th className="py-3.5 px-7">Price</th>
                <th className="py-3.5 px-7">Stock</th>
                <th className="py-3.5 px-7">Featured</th>
                <th className="py-3.5 px-7 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filtered.map((prod) => (
                <tr key={prod.id} className="hover:bg-page/60">
                  <td className="py-3.5 px-7">
                    <div className="flex items-center gap-3">
                      <img
                        src={prod.imageUrl}
                        alt={prod.name}
                        className="w-10 h-10 object-cover rounded-lg bg-page shrink-0"
                      />
                      <div>
                        <span className="font-semibold text-body block">{prod.name}</span>
                        <span className="text-xs text-muted">{prod.brand || 'Sarhad'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-7 text-muted">
                    {prod.categoryName || 'Smart Tech'}
                  </td>
                  <td className="py-3.5 px-7 font-semibold text-body">
                    Rs.{Number(prod.price).toFixed(2)}
                  </td>
                  <td className="py-3.5 px-7">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        prod.stock > 10
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-rose-50 text-rose-600'
                      }`}
                    >
                      {prod.stock} units
                    </span>
                  </td>
                  <td className="py-3.5 px-7">
                    {prod.featured ? (
                      <span className="px-2.5 py-0.5 rounded border border-line text-[11px] font-semibold text-body">
                        YES
                      </span>
                    ) : (
                      <span className="text-muted text-xs">No</span>
                    )}
                  </td>
                  <td className="py-3.5 px-7 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEditModal(prod)}
                        className="p-1.5 rounded-lg text-muted hover:text-body hover:bg-page"
                        title="Edit Product"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(prod.id)}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 px-7 text-center text-muted">
                    No products match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-card border border-line rounded-card p-6 space-y-4 shadow-card">
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <h3 className="text-lg font-bold text-body">
                {editingId ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-muted hover:text-body"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted block mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Apex 1000W Inverter"
                    className="w-full px-3 py-2 rounded-lg bg-page border border-line text-sm text-body focus:outline-hidden focus:border-body"
                  />
                </div>

                <div>
                  <label className="text-xs text-muted block mb-1">Brand Name</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="e.g. Bose, Samsung, Sarhad"
                    className="w-full px-3 py-2 rounded-lg bg-page border border-line text-sm text-body focus:outline-hidden focus:border-body"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-muted block mb-1">Price (Rs.) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="199.99"
                    className="w-full px-3 py-2 rounded-lg bg-page border border-line text-sm text-body focus:outline-hidden focus:border-body"
                  />
                </div>

                <div>
                  <label className="text-xs text-muted block mb-1">Stock Units *</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="50"
                    className="w-full px-3 py-2 rounded-lg bg-page border border-line text-sm text-body focus:outline-hidden focus:border-body"
                  />
                </div>

                <div>
                  <label className="text-xs text-muted block mb-1">Category</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-page border border-line text-sm text-body focus:outline-hidden focus:border-body cursor-pointer"
                  >
                    <option value="cat-01">Smart Gadgets</option>
                    <option value="cat-02">Modern Lighting</option>
                    <option value="cat-03">Home Appliances</option>
                    <option value="cat-04">Electrical Tools</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-muted block mb-1">Image URL (or Cloudinary link)</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-lg bg-page border border-line text-sm text-body focus:outline-hidden focus:border-body"
                />
              </div>

              <div>
                <label className="text-xs text-muted block mb-1">Technical Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Key features, wattage, battery life, specifications..."
                  className="w-full px-3 py-2 rounded-lg bg-page border border-line text-sm text-body focus:outline-hidden focus:border-body"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured-check"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded border-line text-ink focus:ring-0"
                />
                <label htmlFor="featured-check" className="text-sm text-body cursor-pointer select-none">
                  Highlight as Featured Showcase product on homepage
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-line">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-page border border-line text-sm text-muted hover:text-body"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-lg bg-ink text-white font-semibold text-sm hover:bg-ink-soft disabled:opacity-60"
                >
                  {submitting ? 'Saving...' : editingId ? 'Save Changes' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
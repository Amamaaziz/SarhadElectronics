import React, { useEffect, useState, useRef } from 'react';
import { Plus, Trash2, Pencil, Search, X, FolderPlus, Check, AlertCircle, UploadCloud, Loader2, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';
import {
  getAdminProducts,
  getAdminCategories,
  createAdminCategory,
  deleteAdminCategory,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  uploadAdminImage,
  uploadAdminImageUrl,
} from '../services/adminApi';
import { AdminProduct, AdminCategory } from '../types';

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
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState(emptyForm);

  // Cloudinary image upload states
  const [imageUploading, setImageUploading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [imageInputMode, setImageInputMode] = useState<'upload' | 'url'>('upload');
  const [externalUrlInput, setExternalUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Category creation states inside modal
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [addingCategoryLoading, setAddingCategoryLoading] = useState(false);
  const [categorySuccessMsg, setCategorySuccessMsg] = useState('');

  // Category toolbar states
  const [isBarAddingCat, setIsBarAddingCat] = useState(false);
  const [newBarCatName, setNewBarCatName] = useState('');
  const [barAddingLoading, setBarAddingLoading] = useState(false);

  const [modalError, setModalError] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [prods, cats] = await Promise.all([
        getAdminProducts(),
        getAdminCategories(),
      ]);
      setProducts(prods);
      setCategories(cats);
    } catch {
      // Keep state
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setModalError('');
    setFormData({
      ...emptyForm,
      categoryId: categories[0]?.id || 'cat-01',
    });
    setPreviewUrl('');
    setImageUploadError('');
    setImageUploading(false);
    setImageInputMode('upload');
    setExternalUrlInput('');
    setIsAddingCategory(false);
    setNewCategoryName('');
    setCategorySuccessMsg('');
    setIsModalOpen(true);
  };

  const openEditModal = (prod: AdminProduct) => {
    setEditingId(prod.id);
    setModalError('');
    setFormData({
      name: prod.name,
      description: prod.description || '',
      price: String(prod.price),
      stock: String(prod.stock),
      categoryId: prod.categoryId || categories[0]?.id || 'cat-01',
      brand: prod.brand || 'Sarhad',
      featured: prod.featured,
      imageUrl: prod.imageUrl || '',
    });
    setPreviewUrl(prod.imageUrl || '');
    setImageUploadError('');
    setImageUploading(false);
    setImageInputMode('upload');
    setExternalUrlInput('');
    setIsAddingCategory(false);
    setNewCategoryName('');
    setCategorySuccessMsg('');
    setIsModalOpen(true);
  };

  const handleImageFileSelect = async (file: File) => {
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      setImageUploadError('Invalid file type. Please upload a JPG, PNG, or WEBP image.');
      return;
    }

    const maxSizeBytes = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSizeBytes) {
      setImageUploadError('File size is too large (max 5MB). Please choose a smaller image.');
      return;
    }

    setImageUploadError('');
    setPreviewUrl(URL.createObjectURL(file));
    setImageUploading(true);

    try {
      const secureUrl = await uploadAdminImage(file);
      if (secureUrl) {
        setFormData((prev) => ({ ...prev, imageUrl: secureUrl }));
        setPreviewUrl(secureUrl);
      } else {
        throw new Error('Upload succeeded but no secure URL was returned from Cloudinary.');
      }
    } catch (err: any) {
      console.error('Image upload error:', err);
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        'Failed to upload image to Cloudinary. Please check your network connection.';
      setImageUploadError(errorMsg);
    } finally {
      setImageUploading(false);
    }
  };

  const handleExternalUrlUpload = async () => {
    if (!externalUrlInput.trim()) {
      setImageUploadError('Please enter a valid external image URL.');
      return;
    }

    const url = externalUrlInput.trim();
    if (!/^https?:\/\//i.test(url)) {
      setImageUploadError('Invalid URL. Link must start with http:// or https://');
      return;
    }

    setImageUploadError('');
    setImageUploading(true);

    try {
      const secureUrl = await uploadAdminImageUrl(url);
      if (secureUrl) {
        setFormData((prev) => ({ ...prev, imageUrl: secureUrl }));
        setPreviewUrl(secureUrl);
        setExternalUrlInput('');
      } else {
        throw new Error('Upload succeeded but no secure URL was returned from Cloudinary.');
      }
    } catch (err: any) {
      console.error('Remote URL upload error:', err);
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        'Failed to import image from external URL to Cloudinary. Please verify the URL points directly to an image.';
      setImageUploadError(errorMsg);
    } finally {
      setImageUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    setAddingCategoryLoading(true);

    try {
      const res = await createAdminCategory({ name: newCategoryName.trim() });
      const createdCat: AdminCategory = res.data?.data || {
        id: `cat-${Date.now()}`,
        name: newCategoryName.trim(),
        slug: newCategoryName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      };

      setCategories((prev) => [...prev, createdCat]);
      setFormData((prev) => ({ ...prev, categoryId: createdCat.id }));
      setCategorySuccessMsg(`Category "${createdCat.name}" created!`);
      setNewCategoryName('');
      setIsAddingCategory(false);
      setTimeout(() => setCategorySuccessMsg(''), 4000);
      await loadData();
    } catch {
      // Local fallback
      const localCat: AdminCategory = {
        id: `cat-${Date.now()}`,
        name: newCategoryName.trim(),
        slug: newCategoryName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      };
      setCategories((prev) => [...prev, localCat]);
      setFormData((prev) => ({ ...prev, categoryId: localCat.id }));
      setCategorySuccessMsg(`Category "${localCat.name}" created!`);
      setNewCategoryName('');
      setIsAddingCategory(false);
      setTimeout(() => setCategorySuccessMsg(''), 4000);
    } finally {
      setAddingCategoryLoading(false);
    }
  };

  const handleQuickCreateCategory = async () => {
    if (!newBarCatName.trim()) return;
    setBarAddingLoading(true);
    try {
      await createAdminCategory({ name: newBarCatName.trim() });
      await loadData();
      setNewBarCatName('');
      setIsBarAddingCat(false);
    } catch {
      const localCat: AdminCategory = {
        id: `cat-${Date.now()}`,
        name: newBarCatName.trim(),
        slug: newBarCatName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      };
      setCategories((prev) => [...prev, localCat]);
      setNewBarCatName('');
      setIsBarAddingCat(false);
    } finally {
      setBarAddingLoading(false);
    }
  };

  const handleDeleteCategory = async (catId: string, catName: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (
      !window.confirm(
        `Are you sure you want to delete category "${catName}"? Any products under this category will be preserved.`
      )
    ) {
      return;
    }

    try {
      await deleteAdminCategory(catId);
      await loadData();
      if (selectedCategory === catId) {
        setSelectedCategory('all');
      }
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to delete category');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this product from the catalog?')) return;
    try {
      await deleteAdminProduct(id);
      await loadData();
    } catch {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (imageUploading) {
      setModalError('Please wait for the image upload to Cloudinary to complete before saving.');
      return;
    }
    setSubmitting(true);
    setModalError('');

    const activeCat = categories.find((c) => c.id === formData.categoryId);

    const payload = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
      categoryName: activeCat?.name,
    };

    try {
      if (editingId) {
        await updateAdminProduct(editingId, payload);
      } else {
        await createAdminProduct(payload);
      }
      await loadData();
      setIsModalOpen(false);
    } catch (err: any) {
      console.error('Failed to save product:', err);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to save product to database. Please verify your admin session.';
      setModalError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.brand && p.brand.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'all' ||
      p.categoryId === selectedCategory ||
      (p.categoryName &&
        categories.find((c) => c.id === selectedCategory)?.name.toLowerCase() ===
          p.categoryName.toLowerCase());

    return matchesSearch && matchesCategory;
  });

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

      {/* Category Pills & Manager Bar */}
      <div className="flex flex-wrap items-center gap-2 p-3 bg-card border border-line rounded-card">
        <div className="text-xs font-semibold text-muted uppercase tracking-wider mr-1 flex items-center gap-1.5">
          <span>Categories:</span>
        </div>

        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            selectedCategory === 'all'
              ? 'bg-ink text-white shadow-xs'
              : 'bg-page text-muted hover:text-body border border-line'
          }`}
        >
          All Items ({products.length})
        </button>

        {categories
          .filter((c) => c.slug !== 'all-items' && c.name.toLowerCase() !== 'all items')
          .map((cat) => {
            const count = products.filter(
              (p) =>
                p.categoryId === cat.id ||
                p.categoryName?.toLowerCase() === cat.name.toLowerCase()
            ).length;
            const isSelected = selectedCategory === cat.id;

            return (
              <div
                key={cat.id}
                onClick={() => setSelectedCategory(isSelected ? 'all' : cat.id)}
                className={`group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-ink text-white shadow-xs'
                    : 'bg-page text-muted hover:text-body border border-line'
                }`}
              >
                <span>{cat.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-line text-muted'
                  }`}
                >
                  {count}
                </span>
                <button
                  type="button"
                  title={`Delete category "${cat.name}"`}
                  onClick={(e) => handleDeleteCategory(cat.id, cat.name, e)}
                  className={`p-0.5 rounded transition-all opacity-40 hover:opacity-100 hover:bg-rose-500 hover:text-white ${
                    isSelected ? 'text-white hover:bg-rose-600' : 'text-rose-500'
                  }`}
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            );
          })}

        {/* Inline Add Category on Bar */}
        {isBarAddingCat ? (
          <div className="inline-flex items-center gap-1 bg-page border border-line rounded-lg p-1">
            <input
              type="text"
              value={newBarCatName}
              onChange={(e) => setNewBarCatName(e.target.value)}
              placeholder="Category name..."
              className="px-2 py-0.5 text-xs bg-card border border-line rounded text-body focus:outline-hidden"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleQuickCreateCategory();
                }
              }}
            />
            <button
              type="button"
              onClick={handleQuickCreateCategory}
              disabled={!newBarCatName.trim() || barAddingLoading}
              className="px-2 py-0.5 bg-ink text-white rounded text-xs font-medium hover:bg-ink-soft disabled:opacity-50"
            >
              {barAddingLoading ? '...' : 'Add'}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsBarAddingCat(false);
                setNewBarCatName('');
              }}
              className="p-0.5 text-muted hover:text-body"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsBarAddingCat(true)}
            className="px-2.5 py-1.5 rounded-lg border border-dashed border-line text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50/50 flex items-center gap-1 font-medium transition-all"
          >
            <FolderPlus className="w-3.5 h-3.5" /> + New Category
          </button>
        )}
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
                  <td colSpan={6} className="py-12 px-7 text-center text-muted">
                    {products.length === 0 ? (
                      <div className="space-y-3">
                        <p className="text-sm font-medium text-body">No products in catalog yet.</p>
                        <p className="text-xs text-muted">Click the "+ Add Product" button above to add your first real product to the website.</p>
                      </div>
                    ) : (
                      'No products match your search.'
                    )}
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

            {modalError && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-100 text-rose-600 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

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

                <div className="sm:col-span-1">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs text-muted block">Category *</label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingCategory(!isAddingCategory)}
                        className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
                      >
                        <FolderPlus className="w-3 h-3" /> New
                      </button>
                      {formData.categoryId && formData.categoryId !== '__NEW__' && (
                        <button
                          type="button"
                          onClick={() => {
                            const cat = categories.find((c) => c.id === formData.categoryId);
                            if (cat) handleDeleteCategory(cat.id, cat.name);
                          }}
                          className="text-[11px] font-semibold text-rose-500 hover:text-rose-700 flex items-center gap-1 transition-colors"
                          title="Delete selected category"
                        >
                          <Trash2 className="w-3 h-3" /> Del
                        </button>
                      )}
                    </div>
                  </div>

                  {isAddingCategory ? (
                    <div className="p-2.5 bg-page border border-line rounded-lg space-y-2">
                      <input
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="e.g. Solar Inverters"
                        className="w-full px-2.5 py-1.5 rounded-md bg-card border border-line text-xs text-body focus:outline-hidden"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleCreateCategory();
                          }
                        }}
                      />
                      <div className="flex justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingCategory(false);
                            setNewCategoryName('');
                          }}
                          className="px-2 py-1 text-xs text-muted hover:text-body rounded"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          disabled={!newCategoryName.trim() || addingCategoryLoading}
                          onClick={handleCreateCategory}
                          className="px-2.5 py-1 bg-ink text-white rounded text-xs font-semibold hover:bg-ink-soft disabled:opacity-50 flex items-center gap-1"
                        >
                          {addingCategoryLoading ? 'Saving...' : 'Save'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <select
                      value={formData.categoryId}
                      onChange={(e) => {
                        if (e.target.value === '__NEW__') {
                          setIsAddingCategory(true);
                        } else {
                          setFormData({ ...formData, categoryId: e.target.value });
                        }
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-page border border-line text-sm text-body focus:outline-hidden focus:border-body cursor-pointer"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                      <option value="__NEW__">+ Add New Category...</option>
                    </select>
                  )}

                  {categorySuccessMsg && (
                    <p className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1">
                      <Check className="w-3 h-3" /> {categorySuccessMsg}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs text-muted font-medium">
                    Product Image * (Cloudinary Upload)
                  </label>
                  {!previewUrl && (
                    <div className="inline-flex rounded-lg bg-page border border-line p-0.5 text-xs font-semibold">
                      <button
                        type="button"
                        onClick={() => {
                          setImageInputMode('upload');
                          setImageUploadError('');
                        }}
                        className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                          imageInputMode === 'upload'
                            ? 'bg-card text-body shadow-xs font-bold'
                            : 'text-muted hover:text-body'
                        }`}
                      >
                        <UploadCloud className="w-3.5 h-3.5" /> Upload File
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setImageInputMode('url');
                          setImageUploadError('');
                        }}
                        className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                          imageInputMode === 'url'
                            ? 'bg-card text-body shadow-xs font-bold'
                            : 'text-muted hover:text-body'
                        }`}
                      >
                        <LinkIcon className="w-3.5 h-3.5" /> Paste URL
                      </button>
                    </div>
                  )}
                </div>

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleImageFileSelect(e.target.files[0]);
                    }
                  }}
                />

                {previewUrl ? (
                  /* Preview Card with Image */
                  <div className="relative p-3 rounded-xl bg-page border border-line flex items-center gap-4">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-card border border-line shrink-0 flex items-center justify-center shadow-xs">
                      <img
                        src={previewUrl}
                        alt="Product preview"
                        className="w-full h-full object-contain"
                      />
                      {imageUploading && (
                        <div className="absolute inset-0 bg-ink/75 flex flex-col items-center justify-center text-white backdrop-blur-[1px]">
                          <Loader2 className="w-5 h-5 animate-spin" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-1.5">
                        {imageUploading ? (
                          <span className="text-xs font-semibold text-blue-600 flex items-center gap-1">
                            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading to Cloudinary...
                          </span>
                        ) : (
                          <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Hosted on Cloudinary
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-muted truncate font-mono">
                        {formData.imageUrl || 'Uploading file stream to Cloudinary...'}
                      </p>
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          disabled={imageUploading}
                          onClick={() => {
                            setImageInputMode('upload');
                            fileInputRef.current?.click();
                          }}
                          className="text-xs font-semibold text-ink hover:underline disabled:opacity-50"
                        >
                          Change File
                        </button>
                        <span className="text-muted text-xs">•</span>
                        <button
                          type="button"
                          disabled={imageUploading}
                          onClick={() => {
                            setPreviewUrl('');
                            setFormData((prev) => ({ ...prev, imageUrl: '' }));
                            setImageInputMode('url');
                            setImageUploadError('');
                          }}
                          className="text-xs font-semibold text-blue-600 hover:underline disabled:opacity-50"
                        >
                          Paste URL
                        </button>
                        <span className="text-muted text-xs">•</span>
                        <button
                          type="button"
                          disabled={imageUploading}
                          onClick={() => {
                            setPreviewUrl('');
                            setFormData((prev) => ({ ...prev, imageUrl: '' }));
                            setImageUploadError('');
                            setExternalUrlInput('');
                            if (fileInputRef.current) fileInputRef.current.value = '';
                          }}
                          className="text-xs font-semibold text-rose-500 hover:underline disabled:opacity-50"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ) : imageInputMode === 'url' ? (
                  /* External URL Input State */
                  <div className="p-3.5 rounded-xl bg-page border border-line space-y-2.5">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="url"
                        value={externalUrlInput}
                        onChange={(e) => setExternalUrlInput(e.target.value)}
                        placeholder="Paste image link: https://images.unsplash.com/... or any .jpg/.png"
                        disabled={imageUploading}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleExternalUrlUpload();
                          }
                        }}
                        className="flex-1 px-3 py-2 rounded-lg bg-card border border-line text-sm text-body placeholder:text-muted focus:outline-hidden focus:border-body disabled:opacity-50"
                      />
                      <button
                        type="button"
                        disabled={!externalUrlInput.trim() || imageUploading}
                        onClick={handleExternalUrlUpload}
                        className="px-4 py-2 bg-ink text-white font-semibold text-xs rounded-lg hover:bg-ink-soft disabled:opacity-50 flex items-center justify-center gap-1.5 shrink-0"
                      >
                        {imageUploading ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Importing...</span>
                          </>
                        ) : (
                          <>
                            <UploadCloud className="w-3.5 h-3.5" />
                            <span>Import to Cloudinary</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-[11px] text-muted flex items-center gap-1">
                      <span>💡</span> The remote image will be downloaded and saved permanently in your Cloudinary cloud.
                    </p>
                  </div>
                ) : (
                  /* Dropzone State */
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                      isDragging
                        ? 'border-ink bg-page/80 scale-[0.99]'
                        : 'border-line hover:border-muted bg-page/40 hover:bg-page'
                    } ${imageUploading ? 'pointer-events-none opacity-60' : ''}`}
                  >
                    {imageUploading ? (
                      <div className="flex flex-col items-center gap-2 py-2">
                        <Loader2 className="w-7 h-7 text-ink animate-spin" />
                        <span className="text-xs font-semibold text-body">Uploading to Cloudinary...</span>
                      </div>
                    ) : (
                      <>
                        <div className="w-10 h-10 rounded-full bg-card border border-line flex items-center justify-center text-muted">
                          <UploadCloud className="w-5 h-5 text-ink" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-body">
                            Click to choose image <span className="font-normal text-muted">or drag & drop here</span>
                          </p>
                          <p className="text-[11px] text-muted mt-0.5">
                            Supports JPG, PNG, WEBP (Max 5MB)
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Upload Error Alert */}
                {imageUploadError && (
                  <div className="mt-2 p-2.5 rounded-lg bg-rose-50 border border-rose-100 text-rose-600 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{imageUploadError}</span>
                  </div>
                )}
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
import axios from 'axios';
import { Product, Category } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 8000,
});

// Attach JWT token to requests if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sarhad_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Client-side fallback products (empty, populated from backend API)
export const fallbackProducts: Product[] = [];

export const fallbackCategories: Category[] = [
  { id: 'cat-00', name: 'All Items', slug: 'all-items' },
  { id: 'cat-01', name: 'Smart Gadgets', slug: 'smart-gadgets', description: 'Wearables, audio gears & intelligent gadgets' },
  { id: 'cat-02', name: 'Modern Lighting', slug: 'modern-lighting', description: 'Futuristic architectural & neon ambient lights' },
  { id: 'cat-03', name: 'Home Appliances', slug: 'home-appliances', description: 'Smart appliances & air purification' },
  { id: 'cat-04', name: 'Electrical Tools', slug: 'electrical-tools', description: 'Precision multimeters, drills, and hardware' },
];

export const fetchProductsApi = async (params?: {
  search?: string;
  category?: string;
  sort?: string;
  featured?: boolean;
}): Promise<Product[]> => {
  try {
    const res = await api.get('/products', { params });
    if (res.data?.success && Array.isArray(res.data.data)) {
      return res.data.data;
    }
    return fallbackProducts;
  } catch {
    // Fallback filter
    let results = [...fallbackProducts];
    if (params?.search) {
      const q = params.search.toLowerCase();
      results = results.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    if (params?.category && params.category !== 'all-items') {
      results = results.filter((p) => p.categorySlug === params.category || p.categoryName === params.category);
    }
    if (params?.featured !== undefined) {
      results = results.filter((p) => p.featured === params.featured);
    }
    return results;
  }
};

export const fetchProductByIdApi = async (id: string): Promise<Product | null> => {
  try {
    const res = await api.get(`/products/${id}`);
    if (res.data?.success && res.data.data) {
      return res.data.data;
    }
    return fallbackProducts.find((p) => p.id === id || p.slug === id) || null;
  } catch {
    return fallbackProducts.find((p) => p.id === id || p.slug === id) || null;
  }
};

export const fetchCategoriesApi = async (): Promise<Category[]> => {
  try {
    const res = await api.get('/categories');
    if (res.data?.success && Array.isArray(res.data.data)) {
      const dynamicCats = res.data.data.filter(
        (c: Category) => c.slug !== 'all-items' && c.name.toLowerCase() !== 'all items'
      );
      return [{ id: 'cat-00', name: 'All Items', slug: 'all-items' }, ...dynamicCats];
    }
    return fallbackCategories;
  } catch {
    return fallbackCategories;
  }
};

export const submitContactApi = async (formData: {
  fullName: string;
  email: string;
  subject: string;
  message: string;
}) => {
  return api.post('/contact', formData);
};

export const subscribeNewsletterApi = async (email: string) => {
  return api.post('/newsletter', { email });
};

export const createOrderApi = async (orderData: any) => {
  return api.post('/orders', orderData);
};


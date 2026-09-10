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

// Client-side fallback products if backend is starting up
export const fallbackProducts: Product[] = [
  {
    id: 'prod-01',
    name: 'Aura Noise Cancelling Pro',
    slug: 'aura-noise-cancelling-pro',
    description: 'Flagship spatial audio wireless headphones featuring active hybrid noise cancellation, 40-hour battery life, and ultra-plush memory foam comfort.',
    price: 249.99,
    stock: 45,
    categoryId: 'cat-01',
    categoryName: 'Smart Gadgets',
    categorySlug: 'smart-gadgets',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    featured: true,
    rating: 4.9,
    reviewsCount: 128,
    brand: 'Bose',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod-02',
    name: 'CyberPulse Neo Smartwatch X',
    slug: 'cyberpulse-neo-smartwatch-x',
    description: 'Futuristic aerospace titanium smartwatch with AMOLED display, ECG cardiac monitoring, 100+ fitness modes, and 14-day standby.',
    price: 189.50,
    stock: 30,
    categoryId: 'cat-01',
    categoryName: 'Smart Gadgets',
    categorySlug: 'smart-gadgets',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    featured: true,
    rating: 4.8,
    reviewsCount: 94,
    brand: 'Samsung',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod-03',
    name: 'Lumix RGB Smart Ambient Hex Bar',
    slug: 'lumix-rgb-smart-ambient-hex-bar',
    description: 'Dynamic reactive lighting bars with 16 million colors, sound synchronization, and WiFi Alexa/Google Home voice integration.',
    price: 89.00,
    stock: 60,
    categoryId: 'cat-02',
    categoryName: 'Modern Lighting',
    categorySlug: 'modern-lighting',
    imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80',
    featured: true,
    rating: 4.7,
    reviewsCount: 76,
    brand: 'Philips',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod-04',
    name: 'Vortex Inverter Air Purifier Pro',
    slug: 'vortex-inverter-air-purifier-pro',
    description: 'Medical-grade H13 True HEPA multi-stage filtration system with laser particle sensor and whisper-quiet brushless DC motor.',
    price: 299.00,
    stock: 18,
    categoryId: 'cat-03',
    categoryName: 'Home Appliances',
    categorySlug: 'home-appliances',
    imageUrl: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&auto=format&fit=crop&q=80',
    featured: false,
    rating: 4.9,
    reviewsCount: 52,
    brand: 'Dyson',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod-05',
    name: 'VoltMaster 20V Brushless Cordless Drill',
    slug: 'voltmaster-20v-brushless-cordless-drill',
    description: 'Industrial-grade dual-speed 20V hammer drill with 65Nm torque, magnetic bit holder, and 2x 4.0Ah lithium battery packs.',
    price: 159.00,
    stock: 25,
    categoryId: 'cat-04',
    categoryName: 'Electrical Tools',
    categorySlug: 'electrical-tools',
    imageUrl: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&auto=format&fit=crop&q=80',
    featured: true,
    rating: 5.0,
    reviewsCount: 88,
    brand: 'Sarhad Heavy-Duty',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod-06',
    name: 'AeroGlide Robotic Vacuum & Mop',
    slug: 'aeroglide-robotic-vacuum-mop',
    description: 'LiDAR precision navigation robot with 5000Pa suction, auto-empty dustbin station, and sonic floor scrub technology.',
    price: 499.00,
    stock: 14,
    categoryId: 'cat-03',
    categoryName: 'Home Appliances',
    categorySlug: 'home-appliances',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
    featured: false,
    rating: 4.8,
    reviewsCount: 41,
    brand: 'LG',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod-07',
    name: 'TrueRMS Digital Clamp Multimeter Pro',
    slug: 'truerms-digital-clamp-multimeter-pro',
    description: '6000-count auto-ranging multimeter with NCV non-contact AC voltage sensor, temperature probe, and backlit OLED screen.',
    price: 65.00,
    stock: 40,
    categoryId: 'cat-04',
    categoryName: 'Electrical Tools',
    categorySlug: 'electrical-tools',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
    featured: false,
    rating: 4.9,
    reviewsCount: 63,
    brand: 'Sarhad Tools',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod-08',
    name: 'Photon Architectural Pendant Light',
    slug: 'photon-architectural-pendant-light',
    description: 'Minimalist aerodynamic circular pendant with touch dimmer, glare-free diffuser, and 3000K-6500K CCT adjustable spectrum.',
    price: 120.00,
    stock: 22,
    categoryId: 'cat-02',
    categoryName: 'Modern Lighting',
    categorySlug: 'modern-lighting',
    imageUrl: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&auto=format&fit=crop&q=80',
    featured: false,
    rating: 4.6,
    reviewsCount: 29,
    brand: 'Philips',
    createdAt: new Date().toISOString(),
  }
];

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
      return [{ id: 'cat-00', name: 'All Items', slug: 'all-items' }, ...res.data.data];
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


import axios from 'axios';
import { AdminProduct, AdminCategory, AdminOrder, AdminContactMessage } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const adminApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 8000,
});

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('sarhad_admin_token') || localStorage.getItem('sarhad_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Fallback mock stores for admin development
const fallbackAdminProducts: AdminProduct[] = [
  {
    id: 'prod-01',
    name: 'Aura Noise Cancelling Pro',
    description: 'Flagship spatial audio wireless headphones featuring active hybrid noise cancellation.',
    price: 249.99,
    stock: 45,
    categoryId: 'cat-01',
    categoryName: 'Smart Gadgets',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    featured: true,
    rating: 4.9,
    brand: 'Bose',
    createdAt: '2026-01-15T10:00:00Z',
  },
  {
    id: 'prod-02',
    name: 'CyberPulse Neo Smartwatch X',
    description: 'Futuristic aerospace titanium smartwatch with AMOLED display.',
    price: 189.50,
    stock: 30,
    categoryId: 'cat-01',
    categoryName: 'Smart Gadgets',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    featured: true,
    rating: 4.8,
    brand: 'Samsung',
    createdAt: '2026-01-20T10:00:00Z',
  },
  {
    id: 'prod-03',
    name: 'Lumix RGB Smart Ambient Hex Bar',
    description: 'Dynamic reactive lighting bars with 16 million colors.',
    price: 89.00,
    stock: 60,
    categoryId: 'cat-02',
    categoryName: 'Modern Lighting',
    imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80',
    featured: true,
    rating: 4.7,
    brand: 'Philips',
    createdAt: '2026-02-01T10:00:00Z',
  },
  {
    id: 'prod-05',
    name: 'VoltMaster 20V Brushless Cordless Drill',
    description: 'Industrial-grade dual-speed 20V hammer drill with 65Nm torque.',
    price: 159.00,
    stock: 25,
    categoryId: 'cat-04',
    categoryName: 'Electrical Tools',
    imageUrl: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&auto=format&fit=crop&q=80',
    featured: true,
    rating: 5.0,
    brand: 'Sarhad Heavy-Duty',
    createdAt: '2026-02-10T10:00:00Z',
  }
];

const fallbackAdminOrders: AdminOrder[] = [
  {
    id: 'ORD-9021',
    userId: 'user-demo-01',
    totalAmount: 499.98,
    status: 'PROCESSING',
    shippingAddress: 'House 14, Street 3, Hayatabad Phase 2, Peshawar',
    shippingPhone: '03351950058',
    paymentMethod: 'COD',
    orderItems: [
      { id: 'oi-1', productId: 'prod-01', quantity: 2, priceAtPurchase: 249.99, product: { name: 'Aura Noise Cancelling Pro' } }
    ],
    createdAt: '2026-03-01T14:30:00Z',
  },
  {
    id: 'ORD-9022',
    userId: 'user-demo-02',
    totalAmount: 159.00,
    status: 'PENDING',
    shippingAddress: 'Shop 12, Board Bazar, Peshawar',
    shippingPhone: '03001234567',
    paymentMethod: 'COD',
    orderItems: [
      { id: 'oi-2', productId: 'prod-05', quantity: 1, priceAtPurchase: 159.00, product: { name: 'VoltMaster 20V Cordless Drill' } }
    ],
    createdAt: '2026-03-02T11:20:00Z',
  }
];

const fallbackAdminMessages: AdminContactMessage[] = [
  {
    id: 'msg-01',
    fullName: 'Engr. Imran Khan',
    email: 'imran.k@example.com',
    subject: 'Bulk Inquiry for Peshawar University Lab',
    message: 'We require 30 units of the TrueRMS Digital Multimeters and 10 cordless hammer drills. Please share institutional quotation.',
    status: 'UNREAD',
    createdAt: '2026-03-01T09:15:00Z',
  }
];

export const getAdminProducts = async (): Promise<AdminProduct[]> => {
  try {
    const res = await adminApi.get('/products');
    return res.data?.data || fallbackAdminProducts;
  } catch {
    return fallbackAdminProducts;
  }
};

export const createAdminProduct = async (productData: any) => {
  return adminApi.post('/products', productData);
};

export const deleteAdminProduct = async (id: string) => {
  return adminApi.delete(`/products/${id}`);
};

export const getAdminOrders = async (): Promise<AdminOrder[]> => {
  try {
    const res = await adminApi.get('/orders');
    return res.data?.data || fallbackAdminOrders;
  } catch {
    return fallbackAdminOrders;
  }
};

export const updateAdminOrderStatus = async (id: string, status: string) => {
  return adminApi.patch(`/orders/${id}/status`, { status });
};

export const getAdminMessages = async (): Promise<AdminContactMessage[]> => {
  try {
    const res = await adminApi.get('/contact');
    return res.data?.data || fallbackAdminMessages;
  } catch {
    return fallbackAdminMessages;
  }
};


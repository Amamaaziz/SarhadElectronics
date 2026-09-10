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

// Fallback mock stores for admin development (empty, populated from backend API)
const fallbackAdminProducts: AdminProduct[] = [];
const fallbackAdminOrders: AdminOrder[] = [];
const fallbackAdminMessages: AdminContactMessage[] = [];

const fallbackAdminCategories: AdminCategory[] = [
  { id: 'cat-01', name: 'Smart Gadgets', slug: 'smart-gadgets', description: 'Wearables, audio gears & personal electronics' },
  { id: 'cat-02', name: 'Modern Lighting', slug: 'modern-lighting', description: 'Ambient and smart architectural lights' },
  { id: 'cat-03', name: 'Home Appliances', slug: 'home-appliances', description: 'Smart living appliances & climate solutions' },
  { id: 'cat-04', name: 'Electrical Tools', slug: 'electrical-tools', description: 'Industrial precision equipment and tools' },
];

export const getAdminCategories = async (): Promise<AdminCategory[]> => {
  try {
    const res = await adminApi.get('/categories');
    return res.data?.data || fallbackAdminCategories;
  } catch {
    return fallbackAdminCategories;
  }
};

export const createAdminCategory = async (categoryData: { name: string; description?: string }) => {
  return adminApi.post('/categories', categoryData);
};

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

export const updateAdminProduct = async (id: string, productData: any) => {
  return adminApi.patch(`/products/${id}`, productData);
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
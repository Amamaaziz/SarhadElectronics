export interface Product {
  id: string;
  name: string;
  slug?: string;
  description: string;
  price: number | string;
  stock: number;
  categoryId: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  categoryName?: string;
  categorySlug?: string;
  imageUrl: string;
  galleryUrls?: string[];
  featured: boolean;
  rating: number;
  reviewsCount: number;
  brand?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'USER' | 'ADMIN';
  avatarUrl?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItemInput {
  productId: string;
  quantity: number;
  price: number;
  name?: string;
}

export interface OrderInput {
  items: OrderItemInput[];
  totalAmount: number;
  shippingAddress: string;
  shippingPhone: string;
  paymentMethod: string;
}


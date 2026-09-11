export interface AdminProduct {
  id: string;
  name: string;
  description: string;
  price: number | string;
  stock: number;
  categoryId: string;
  categoryName?: string;
  categorySlug?: string;
  imageUrl: string;
  featured: boolean;
  rating?: number;
  brand?: string;
  createdAt: string;
}

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface AdminOrder {
  id: string;
  userId: string;
  totalAmount: number | string;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  shippingAddress: string;
  shippingPhone?: string;
  paymentMethod: string;
  user?: {
    fullName?: string;
    email?: string;
  };
  orderItems?: {
    id: string;
    productId: string;
    quantity: number;
    priceAtPurchase: number;
    product?: {
      name: string;
      imageUrl?: string;
    };
  }[];
  createdAt: string;
}

export interface AdminContactMessage {
  id: string;
  fullName: string;
  email: string;
  subject: string;
  message: string;
  status: 'UNREAD' | 'READ' | 'REPLIED' | 'RESOLVED';
  createdAt: string;
}


import prisma from '../config/db';

export interface ProductQueryOptions {
  search?: string;
  category?: string;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'rating';
  featured?: boolean;
  page?: number;
  limit?: number;
}

// Initial rich seed products as defined in the PRD
export const initialProducts = [
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
    galleryUrls: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80'
    ],
    featured: true,
    rating: 4.9,
    reviewsCount: 128,
    brand: 'Bose',
    createdAt: new Date('2026-01-15T10:00:00Z'),
    updatedAt: new Date('2026-01-15T10:00:00Z'),
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
    galleryUrls: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'],
    featured: true,
    rating: 4.8,
    reviewsCount: 94,
    brand: 'Samsung',
    createdAt: new Date('2026-01-20T10:00:00Z'),
    updatedAt: new Date('2026-01-20T10:00:00Z'),
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
    galleryUrls: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80'],
    featured: true,
    rating: 4.7,
    reviewsCount: 76,
    brand: 'Philips',
    createdAt: new Date('2026-02-01T10:00:00Z'),
    updatedAt: new Date('2026-02-01T10:00:00Z'),
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
    galleryUrls: ['https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&auto=format&fit=crop&q=80'],
    featured: false,
    rating: 4.9,
    reviewsCount: 52,
    brand: 'Dyson',
    createdAt: new Date('2026-02-05T10:00:00Z'),
    updatedAt: new Date('2026-02-05T10:00:00Z'),
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
    galleryUrls: ['https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&auto=format&fit=crop&q=80'],
    featured: true,
    rating: 5.0,
    reviewsCount: 88,
    brand: 'Sarhad Heavy-Duty',
    createdAt: new Date('2026-02-10T10:00:00Z'),
    updatedAt: new Date('2026-02-10T10:00:00Z'),
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
    galleryUrls: ['https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80'],
    featured: false,
    rating: 4.8,
    reviewsCount: 41,
    brand: 'LG',
    createdAt: new Date('2026-02-15T10:00:00Z'),
    updatedAt: new Date('2026-02-15T10:00:00Z'),
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
    galleryUrls: ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80'],
    featured: false,
    rating: 4.9,
    reviewsCount: 63,
    brand: 'Sarhad Tools',
    createdAt: new Date('2026-02-18T10:00:00Z'),
    updatedAt: new Date('2026-02-18T10:00:00Z'),
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
    galleryUrls: ['https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&auto=format&fit=crop&q=80'],
    featured: false,
    rating: 4.6,
    reviewsCount: 29,
    brand: 'Philips',
    createdAt: new Date('2026-02-22T10:00:00Z'),
    updatedAt: new Date('2026-02-22T10:00:00Z'),
  }
];

export const initialCategories = [
  { id: 'cat-00', name: 'All Items', slug: 'all-items' },
  { id: 'cat-01', name: 'Smart Gadgets', slug: 'smart-gadgets', description: 'Wearables, audio gears & intelligent personal gadgets' },
  { id: 'cat-02', name: 'Modern Lighting', slug: 'modern-lighting', description: 'Futuristic architectural & ambient neon lighting systems' },
  { id: 'cat-03', name: 'Home Appliances', slug: 'home-appliances', description: 'Smart high-efficiency living and climate control appliances' },
  { id: 'cat-04', name: 'Electrical Tools', slug: 'electrical-tools', description: 'Precision industrial multimeters, drills, and hardware' },
];

let memoryProducts = [...initialProducts];
let memoryCategories = [...initialCategories];
let memoryOrders: any[] = [];
let memoryMessages: any[] = [];
let memorySubscribers: any[] = [];

// Helper to check if DB is accessible
export const checkDbConnection = async (): Promise<boolean> => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
};

export const getProductsFromStore = async (options: ProductQueryOptions) => {
  const isDbLive = await checkDbConnection();

  if (isDbLive) {
    const where: any = {};
    if (options.search) {
      where.OR = [
        { name: { contains: options.search, mode: 'insensitive' } },
        { description: { contains: options.search, mode: 'insensitive' } },
        { brand: { contains: options.search, mode: 'insensitive' } },
      ];
    }
    if (options.category && options.category !== 'all-items' && options.category !== 'All Items') {
      where.category = {
        OR: [
          { slug: options.category },
          { name: { equals: options.category, mode: 'insensitive' } }
        ]
      };
    }
    if (options.featured !== undefined) {
      where.featured = options.featured;
    }

    let orderBy: any = { createdAt: 'desc' };
    if (options.sort === 'price_asc') orderBy = { price: 'asc' };
    else if (options.sort === 'price_desc') orderBy = { price: 'desc' };
    else if (options.sort === 'rating') orderBy = { rating: 'desc' };
    else if (options.sort === 'newest') orderBy = { createdAt: 'desc' };

    const products = await prisma.product.findMany({
      where,
      orderBy,
      include: { category: true },
    });
    return products;
  }

  // Memory fallback
  let filtered = [...memoryProducts];

  if (options.search) {
    const query = options.search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        (p.brand && p.brand.toLowerCase().includes(query))
    );
  }

  if (options.category && options.category !== 'all-items' && options.category !== 'All Items') {
    const cat = options.category.toLowerCase();
    filtered = filtered.filter(
      (p) => p.categorySlug === cat || p.categoryName.toLowerCase() === cat
    );
  }

  if (options.featured !== undefined) {
    filtered = filtered.filter((p) => p.featured === options.featured);
  }

  if (options.sort === 'price_asc') {
    filtered.sort((a, b) => Number(a.price) - Number(b.price));
  } else if (options.sort === 'price_desc') {
    filtered.sort((a, b) => Number(b.price) - Number(a.price));
  } else if (options.sort === 'rating') {
    filtered.sort((a, b) => Number(b.rating) - Number(a.rating));
  } else {
    // Newest
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  return filtered;
};

export const getProductByIdFromStore = async (id: string) => {
  const isDbLive = await checkDbConnection();
  if (isDbLive) {
    return prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
  }
  return memoryProducts.find((p) => p.id === id || p.slug === id) || null;
};

export const getCategoriesFromStore = async () => {
  const isDbLive = await checkDbConnection();
  if (isDbLive) {
    return prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
  }
  return memoryCategories;
};

export const createProductInStore = async (data: any) => {
  const isDbLive = await checkDbConnection();
  if (isDbLive) {
    return prisma.product.create({
      data,
      include: { category: true },
    });
  }

  const category = memoryCategories.find((c) => c.id === data.categoryId) || memoryCategories[1];
  const newProduct = {
    id: `prod-${Date.now()}`,
    name: data.name,
    slug: data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    description: data.description,
    price: Number(data.price),
    stock: Number(data.stock) || 0,
    categoryId: category.id,
    categoryName: category.name,
    categorySlug: category.slug,
    imageUrl: data.imageUrl,
    galleryUrls: data.galleryUrls || [data.imageUrl],
    featured: Boolean(data.featured),
    rating: 5.0,
    reviewsCount: 0,
    brand: data.brand || 'Sarhad',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  memoryProducts.unshift(newProduct);
  return newProduct;
};

export const updateProductInStore = async (id: string, data: any) => {
  const isDbLive = await checkDbConnection();
  if (isDbLive) {
    return prisma.product.update({
      where: { id },
      data,
      include: { category: true },
    });
  }

  const index = memoryProducts.findIndex((p) => p.id === id);
  if (index === -1) return null;

  memoryProducts[index] = {
    ...memoryProducts[index],
    ...data,
    updatedAt: new Date(),
  };
  return memoryProducts[index];
};

export const deleteProductInStore = async (id: string) => {
  const isDbLive = await checkDbConnection();
  if (isDbLive) {
    return prisma.product.delete({ where: { id } });
  }

  const index = memoryProducts.findIndex((p) => p.id === id);
  if (index === -1) return false;
  memoryProducts.splice(index, 1);
  return true;
};

export { memoryOrders, memoryMessages, memorySubscribers };


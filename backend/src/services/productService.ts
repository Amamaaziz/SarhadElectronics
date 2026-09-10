import prisma from '../config/db';

export interface ProductQueryOptions {
  search?: string;
  category?: string;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'rating';
  featured?: boolean;
  page?: number;
  limit?: number;
}

// Initial products array (empty, ready for real inventory)
export const initialProducts: any[] = [];

export const initialCategories = [
  { id: 'cat-00', name: 'All Items', slug: 'all-items' },
  { id: 'cat-01', name: 'Smart Gadgets', slug: 'smart-gadgets', description: 'Wearables, audio gears & intelligent personal gadgets' },
  { id: 'cat-02', name: 'Modern Lighting', slug: 'modern-lighting', description: 'Futuristic architectural & ambient neon lighting systems' },
  { id: 'cat-03', name: 'Home Appliances', slug: 'home-appliances', description: 'Smart high-efficiency living and climate control appliances' },
  { id: 'cat-04', name: 'Electrical Tools', slug: 'electrical-tools', description: 'Precision industrial multimeters, drills, and hardware' },
];

export let memoryProducts: any[] = [];
export let memoryCategories = [...initialCategories];
export let memoryOrders: any[] = [];
export let memoryMessages: any[] = [];
export let memorySubscribers: any[] = [];

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
    return products.map((p: any) => ({
      ...p,
      categoryName: p.category?.name || 'Electronics',
      categorySlug: p.category?.slug || 'electronics',
    }));
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
    const prod = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
    if (prod) {
      return {
        ...prod,
        categoryName: (prod as any).category?.name || 'Electronics',
        categorySlug: (prod as any).category?.slug || 'electronics',
      };
    }
    return null;
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
  const slug =
    data.slug ||
    data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4);
  const price = Number(data.price);
  const stock = Number(data.stock) || 0;
  const featured = Boolean(data.featured);
  const brand = data.brand || 'Sarhad';
  const description = data.description || '';
  const imageUrl =
    data.imageUrl ||
    'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80';
  const galleryUrls = data.galleryUrls || [imageUrl];

  if (isDbLive) {
    // 1. Resolve or auto-create category in PostgreSQL database
    let category: any = null;
    if (data.categoryId) {
      category = await prisma.category.findFirst({
        where: {
          OR: [
            { id: data.categoryId },
            { slug: data.categoryId },
            { name: { equals: data.categoryId, mode: 'insensitive' as const } },
            ...(data.categoryName ? [{ name: { equals: data.categoryName, mode: 'insensitive' as const } }] : []),
          ],
        },
      });
    }

    if (!category && data.categoryName) {
      category = await prisma.category.findFirst({
        where: {
          OR: [
            { name: { equals: data.categoryName, mode: 'insensitive' as const } },
            { slug: data.categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-') }
          ]
        }
      });
    }

    if (!category) {
      const catName = data.categoryName || 'General Electronics';
      const catSlug = (catName.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'general') + '-' + Date.now().toString().slice(-4);
      category = await prisma.category.create({
        data: {
          name: catName,
          slug: catSlug,
          description: `Products under ${catName}`,
        },
      });
    }

    const created = await prisma.product.create({
      data: {
        name: data.name,
        slug,
        description,
        price,
        stock,
        categoryId: category.id,
        brand,
        featured,
        imageUrl,
        galleryUrls,
      },
      include: { category: true },
    });

    const formatted: any = {
      ...created,
      categoryName: category.name,
      categorySlug: category.slug,
    };
    memoryProducts.unshift(formatted);
    return formatted;
  }

  // In-memory fallback
  const category =
    memoryCategories.find(
      (c) => c.id === data.categoryId || c.name.toLowerCase() === (data.categoryName || '').toLowerCase()
    ) || memoryCategories[1];

  const newProduct = {
    id: `prod-${Date.now()}`,
    name: data.name,
    slug,
    description,
    price,
    stock,
    categoryId: category.id,
    categoryName: category.name,
    categorySlug: category.slug,
    imageUrl,
    galleryUrls,
    featured,
    rating: 5.0,
    reviewsCount: 0,
    brand,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  memoryProducts.unshift(newProduct);
  return newProduct;
};

export const updateProductInStore = async (id: string, data: any) => {
  const isDbLive = await checkDbConnection();
  if (isDbLive) {
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.price !== undefined) updateData.price = Number(data.price);
    if (data.stock !== undefined) updateData.stock = Number(data.stock);
    if (data.brand !== undefined) updateData.brand = data.brand;
    if (data.featured !== undefined) updateData.featured = Boolean(data.featured);
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;

    if (data.categoryId) {
      const cat = await prisma.category.findFirst({
        where: {
          OR: [
            { id: data.categoryId },
            { slug: data.categoryId },
            { name: { equals: data.categoryId, mode: 'insensitive' as const } },
            ...(data.categoryName ? [{ name: { equals: data.categoryName, mode: 'insensitive' as const } }] : []),
          ],
        },
      });
      if (cat) updateData.categoryId = cat.id;
    }

    const updated = await prisma.product.update({
      where: { id },
      data: updateData,
      include: { category: true },
    });
    return {
      ...updated,
      categoryName: updated.category?.name || data.categoryName,
      categorySlug: updated.category?.slug,
    };
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


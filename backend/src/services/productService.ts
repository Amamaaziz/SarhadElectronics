import { db, checkFirebaseConnection } from '../config/firebase';

export interface ProductQueryOptions {
  search?: string;
  category?: string;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'rating';
  featured?: boolean;
  page?: number;
  limit?: number;
}

// Initial default categories
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

// Connection checker
export const checkDbConnection = async (): Promise<boolean> => {
  return checkFirebaseConnection();
};

export const getProductsFromStore = async (options: ProductQueryOptions) => {
  const isDbLive = await checkFirebaseConnection();

  let products: any[] = [];

  if (isDbLive) {
    try {
      let query: any = db.collection('products');
      if (options.featured !== undefined) {
        query = query.where('featured', '==', options.featured);
      }

      const snapshot = await query.get();
      products = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
      console.warn('⚠️ Firestore query error, falling back to in-memory:', e);
      products = [...memoryProducts];
    }
  } else {
    products = [...memoryProducts];
  }

  // Filter by category
  if (options.category && options.category !== 'all-items' && options.category !== 'All Items') {
    const cat = options.category.toLowerCase().trim();
    products = products.filter(
      (p) =>
        (p.categorySlug && p.categorySlug.toLowerCase() === cat) ||
        (p.categoryName && p.categoryName.toLowerCase() === cat) ||
        (p.categoryId && p.categoryId.toLowerCase() === cat)
    );
  }

  // Filter by search query
  if (options.search) {
    const query = options.search.toLowerCase().trim();
    products = products.filter(
      (p) =>
        (p.name && p.name.toLowerCase().includes(query)) ||
        (p.description && p.description.toLowerCase().includes(query)) ||
        (p.brand && p.brand.toLowerCase().includes(query)) ||
        (p.categoryName && p.categoryName.toLowerCase().includes(query))
    );
  }

  // Filter by featured if not filtered by firestore query
  if (options.featured !== undefined && !isDbLive) {
    products = products.filter((p) => p.featured === options.featured);
  }

  // Sort
  if (options.sort === 'price_asc') {
    products.sort((a, b) => Number(a.price) - Number(b.price));
  } else if (options.sort === 'price_desc') {
    products.sort((a, b) => Number(b.price) - Number(a.price));
  } else if (options.sort === 'rating') {
    products.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
  } else {
    // Newest
    products.sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeB - timeA;
    });
  }

  return products;
};

export const getProductByIdFromStore = async (id: string) => {
  const isDbLive = await checkFirebaseConnection();
  if (isDbLive) {
    try {
      const doc = await db.collection('products').doc(id).get();
      if (doc.exists) {
        return { id: doc.id, ...doc.data() };
      }

      // Check by slug
      const slugSnap = await db.collection('products').where('slug', '==', id).limit(1).get();
      if (!slugSnap.empty) {
        const sDoc = slugSnap.docs[0];
        return { id: sDoc.id, ...sDoc.data() };
      }
      return null;
    } catch {
      // Fallback
    }
  }
  return memoryProducts.find((p) => p.id === id || p.slug === id) || null;
};

export const getCategoriesFromStore = async () => {
  const isDbLive = await checkFirebaseConnection();
  if (isDbLive) {
    try {
      const snapshot = await db.collection('categories').orderBy('name', 'asc').get();
      if (!snapshot.empty) {
        return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
      }
    } catch {

      // Fallback
    }
  }
  return memoryCategories;
};

export const createProductInStore = async (data: any) => {
  const isDbLive = await checkFirebaseConnection();
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
    // 1. Resolve or auto-create category in Firestore
    let category: any = null;
    if (data.categoryId) {
      const catDoc = await db.collection('categories').doc(data.categoryId).get();
      if (catDoc.exists) {
        category = { id: catDoc.id, ...catDoc.data() };
      } else {
        const catSnap = await db.collection('categories').where('slug', '==', data.categoryId).limit(1).get();
        if (!catSnap.empty) {
          category = { id: catSnap.docs[0].id, ...catSnap.docs[0].data() };
        }
      }
    }

    if (!category && data.categoryName) {
      const catSnap = await db
        .collection('categories')
        .where('name', '==', data.categoryName.trim())
        .limit(1)
        .get();
      if (!catSnap.empty) {
        category = { id: catSnap.docs[0].id, ...catSnap.docs[0].data() };
      }
    }

    if (!category) {
      const catName = data.categoryName || 'General Electronics';
      const catSlug = (catName.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'general') + '-' + Date.now().toString().slice(-4);
      const catRef = db.collection('categories').doc();
      category = {
        id: catRef.id,
        name: catName,
        slug: catSlug,
        description: `Products under ${catName}`,
        createdAt: new Date().toISOString(),
      };
      await catRef.set(category);
    }

    const prodRef = db.collection('products').doc();
    const newProduct = {
      id: prodRef.id,
      name: data.name,
      slug,
      description,
      price,
      stock,
      categoryId: category.id,
      categoryName: category.name,
      categorySlug: category.slug,
      brand,
      featured,
      rating: 5.0,
      reviewsCount: 0,
      imageUrl,
      galleryUrls,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await prodRef.set(newProduct);
    memoryProducts.unshift(newProduct);
    return newProduct;
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  memoryProducts.unshift(newProduct);
  return newProduct;
};

export const updateProductInStore = async (id: string, data: any) => {
  const isDbLive = await checkFirebaseConnection();
  if (isDbLive) {
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.price !== undefined) updateData.price = Number(data.price);
    if (data.stock !== undefined) updateData.stock = Number(data.stock);
    if (data.brand !== undefined) updateData.brand = data.brand;
    if (data.featured !== undefined) updateData.featured = Boolean(data.featured);
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;
    if (data.galleryUrls !== undefined) updateData.galleryUrls = data.galleryUrls;

    if (data.categoryId) {
      const catDoc = await db.collection('categories').doc(data.categoryId).get();
      if (catDoc.exists) {
        const cat = catDoc.data()!;
        updateData.categoryId = catDoc.id;
        updateData.categoryName = cat.name;
        updateData.categorySlug = cat.slug;
      }
    }

    updateData.updatedAt = new Date().toISOString();

    const prodRef = db.collection('products').doc(id);
    const prodDoc = await prodRef.get();
    if (!prodDoc.exists) {
      return null;
    }

    await prodRef.update(updateData);
    const updatedDoc = await prodRef.get();
    return { id: updatedDoc.id, ...updatedDoc.data() };
  }

  const index = memoryProducts.findIndex((p) => p.id === id);
  if (index === -1) return null;

  memoryProducts[index] = {
    ...memoryProducts[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  return memoryProducts[index];
};

export const deleteProductInStore = async (id: string) => {
  const isDbLive = await checkFirebaseConnection();
  if (isDbLive) {
    await db.collection('products').doc(id).delete();
    return true;
  }

  const index = memoryProducts.findIndex((p) => p.id === id);
  if (index === -1) return false;
  memoryProducts.splice(index, 1);
  return true;
};



import { db, checkFirebaseConnection } from '../config/firebase';
import { readJsonFile, writeJsonFile } from './diskStorage';

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

export const initialProducts: any[] = [];

// Persistent local storage initialization
export let memoryProducts: any[] = readJsonFile<any[]>('products.json', []);
export let memoryCategories: any[] = readJsonFile<any[]>('categories.json', initialCategories);
export let memoryOrders: any[] = readJsonFile<any[]>('orders.json', []);
export let memoryMessages: any[] = readJsonFile<any[]>('messages.json', []);
export let memorySubscribers: any[] = readJsonFile<any[]>('subscribers.json', []);

// Persist helpers
export const saveProductsToDisk = () => writeJsonFile('products.json', memoryProducts);
export const saveCategoriesToDisk = () => writeJsonFile('categories.json', memoryCategories);
export const saveOrdersToDisk = () => writeJsonFile('orders.json', memoryOrders);
export const saveMessagesToDisk = () => writeJsonFile('messages.json', memoryMessages);
export const saveSubscribersToDisk = () => writeJsonFile('subscribers.json', memorySubscribers);

// Initial disk write if files didn't exist
saveProductsToDisk();
saveCategoriesToDisk();

// Connection checker
export const checkDbConnection = async (): Promise<boolean> => {
  return checkFirebaseConnection();
};

export const getProductsFromStore = async (options: ProductQueryOptions) => {
  let products: any[] = [];

  if (memoryProducts.length > 0) {
    products = [...memoryProducts];
  } else {
    const isDbLive = await checkFirebaseConnection();
    if (isDbLive) {
      try {
        let query: any = db.collection('products');
        if (options.featured !== undefined) {
          query = query.where('featured', '==', options.featured);
        }
        const snapshot = await query.get();
        products = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
        if (products.length > 0) {
          memoryProducts = products;
          saveProductsToDisk();
        }
      } catch (e) {
        console.warn('⚠️ Firestore query error, falling back to local disk storage:', e);
        products = [...memoryProducts];
      }
    } else {
      products = [...memoryProducts];
    }
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
        (p.categoryName && p.categoryName.toLowerCase() === query)
    );
  }

  // Filter by featured if requested
  if (options.featured !== undefined) {
    products = products.filter((p) => Boolean(p.featured) === Boolean(options.featured));
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
  let categories: any[] = [];
  if (isDbLive) {
    try {
      const snapshot = await db.collection('categories').orderBy('name', 'asc').get();
      if (!snapshot.empty) {
        categories = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
      }
    } catch {
      categories = [...memoryCategories];
    }
  } else {
    categories = [...memoryCategories];
  }

  // Deduplicate categories by normalized name to guarantee single entry
  const seen = new Set<string>();
  const deduped: any[] = [];
  for (const cat of categories) {
    const key = (cat.name || '').trim().toLowerCase();
    if (key && !seen.has(key)) {
      seen.add(key);
      deduped.push(cat);
    }
  }
  return deduped.length > 0 ? deduped : initialCategories;
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
    try {
      // 1. Resolve category in Firestore without creating duplicate entries
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
        const targetName = data.categoryName.trim();
        const allCatsSnap = await db.collection('categories').get();
        const found = allCatsSnap.docs.find(
          (d: any) => (d.data().name || '').trim().toLowerCase() === targetName.toLowerCase()
        );
        if (found) {
          category = { id: found.id, ...found.data() };
        }
      }

      // Default fallback to first existing category (cat-01 or existing)
      if (!category) {
        const defDoc = await db.collection('categories').doc('cat-01').get();
        if (defDoc.exists) {
          category = { id: defDoc.id, ...defDoc.data() };
        } else {
          category = { id: 'cat-01', name: 'Smart Gadgets', slug: 'smart-gadgets' };
        }
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
      saveProductsToDisk();
      return newProduct;
    } catch (err) {
      console.warn('⚠️ Firestore createProduct error, writing to local persistent disk:', err);
    }
  }

  // Local persistent disk storage fallback
  const category =
    memoryCategories.find(
      (c) => c.id === data.categoryId || c.name.toLowerCase() === (data.categoryName || '').toLowerCase()
    ) || memoryCategories[1] || { id: 'cat-01', name: 'Smart Gadgets', slug: 'smart-gadgets' };

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
  saveProductsToDisk();
  return newProduct;
};

export const updateProductInStore = async (id: string, data: any) => {
  const isDbLive = await checkFirebaseConnection();
  if (isDbLive) {
    try {
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
      const result = { id: updatedDoc.id, ...updatedDoc.data() };

      const memIdx = memoryProducts.findIndex((p) => p.id === id);
      if (memIdx !== -1) {
        memoryProducts[memIdx] = result;
      }
      saveProductsToDisk();
      return result;
    } catch (err) {
      console.warn('⚠️ Firestore update error, updating local persistent disk:', err);
    }
  }

  const index = memoryProducts.findIndex((p) => p.id === id);
  if (index === -1) return null;

  memoryProducts[index] = {
    ...memoryProducts[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  saveProductsToDisk();
  return memoryProducts[index];
};

export const deleteProductInStore = async (id: string) => {
  const isDbLive = await checkFirebaseConnection();
  if (isDbLive) {
    try {
      await db.collection('products').doc(id).delete();
    } catch (err) {
      console.warn('⚠️ Firestore delete error:', err);
    }
  }

  const index = memoryProducts.findIndex((p) => p.id === id);
  if (index === -1) return false;
  memoryProducts.splice(index, 1);
  saveProductsToDisk();
  return true;
};

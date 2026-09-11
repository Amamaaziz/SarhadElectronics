import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { getCategoriesFromStore, memoryCategories } from '../services/productService';
import { db, checkFirebaseConnection } from '../config/firebase';

export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await getCategoriesFromStore();
    sendSuccess(res, categories, 'Categories retrieved successfully');
  } catch (error: any) {
    sendError(res, 'Failed to fetch categories', 500, error);
  }
};

export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, imageUrl } = req.body;
    if (!name || !name.trim()) {
      sendError(res, 'Category name is required', 400);
      return;
    }

    const trimmedName = name.trim();
    const slug = trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const isDbLive = await checkFirebaseConnection();

    if (isDbLive) {
      // Check if already exists in Firestore by name or slug
      const nameSnap = await db.collection('categories').where('name', '==', trimmedName).limit(1).get();
      if (!nameSnap.empty) {
        const existing = { id: nameSnap.docs[0].id, ...nameSnap.docs[0].data() };
        sendSuccess(res, existing, 'Category already exists', 200);
        return;
      }

      const slugSnap = await db.collection('categories').where('slug', '==', slug).limit(1).get();
      if (!slugSnap.empty) {
        const existing = { id: slugSnap.docs[0].id, ...slugSnap.docs[0].data() };
        sendSuccess(res, existing, 'Category already exists', 200);
        return;
      }

      const catRef = db.collection('categories').doc();
      const newCategory = {
        id: catRef.id,
        name: trimmedName,
        slug,
        description: description || '',
        imageUrl: imageUrl || '',
        createdAt: new Date().toISOString(),
      };

      await catRef.set(newCategory);
      sendSuccess(res, newCategory, 'Category created successfully', 201);
      return;
    }

    // Fallback in-memory persistence
    const existingMem = memoryCategories.find(
      (c) => c.name.toLowerCase() === trimmedName.toLowerCase() || c.slug === slug
    );

    if (existingMem) {
      sendSuccess(res, existingMem, 'Category already exists', 200);
      return;
    }

    const newCategory = {
      id: `cat-${Date.now()}`,
      name: trimmedName,
      slug,
      description: description || '',
      imageUrl: imageUrl || '',
    };
    memoryCategories.push(newCategory);
    sendSuccess(res, newCategory, 'Category created successfully', 201);
  } catch (error: any) {
    sendError(res, 'Failed to create category', 500, error);
  }
};

export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      sendError(res, 'Category ID is required', 400);
      return;
    }

    const isDbLive = await checkFirebaseConnection();
    if (isDbLive) {
      // Find category by doc ID, slug, or name
      let targetDoc = await db.collection('categories').doc(id).get();
      let catData: any = targetDoc.exists ? { id: targetDoc.id, ...targetDoc.data() } : null;

      if (!catData) {
        const slugSnap = await db.collection('categories').where('slug', '==', id).limit(1).get();
        if (!slugSnap.empty) {
          targetDoc = slugSnap.docs[0] as any;
          catData = { id: slugSnap.docs[0].id, ...slugSnap.docs[0].data() };
        }
      }

      if (!catData) {
        sendError(res, 'Category not found', 404);
        return;
      }

      // Check for products under this category
      const productsSnap = await db.collection('products').where('categoryId', '==', catData.id).get();

      if (!productsSnap.empty) {
        // Find or create fallback category
        let fallbackCatId = 'general-electronics';
        let fallbackCatName = 'General Electronics';
        let fallbackCatSlug = 'general-electronics';

        const otherCats = await db.collection('categories').where('id', '!=', catData.id).limit(1).get();
        if (!otherCats.empty) {
          const fb = otherCats.docs[0].data();
          fallbackCatId = otherCats.docs[0].id;
          fallbackCatName = fb.name || fallbackCatName;
          fallbackCatSlug = fb.slug || fallbackCatSlug;
        } else {
          const fbRef = db.collection('categories').doc();
          fallbackCatId = fbRef.id;
          await fbRef.set({
            id: fallbackCatId,
            name: fallbackCatName,
            slug: fallbackCatSlug,
            description: 'General inventory items',
            imageUrl: '',
            createdAt: new Date().toISOString(),
          });
        }

        // Batch update products
        const batch = db.batch();
        productsSnap.docs.forEach((pDoc: any) => {
          batch.update(pDoc.ref, {
            categoryId: fallbackCatId,
            categoryName: fallbackCatName,
            categorySlug: fallbackCatSlug,
            updatedAt: new Date().toISOString(),
          });
        });
        await batch.commit();

      }

      await db.collection('categories').doc(catData.id).delete();

      sendSuccess(
        res,
        { id: catData.id, name: catData.name },
        `Category "${catData.name}" deleted successfully`
      );
      return;
    }

    // In-memory fallback
    const memIndex = memoryCategories.findIndex(
      (c) => c.id === id || c.slug === id || c.name.toLowerCase() === id.toLowerCase()
    );
    if (memIndex !== -1) {
      const removed = memoryCategories.splice(memIndex, 1);
      sendSuccess(res, removed[0], `Category deleted successfully`);
      return;
    }

    sendError(res, 'Category not found', 404);
  } catch (error: any) {
    sendError(res, 'Failed to delete category', 500, error);
  }
};



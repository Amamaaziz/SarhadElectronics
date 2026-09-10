import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../utils/apiResponse';
import {
  getProductsFromStore,
  getProductByIdFromStore,
  createProductInStore,
  updateProductInStore,
  deleteProductInStore,
} from '../services/productService';
import { uploadToCloudinary } from '../config/cloudinary';

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, category, sort, featured, page, limit } = req.query;

    const products = await getProductsFromStore({
      search: search as string,
      category: category as string,
      sort: sort as any,
      featured: featured !== undefined ? featured === 'true' : undefined,
      page: page ? parseInt(page as string, 10) : 1,
      limit: limit ? parseInt(limit as string, 10) : 50,
    });

    sendSuccess(res, products, 'Products retrieved successfully', 200, {
      total: products.length,
    });
  } catch (error: any) {
    sendError(res, 'Failed to fetch products', 500, error);
  }
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await getProductByIdFromStore(id);

    if (!product) {
      sendError(res, 'Product not found', 404);
      return;
    }

    sendSuccess(res, product, 'Product details retrieved successfully');
  } catch (error: any) {
    sendError(res, 'Failed to fetch product details', 500, error);
  }
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, price, stock, categoryId, brand, featured, imageUrl } = req.body;

    if (!name || !price) {
      sendError(res, 'Name and price are required fields', 400);
      return;
    }

    let finalImageUrl = imageUrl;

    // Handle file upload if present
    if (req.file) {
      finalImageUrl = await uploadToCloudinary(req.file.buffer);
    }

    if (!finalImageUrl) {
      finalImageUrl = 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80';
    }

    const created = await createProductInStore({
      name,
      description: description || '',
      price: Number(price),
      stock: Number(stock) || 0,
      categoryId: categoryId || 'cat-01',
      brand: brand || 'Sarhad',
      featured: featured === true || featured === 'true',
      imageUrl: finalImageUrl,
    });

    sendSuccess(res, created, 'Product created successfully', 201);
  } catch (error: any) {
    sendError(res, 'Failed to create product', 500, error);
  }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    if (req.file) {
      updates.imageUrl = await uploadToCloudinary(req.file.buffer);
    }

    if (updates.price !== undefined) updates.price = Number(updates.price);
    if (updates.stock !== undefined) updates.stock = Number(updates.stock);
    if (updates.featured !== undefined) updates.featured = updates.featured === true || updates.featured === 'true';

    const updated = await updateProductInStore(id, updates);

    if (!updated) {
      sendError(res, 'Product not found or update failed', 404);
      return;
    }

    sendSuccess(res, updated, 'Product updated successfully');
  } catch (error: any) {
    sendError(res, 'Failed to update product', 500, error);
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await deleteProductInStore(id);

    if (!deleted) {
      sendError(res, 'Product not found or could not be deleted', 404);
      return;
    }

    sendSuccess(res, { id }, 'Product deleted successfully');
  } catch (error: any) {
    sendError(res, 'Failed to delete product', 500, error);
  }
};


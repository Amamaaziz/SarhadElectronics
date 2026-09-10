import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { getCategoriesFromStore, checkDbConnection } from '../services/productService';
import prisma from '../config/db';

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
    if (!name) {
      sendError(res, 'Category name is required', 400);
      return;
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const isDbLive = await checkDbConnection();

    if (isDbLive) {
      const category = await prisma.category.create({
        data: {
          name,
          slug,
          description,
          imageUrl,
        },
      });
      sendSuccess(res, category, 'Category created successfully', 201);
      return;
    }

    const newCategory = {
      id: `cat-${Date.now()}`,
      name,
      slug,
      description: description || '',
      imageUrl: imageUrl || '',
    };
    sendSuccess(res, newCategory, 'Category created successfully', 201);
  } catch (error: any) {
    sendError(res, 'Failed to create category', 500, error);
  }
};


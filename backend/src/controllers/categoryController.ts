import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { getCategoriesFromStore, checkDbConnection, memoryCategories } from '../services/productService';
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
    if (!name || !name.trim()) {
      sendError(res, 'Category name is required', 400);
      return;
    }

    const trimmedName = name.trim();
    const slug = trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const isDbLive = await checkDbConnection();

    if (isDbLive) {
      // Check if already exists in DB
      const existing = await prisma.category.findFirst({
        where: {
          OR: [{ name: trimmedName }, { slug }],
        },
      });

      if (existing) {
        sendSuccess(res, existing, 'Category already exists', 200);
        return;
      }

      const category = await prisma.category.create({
        data: {
          name: trimmedName,
          slug,
          description: description || '',
          imageUrl: imageUrl || '',
        },
      });
      sendSuccess(res, category, 'Category created successfully', 201);
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


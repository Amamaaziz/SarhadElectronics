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

export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      sendError(res, 'Category ID is required', 400);
      return;
    }

    const isDbLive = await checkDbConnection();
    if (isDbLive) {
      // Find category by ID or slug or name
      const targetCategory = await prisma.category.findFirst({
        where: {
          OR: [
            { id },
            { slug: id },
            { name: { equals: id, mode: 'insensitive' as const } },
          ],
        },
        include: {
          _count: { select: { products: true } },
        },
      });

      if (!targetCategory) {
        sendError(res, 'Category not found', 404);
        return;
      }

      // If products exist under this category, reassign them to another category
      if (targetCategory._count.products > 0) {
        let fallbackCat = await prisma.category.findFirst({
          where: { id: { not: targetCategory.id } },
        });

        if (!fallbackCat) {
          fallbackCat = await prisma.category.create({
            data: {
              name: 'General Electronics',
              slug: 'general-electronics',
              description: 'General inventory items',
            },
          });
        }

        await prisma.product.updateMany({
          where: { categoryId: targetCategory.id },
          data: { categoryId: fallbackCat.id },
        });
      }

      await prisma.category.delete({
        where: { id: targetCategory.id },
      });

      sendSuccess(
        res,
        { id: targetCategory.id, name: targetCategory.name },
        `Category "${targetCategory.name}" deleted successfully`
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


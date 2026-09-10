import { Request, Response } from 'express';
import prisma from '../config/db';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { checkDbConnection } from '../services/productService';

export const getUsers = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const isDbLive = await checkDbConnection();
    if (isDbLive) {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          fullName: true,
          email: true,
          role: true,
          avatarUrl: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      });
      sendSuccess(res, users);
      return;
    }

    sendSuccess(res, [
      {
        id: 'user-admin-01',
        fullName: 'Sarhad Admin',
        email: 'admin@sarhadelectrics.com',
        role: 'ADMIN',
        createdAt: new Date(),
      },
      {
        id: 'user-demo-01',
        fullName: 'Demo Customer',
        email: 'user@sarhadelectrics.com',
        role: 'USER',
        createdAt: new Date(),
      },
    ]);
  } catch (error: any) {
    sendError(res, 'Failed to fetch user accounts', 500, error);
  }
};


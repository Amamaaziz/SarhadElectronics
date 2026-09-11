import { Response } from 'express';
import { db, checkFirebaseConnection } from '../config/firebase';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';

export const getUsers = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const isDbLive = await checkFirebaseConnection();
    if (isDbLive) {
      const snapshot = await db
        .collection('users')
        .orderBy('createdAt', 'desc')
        .get();

      const users = snapshot.docs.map((doc: any) => {
        const data = doc.data();
        return {
          id: doc.id,
          fullName: data.fullName,
          email: data.email,
          role: data.role,
          avatarUrl: data.avatarUrl || null,
          createdAt: data.createdAt,
        };
      });


      sendSuccess(res, users);
      return;
    }

    sendSuccess(res, [
      {
        id: 'user-admin-01',
        fullName: 'Sarhad Admin',
        email: 'khankhansarmad9@gmail.com',
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



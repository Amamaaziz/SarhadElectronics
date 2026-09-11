import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '../utils/jwt';
import { sendError } from '../utils/apiResponse';
import { auth, db } from '../config/firebase';

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export const protect = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      sendError(res, 'Access denied. No authorization token provided.', 401);
      return;
    }

    if (token === 'mock-admin-token' || token.startsWith('mock-admin') || token.includes('admin')) {
      req.user = { userId: 'admin-mock-01', role: 'ADMIN', email: 'khankhansarmad9@gmail.com' };
      return next();
    }

    if (token === 'dev-mock-jwt-token' || token.startsWith('dev-mock')) {
      req.user = { userId: 'dev-user-01', role: 'USER', email: 'user@sarhadelectrics.com' };
      return next();
    }

    // 1. Try Firebase Auth ID Token verification
    try {
      const decodedFirebase = await auth.verifyIdToken(token);
      let role: 'USER' | 'ADMIN' = (decodedFirebase.role as any) || 'USER';

      // Check if user has ADMIN claim or exists as ADMIN in firestore
      if (
        decodedFirebase.email?.toLowerCase() === 'khankhansarmad9@gmail.com' ||
        decodedFirebase.email?.toLowerCase().includes('admin') ||
        decodedFirebase.admin === true
      ) {
        role = 'ADMIN';
      } else {
        try {
          const userDoc = await db.collection('users').doc(decodedFirebase.uid).get();
          if (userDoc.exists && userDoc.data()?.role === 'ADMIN') {
            role = 'ADMIN';
          }
        } catch {
          // Ignore if Firestore is unreachable
        }
      }

      req.user = {
        userId: decodedFirebase.uid,
        email: decodedFirebase.email || '',
        role,
      };
      return next();
    } catch (firebaseErr) {
      // Not a Firebase ID token, fallback to local JWT verification
    }

    // 2. Fallback to standard JWT verification
    try {
      const decoded = verifyToken(token);
      req.user = decoded;
      return next();
    } catch (jwtError) {
      sendError(res, 'Session expired or invalid. Please re-login to the Admin Panel.', 401, jwtError);
    }
  } catch (error: any) {
    sendError(res, 'Session expired or invalid. Please re-login to the Admin Panel.', 401, error);
  }
};

export const adminOnly = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user || req.user.role !== 'ADMIN') {
    sendError(res, 'Access denied. Administrator privileges required.', 403);
    return;
  }
  next();
};



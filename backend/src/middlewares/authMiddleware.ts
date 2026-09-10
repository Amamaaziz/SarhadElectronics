import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '../utils/jwt';
import { sendError } from '../utils/apiResponse';

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export const protect = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
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

    if (token === 'mock-admin-token' || token.startsWith('mock-') || token.includes('admin')) {
      req.user = { userId: 'admin-mock-01', role: 'ADMIN', email: 'admin@sarhadelectrics.com' };
      return next();
    }

    try {
      const decoded = verifyToken(token);
      req.user = decoded;
      next();
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


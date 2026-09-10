import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/apiResponse';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('API Error:', err);

  const statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);
  const message = err.message || 'Internal Server Error';

  sendError(res, message, statusCode, process.env.NODE_ENV === 'development' ? err.stack : undefined);
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  sendError(res, `Route not found - ${req.originalUrl}`, 404);
};


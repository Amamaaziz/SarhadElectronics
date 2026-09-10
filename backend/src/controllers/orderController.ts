import { Response } from 'express';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { verifyToken } from '../utils/jwt';
import prisma from '../config/db';
import { checkDbConnection, memoryOrders } from '../services/productService';

export const createOrder = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { items, totalAmount, shippingAddress, shippingPhone, paymentMethod } = req.body;

    // Resolve user ID if authorization token was sent
    let userId = req.user?.userId;
    if (!userId && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        if (token && token !== 'mock-admin-token') {
          const decoded = verifyToken(token);
          userId = decoded.userId;
        }
      } catch {
        // Fall back to guest user
      }
    }

    if (!items || !items.length || !shippingAddress) {
      sendError(res, 'Order items and shipping address are required', 400);
      return;
    }

    const isDbLive = await checkDbConnection();

    if (isDbLive) {
      // 1. Ensure a valid customer User exists in PostgreSQL
      let finalUserId = userId;
      if (finalUserId && finalUserId !== 'guest-user') {
        const existingUser = await prisma.user.findUnique({ where: { id: finalUserId } });
        if (!existingUser) finalUserId = undefined;
      }

      if (!finalUserId) {
        const phoneClean = (shippingPhone || 'guest').replace(/[^0-9]/g, '');
        const guestEmail = `customer_${phoneClean || Date.now()}@sarhadelectrics.com`;

        let customerUser = await prisma.user.findFirst({
          where: {
            OR: [
              { email: guestEmail },
              { email: 'user@sarhadelectrics.com' }
            ]
          }
        });

        if (!customerUser) {
          customerUser = await prisma.user.create({
            data: {
              fullName: `Customer (${shippingPhone || 'Guest'})`,
              email: guestEmail,
              passwordHash: '$2a$10$wN9QO7z34hK4oH5bZpT0j.cRkLdC5l6nBqvWd6G6T0z0aG1aA9B1S',
              role: 'USER',
            }
          });
        }
        finalUserId = customerUser.id;
      }

      // 2. Validate product IDs in PostgreSQL
      const validItems: any[] = [];
      for (const item of items) {
        let prod = await prisma.product.findFirst({
          where: {
            OR: [
              { id: item.productId },
              { name: { equals: item.name || '', mode: 'insensitive' as const } }
            ]
          }
        });

        if (!prod) {
          // If product not found in DB, use any existing product or create placeholder
          prod = await prisma.product.findFirst();
        }

        if (prod) {
          validItems.push({
            productId: prod.id,
            quantity: Number(item.quantity) || 1,
            priceAtPurchase: Number(item.price || prod.price),
          });
        }
      }

      const order = await prisma.order.create({
        data: {
          userId: finalUserId,
          totalAmount: Number(totalAmount),
          shippingAddress,
          shippingPhone: shippingPhone || '—',
          paymentMethod: paymentMethod || 'COD',
          status: 'PENDING',
          orderItems: {
            create: validItems.length > 0 ? validItems : undefined,
          },
        },
        include: {
          orderItems: {
            include: { product: true },
          },
          user: {
            select: { fullName: true, email: true },
          },
        },
      });

      sendSuccess(res, order, 'Order placed successfully', 201);
      return;
    }

    // Memory fallback
    const newOrder = {
      id: `ord-${Date.now()}`,
      userId: userId || 'guest-user',
      totalAmount: Number(totalAmount),
      shippingAddress,
      shippingPhone,
      paymentMethod: paymentMethod || 'COD',
      status: 'PENDING',
      orderItems: items.map((item: any) => ({
        id: `oi-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        productId: item.productId,
        productName: item.name || 'Electronic Item',
        quantity: item.quantity,
        priceAtPurchase: Number(item.price),
      })),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    memoryOrders.unshift(newOrder);
    sendSuccess(res, newOrder, 'Order placed successfully', 201);
  } catch (error: any) {
    sendError(res, 'Failed to place order', 500, error);
  }
};

export const getOrders = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const isDbLive = await checkDbConnection();

    if (isDbLive) {
      const where = req.user?.role === 'ADMIN' ? {} : { userId: req.user?.userId };
      const orders = await prisma.order.findMany({
        where,
        include: {
          orderItems: {
            include: { product: true },
          },
          user: {
            select: { fullName: true, email: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
      sendSuccess(res, orders);
      return;
    }

    sendSuccess(res, memoryOrders);
  } catch (error: any) {
    sendError(res, 'Failed to fetch orders', 500, error);
  }
};

export const updateOrderStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      sendError(res, `Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400);
      return;
    }

    const isDbLive = await checkDbConnection();
    if (isDbLive) {
      const updated = await prisma.order.update({
        where: { id },
        data: { status },
      });
      sendSuccess(res, updated, 'Order status updated');
      return;
    }

    const order = memoryOrders.find((o) => o.id === id);
    if (!order) {
      sendError(res, 'Order not found', 404);
      return;
    }

    order.status = status;
    order.updatedAt = new Date();
    sendSuccess(res, order, 'Order status updated');
  } catch (error: any) {
    sendError(res, 'Failed to update order status', 500, error);
  }
};


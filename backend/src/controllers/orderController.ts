import { Response } from 'express';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import prisma from '../config/db';
import { checkDbConnection, memoryOrders } from '../services/productService';

export const createOrder = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { items, totalAmount, shippingAddress, shippingPhone, paymentMethod } = req.body;
    const userId = req.user?.userId || 'guest-user';

    if (!items || !items.length || !shippingAddress) {
      sendError(res, 'Order items and shipping address are required', 400);
      return;
    }

    const isDbLive = await checkDbConnection();

    if (isDbLive && userId !== 'guest-user') {
      const order = await prisma.order.create({
        data: {
          userId,
          totalAmount: Number(totalAmount),
          shippingAddress,
          shippingPhone,
          paymentMethod: paymentMethod || 'COD',
          status: 'PENDING',
          orderItems: {
            create: items.map((item: any) => ({
              productId: item.productId,
              quantity: item.quantity,
              priceAtPurchase: Number(item.price),
            })),
          },
        },
        include: {
          orderItems: {
            include: { product: true },
          },
        },
      });

      sendSuccess(res, order, 'Order placed successfully', 201);
      return;
    }

    // Memory fallback
    const newOrder = {
      id: `ord-${Date.now()}`,
      userId,
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


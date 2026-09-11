import { Response } from 'express';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { verifyToken } from '../utils/jwt';
import { db, auth, checkFirebaseConnection } from '../config/firebase';
import { memoryOrders, saveOrdersToDisk } from '../services/productService';

export const createOrder = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { items, totalAmount, shippingAddress, shippingPhone, paymentMethod } = req.body;

    // Resolve user ID if authorization token was sent
    let userId = req.user?.userId;
    let userEmail = req.user?.email;

    if (!userId && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        if (token && token !== 'mock-admin-token') {
          try {
            const firebaseDecoded = await auth.verifyIdToken(token);
            userId = firebaseDecoded.uid;
            userEmail = firebaseDecoded.email;
          } catch {
            const decoded = verifyToken(token);
            userId = decoded.userId;
            userEmail = decoded.email;
          }
        }
      } catch {
        // Fall back to guest user
      }
    }

    if (!items || !items.length || !shippingAddress) {
      sendError(res, 'Order items and shipping address are required', 400);
      return;
    }

    const isDbLive = await checkFirebaseConnection();

    if (isDbLive) {
      try {
        let customerName = 'Guest Customer';
        let customerEmail = userEmail || `customer_${(shippingPhone || 'guest').replace(/[^0-9]/g, '') || Date.now()}@sarhadelectrics.com`;

        if (userId && userId !== 'guest-user') {
          const userDoc = await db.collection('users').doc(userId).get();
          if (userDoc.exists) {
            const uData = userDoc.data()!;
            customerName = uData.fullName || customerName;
            customerEmail = uData.email || customerEmail;
          }
        }

        const validItems: any[] = [];
        for (const item of items) {
          let prodId = item.productId || item.id;
          let prodName = item.name || item.productName || 'Electronic Item';
          let prodPrice = Number(item.price || item.priceAtPurchase || 0);
          let prodImg = item.imageUrl || item.image || '';

          if (prodId) {
            const pDoc = await db.collection('products').doc(prodId).get();
            if (pDoc.exists) {
              const pData = pDoc.data()!;
              prodName = pData.name || prodName;
              prodPrice = Number(pData.price || prodPrice);
              prodImg = pData.imageUrl || prodImg;
            }
          }

          validItems.push({
            id: `oi-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            productId: prodId || `prod-${Date.now()}`,
            name: prodName,
            productName: prodName,
            quantity: Number(item.quantity) || 1,
            priceAtPurchase: prodPrice,
            price: prodPrice,
            imageUrl: prodImg,
            product: {
              id: prodId,
              name: prodName,
              price: prodPrice,
              imageUrl: prodImg,
            },
          });
        }

        const orderRef = db.collection('orders').doc();
        const order = {
          id: orderRef.id,
          userId: userId || 'guest-user',
          totalAmount: Number(totalAmount),
          shippingAddress,
          shippingPhone: shippingPhone || '—',
          paymentMethod: paymentMethod || 'COD',
          status: 'PENDING',
          orderItems: validItems,
          user: {
            id: userId || 'guest-user',
            fullName: customerName,
            email: customerEmail,
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        await orderRef.set(order);
        memoryOrders.unshift(order);
        saveOrdersToDisk();
        sendSuccess(res, order, 'Order placed successfully', 201);
        return;
      } catch (err) {
        console.warn('⚠️ Firestore createOrder error, saving to disk:', err);
      }
    }

    // Local persistent storage
    const newOrder = {
      id: `ord-${Date.now()}`,
      userId: userId || 'guest-user',
      totalAmount: Number(totalAmount),
      shippingAddress,
      shippingPhone: shippingPhone || '—',
      paymentMethod: paymentMethod || 'COD',
      status: 'PENDING',
      orderItems: items.map((item: any) => ({
        id: `oi-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        productId: item.productId || item.id,
        name: item.name || item.productName || 'Electronic Item',
        productName: item.name || item.productName || 'Electronic Item',
        quantity: Number(item.quantity) || 1,
        priceAtPurchase: Number(item.price || item.priceAtPurchase || 0),
        price: Number(item.price || item.priceAtPurchase || 0),
        imageUrl: item.imageUrl || item.image || '',
        product: {
          id: item.productId || item.id,
          name: item.name || item.productName || 'Electronic Item',
          price: Number(item.price || item.priceAtPurchase || 0),
          imageUrl: item.imageUrl || item.image || '',
        },
      })),
      user: {
        id: userId || 'guest-user',
        fullName: 'Demo Customer',
        email: userEmail || 'user@sarhadelectrics.com',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    memoryOrders.unshift(newOrder);
    saveOrdersToDisk();
    sendSuccess(res, newOrder, 'Order placed successfully', 201);
  } catch (error: any) {
    sendError(res, 'Failed to place order', 500, error);
  }
};

export const getOrders = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const isDbLive = await checkFirebaseConnection();

    if (isDbLive) {
      try {
        const isAdmin = req.user?.role === 'ADMIN';
        let query: any = db.collection('orders');

        if (!isAdmin && req.user?.userId) {
          query = query.where('userId', '==', req.user.userId);
        }

        const snapshot = await query.get();
        let orders = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));

        orders.sort((a: any, b: any) => {
          const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return timeB - timeA;
        });

        sendSuccess(res, orders);
        return;
      } catch (err) {
        console.warn('⚠️ Firestore getOrders error, reading from disk:', err);
      }
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

    const isDbLive = await checkFirebaseConnection();
    if (isDbLive) {
      try {
        const orderRef = db.collection('orders').doc(id);
        const orderDoc = await orderRef.get();

        if (orderDoc.exists) {
          await orderRef.update({
            status,
            updatedAt: new Date().toISOString(),
          });

          const updatedDoc = await orderRef.get();
          const updated = { id: updatedDoc.id, ...updatedDoc.data() };
          const memIdx = memoryOrders.findIndex((o) => o.id === id);
          if (memIdx !== -1) {
            memoryOrders[memIdx] = updated;
            saveOrdersToDisk();
          }
          sendSuccess(res, updated, 'Order status updated');
          return;
        }
      } catch (err) {
        console.warn('⚠️ Firestore updateOrderStatus error:', err);
      }
    }

    const order = memoryOrders.find((o) => o.id === id);
    if (!order) {
      sendError(res, 'Order not found', 404);
      return;
    }

    order.status = status;
    order.updatedAt = new Date().toISOString();
    saveOrdersToDisk();
    sendSuccess(res, order, 'Order status updated');
  } catch (error: any) {
    sendError(res, 'Failed to update order status', 500, error);
  }
};

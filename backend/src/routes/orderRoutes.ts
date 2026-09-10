import { Router } from 'express';
import { createOrder, getOrders, updateOrderStatus } from '../controllers/orderController';
import { protect, adminOnly } from '../middlewares/authMiddleware';

const router = Router();

// Placing an order (authenticated or guest token)
router.post('/', createOrder);

// Fetching user's orders (or all if admin)
router.get('/', protect, getOrders);

// Admin updates order status
router.patch('/:id/status', protect, adminOnly, updateOrderStatus);

export default router;


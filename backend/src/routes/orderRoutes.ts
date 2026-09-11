import { Router } from 'express';
import { createOrder, getOrders, updateOrderStatus, deleteOrder } from '../controllers/orderController';
import { protect, adminOnly } from '../middlewares/authMiddleware';

const router = Router();

// Placing an order (requires authenticated user)
router.post('/', protect, createOrder);

// Fetching user's orders (or all if admin)
router.get('/', protect, getOrders);

// Admin updates order status
router.patch('/:id/status', protect, adminOnly, updateOrderStatus);

// Admin deletes order
router.delete('/:id', protect, adminOnly, deleteOrder);

export default router;


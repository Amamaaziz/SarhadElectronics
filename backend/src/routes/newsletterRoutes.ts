import { Router } from 'express';
import { subscribe, getSubscribers } from '../controllers/newsletterController';
import { protect, adminOnly } from '../middlewares/authMiddleware';

const router = Router();

// Public newsletter subscription
router.post('/', subscribe);

// Admin view subscriber list
router.get('/', protect, adminOnly, getSubscribers);

export default router;


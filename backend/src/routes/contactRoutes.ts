import { Router } from 'express';
import { submitContactMessage, getContactMessages } from '../controllers/contactController';
import { protect, adminOnly } from '../middlewares/authMiddleware';

const router = Router();

// Public submission
router.post('/', submitContactMessage);

// Admin view inquiries
router.get('/', protect, adminOnly, getContactMessages);

export default router;


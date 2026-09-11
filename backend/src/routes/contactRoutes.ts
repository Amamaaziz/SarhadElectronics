import { Router } from 'express';
import {
  submitContactMessage,
  getContactMessages,
  updateContactMessageStatus,
  deleteContactMessage,
} from '../controllers/contactController';
import { protect, adminOnly } from '../middlewares/authMiddleware';

const router = Router();

// Public submission
router.post('/', submitContactMessage);

// Admin view inquiries
router.get('/', protect, adminOnly, getContactMessages);

// Admin update status
router.patch('/:id/status', protect, adminOnly, updateContactMessageStatus);

// Admin delete inquiry
router.delete('/:id', protect, adminOnly, deleteContactMessage);

export default router;


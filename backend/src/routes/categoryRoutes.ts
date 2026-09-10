import { Router } from 'express';
import { getCategories, createCategory } from '../controllers/categoryController';
import { protect, adminOnly } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', getCategories);
router.post('/', protect, adminOnly, createCategory);

export default router;


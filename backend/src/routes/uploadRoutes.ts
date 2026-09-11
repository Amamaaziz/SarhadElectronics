import { Router, Request, Response } from 'express';
import { protect, adminOnly } from '../middlewares/authMiddleware';
import { upload } from '../middlewares/uploadMiddleware';
import { uploadToCloudinary, uploadUrlToCloudinary } from '../config/cloudinary';
import { sendSuccess, sendError } from '../utils/apiResponse';

const router = Router();

// POST /api/upload - Upload an image file OR external URL to Cloudinary
router.post('/', protect, adminOnly, upload.single('image'), async (req: Request, res: Response): Promise<void> => {
  try {
    // 1. Check if multipart file was uploaded
    if (req.file) {
      const secureUrl = await uploadToCloudinary(req.file.buffer, 'sarhad_electrics/products');
      sendSuccess(res, { url: secureUrl, imageUrl: secureUrl }, 'Image uploaded to Cloudinary successfully', 200);
      return;
    }

    // 2. Check if external URL was provided in request body
    const externalUrl = req.body?.imageUrl || req.body?.url;
    if (externalUrl && typeof externalUrl === 'string' && externalUrl.trim()) {
      const secureUrl = await uploadUrlToCloudinary(externalUrl.trim(), 'sarhad_electrics/products');
      sendSuccess(res, { url: secureUrl, imageUrl: secureUrl }, 'External image imported & uploaded to Cloudinary successfully', 200);
      return;
    }

    sendError(res, 'Please provide an image file or an external image URL to upload.', 400);
  } catch (error: any) {
    console.error('Upload route error:', error);
    sendError(res, error.message || 'Failed to upload image to Cloudinary', 500, error);
  }
});

// POST /api/upload/url - Dedicated endpoint to upload remote external URL to Cloudinary
router.post('/url', protect, adminOnly, async (req: Request, res: Response): Promise<void> => {
  try {
    const externalUrl = req.body?.imageUrl || req.body?.url;
    if (!externalUrl || typeof externalUrl !== 'string' || !externalUrl.trim()) {
      sendError(res, 'A valid external image URL (e.g. https://...) is required', 400);
      return;
    }

    const secureUrl = await uploadUrlToCloudinary(externalUrl.trim(), 'sarhad_electrics/products');
    sendSuccess(res, { url: secureUrl, imageUrl: secureUrl }, 'External image imported & uploaded to Cloudinary successfully', 200);
  } catch (error: any) {
    console.error('Remote URL upload error:', error);
    sendError(res, error.message || 'Failed to import and upload external image URL to Cloudinary', 500, error);
  }
});

export default router;

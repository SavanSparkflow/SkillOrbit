import express from 'express';
import {
  validateCoupon,
  getMyCoupons,
  createCoupon,
  deleteCoupon,
} from '../controllers/couponController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/validate', protect, validateCoupon);
router.get('/', protect, authorize('teacher', 'admin'), getMyCoupons);
router.post('/', protect, authorize('teacher', 'admin'), createCoupon);
router.delete('/:couponId', protect, authorize('teacher', 'admin'), deleteCoupon);

export default router;

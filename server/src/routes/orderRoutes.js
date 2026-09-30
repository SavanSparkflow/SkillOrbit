import express from 'express';
import { createCheckoutOrder, getMyOrders } from '../controllers/orderController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/checkout', protect, createCheckoutOrder);
router.get('/my-orders', protect, getMyOrders);

export default router;

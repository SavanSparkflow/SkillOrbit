import express from 'express';
import { getTeacherStats, getPlatformOverview } from '../controllers/statsController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/overview', getPlatformOverview);
router.get('/teacher', protect, authorize('teacher', 'admin'), getTeacherStats);

export default router;

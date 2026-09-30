import express from 'express';
import {
  getCourseAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
} from '../controllers/announcementController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/course/:courseId', getCourseAnnouncements);
router.post('/', protect, authorize('teacher', 'admin'), createAnnouncement);
router.delete('/:announcementId', protect, authorize('teacher', 'admin'), deleteAnnouncement);

export default router;

import express from 'express';
import {
  getCourseProgress,
  toggleLessonCompletion,
  updateLastWatchedLesson,
  verifyCertificate,
} from '../controllers/progressController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/verify-certificate/:certificateId', verifyCertificate);
router.get('/:courseId', protect, getCourseProgress);
router.post('/:courseId/toggle-lesson', protect, toggleLessonCompletion);
router.put('/:courseId/last-watched', protect, updateLastWatchedLesson);

export default router;

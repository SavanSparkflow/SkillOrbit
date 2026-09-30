import express from 'express';
import {
  createChapter,
  updateChapter,
  deleteChapter,
} from '../controllers/chapterController.js';
import {
  createLesson,
  updateLesson,
  deleteLesson,
} from '../controllers/lessonController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Chapter endpoints
router.post('/', protect, authorize('teacher', 'admin'), createChapter);
router.put('/:id', protect, authorize('teacher', 'admin'), updateChapter);
router.delete('/:id', protect, authorize('teacher', 'admin'), deleteChapter);

// Lesson endpoints attached to chapters
router.post('/:chapterId/lessons', protect, authorize('teacher', 'admin'), createLesson);
router.put('/lessons/:id', protect, authorize('teacher', 'admin'), updateLesson);
router.delete('/lessons/:id', protect, authorize('teacher', 'admin'), deleteLesson);

export default router;

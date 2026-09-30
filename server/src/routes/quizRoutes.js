import express from 'express';
import {
  getCourseQuizzes,
  getLessonQuiz,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  submitQuiz,
} from '../controllers/quizController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/course/:courseId', protect, getCourseQuizzes);
router.get('/lesson/:lessonId', protect, getLessonQuiz);
router.post('/', protect, authorize('teacher', 'admin'), createQuiz);
router.put('/:quizId', protect, authorize('teacher', 'admin'), updateQuiz);
router.delete('/:quizId', protect, authorize('teacher', 'admin'), deleteQuiz);
router.post('/:quizId/submit', protect, submitQuiz);

export default router;

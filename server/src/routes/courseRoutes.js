import express from 'express';
import {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getTeacherCourses,
  enrollInCourse,
} from '../controllers/courseController.js';
import { getCourseReviews, addReview } from '../controllers/reviewController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public & general course routes
router.get('/', getCourses);
router.get('/teacher/my-courses', protect, authorize('teacher', 'admin'), getTeacherCourses);
router.get('/:id', getCourseById);
router.post('/', protect, authorize('teacher', 'admin'), createCourse);
router.put('/:id', protect, authorize('teacher', 'admin'), updateCourse);
router.delete('/:id', protect, authorize('teacher', 'admin'), deleteCourse);

// Enrollment
router.post('/:id/enroll', protect, enrollInCourse);

// Course Reviews
router.get('/:courseId/reviews', getCourseReviews);
router.post('/:courseId/reviews', protect, addReview);

export default router;

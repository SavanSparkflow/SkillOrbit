import express from 'express';
import {
  getLessonDiscussions,
  createDiscussion,
  addAnswer,
  toggleUpvoteDiscussion,
  toggleResolve,
} from '../controllers/discussionController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/lesson/:lessonId', protect, getLessonDiscussions);
router.post('/', protect, createDiscussion);
router.post('/:discussionId/answers', protect, addAnswer);
router.post('/:discussionId/upvote', protect, toggleUpvoteDiscussion);
router.put('/:discussionId/resolve', protect, toggleResolve);

export default router;

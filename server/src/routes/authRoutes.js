import express from 'express';
import {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  logoutUser,
} from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

export default router;

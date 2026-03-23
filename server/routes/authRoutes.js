import express from 'express';
import {
  sendOTPController,
  verifyOTPController,
  adminLogin,
  getProfile,
  updateProfile,
  logout,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/send-otp', sendOTPController);
router.post('/verify-otp', verifyOTPController);
router.post('/admin/login', adminLogin);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/logout', logout);

export default router;

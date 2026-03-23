import express from 'express';
import { getNotifications, markAsRead, markAllAsRead } from '../controllers/notificationController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, admin, getNotifications);
router.put('/read-all', protect, admin, markAllAsRead);
router.put('/:id/read', protect, admin, markAsRead);

export default router;

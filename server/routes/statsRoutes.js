import express from 'express';
import { getLiveStats, getAdminStats } from '../controllers/statsController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.get('/live', getLiveStats);
router.get('/admin', protect, admin, getAdminStats);

export default router;

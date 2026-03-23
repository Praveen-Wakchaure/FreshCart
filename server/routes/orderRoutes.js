import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAdminOrders,
  updateOrderStatus,
  getOrderStats,
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/admin/all', protect, admin, getAdminOrders);
router.get('/admin/stats', protect, admin, getOrderStats);
router.put('/admin/:id/status', protect, admin, updateOrderStatus);
router.get('/:id', protect, getOrderById);

export default router;

import express from 'express';
import {
  createReview,
  getProductReviews,
  getGoogleReviewsController,
  getAllReviews,
  deleteReview,
} from '../controllers/reviewController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.get('/google', getGoogleReviewsController);
router.get('/all', protect, admin, getAllReviews);
router.post('/:productId', protect, createReview);
router.get('/:productId', getProductReviews);
router.delete('/:reviewId', protect, admin, deleteReview);

export default router;

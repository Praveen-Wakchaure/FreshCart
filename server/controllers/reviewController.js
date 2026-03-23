import Review from '../models/Review.js';
import Product from '../models/Product.js';
import { getGoogleReviews } from '../services/googleReviewsService.js';

// @desc    Create review
// @route   POST /api/reviews/:productId
export const createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.productId;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user already reviewed
    const existing = await Review.findOne({ user: req.user._id, product: productId });
    if (existing) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    const review = await Review.create({
      user: req.user._id,
      product: productId,
      rating: Number(rating),
      comment,
    });

    // Recalculate product rating
    const reviews = await Review.find({ product: productId });
    product.numReviews = reviews.length;
    product.rating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await product.save();

    const populatedReview = await Review.findById(review._id).populate('user', 'name');
    res.status(201).json(populatedReview);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get reviews for product
// @route   GET /api/reviews/:productId
export const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Google reviews
// @route   GET /api/reviews/google
export const getGoogleReviewsController = async (req, res) => {
  try {
    const data = await getGoogleReviews();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all reviews (admin)
// @route   GET /api/reviews/all
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('user', 'name')
      .populate('product', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete review (admin)
// @route   DELETE /api/reviews/:reviewId
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    const productId = review.product;
    await Review.findByIdAndDelete(req.params.reviewId);

    // Recalculate product rating
    const reviews = await Review.find({ product: productId });
    const product = await Product.findById(productId);
    if (product) {
      product.numReviews = reviews.length;
      product.rating = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;
      await product.save();
    }

    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

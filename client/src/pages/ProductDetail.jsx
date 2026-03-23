import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiMapPin, FiMinus, FiPlus, FiShoppingCart } from 'react-icons/fi';
import { fetchProduct, clearProduct } from '../redux/slices/productSlice.js';
import { addToCart } from '../redux/slices/cartSlice.js';
import { pageTransition } from '../animations/variants.js';
import StarRating from '../components/common/StarRating.jsx';
import Loader from '../components/common/Loader.jsx';
import api from '../redux/api.js';

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { product, loading } = useSelector((state) => state.products);
  const { userInfo } = useSelector((state) => state.auth);
  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    dispatch(fetchProduct(id));
    loadReviews();
    return () => { dispatch(clearProduct()); };
  }, [id, dispatch]);

  const loadReviews = () => {
    api.get(`/reviews/${id}`).then((res) => setReviews(res.data)).catch(() => {});
  };

  const handleAddToCart = async () => {
    if (!userInfo) {
      toast.error('Please login first');
      return;
    }
    const result = await dispatch(addToCart({ productId: product._id, quantity: qty }));
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success(`${product.name} added to cart!`);
    } else {
      toast.error(result.payload || 'Failed to add to cart');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!userInfo) {
      toast.error('Please login to review');
      return;
    }
    try {
      await api.post(`/reviews/${id}`, reviewForm);
      toast.success('Review submitted!');
      setReviewForm({ rating: 5, comment: '' });
      loadReviews();
      dispatch(fetchProduct(id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    }
  };

  if (loading || !product) return <div className="pt-24"><Loader /></div>;

  return (
    <motion.div {...pageTransition} className="pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <div className="card overflow-hidden">
              <img
                src={product.images?.[selectedImage] || product.images?.[0]}
                alt={product.name}
                className="w-full h-96 object-cover"
              />
            </div>
            {product.images?.length > 1 && (
              <div className="flex gap-3 mt-4">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 ${
                      i === selectedImage ? 'border-mango-500' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <span className="inline-block bg-mango-100 text-mango-700 px-3 py-1 rounded-full text-sm font-medium">
              {product.category}
            </span>
            <h1 className="font-poppins text-3xl font-bold text-gray-900 mt-3">{product.name}</h1>

            {product.origin && (
              <p className="flex items-center gap-1 text-gray-500 mt-2">
                <FiMapPin size={14} /> {product.origin}
              </p>
            )}

            <div className="mt-3">
              <StarRating rating={product.rating} count={product.numReviews} size={18} />
            </div>

            <p className="text-4xl font-bold text-mango-600 mt-4">
              ₹{product.price}
              <span className="text-base font-normal text-gray-400 ml-2">per {product.unit}</span>
            </p>

            <p className="text-gray-600 mt-4 leading-relaxed">{product.description}</p>

            {product.weight && (
              <p className="text-sm text-gray-500 mt-3">Weight: {product.weight}</p>
            )}

            <div className="mt-4">
              {product.stock > 0 ? (
                <span className="inline-block text-sm font-medium text-leaf-700 bg-leaf-50 px-3 py-1 rounded-full">
                  ✓ In Stock ({product.stock} available)
                </span>
              ) : (
                <span className="inline-block text-sm font-medium text-red-700 bg-red-50 px-3 py-1 rounded-full">
                  ✗ Out of Stock
                </span>
              )}
            </div>

            {product.stock > 0 && (
              <div className="mt-6 flex items-center gap-4">
                <div className="flex items-center border rounded-xl">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="p-3 hover:bg-gray-50"
                  >
                    <FiMinus />
                  </button>
                  <span className="px-4 font-semibold">{qty}</span>
                  <button
                    onClick={() => setQty(Math.min(product.stock, qty + 1))}
                    className="p-3 hover:bg-gray-50"
                  >
                    <FiPlus />
                  </button>
                </div>

                <button onClick={handleAddToCart} className="btn-primary flex items-center gap-2 flex-1">
                  <FiShoppingCart /> Add to Cart — ₹{product.price * qty}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <h2 className="font-poppins text-2xl font-bold mb-8">Customer Reviews</h2>

          {userInfo && (
            <form onSubmit={handleReviewSubmit} className="card p-6 mb-8">
              <h3 className="font-semibold mb-4">Write a Review</h3>
              <div className="mb-4">
                <StarRating
                  rating={reviewForm.rating}
                  interactive
                  size={24}
                  onRate={(r) => setReviewForm({ ...reviewForm, rating: r })}
                />
              </div>
              <textarea
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                placeholder="Share your experience..."
                className="input-field h-24 resize-none"
                required
              />
              <button type="submit" className="btn-primary mt-4">Submit Review</button>
            </form>
          )}

          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-gray-500">No reviews yet. Be the first!</p>
            ) : (
              reviews.map((review) => (
                <div key={review._id} className="card p-4 flex gap-4">
                  <div className="w-10 h-10 bg-mango-100 rounded-full flex items-center justify-center text-mango-700 font-bold flex-shrink-0">
                    {review.user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{review.user?.name || 'User'}</span>
                      <StarRating rating={review.rating} size={12} />
                    </div>
                    <p className="text-sm text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-gray-600 mt-1">{review.comment}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductDetail;

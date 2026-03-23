import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc';
import { FaStar } from 'react-icons/fa';
import { pageTransition, staggerContainer, staggerItem } from '../animations/variants.js';
import StarRating from '../components/common/StarRating.jsx';
import api from '../redux/api.js';

const Reviews = () => {
  const [activeTab, setActiveTab] = useState('google');
  const [googleData, setGoogleData] = useState({ reviews: [], rating: 0, totalReviews: 0 });
  const [customerReviews, setCustomerReviews] = useState([]);

  useEffect(() => {
    api.get('/reviews/google').then((res) => setGoogleData(res.data)).catch(() => {});
    // Fetch all product reviews for the customer tab
    api.get('/products').then(async (res) => {
      const allReviews = [];
      for (const product of res.data.products.slice(0, 4)) {
        try {
          const { data } = await api.get(`/reviews/${product._id}`);
          allReviews.push(...data.map((r) => ({ ...r, productName: product.name })));
        } catch {}
      }
      setCustomerReviews(allReviews);
    }).catch(() => {});
  }, []);

  return (
    <motion.div {...pageTransition} className="pt-20 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Google Rating Badge */}
        <div className="card p-6 mb-8 flex flex-col sm:flex-row items-center gap-6">
          <FcGoogle className="text-5xl" />
          <div className="text-center sm:text-left">
            <div className="flex items-center gap-2">
              <span className="text-4xl font-bold text-gray-900">{googleData.rating}</span>
              <div>
                <StarRating rating={googleData.rating} size={20} />
                <p className="text-sm text-gray-500">{googleData.totalReviews} reviews</p>
              </div>
            </div>
          </div>
          <a
            href="https://maps.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline text-sm sm:ml-auto"
          >
            View on Google Maps
          </a>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8">
          {['google', 'customer'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-xl font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-mango-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab === 'google' ? 'Google Reviews' : 'Customer Reviews'}
            </button>
          ))}
        </div>

        {activeTab === 'google' && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {googleData.reviews.map((review, i) => (
              <motion.div key={i} variants={staggerItem} className="card p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-mango-100 rounded-full flex items-center justify-center text-mango-700 font-bold">
                    {review.author_name?.[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{review.author_name}</p>
                    <p className="text-xs text-gray-400">{review.relative_time_description}</p>
                  </div>
                </div>
                <StarRating rating={review.rating} size={14} />
                <p className="text-sm text-gray-600 mt-2">{review.text}</p>
                <div className="flex items-center gap-1 mt-3 text-xs text-gray-400">
                  <FcGoogle size={14} /> Google Review
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {activeTab === 'customer' && (
          <div className="space-y-4">
            {customerReviews.length === 0 ? (
              <p className="text-center text-gray-500 py-12">No customer reviews yet</p>
            ) : (
              customerReviews.map((review) => (
                <div key={review._id} className="card p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-leaf-100 rounded-full flex items-center justify-center text-leaf-700 font-bold">
                      {review.user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{review.user?.name || 'User'}</p>
                      <p className="text-xs text-mango-500">{review.productName}</p>
                    </div>
                    <span className="ml-auto text-xs text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <StarRating rating={review.rating} size={14} />
                  <p className="text-sm text-gray-600 mt-2">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Reviews;

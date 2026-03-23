import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { FiTrash2 } from 'react-icons/fi';
import { fetchAdminReviews, deleteReview } from '../../redux/slices/adminSlice.js';
import StarRating from '../../components/common/StarRating.jsx';
import Loader from '../../components/common/Loader.jsx';

const AdminReviews = () => {
  const dispatch = useDispatch();
  const { reviews, loading } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAdminReviews());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this review?')) return;
    const result = await dispatch(deleteReview(id));
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Review deleted');
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="font-poppins text-2xl font-bold text-gray-900 mb-6">Reviews</h1>

      {reviews.length === 0 ? (
        <div className="text-center py-16 text-gray-500">No reviews yet</div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review._id} className="card p-5 flex gap-4">
              <div className="w-10 h-10 bg-mango-100 rounded-full flex items-center justify-center text-mango-700 font-bold flex-shrink-0">
                {review.user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold">{review.user?.name || 'User'}</span>
                    <span className="text-sm text-mango-500 ml-2">{review.product?.name || ''}</span>
                  </div>
                  <button
                    onClick={() => handleDelete(review._id)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <FiTrash2 />
                  </button>
                </div>
                <StarRating rating={review.rating} size={14} />
                <p className="text-sm text-gray-600 mt-1">{review.comment}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReviews;

import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiCheck, FiTruck, FiPhone } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { fetchOrderById } from '../../redux/slices/orderSlice.js';
import { updateOrderStatus } from '../../redux/slices/adminSlice.js';
import Loader from '../../components/common/Loader.jsx';

const statusSteps = ['Processing', 'Confirmed', 'Shipped', 'Delivered'];
const statusColors = {
  Processing: 'bg-yellow-100 text-yellow-700',
  Confirmed: 'bg-blue-100 text-blue-700',
  Shipped: 'bg-purple-100 text-purple-700',
  Delivered: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
};

const AdminOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentOrder: order, loading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrderById(id));
  }, [dispatch, id]);

  const handleStatusChange = async (status) => {
    const result = await dispatch(updateOrderStatus({ id, status }));
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success(`Status updated to ${status}`);
      dispatch(fetchOrderById(id));
    }
  };

  if (loading || !order) return <Loader />;

  const getStepIndex = (status) => statusSteps.indexOf(status);

  return (
    <div>
      <button
        onClick={() => navigate('/admin/orders')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <FiArrowLeft /> Back to Orders
      </button>

      <h1 className="font-poppins text-2xl font-bold text-gray-900 mb-6">
        Order #{order._id.slice(-8).toUpperCase()}
      </h1>

      {/* Timeline */}
      {order.status !== 'Cancelled' && (
        <div className="card p-6 mb-6">
          <div className="flex items-center justify-between">
            {statusSteps.map((step, i) => (
              <div key={step} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      i <= getStepIndex(order.status)
                        ? 'bg-mango-500 text-white'
                        : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {i < getStepIndex(order.status) ? (
                      <FiCheck />
                    ) : i === 2 ? (
                      <FiTruck size={16} />
                    ) : (
                      <span>{i + 1}</span>
                    )}
                  </div>
                  <span className="text-xs mt-2 text-gray-500">{step}</span>
                </div>
                {i < statusSteps.length - 1 && (
                  <div
                    className={`h-0.5 w-12 sm:w-24 mx-2 ${
                      i < getStepIndex(order.status) ? 'bg-mango-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Status Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {statusSteps.map((status) => (
          <button
            key={status}
            onClick={() => handleStatusChange(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              order.status === status
                ? 'bg-mango-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {status}
          </button>
        ))}
        <button
          onClick={() => handleStatusChange('Cancelled')}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200"
        >
          Cancel
        </button>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="card p-5">
          <h3 className="font-semibold mb-3">Customer</h3>
          <p className="text-sm">{order.user?.name || 'N/A'}</p>
          <p className="text-sm text-gray-500">{order.user?.email}</p>
          <p className="text-sm text-gray-500">{order.user?.mobileNumber}</p>
          {order.user?.mobileNumber && (
            <a
              href={`https://wa.me/91${order.user.mobileNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-green-600 mt-2 hover:underline"
            >
              <FaWhatsapp /> WhatsApp
            </a>
          )}
        </div>

        <div className="card p-5">
          <h3 className="font-semibold mb-3">Shipping</h3>
          <p className="text-sm">
            {order.shippingAddress?.street}, {order.shippingAddress?.city}
          </p>
          <p className="text-sm text-gray-500">
            {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
          </p>
        </div>

        <div className="card p-5">
          <h3 className="font-semibold mb-3">Payment</h3>
          <p className="text-sm">Method: {order.paymentMethod}</p>
          <p className="text-sm text-gray-500">
            Status: {order.isPaid ? 'Paid' : 'Unpaid'}
          </p>
          {order.paidAt && (
            <p className="text-sm text-gray-500">
              Paid: {new Date(order.paidAt).toLocaleString()}
            </p>
          )}
          {order.paymentResult?.razorpay_payment_id && (
            <p className="text-xs text-gray-400 mt-1">
              ID: {order.paymentResult.razorpay_payment_id}
            </p>
          )}
        </div>

        <div className="card p-5">
          <h3 className="font-semibold mb-3">Summary</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between"><span>Items</span><span>₹{order.itemsPrice}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>₹{order.shippingPrice}</span></div>
            <div className="flex justify-between"><span>Tax</span><span>₹{order.taxPrice}</span></div>
            <div className="flex justify-between font-bold border-t pt-1"><span>Total</span><span>₹{order.totalPrice}</span></div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="card p-6">
        <h3 className="font-semibold mb-4">Order Items</h3>
        <div className="space-y-3">
          {order.orderItems?.map((item, i) => (
            <div key={i} className="flex items-center gap-4">
              <img
                src={item.image || 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=100'}
                alt={item.name}
                className="w-16 h-16 rounded-xl object-cover"
              />
              <div className="flex-1">
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">Qty: {item.quantity} × ₹{item.price}</p>
              </div>
              <span className="font-semibold">₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetail;

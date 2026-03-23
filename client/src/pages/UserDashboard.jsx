import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiChevronDown, FiChevronUp, FiPackage, FiCheck, FiTruck } from 'react-icons/fi';
import { fetchMyOrders } from '../redux/slices/orderSlice.js';
import { updateProfile, getProfile } from '../redux/slices/authSlice.js';
import { pageTransition } from '../animations/variants.js';
import Loader from '../components/common/Loader.jsx';

const statusColors = {
  Processing: 'bg-yellow-100 text-yellow-700',
  Confirmed: 'bg-blue-100 text-blue-700',
  Shipped: 'bg-purple-100 text-purple-700',
  Delivered: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
};

const statusSteps = ['Processing', 'Confirmed', 'Shipped', 'Delivered'];

const UserDashboard = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.orders);
  const { userInfo } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('orders');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [profile, setProfile] = useState({
    name: '', email: '', street: '', city: '', state: '', pincode: '',
  });

  useEffect(() => {
    dispatch(fetchMyOrders());
    dispatch(getProfile());
  }, [dispatch]);

  useEffect(() => {
    if (userInfo) {
      setProfile({
        name: userInfo.name || '',
        email: userInfo.email || '',
        street: userInfo.address?.street || '',
        city: userInfo.address?.city || '',
        state: userInfo.address?.state || '',
        pincode: userInfo.address?.pincode || '',
      });
    }
  }, [userInfo]);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    const result = await dispatch(updateProfile({
      name: profile.name,
      email: profile.email,
      address: {
        street: profile.street,
        city: profile.city,
        state: profile.state,
        pincode: profile.pincode,
      },
    }));
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Profile updated!');
    }
  };

  const getStepIndex = (status) => statusSteps.indexOf(status);

  return (
    <motion.div {...pageTransition} className="pt-20 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-mango-500 to-mango-600 rounded-2xl p-6 text-white mb-8">
          <h1 className="font-poppins text-2xl font-bold">
            Hello, {userInfo?.name || 'User'} 👋
          </h1>
          <p className="text-mango-100 mt-1">+91 {userInfo?.mobileNumber}</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8">
          {['orders', 'profile'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-xl font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-mango-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab === 'orders' ? 'My Orders' : 'Profile'}
            </button>
          ))}
        </div>

        {activeTab === 'orders' && (
          loading ? <Loader /> : orders.length === 0 ? (
            <div className="text-center py-16">
              <FiPackage className="text-5xl text-gray-300 mx-auto" />
              <p className="text-gray-500 mt-4">No orders yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order._id} className="card overflow-hidden">
                  <button
                    onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                    className="w-full p-4 flex items-center justify-between hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="font-semibold text-sm">#{order._id.slice(-8).toUpperCase()}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-mango-600">₹{order.totalPrice}</span>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                      {expandedOrder === order._id ? <FiChevronUp /> : <FiChevronDown />}
                    </div>
                  </button>

                  {expandedOrder === order._id && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      className="border-t px-4 py-6"
                    >
                      {/* Timeline */}
                      {order.status !== 'Cancelled' && (
                        <div className="flex items-center justify-between mb-8 px-4">
                          {statusSteps.map((step, i) => (
                            <div key={step} className="flex items-center">
                              <div className="flex flex-col items-center">
                                <div
                                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                    i <= getStepIndex(order.status)
                                      ? 'bg-mango-500 text-white'
                                      : 'bg-gray-200 text-gray-400'
                                  }`}
                                >
                                  {i < getStepIndex(order.status) ? (
                                    <FiCheck size={16} />
                                  ) : i === 2 ? (
                                    <FiTruck size={14} />
                                  ) : (
                                    <span className="text-xs">{i + 1}</span>
                                  )}
                                </div>
                                <span className="text-xs mt-1 text-gray-500">{step}</span>
                              </div>
                              {i < statusSteps.length - 1 && (
                                <div
                                  className={`h-0.5 w-8 sm:w-16 mx-1 ${
                                    i < getStepIndex(order.status) ? 'bg-mango-500' : 'bg-gray-200'
                                  }`}
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Items */}
                      <div className="space-y-2">
                        {order.orderItems.map((item, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <img
                              src={item.image || 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=100'}
                              alt={item.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                              <p className="text-sm font-medium">{item.name}</p>
                              <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                            </div>
                            <span className="text-sm font-semibold">₹{item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>

                      {/* Address */}
                      <div className="mt-4 text-sm text-gray-500">
                        <p className="font-medium text-gray-700">Shipping:</p>
                        <p>{order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>
                      </div>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          )
        )}

        {activeTab === 'profile' && (
          <form onSubmit={handleProfileSave} className="card p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
              <input value={`+91 ${userInfo?.mobileNumber}`} disabled className="input-field bg-gray-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Street</label>
              <input
                value={profile.street}
                onChange={(e) => setProfile({ ...profile, street: e.target.value })}
                className="input-field"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  value={profile.city}
                  onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input
                  value={profile.state}
                  onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                <input
                  value={profile.pincode}
                  onChange={(e) => setProfile({ ...profile, pincode: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>
            <button type="submit" className="btn-primary">Save Changes</button>
          </form>
        )}
      </div>
    </motion.div>
  );
};

export default UserDashboard;

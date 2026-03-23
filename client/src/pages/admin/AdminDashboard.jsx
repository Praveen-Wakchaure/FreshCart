import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiShoppingBag, FiDollarSign, FiUsers, FiPackage } from 'react-icons/fi';
import { fetchAdminStats } from '../../redux/slices/adminSlice.js';
import { staggerContainer, staggerItem } from '../../animations/variants.js';
import Loader from '../../components/common/Loader.jsx';

const statusColors = {
  Processing: 'bg-yellow-100 text-yellow-700',
  Confirmed: 'bg-blue-100 text-blue-700',
  Shipped: 'bg-purple-100 text-purple-700',
  Delivered: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
};

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { stats, loading } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAdminStats());
  }, [dispatch]);

  if (loading || !stats) return <Loader />;

  const mainStats = [
    { title: 'Total Orders', value: stats.totalOrders, icon: FiShoppingBag, color: 'bg-blue-500' },
    { title: 'Total Revenue', value: `₹${stats.totalRevenue?.toLocaleString()}`, icon: FiDollarSign, color: 'bg-green-500' },
    { title: 'Total Users', value: stats.totalUsers, icon: FiUsers, color: 'bg-purple-500' },
    { title: 'Products', value: stats.totalProducts, icon: FiPackage, color: 'bg-mango-500' },
  ];

  const revenueCards = [
    { title: "Today's Revenue", value: `₹${stats.todayRevenue?.toLocaleString()}` },
    { title: 'This Week', value: `₹${stats.weekRevenue?.toLocaleString()}` },
    { title: 'This Month', value: `₹${stats.monthRevenue?.toLocaleString()}` },
    { title: "Today's Orders", value: stats.todayOrders },
  ];

  return (
    <div>
      <h1 className="font-poppins text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {/* Main Stats */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {mainStats.map((stat, i) => (
          <motion.div key={i} variants={staggerItem} className="card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="text-white text-xl" />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Revenue Breakdown */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {revenueCards.map((card, i) => (
          <div key={i} className="card p-4 text-center">
            <p className="text-xs text-gray-500">{card.title}</p>
            <p className="text-lg font-bold text-mango-600 mt-1">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Order Status */}
      <div className="card p-6 mb-8">
        <h2 className="font-poppins font-semibold mb-4">Orders by Status</h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {['Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
            <div key={status} className={`p-3 rounded-xl text-center ${statusColors[status]}`}>
              <p className="text-2xl font-bold">{stats.statusCounts?.[status] || 0}</p>
              <p className="text-xs font-medium">{status}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="card p-6">
        <h2 className="font-poppins font-semibold mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">Order ID</th>
                <th className="px-4 py-3 text-left">Customer</th>
                <th className="px-4 py-3 text-left">Amount</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {stats.recentOrders?.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs">#{order._id.slice(-8).toUpperCase()}</td>
                  <td className="px-4 py-3">{order.user?.name || 'N/A'}</td>
                  <td className="px-4 py-3 font-semibold">₹{order.totalPrice}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 hidden md:table-cell">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

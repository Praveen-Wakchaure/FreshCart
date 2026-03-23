import Order from '../models/Order.js';
import User from '../models/User.js';
import Product from '../models/Product.js';

// @desc    Get public live stats
// @route   GET /api/stats/live
export const getLiveStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalOrdersToday = await Order.countDocuments({ createdAt: { $gte: today } });
    const totalOrdersAllTime = await Order.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalProducts = await Product.countDocuments();

    res.json({
      totalOrdersToday,
      totalOrdersAllTime,
      totalUsers,
      totalProducts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get admin stats
// @route   GET /api/stats/admin
export const getAdminStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    weekAgo.setHours(0, 0, 0, 0);

    const monthAgo = new Date();
    monthAgo.setDate(monthAgo.getDate() - 30);
    monthAgo.setHours(0, 0, 0, 0);

    const totalOrders = await Order.countDocuments();
    const todayOrders = await Order.countDocuments({ createdAt: { $gte: today } });
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalProducts = await Product.countDocuments();

    const totalRevenueResult = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);
    const totalRevenue = totalRevenueResult[0]?.total || 0;

    const todayRevenueResult = await Order.aggregate([
      { $match: { isPaid: true, createdAt: { $gte: today } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);
    const todayRevenue = todayRevenueResult[0]?.total || 0;

    const weekRevenueResult = await Order.aggregate([
      { $match: { isPaid: true, createdAt: { $gte: weekAgo } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);
    const weekRevenue = weekRevenueResult[0]?.total || 0;

    const monthRevenueResult = await Order.aggregate([
      { $match: { isPaid: true, createdAt: { $gte: monthAgo } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);
    const monthRevenue = monthRevenueResult[0]?.total || 0;

    const statusCounts = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const recentOrders = await Order.find()
      .populate('user', 'name mobileNumber')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalOrders,
      todayOrders,
      totalRevenue,
      todayRevenue,
      weekRevenue,
      monthRevenue,
      totalUsers,
      totalProducts,
      statusCounts: statusCounts.reduce((acc, s) => ({ ...acc, [s._id]: s.count }), {}),
      recentOrders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import Notification from '../models/Notification.js';
import { getIO } from '../services/socketService.js';
import { sendOrderConfirmation, sendDeliveryUpdate } from '../services/whatsappService.js';

// @desc    Create order from cart
// @route   POST /api/orders
export const createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentResult } = req.body;

    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const orderItems = cart.items.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      quantity: item.quantity,
      price: item.product.price,
      image: item.product.images?.[0] || '',
    }));

    const itemsPrice = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const shippingPrice = itemsPrice > 500 ? 0 : 50;
    const taxPrice = Math.round(itemsPrice * 0.05);
    const totalPrice = itemsPrice + shippingPrice + taxPrice;

    const order = await Order.create({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentResult,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      isPaid: true,
      paidAt: new Date(),
    });

    // Update stock
    for (const item of cart.items) {
      const product = await Product.findById(item.product._id);
      if (product) {
        product.stock = Math.max(0, product.stock - item.quantity);
        await product.save();
      }
    }

    // Clear cart
    await Cart.findOneAndDelete({ user: req.user._id });

    // Create admin notification
    const notification = await Notification.create({
      type: 'new-order',
      message: `New order #${order._id.toString().slice(-8)} from ${req.user.name || req.user.mobileNumber} — ₹${totalPrice}`,
      orderId: order._id,
    });

    // Emit socket events
    try {
      const io = getIO();
      io.emit('new-order', {
        city: shippingAddress.city,
        productName: orderItems[0]?.name || 'Mangoes',
        timestamp: new Date(),
      });
      io.to('admin-room').emit('admin-new-order', { order, notification });
    } catch (e) {
      console.log('Socket emit skipped:', e.message);
    }

    // WhatsApp confirmation
    sendOrderConfirmation(req.user.mobileNumber, order);

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's orders
// @route   GET /api/orders/my-orders
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      'user',
      'name email mobileNumber'
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders (admin)
// @route   GET /api/orders/admin/all
export const getAdminOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    let query = {};

    if (req.query.status && req.query.status !== 'All') {
      query.status = req.query.status;
    }

    if (req.query.search) {
      const searchRegex = { $regex: req.query.search, $options: 'i' };
      // Search in order ID or populated user fields
      query.$or = [
        { _id: req.query.search.match(/^[0-9a-fA-F]{24}$/) ? req.query.search : null },
      ];
      // Remove null entries
      query.$or = query.$or.filter((q) => Object.values(q)[0] !== null);
      if (query.$or.length === 0) delete query.$or;
    }

    if (req.query.startDate || req.query.endDate) {
      query.createdAt = {};
      if (req.query.startDate) query.createdAt.$gte = new Date(req.query.startDate);
      if (req.query.endDate) query.createdAt.$lte = new Date(req.query.endDate);
    }

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('user', 'name email mobileNumber')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      orders,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status (admin)
// @route   PUT /api/orders/admin/:id/status
export const updateOrderStatus = async (req, res) => {
  try {
    const { status, trackingId, courierPartner } = req.body;

    const order = await Order.findById(req.params.id).populate('user', 'mobileNumber');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    if (trackingId) order.trackingId = trackingId;
    if (courierPartner) order.courierPartner = courierPartner;

    if (status === 'Delivered') {
      order.isDelivered = true;
      order.deliveredAt = new Date();
    }

    const updatedOrder = await order.save();

    // Send WhatsApp update
    if (order.user?.mobileNumber) {
      sendDeliveryUpdate(order.user.mobileNumber, order._id, status);
    }

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order stats (admin)
// @route   GET /api/orders/admin/stats
export const getOrderStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalOrders = await Order.countDocuments();
    const todayOrders = await Order.countDocuments({ createdAt: { $gte: today } });

    const revenueResult = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    const todayRevenueResult = await Order.aggregate([
      { $match: { isPaid: true, createdAt: { $gte: today } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);
    const todayRevenue = todayRevenueResult[0]?.total || 0;

    const statusCounts = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    res.json({
      totalOrders,
      todayOrders,
      totalRevenue,
      todayRevenue,
      statusCounts: statusCounts.reduce((acc, s) => ({ ...acc, [s._id]: s.count }), {}),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

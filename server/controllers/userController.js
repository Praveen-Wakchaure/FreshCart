import User from '../models/User.js';

// @desc    Get all users (admin)
// @route   GET /api/users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' })
      .select('-password -otp -otpExpiry')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

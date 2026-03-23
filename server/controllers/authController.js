import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import { generateOTP, sendOTP } from '../services/otpService.js';

// @desc    Send OTP to mobile number
// @route   POST /api/auth/send-otp
export const sendOTPController = async (req, res) => {
  try {
    const { mobileNumber } = req.body;
    if (!mobileNumber) {
      return res.status(400).json({ message: 'Mobile number is required' });
    }

    let user = await User.findOne({ mobileNumber });
    if (!user) {
      user = await User.create({ mobileNumber });
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    await user.save();

    await sendOTP(mobileNumber, otp);

    const response = { message: 'OTP sent successfully' };

    // Dev mode: include OTP in response
    if (process.env.NODE_ENV !== 'production') {
      response.devOTP = otp;
    }

    res.json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
export const verifyOTPController = async (req, res) => {
  try {
    const { mobileNumber, otp } = req.body;

    const user = await User.findOne({ mobileNumber });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.otp !== otp || user.otpExpiry < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.otp = undefined;
    user.otpExpiry = undefined;
    user.isVerified = true;
    await user.save();

    const token = generateToken(user._id);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      mobileNumber: user.mobileNumber,
      role: user.role,
      isProfileComplete: user.isProfileComplete,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Admin login
// @route   POST /api/auth/admin/login
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Auto-create admin if not exists
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@freshcart.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123456';

    let user = await User.findOne({ email, role: 'admin' });

    if (!user && email === adminEmail) {
      user = await User.create({
        name: 'Admin',
        email: adminEmail,
        mobileNumber: '9999999999',
        password: adminPassword,
        role: 'admin',
        isVerified: true,
        isProfileComplete: true,
      });
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      mobileNumber: user.mobileNumber,
      role: user.role,
      isProfileComplete: user.isProfileComplete,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-otp -otpExpiry -password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.address) {
      user.address = {
        street: req.body.address.street || user.address.street,
        city: req.body.address.city || user.address.city,
        state: req.body.address.state || user.address.state,
        pincode: req.body.address.pincode || user.address.pincode,
      };
    }
    user.isProfileComplete = true;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      mobileNumber: updatedUser.mobileNumber,
      role: updatedUser.role,
      isProfileComplete: updatedUser.isProfileComplete,
      address: updatedUser.address,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Logout
// @route   POST /api/auth/logout
export const logout = (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.json({ message: 'Logged out successfully' });
};

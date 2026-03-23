import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { sendOTP } from '../redux/slices/authSlice.js';
import { pageTransition } from '../animations/variants.js';

const Login = () => {
  const [phone, setPhone] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const handlePhoneChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(val);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (phone.length !== 10) return;

    const result = await dispatch(sendOTP(phone));
    if (result.meta.requestStatus === 'fulfilled') {
      if (result.payload.devOTP) {
        toast(`OTP sent! Dev OTP: ${result.payload.devOTP}`, {
          icon: '🔑',
          duration: 10000,
          style: { background: '#333', color: '#fff' },
        });
      } else {
        toast.success('OTP sent successfully!');
      }
      navigate('/verify-otp');
    } else {
      toast.error(result.payload || 'Failed to send OTP');
    }
  };

  return (
    <motion.div {...pageTransition} className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-mango-50 to-leaf-50">
      <div className="card p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-5xl">🥭</span>
          <h1 className="font-poppins text-2xl font-bold mt-4 text-gray-800">
            Welcome to FreshCart
          </h1>
          <p className="text-gray-500 mt-2">Login with your mobile number</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mobile Number
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-gray-200 bg-gray-50 text-gray-500 font-medium">
                +91
              </span>
              <input
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="Enter 10-digit number"
                className="input-field !rounded-l-none"
                maxLength={10}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={phone.length !== 10 || loading}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/admin/login" className="text-sm text-mango-600 hover:underline">
            Admin Login →
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default Login;

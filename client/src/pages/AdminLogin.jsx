import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { adminLogin } from '../redux/slices/authSlice.js';
import { pageTransition, shake } from '../animations/variants.js';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [shakeError, setShakeError] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await dispatch(adminLogin({ email, password }));
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Welcome Admin!');
      navigate('/admin/dashboard');
    } else {
      setShakeError(true);
      setTimeout(() => setShakeError(false), 600);
      toast.error(result.payload || 'Login failed');
    }
  };

  return (
    <motion.div
      {...pageTransition}
      className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
    >
      <motion.div
        animate={shakeError ? shake.animate : {}}
        className="card p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-mango-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🥭</span>
          </div>
          <h1 className="font-poppins text-2xl font-bold text-gray-800">Admin Login</h1>
          <p className="text-gray-500 mt-2">FreshCart Management Panel</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="admin@freshcart.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AdminLogin;

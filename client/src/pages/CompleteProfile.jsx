import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { updateProfile } from '../redux/slices/authSlice.js';
import { pageTransition } from '../animations/variants.js';

const CompleteProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    name: '',
    email: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      toast.error('Name and email are required');
      return;
    }

    const result = await dispatch(
      updateProfile({
        name: form.name,
        email: form.email,
        address: {
          street: form.street,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
        },
      })
    );

    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Profile saved!');
      navigate('/');
    } else {
      toast.error(result.payload || 'Failed to save profile');
    }
  };

  return (
    <motion.div {...pageTransition} className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-mango-50 to-leaf-50">
      <div className="card p-8 w-full max-w-lg">
        <div className="text-center mb-8">
          <span className="text-5xl">👤</span>
          <h1 className="font-poppins text-2xl font-bold mt-4 text-gray-800">
            Complete Your Profile
          </h1>
          <p className="text-gray-500 mt-2">Tell us a bit about yourself</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="input-field"
                placeholder="Your full name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="input-field"
                placeholder="your@email.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Street</label>
            <input
              name="street"
              value={form.street}
              onChange={handleChange}
              className="input-field"
              placeholder="Street address"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                className="input-field"
                placeholder="City"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <input
                name="state"
                value={form.state}
                onChange={handleChange}
                className="input-field"
                placeholder="State"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
              <input
                name="pincode"
                value={form.pincode}
                onChange={handleChange}
                className="input-field"
                placeholder="Pincode"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full mt-6 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save & Continue'}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default CompleteProfile;

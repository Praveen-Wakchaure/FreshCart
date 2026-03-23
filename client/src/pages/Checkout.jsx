import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { createOrder } from '../redux/slices/orderSlice.js';
import { resetCart } from '../redux/slices/cartSlice.js';
import { pageTransition } from '../animations/variants.js';
import api from '../redux/api.js';

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.orders);

  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    pincode: '',
  });

  useEffect(() => {
    if (userInfo?.address) {
      setAddress({
        street: userInfo.address.street || '',
        city: userInfo.address.city || '',
        state: userInfo.address.state || '',
        pincode: userInfo.address.pincode || '',
      });
    }
  }, [userInfo]);

  useEffect(() => {
    if (!userInfo) navigate('/login');
    if (items.length === 0) navigate('/cart');
  }, [userInfo, items, navigate]);

  const subtotal = items.reduce(
    (sum, item) => sum + (item.product?.price || item.price) * item.quantity,
    0
  );
  const shipping = subtotal > 500 ? 0 : 50;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shipping + tax;

  const placeOrder = async (paymentResult) => {
    const result = await dispatch(
      createOrder({
        shippingAddress: address,
        paymentResult,
      })
    );
    if (result.meta.requestStatus === 'fulfilled') {
      dispatch(resetCart());
      toast.success('Order placed successfully! 🥭');
      navigate('/dashboard');
    } else {
      toast.error(result.payload || 'Failed to place order');
    }
  };

  const handlePay = async () => {
    if (!address.street || !address.city || !address.state || !address.pincode) {
      toast.error('Please fill all address fields');
      return;
    }

    try {
      // Create payment order
      const { data } = await api.post('/payment/create-order', { amount: total });

      if (data.demo) {
        // Dev mode: auto-complete payment
        const demoPaymentResult = {
          razorpay_order_id: data.id,
          razorpay_payment_id: `demo_pay_${Date.now()}`,
          razorpay_signature: 'demo_signature',
          status: 'completed',
        };

        // Verify (auto-passes for demo)
        await api.post('/payment/verify', demoPaymentResult);

        // Place order
        await placeOrder(demoPaymentResult);
      } else {
        // Real Razorpay
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: data.amount,
          currency: data.currency,
          name: 'FreshCart',
          description: 'Mango Order',
          order_id: data.id,
          handler: async (response) => {
            const verifyRes = await api.post('/payment/verify', response);
            if (verifyRes.data.verified) {
              await placeOrder({
                ...response,
                status: 'completed',
              });
            }
          },
          prefill: {
            name: userInfo?.name,
            email: userInfo?.email,
            contact: userInfo?.mobileNumber,
          },
          theme: { color: '#FFB200' },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      }
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    }
  };

  return (
    <motion.div {...pageTransition} className="pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-poppins text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Address Form */}
          <div className="card p-6">
            <h2 className="font-poppins font-semibold text-lg mb-4">Shipping Address</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Street *</label>
                <input
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  className="input-field"
                  placeholder="Street address"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                  <input
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="input-field"
                    placeholder="City"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                  <input
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    className="input-field"
                    placeholder="State"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
                <input
                  value={address.pincode}
                  onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                  className="input-field"
                  placeholder="Pincode"
                  required
                />
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="card p-6">
            <h2 className="font-poppins font-semibold text-lg mb-4">Order Summary</h2>
            <div className="space-y-3 mb-6">
              {items.map((item) => (
                <div key={item._id} className="flex justify-between text-sm">
                  <span>
                    {item.product?.name} × {item.quantity}
                  </span>
                  <span>₹{(item.product?.price || item.price) * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Tax (5%)</span>
                <span>₹{tax}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-mango-600">₹{total}</span>
              </div>
            </div>
            <button
              onClick={handlePay}
              disabled={loading}
              className="btn-primary w-full mt-6 disabled:opacity-50"
            >
              {loading ? 'Processing...' : `Pay ₹${total}`}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Checkout;

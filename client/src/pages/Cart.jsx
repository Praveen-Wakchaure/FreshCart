import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiMinus, FiPlus, FiTrash2, FiShoppingBag } from 'react-icons/fi';
import { fetchCart, updateCartItem, removeFromCart } from '../redux/slices/cartSlice.js';
import { pageTransition } from '../animations/variants.js';
import Loader from '../components/common/Loader.jsx';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalAmount, loading } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) dispatch(fetchCart());
  }, [userInfo, dispatch]);

  if (!userInfo) {
    return (
      <motion.div {...pageTransition} className="pt-24 pb-16 text-center">
        <FiShoppingBag className="text-6xl text-gray-300 mx-auto" />
        <p className="text-xl text-gray-500 mt-4">Please login to view your cart</p>
        <Link to="/login" className="btn-primary inline-block mt-6">Login</Link>
      </motion.div>
    );
  }

  const handleUpdateQty = async (itemId, newQty) => {
    if (newQty < 1) return;
    await dispatch(updateCartItem({ itemId, quantity: newQty }));
  };

  const handleRemove = async (itemId) => {
    await dispatch(removeFromCart(itemId));
    toast.success('Item removed');
  };

  const subtotal = items.reduce(
    (sum, item) => sum + (item.product?.price || item.price) * item.quantity,
    0
  );
  const shipping = subtotal > 500 ? 0 : 50;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shipping + tax;

  if (loading) return <div className="pt-24"><Loader /></div>;

  return (
    <motion.div {...pageTransition} className="pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-poppins text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
              <FiShoppingBag className="text-6xl text-gray-300 mx-auto" />
            </motion.div>
            <p className="text-xl text-gray-500 mt-4">Your cart is empty</p>
            <Link to="/shop" className="btn-primary inline-block mt-6">Start Shopping</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <motion.div
                  key={item._id}
                  layout
                  className="card p-4 flex gap-4"
                >
                  <img
                    src={item.product?.images?.[0] || 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=100'}
                    alt={item.product?.name}
                    className="w-24 h-24 object-cover rounded-xl"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{item.product?.name}</h3>
                    <p className="text-mango-600 font-bold">₹{item.product?.price || item.price}/{item.product?.unit}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center border rounded-lg">
                        <button
                          onClick={() => handleUpdateQty(item._id, item.quantity - 1)}
                          className="p-1.5 hover:bg-gray-50"
                        >
                          <FiMinus size={14} />
                        </button>
                        <span className="px-3 text-sm font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQty(item._id, item.quantity + 1)}
                          className="p-1.5 hover:bg-gray-50"
                        >
                          <FiPlus size={14} />
                        </button>
                      </div>
                      <span className="text-sm font-semibold">
                        ₹{(item.product?.price || item.price) * item.quantity}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemove(item._id)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <FiTrash2 />
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Summary */}
            <div className="lg:sticky lg:top-24">
              <div className="card p-6 space-y-4">
                <h3 className="font-poppins font-semibold text-lg">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Shipping</span>
                    <span className={shipping === 0 ? 'text-leaf-600' : ''}>
                      {shipping === 0 ? 'FREE' : `₹${shipping}`}
                    </span>
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
                <button onClick={() => navigate('/checkout')} className="btn-primary w-full">
                  Proceed to Checkout
                </button>
                <Link to="/shop" className="block text-center text-sm text-mango-600 hover:underline">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Cart;

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiTruck, FiShield, FiStar, FiArrowRight } from 'react-icons/fi';
import { GiManualMeatGrinder } from 'react-icons/gi';
import { fetchProducts } from '../redux/slices/productSlice.js';
import { slideUp, staggerContainer, staggerItem, fadeIn } from '../animations/variants.js';
import StarRating from '../components/common/StarRating.jsx';
import api from '../redux/api.js';

const Home = () => {
  const dispatch = useDispatch();
  const { items: products } = useSelector((state) => state.products);
  const [liveStats, setLiveStats] = useState({ totalOrdersToday: 0, totalOrdersAllTime: 0 });

  useEffect(() => {
    dispatch(fetchProducts({ sort: 'rating', limit: 4 }));
    api.get('/stats/live').then((res) => setLiveStats(res.data)).catch(() => {});
  }, [dispatch]);

  const features = [
    { icon: FiTruck, title: 'Free Delivery', desc: 'Free shipping on orders above ₹500' },
    { icon: FiShield, title: '100% Fresh', desc: 'Quality guaranteed or money back' },
    { icon: FiStar, title: 'Premium Quality', desc: 'Hand-picked from the best farms' },
    { icon: GiManualMeatGrinder, title: 'Farm Direct', desc: 'Directly from farmers to you' },
  ];

  return (
    <motion.div {...fadeIn}>
      {/* Live Order Ticker */}
      {liveStats.totalOrdersAllTime > 0 && (
        <div className="bg-gradient-to-r from-mango-500 to-mango-600 text-white py-2 text-center text-sm font-medium">
          <motion.p animate={{ opacity: [1, 0.7, 1] }} transition={{ duration: 2, repeat: Infinity }}>
            🥭 {liveStats.totalOrdersToday} orders placed today! | {liveStats.totalOrdersAllTime}+ happy customers served
          </motion.p>
        </div>
      )}

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-mango-50 via-white to-leaf-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div {...slideUp}>
              <span className="inline-block bg-mango-100 text-mango-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
                🥭 Mango Season 2026 is Here!
              </span>
              <h1 className="font-poppins text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Farm Fresh{' '}
                <span className="text-mango-600">Mangoes</span> Delivered to You
              </h1>
              <p className="text-lg text-gray-600 mt-6 max-w-lg">
                Premium Indian mangoes sourced directly from orchards across India. From Alphonso to Kesar, experience the authentic taste of summer.
              </p>
              <div className="flex flex-wrap gap-4 mt-8">
                <Link to="/shop" className="btn-primary flex items-center gap-2">
                  Shop Now <FiArrowRight />
                </Link>
                <Link to="/reviews" className="btn-outline">
                  See Reviews
                </Link>
              </div>
              <div className="flex items-center mt-8 space-x-2">
                <div className="flex -space-x-2">
                  {['🧑', '👩', '👨', '👩‍🦱'].map((emoji, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 bg-mango-100 rounded-full flex items-center justify-center text-sm border-2 border-white"
                    >
                      {emoji}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  <strong>{liveStats.totalOrdersAllTime || 500}+</strong> happy customers
                </p>
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative">
                <motion.img
                  src="https://images.unsplash.com/photo-1553279768-865429fa0078?w=600"
                  alt="Fresh Mangoes"
                  className="rounded-3xl shadow-2xl w-full"
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                />
                <div className="absolute -z-10 top-8 -right-4 w-72 h-72 bg-mango-200 rounded-full blur-3xl opacity-50" />
                <div className="absolute -z-10 -bottom-4 -left-4 w-64 h-64 bg-leaf-200 rounded-full blur-3xl opacity-50" />
                <motion.div
                  className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-lg px-4 py-3"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <div className="flex items-center space-x-2">
                    <FiTruck className="text-leaf-600" />
                    <span className="text-sm font-semibold">Free Delivery</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {features.map((f, i) => (
              <motion.div
                key={i}
                variants={staggerItem}
                whileHover={{ y: -5 }}
                className="card p-6 text-center"
              >
                <div className="w-14 h-14 bg-mango-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <f.icon className="text-2xl text-mango-600" />
                </div>
                <h3 className="font-poppins font-semibold text-gray-800">{f.title}</h3>
                <p className="text-sm text-gray-500 mt-2">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-poppins text-3xl md:text-4xl font-bold text-gray-900">
              Our <span className="text-mango-600">Premium</span> Mangoes
            </h2>
            <p className="text-gray-500 mt-3">Handpicked from the finest orchards in India</p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {products.slice(0, 4).map((product) => (
              <motion.div key={product._id} variants={staggerItem}>
                <Link to={`/product/${product._id}`} className="card block overflow-hidden group">
                  <div className="relative overflow-hidden">
                    <img
                      src={product.images?.[0] || 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=600'}
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 bg-mango-500 text-white text-xs px-2 py-1 rounded-full">
                      {product.category}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-poppins font-semibold text-gray-800">{product.name}</h3>
                    <StarRating rating={product.rating} count={product.numReviews} size={14} />
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xl font-bold text-mango-600">₹{product.price}</span>
                      <span className="text-xs text-gray-400">per {product.unit}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center mt-10">
            <Link to="/shop" className="btn-outline">
              View All Products →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            className="bg-gradient-to-r from-mango-400 to-mango-600 rounded-3xl p-8 md:p-12 text-center text-white"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="font-poppins text-3xl md:text-4xl font-bold">
              Ready to Taste the Best Mangoes?
            </h2>
            <p className="mt-4 text-mango-100 text-lg">
              Order now and get farm-fresh mangoes delivered within 24 hours!
            </p>
            <Link
              to="/shop"
              className="inline-block mt-8 bg-white text-mango-600 font-bold px-8 py-3 rounded-xl hover:bg-mango-50 transition-colors"
            >
              Order Now 🥭
            </Link>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default Home;

import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiSearch } from 'react-icons/fi';
import { fetchProducts } from '../redux/slices/productSlice.js';
import { staggerContainer, staggerItem, pageTransition } from '../animations/variants.js';
import StarRating from '../components/common/StarRating.jsx';
import Loader from '../components/common/Loader.jsx';

const Shop = () => {
  const dispatch = useDispatch();
  const { items: products, loading, page, pages, total } = useSelector((state) => state.products);
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    const params = { page: currentPage, sort };
    if (search) params.search = search;
    if (category !== 'All') params.category = category;
    dispatch(fetchProducts(params));
    setSearchParams(params);
  }, [search, category, sort, currentPage, dispatch]);

  const categories = ['All', 'Premium', 'Organic', 'Seasonal', 'Exotic'];
  const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'price-low', label: 'Price: Low → High' },
    { value: 'price-high', label: 'Price: High → Low' },
    { value: 'rating', label: 'Top Rated' },
  ];

  return (
    <motion.div {...pageTransition} className="pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-poppins text-3xl font-bold text-gray-900">Shop Mangoes</h1>
          <p className="text-gray-500 mt-2">{total} varieties available</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              placeholder="Search mangoes..."
              className="input-field pl-11"
            />
          </div>
          <select
            value={category}
            onChange={(e) => { setCategory(e.target.value); setCurrentPage(1); }}
            className="input-field md:w-48"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="input-field md:w-56"
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <Loader />
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-6xl">🥭</span>
            <p className="text-xl text-gray-500 mt-4">No mangoes found</p>
          </div>
        ) : (
          <>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {products.map((product) => (
                <motion.div key={product._id} variants={staggerItem}>
                  <Link to={`/product/${product._id}`} className="card block overflow-hidden group">
                    <div className="relative overflow-hidden">
                      <img
                        src={product.images?.[0] || 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=600'}
                        alt={product.name}
                        className="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 bg-mango-500 text-white text-xs px-2 py-1 rounded-full">
                        {product.category}
                      </span>
                      {product.stock > 0 && product.stock < 10 && (
                        <span className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          Few Left!
                        </span>
                      )}
                      {product.stock === 0 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="text-white font-bold text-lg">Out of Stock</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-gray-400">{product.origin}</p>
                      <h3 className="font-poppins font-semibold text-gray-800 mt-1">{product.name}</h3>
                      <StarRating rating={product.rating} count={product.numReviews} size={14} />
                      <p className="text-sm text-gray-500 mt-2 line-clamp-2">{product.description}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xl font-bold text-mango-600">₹{product.price}</span>
                        <span className="text-xs text-gray-400">per {product.unit}</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination */}
            {pages > 1 && (
              <div className="flex justify-center mt-10 space-x-2">
                {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`w-10 h-10 rounded-xl font-medium transition-colors ${
                      p === currentPage
                        ? 'bg-mango-500 text-white'
                        : 'bg-white text-gray-600 hover:bg-mango-50'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};

export default Shop;

import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { FiGrid, FiShoppingBag, FiPackage, FiUsers, FiStar, FiBell, FiLogOut, FiExternalLink } from 'react-icons/fi';
import { logout } from '../../redux/slices/authSlice.js';
import { fetchNotifications, markAllNotificationsRead } from '../../redux/slices/adminSlice.js';

const AdminLayout = () => {
  const [notifOpen, setNotifOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const { notifications, unreadCount } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: FiGrid },
    { name: 'Orders', path: '/admin/orders', icon: FiShoppingBag },
    { name: 'Products', path: '/admin/products', icon: FiPackage },
    { name: 'Users', path: '/admin/users', icon: FiUsers },
    { name: 'Reviews', path: '/admin/reviews', icon: FiStar },
  ];

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex md:flex-col w-64 bg-gray-900 text-white fixed h-full">
        <div className="p-6">
          <Link to="/admin/dashboard" className="flex items-center space-x-2">
            <span className="text-2xl">🥭</span>
            <span className="font-poppins font-bold text-lg">
              Fresh<span className="text-mango-500">Cart</span>
            </span>
          </Link>
          <p className="text-xs text-gray-400 mt-1">Admin Panel</p>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-mango-500 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <item.icon className="text-lg" />
              <span className="font-medium">{item.name}</span>
              {item.name === 'Orders' && unreadCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Link>
          ))}
        </nav>

        <div className="p-4 space-y-2">
          <Link
            to="/"
            className="flex items-center space-x-2 text-gray-400 hover:text-white px-4 py-2 transition-colors"
          >
            <FiExternalLink /> <span>View Store</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 text-gray-400 hover:text-white px-4 py-2 w-full transition-colors"
          >
            <FiLogOut /> <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 md:ml-64">
        {/* Top Bar */}
        <header className="bg-white shadow-sm sticky top-0 z-40">
          <div className="flex items-center justify-between px-4 sm:px-6 h-16">
            {/* Mobile nav */}
            <div className="md:hidden flex overflow-x-auto space-x-2 py-2 scrollbar-hide">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
                    isActive(item.path)
                      ? 'bg-mango-500 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <item.icon size={14} />
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>

            <div className="hidden md:block">
              <h2 className="font-poppins font-semibold text-gray-800">
                Welcome, {userInfo?.name || 'Admin'}
              </h2>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => {
                  setNotifOpen(!notifOpen);
                  if (!notifOpen && unreadCount > 0) {
                    dispatch(markAllNotificationsRead());
                  }
                }}
                className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FiBell className="text-xl text-gray-600" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border max-h-96 overflow-y-auto"
                >
                  <div className="p-4 border-b">
                    <h3 className="font-semibold">Notifications</h3>
                  </div>
                  {notifications.length === 0 ? (
                    <p className="p-4 text-sm text-gray-500">No notifications</p>
                  ) : (
                    notifications.slice(0, 10).map((n) => (
                      <div
                        key={n._id}
                        className={`p-3 border-b text-sm ${
                          n.isRead ? 'bg-white' : 'bg-mango-50'
                        }`}
                      >
                        <p>{n.message}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(n.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

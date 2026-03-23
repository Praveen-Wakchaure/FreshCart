import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiSearch, FiEye } from 'react-icons/fi';
import { fetchAdminOrders, updateOrderStatus } from '../../redux/slices/adminSlice.js';
import toast from 'react-hot-toast';
import Loader from '../../components/common/Loader.jsx';

const statusColors = {
  Processing: 'bg-yellow-100 text-yellow-700',
  Confirmed: 'bg-blue-100 text-blue-700',
  Shipped: 'bg-purple-100 text-purple-700',
  Delivered: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
};

const AdminOrders = () => {
  const dispatch = useDispatch();
  const { orders, loading, orderPages } = useSelector((state) => state.admin);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const params = { page };
    if (search) params.search = search;
    if (statusFilter !== 'All') params.status = statusFilter;
    dispatch(fetchAdminOrders(params));
  }, [dispatch, search, statusFilter, page]);

  const handleStatusChange = async (orderId, newStatus) => {
    const result = await dispatch(updateOrderStatus({ id: orderId, status: newStatus }));
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success(`Order updated to ${newStatus}`);
    }
  };

  return (
    <div>
      <h1 className="font-poppins text-2xl font-bold text-gray-900 mb-6">Orders</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by Order ID, name, phone..."
            className="input-field pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="input-field sm:w-48"
        >
          <option value="All">All Status</option>
          {['Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">Order ID</th>
                  <th className="px-4 py-3 text-left">Customer</th>
                  <th className="px-4 py-3 text-left hidden md:table-cell">Items</th>
                  <th className="px-4 py-3 text-left">Amount</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left hidden md:table-cell">Date</th>
                  <th className="px-4 py-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs">#{order._id.slice(-8).toUpperCase()}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{order.user?.name || 'N/A'}</p>
                      <p className="text-xs text-gray-400">{order.user?.mobileNumber}</p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">{order.orderItems?.length}</td>
                    <td className="px-4 py-3 font-semibold">₹{order.totalPrice}</td>
                    <td className="px-4 py-3">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className={`text-xs px-2 py-1 rounded-full border-0 font-medium ${statusColors[order.status]}`}
                      >
                        {['Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'].map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-gray-400 hidden md:table-cell">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        to={`/admin/orders/${order._id}`}
                        className="p-2 hover:bg-mango-50 rounded-lg text-mango-600 inline-flex"
                      >
                        <FiEye />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {orderPages > 1 && (
            <div className="flex justify-center p-4 space-x-2">
              {Array.from({ length: orderPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg text-sm ${
                    p === page ? 'bg-mango-500 text-white' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;

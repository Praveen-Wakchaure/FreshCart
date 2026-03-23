import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminUsers } from '../../redux/slices/adminSlice.js';
import Loader from '../../components/common/Loader.jsx';

const AdminUsers = () => {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAdminUsers());
  }, [dispatch]);

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="font-poppins text-2xl font-bold text-gray-900 mb-6">Users</h1>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">User</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Phone</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">City</th>
                <th className="px-4 py-3 text-left">Verified</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-mango-100 rounded-full flex items-center justify-center text-mango-700 font-bold text-sm">
                        {user.name?.[0]?.toUpperCase() || '?'}
                      </div>
                      <span className="font-medium">{user.name || 'Unnamed'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{user.email || '-'}</td>
                  <td className="px-4 py-3">{user.mobileNumber}</td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                    {user.address?.city || '-'}
                  </td>
                  <td className="px-4 py-3">
                    {user.isVerified ? (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Verified</span>
                    ) : (
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Unverified</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-400 hidden md:table-cell">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;

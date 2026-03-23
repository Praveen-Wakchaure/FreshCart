import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2, FiX, FiEdit2 } from 'react-icons/fi';
import { fetchAdminProducts, createProduct, deleteProduct, updateProduct } from '../../redux/slices/adminSlice.js';
import Loader from '../../components/common/Loader.jsx';

const emptyForm = { name: '', description: '', price: '', unit: 'kg', stock: '', category: 'Seasonal', origin: '' };

const AdminProducts = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.admin);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  // Edit state
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    dispatch(fetchAdminProducts());
  }, [dispatch]);

  const handleCreate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(form).forEach((key) => formData.append(key, form[key]));

    const result = await dispatch(createProduct(formData));
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Product created!');
      setForm(emptyForm);
      setShowForm(false);
    } else {
      toast.error(result.payload || 'Failed to create');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    const result = await dispatch(deleteProduct(id));
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Product deleted');
    }
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setEditForm({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      unit: product.unit || 'kg',
      stock: product.stock ?? '',
      category: product.category || 'Seasonal',
      origin: product.origin || '',
    });
  };

  const closeEdit = () => {
    setEditingProduct(null);
    setEditForm(emptyForm);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    const updates = {
      name: editForm.name,
      description: editForm.description,
      price: Number(editForm.price),
      unit: editForm.unit,
      stock: Number(editForm.stock),
      category: editForm.category,
      origin: editForm.origin,
    };

    const result = await dispatch(updateProduct({ id: editingProduct._id, updates }));
    setUpdating(false);
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Product updated!');
      closeEdit();
    } else {
      toast.error(result.payload || 'Failed to update');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-poppins text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500">{products.length} products</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); closeEdit(); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium ${
            showForm ? 'bg-gray-200 text-gray-700' : 'bg-mango-500 text-white'
          }`}
        >
          {showForm ? <><FiX /> Close</> : <><FiPlus /> Add Product</>}
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          onSubmit={handleCreate}
          className="card p-6 mb-6 space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              placeholder="Product name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input-field"
              required
            />
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="input-field"
            >
              {['Premium', 'Organic', 'Seasonal', 'Exotic'].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Price (₹)"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="input-field"
              required
            />
            <select
              value={form.unit}
              onChange={(e) => setForm({ ...form, unit: e.target.value })}
              className="input-field"
            >
              {['kg', 'dozen', 'box'].map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Stock"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              className="input-field"
              required
            />
            <input
              placeholder="Origin"
              value={form.origin}
              onChange={(e) => setForm({ ...form, origin: e.target.value })}
              className="input-field"
            />
          </div>
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="input-field h-20 resize-none"
            required
          />
          <button type="submit" className="btn-primary">Create Product</button>
        </motion.form>
      )}

      {/* Edit Modal */}
      <AnimatePresence>
        {editingProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeEdit}
          >
            <motion.form
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              onSubmit={handleUpdate}
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-poppins text-lg font-bold text-gray-900">Edit Product</h2>
                <button type="button" onClick={closeEdit} className="p-1 hover:bg-gray-100 rounded-lg">
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Name</label>
                  <input
                    placeholder="Product name"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
                  <select
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    className="input-field"
                  >
                    {['Premium', 'Organic', 'Seasonal', 'Exotic'].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    placeholder="Price"
                    value={editForm.price}
                    onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Unit</label>
                  <select
                    value={editForm.unit}
                    onChange={(e) => setEditForm({ ...editForm, unit: e.target.value })}
                    className="input-field"
                  >
                    {['kg', 'dozen', 'box'].map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Stock</label>
                  <input
                    type="number"
                    placeholder="Stock"
                    value={editForm.stock}
                    onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Origin</label>
                  <input
                    placeholder="Origin"
                    value={editForm.origin}
                    onChange={(e) => setEditForm({ ...editForm, origin: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                <textarea
                  placeholder="Description"
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="input-field h-20 resize-none"
                  required
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={updating}
                  className="btn-primary flex-1 disabled:opacity-50"
                >
                  {updating ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={closeEdit}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Products Table */}
      {loading ? (
        <Loader />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">Product</th>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-left">Price</th>
                  <th className="px-4 py-3 text-left">Stock</th>
                  <th className="px-4 py-3 text-left hidden md:table-cell">Rating</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.images?.[0] || 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=50'}
                          alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <span className="font-medium">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs bg-mango-100 text-mango-700 px-2 py-0.5 rounded-full">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">₹{product.price}/{product.unit}</td>
                    <td className="px-4 py-3">
                      <span className={product.stock < 10 ? 'text-red-600 font-semibold' : ''}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      {product.rating?.toFixed(1)} ⭐
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEdit(product)}
                          className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Edit product"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                          title="Delete product"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;

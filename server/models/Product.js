import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    unit: { type: String, enum: ['kg', 'dozen', 'box'], default: 'kg' },
    stock: { type: Number, required: true, default: 0 },
    images: [{ type: String }],
    category: {
      type: String,
      enum: ['Premium', 'Organic', 'Seasonal', 'Exotic'],
      default: 'Seasonal',
    },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    isAvailable: { type: Boolean, default: true },
    weight: { type: String, default: '' },
    origin: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Product', productSchema);

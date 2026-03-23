import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer;

const seedDatabase = async () => {
  const { default: User } = await import('../models/User.js');
  const { default: Product } = await import('../models/Product.js');

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@freshcart.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123456';

  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    await User.create({
      name: 'Admin',
      email: adminEmail,
      mobileNumber: '9999999999',
      password: adminPassword,
      role: 'admin',
      isVerified: true,
      isProfileComplete: true,
      address: {
        street: '123 Admin Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
      },
    });
    console.log('✅ Admin user seeded');
  }

  const productCount = await Product.countDocuments();
  if (productCount === 0) {
    const products = [
      {
        name: 'Alphonso Mango',
        description: 'The king of mangoes! Premium Alphonso mangoes from Ratnagiri, Maharashtra. Known for their rich, creamy texture, vibrant saffron color, and unmatched sweetness. Each mango is hand-picked at the perfect ripeness to ensure the finest taste experience.',
        price: 899,
        unit: 'dozen',
        stock: 100,
        category: 'Premium',
        rating: 4.8,
        numReviews: 124,
        images: ['https://images.unsplash.com/photo-1553279768-865429fa0078?w=600'],
        weight: '3-4 kg per dozen',
        origin: 'Ratnagiri, Maharashtra',
        isAvailable: true,
      },
      {
        name: 'Kesar Mango',
        description: 'The Queen of Mangoes from Gujarat! Kesar mangoes are famous for their unique aroma and sweet taste. With a beautiful golden-yellow flesh and fewer fibers, these mangoes are perfect for eating fresh or making desserts.',
        price: 699,
        unit: 'dozen',
        stock: 150,
        category: 'Premium',
        rating: 4.6,
        numReviews: 89,
        images: ['https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=600'],
        weight: '2.5-3 kg per dozen',
        origin: 'Junagadh, Gujarat',
        isAvailable: true,
      },
      {
        name: 'Dasheri Mango',
        description: 'A beloved seasonal favourite from Lucknow! Dasheri mangoes are known for their sweet, aromatic flavour and smooth, fibreless pulp. Their light green to yellow skin hides an incredibly delicious, honey-like sweetness.',
        price: 499,
        unit: 'dozen',
        stock: 200,
        category: 'Seasonal',
        rating: 4.5,
        numReviews: 67,
        images: ['https://images.unsplash.com/photo-1591073113125-e46713c829ed?w=600'],
        weight: '2-3 kg per dozen',
        origin: 'Lucknow, UP',
        isAvailable: true,
      },
      {
        name: 'Langra Mango',
        description: 'The pride of Varanasi! Langra mangoes are a mid-season variety prized for their distinct flavour profile — a perfect balance of sweet and slightly tangy. Their green skin remains green even when ripe, with juicy, fibreless flesh inside.',
        price: 449,
        unit: 'dozen',
        stock: 180,
        category: 'Seasonal',
        rating: 4.4,
        numReviews: 45,
        images: ['https://images.unsplash.com/photo-1605027990121-cbae9e0642df?w=600'],
        weight: '2-2.5 kg per dozen',
        origin: 'Varanasi, UP',
        isAvailable: true,
      },
      {
        name: 'Totapuri Mango',
        description: 'A versatile organic mango from Karnataka! Totapuri, also known as Bangalora, has a distinctive parrot-beak shape. Mildly sweet with a tangy twist, it is perfect for salads, pickles, and smoothies. Organically grown without pesticides.',
        price: 349,
        unit: 'kg',
        stock: 250,
        category: 'Organic',
        rating: 4.2,
        numReviews: 38,
        images: ['https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600'],
        weight: '1 kg',
        origin: 'Bangalore, Karnataka',
        isAvailable: true,
      },
      {
        name: 'Hapus Mango (Gift Box)',
        description: 'Premium Devgad Hapus mangoes elegantly packaged in a luxury gift box. Each box contains hand-selected, A-grade Hapus mangoes with GI tag certification. The perfect gift for mango lovers — ideal for festivals, celebrations, and corporate gifting.',
        price: 1299,
        unit: 'box',
        stock: 50,
        category: 'Premium',
        rating: 4.9,
        numReviews: 56,
        images: ['https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=600'],
        weight: '2 kg (6 mangoes)',
        origin: 'Devgad, Maharashtra',
        isAvailable: true,
      },
      {
        name: 'Organic Chausa Mango',
        description: 'Late-season delight from Hardoi, UP! Chausa mangoes are known for their intensely sweet, aromatic flesh. Grown organically using traditional farming practices. Best enjoyed by sucking the juice — a true mango experience!',
        price: 599,
        unit: 'dozen',
        stock: 120,
        category: 'Organic',
        rating: 4.5,
        numReviews: 34,
        images: ['https://images.unsplash.com/photo-1592878897400-74c0e4�3a694?w=600'],
        weight: '3-4 kg per dozen',
        origin: 'Hardoi, UP',
        isAvailable: true,
      },
      {
        name: 'Badami Mango',
        description: 'The Karnataka Alphonso! Badami mangoes closely resemble Alphonso in taste and aroma but are more affordable. With smooth, fibreless pulp and a rich, sweet flavour, they are perfect for desserts, milkshakes, and fresh eating.',
        price: 549,
        unit: 'dozen',
        stock: 160,
        category: 'Seasonal',
        rating: 4.3,
        numReviews: 29,
        images: ['https://images.unsplash.com/photo-1519096845289-95806ee03a1a?w=600'],
        weight: '2.5-3 kg per dozen',
        origin: 'North Karnataka',
        isAvailable: true,
      },
    ];

    await Product.insertMany(products);
    console.log('✅ Products seeded (8 mangoes)');
  }
};

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri || mongoUri === 'memory' || mongoUri === '') {
      console.log('🥭 Starting in-memory MongoDB...');
      mongoServer = await MongoMemoryServer.create();
      const uri = mongoServer.getUri();
      await mongoose.connect(uri);
      console.log(`✅ In-memory MongoDB connected: ${uri}`);
      await seedDatabase();
      return;
    }

    try {
      await mongoose.connect(mongoUri);
      console.log(`✅ MongoDB connected: ${mongoose.connection.host}`);
    } catch (err) {
      console.log('⚠️ External MongoDB failed, falling back to in-memory...');
      mongoServer = await MongoMemoryServer.create();
      const uri = mongoServer.getUri();
      await mongoose.connect(uri);
      console.log(`✅ In-memory MongoDB connected: ${uri}`);
      await seedDatabase();
    }
  } catch (error) {
    console.error(`❌ Database connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;

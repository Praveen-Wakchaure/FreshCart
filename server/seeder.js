import 'dotenv/config';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from './models/User.js';
import Product from './models/Product.js';

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    let mongoServer;

    if (!mongoUri || mongoUri === 'memory' || mongoUri === '') {
      mongoServer = await MongoMemoryServer.create();
      await mongoose.connect(mongoServer.getUri());
      console.log('Connected to in-memory MongoDB');
    } else {
      await mongoose.connect(mongoUri);
      console.log('Connected to MongoDB');
    }

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});

    // Create admin
    const admin = await User.create({
      name: 'Admin',
      email: process.env.ADMIN_EMAIL || 'admin@freshcart.com',
      mobileNumber: '9999999999',
      password: process.env.ADMIN_PASSWORD || 'admin123456',
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
    console.log('✅ Admin created:', admin.email);

    // Create products
    const products = [
      {
        name: 'Alphonso Mango',
        description: 'The king of mangoes! Premium Alphonso mangoes from Ratnagiri, Maharashtra.',
        price: 899, unit: 'dozen', stock: 100, category: 'Premium',
        rating: 4.8, numReviews: 124,
        images: ['https://images.unsplash.com/photo-1553279768-865429fa0078?w=600'],
        weight: '3-4 kg per dozen', origin: 'Ratnagiri, Maharashtra',
      },
      {
        name: 'Kesar Mango',
        description: 'The Queen of Mangoes from Gujarat! Famous for unique aroma and sweet taste.',
        price: 699, unit: 'dozen', stock: 150, category: 'Premium',
        rating: 4.6, numReviews: 89,
        images: ['https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=600'],
        weight: '2.5-3 kg per dozen', origin: 'Junagadh, Gujarat',
      },
      {
        name: 'Dasheri Mango',
        description: 'A beloved seasonal favourite from Lucknow!',
        price: 499, unit: 'dozen', stock: 200, category: 'Seasonal',
        rating: 4.5, numReviews: 67,
        images: ['https://images.unsplash.com/photo-1591073113125-e46713c829ed?w=600'],
        weight: '2-3 kg per dozen', origin: 'Lucknow, UP',
      },
      {
        name: 'Langra Mango',
        description: 'The pride of Varanasi! Perfect balance of sweet and slightly tangy.',
        price: 449, unit: 'dozen', stock: 180, category: 'Seasonal',
        rating: 4.4, numReviews: 45,
        images: ['https://images.unsplash.com/photo-1605027990121-cbae9e0642df?w=600'],
        weight: '2-2.5 kg per dozen', origin: 'Varanasi, UP',
      },
      {
        name: 'Totapuri Mango',
        description: 'A versatile organic mango from Karnataka!',
        price: 349, unit: 'kg', stock: 250, category: 'Organic',
        rating: 4.2, numReviews: 38,
        images: ['https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600'],
        weight: '1 kg', origin: 'Bangalore, Karnataka',
      },
      {
        name: 'Hapus Mango (Gift Box)',
        description: 'Premium Devgad Hapus in a luxury gift box.',
        price: 1299, unit: 'box', stock: 50, category: 'Premium',
        rating: 4.9, numReviews: 56,
        images: ['https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=600'],
        weight: '2 kg (6 mangoes)', origin: 'Devgad, Maharashtra',
      },
      {
        name: 'Organic Chausa Mango',
        description: 'Late-season delight from Hardoi, UP!',
        price: 599, unit: 'dozen', stock: 120, category: 'Organic',
        rating: 4.5, numReviews: 34,
        images: ['https://images.unsplash.com/photo-1592878897400-74c0e4e3a694?w=600'],
        weight: '3-4 kg per dozen', origin: 'Hardoi, UP',
      },
      {
        name: 'Badami Mango',
        description: 'The Karnataka Alphonso! Rich, sweet flavour at a great price.',
        price: 549, unit: 'dozen', stock: 160, category: 'Seasonal',
        rating: 4.3, numReviews: 29,
        images: ['https://images.unsplash.com/photo-1519096845289-95806ee03a1a?w=600'],
        weight: '2.5-3 kg per dozen', origin: 'North Karnataka',
      },
    ];

    await Product.insertMany(products);
    console.log('✅ 8 products seeded');

    console.log('\n🥭 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedDatabase();

import mongoose from 'mongoose';
import dotenv from 'dotenv';

import User from './models/User.js';
import Food from './models/Food.js';
import Category from './models/Category.js';
import Order from './models/Order.js';
import Offer from './models/Offer.js';

import { allIndianFoodItems } from './data/foodData.js';

dotenv.config();

const categories = [
  'Appetizers & Starters',
  'Tandoori & Kebabs',
  'Curries & Gravies',
  'Biryanis & Rice',
  'Breads',
  'South Indian',
  'Street Food',
  'Desserts',
  'Beverages',
  'Thalis & Combos'
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('MongoDB Connected');

    // =========================
    // Categories
    // =========================

    const categoryDocs = await Category.insertMany(
      categories.map((name) => ({
        name,
        description: `${name} category`
      }))
    );

    const categoryMap = {};

    categoryDocs.forEach((cat) => {
      categoryMap[cat.name] = cat._id;
    });

    // =========================
    // Users
    // =========================

    const users = await User.create([
      {
        name: 'Priya Sharma',
        email: 'priya.sharma@email.com',
        password: 'password123',
        phone: '+91 9876543210',
        address: '123 Marine Drive',
        city: 'Mumbai',
        role: 'customer'
      },
      {
        name: 'Rahul Verma',
        email: 'rahul.verma@email.com',
        password: 'password123',
        phone: '+91 9876543211',
        address: '456 Connaught Place',
        city: 'Delhi',
        role: 'customer'
      },
      {
        name: 'Admin User',
        email: 'admin@spiceroots.com',
        password: 'admin123',
        phone: '+91 18001234567',
        address: u.address || '',
        city: '',
        role: 'admin'
      }
    ]);

    console.log('Users Seeded');

    // =========================
    // Foods
    // =========================

    const foodsToInsert = allIndianFoodItems.map((food) => ({
      name: food.name,
      description: food.description,
      price: food.price,
      category: categoryMap[food.category],
      categoryName: food.category,
      image: food.image,
      rating: food.rating,
      reviews: food.reviews,
      isVegetarian: food.isVegetarian,
      isAvailable: true
    }));

    const foods = await Food.insertMany(foodsToInsert);

    console.log(`${foods.length} Foods Seeded`);

    // =========================
    // Offers
    // =========================

    await Offer.insertMany([
      {
        code: 'WELCOME20',
        title: 'Welcome Offer',
        description: '20% off on first order',
        discountType: 'percentage',
        discountValue: 20,
        minOrderAmount: 500,
        maxDiscount: 200,
        validUntil: new Date('2027-12-31')
      },
      {
        code: 'FLAT100',
        title: 'Flat ₹100 Off',
        description: 'Get ₹100 off on orders above ₹999',
        discountType: 'flat',
        discountValue: 100,
        minOrderAmount: 999,
        validUntil: new Date('2027-12-31')
      }
    ]);

    console.log('Offers Seeded');

    // =========================
    // Orders
    // =========================

    const paneerTikka = foods.find(
      (f) => f.name === 'Paneer Tikka'
    );

    const tandooriChicken = foods.find(
      (f) => f.name === 'Tandoori Chicken (Half)'
    );

    const butterChicken = foods.find(
      (f) => f.name === 'Butter Chicken'
    );

    const malaiKofta = foods.find(
      (f) => f.name === 'Malai Kofta'
    );

    await Order.insertMany([
      {
        user: users[0]._id,

        items: [
          {
            food: paneerTikka._id,
            name: paneerTikka.name,
            quantity: 2,
            price: paneerTikka.price,
            image: paneerTikka.image
          },
          {
            food: tandooriChicken._id,
            name: tandooriChicken.name,
            quantity: 1,
            price: tandooriChicken.price,
            image: tandooriChicken.image
          }
        ],

        totalAmount: 850.5,

        paymentStatus: 'completed',
        paymentMethod: 'online',
        orderStatus: 'delivered',

        customerName: 'Priya Sharma',
        customerPhone: '+91 9876543210',

        deliveryAddress: '123 Marine Drive',
        deliveryCity: 'Mumbai',

        deliveryInstructions: 'Please ring the doorbell',

        deliveryPartner: deliveryPartners[0],

        estimatedDeliveryTime: '30 mins',

        reviewed: false
      },

      {
        user: users[1]._id,

        items: [
          {
            food: butterChicken._id,
            name: butterChicken.name,
            quantity: 1,
            price: butterChicken.price,
            image: butterChicken.image
          },
          {
            food: malaiKofta._id,
            name: malaiKofta.name,
            quantity: 2,
            price: malaiKofta.price,
            image: malaiKofta.image
          }
        ],

        totalAmount: 620.75,

        paymentStatus: 'completed',
        paymentMethod: 'cod',

        orderStatus: 'out_for_delivery',

        customerName: 'Rahul Verma',
        customerPhone: '+91 9876543211',

        deliveryAddress: '456 Connaught Place',
        deliveryCity: 'Delhi',

        deliveryPartner: deliveryPartners[1],

        estimatedDeliveryTime: '15 mins',

        reviewed: false
      }
    ]);

    console.log('Orders Seeded');

    console.log('Database Seeded Successfully');

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedData();
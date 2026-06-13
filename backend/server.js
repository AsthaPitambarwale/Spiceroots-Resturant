<<<<<<< HEAD
import express from "express";
import dotenv from "dotenv";
import "dotenv/config";
import cors from "cors";
import connectDB from "./config/db.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
=======
import express from 'express';
import dotenv from 'dotenv';
import 'dotenv/config';
import cors from 'cors';
import connectDB from './config/db.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
>>>>>>> 97323f6 (Intial)

// Import routes
import authRoutes from './routes/auth.js';
import foodRoutes from './routes/foods.js';
import categoryRoutes from './routes/categories.js';
import orderRoutes from './routes/orders.js';
import reservationRoutes from './routes/reservations.js';
import notificationRoutes from './routes/notifications.js';
import offerRoutes from './routes/offers.js';
import reviewRoutes from './routes/reviews.js';
import paymentRoutes from './routes/paymentRoutes.js';
import { updateExpiredOrders } from "./jobs/orderStatusJob.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

setInterval(async () => {
  await updateExpiredOrders();
}, 60000);

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'SpiceRoots API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      foods: '/api/foods',
      categories: '/api/categories',
      orders: '/api/orders',
      reservations: '/api/reservations',
      notifications: '/api/notifications',
      offers: '/api/offers',
      reviews: '/api/reviews'
    }
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/reviews', reviewRoutes);
app.use("/api/payment", paymentRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  console.log('\n📚 Available endpoints:');
  console.log('   - POST   /api/auth/register');
  console.log('   - POST   /api/auth/login');
  console.log('   - GET    /api/auth/me');
  console.log('   - GET    /api/foods');
  console.log('   - GET    /api/categories');
  console.log('   - POST   /api/orders');
  console.log('   - GET    /api/orders/my-orders');
  console.log('   - POST   /api/reservations');
  console.log('   - GET    /api/notifications');
  console.log('   - GET    /api/offers');
  console.log('   - POST   /api/reviews');
  console.log('\n✅ Backend ready for requests!\n');
});

export default app;

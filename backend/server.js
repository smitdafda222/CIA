const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const requestLogger = require('./middleware/logger');
const apiRoutes = require('./routes/api');
const Customer = require('./models/Customer');
const Restaurant = require('./models/Restaurant');
const Order = require('./models/Order');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/quickbite';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Global request logger middleware (Task 3)
app.use(requestLogger);

// API v1 Routes
app.use('/api/v1', apiRoutes);

// Global Error-Handling Middleware (Task 3)
app.use((err, req, res, next) => {
  console.error('[Global Error Handler]:', err.stack || err);
  
  const statusCode = err.statusCode || err.status || 500;
  res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal Server Error',
    path: req.originalUrl
  });
});

// Initial Database Seeder
const seedDatabase = async () => {
  try {
    const custCount = await Customer.countDocuments();
    let defaultCustomer;
    if (custCount === 0) {
      defaultCustomer = await Customer.create({
        name: 'Jay Chheta',
        email: 'jaychheta06@gmail.com',
        phone: '09574361060',
        address: 'A-802 sarjan heights dabholi gam,katargam'
      });
      console.log('Seeded default Customer into MongoDB:', defaultCustomer.name);
    } else {
      defaultCustomer = await Customer.findOne({ email: 'jaychheta06@gmail.com' });
    }

    const restCount = await Restaurant.countDocuments();
    let restaurants = [];
    if (restCount === 0) {
      restaurants = await Restaurant.insertMany([
        { name: 'hello', cuisine: 'high', rating: 4.0, isOpen: true },
        { name: 'trishiv manchurian', cuisine: '5', rating: 4.0, isOpen: true },
        { name: 'peptos', cuisine: 'burgers', rating: 4.0, isOpen: true },
        { name: 'ganesh', cuisine: 'dhosa', rating: 4.5, isOpen: true },
        { name: 'bhaipaji', cuisine: 'pavbhaji', rating: 4.0, isOpen: true },
        { name: 'janeman', cuisine: 'chiken biryani', rating: 4.0, isOpen: true }
      ]);
      console.log(`Seeded ${restaurants.length} Restaurants into MongoDB.`);
    } else {
      restaurants = await Restaurant.find();
    }

    const orderCount = await Order.countDocuments();
    if (orderCount === 0 && defaultCustomer && restaurants.length > 0) {
      const defaultOrder = await Order.create({
        customerId: defaultCustomer._id,
        restaurantId: restaurants[1]._id,
        items: [{ name: 'manchurian', qty: 1 }],
        totalAmount: 10,
        status: 'pending'
      });
      console.log('Seeded default Order into MongoDB:', defaultOrder._id);
    }
  } catch (err) {
    console.error('Error seeding MongoDB:', err.message);
  }
};

// Start Server & Connect MongoDB (Task 5)
const startServer = async () => {
  try {
    console.log(`Connecting to MongoDB at ${MONGO_URI}...`);
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB Connected Successfully via Mongoose!');
    
    // Seed initial data for demo and Compass visualization
    await seedDatabase();

  } catch (err) {
    console.error('MongoDB Connection Failed! Will fall back to in-memory mode.', err.message);
  }

  app.listen(PORT, () => {
    console.log(`QuickBite Express Backend running on port ${PORT}`);
  });
};

startServer();

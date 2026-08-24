const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');
const Restaurant = require('../models/Restaurant');
const Order = require('../models/Order');
const authGuard = require('../middleware/authGuard');
const memoryStore = require('../models/db-fallback');

const JWT_SECRET = process.env.JWT_SECRET || 'quickbite_secret_key_2026';

// Check if MongoDB is connected
const isMongoConnected = () => {
  const mongoose = require('mongoose');
  return mongoose.connection.readyState === 1;
};

// 1. POST /api/v1/auth/login
router.post('/auth/login', async (req, res, next) => {
  try {
    const { email = 'jaychheta06@gmail.com', name = 'Jay Chheta' } = req.body;

    let customer;
    if (isMongoConnected()) {
      customer = await Customer.findOne({ email });
      if (!customer) {
        customer = await Customer.create({
          name,
          email,
          phone: '09574361060',
          address: 'A-802 sarjan heights dabholi gam,katargam'
        });
      }
    } else {
      console.log('[DB Mock Fallback] falling back to memory for Customer.findOne');
      customer = memoryStore.customers[0];
    }

    const token = jwt.sign(
      { id: customer._id, email: customer.email, name: customer.name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      customer
    });
  } catch (error) {
    next(error);
  }
});

// 2. GET /api/v1/restaurants (Public)
router.get('/restaurants', async (req, res, next) => {
  try {
    let restaurants = [];
    if (isMongoConnected()) {
      restaurants = await Restaurant.find();
    } else {
      console.log('[DB Mock Fallback] falling back to memory for Restaurant.find');
      restaurants = memoryStore.restaurants;
    }
    res.status(200).json({
      success: true,
      count: restaurants.length,
      data: restaurants
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/restaurants (Add new restaurant - Admin)
router.post('/restaurants', async (req, res, next) => {
  try {
    const { name, cuisine, rating, isOpen } = req.body;
    if (!name || !cuisine) {
      return res.status(400).json({
        success: false,
        error: 'Name and cuisine are required'
      });
    }

    let restaurant;
    if (isMongoConnected()) {
      restaurant = await Restaurant.create({
        name,
        cuisine,
        rating: rating !== undefined ? Number(rating) : 4.0,
        isOpen: isOpen !== undefined ? Boolean(isOpen) : true
      });
    } else {
      console.log('[DB Mock Fallback] falling back to memory for Restaurant.create');
      restaurant = {
        _id: '66d0200000000000000000' + (memoryStore.restaurants.length + 1),
        name,
        cuisine,
        rating: rating !== undefined ? Number(rating) : 4.0,
        isOpen: isOpen !== undefined ? Boolean(isOpen) : true
      };
      memoryStore.restaurants.push(restaurant);
    }

    res.status(201).json({
      success: true,
      data: restaurant
    });
  } catch (error) {
    next(error);
  }
});

// 3. POST /api/v1/orders (Protected)
router.post('/orders', authGuard, async (req, res, next) => {
  try {
    const { customerId, restaurantId, items, totalAmount, status } = req.body;

    // Task 5 validation checks
    if (!customerId || !restaurantId) {
      return res.status(400).json({
        success: false,
        error: 'ValidationError: customerId and restaurantId are required fields'
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'ValidationError: items array is required and must not be empty'
      });
    }

    if (totalAmount !== undefined && Number(totalAmount) < 0) {
      return res.status(400).json({
        success: false,
        error: 'ValidationError: totalAmount must be at least 0'
      });
    }

    const validStatuses = ['pending', 'preparing', 'out-for-delivery', 'delivered', 'cancelled'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `ValidationError: status '${status}' is not a valid enum value`
      });
    }

    let newOrder;
    if (isMongoConnected()) {
      const created = await Order.create({
        customerId,
        restaurantId,
        items,
        totalAmount: Number(totalAmount) || 0,
        status: status || 'pending'
      });
      newOrder = await Order.findById(created._id)
        .populate('customerId', 'name email')
        .populate('restaurantId', 'name cuisine');
    } else {
      console.log('[DB Mock Fallback] falling back to memory for Order.create');
      const cust = memoryStore.customers.find(c => c._id === customerId) || memoryStore.customers[0];
      const rest = memoryStore.restaurants.find(r => r._id === restaurantId) || memoryStore.restaurants[0];
      newOrder = {
        _id: '66d0300000000000000000' + (memoryStore.orders.length + 1),
        customerId: { _id: cust._id, name: cust.name, email: cust.email },
        restaurantId: { _id: rest._id, name: rest.name, cuisine: rest.cuisine },
        items,
        totalAmount: Number(totalAmount) || 0,
        status: status || 'pending',
        createdAt: new Date().toISOString()
      };
      memoryStore.orders.unshift(newOrder);
    }

    res.status(201).json({
      success: true,
      data: newOrder
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }
    next(error);
  }
});

// 4. GET /api/v1/orders (Protected)
router.get('/orders', authGuard, async (req, res, next) => {
  try {
    let orders = [];
    if (isMongoConnected()) {
      orders = await Order.find()
        .populate('customerId', 'name email')
        .populate('restaurantId', 'name cuisine')
        .sort({ createdAt: -1 });
    } else {
      console.log('[DB Mock Fallback] falling back to memory for Customer.findById');
      orders = memoryStore.orders;
    }

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
});

// 5. PATCH /api/v1/orders/:id/status (Protected)
router.patch('/orders/:id/status', authGuard, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'preparing', 'out-for-delivery', 'delivered', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `ValidationError: status '${status}' is invalid`
      });
    }

    let updatedOrder;
    if (isMongoConnected()) {
      updatedOrder = await Order.findByIdAndUpdate(
        id,
        { status },
        { new: true, runValidators: true }
      )
        .populate('customerId', 'name email')
        .populate('restaurantId', 'name cuisine');
    } else {
      console.log('[DB Mock Fallback] falling back to memory for Customer.findById');
      const order = memoryStore.orders.find(o => o._id === id);
      if (order) {
        order.status = status;
        updatedOrder = order;
      }
    }

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      data: updatedOrder
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

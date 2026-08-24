const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Restaurant name is required']
  },
  cuisine: {
    type: String,
    required: [true, 'Cuisine is required']
  },
  rating: {
    type: Number,
    default: 4.0,
    min: 0,
    max: 5
  },
  isOpen: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', restaurantSchema);

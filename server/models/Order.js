const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: String,
  userEmail: String,
  items: [{
    name: String,
    price: Number,
    quantity: Number,
    image: String,
    config: mongoose.Schema.Types.Mixed,
  }],
  total: { type: Number, required: true },
  subtotal: Number,
  tax: Number,
  status: { 
    type: String, 
    enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'], 
    default: 'Processing' 
  },
  statusDates: {
    Processing: { type: Date },
    Shipped:    { type: Date },
    Delivered:  { type: Date },
    Cancelled:  { type: Date },
  },
  processingDate: { type: Date, default: Date.now },
  tracking: { type: String, default: '' },
  shippedEmailSent: { type: Boolean, default: false },
  shippingAddress: {
    name: String,
    email: String,
    line1: String,
    city: String,
    state: String,
    postal_code: String,
    country: { type: String, default: 'US' },
  },
  paymentIntentId: String,
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);

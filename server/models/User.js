const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const addressSchema = new mongoose.Schema({
  label: { type: String, default: 'Home' },
  name: String,
  street: String,
  city: String,
  state: String,
  zip: String,
  country: { type: String, default: 'US' },
  isDefault: { type: Boolean, default: false },
});

const orderSchema = new mongoose.Schema({
  orderId: String,
  product: String, // fallback for legacy
  qty: Number,     // fallback for legacy
  items: [{
    name: String,
    price: Number,
    quantity: Number,
    image: String,
    config: mongoose.Schema.Types.Mixed,
  }],
  total: Number,
  subtotal: Number,
  tax: Number,
  status: { type: String, enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'], default: 'Processing' },
  tracking: String,
  address: String,
  shippingAddress: {
    name: String,
    email: String,
    line1: String,
    city: String,
    postal_code: String,
  },
  paymentIntentId: String,
  createdAt: { type: Date, default: Date.now },
});

const quoteSchema = new mongoose.Schema({
  quoteId: String,
  boxType: String,
  qty: Number,
  dims: String,
  material: String,
  type: { type: String, default: 'quote' }, // 'quote' or 'sample'
  productName: String,
  deliveryAddress: String,
  status: { type: String, enum: ['Pending', 'Reviewing', 'Quoted', 'Accepted', 'Rejected'], default: 'Pending' },
  quotedPrice: String,
  createdAt: { type: Date, default: Date.now },
});

const savedDesignSchema = new mongoose.Schema({
  name: String,
  boxType: String,
  material: String,
  finish: String,
  l: Number,
  w: Number,
  h: Number,
  unit: String,
  qty: Number,
  addons: [String],
  artworkUrl: String,
  thumbnail: String,
  _savedDesign: { type: Boolean, default: true },
  date: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  phone: { type: String, default: '' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  avatar: { type: String, default: '' },
  loyaltyPoints: { type: Number, default: 150 },
  loyaltyTier: { type: String, default: 'Silver' },
  orders: [orderSchema],
  quotes: [quoteSchema],
  addresses: [addressSchema],
  savedDesigns: [savedDesignSchema],
  favorites: [String],
  notifications: {
    orderUpdates: { type: Boolean, default: true },
    promotions: { type: Boolean, default: false },
    newsletter: { type: Boolean, default: true },
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  lastLocation: {
    city: String,
    country: String,
    lat: Number,
    lng: Number,
  },
  createdAt: { type: Date, default: Date.now },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);

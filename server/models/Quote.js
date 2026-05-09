const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
  quoteId: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: String,
  userEmail: String,
  boxType: String,
  qty: Number,
  dims: String,
  material: String,
  type: { type: String, enum: ['quote', 'sample'], default: 'quote' },
  productName: String,
  deliveryAddress: String,
  status: { 
    type: String, 
    enum: ['Pending', 'Reviewing', 'Quoted', 'Accepted', 'Rejected'], 
    default: 'Pending' 
  },
  quotedPrice: String,
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Quote', quoteSchema);

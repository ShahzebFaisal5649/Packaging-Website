const mongoose = require('mongoose');

const ContactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  company: { type: String },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  interests: { type: [String], default: [] },
  status: { type: String, enum: ['New', 'Replied', 'Closed'], default: 'New' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ContactMessage', ContactMessageSchema);

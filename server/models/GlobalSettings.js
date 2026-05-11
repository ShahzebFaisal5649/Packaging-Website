const mongoose = require('mongoose');

const globalSettingsSchema = new mongoose.Schema({
  siteName: { type: String, default: 'Design Custom Box' },
  logo: { type: String, default: '' },
  contactEmail: { type: String, default: 'designcustombox@gmail.com' },
  socialLinks: {
    facebook: { type: String, default: '' },
    instagram: { type: String, default: '' },
    twitter: { type: String, default: '' },
    linkedin: { type: String, default: '' },
  },
  currency: { type: String, default: 'USD' },
  taxRate: { type: Number, default: 0 },
  maintenanceMode: { type: Boolean, default: false },
  
  // Loyalty Logic
  loyaltySettings: {
    pointsPerDollar: { type: Number, default: 1 },
    pointValueInCurrency: { type: Number, default: 0.01 }, // 100 points = $1
    multipliers: [
      {
        role: { type: String, default: 'user' },
        multiplier: { type: Number, default: 1 }
      },
      {
        role: { type: String, default: 'vip' },
        multiplier: { type: Number, default: 1.5 }
      }
    ]
  },
  
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GlobalSettings', globalSettingsSchema);

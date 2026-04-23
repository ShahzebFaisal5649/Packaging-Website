const mongoose = require('mongoose');

const contestSchema = new mongoose.Schema({
  title:    { type: String, required: true },
  price:    { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  imageUrl: String,
  designs:  { type: Number, default: 0 },
  industry: String,
  tier:     String,
  pills:    [String],
  status:   { type: String, default: 'Finished' },
});

module.exports = mongoose.model('Contest', contestSchema);


const express = require('express');

const router = express.Router();

// Lazily initialize Stripe so the secret key is read after dotenv loads
let _stripe;
const getStripe = () => {
  if (!_stripe) {
    const Stripe = require('stripe');
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return _stripe;
};

// POST /api/payment/create-intent
router.post('/create-intent', async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }
    const stripe = getStripe();
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // cents
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

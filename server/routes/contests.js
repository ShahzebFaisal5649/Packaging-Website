const express = require('express');
const router = express.Router();
const Contest = require('../models/Contest');

const SEEDS = [
  { title: 'Custom beef jerky packaging & labeling', price: 799, imageUrl: 'https://images-platform.99static.com//Yen-lGjdqUZBNNW_0B0LlIkxwF8=/400x400/99designs-contests-attachments/73/73382/attachment_73382792', designs: 134, industry: 'Food & Drink', tier: 'Gold', pills: ['Packaging & label', 'Guaranteed'] },
  { title: 'Luxury cosmetics packaging for skincare line', price: 1299, imageUrl: 'https://images-platform.99static.com//ZRt2e3EfC9zwhnfj-iNG1Tk0ppE=/400x400/99designs-work-samples/work-sample-designs/1315030/dda0b22d-e2d6-40d2-8425-84511f0f5cac', designs: 89, industry: 'Beauty', tier: 'Platinum', pills: ['Packaging & label', 'Top Level'] },
  { title: 'Artisan coffee subscription box design', price: 599, imageUrl: 'https://images-platform.99static.com//ygw5ty5igIfPIOhWoOhZ5FJgmqQ=/400x400/projects-files/206/20628/2062862/a3fd5610-d155-4be5-a814-20ba711ba0a0.jpg', designs: 112, industry: 'Food & Drink', tier: 'Silver', pills: ['Packaging & label'] },
  { title: 'Craft gin bottle and box packaging', price: 999, imageUrl: 'https://images-platform.99static.com//I2IDCrbaxbCuPLEo-j7Qh96yrjE=/400x400/99designs-contests-attachments/89/89372/attachment_89372520', designs: 76, industry: 'Food & Drink', tier: 'Gold', pills: ['Packaging & label', 'Guaranteed'] },
  { title: 'Organic snack bar packaging redesign', price: 449, imageUrl: 'https://images-platform.99static.com//u2eV1Pn1_UMSdaAJnFRpFtLOFJk=/400x400/99designs-contests-attachments/108/108022/attachment_108022726', designs: 68, industry: 'Food & Drink', tier: 'Bronze', pills: ['Packaging & label'] },
  { title: 'Popcorn brand packaging for retail shelves', price: 549, imageUrl: 'https://images-platform.99static.com//KrnkmKQ5lmpmvQKD_bWzVchuEdY=/400x400/projects-files/200/20048/2004882/11810bcf-91d4-4879-8f95-1dcebce7f9bc.jpeg', designs: 93, industry: 'Food & Drink', tier: 'Silver', pills: ['Packaging & label'] },
  { title: 'Premium chocolate truffle box design', price: 799, imageUrl: 'https://images-platform.99static.com//5_U-0mQk-dKKnhUhV2yc1tiwrmI=/400x400/99designs-work-samples/work-sample-designs/1315030/fcc527bb-ced2-4c83-9408-930c69492e82', designs: 108, industry: 'Food & Drink', tier: 'Gold', pills: ['Packaging & label', 'Guaranteed'] },
  { title: 'Herbal supplement bottle & label design', price: 649, imageUrl: 'https://images-platform.99static.com//EY3Vxpo_9d7_EI6x-_tBKVb2IWI=/400x400/99designs-work-samples/work-sample-designs/3243158/76fdb2c5-f6ed-4a10-bce5-6c12de96ca13', designs: 87, industry: 'Health & Wellness', tier: 'Silver', pills: ['Packaging & label'] },
  { title: 'Kids cereal box packaging redesign', price: 749, imageUrl: 'https://images-platform.99static.com//BUQGzZi2NY7AMZ56Wf1jHD0AT5A=/400x400/99designs-contests-attachments/75/75916/attachment_75916058', designs: 121, industry: 'Food & Drink', tier: 'Gold', pills: ['Packaging & label', 'Guaranteed'] },
  { title: 'Eco-friendly candle packaging design', price: 449, imageUrl: 'https://images-platform.99static.com//NT0wxaLHZBox1j7M5fUjV3mV4Jo=/400x400/99designs-contests-attachments/77/77921/attachment_77921502', designs: 52, industry: 'Home & Living', tier: 'Bronze', pills: ['Packaging & label'] },
  { title: 'Pet food bag & box packaging', price: 599, imageUrl: 'https://images-platform.99static.com//gHmbJC-LzfTrszdsr3yJ6ufNmlQ=/400x400/99designs-work-samples/work-sample-designs/1465010/66bb153e-6755-4100-a159-374fd8df2cbb', designs: 74, industry: 'Pets', tier: 'Silver', pills: ['Packaging & label'] },
  { title: 'Craft beer can & packaging design', price: 799, imageUrl: 'https://images-platform.99static.com//1XYjPvxjL_twqFBcsKPn97LKMBc=/400x400/99designs-contests-attachments/132/132547/attachment_132547227', designs: 96, industry: 'Food & Drink', tier: 'Gold', pills: ['Packaging & label', 'Guaranteed'] },
  { title: 'Gourmet hot sauce bottle label design', price: 549, imageUrl: 'https://images-platform.99static.com//Yen-lGjdqUZBNNW_0B0LlIkxwF8=/400x400/99designs-contests-attachments/73/73382/attachment_73382792', designs: 84, industry: 'Food & Drink', tier: 'Silver', pills: ['Packaging & label'] },
  { title: 'Natural skincare serum packaging', price: 999, imageUrl: 'https://images-platform.99static.com//ZRt2e3EfC9zwhnfj-iNG1Tk0ppE=/400x400/99designs-work-samples/work-sample-designs/1315030/dda0b22d-e2d6-40d2-8425-84511f0f5cac', designs: 103, industry: 'Beauty', tier: 'Gold', pills: ['Packaging & label', 'Guaranteed'] },
  { title: 'Protein powder packaging design', price: 649, imageUrl: 'https://images-platform.99static.com//ygw5ty5igIfPIOhWoOhZ5FJgmqQ=/400x400/projects-files/206/20628/2062862/a3fd5610-d155-4be5-a814-20ba711ba0a0.jpg', designs: 91, industry: 'Health & Wellness', tier: 'Silver', pills: ['Packaging & label'] },
  { title: 'Subscription wellness box branding', price: 1199, imageUrl: 'https://images-platform.99static.com//EY3Vxpo_9d7_EI6x-_tBKVb2IWI=/400x400/99designs-work-samples/work-sample-designs/3243158/76fdb2c5-f6ed-4a10-bce5-6c12de96ca13', designs: 115, industry: 'Health & Wellness', tier: 'Platinum', pills: ['Packaging & label', 'Top Level'] },
  { title: 'Artisan cheese packaging & labeling', price: 449, imageUrl: 'https://images-platform.99static.com//KrnkmKQ5lmpmvQKD_bWzVchuEdY=/400x400/projects-files/200/20048/2004882/11810bcf-91d4-4879-8f95-1dcebce7f9bc.jpeg', designs: 63, industry: 'Food & Drink', tier: 'Bronze', pills: ['Packaging & label'] },
  { title: 'Premium tea tin & box design', price: 799, imageUrl: 'https://images-platform.99static.com//5_U-0mQk-dKKnhUhV2yc1tiwrmI=/400x400/99designs-work-samples/work-sample-designs/1315030/fcc527bb-ced2-4c83-9408-930c69492e82', designs: 97, industry: 'Food & Drink', tier: 'Gold', pills: ['Packaging & label', 'Guaranteed'] },
  { title: 'Sports nutrition packaging redesign', price: 649, imageUrl: 'https://images-platform.99static.com//u2eV1Pn1_UMSdaAJnFRpFtLOFJk=/400x400/99designs-contests-attachments/108/108022/attachment_108022726', designs: 78, industry: 'Health & Wellness', tier: 'Silver', pills: ['Packaging & label'] },
  { title: 'Holiday gift box packaging design', price: 549, imageUrl: 'https://images-platform.99static.com//NT0wxaLHZBox1j7M5fUjV3mV4Jo=/400x400/99designs-contests-attachments/77/77921/attachment_77921502', designs: 83, industry: 'Seasonal & Holiday', tier: 'Silver', pills: ['Packaging & label'] },
];

router.get('/', async (req, res, next) => {
  try {
    const count = await Contest.countDocuments();
    if (count === 0) {
      await Contest.insertMany(SEEDS.map(s => ({ ...s, status: 'Finished' })));
    }
    const contests = await Contest.find({});
    res.json(contests);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

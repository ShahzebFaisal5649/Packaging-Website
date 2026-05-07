const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Product = require('../models/Product');
const Industry = require('../models/Industry');

dotenv.config({ path: path.join(__dirname, '../.env') });

const PRODUCTS = [
  {
    name: 'Custom Mailer Box',
    slug: 'custom-mailer-box',
    cat: 'Shipping',
    description: 'Durable, stylish, and perfect for e-commerce unboxing. Made from sustainable corrugated board.',
    price: '$0.85',
    img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80',
    boxType: 'Mailer Box',
    material: 'E-Flute Corrugated',
    finish: 'Matte Lamination',
    dims: '10x8x4 in',
    minQty: '100',
    addons: ['Inside Printing', 'Tear Strip', 'Spot UV'],
    suggestedDimensions: { l: 10, w: 8, h: 4 }
  },
  {
    name: 'Luxury Rigid Box',
    slug: 'luxury-rigid-box',
    cat: 'Luxury',
    description: 'High-end structural packaging for premium brands. Ideal for jewelry, tech, and gifts.',
    price: '$3.50',
    img: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80',
    boxType: 'Rigid Box',
    material: '1200gsm Chipboard',
    finish: 'Soft-Touch Matte',
    dims: '8x8x3 in',
    minQty: '50',
    addons: ['Magnetic Closure', 'Gold Foil', 'Custom Insert'],
    suggestedDimensions: { l: 8, w: 8, h: 3 }
  },
  {
    name: 'Eco Kraft Box',
    slug: 'eco-kraft-box',
    cat: 'Sustainable',
    description: '100% recycled and biodegradable. Perfect for natural and organic product lines.',
    price: '$0.65',
    img: 'https://images.unsplash.com/photo-1619468579487-430c4d90f93b?w=800&q=80',
    boxType: 'Kraft Box',
    material: 'Brown Kraft Paper',
    finish: 'Uncoated',
    dims: '6x6x6 in',
    minQty: '100',
    addons: ['Soy Inks', 'Recycled Sticker', 'Hemp String'],
    suggestedDimensions: { l: 6, w: 6, h: 6 }
  },
  {
    name: 'Cosmetic Display Box',
    slug: 'cosmetic-display-box',
    cat: 'Retail',
    description: 'Vibrant, eye-catching packaging designed for retail shelves. High-resolution printing.',
    price: '$1.10',
    img: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&q=80',
    boxType: 'Tuck End Box',
    material: '18pt Cardstock',
    finish: 'Gloss Lamination',
    dims: '4x4x6 in',
    minQty: '250',
    addons: ['Window Patching', 'Embossing', 'Metallic Ink'],
    suggestedDimensions: { l: 4, w: 4, h: 6 }
  },
  {
    name: 'Food Grade Cake Box',
    slug: 'food-grade-cake-box',
    cat: 'Bakery',
    description: 'FSC-certified, food-safe material. Keeps pastries fresh and protected during transport.',
    price: '$0.75',
    img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80',
    boxType: 'Gable Box',
    material: 'Silesia Board',
    finish: 'Varnish',
    dims: '12x12x6 in',
    minQty: '200',
    addons: ['Handle Hole', 'Greaseproof Coating', 'Transparent Lid'],
    suggestedDimensions: { l: 12, w: 12, h: 6 }
  },
  {
    name: 'Standard Shipping Box',
    slug: 'standard-shipping-box',
    cat: 'Logistics',
    description: 'Heavy-duty corrugated boxes for safe bulk transport and storage.',
    price: '$0.45',
    img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
    boxType: 'RSC Shipping Box',
    material: 'Double Wall Corrugated',
    finish: 'None',
    dims: '24x18x18 in',
    minQty: '50',
    addons: ['Printed Logo', 'Warning Labels', 'Fragile Stamp'],
    suggestedDimensions: { l: 24, w: 18, h: 18 }
  }
];

const INDUSTRIES = [
  {
    name: 'Cosmetics & Beauty',
    slug: 'cosmetics-beauty',
    cat: 'Luxury',
    description: 'Elegance meets protection. Our cosmetic boxes are designed to mirror the quality of your beauty products.',
    img: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=800&q=80',
    products: [
      { name: 'Lipstick Box', img: 'https://images.unsplash.com/photo-1586776977607-310e9c725c37?w=400&q=80' },
      { name: 'Skincare Kit', img: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&q=80' }
    ]
  },
  {
    name: 'E-commerce & Retail',
    slug: 'ecommerce-retail',
    cat: 'E-commerce',
    description: 'Make unboxing an experience. Custom mailers and retail boxes that build brand loyalty.',
    img: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80',
    products: [
      { name: 'Custom Mailer', img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&q=80' },
      { name: 'Shopping Bag', img: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&q=80' }
    ]
  },
  {
    name: 'Food & Beverage',
    slug: 'food-beverage',
    cat: 'Food-Safe',
    description: 'Safe, sustainable, and savory. Packaging that preserves taste and presents quality.',
    img: 'https://images.unsplash.com/photo-1512485800893-b08ec1ea59b1?w=800&q=80',
    products: [
      { name: 'Bakery Box', img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80' },
      { name: 'Beverage Carrier', img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80' }
    ]
  }
];

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected.');

    // Clear existing
    console.log('Clearing old data...');
    await Product.deleteMany({});
    await Industry.deleteMany({});

    // Seed Products
    console.log('Seeding Products...');
    await Product.insertMany(PRODUCTS);
    console.log(`Seeded ${PRODUCTS.length} products.`);

    // Seed Industries
    console.log('Seeding Industries...');
    await Industry.insertMany(INDUSTRIES);
    console.log(`Seeded ${INDUSTRIES.length} industries.`);

    console.log('Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();

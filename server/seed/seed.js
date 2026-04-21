require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Category = require('../models/Category');
const Subcategory = require('../models/Subcategory');
const ShowcaseImage = require('../models/ShowcaseImage');

const categories = [
  { slug: 'logo-identity', label: 'Logo & identity', order: 0 },
  { slug: 'web-app-design', label: 'Web & app design', order: 1 },
  { slug: 'business-advertising', label: 'Business & advertising', order: 2 },
  { slug: 'clothing-merchandise', label: 'Clothing & merchandise', order: 3 },
  { slug: 'art-illustration', label: 'Art & illustration', order: 4 },
  { slug: 'packaging-label', label: 'Packaging & label', order: 5 },
  { slug: 'book-magazine', label: 'Book & magazine', order: 6 },
];

const subcategories = [
  // Logo & identity
  { categorySlug: 'logo-identity', slug: 'brand-launch-pack', title: 'Brand launch pack', price: 'from US$1,399', description: 'Logo + brand guide + business card + letterhead + social media kit', isBundle: true, features: ['Logo design', 'Brand style guide', 'Business card', 'Letterhead', 'Social media assets'], saveBadge: 'Save 35%+', order: 0 },
  { categorySlug: 'logo-identity', slug: 'logo-brand-guide', title: 'Logo & brand guide', price: 'from US$699', description: 'Logo design plus a complete brand guide', isBundle: true, features: ['Logo design', 'Brand style guide', 'Color palette', 'Typography guide'], saveBadge: 'Save US$70', order: 1 },
  { categorySlug: 'logo-identity', slug: 'logo-design', title: 'Logo design', price: 'from US$299', description: 'Custom logo designs from professional designers', isBundle: false, features: [], saveBadge: null, order: 2 },
  { categorySlug: 'logo-identity', slug: 'business-card-design', title: 'Business card design', price: 'from US$199', description: 'Professional business cards that make an impression', isBundle: false, features: [], saveBadge: null, order: 3 },
  { categorySlug: 'logo-identity', slug: 'brand-guide', title: 'Brand guide', price: 'from US$399', description: 'Define your brand identity with a comprehensive guide', isBundle: false, features: [], saveBadge: null, order: 4 },
  { categorySlug: 'logo-identity', slug: 'stationery-design', title: 'Stationery design', price: 'from US$299', description: 'Letterhead, envelopes, and branded stationery', isBundle: false, features: [], saveBadge: null, order: 5 },
  { categorySlug: 'logo-identity', slug: 'other-logo-identity', title: 'Other logo & identity design', price: 'from US$199', description: 'Custom requests for logo and identity design', isBundle: false, features: [], saveBadge: null, order: 6 },

  // Web & app design
  { categorySlug: 'web-app-design', slug: 'logo-website', title: 'Logo & website', price: 'from US$899', description: 'Logo design plus a full website design', isBundle: true, features: ['Logo design', 'Website design (up to 5 pages)', 'Mobile responsive', 'Style guide'], saveBadge: 'Save US$200', order: 0 },
  { categorySlug: 'web-app-design', slug: 'website-design', title: 'Website design', price: 'from US$599', description: 'Custom website designs for your business', isBundle: false, features: [], saveBadge: null, order: 1 },
  { categorySlug: 'web-app-design', slug: 'app-design', title: 'App design', price: 'from US$599', description: 'UI/UX design for mobile and desktop apps', isBundle: false, features: [], saveBadge: null, order: 2 },
  { categorySlug: 'web-app-design', slug: 'landing-page-design', title: 'Landing page design', price: 'from US$299', description: 'High-converting landing page designs', isBundle: false, features: [], saveBadge: null, order: 3 },
  { categorySlug: 'web-app-design', slug: 'icon-design', title: 'Icon design', price: 'from US$199', description: 'Custom icon sets and UI icons', isBundle: false, features: [], saveBadge: null, order: 4 },
  { categorySlug: 'web-app-design', slug: 'other-web-design', title: 'Other web & app design', price: 'from US$199', description: 'Custom digital design requests', isBundle: false, features: [], saveBadge: null, order: 5 },

  // Business & advertising
  { categorySlug: 'business-advertising', slug: 'flyer-design', title: 'Flyer design', price: 'from US$199', description: 'Eye-catching flyers for events and promotions', isBundle: false, features: [], saveBadge: null, order: 0 },
  { categorySlug: 'business-advertising', slug: 'brochure-design', title: 'Brochure design', price: 'from US$249', description: 'Professional brochures for your business', isBundle: false, features: [], saveBadge: null, order: 1 },
  { categorySlug: 'business-advertising', slug: 'banner-design', title: 'Banner ad design', price: 'from US$199', description: 'Digital and print banner advertisements', isBundle: false, features: [], saveBadge: null, order: 2 },
  { categorySlug: 'business-advertising', slug: 'social-media-design', title: 'Social media design', price: 'from US$199', description: 'Posts, covers, and social assets', isBundle: false, features: [], saveBadge: null, order: 3 },
  { categorySlug: 'business-advertising', slug: 'poster-design', title: 'Poster design', price: 'from US$199', description: 'Custom posters for any occasion', isBundle: false, features: [], saveBadge: null, order: 4 },
  { categorySlug: 'business-advertising', slug: 'other-business', title: 'Other business & advertising design', price: 'from US$199', description: 'Custom business design requests', isBundle: false, features: [], saveBadge: null, order: 5 },

  // Clothing & merchandise
  { categorySlug: 'clothing-merchandise', slug: 'tshirt-design', title: 'T-shirt design', price: 'from US$199', description: 'Custom t-shirt graphics and prints', isBundle: false, features: [], saveBadge: null, order: 0 },
  { categorySlug: 'clothing-merchandise', slug: 'merchandise-design', title: 'Merchandise design', price: 'from US$199', description: 'Branded merch: hats, bags, mugs, and more', isBundle: false, features: [], saveBadge: null, order: 1 },
  { categorySlug: 'clothing-merchandise', slug: 'uniform-design', title: 'Uniform & workwear design', price: 'from US$249', description: 'Professional uniform and workwear designs', isBundle: false, features: [], saveBadge: null, order: 2 },
  { categorySlug: 'clothing-merchandise', slug: 'other-clothing', title: 'Other clothing & merchandise design', price: 'from US$199', description: 'Custom apparel and merchandise requests', isBundle: false, features: [], saveBadge: null, order: 3 },

  // Art & illustration
  { categorySlug: 'art-illustration', slug: 'illustration', title: 'Illustration', price: 'from US$299', description: 'Custom illustrations for any project', isBundle: false, features: [], saveBadge: null, order: 0 },
  { categorySlug: 'art-illustration', slug: 'character-design', title: 'Character design', price: 'from US$399', description: 'Mascots, characters, and brand figures', isBundle: false, features: [], saveBadge: null, order: 1 },
  { categorySlug: 'art-illustration', slug: 'portrait-illustration', title: 'Portrait illustration', price: 'from US$249', description: 'Custom portrait illustrations from photos', isBundle: false, features: [], saveBadge: null, order: 2 },
  { categorySlug: 'art-illustration', slug: 'pattern-design', title: 'Pattern design', price: 'from US$199', description: 'Custom repeating patterns and textures', isBundle: false, features: [], saveBadge: null, order: 3 },
  { categorySlug: 'art-illustration', slug: 'other-illustration', title: 'Other art & illustration', price: 'from US$199', description: 'Custom art and illustration requests', isBundle: false, features: [], saveBadge: null, order: 4 },

  // Packaging & label
  { categorySlug: 'packaging-label', slug: 'product-label', title: 'Product label & sticker', price: 'from US$199', description: 'Labels and stickers for your products', isBundle: false, features: [], saveBadge: null, order: 0 },
  { categorySlug: 'packaging-label', slug: 'product-packaging', title: 'Product packaging', price: 'from US$399', description: 'Full packaging design for boxes, bags, and bottles', isBundle: false, features: [], saveBadge: null, order: 1 },
  { categorySlug: 'packaging-label', slug: 'food-beverage-packaging', title: 'Food & beverage packaging', price: 'from US$399', description: 'Specialty packaging for food and drink products', isBundle: false, features: [], saveBadge: null, order: 2 },
  { categorySlug: 'packaging-label', slug: 'other-packaging', title: 'Other packaging & label design', price: 'from US$199', description: 'Custom packaging design requests', isBundle: false, features: [], saveBadge: null, order: 3 },

  // Book & magazine
  { categorySlug: 'book-magazine', slug: 'book-cover-design', title: 'Book cover design', price: 'from US$299', description: 'Striking book covers that sell', isBundle: false, features: [], saveBadge: null, order: 0 },
  { categorySlug: 'book-magazine', slug: 'magazine-design', title: 'Magazine layout', price: 'from US$399', description: 'Professional magazine and editorial layouts', isBundle: false, features: [], saveBadge: null, order: 1 },
  { categorySlug: 'book-magazine', slug: 'ebook-design', title: 'eBook design', price: 'from US$299', description: 'Digital book layout and cover design', isBundle: false, features: [], saveBadge: null, order: 2 },
  { categorySlug: 'book-magazine', slug: 'other-book', title: 'Other book & magazine design', price: 'from US$199', description: 'Custom print publication requests', isBundle: false, features: [], saveBadge: null, order: 3 },
];

// Showcase images — using Unsplash for high-quality design-relevant placeholders
const showcaseImages = [
  // Logo & identity
  { categorySlug: 'logo-identity', src: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=660&q=80&auto=format', alt: 'Logo design showcase', designerName: 'anastasia_m', order: 0 },
  { categorySlug: 'logo-identity', src: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=660&q=80&auto=format', alt: 'Brand identity showcase', designerName: 'david_k', order: 1 },
  { categorySlug: 'logo-identity', src: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=660&q=80&auto=format', alt: 'Brand showcase', designerName: 'marina_v', order: 2 },
  { categorySlug: 'logo-identity', src: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=660&q=80&auto=format', alt: 'Identity showcase', designerName: 'thomas_r', order: 3 },
  { categorySlug: 'logo-identity', src: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=660&q=80&auto=format', alt: 'Logo branding', designerName: 'sofia_p', order: 4 },

  // Web & app design
  { categorySlug: 'web-app-design', src: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=660&q=80&auto=format', alt: 'Website design', designerName: 'james_h', order: 0 },
  { categorySlug: 'web-app-design', src: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=660&q=80&auto=format', alt: 'App design', designerName: 'liu_w', order: 1 },
  { categorySlug: 'web-app-design', src: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=660&q=80&auto=format', alt: 'UI design', designerName: 'carlos_m', order: 2 },
  { categorySlug: 'web-app-design', src: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=660&q=80&auto=format', alt: 'Mobile design', designerName: 'anna_k', order: 3 },
  { categorySlug: 'web-app-design', src: 'https://images.unsplash.com/photo-1576153192396-180ecef2a715?w=660&q=80&auto=format', alt: 'Dashboard design', designerName: 'mike_b', order: 4 },

  // Business & advertising
  { categorySlug: 'business-advertising', src: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=660&q=80&auto=format', alt: 'Business design', designerName: 'elena_s', order: 0 },
  { categorySlug: 'business-advertising', src: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=660&q=80&auto=format', alt: 'Advertising design', designerName: 'paul_d', order: 1 },
  { categorySlug: 'business-advertising', src: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=660&q=80&auto=format', alt: 'Brochure design', designerName: 'nadia_f', order: 2 },
  { categorySlug: 'business-advertising', src: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=660&q=80&auto=format', alt: 'Social media design', designerName: 'omar_h', order: 3 },
  { categorySlug: 'business-advertising', src: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=660&q=80&auto=format', alt: 'Poster design', designerName: 'yuki_t', order: 4 },

  // Clothing & merchandise
  { categorySlug: 'clothing-merchandise', src: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=660&q=80&auto=format', alt: 'T-shirt design', designerName: 'lucas_p', order: 0 },
  { categorySlug: 'clothing-merchandise', src: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=660&q=80&auto=format', alt: 'Clothing design', designerName: 'sarah_j', order: 1 },
  { categorySlug: 'clothing-merchandise', src: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=660&q=80&auto=format', alt: 'Merchandise design', designerName: 'alex_n', order: 2 },
  { categorySlug: 'clothing-merchandise', src: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=660&q=80&auto=format', alt: 'Apparel design', designerName: 'diana_c', order: 3 },
  { categorySlug: 'clothing-merchandise', src: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=660&q=80&auto=format', alt: 'Custom apparel', designerName: 'raj_m', order: 4 },

  // Art & illustration
  { categorySlug: 'art-illustration', src: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=660&q=80&auto=format', alt: 'Illustration', designerName: 'yuna_k', order: 0 },
  { categorySlug: 'art-illustration', src: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=660&q=80&auto=format', alt: 'Character design', designerName: 'ivan_b', order: 1 },
  { categorySlug: 'art-illustration', src: 'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?w=660&q=80&auto=format', alt: 'Digital art', designerName: 'mia_l', order: 2 },
  { categorySlug: 'art-illustration', src: 'https://images.unsplash.com/photo-1545601445-4d6a0a0565f0?w=660&q=80&auto=format', alt: 'Pattern design', designerName: 'tom_w', order: 3 },
  { categorySlug: 'art-illustration', src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=660&q=80&auto=format', alt: 'Art showcase', designerName: 'leila_r', order: 4 },

  // Packaging & label
  { categorySlug: 'packaging-label', src: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=660&q=80&auto=format', alt: 'Packaging design', designerName: 'marco_v', order: 0 },
  { categorySlug: 'packaging-label', src: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=660&q=80&auto=format', alt: 'Product packaging', designerName: 'zara_k', order: 1 },
  { categorySlug: 'packaging-label', src: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=660&q=80&auto=format', alt: 'Label design', designerName: 'finn_o', order: 2 },
  { categorySlug: 'packaging-label', src: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=660&q=80&auto=format', alt: 'Box design', designerName: 'chloe_m', order: 3 },
  { categorySlug: 'packaging-label', src: 'https://images.unsplash.com/photo-1574634534894-89d7576c8259?w=660&q=80&auto=format', alt: 'Food packaging', designerName: 'ben_t', order: 4 },

  // Book & magazine
  { categorySlug: 'book-magazine', src: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=660&q=80&auto=format', alt: 'Book cover design', designerName: 'priya_s', order: 0 },
  { categorySlug: 'book-magazine', src: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=660&q=80&auto=format', alt: 'Magazine layout', designerName: 'otto_f', order: 1 },
  { categorySlug: 'book-magazine', src: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=660&q=80&auto=format', alt: 'eBook design', designerName: 'nina_c', order: 2 },
  { categorySlug: 'book-magazine', src: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=660&q=80&auto=format', alt: 'Publication design', designerName: 'jack_r', order: 3 },
  { categorySlug: 'book-magazine', src: 'https://images.unsplash.com/photo-1491841573634-28140fc7ced7?w=660&q=80&auto=format', alt: 'Book design', designerName: 'aisha_b', order: 4 },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await Promise.all([
      Category.deleteMany({}),
      Subcategory.deleteMany({}),
      ShowcaseImage.deleteMany({}),
    ]);

    await Category.insertMany(categories);
    await Subcategory.insertMany(subcategories);
    await ShowcaseImage.insertMany(showcaseImages);

    console.log(`Seeded: ${categories.length} categories, ${subcategories.length} subcategories, ${showcaseImages.length} images`);
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();

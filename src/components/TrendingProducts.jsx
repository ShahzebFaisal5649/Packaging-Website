import { useState, useEffect } from 'react';
import ProductSlider from './ProductSlider';
import api from '../services/api';
import { RefreshCw } from 'lucide-react';

const fallbackProducts = [
  { id: 'p1', name: 'Custom Mailer Boxes', cat: 'Mailer', desc: 'Durable corrugated mailers for e-commerce brands', price: '$1.20', img: 'https://images.unsplash.com/photo-1553531384-cc64ac80f931?w=600&q=80' },
  { id: 'p2', name: 'Printed Sleeve Boxes', cat: 'Sleeve', desc: 'Elegant sleeve packaging for a premium unboxing experience', price: '$1.50', img: 'https://images.unsplash.com/photo-1601056282023-0ece673c74d4?w=600&q=80' },
  { id: 'p3', name: 'Retail Display Boxes', cat: 'Display', desc: 'Shelf-ready display packaging for retail environments', price: '$2.10', img: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600&q=80' },
  { id: 'p4', name: 'Rigid Setup Boxes', cat: 'Rigid', desc: 'Luxury rigid packaging for high-end gifting', price: '$3.50', img: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&q=80' },
  { id: 'p5', name: 'Cosmetic Boxes', cat: 'Cosmetic', desc: 'Premium paperboard boxes for beauty and skincare', price: '$0.85', img: 'https://images.unsplash.com/photo-1627384113743-6bd5a479fffd?w=600&q=80' },
  { id: 'p6', name: 'Shipping Boxes', cat: 'Shipping', desc: 'Heavy-duty corrugated boxes for secure bulk shipping', price: '$1.10', img: 'https://images.unsplash.com/photo-1595079676339-1534801ad6cf?w=600&q=80' },
  { id: 'p7', name: 'Tuck Top Boxes', cat: 'Tuck', desc: 'Versatile product boxes with easy tuck-top closure', price: '$0.95', img: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&q=80' },
  { id: 'p8', name: 'E-Commerce Boxes', cat: 'E-Comm', desc: 'Branded shipping solutions for online retailers', price: '$1.30', img: 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaad5b?w=600&q=80' },
  { id: 'p9', name: 'Window Display Boxes', cat: 'Display', desc: 'Clear PET window panels for premium product visibility', price: '$1.75', img: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&q=80' },
  { id: 'p10', name: 'Gift Box Sets', cat: 'Gift', desc: 'Premium rigid gift boxes with satin ribbon', price: '$4.20', img: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&q=80' },
  { id: 'p11', name: 'Pizza Boxes', cat: 'Food', desc: 'FDA-compliant corrugated food boxes for restaurants', price: '$0.65', img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80' },
  { id: 'p12', name: 'Subscription Boxes', cat: 'Subscription', desc: 'Monthly boxes with interior trays and branded slots', price: '$2.40', img: 'https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=600&q=80' },
];

export default function TrendingProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const data = await api.get('/content/featured-products');
        if (data.products && data.products.length > 0) {
          setProducts(data.products.map(p => ({
            id: p._id,
            name: p.name,
            cat: p.category || p.cat || 'Custom',
            desc: p.description,
            price: `$${p.price}`,
            img: p.img || p.image
          })));
        } else {
          setProducts(fallbackProducts);
        }
      } catch (err) {
        console.error('Failed to fetch featured products:', err);
        setProducts(fallbackProducts);
      } finally {
        setLoading(false);
      }
    }
    fetchFeatured();
  }, []);

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="mb-2">
          <span className="text-[11px] font-medium font-mono text-brand-accent uppercase tracking-widest">Best Sellers</span>
        </div>
        {loading ? (
          <div style={{ padding: '60px 0', textAlign: 'center' }}>
            <RefreshCw size={24} style={{ animation: 'spin 1s linear infinite', color: '#ccc' }} />
          </div>
        ) : (
          <ProductSlider products={products} title="Trending Now" />
        )}
      </div>
    </section>
  );
}

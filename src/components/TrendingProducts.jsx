import { useState, useEffect } from 'react';
import ProductSlider from './ProductSlider';
import api from '../services/api';
import { RefreshCw } from 'lucide-react';

const fallbackProducts = [
  { id: 'p1', name: 'Custom Mailer Boxes', cat: 'Mailer', desc: 'Durable corrugated mailers for e-commerce brands', price: '$1.20', img: 'https://images.unsplash.com/photo-1553531384-cc64ac80f931?w=600&q=80' },
  { id: 'p2', name: 'Printed Sleeve Boxes', cat: 'Sleeve', desc: 'Elegant sleeve packaging for a premium unboxing experience', price: '$1.50', img: 'https://images.unsplash.com/photo-1601056282023-0ece673c74d4?w=600&q=80' },
  { id: 'p3', name: 'Retail Display Boxes', cat: 'Display', desc: 'Shelf-ready display packaging for retail environments', price: '$2.10', img: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600&q=80' },
  { id: 'p4', name: 'Rigid Setup Boxes', cat: 'Rigid', desc: 'Luxury rigid packaging for high-end gifting', price: '$3.50', img: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&q=80' },
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

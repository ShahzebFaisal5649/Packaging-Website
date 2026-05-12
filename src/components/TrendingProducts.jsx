import { useState, useEffect } from 'react';
import ProductSlider from './ProductSlider';
import api from '../services/api';
import { RefreshCw } from 'lucide-react';

// Each product has its own unique, relevant Unsplash image
const fallbackProducts = [
  {
    id: 'p1', name: 'Custom Mailer Boxes', cat: 'Mailer',
    desc: 'Durable corrugated mailers for e-commerce brands. Self-locking, no glue needed.',
    price: '$1.20',
    img: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=600&h=400&q=80',
  },
  {
    id: 'p2', name: 'Rigid Gift Boxes', cat: 'Rigid',
    desc: 'Premium rigid box with magnetic closure for luxury gifting and retail.',
    price: '$3.80',
    img: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&h=400&q=80',
  },
  {
    id: 'p3', name: 'Kraft Tuck Boxes', cat: 'Kraft',
    desc: 'Eco-friendly kraft tuck-end box. Ideal for bakeries, food, candles, and soap.',
    price: '$0.65',
    img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&h=400&q=80',
  },
  {
    id: 'p4', name: 'Cosmetic Sleeve Boxes', cat: 'Sleeve',
    desc: 'Two-piece slide-out sleeve box. Popular for skincare and cosmetics brands.',
    price: '$2.10',
    img: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&h=400&q=80',
  },
  {
    id: 'p5', name: 'Shipping Boxes', cat: 'Shipping',
    desc: 'Heavy-duty corrugated RSC box for safe shipping. BCT-tested for stacking.',
    price: '$0.95',
    img: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=600&h=400&q=80',
  },
  {
    id: 'p6', name: 'Luxury Drawer Boxes', cat: 'Rigid',
    desc: 'Elegant rigid drawer box for jewelry, watches, and premium gifting.',
    price: '$5.50',
    img: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=600&h=400&q=80',
  },
  {
    id: 'p7', name: 'Gable Top Boxes', cat: 'Specialty',
    desc: 'Charming gable box with handle. Perfect for party favours and bakeries.',
    price: '$0.85',
    img: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&h=400&q=80',
  },
  {
    id: 'p8', name: 'Eco Kraft Mailers', cat: 'Eco',
    desc: '100% recycled content mailer. FSC-certified and fully compostable.',
    price: '$1.05',
    img: 'https://images.unsplash.com/photo-1580828343064-fde4fc206bc6?auto=format&fit=crop&w=600&h=400&q=80',
  },
  {
    id: 'p9', name: 'Subscription Mystery Boxes', cat: 'Mailer',
    desc: 'Thick premium mailer box with interior full-colour print for unboxing moments.',
    price: '$2.40',
    img: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=600&h=400&q=80',
  },
  {
    id: 'p10', name: 'Window Display Boxes', cat: 'Retail',
    desc: 'Folding carton with clear PET window for retail shelf display.',
    price: '$1.45',
    img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&h=400&q=80',
  },
  {
    id: 'p11', name: 'Pizza Kraft Boxes', cat: 'Food',
    desc: 'Grease-resistant kraft pizza box with full-colour lid print.',
    price: '$0.75',
    img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&h=400&q=80',
  },
  {
    id: 'p12', name: 'Rigid Neck Boxes', cat: 'Rigid',
    desc: 'Two-piece rigid neck and shoulder box for electronics and spirits.',
    price: '$4.20',
    img: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=600&h=400&q=80',
  },
];

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=600&h=400&q=80';

export default function TrendingProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const data = await api.get('/content/featured-products');
        const list = data?.products || data?.data || [];
        if (Array.isArray(list) && list.length > 0) {
          setProducts(list.map(p => ({
            id: p._id || p.id,
            name: p.name,
            cat: p.category || p.cat || 'Custom',
            desc: p.description || p.desc || '',
            price: p.price ? `$${parseFloat(p.price).toFixed(2)}` : '$1.20',
            // Robust image field mapping — covers all possible field names
            img: p.image || p.img || p.thumbnail || FALLBACK_IMG,
          })));
        } else {
          setProducts(fallbackProducts);
        }
      } catch {
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
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : (
          <ProductSlider products={products} title="Trending Now" />
        )}
      </div>
    </section>
  );
}

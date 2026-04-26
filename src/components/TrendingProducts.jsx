import ProductSlider from './ProductSlider';

const productsList = [
  { id: 'p1', name: 'Custom Mailer Boxes', cat: 'Mailer', desc: 'Durable corrugated mailers for e-commerce brands', price: '$1.20', img: 'https://images.unsplash.com/photo-1553531384-cc64ac80f931?w=600&q=80' },
  { id: 'p2', name: 'Printed Sleeve Boxes', cat: 'Sleeve', desc: 'Elegant sleeve packaging for a premium unboxing experience', price: '$1.50', img: 'https://images.unsplash.com/photo-1601056282023-0ece673c74d4?w=600&q=80' },
  { id: 'p3', name: 'Retail Display Boxes', cat: 'Display', desc: 'Shelf-ready display packaging for retail environments', price: '$2.10', img: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600&q=80' },
  { id: 'p4', name: 'Rigid Setup Boxes', cat: 'Rigid', desc: 'Luxury rigid packaging for high-end gifting', price: '$3.50', img: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&q=80' },
  { id: 'p5', name: 'Eco-Friendly Kraft', cat: 'Kraft', desc: '100% recyclable kraft packaging for sustainable brands', price: '$0.85', img: 'https://images.unsplash.com/photo-1619468579487-430c4d90f93b?w=600&q=80' },
  { id: 'p6', name: 'Folding Cartons', cat: 'Folding', desc: 'Versatile folding cartons for retail and cosmetics', price: '$1.10', img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&q=80' },
  { id: 'p7', name: 'Shipping Boxes', cat: 'Shipping', desc: 'Heavy-duty corrugated shipping protection', price: '$0.95', img: 'https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=600&q=80' },
  { id: 'p8', name: 'Luxury Mailer Boxes', cat: 'Mailer', desc: 'High-impact mailers with magnetic closure', price: '$2.80', img: 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?w=600&q=80' },
];

export default function TrendingProducts() {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="mb-2">
          <span className="text-[11px] font-bold text-brand-accent uppercase tracking-widest">Best Sellers</span>
        </div>
        <ProductSlider products={productsList} title="Trending Now" autoPlayDelay={4000} />
      </div>
    </section>
  );
}

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Ruler, Layers, Palette } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const G = '#1A4D2E';
const ACCENT = '#C8860A';
const BG = '#F5F2ED';

const FILTERS = ['All', 'Mailer Boxes', 'Rigid Boxes', 'Food & Beverage', 'Cosmetics', 'Eco-Friendly', 'Luxury', 'Subscription'];

const GALLERY = [
  { id: 1, src: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500&q=80', cat: 'Cosmetics', name: 'Skincare Elegance Collection', filter: 'Cosmetics' },
  { id: 2, src: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500&q=80', cat: 'Mailer Boxes', name: 'E-Commerce Mailer Pro', filter: 'Mailer Boxes' },
  { id: 3, src: 'https://images.unsplash.com/photo-1619468579487-430c4d90f93b?w=500&q=80', cat: 'Eco-Friendly', name: 'Kraft Natural Packaging', filter: 'Eco-Friendly' },
  { id: 4, src: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500&q=80', cat: 'Mailer Boxes', name: 'Secure Shipping Solution', filter: 'Mailer Boxes' },
  { id: 5, src: 'https://images.unsplash.com/photo-1553531384-cc64ac80f931?w=500&q=80', cat: 'Subscription', name: 'Monthly Box Subscription', filter: 'Subscription' },
  { id: 6, src: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&q=80', cat: 'Cosmetics', name: 'Premium Beauty Packaging', filter: 'Cosmetics' },
  { id: 7, src: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&q=80', cat: 'Food & Beverage', name: 'Artisan Bakery Boxes', filter: 'Food & Beverage' },
  { id: 8, src: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&q=80', cat: 'Rigid Boxes', name: 'Luxury Rigid Setup Box', filter: 'Rigid Boxes' },
  { id: 9, src: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=500&q=80', cat: 'Subscription', name: 'Custom Branded Boxes', filter: 'Subscription' },
  { id: 10, src: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=500&q=80', cat: 'Luxury', name: 'Premium Retail Packaging', filter: 'Luxury' },
];

const TRENDING = [
  {
    img: 'https://images.unsplash.com/photo-1553531384-cc64ac80f931?w=600&q=80',
    name: 'Minimalist Mailer',
    style: 'Clean kraft with gold foil stamp',
    cat: 'Mailer Boxes',
    boxType: 'Mailer Box',
    material: 'Corrugated E-Flute',
    finish: 'Matte Lam',
    price: '$1.20',
    minQty: '100 units',
    dims: '12×8×4 in',
    suggestedDimensions: { l: 12, w: 8, h: 4 },
    addons: ['Gold Foil Stamp', 'Inside Print', 'Tear Strip'],
  },
  {
    img: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&q=80',
    name: 'Matte Black Rigid',
    style: 'Soft-touch matte with spot UV',
    cat: 'Rigid Boxes',
    boxType: 'Rigid Box',
    material: 'Rigid Chipboard',
    finish: 'Matte Lam',
    price: '$3.80',
    minQty: '50 units',
    dims: '10×8×4 in',
    suggestedDimensions: { l: 10, w: 8, h: 4 },
    addons: ['Soft-Touch Lam', 'Spot UV', 'Magnetic Closure'],
  },
  {
    img: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&q=80',
    name: 'Blush Pink Skincare',
    style: 'Pastel tones with debossing',
    cat: 'Cosmetics',
    boxType: 'Rigid Box',
    material: 'Rigid Chipboard',
    finish: 'Gloss Lam',
    price: '$3.25',
    minQty: '50 units',
    dims: '4×3×5 in',
    suggestedDimensions: { l: 4, w: 3, h: 5 },
    addons: ['Debossing', 'Ribbon Pull', 'Foil Stamp'],
  },
  {
    img: 'https://images.unsplash.com/photo-1619468579487-430c4d90f93b?w=600&q=80',
    name: 'Eco Kraft Collection',
    style: 'Recycled kraft with soy inks',
    cat: 'Eco-Friendly',
    boxType: 'Kraft Box',
    material: 'Kraft',
    finish: 'Uncoated',
    price: '$0.95',
    minQty: '100 units',
    dims: '10×8×4 in',
    suggestedDimensions: { l: 10, w: 8, h: 4 },
    addons: ['Soy Ink Print', 'FSC Certified', 'Recycled Content'],
  },
];

const SHOWCASES = [
  { brand: 'BiteBox Co.', industry: 'Food & Beverage', img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80', quote: 'NovaPack transformed our unboxing into a viral moment. Sales jumped 40% after our rebrand.' },
  { brand: 'Lumière Beauty', industry: 'Cosmetics', img: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&q=80', quote: 'The soft-touch matte finish on our boxes feels as luxurious as the products inside.' },
  { brand: 'TechShip Inc.', industry: 'E-Commerce', img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80', quote: 'Production on time, every time. We scaled from 1,000 to 100,000 units with ease.' },
  { brand: 'GreenLeaf Organics', industry: 'Eco-Friendly', img: 'https://images.unsplash.com/photo-1619468579487-430c4d90f93b?w=400&q=80', quote: 'The FSC-certified kraft boxes perfectly align with our sustainability values.' },
];

function TrendingCard({ t }) {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  const handleShop = (e) => {
    e.stopPropagation();
    navigate('/custom-box', {
      state: {
        boxType: t.boxType,
        material: t.material,
        finish: t.finish,
        productName: t.name,
        suggestedDimensions: t.suggestedDimensions,
      },
    });
  };

  return (
    <div
      onClick={handleShop}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 12,
        overflow: 'hidden',
        boxShadow: hovered ? '0 12px 32px rgba(0,0,0,0.14)' : '0 2px 12px rgba(0,0,0,0.07)',
        backgroundColor: '#fff',
        border: `1.5px solid ${hovered ? ACCENT + '55' : '#E2DDD6'}`,
        transition: 'all 0.22s ease',
        cursor: 'pointer',
        transform: hovered ? 'translateY(-4px)' : 'none',
      }}
    >
      {/* Image */}
      <div style={{ height: 200, overflow: 'hidden', position: 'relative' }}>
        <img
          src={t.img}
          alt={t.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s', transform: hovered ? 'scale(1.06)' : 'scale(1)' }}
        />
        <div style={{ position: 'absolute', top: 10, left: 10, backgroundColor: ACCENT, color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 100, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {t.cat}
        </div>
        <div style={{ position: 'absolute', top: 10, right: 10, backgroundColor: '#fff', color: ACCENT, fontSize: 12, fontWeight: 800, padding: '3px 9px', borderRadius: 6, fontFamily: 'Outfit,sans-serif' }}>
          {t.price}<span style={{ fontSize: 9, fontWeight: 500, color: '#9A9080' }}>/unit</span>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '16px' }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>{t.cat}</p>
        <h4 style={{ fontSize: 15, fontFamily: 'Outfit,sans-serif', fontWeight: 700, color: G, marginBottom: 4 }}>{t.name}</h4>
        <p style={{ fontSize: 12, color: '#6B6B6B', marginBottom: 12 }}>{t.style}</p>

        {/* Spec pills */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 12px', padding: '10px 12px', backgroundColor: BG, borderRadius: 8, marginBottom: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 2 }}>
              <Layers size={9} style={{ color: ACCENT }} />
              <span style={{ fontSize: 9, fontWeight: 700, color: '#9A9080', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Material</span>
            </div>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#3A3A3A' }}>{t.material}</span>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 2 }}>
              <Palette size={9} style={{ color: ACCENT }} />
              <span style={{ fontSize: 9, fontWeight: 700, color: '#9A9080', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Finish</span>
            </div>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#3A3A3A' }}>{t.finish}</span>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 2 }}>
              <Ruler size={9} style={{ color: ACCENT }} />
              <span style={{ fontSize: 9, fontWeight: 700, color: '#9A9080', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Dimensions</span>
            </div>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#3A3A3A' }}>{t.dims}</span>
          </div>
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, color: '#9A9080', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 2 }}>Min. Order</div>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#3A3A3A' }}>{t.minQty}</span>
          </div>
        </div>

        {/* Add-ons */}
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 12 }}>
          {t.addons.map(a => (
            <span key={a} style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', padding: '2px 7px', borderRadius: 4, backgroundColor: `${ACCENT}14`, color: ACCENT, border: `1px solid ${ACCENT}25` }}>{a}</span>
          ))}
        </div>

        <button
          onClick={handleShop}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            width: '100%',
            padding: '10px 0',
            backgroundColor: hovered ? ACCENT : G,
            color: '#fff',
            borderRadius: 7,
            fontSize: 12,
            fontWeight: 700,
            textDecoration: 'none',
            border: 'none',
            cursor: 'pointer',
            transition: 'background 0.18s',
            fontFamily: 'Outfit,sans-serif',
          }}
        >
          Shop This Style <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

export default function SuccessStories() {
  const [activeFilter, setActiveFilter] = useState('All');
  const filtered = activeFilter === 'All' ? GALLERY : GALLERY.filter(g => g.filter === activeFilter);

  useEffect(() => {
    AOS.init({ duration: 650, once: true, easing: 'ease-out-cubic' });
  }, []);

  return (
    <div style={{ backgroundColor: BG, minHeight: '100vh' }}>

      {/* Section 1 — Hero */}
      <section style={{ height: 400, backgroundColor: '#1A1A1A', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {GALLERY.slice(0, 4).map((g, i) => (
          <div key={i} style={{ position: 'absolute', width: '25%', height: '100%', left: `${i * 25}%`, backgroundImage: `url(${g.src})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.25 }} />
        ))}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.6))' }} />
        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '0 24px' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 14 }}>Design Lookbook</p>
          <h1 style={{ fontSize: 'clamp(32px,5vw,52px)', fontFamily: 'Outfit,sans-serif', fontWeight: 800, color: '#fff', marginBottom: 16, lineHeight: 1.1 }}>Design Inspiration</h1>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.7)', maxWidth: 500, margin: '0 auto' }}>Explore packaging ideas across industries and find your perfect style.</p>
        </div>
      </section>

      {/* Section 2 — Filters + Gallery */}
      <section style={{ padding: '64px 24px', backgroundColor: BG }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 48 }}>
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                style={{
                  padding: '8px 20px', borderRadius: 100, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  backgroundColor: activeFilter === f ? ACCENT : 'transparent',
                  color: activeFilter === f ? '#fff' : '#6B6B6B',
                  border: activeFilter === f ? `2px solid ${ACCENT}` : '2px solid #D0CAC0',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { if (activeFilter !== f) { e.currentTarget.style.borderColor = ACCENT; e.currentTarget.style.color = ACCENT; } }}
                onMouseLeave={e => { if (activeFilter !== f) { e.currentTarget.style.borderColor = '#D0CAC0'; e.currentTarget.style.color = '#6B6B6B'; } }}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="gallery-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
            {filtered.map((item, idx) => (
              <div key={item.id} data-aos="zoom-in" data-aos-delay={idx * 60}
                style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', position: 'relative', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s', height: 280 }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.16)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)'; }}
              >
                <img src={item.src} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s' }} />
                <div style={{ position: 'absolute', top: 12, left: 12 }}>
                  <span style={{ backgroundColor: ACCENT, color: '#fff', fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 100, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.cat}</span>
                </div>
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)', padding: '32px 14px 14px' }}>
                  <p style={{ color: '#fff', fontSize: 14, fontWeight: 700, fontFamily: 'Outfit,sans-serif' }}>{item.name}</p>
                </div>
              </div>
            ))}
          </div>
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px 0', color: '#6B6B6B' }}>
              <p style={{ fontSize: 16 }}>No items in this category yet. Try a different filter.</p>
            </div>
          )}
        </div>
      </section>

      {/* Section 3 — Trending This Season */}
      <section style={{ padding: '64px 24px', backgroundColor: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }} data-aos="fade-up">
            <p style={{ fontSize: 11, fontWeight: 700, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>Hot Right Now</p>
            <h2 style={{ fontSize: 'clamp(24px,3vw,36px)', fontFamily: 'Outfit,sans-serif', fontWeight: 800, color: G, marginBottom: 10 }}>Trending This Season</h2>
            <p style={{ fontSize: 14, color: '#6B6B6B', maxWidth: 480, margin: '0 auto' }}>Click any card to configure your own version — specs are pre-filled automatically.</p>
          </div>
          <div className="trending-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24 }}>
            {TRENDING.map((t, i) => (
              <div key={i} data-aos="fade-up" data-aos-delay={i * 80}>
                <TrendingCard t={t} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4 — Customer Showcases */}
      <section style={{ padding: '64px 24px', backgroundColor: BG }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>Real Brands, Real Results</p>
            <h2 style={{ fontSize: 'clamp(24px,3vw,36px)', fontFamily: 'Outfit,sans-serif', fontWeight: 800, color: G }}>What Our Clients Create</h2>
          </div>
          <div className="showcase-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24 }}>
            {SHOWCASES.map((s, i) => (
              <div key={i} data-aos="fade-up" data-aos-delay={i * 80} style={{ backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #E2DDD6', transition: 'box-shadow 0.2s, transform 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.12)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'none'; }}>
                <div style={{ height: 160, overflow: 'hidden' }}>
                  <img src={s.img} alt={s.brand} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
                <div style={{ padding: '18px 16px' }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>{s.industry}</p>
                  <h4 style={{ fontSize: 15, fontFamily: 'Outfit,sans-serif', fontWeight: 700, color: G, marginBottom: 10 }}>{s.brand}</h4>
                  <p style={{ fontSize: 12, color: '#4A4A4A', lineHeight: 1.65, fontStyle: 'italic' }}>"{s.quote}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5 — CTA */}
      <section style={{ padding: '72px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="cta-split" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>Start Today</p>
              <h2 style={{ fontSize: 'clamp(26px,3vw,38px)', fontFamily: 'Outfit,sans-serif', fontWeight: 800, color: G, marginBottom: 16, lineHeight: 1.2 }}>Start Your Custom Design</h2>
              <p style={{ fontSize: 15, color: '#4A4A4A', lineHeight: 1.7, marginBottom: 32 }}>Turn your packaging vision into reality. Configure, preview, and order your perfect custom box — all in one place. Free digital proof within 24 hours.</p>
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <Link to="/custom-box" style={{ padding: '14px 28px', backgroundColor: G, color: '#fff', borderRadius: 8, fontWeight: 700, textDecoration: 'none', fontSize: 14, transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = ACCENT}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = G}>
                  Get a Custom Box
                </Link>
                <Link to="/contact-us" style={{ padding: '14px 28px', backgroundColor: 'transparent', color: G, border: `2px solid ${G}`, borderRadius: 8, fontWeight: 700, textDecoration: 'none', fontSize: 14 }}>
                  Request Free Sample
                </Link>
              </div>
            </div>
            <div style={{ borderRadius: 16, overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.1)' }}>
              <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80" alt="Custom packaging" style={{ width: '100%', height: 380, objectFit: 'cover', display: 'block' }} />
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 1000px) {
          .gallery-grid { grid-template-columns: repeat(2,1fr) !important; }
          .trending-grid { grid-template-columns: repeat(2,1fr) !important; }
          .showcase-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 700px) {
          .gallery-grid { grid-template-columns: 1fr !important; }
          .trending-grid { grid-template-columns: 1fr !important; }
          .showcase-grid { grid-template-columns: 1fr !important; }
          .cta-split { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

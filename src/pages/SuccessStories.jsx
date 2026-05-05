import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Ruler, Layers, Palette, Sparkles } from 'lucide-react';

const G = '#1A4D2E';
const ACCENT = '#C8860A';
const BG = '#F5F2ED';

const FILTERS = ['All', 'Mailer Boxes', 'Rigid Boxes', 'Food & Beverage', 'Cosmetics', 'Eco-Friendly', 'Luxury', 'Subscription'];

const GALLERY = [
  { id: 1, src: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&q=80', cat: 'Cosmetics', name: 'Skincare Elegance Collection', filter: 'Cosmetics', height: 400 },
  { id: 2, src: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80', cat: 'Mailer Boxes', name: 'E-Commerce Mailer Pro', filter: 'Mailer Boxes', height: 280 },
  { id: 3, src: 'https://images.unsplash.com/photo-1619468579487-430c4d90f93b?w=600&q=80', cat: 'Eco-Friendly', name: 'Kraft Natural Packaging', filter: 'Eco-Friendly', height: 450 },
  { id: 4, src: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&q=80', cat: 'Mailer Boxes', name: 'Secure Shipping Solution', filter: 'Mailer Boxes', height: 320 },
  { id: 5, src: 'https://images.unsplash.com/photo-1553531384-cc64ac80f931?w=600&q=80', cat: 'Subscription', name: 'Monthly Box Subscription', filter: 'Subscription', height: 380 },
  { id: 6, src: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80', cat: 'Cosmetics', name: 'Premium Beauty Packaging', filter: 'Cosmetics', height: 260 },
  { id: 7, src: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80', cat: 'Food & Beverage', name: 'Artisan Bakery Boxes', filter: 'Food & Beverage', height: 420 },
  { id: 8, src: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&q=80', cat: 'Rigid Boxes', name: 'Luxury Rigid Setup Box', filter: 'Rigid Boxes', height: 300 },
  { id: 9, src: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80', cat: 'Subscription', name: 'Custom Branded Boxes', filter: 'Subscription', height: 480 },
  { id: 10, src: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600&q=80', cat: 'Luxury', name: 'Premium Retail Packaging', filter: 'Luxury', height: 350 },
];

const TRENDING = [
  {
    img: 'https://images.unsplash.com/photo-1553531384-cc64ac80f931?w=800&q=80',
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
    img: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80',
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
    img: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&q=80',
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
    img: 'https://images.unsplash.com/photo-1619468579487-430c4d90f93b?w=800&q=80',
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
  { brand: 'BiteBox Co.', industry: 'Food & Beverage', img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80', quote: 'Design Custom Box transformed our unboxing into a viral moment. Sales jumped 40% after our rebrand.' },
  { brand: 'Lumière Beauty', industry: 'Cosmetics', img: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&q=80', quote: 'The soft-touch matte finish on our boxes feels as luxurious as the products inside.' },
  { brand: 'TechShip Inc.', industry: 'E-Commerce', img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80', quote: 'Production on time, every time. We scaled from 1,000 to 100,000 units with ease.' },
  { brand: 'GreenLeaf Organics', industry: 'Eco-Friendly', img: 'https://images.unsplash.com/photo-1619468579487-430c4d90f93b?w=600&q=80', quote: 'The FSC-certified kraft boxes perfectly align with our sustainability values.' },
];

function TrendingCard({ t }) {
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
    <motion.div
      onClick={handleShop}
      whileHover="hover"
      initial="initial"
      style={{
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
        backgroundColor: '#fff',
        border: `1px solid #E2DDD6`,
        cursor: 'pointer',
        position: 'relative'
      }}
    >
      {/* Image Container */}
      <div style={{ height: 260, overflow: 'hidden', position: 'relative' }}>
        <motion.img
          variants={{ initial: { scale: 1 }, hover: { scale: 1.05 } }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          src={t.img}
          alt={t.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        <div style={{ position: 'absolute', top: 12, left: 12, backgroundColor: ACCENT, color: '#fff', fontSize: 10, fontFamily: '"DM Mono", monospace', fontWeight: 700, padding: '4px 12px', borderRadius: 100, textTransform: 'uppercase', letterSpacing: '0.1em', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          {t.cat}
        </div>
        <div style={{ position: 'absolute', top: 12, right: 12, backgroundColor: '#fff', color: G, fontSize: 13, fontWeight: 800, padding: '4px 10px', borderRadius: 8, fontFamily: '"Playfair Display", Georgia, serif', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          {t.price}<span style={{ fontSize: 10, fontFamily: '"DM Sans", sans-serif', fontWeight: 600, color: '#9A9080' }}>/unit</span>
        </div>

        {/* Hover Overlay Reveal */}
        <motion.div 
          variants={{ initial: { opacity: 0, y: 20 }, hover: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.3 }}
          style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(26, 77, 46, 0.85)', backdropFilter: 'blur(4px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '24px' }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: 20 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}><Layers size={12} color={ACCENT} /><span style={{ fontSize: 10, fontFamily: '"DM Mono", monospace', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>Material</span></div>
              <span style={{ fontSize: 13, fontFamily: '"DM Sans", sans-serif', color: '#fff', fontWeight: 600 }}>{t.material}</span>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}><Palette size={12} color={ACCENT} /><span style={{ fontSize: 10, fontFamily: '"DM Mono", monospace', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>Finish</span></div>
              <span style={{ fontSize: 13, fontFamily: '"DM Sans", sans-serif', color: '#fff', fontWeight: 600 }}>{t.finish}</span>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}><Ruler size={12} color={ACCENT} /><span style={{ fontSize: 10, fontFamily: '"DM Mono", monospace', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>Dims</span></div>
              <span style={{ fontSize: 13, fontFamily: '"DM Sans", sans-serif', color: '#fff', fontWeight: 600 }}>{t.dims}</span>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}><span style={{ fontSize: 10, fontFamily: '"DM Mono", monospace', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>Min Qty</span></div>
              <span style={{ fontSize: 13, fontFamily: '"DM Sans", sans-serif', color: '#fff', fontWeight: 600 }}>{t.minQty}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {t.addons.map(a => (
              <span key={a} style={{ fontSize: 10, fontFamily: '"DM Sans", sans-serif', fontWeight: 600, padding: '4px 10px', borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.15)', color: '#fff' }}>{a}</span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Persistent Body Info */}
      <div style={{ padding: '24px' }}>
        <h4 style={{ fontSize: 18, fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 700, color: G, marginBottom: 6 }}>{t.name}</h4>
        <p style={{ fontSize: 14, fontFamily: '"DM Sans", sans-serif', color: '#6B6B6B', marginBottom: 20 }}>{t.style}</p>
        <motion.button
          variants={{ initial: { backgroundColor: 'transparent', color: G }, hover: { backgroundColor: ACCENT, color: '#fff', borderColor: ACCENT } }}
          style={{ width: '100%', padding: '12px 0', border: `1.5px solid #D0CAC0`, borderRadius: 8, fontSize: 14, fontFamily: '"DM Sans", sans-serif', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
        >
          Customize Style <ChevronRight size={16} />
        </motion.button>
      </div>
    </motion.div>
  );
}

export default function SuccessStories() {
  const [activeFilter, setActiveFilter] = useState('All');
  const filtered = activeFilter === 'All' ? GALLERY : GALLERY.filter(g => g.filter === activeFilter);

  return (
    <div style={{ backgroundColor: BG, minHeight: '100vh', overflowX: 'hidden' }}>

      {/* 1 — Luxury Lookbook Hero */}
      <section style={{ height: 400, backgroundColor: '#1A1A1A', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {GALLERY.slice(0, 4).map((g, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.25, scale: 1 }}
            transition={{ duration: 1.5, delay: i * 0.1 }}
            style={{ position: 'absolute', width: '25%', height: '100%', left: `${i * 25}%`, backgroundImage: `url(${g.src})`, backgroundSize: 'cover', backgroundPosition: 'center' }} 
          />
        ))}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.8))' }} />
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
          style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '0 24px' }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 100, border: '1px solid rgba(255,255,255,0.2)', backgroundColor: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', marginBottom: 24 }}>
            <Sparkles size={14} color={ACCENT} />
            <p style={{ fontSize: 11, fontFamily: '"DM Mono", monospace', fontWeight: 600, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Design Lookbook</p>
          </div>
          <h1 style={{ fontSize: 'clamp(42px, 6vw, 68px)', fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 800, color: '#fff', marginBottom: 20, lineHeight: 1.05 }}>Packaging Inspiration</h1>
          <p style={{ fontSize: 18, fontFamily: '"DM Sans", sans-serif', color: 'rgba(255,255,255,0.8)', maxWidth: 540, margin: '0 auto' }}>Explore how industry-leading brands are elevating their unboxing experiences.</p>
        </motion.div>
      </section>

      {/* 2 — Filters + Masonry Gallery */}
      <section style={{ padding: '80px 24px', backgroundColor: BG }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 64 }}>
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                style={{
                  position: 'relative', padding: '10px 24px', borderRadius: 100, fontSize: 13, fontFamily: '"DM Sans", sans-serif', fontWeight: 600, cursor: 'pointer', border: 'none', background: 'none', color: activeFilter === f ? '#fff' : '#6B6B6B', transition: 'color 0.2s', zIndex: 1
                }}
              >
                {activeFilter === f && (
                  <motion.div
                    layoutId="galleryFilter"
                    style={{ position: 'absolute', inset: 0, backgroundColor: ACCENT, borderRadius: 100, zIndex: -1, boxShadow: '0 4px 12px rgba(200,134,10,0.3)' }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                {f}
              </button>
            ))}
          </div>

          <div style={{ columns: '1', columnGap: '24px', margin: '0 auto' }} className="masonry-columns">
            <AnimatePresence mode="popLayout">
              {filtered.map((item) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  key={item.id} 
                  style={{ breakInside: 'avoid', marginBottom: '24px' }}
                >
                  <div 
                    style={{ borderRadius: 16, overflow: 'hidden', position: 'relative', cursor: 'pointer', height: item.height }}
                    className="group"
                  >
                    <img src={item.src} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }} className="group-hover:scale-105" />
                    
                    <div style={{ position: 'absolute', top: 16, left: 16 }}>
                      <span style={{ backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)', color: G, fontSize: 10, fontFamily: '"DM Mono", monospace', fontWeight: 700, padding: '6px 14px', borderRadius: 100, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{item.cat}</span>
                    </div>
                    
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 40%, transparent 100%)', opacity: 0, transition: 'opacity 0.3s' }} className="group-hover:opacity-100" />
                    
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '32px 24px', transform: 'translateY(20px)', opacity: 0, transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }} className="group-hover:opacity-100 group-hover:translate-y-0">
                      <p style={{ color: '#fff', fontSize: 22, fontWeight: 700, fontFamily: '"Playfair Display", Georgia, serif', marginBottom: 8, lineHeight: 1.2 }}>{item.name}</p>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontFamily: '"DM Sans", sans-serif', fontWeight: 600, color: ACCENT }}>
                        View Details <ChevronRight size={14} />
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '64px 0', color: '#6B6B6B' }}>
              <p style={{ fontSize: 18, fontFamily: '"DM Sans", sans-serif' }}>No items found. Try a different filter.</p>
            </div>
          )}
        </div>
      </section>

      {/* 3 — Trending This Season */}
      <section style={{ padding: '120px 24px', backgroundColor: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p style={{ fontSize: 12, fontFamily: '"DM Mono", monospace', fontWeight: 500, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 16 }}>Hot Right Now</p>
            <h2 style={{ fontSize: 'clamp(32px,4vw,48px)', fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 700, color: G, marginBottom: 16 }}>Trending This Season</h2>
            <p style={{ fontSize: 16, fontFamily: '"DM Sans", sans-serif', color: '#6B6B6B', maxWidth: 540, margin: '0 auto', lineHeight: 1.6 }}>Click any design to customize your own version. All specifications will be pre-filled automatically.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32 }} className="trending-grid">
            {TRENDING.map((t, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
              >
                <TrendingCard t={t} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 — Customer Showcases */}
      <section style={{ padding: '120px 24px', backgroundColor: BG }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 80 }}>
            <p style={{ fontSize: 12, fontFamily: '"DM Mono", monospace', fontWeight: 500, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 16 }}>Case Studies</p>
            <h2 style={{ fontSize: 'clamp(32px,4vw,48px)', fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 700, color: G }}>What Our Clients Create</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32 }} className="showcase-grid">
            {SHOWCASES.map((s, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                style={{ backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', border: '1px solid #E8E4DC', transition: 'all 0.3s ease' }}
                whileHover={{ y: -6, boxShadow: '0 24px 48px rgba(0,0,0,0.06)' }}
              >
                <div style={{ height: 200, overflow: 'hidden' }}>
                  <img src={s.img} alt={s.brand} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '32px' }}>
                  <p style={{ fontSize: 10, fontFamily: '"DM Mono", monospace', fontWeight: 600, color: '#9A9080', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 8 }}>{s.industry}</p>
                  <h4 style={{ fontSize: 22, fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 700, color: G, marginBottom: 16 }}>{s.brand}</h4>
                  <p style={{ fontSize: 14, fontFamily: '"DM Sans", sans-serif', color: '#4A4A4A', lineHeight: 1.7, fontStyle: 'italic', position: 'relative' }}>
                    <span style={{ fontSize: 40, color: `${ACCENT}25`, position: 'absolute', top: -16, left: -10, fontFamily: 'serif' }}>"</span>
                    {s.quote}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5 — Split CTA */}
      <section style={{ padding: '120px 24px', backgroundColor: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 80, alignItems: 'center' }} className="cta-split">
            <motion.div
              initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
            >
              <p style={{ fontSize: 12, fontFamily: '"DM Mono", monospace', fontWeight: 500, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 16 }}>Your Turn</p>
              <h2 style={{ fontSize: 'clamp(36px,4vw,56px)', fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 700, color: G, marginBottom: 24, lineHeight: 1.1 }}>Ready to build<br />your own?</h2>
              <p style={{ fontSize: 18, fontFamily: '"DM Sans", sans-serif', color: '#6B6B6B', lineHeight: 1.7, marginBottom: 40 }}>Turn your packaging vision into reality. Configure, preview in 3D, and order your perfect custom box all in one place. Free digital proof within 24 hours.</p>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <Link to="/custom-box" style={{ padding: '18px 40px', backgroundColor: G, color: '#fff', borderRadius: 8, fontFamily: '"DM Sans", sans-serif', fontWeight: 700, textDecoration: 'none', fontSize: 15, transition: 'all 0.3s' }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = ACCENT; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = G; e.currentTarget.style.transform = 'none'; }}>
                  Start Designing
                </Link>
                <Link to="/contact-us" style={{ padding: '18px 40px', backgroundColor: 'transparent', color: G, border: `1.5px solid ${G}`, borderRadius: 8, fontFamily: '"DM Sans", sans-serif', fontWeight: 700, textDecoration: 'none', fontSize: 15, transition: 'all 0.3s' }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(26,77,46,0.05)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.transform = 'none'; }}>
                  Request Sample
                </Link>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
              style={{ borderRadius: 24, overflow: 'hidden', boxShadow: '0 32px 64px rgba(26,77,46,0.1)' }}
            >
              <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80" alt="Custom packaging" style={{ width: '100%', height: 500, objectFit: 'cover', display: 'block' }} />
            </motion.div>
          </div>
        </div>
      </section>

      <style>{`
        /* CSS columns for Masonry layout */
        @media (min-width: 1024px) { .masonry-columns { columns: 3; } }
        @media (min-width: 640px) and (max-width: 1023px) { .masonry-columns { columns: 2; } }
        @media (max-width: 639px) { .masonry-columns { columns: 1; } }

        @media (max-width: 1000px) {
          .cta-split { grid-template-columns: 1fr !important; gap: 48px !important; }
        }
      `}</style>
    </div>
  );
}

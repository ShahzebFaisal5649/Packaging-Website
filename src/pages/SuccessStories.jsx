import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Ruler, Layers, Palette, Sparkles, Box, ExternalLink, ArrowRight, Star, Quote, Globe, Zap } from 'lucide-react';

const G = '#1A4D2E';
const ACCENT = '#C8860A';
const BG = '#F8F6F2';

const FILTERS = ['All', 'Mailer Boxes', 'Rigid Boxes', 'Eco-Friendly', 'Cosmetics', 'Food & Beverage', 'Luxury'];

const GALLERY = [
  { id: 1, src: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&q=80', cat: 'Cosmetics', name: 'Velvet Matte Beauty Series', filter: 'Cosmetics', price: '$1.85', style: 'Soft-touch finish with gold foil stamping.', addons: ['Gold Foil', 'Soft-Touch'] },
  { id: 2, src: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80', cat: 'Mailer Boxes', name: 'Sustainable Apparel Mailer', filter: 'Mailer Boxes', price: '$1.20', style: 'E-flute corrugated with eco-friendly ink.', addons: ['Eco-Ink', 'Tear Strip'] },
  { id: 3, src: 'https://images.unsplash.com/photo-1619468579487-430c4d90f93b?w=800&q=80', cat: 'Eco-Friendly', name: 'Raw Kraft Organic Pack', filter: 'Eco-Friendly', price: '$0.95', style: '100% recycled kraft board.', addons: ['Recycled', 'Biodegradable'] },
  { id: 4, src: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80', cat: 'Rigid Boxes', name: 'Signature Tech Collection', filter: 'Rigid Boxes', price: '$3.50', style: 'Magnetic closure with velvet insert.', addons: ['Magnetic', 'Spot UV'] },
  { id: 5, src: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80', cat: 'Mailer Boxes', name: 'Premium E-comm Solution', filter: 'Mailer Boxes', price: '$1.45', style: 'Double-sided printing on B-flute.', addons: ['Inside Print', 'Gloss Lam'] },
  { id: 6, src: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80', cat: 'Food & Beverage', name: 'Artisan Confectionery Box', filter: 'Food & Beverage', price: '$1.10', style: 'Food-safe aqueous coating.', addons: ['Food Safe', 'Window'] },
  { id: 7, src: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80', cat: 'Luxury', name: 'High-End Retail Experience', filter: 'Luxury', price: '$4.20', style: 'Embossed texture with silk lining.', addons: ['Embossing', 'Silk Lining'] },
  { id: 8, src: 'https://images.unsplash.com/photo-1553531384-cc64ac80f931?w=800&q=80', cat: 'Eco-Friendly', name: 'Biodegradable Mailer Pro', filter: 'Eco-Friendly', price: '$1.05', style: 'Plastic-free construction.', addons: ['FSC Certified', 'Compostable'] },
  { id: 9, src: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80', cat: 'Luxury', name: 'Midnight Collection Rigid', filter: 'Luxury', price: '$3.80', style: 'Suede wrap with silver foil.', addons: ['Suede', 'Silver Foil'] },
  { id: 10, src: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&q=80', cat: 'Cosmetics', name: 'Pastel Skincare Kit', filter: 'Cosmetics', price: '$1.60', style: 'Matte lamination with spot UV.', addons: ['Spot UV', 'Matte Lam'] },
];

function TrendingCard({ t }) {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      onClick={() => navigate('/custom-box', { state: t })}
      whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
      style={{
        borderRadius: 20, overflow: 'hidden', backgroundColor: '#fff',
        border: '1px solid #EAE6E1', cursor: 'pointer', position: 'relative',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      <div style={{ height: 260, overflow: 'hidden', position: 'relative' }}>
        <img src={t.src} alt={t.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', top: 12, right: 12, backgroundColor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)', color: G, fontSize: 12, fontWeight: 800, padding: '4px 10px', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          From {t.price}
        </div>
      </div>
      <div style={{ padding: 20 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 8 }}>{t.cat}</span>
        <h3 style={{ fontSize: 18, fontFamily: '"Playfair Display", serif', fontWeight: 700, color: G, marginBottom: 8, lineHeight: 1.2 }}>{t.name}</h3>
        <p style={{ fontSize: 13, color: '#666', lineHeight: 1.5, marginBottom: 16 }}>{t.style}</p>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
           {t.addons.map(a => <span key={a} style={{ fontSize: 9, fontWeight: 600, padding: '3px 8px', backgroundColor: '#F5F2ED', color: '#888', borderRadius: 5 }}>{a}</span>)}
        </div>
      </div>
    </motion.div>
  );
}

function FeatureSection() {
  return (
    <section style={{ padding: '100px 24px', backgroundColor: '#fff' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <h2 style={{ fontSize: 36, fontFamily: '"Playfair Display", serif', fontWeight: 800, color: G }}>Our Design Philosophy</h2>
          <p style={{ fontSize: 16, color: '#666', maxWidth: 600, margin: '16px auto 0' }}>We combine engineering precision with artistic vision to create packaging that speaks volumes about your brand.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 40 }}>
          {[
            { icon: <Palette size={28} />, title: 'Brand Storytelling', desc: 'Every design choice, from color palette to material texture, is crafted to resonate with your target audience.' },
            { icon: <Layers size={28} />, title: 'Premium Materials', desc: 'We source only the finest sustainable materials to ensure your product feels as good as it looks.' },
            { icon: <Zap size={28} />, title: 'Speed to Market', desc: 'Our streamlined production process means your custom designs go from concept to doorstep in record time.' },
            { icon: <Globe size={28} />, title: 'Global Standards', desc: 'We adhere to international quality standards, ensuring consistency across every single unit produced.' }
          ].map((f, i) => (
            <div key={i} style={{ padding: 32, borderRadius: 20, background: '#F8F6F2', transition: 'all 0.3s' }}>
              <div style={{ color: ACCENT, marginBottom: 20 }}>{f.icon}</div>
              <h3 style={{ fontSize: 20, fontFamily: '"Playfair Display", serif', fontWeight: 700, marginBottom: 12 }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: '#666', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialSection() {
  return (
    <section style={{ padding: '100px 24px', backgroundColor: '#F8F6F2' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
        <Quote size={48} color={ACCENT} style={{ marginBottom: 32, opacity: 0.3 }} />
        <h2 style={{ fontSize: 28, fontFamily: '"Playfair Display", serif', fontWeight: 700, color: G, marginBottom: 40, fontStyle: 'italic' }}>
          "Design Custom Box transformed our shipping experience. Our customers are constantly posting unboxing videos on social media, which has been a game-changer for our organic reach."
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
          <img src="https://i.pravatar.cc/60?img=32" alt="Client" style={{ width: 60, height: 60, borderRadius: '50%' }} />
          <div style={{ textAlign: 'left' }}>
            <p style={{ margin: 0, fontWeight: 700, color: G }}>Eleanor Shellstrop</p>
            <p style={{ margin: 0, fontSize: 13, color: '#888' }}>Founder, Bloom Cosmetics</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function QuoteCTA() {
  return (
    <section style={{ padding: '120px 24px', background: `linear-gradient(rgba(26,77,46,0.9), rgba(26,77,46,0.9)), url(https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=1600)`, backgroundSize: 'cover', backgroundPosition: 'center', textAlign: 'center' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontFamily: '"Playfair Display", serif', fontWeight: 900, color: '#fff', marginBottom: 24, lineHeight: 1.1 }}>Ready to make a lasting impression?</h2>
        <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.8)', marginBottom: 48, maxWidth: 600, margin: '0 auto 48px' }}>Your premium packaging journey starts here. Get an instant quote and start designing today.</p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/custom-box" style={{ padding: '20px 48px', background: ACCENT, color: '#fff', borderRadius: 12, fontWeight: 800, fontSize: 18, textDecoration: 'none', boxShadow: '0 20px 40px rgba(200,134,10,0.3)', transition: 'all 0.3s' }}>Get Free Quote</Link>
          <Link to="/contact-us" style={{ padding: '20px 48px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(10px)', borderRadius: 12, fontWeight: 700, fontSize: 18, textDecoration: 'none' }}>Speak to Expert</Link>
        </div>
      </div>
    </section>
  );
}

export default function SuccessStories() {
  const [activeFilter, setActiveFilter] = useState('All');
  const filtered = activeFilter === 'All' ? GALLERY : GALLERY.filter(g => g.filter === activeFilter);

  return (
    <div style={{ backgroundColor: BG, minHeight: '100vh' }}>
      {/* Premium Hero */}
      <section style={{ position: 'relative', height: '70vh', minHeight: 600, display: 'flex', alignItems: 'center', background: '#0F172A', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.4 }}>
           <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600&q=80" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
           <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, #0F172A 30%, transparent)' }} />
        </div>
        
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 10, width: '100%' }}>
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
               <span style={{ width: 40, height: 1, background: ACCENT }} />
               <span style={{ color: ACCENT, fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em' }}>Portfolio Showcase</span>
            </div>
            <h1 style={{ fontSize: 'clamp(48px, 8vw, 84px)', fontFamily: '"Playfair Display", serif', fontWeight: 900, color: '#fff', lineHeight: 1, marginBottom: 32, maxWidth: 800 }}>
              The Art of <span style={{ color: ACCENT, fontStyle: 'italic' }}>Unboxing</span>.
            </h1>
            <p style={{ fontSize: 20, color: 'rgba(255,255,255,0.7)', maxWidth: 540, lineHeight: 1.6, marginBottom: 48 }}>
              From boutique brands to global enterprises, we help you create packaging that tells your story and delights your customers.
            </p>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }} className="hero-cta-buttons">
               <button onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })} style={{ padding: '18px 40px', background: ACCENT, color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 16, cursor: 'pointer', boxShadow: '0 20px 40px rgba(200,134,10,0.3)' }}>View Showcase</button>
               <Link to="/custom-box" style={{ padding: '18px 40px', background: 'transparent', color: '#fff', border: '2px solid rgba(255,255,255,0.2)', borderRadius: 12, fontWeight: 700, fontSize: 16, textDecoration: 'none', display: 'inline-block', boxSizing: 'border-box' }}>Start Designing</Link>
            </div>
          </motion.div>
        </div>
      </section>

      <FeatureSection />

      {/* Gallery Showcase */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 60 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 12 }}>Case Studies</p>
            <h2 style={{ fontSize: 42, fontFamily: '"Playfair Display", serif', fontWeight: 800, color: G, marginBottom: 40, textAlign: 'center' }}>Gallery of Inspiration</h2>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', background: '#fff', padding: 8, borderRadius: 20, boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid #EAE6E1' }}>
              {FILTERS.map(f => (
                <button key={f} onClick={() => setActiveFilter(f)} style={{
                  padding: '10px 24px', borderRadius: 14, border: 'none', background: activeFilter === f ? G : 'transparent', color: activeFilter === f ? '#fff' : '#666',
                  fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s'
                }}>{f}</button>
              ))}
            </div>
          </div>

          <motion.div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
            <AnimatePresence mode="wait">
              {filtered.map(item => (
                <TrendingCard key={item.id} t={item} />
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      <TestimonialSection />
      <QuoteCTA />

      <style>{`
        @media (max-width: 480px) {
          .hero-cta-buttons { flex-direction: column !important; width: 100% !important; }
          .hero-cta-buttons button,
          .hero-cta-buttons a { width: 100% !important; text-align: center !important; padding: 16px 24px !important; }
        }
      `}</style>
    </div>
  );
}

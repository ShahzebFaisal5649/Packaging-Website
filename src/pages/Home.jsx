import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Package, Truck, Star, TrendingUp, ShieldCheck, Leaf, Zap,
  Clock, Award, CheckCircle, ChevronRight, Box, Layers, Cpu, Recycle,
  Play, Users, BarChart3, Sparkles, RefreshCw, MessageCircle, ChevronLeft,
} from 'lucide-react';

import Hero from '../components/Hero';
import TrendingProducts from '../components/TrendingProducts';
import EmpoweringBrands from '../components/EmpoweringBrands';

const G = '#1A4D2E';
const ACCENT = '#C8860A';
const BG = '#F5F2ED';

// ── Data ─────────────────────────────────────────────────────────────────────
const STATS = [
  { number: '500K+', label: 'Boxes Delivered', icon: <Package size={24} color={ACCENT} /> },
  { number: '10,000+', label: 'Happy Brands', icon: <Award size={24} color={ACCENT} /> },
  { number: '8 Days', label: 'Avg. Turnaround', icon: <Clock size={24} color={ACCENT} /> },
  { number: '99%', label: 'Satisfaction Rate', icon: <Star size={24} color={ACCENT} strokeWidth={1.5} /> },
];

const MATERIALS = [
  {
    name: 'SBS Board',
    desc: 'Premium coated board for vibrant, sharp print quality. Ideal for retail and cosmetics.',
    badge: 'Most Popular',
    badgeColor: ACCENT,
    img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80',
    usedFor: ['Cosmetics', 'Retail', 'Pharma'],
    highlight: 'Vibrant CMYK print',
  },
  {
    name: 'Corrugated E-Flute',
    desc: 'Lightweight yet strong. Perfect for e-commerce mailer boxes and shipping protection.',
    badge: 'Best Value',
    badgeColor: G,
    img: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80',
    usedFor: ['E-commerce', 'Shipping', 'Subscription'],
    highlight: 'High crush resistance',
  },
  {
    name: 'Rigid Chipboard',
    desc: 'Premium thick board for luxury unboxing. Delivers a high-end feel every time.',
    badge: 'Luxury',
    badgeColor: '#8B6914',
    img: 'https://images.unsplash.com/photo-1553481187-be93c21490a9?w=800&q=80',
    usedFor: ['Luxury', 'Gifting', 'Electronics'],
    highlight: '2mm–4mm thickness',
  },
  {
    name: 'Kraft',
    desc: '100% recycled & FSC-certified. Earthy look with minimal environmental footprint.',
    badge: 'Eco-Friendly',
    badgeColor: '#2E7D32',
    img: 'https://images.unsplash.com/photo-1619468579487-430c4d90f93b?w=800&q=80',
    usedFor: ['Food', 'Organic', 'Eco Brands'],
    highlight: 'FSC Certified',
  },
];

const FINISHES = [
  { name: 'Matte Lam', desc: 'Smooth, non-reflective elegance', icon: <Layers size={20} color={G} />, color: '#E8F0EC' },
  { name: 'Gloss Lam', desc: 'High-shine, vibrant colors', icon: <Zap size={20} color={ACCENT} />, color: '#FFF3E0' },
  { name: 'Soft-Touch', desc: 'Velvety, tactile premium feel', icon: <Box size={20} color={G} />, color: '#E8F0EC' },
  { name: 'Spot UV', desc: 'Selective gloss highlight', icon: <Cpu size={20} color={ACCENT} />, color: '#FFF3E0' },
  { name: 'Foil Stamp', desc: 'Metallic gold/silver accents', icon: <Award size={20} color="#8B6914" />, color: '#FEF9E7' },
  { name: 'Embossing', desc: 'Raised 3D texture effect', icon: <TrendingUp size={20} color={G} />, color: '#E8F0EC' },
];

const STEPS = [
  { step: '01', title: 'Select Your Box', desc: 'Choose from 50+ box styles, materials, and sizes in our full catalog.', img: 'https://images.unsplash.com/photo-1553531384-cc64ac80f931?w=600&q=80', time: '2 minutes' },
  { step: '02', title: 'Customize Design', desc: 'Use our live 3D configurator or collaborate with our design team.', img: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80', time: '5 minutes' },
  { step: '03', title: 'Review & Approve', desc: 'Get a digital 3D proof or request a physical sample before we print.', img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80', time: '24 hours' },
  { step: '04', title: 'Production & Delivery', desc: 'We manufacture and ship directly to your door in 8 to 10 business days.', img: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=600&q=80', time: '8 to 10 days' },
];

const TESTIMONIALS = [
  { name: 'Sarah Mitchell', role: 'Founder, Lumière Beauty', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80', quote: 'Design Custom Box delivered our skincare boxes in 7 days with flawless matte finish, zero defects. Our customers love the unboxing experience.', rating: 5, metric: '3× increase in repeat purchases' },
  { name: 'James Kowalski', role: 'Ops Manager, TechShip Inc.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80', quote: 'Scaled from 2,000 to 80,000 units in six months. Design Custom Box handled every order on time with consistent quality across all batches.', rating: 5, metric: '40× volume scale in 6 months' },
  { name: 'Priya Sharma', role: 'Brand Director, GreenLeaf Organics', avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&q=80', quote: 'The FSC-certified kraft boxes are exactly on-brand for us. Eco-friendly packaging that looks amazing on retail shelves.', rating: 5, metric: '28% reduction in packaging cost' },
];

const INSP_GALLERY = [
  { img: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80', label: 'Mailer Box', tag: 'E-commerce' },
  { img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80', label: 'Luxury Rigid Box', tag: 'Beauty' },
  { img: 'https://images.unsplash.com/photo-1553531384-cc64ac80f931?w=600&q=80', label: 'Shipping Box', tag: 'Retail' },
  { img: 'https://images.unsplash.com/photo-1620799139507-2a76f79a2f4d?w=600&q=80', label: 'Kraft Box', tag: 'Eco-Friendly' },
  { img: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80', label: 'Folding Carton', tag: 'Food & Bev' },
  { img: 'https://images.unsplash.com/photo-1585664811087-47f65abbad64?w=600&q=80', label: 'Display Box', tag: 'Cosmetics' },
];

const FEATURES = [
  { icon: <ShieldCheck size={26} color={G} />, title: 'Quality Guaranteed', desc: 'Every batch is inspected. We re-print at no charge if it doesn\'t meet spec.' },
  { icon: <Zap size={26} color={ACCENT} />, title: '8 Day Turnaround', desc: 'Standard orders ship in 8 to 10 business days. Fast options available.' },
  { icon: <Users size={26} color={G} />, title: 'Dedicated Specialist', desc: 'A packaging expert assigned to your account from day one.' },
  { icon: <BarChart3 size={26} color={ACCENT} />, title: 'Volume Pricing', desc: 'Prices drop significantly at 500, 1,000, and 5,000 plus units.' },
  { icon: <Leaf size={26} color="#2E7D32" />, title: 'Sustainable Materials', desc: 'FSC certified board, soy inks, and 100% recyclable substrates.' },
  { icon: <Sparkles size={26} color={ACCENT} />, title: 'Free Design Support', desc: 'Our in-house designers will polish your artwork before we print.' },
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function Home() {
  const [activeMaterial, setActiveMaterial] = useState(0);
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [showVideoModal, setShowVideoModal] = useState(false);

  // Auto-rotate testimonials
  useEffect(() => {
    const t = setInterval(() => setTestimonialIdx(i => (i + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ backgroundColor: BG, overflowX: 'hidden' }}>

      {/* 1. Hero */}
      <Hero />

      {/* 2. Stats Bar */}
      <section style={{ backgroundColor: '#fff', borderBottom: '1px solid #E8E4DC', position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            {STATS.map((s, i) => (
              <motion.div 
                key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ delay: i * 0.1, duration: 0.6 }}
                style={{ padding: '48px 24px', textAlign: 'center', borderRight: i < 3 ? '1px solid #F0EDE8' : 'none' }}
              >
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>{s.icon}</div>
                <div style={{ fontSize: 36, fontWeight: 700, color: G, fontFamily: '"Playfair Display", Georgia, serif', lineHeight: 1, marginBottom: 8 }}>{s.number}</div>
                <div style={{ fontSize: 12, fontFamily: '"DM Mono", monospace', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Trending Products */}
      <TrendingProducts />

      {/* 4. Materials — Interactive Showcase */}
      <section style={{ padding: '120px 24px', backgroundColor: '#fff' }}>
        <div style={{ maxWidth: 1300, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ textAlign: 'center', marginBottom: 64 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.15em', display: 'block', marginBottom: 16, fontFamily: '"DM Mono", monospace' }}>Built to Spec</span>
            <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 700, color: '#1A1A1A', marginBottom: 16 }}>Premium Materials &amp; Finishes</h2>
            <p style={{ fontSize: 18, fontFamily: '"DM Sans", sans-serif', color: '#666', maxWidth: 540, margin: '0 auto', lineHeight: 1.7 }}>
              Four core substrates, each engineered for distinct industries, durability requirements, and price points.
            </p>
          </motion.div>

          {/* Material Tabs */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 48, flexWrap: 'wrap' }}>
            {MATERIALS.map((m, i) => (
              <button key={i} onClick={() => setActiveMaterial(i)}
                style={{
                  position: 'relative', padding: '12px 28px', borderRadius: 100, border: `1px solid ${activeMaterial === i ? G : '#E8E4DC'}`,
                  background: activeMaterial === i ? G : '#fff', color: activeMaterial === i ? '#fff' : '#555',
                  fontWeight: 700, fontSize: 14, cursor: 'pointer', transition: 'all 0.2s', fontFamily: '"DM Sans", sans-serif',
                }}>
                {m.name}
              </button>
            ))}
          </motion.div>

          {/* Active Material Showcase */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }} 
            style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', borderRadius: 24, overflow: 'hidden', border: '1px solid #E8E4DC', boxShadow: '0 32px 64px rgba(26,77,46,0.06)' }} className="material-showcase">
            <div style={{ overflow: 'hidden', position: 'relative' }}>
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeMaterial}
                  initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
                  src={MATERIALS[activeMaterial].img} alt={MATERIALS[activeMaterial].name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', minHeight: 400 }}
                />
              </AnimatePresence>
            </div>
            
            <div style={{ padding: '64px', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: BG }}>
              <AnimatePresence mode="wait">
                <motion.div key={activeMaterial} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4 }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', padding: '6px 14px', background: `${MATERIALS[activeMaterial].badgeColor}15`, color: MATERIALS[activeMaterial].badgeColor, borderRadius: 100, fontSize: 11, fontFamily: '"DM Mono", monospace', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 24 }}>
                    {MATERIALS[activeMaterial].badge}
                  </span>
                  <h3 style={{ fontSize: 36, fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 700, color: '#1A1A1A', marginBottom: 16 }}>{MATERIALS[activeMaterial].name}</h3>
                  <p style={{ fontSize: 16, fontFamily: '"DM Sans", sans-serif', color: '#666', lineHeight: 1.7, marginBottom: 32 }}>{MATERIALS[activeMaterial].desc}</p>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32, padding: '16px 24px', background: '#fff', borderRadius: 12, border: `1px solid #E8E4DC` }}>
                    <CheckCircle size={20} color={G} />
                    <span style={{ fontSize: 15, fontFamily: '"DM Sans", sans-serif', fontWeight: 700, color: G }}>{MATERIALS[activeMaterial].highlight}</span>
                  </div>
                  
                  <div style={{ marginBottom: 40 }}>
                    <p style={{ fontSize: 11, fontFamily: '"DM Mono", monospace', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 12 }}>Industries covered</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                      {MATERIALS[activeMaterial].usedFor.map(u => (
                        <span key={u} style={{ fontSize: 12, fontFamily: '"DM Sans", sans-serif', fontWeight: 600, padding: '6px 14px', borderRadius: 8, background: '#fff', color: G, border: `1px solid #E8E4DC` }}>{u}</span>
                      ))}
                    </div>
                  </div>
                  
                  <Link to="/custom-box" state={{ material: MATERIALS[activeMaterial].name }}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '16px 32px', background: G, color: '#fff', borderRadius: 12, fontWeight: 700, fontSize: 15, fontFamily: '"DM Sans", sans-serif', textDecoration: 'none', transition: 'all 0.3s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = ACCENT; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = G; e.currentTarget.style.transform = 'none'; }}>
                    Configure with {MATERIALS[activeMaterial].name} <ArrowRight size={16} />
                  </Link>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Finishes Strip */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} style={{ background: '#fff', borderRadius: 24, border: '1px solid #E8E4DC', padding: '48px', marginTop: 40, boxShadow: '0 20px 40px rgba(0,0,0,0.02)' }}>
            <p style={{ fontSize: 12, fontFamily: '"DM Mono", monospace', fontWeight: 600, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 32, textAlign: 'center' }}>Available Finishes</p>
            <div className="finishes-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 20 }}>
              {FINISHES.map((f, i) => (
                <motion.div key={i} whileHover={{ y: -6, boxShadow: '0 12px 24px rgba(0,0,0,0.06)' }}
                  style={{ textAlign: 'center', padding: '24px 16px', borderRadius: 16, background: BG, border: '1px solid #E8E4DC', cursor: 'pointer', transition: 'all 0.3s' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16, width: 56, height: 56, borderRadius: '50%', background: f.color, alignItems: 'center', margin: '0 auto 16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>{f.icon}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: G, marginBottom: 8, fontFamily: '"Playfair Display", serif' }}>{f.name}</div>
                  <div style={{ fontSize: 13, fontFamily: '"DM Sans", sans-serif', color: '#6B6B6B', lineHeight: 1.5 }}>{f.desc}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 5. Why Design Custom Box */}
      <section style={{ padding: '120px 24px', backgroundColor: BG }}>
        <div style={{ maxWidth: 1300, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 80, alignItems: 'center' }} className="why-grid">
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
              <span style={{ fontSize: 12, fontFamily: '"DM Mono", monospace', fontWeight: 600, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.15em', display: 'block', marginBottom: 16 }}>The Difference</span>
              <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 700, color: G, lineHeight: 1.15, marginBottom: 24 }}>
                Why 10,000+ brands choose us
              </h2>
              <p style={{ fontSize: 17, fontFamily: '"DM Sans", sans-serif', color: '#666', lineHeight: 1.7, marginBottom: 40 }}>
                From ambitious startups to enterprise operations, we deliver custom packaging with the speed, precision, and service that modern businesses demand.
              </p>
              <div style={{ display: 'flex', gap: 16, marginBottom: 48 }}>
                {[
                  { value: '100', label: 'Min. Order', color: G },
                  { value: 'Free', label: 'Design Help', color: ACCENT },
                  { value: '8', label: 'Days Ship', color: G }
                ].map((item, i) => (
                  <div key={i} style={{ padding: '24px', background: '#fff', borderRadius: 16, border: `1px solid #E8E4DC`, flex: 1, textAlign: 'center', boxShadow: '0 12px 24px rgba(0,0,0,0.02)' }}>
                    <div style={{ fontSize: 32, fontWeight: 700, color: item.color, fontFamily: '"Playfair Display", serif', lineHeight: 1, marginBottom: 8 }}>{item.value}</div>
                    <div style={{ fontSize: 11, fontFamily: '"DM Mono", monospace', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>{item.label}</div>
                  </div>
                ))}
              </div>
              <Link to="/about"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '16px 36px', background: G, color: '#fff', borderRadius: 12, fontWeight: 700, fontSize: 15, fontFamily: '"DM Sans", sans-serif', textDecoration: 'none', transition: 'all 0.3s' }}
                onMouseEnter={e => { e.currentTarget.style.background = ACCENT; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = G; e.currentTarget.style.transform = 'none'; }}>
                Learn Our Story <ArrowRight size={16} />
              </Link>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, staggerChildren: 0.1 }}>
              <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 20 }}>
                {FEATURES.map((f, i) => (
                  <motion.div key={i} whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}
                    style={{ padding: '32px 24px', background: '#fff', borderRadius: 16, border: '1px solid #E8E4DC', transition: 'all 0.3s' }}>
                    <div style={{ marginBottom: 20, width: 48, height: 48, borderRadius: 12, backgroundColor: BG, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{f.icon}</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: G, fontFamily: '"Playfair Display", serif', marginBottom: 10 }}>{f.title}</div>
                    <div style={{ fontSize: 14, fontFamily: '"DM Sans", sans-serif', color: '#6B6B6B', lineHeight: 1.6 }}>{f.desc}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 6. Industries */}
      <EmpoweringBrands />

      {/* 7. How It Works */}
      <section style={{ padding: '120px 24px', backgroundColor: '#fff' }}>
        <div style={{ maxWidth: 1300, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 80 }}>
            <span style={{ fontSize: 12, fontFamily: '"DM Mono", monospace', fontWeight: 600, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.15em', display: 'block', marginBottom: 16 }}>Simple Process</span>
            <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 700, color: G, marginBottom: 16 }}>From Idea to Doorstep</h2>
            <p style={{ fontSize: 18, fontFamily: '"DM Sans", sans-serif', color: '#666', maxWidth: 540, margin: '0 auto', lineHeight: 1.7 }}>
              Four simple steps to get professional custom packaging delivered to you.
            </p>
          </motion.div>

          <div className="steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24, position: 'relative' }}>
            <div style={{ position: 'absolute', top: 52, left: '12%', right: '12%', height: 2, background: `linear-gradient(90deg, transparent, ${ACCENT}50, ${ACCENT}, ${ACCENT}50, transparent)` }} className="step-line hidden md:block" />
            
            {STEPS.map((s, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.15, duration: 0.6 }}
                whileHover={{ y: -10, boxShadow: '0 24px 48px rgba(0,0,0,0.08)' }}
                style={{ background: BG, borderRadius: 20, overflow: 'hidden', border: '1px solid #E8E4DC', position: 'relative', zIndex: 1, transition: 'all 0.3s ease' }}>
                <div style={{ height: 180, overflow: 'hidden', position: 'relative' }}>
                  <img src={s.img} alt={s.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  <div style={{ position: 'absolute', top: 16, left: 16, width: 44, height: 44, borderRadius: '50%', background: ACCENT, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600, fontFamily: '"DM Mono", monospace', boxShadow: '0 4px 16px rgba(200,134,10,0.4)' }}>{s.step}</div>
                  <div style={{ position: 'absolute', bottom: 12, right: 12, padding: '6px 14px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', borderRadius: 100, fontSize: 11, fontFamily: '"DM Mono", monospace', fontWeight: 600, color: '#fff', letterSpacing: '0.05em' }}>{s.time}</div>
                </div>
                <div style={{ padding: '32px 24px' }}>
                  <h3 style={{ fontSize: 20, fontWeight: 700, color: G, marginBottom: 12, fontFamily: '"Playfair Display", serif' }}>{s.title}</h3>
                  <p style={{ fontSize: 15, fontFamily: '"DM Sans", sans-serif', color: '#6B6B6B', lineHeight: 1.6 }}>{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Testimonials */}
      <section style={{ padding: '120px 24px', background: G, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(200,134,10,0.15) 2px, transparent 2px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: 80 }}>
            <span style={{ fontSize: 12, fontFamily: '"DM Mono", monospace', fontWeight: 600, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.15em', display: 'block', marginBottom: 16 }}>Client Stories</span>
            <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 700, color: '#fff' }}>What Our Clients Say</h2>
          </div>

          <div style={{ position: 'relative', minHeight: 320 }}>
            <AnimatePresence mode="wait">
              <motion.div key={testimonialIdx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}
                style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', borderRadius: 24, padding: '56px', border: '1px solid rgba(255,255,255,0.1)', display: 'grid', gridTemplateColumns: '1fr auto', gap: 60, alignItems: 'center' }} className="testimonial-inner">
                <div>
                  <div style={{ display: 'flex', gap: 4, marginBottom: 24 }}>
                    {[...Array(5)].map((_, i) => <Star key={i} size={18} style={{ color: ACCENT, fill: ACCENT }} />)}
                  </div>
                  <p style={{ fontSize: 'clamp(20px, 2.5vw, 26px)', color: '#fff', lineHeight: 1.6, marginBottom: 32, fontStyle: 'italic', fontFamily: '"Playfair Display", Georgia, serif' }}>"{TESTIMONIALS[testimonialIdx].quote}"</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <img src={TESTIMONIALS[testimonialIdx].avatar} alt={TESTIMONIALS[testimonialIdx].name} style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${ACCENT}` }} />
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', fontFamily: '"Playfair Display", serif', marginBottom: 4 }}>{TESTIMONIALS[testimonialIdx].name}</div>
                      <div style={{ fontSize: 13, fontFamily: '"DM Mono", monospace', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{TESTIMONIALS[testimonialIdx].role}</div>
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'center', background: 'rgba(200,134,10,0.1)', borderRadius: 20, padding: '40px', border: `1px solid rgba(200,134,10,0.3)`, minWidth: 200 }} className="metric-box">
                  <TrendingUp size={36} color={ACCENT} style={{ marginBottom: 16, marginInline: 'auto' }} />
                  <p style={{ fontSize: 14, fontFamily: '"DM Sans", sans-serif', fontWeight: 700, color: ACCENT, lineHeight: 1.5 }}>{TESTIMONIALS[testimonialIdx].metric}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 20, marginTop: 48 }}>
            <button onClick={() => setTestimonialIdx(i => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
              style={{ width: 48, height: 48, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <ChevronLeft size={20} />
            </button>
            <div style={{ display: 'flex', gap: 10 }}>
              {TESTIMONIALS.map((_, i) => (
                <button key={i} onClick={() => setTestimonialIdx(i)} style={{ width: testimonialIdx === i ? 32 : 10, height: 10, borderRadius: 100, border: 'none', background: testimonialIdx === i ? ACCENT : 'rgba(255,255,255,0.3)', cursor: 'pointer', transition: 'all 0.3s' }} />
              ))}
            </div>
            <button onClick={() => setTestimonialIdx(i => (i + 1) % TESTIMONIALS.length)}
              style={{ width: 48, height: 48, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* 9. Inspiration Gallery */}
      <section style={{ padding: '120px 24px', backgroundColor: BG }}>
        <div style={{ maxWidth: 1300, margin: '0 auto' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 56, gap: 24 }}>
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span style={{ fontSize: 12, fontFamily: '"DM Mono", monospace', fontWeight: 600, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.15em', display: 'block', marginBottom: 12 }}>Packaging in the Wild</span>
              <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 700, color: G, marginBottom: 12 }}>Packaging Inspiration</h2>
              <p style={{ fontSize: 16, fontFamily: '"DM Sans", sans-serif', color: '#6B6B6B', maxWidth: 480 }}>Real work from our customers around the world collected every week.</p>
            </motion.div>
            <Link to="/success-stories"
              style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontFamily: '"DM Sans", sans-serif', fontWeight: 700, color: G, textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = ACCENT} onMouseLeave={e => e.currentTarget.style.color = G}>
              View All <ChevronRight size={18} />
            </Link>
          </div>

          <div className="gallery-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
            {INSP_GALLERY.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6 }}
                style={{ gridRow: i === 0 ? 'span 2' : 'span 1', borderRadius: 20, overflow: 'hidden', cursor: 'pointer', position: 'relative', minHeight: i === 0 ? 400 : 250 }}
                className="group">
                <img src={item.img} alt={item.label} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }} className="group-hover:scale-105" />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%)', opacity: 0, transition: 'opacity 0.3s' }} className="group-hover:opacity-100" />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 24, transform: 'translateY(10px)', opacity: 0, transition: 'all 0.3s' }} className="group-hover:opacity-100 group-hover:translate-y-0">
                  <span style={{ fontSize: 10, fontFamily: '"DM Mono", monospace', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: ACCENT, marginBottom: 8, display: 'block' }}>{item.tag}</span>
                  <span style={{ fontSize: 20, fontFamily: '"Playfair Display", serif', fontWeight: 700, color: '#fff' }}>{item.label}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. Quick Quote CTA Strip */}
      <section style={{ padding: '80px 24px', backgroundColor: '#fff', borderTop: '1px solid #E8E4DC', borderBottom: '1px solid #E8E4DC' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 32, alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: 28, fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 700, color: G, marginBottom: 10 }}>Need a quote in under 2 minutes?</h3>
            <p style={{ fontSize: 16, fontFamily: '"DM Sans", sans-serif', color: '#6B6B6B' }}>Use our online configurator for instant pricing and no email required.</p>
          </div>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <Link to="/custom-box" style={{ padding: '16px 36px', background: G, color: '#fff', borderRadius: 12, fontWeight: 700, fontSize: 15, fontFamily: '"DM Sans", sans-serif', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10, transition: 'all 0.3s' }}
              onMouseEnter={e => { e.currentTarget.style.background = ACCENT; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseLeave={e => { e.currentTarget.style.background = G; e.currentTarget.style.transform = 'none'; }}>
              <RefreshCw size={18} /> Get Instant Quote
            </Link>
            <Link to="/contact-us" style={{ padding: '16px 36px', background: 'transparent', border: `1.5px solid ${G}`, color: G, borderRadius: 12, fontWeight: 700, fontSize: 15, fontFamily: '"DM Sans", sans-serif', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10, transition: 'all 0.3s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(26,77,46,0.05)'; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'none'; }}>
              <MessageCircle size={18} /> Talk to an Expert
            </Link>
          </div>
        </div>
      </section>

      {/* 11. Final CTA */}
      <section style={{ padding: '140px 24px', background: `linear-gradient(135deg, ${G} 0%, #0F2E1A 100%)`, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(200,134,10,0.1) 2px, transparent 2px)', backgroundSize: '32px 32px' }} />
        
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
          style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <span style={{ fontSize: 12, fontFamily: '"DM Mono", monospace', fontWeight: 600, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.15em', display: 'block', marginBottom: 20 }}>Get Started Today</span>
          <h2 style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 700, color: '#fff', marginBottom: 24, lineHeight: 1.1 }}>
            Ready to elevate your packaging?
          </h2>
          <p style={{ fontSize: 18, fontFamily: '"DM Sans", sans-serif', color: 'rgba(255,255,255,0.7)', marginBottom: 48, maxWidth: 600, margin: '0 auto 48px', lineHeight: 1.7 }}>
            Join 10,000+ brands who trust Design Custom Box for premium quality, fast delivery, and packaging that sells.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
            <Link to="/custom-box" style={{ padding: '18px 48px', background: ACCENT, color: '#fff', fontWeight: 700, fontSize: 16, fontFamily: '"DM Sans", sans-serif', borderRadius: 12, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 12, transition: 'all 0.3s', boxShadow: '0 12px 24px rgba(200,134,10,0.3)' }}
              onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.1)'; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseLeave={e => { e.currentTarget.style.filter = 'none'; e.currentTarget.style.transform = 'none'; }}>
              Request a Quote <ArrowRight size={18} />
            </Link>
          </div>
        </motion.div>
      </section>

      <style>{`
        .group:hover .group-hover\\:scale-105 { transform: scale(1.05); }
        .group:hover .group-hover\\:opacity-100 { opacity: 1; }
        .group:hover .group-hover\\:translate-y-0 { transform: translateY(0); }
        
        @media (max-width: 1024px) {
          .why-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
          .material-showcase { grid-template-columns: 1fr !important; }
          .gallery-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 900px) {
          .finishes-grid { grid-template-columns: repeat(3,1fr) !important; }
          .steps-grid { grid-template-columns: repeat(2,1fr) !important; }
          .testimonial-inner { grid-template-columns: 1fr !important; }
          .metric-box { display: none !important; }
          .features-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .finishes-grid { grid-template-columns: repeat(2,1fr) !important; }
          .steps-grid { grid-template-columns: 1fr !important; }
          .gallery-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

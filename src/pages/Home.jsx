import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Package, Truck, Star, TrendingUp, ShieldCheck, Leaf, Zap,
  Clock, Award, CheckCircle, ChevronRight, Box, Layers, Cpu, Recycle,
  Play, Users, BarChart3, Sparkles, RefreshCw, MessageCircle, ChevronLeft,
} from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

import Hero from '../components/Hero';
import TrendingProducts from '../components/TrendingProducts';
import EmpoweringBrands from '../components/EmpoweringBrands';

const G = '#1A4D2E';
const ACCENT = '#C8860A';
const BG = '#F5F2ED';

// ── Animated counter hook ────────────────────────────────────────────────────
function useCountUp(target, duration = 1800, start = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      setVal(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return val;
}

function StatNumber({ value, suffix = '', duration = 1800 }) {
  const ref = useRef(null);
  const [started, setStarted] = useState(false);
  const count = useCountUp(value, duration, started);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// ── Data ─────────────────────────────────────────────────────────────────────
const STATS = [
  { number: 500, suffix: 'K+', label: 'Boxes Delivered', icon: <Package size={22} color={ACCENT} /> },
  { number: 10000, suffix: '+', label: 'Happy Brands', icon: <Award size={22} color={ACCENT} /> },
  { number: 8, suffix: ' Days', label: 'Avg. Turnaround', icon: <Clock size={22} color={ACCENT} /> },
  { number: 99, suffix: '%', label: 'Satisfaction Rate', icon: <Star size={22} color={ACCENT} strokeWidth={1.5} /> },
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
  {
    step: '01', title: 'Select Your Box',
    desc: 'Choose from 50+ box styles, materials, and sizes in our full catalog.',
    img: 'https://images.unsplash.com/photo-1553531384-cc64ac80f931?w=600&q=80',
    time: '2 minutes',
  },
  {
    step: '02', title: 'Customize Design',
    desc: 'Use our live 3D configurator or collaborate with our design team.',
    img: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80',
    time: '5 minutes',
  },
  {
    step: '03', title: 'Review & Approve',
    desc: 'Get a digital 3D proof or request a physical sample before we print.',
    img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80',
    time: '24 hours',
  },
  {
    step: '04', title: 'Production & Delivery',
    desc: 'We manufacture and ship directly to your door in 8–10 business days.',
    img: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=600&q=80',
    time: '8–10 days',
  },
];

const TESTIMONIALS = [
  {
    name: 'Sarah Mitchell',
    role: 'Founder, Lumière Beauty',
    company: 'Lumière Beauty',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
    quote: 'NovaPack delivered our skincare boxes in 7 days with flawless matte finish, zero defects. Our customers love the unboxing experience.',
    rating: 5,
    metric: '3× increase in repeat purchases',
  },
  {
    name: 'James Kowalski',
    role: 'Ops Manager, TechShip Inc.',
    company: 'TechShip Inc.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
    quote: 'Scaled from 2,000 to 80,000 units in six months. NovaPack handled every order on time with consistent quality across all batches.',
    rating: 5,
    metric: '40× volume scale in 6 months',
  },
  {
    name: 'Priya Sharma',
    role: 'Brand Director, GreenLeaf Organics',
    company: 'GreenLeaf Organics',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&q=80',
    quote: 'The FSC-certified kraft boxes are exactly on-brand for us. Eco-friendly packaging that looks amazing on retail shelves.',
    rating: 5,
    metric: '28% reduction in packaging cost',
  },
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
  { icon: <Zap size={26} color={ACCENT} />, title: '8-Day Turnaround', desc: 'Standard orders ship in 8–10 business days. Expedited options available.' },
  { icon: <Users size={26} color={G} />, title: 'Dedicated Specialist', desc: 'A packaging expert assigned to your account from day one.' },
  { icon: <BarChart3 size={26} color={ACCENT} />, title: 'Volume Pricing', desc: 'Prices drop significantly at 500, 1,000, and 5,000+ units.' },
  { icon: <Leaf size={26} color="#2E7D32" />, title: 'Sustainable Materials', desc: 'FSC-certified board, soy inks, and 100% recyclable substrates.' },
  { icon: <Sparkles size={26} color={ACCENT} />, title: 'Free Design Support', desc: 'Our in-house designers will polish your artwork before we print.' },
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function Home() {
  const [activeMaterial, setActiveMaterial] = useState(0);
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [showVideoModal, setShowVideoModal] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 700, once: true, easing: 'ease-out-cubic' });
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const t = setInterval(() => setTestimonialIdx(i => (i + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ backgroundColor: BG }}>

      {/* ── 1. Hero ─────────────────────────────────────────────────────────── */}
      <Hero />

      {/* ── 2. Stats Bar ────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: G }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px' }}>
          <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }}>
            {STATS.map((s, i) => (
              <div key={i} data-aos="fade-up" data-aos-delay={i * 70}
                style={{
                  padding: '36px 24px', textAlign: 'center',
                  borderRight: i < STATS.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none',
                }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>{s.icon}</div>
                <div style={{ fontSize: 34, fontWeight: 900, color: '#fff', fontFamily: 'Outfit,sans-serif', lineHeight: 1 }}>
                  <StatNumber value={s.number} suffix={s.suffix} />
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', marginTop: 8, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Trending Products ─────────────────────────────────────────────── */}
      <TrendingProducts />

      {/* ── 4. Materials — Interactive Showcase ─────────────────────────────── */}
      <section style={{ padding: '100px 24px', backgroundColor: '#fff' }}>
        <div style={{ maxWidth: 1300, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }} data-aos="fade-up">
            <span style={{ fontSize: 11, fontWeight: 700, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.14em', display: 'block', marginBottom: 12 }}>Built to Spec</span>
            <h2 style={{ fontSize: 'clamp(28px,3.5vw,44px)', fontFamily: 'Outfit,sans-serif', fontWeight: 800, color: '#1A1A1A', marginBottom: 14 }}>Premium Materials &amp; Finishes</h2>
            <p style={{ fontSize: 16, color: '#666', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
              Four core substrates, each optimised for different industries and price points.
            </p>
          </div>

          {/* Material Tabs */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 36, flexWrap: 'wrap' }} data-aos="fade-up">
            {MATERIALS.map((m, i) => (
              <button key={i} onClick={() => setActiveMaterial(i)}
                style={{
                  padding: '10px 22px', borderRadius: 100, border: `2px solid ${activeMaterial === i ? G : '#E8E4DC'}`,
                  background: activeMaterial === i ? G : '#fff', color: activeMaterial === i ? '#fff' : '#555',
                  fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'Outfit,sans-serif',
                }}>
                {m.name}
              </button>
            ))}
          </div>

          {/* Active Material Showcase */}
          <div data-aos="fade-up" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, borderRadius: 20, overflow: 'hidden', border: '1px solid #E8E4DC', boxShadow: '0 20px 60px rgba(0,0,0,0.08)' }} className="material-showcase">
            <div style={{ overflow: 'hidden', minHeight: 380 }}>
              <img
                key={activeMaterial}
                src={MATERIALS[activeMaterial].img}
                alt={MATERIALS[activeMaterial].name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'opacity 0.4s', animation: 'fadeIn 0.4s ease' }}
                onError={e => { e.target.src = 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80'; }}
              />
            </div>
            <div style={{ padding: '52px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: BG }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 14px', background: MATERIALS[activeMaterial].badgeColor, color: '#fff', borderRadius: 100, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 20, width: 'fit-content' }}>
                {MATERIALS[activeMaterial].badge}
              </span>
              <h3 style={{ fontSize: 32, fontFamily: 'Outfit,sans-serif', fontWeight: 800, color: '#1A1A1A', marginBottom: 16 }}>{MATERIALS[activeMaterial].name}</h3>
              <p style={{ fontSize: 16, color: '#666', lineHeight: 1.75, marginBottom: 28 }}>{MATERIALS[activeMaterial].desc}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28, padding: '14px 20px', background: '#fff', borderRadius: 10, border: `1px solid ${G}20` }}>
                <CheckCircle size={18} color={G} />
                <span style={{ fontSize: 14, fontWeight: 600, color: G }}>{MATERIALS[activeMaterial].highlight}</span>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 36 }}>
                {MATERIALS[activeMaterial].usedFor.map(u => (
                  <span key={u} style={{ fontSize: 11, fontWeight: 700, padding: '5px 12px', borderRadius: 6, background: `${G}14`, color: G, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{u}</span>
                ))}
              </div>
              <Link to="/custom-box" state={{ material: MATERIALS[activeMaterial].name }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '14px 28px', background: G, color: '#fff', borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: 'none', width: 'fit-content', transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = ACCENT}
                onMouseLeave={e => e.currentTarget.style.background = G}>
                Configure with {MATERIALS[activeMaterial].name} <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* Finishes Strip */}
          <div style={{ background: BG, borderRadius: 16, border: '1px solid #E8E4DC', padding: '36px 40px', marginTop: 24 }} data-aos="fade-up">
            <p style={{ fontSize: 11, fontWeight: 700, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 28, textAlign: 'center' }}>Available Finishes</p>
            <div className="finishes-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 16 }}>
              {FINISHES.map((f, i) => (
                <div key={i}
                  style={{ textAlign: 'center', padding: '18px 12px', borderRadius: 12, background: '#fff', border: '1px solid #E8E4DC', cursor: 'default', transition: 'transform 0.2s, box-shadow 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10, width: 48, height: 48, borderRadius: '50%', background: f.color, alignItems: 'center', margin: '0 auto 12px' }}>{f.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#1A1A1A', marginBottom: 5, fontFamily: 'Outfit,sans-serif' }}>{f.name}</div>
                  <div style={{ fontSize: 11, color: '#888', lineHeight: 1.4 }}>{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Why NovaPack ─────────────────────────────────────────────────── */}
      <section style={{ padding: '100px 24px', backgroundColor: BG }}>
        <div style={{ maxWidth: 1300, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }} className="why-grid">
            <div data-aos="fade-right">
              <span style={{ fontSize: 11, fontWeight: 700, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.14em', display: 'block', marginBottom: 16 }}>The NovaPack Difference</span>
              <h2 style={{ fontSize: 'clamp(28px,3.5vw,44px)', fontFamily: 'Outfit,sans-serif', fontWeight: 800, color: '#1A1A1A', lineHeight: 1.15, marginBottom: 20 }}>
                Why 10,000+ brands choose us
              </h2>
              <p style={{ fontSize: 16, color: '#666', lineHeight: 1.8, marginBottom: 36 }}>
                From startup brands to enterprise operations, NovaPack delivers custom packaging with the speed, quality, and service that modern businesses demand.
              </p>
              <div style={{ display: 'flex', gap: 16, marginBottom: 40 }}>
                <div style={{ padding: '20px 24px', background: '#fff', borderRadius: 14, border: `2px solid ${G}20`, flex: 1, textAlign: 'center' }}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: G, fontFamily: 'Outfit,sans-serif' }}>100</div>
                  <div style={{ fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, marginTop: 4 }}>Min. Order</div>
                </div>
                <div style={{ padding: '20px 24px', background: '#fff', borderRadius: 14, border: `2px solid ${ACCENT}20`, flex: 1, textAlign: 'center' }}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: ACCENT, fontFamily: 'Outfit,sans-serif' }}>Free</div>
                  <div style={{ fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, marginTop: 4 }}>Design Help</div>
                </div>
                <div style={{ padding: '20px 24px', background: '#fff', borderRadius: 14, border: `2px solid ${G}20`, flex: 1, textAlign: 'center' }}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: G, fontFamily: 'Outfit,sans-serif' }}>8</div>
                  <div style={{ fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, marginTop: 4 }}>Days Ship</div>
                </div>
              </div>
              <Link to="/about"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 28px', background: G, color: '#fff', borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: 'none', transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = ACCENT}
                onMouseLeave={e => e.currentTarget.style.background = G}>
                Learn Our Story <ArrowRight size={16} />
              </Link>
            </div>

            <div data-aos="fade-left">
              <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16 }}>
                {FEATURES.map((f, i) => (
                  <div key={i}
                    style={{ padding: '24px', background: '#fff', borderRadius: 14, border: '1px solid #E8E4DC', transition: 'transform 0.2s, box-shadow 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.08)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
                    <div style={{ marginBottom: 12 }}>{f.icon}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#1A1A1A', fontFamily: 'Outfit,sans-serif', marginBottom: 6 }}>{f.title}</div>
                    <div style={{ fontSize: 12, color: '#777', lineHeight: 1.6 }}>{f.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. Industries ────────────────────────────────────────────────────── */}
      <EmpoweringBrands />

      {/* ── 7. How It Works ──────────────────────────────────────────────────── */}
      <section style={{ padding: '100px 24px', backgroundColor: '#fff' }}>
        <div style={{ maxWidth: 1300, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }} data-aos="fade-up">
            <span style={{ fontSize: 11, fontWeight: 700, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.14em', display: 'block', marginBottom: 12 }}>Simple Process</span>
            <h2 style={{ fontSize: 'clamp(28px,3.5vw,44px)', fontFamily: 'Outfit,sans-serif', fontWeight: 800, color: '#1A1A1A', marginBottom: 14 }}>From Idea to Doorstep</h2>
            <p style={{ fontSize: 16, color: '#666', maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
              Four simple steps to get professional custom packaging delivered to you.
            </p>
          </div>

          <div className="steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24, position: 'relative' }}>
            <div style={{ position: 'absolute', top: 52, left: '12%', right: '12%', height: 2, background: `linear-gradient(90deg, transparent, ${ACCENT}50, ${ACCENT}, ${ACCENT}50, transparent)` }} className="step-line" />
            {STEPS.map((s, idx) => (
              <div key={idx} data-aos="fade-up" data-aos-delay={idx * 110}
                style={{ background: '#fff', borderRadius: 18, overflow: 'hidden', border: '1px solid #E8E4DC', position: 'relative', zIndex: 1, transition: 'box-shadow 0.25s, transform 0.25s', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 20px 48px rgba(0,0,0,0.12)'; e.currentTarget.style.transform = 'translateY(-8px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'none'; }}>
                <div style={{ height: 150, overflow: 'hidden', position: 'relative' }}>
                  <img src={s.img} alt={s.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.5s' }}
                    onMouseEnter={e => e.target.style.transform = 'scale(1.07)'} onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                    onError={e => { e.target.src = 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80'; }} />
                  <div style={{ position: 'absolute', top: 12, left: 12, width: 40, height: 40, borderRadius: '50%', background: ACCENT, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, fontFamily: 'Outfit,sans-serif', boxShadow: '0 4px 12px rgba(200,134,10,0.4)' }}>{s.step}</div>
                  <div style={{ position: 'absolute', bottom: 10, right: 10, padding: '4px 10px', background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', borderRadius: 100, fontSize: 10, fontWeight: 700, color: '#fff' }}>{s.time}</div>
                </div>
                <div style={{ padding: '22px 24px 28px' }}>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: '#1A1A1A', marginBottom: 10, fontFamily: 'Outfit,sans-serif' }}>{s.title}</h3>
                  <p style={{ fontSize: 13, color: '#777', lineHeight: 1.65 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 52 }} data-aos="fade-up">
            <Link to="/custom-box"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '16px 36px', background: G, color: '#fff', borderRadius: 10, fontWeight: 700, textDecoration: 'none', fontSize: 15, fontFamily: 'Outfit,sans-serif', transition: 'background 0.15s, transform 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = ACCENT; e.currentTarget.style.transform = 'scale(1.03)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = G; e.currentTarget.style.transform = 'scale(1)'; }}>
              Start Designing Free <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 8. Testimonials — Slider ─────────────────────────────────────────── */}
      <section style={{ padding: '100px 24px', background: `linear-gradient(135deg, ${G} 0%, #0D3520 100%)`, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)', backgroundSize: '32px 32px', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }} data-aos="fade-up">
            <span style={{ fontSize: 11, fontWeight: 700, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.14em', display: 'block', marginBottom: 12 }}>Client Stories</span>
            <h2 style={{ fontSize: 'clamp(28px,3.5vw,44px)', fontFamily: 'Outfit,sans-serif', fontWeight: 800, color: '#fff' }}>What Our Clients Say</h2>
          </div>

          {/* Featured testimonial */}
          <div style={{ position: 'relative', minHeight: 280 }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i}
                style={{
                  position: i === 0 ? 'relative' : 'absolute', top: 0, left: 0, right: 0,
                  opacity: testimonialIdx === i ? 1 : 0,
                  transform: testimonialIdx === i ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'opacity 0.5s ease, transform 0.5s ease',
                  pointerEvents: testimonialIdx === i ? 'auto' : 'none',
                }}>
                <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 20, padding: '44px 52px', border: '1px solid rgba(255,255,255,0.1)', display: 'grid', gridTemplateColumns: '1fr auto', gap: 40, alignItems: 'center' }} className="testimonial-inner">
                  <div>
                    <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
                      {Array.from({ length: t.rating }).map((_, si) => (
                        <Star key={si} size={16} style={{ color: ACCENT, fill: ACCENT }} />
                      ))}
                    </div>
                    <p style={{ fontSize: 20, color: 'rgba(255,255,255,0.92)', lineHeight: 1.7, marginBottom: 28, fontStyle: 'italic', fontFamily: 'Outfit,sans-serif' }}>"{t.quote}"</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <img src={t.avatar} alt={t.name}
                        style={{ width: 54, height: 54, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${ACCENT}` }}
                        onError={e => { e.target.style.display = 'none'; }} />
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', fontFamily: 'Outfit,sans-serif' }}>{t.name}</div>
                        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 3 }}>{t.role}</div>
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'center', background: 'rgba(200,134,10,0.15)', borderRadius: 14, padding: '28px 32px', border: `1px solid ${ACCENT}30`, minWidth: 160 }} className="metric-box">
                    <TrendingUp size={28} color={ACCENT} style={{ marginBottom: 12 }} />
                    <p style={{ fontSize: 12, fontWeight: 700, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.08em', lineHeight: 1.5 }}>{t.metric}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dots + Nav */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, marginTop: 40 }}>
            <button onClick={() => setTestimonialIdx(i => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
              style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', transition: 'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <ChevronLeft size={18} />
            </button>
            <div style={{ display: 'flex', gap: 8 }}>
              {TESTIMONIALS.map((_, i) => (
                <button key={i} onClick={() => setTestimonialIdx(i)}
                  style={{ width: testimonialIdx === i ? 24 : 8, height: 8, borderRadius: 100, border: 'none', background: testimonialIdx === i ? ACCENT : 'rgba(255,255,255,0.3)', cursor: 'pointer', transition: 'all 0.3s' }} />
              ))}
            </div>
            <button onClick={() => setTestimonialIdx(i => (i + 1) % TESTIMONIALS.length)}
              style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', transition: 'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* ── 9. Inspiration Gallery ───────────────────────────────────────────── */}
      <section style={{ padding: '100px 24px', backgroundColor: '#fff' }}>
        <div style={{ maxWidth: 1300, margin: '0 auto' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 40, gap: 16 }} data-aos="fade-up">
            <div>
              <span style={{ fontSize: 11, fontWeight: 700, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.14em', display: 'block', marginBottom: 10 }}>Packaging in the Wild</span>
              <h2 style={{ fontSize: 'clamp(26px,3vw,40px)', fontFamily: 'Outfit,sans-serif', fontWeight: 800, color: '#1A1A1A', marginBottom: 8 }}>Packaging Inspiration</h2>
              <p style={{ fontSize: 14, color: '#777', maxWidth: 420 }}>Real work from our customers around the world collected every week.</p>
            </div>
            <Link to="/success-stories"
              style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: G, textDecoration: 'none', transition: 'color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.color = ACCENT} onMouseLeave={e => e.currentTarget.style.color = G}>
              View All <ChevronRight size={16} />
            </Link>
          </div>

          <div className="gallery-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
            {/* Large featured image */}
            <div style={{ gridRow: 'span 2', borderRadius: 16, overflow: 'hidden', cursor: 'pointer', position: 'relative', minHeight: 340 }}
              data-aos="zoom-in"
              onMouseEnter={e => { e.currentTarget.querySelector('img').style.transform = 'scale(1.06)'; e.currentTarget.querySelector('.overlay').style.opacity = '1'; }}
              onMouseLeave={e => { e.currentTarget.querySelector('img').style.transform = 'scale(1)'; e.currentTarget.querySelector('.overlay').style.opacity = '0'; }}>
              <img src={INSP_GALLERY[0].img} alt={INSP_GALLERY[0].label} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.6s ease' }}
                onError={e => { e.target.src = 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80'; }} />
              <div className="overlay" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)', opacity: 0, transition: 'opacity 0.3s', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 24 }}>
                <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: ACCENT, marginBottom: 6 }}>{INSP_GALLERY[0].tag}</span>
                <span style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>{INSP_GALLERY[0].label}</span>
              </div>
            </div>
            {INSP_GALLERY.slice(1).map((item, i) => (
              <div key={i} style={{ borderRadius: 16, overflow: 'hidden', cursor: 'pointer', position: 'relative', aspectRatio: '4/3' }}
                data-aos="zoom-in" data-aos-delay={(i + 1) * 70}
                onMouseEnter={e => { e.currentTarget.querySelector('img').style.transform = 'scale(1.06)'; e.currentTarget.querySelector('.overlay').style.opacity = '1'; }}
                onMouseLeave={e => { e.currentTarget.querySelector('img').style.transform = 'scale(1)'; e.currentTarget.querySelector('.overlay').style.opacity = '0'; }}>
                <img src={item.img} alt={item.label} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.6s ease' }}
                  onError={e => { e.target.src = 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80'; }} />
                <div className="overlay" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 60%)', opacity: 0, transition: 'opacity 0.3s', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 18 }}>
                  <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: ACCENT, marginBottom: 4 }}>{item.tag}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{item.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 10. Get a Quick Quote CTA Strip ────────────────────────────────────── */}
      <section style={{ padding: '60px 24px', backgroundColor: BG, borderTop: '1px solid #E8E4DC' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center', justifyContent: 'space-between' }} data-aos="fade-up">
          <div>
            <h3 style={{ fontSize: 24, fontFamily: 'Outfit,sans-serif', fontWeight: 800, color: '#1A1A1A', marginBottom: 6 }}>Need a quote in under 2 minutes?</h3>
            <p style={{ fontSize: 14, color: '#777' }}>Use our online configurator for instant pricing and no email required.</p>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <Link to="/custom-box"
              style={{ padding: '14px 32px', background: G, color: '#fff', borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = ACCENT}
              onMouseLeave={e => e.currentTarget.style.background = G}>
              <RefreshCw size={16} /> Get Instant Quote
            </Link>
            <Link to="/contact-us"
              style={{ padding: '14px 28px', background: 'transparent', border: `2px solid ${G}`, color: G, borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = G; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = G; }}>
              <MessageCircle size={16} /> Talk to an Expert
            </Link>
          </div>
        </div>
      </section>

      {/* ── 11. Trust Strip ─────────────────────────────────────────────────── */}
      <section style={{ padding: '32px 24px', backgroundColor: '#fff', borderTop: '1px solid #E8E4DC', borderBottom: '1px solid #E8E4DC' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px 44px', alignItems: 'center' }}>
            {[
              { icon: <ShieldCheck size={17} color={G} />, label: '100% Quality Guarantee' },
              { icon: <Leaf size={17} color="#2E7D32" />, label: 'FSC-Certified Materials' },
              { icon: <Truck size={17} color={ACCENT} />, label: 'Free Shipping on 500+' },
              { icon: <Zap size={17} color={ACCENT} />, label: '8–10 Day Turnaround' },
              { icon: <Recycle size={17} color="#2E7D32" />, label: '100% Recyclable Options' },
              { icon: <CheckCircle size={17} color={G} />, label: 'Free Digital Proof' },
            ].map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {b.icon}
                <span style={{ fontSize: 13, fontWeight: 600, color: '#3A3A3A' }}>{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 12. Final CTA ────────────────────────────────────────────────────── */}
      <section style={{ padding: '110px 24px', background: `linear-gradient(135deg, ${G} 0%, #0F2E1A 100%)`, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(200,134,10,0.06) 1.5px, transparent 1.5px)', backgroundSize: '28px 28px', pointerEvents: 'none' }} />
        {/* Floating decorative shapes */}
        <div style={{ position: 'absolute', top: '15%', left: '8%', width: 200, height: 200, borderRadius: '50%', border: `1px solid rgba(200,134,10,0.1)`, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '6%', width: 140, height: 140, borderRadius: '50%', border: `1px solid rgba(255,255,255,0.06)`, pointerEvents: 'none' }} />

        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }} data-aos="fade-up">
          <span style={{ fontSize: 11, fontWeight: 700, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.14em', display: 'block', marginBottom: 16 }}>Get Started Today</span>
          <h2 style={{ fontSize: 'clamp(30px,4vw,52px)', fontFamily: 'Outfit,sans-serif', fontWeight: 800, color: '#fff', marginBottom: 20, lineHeight: 1.12 }}>
            Ready to elevate your packaging?
          </h2>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.62)', marginBottom: 44, maxWidth: 500, margin: '0 auto 44px', lineHeight: 1.75 }}>
            Join 10,000+ brands who trust NovaPack for consistent quality, fast delivery, and packaging that sells.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
            <Link to="/custom-box"
              style={{ padding: '17px 40px', background: ACCENT, color: '#fff', fontWeight: 700, fontSize: 15, borderRadius: 10, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10, transition: 'filter 0.15s, transform 0.15s', boxShadow: '0 8px 24px rgba(200,134,10,0.35)' }}
              onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.12)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.filter = 'none'; e.currentTarget.style.transform = 'none'; }}>
              Request a Quote <ArrowRight size={16} />
            </Link>
            <Link to="/contact-us"
              style={{ padding: '17px 36px', background: 'transparent', border: '1.5px solid rgba(255,255,255,0.3)', color: '#fff', fontWeight: 700, fontSize: 15, borderRadius: 10, textDecoration: 'none', transition: 'background 0.15s, border-color 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.6)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; }}>
              Contact Sales
            </Link>
          </div>
          <div style={{ display: 'flex', gap: 32, justifyContent: 'center', marginTop: 44, flexWrap: 'wrap' }}>
            {[<><CheckCircle size={14} /> No minimum commitment</>, <><CheckCircle size={14} /> Free design review</>, <><CheckCircle size={14} /> Ship in 8 days</>].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'rgba(255,255,255,0.55)', fontWeight: 600 }}>{item}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {showVideoModal && (
        <div onClick={() => setShowVideoModal(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#000', borderRadius: 12, overflow: 'hidden', width: 'min(90vw, 800px)', aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ color: '#fff', textAlign: 'center' }}>
              <Play size={48} style={{ marginBottom: 16, color: ACCENT }} />
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>Click anywhere to close</p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @media (max-width: 1024px) {
          .why-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
          .material-showcase { grid-template-columns: 1fr !important; }
          .gallery-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 900px) {
          .stats-grid { grid-template-columns: repeat(2,1fr) !important; }
          .finishes-grid { grid-template-columns: repeat(3,1fr) !important; }
          .steps-grid { grid-template-columns: repeat(2,1fr) !important; }
          .step-line { display: none !important; }
          .testimonial-inner { grid-template-columns: 1fr !important; }
          .metric-box { display: none !important; }
          .features-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .stats-grid { grid-template-columns: repeat(2,1fr) !important; }
          .finishes-grid { grid-template-columns: repeat(2,1fr) !important; }
          .steps-grid { grid-template-columns: 1fr !important; }
          .gallery-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, CheckCircle, Award, Users, TrendingUp, Globe, ShieldCheck,
  Leaf, Clock, ChevronRight, Package, Star,
} from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const G = '#1A4D2E';
const ACCENT = '#C8860A';
const BG = '#F5F2ED';

function CountUp({ target, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); }, { threshold: 0.4 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let current = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, 16);
    return () => clearInterval(timer);
  }, [started, target, duration]);

  return <span ref={ref}>{count >= target ? target.toLocaleString() + suffix : count.toLocaleString() + suffix}</span>;
}

const TEAM = [
  { name: 'James Carter', title: 'Chief Executive Officer', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80', bio: 'Visionary leader with 15+ years in packaging and manufacturing.' },
  { name: 'Sarah Mitchell', title: 'Chief Operating Officer', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80', bio: 'Operations expert driving efficiency across all production lines.' },
  { name: 'Tom Reynolds', title: 'Head of Design', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80', bio: 'Award-winning designer with 12 years of brand storytelling experience.' },
  { name: 'Aisha Johnson', title: 'Head of Operations', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80', bio: 'Supply chain specialist ensuring every order ships on time.' },
];

const CERTS = ['FSC Certified', 'ISO 9001', 'SGP Member', 'Eco-Friendly Alliance', 'ISTA Certified'];

const PROCESS = [
  { num: '01', title: 'Configure', desc: 'Use our online 3D configurator to set your box type, material, dimensions, and print specs.', img: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&q=80' },
  { num: '02', title: 'Proof', desc: 'Receive a free digital proof within 24 hours. Request physical samples if needed.', img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&q=80' },
  { num: '03', title: 'Production', desc: 'Expert craftspeople print and assemble your boxes with precision quality control.', img: 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=500&q=80' },
  { num: '04', title: 'Quality Check', desc: 'Every batch passes our 12-point quality inspection before it ever leaves the facility.', img: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=500&q=80' },
  { num: '05', title: 'Delivery', desc: 'Fast-tracked shipping delivers directly to your door or warehouse in 8–10 business days.', img: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=500&q=80' },
];

const VALUES = [
  { icon: <ShieldCheck size={24} color={G} />, title: 'Precision', desc: 'Every dimension, color, and finish is produced to exact specifications — no exceptions.' },
  { icon: <Leaf size={24} color="#2E7D32" />, title: 'Sustainability', desc: 'FSC-certified materials, soy-based inks, and a commitment to zero-landfill production.' },
  { icon: <Clock size={24} color={ACCENT} />, title: 'Speed', desc: '8–10 day standard turnaround with rush options available — because your launch dates matter.' },
  { icon: <Users size={24} color={G} />, title: 'Partnership', desc: 'Dedicated account managers for every client, from first order to 1 million units.' },
  { icon: <Award size={24} color={ACCENT} />, title: 'Excellence', desc: 'Industry-leading print quality backed by a 100% satisfaction guarantee on every order.' },
  { icon: <Globe size={24} color={G} />, title: 'Reach', desc: 'Shipping to 40+ countries with a global logistics network that scales with your brand.' },
];

export default function About() {
  useEffect(() => {
    AOS.init({ duration: 700, once: true, easing: 'ease-out-cubic' });
  }, []);

  return (
    <div style={{ backgroundColor: BG, minHeight: '100vh' }}>

      {/* 1 — Hero */}
      <section style={{ position: 'relative', minHeight: 560, display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <img
          src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1600&q=75"
          alt="NovaPack facility"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(20,60,36,0.90) 40%, rgba(20,60,36,0.40) 100%)' }} />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 1400, margin: '0 auto', padding: '120px 24px 80px', width: '100%' }}>
          <div style={{ maxWidth: 640 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <Link to="/" style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', textDecoration: 'none', transition: 'color 0.15s' }}
                onMouseEnter={e => e.target.style.color = '#fff'} onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.55)'}>Home</Link>
              <ChevronRight size={14} color="rgba(255,255,255,0.4)" />
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>About Us</span>
            </div>
            <p style={{ fontSize: 12, fontWeight: 700, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: 16 }}>Our Story</p>
            <h1 style={{ fontSize: 'clamp(36px,5vw,60px)', fontFamily: 'Outfit,sans-serif', fontWeight: 800, color: '#fff', lineHeight: 1.08, marginBottom: 22 }}>
              Built on Craft.<br />Driven by Brand.
            </h1>
            <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.75)', lineHeight: 1.75, maxWidth: 520, marginBottom: 36 }}>
              Since 2010, NovaPack has helped over 10,000 brands create packaging that makes a lasting first impression — from independent startups to Fortune 500 companies.
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <Link to="/custom-box"
                style={{ padding: '14px 28px', background: ACCENT, color: '#fff', borderRadius: 10, fontWeight: 700, textDecoration: 'none', fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'filter 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.1)'}
                onMouseLeave={e => e.currentTarget.style.filter = 'none'}>
                Get a Quote <ArrowRight size={15} />
              </Link>
              <Link to="/contact-us"
                style={{ padding: '14px 28px', background: 'rgba(255,255,255,0.12)', color: '#fff', borderRadius: 10, fontWeight: 700, textDecoration: 'none', fontSize: 14, border: '1px solid rgba(255,255,255,0.25)', transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}>
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2 — Stats Strip */}
      <section style={{ background: '#fff', borderBottom: '1px solid #E8E4DC' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }} className="about-stats">
            {[
              { value: <><CountUp target={500} suffix="K+" /></>, label: 'Boxes Shipped', icon: <Package size={20} color={ACCENT} /> },
              { value: <><CountUp target={10} suffix="K+" /></>, label: 'Happy Clients', icon: <Users size={20} color={ACCENT} /> },
              { value: <><CountUp target={30} suffix="+" /></>, label: 'Industries Served', icon: <Globe size={20} color={ACCENT} /> },
              { value: <><CountUp target={98} suffix="%" /></>, label: 'On-Time Rate', icon: <TrendingUp size={20} color={ACCENT} /> },
            ].map((s, i) => (
              <div key={i} style={{ padding: '36px 24px', textAlign: 'center', borderRight: i < 3 ? '1px solid #E8E4DC' : 'none' }} data-aos="fade-up" data-aos-delay={i * 60}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>{s.icon}</div>
                <div style={{ fontSize: 36, fontWeight: 900, color: G, fontFamily: 'Outfit,sans-serif', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 12, color: '#888', marginTop: 8, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3 — Our Story */}
      <section style={{ padding: '96px 24px', backgroundColor: BG }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }} className="story-grid">
            <div data-aos="fade-right">
              <div style={{ borderRadius: 20, overflow: 'hidden', position: 'relative', boxShadow: '0 24px 60px rgba(0,0,0,0.12)' }}>
                <img
                  src="https://images.unsplash.com/photo-1553481187-be93c21490a9?w=800&q=80"
                  alt="NovaPack warehouse"
                  style={{ width: '100%', height: 500, objectFit: 'cover', display: 'block' }}
                />
                <div style={{ position: 'absolute', bottom: 24, left: 24, background: G, borderRadius: 12, padding: '16px 22px' }}>
                  <div style={{ fontSize: 26, fontWeight: 800, color: '#fff', fontFamily: 'Outfit,sans-serif' }}>Est. 2010</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', marginTop: 2 }}>Chicago, Illinois</div>
                </div>
              </div>
            </div>
            <div data-aos="fade-left">
              <p style={{ fontSize: 11, fontWeight: 700, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 16 }}>Our Story</p>
              <h2 style={{ fontSize: 'clamp(28px,3vw,42px)', fontFamily: 'Outfit,sans-serif', fontWeight: 800, color: G, marginBottom: 28, lineHeight: 1.15 }}>From Small Shop to Industry Leader</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {[
                  'Founded in 2010, NovaPack grew from a small print shop in Chicago to one of North America\'s leading custom packaging companies — shipping over 500,000 boxes annually across 30+ industries.',
                  'What started as a passion for beautiful, functional packaging has evolved into a comprehensive digital platform that empowers brands of all sizes, from solo entrepreneurs to Fortune 500 companies.',
                  'Today, we combine cutting-edge 3D design tools, sustainably sourced materials, and an expert team of designers and engineers to deliver packaging solutions that tell your brand\'s unique story.',
                ].map((p, i) => (
                  <p key={i} style={{ fontSize: 15, color: '#4A4A4A', lineHeight: 1.8 }}>{p}</p>
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 28 }}>
                {['Free digital 3D proof on every order', 'Dedicated account manager from day one', 'FSC-certified and eco-friendly material options'].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <CheckCircle size={16} color={G} strokeWidth={2.5} />
                    <span style={{ fontSize: 14, color: '#3A3A3A', fontWeight: 500 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 — Mission / Vision / Values */}
      <section style={{ padding: '96px 24px', backgroundColor: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }} data-aos="fade-up">
            <p style={{ fontSize: 11, fontWeight: 700, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 12 }}>What Drives Us</p>
            <h2 style={{ fontSize: 'clamp(28px,3vw,42px)', fontFamily: 'Outfit,sans-serif', fontWeight: 800, color: G }}>Mission, Vision &amp; Values</h2>
          </div>

          {/* Mission / Vision */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, marginBottom: 60 }} className="mv-grid">
            {[
              {
                label: 'Our Mission',
                title: 'Packaging that makes a lasting impression',
                desc: 'To empower every brand — from startup to enterprise — with custom packaging that creates a powerful first impression. We believe great packaging is the first handshake between a brand and its customer.',
                img: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=700&q=80',
              },
              {
                label: 'Our Vision',
                title: 'Every unboxing should be an experience',
                desc: 'A world where every unboxing moment is an experience, not just a transaction. We envision packaging as the most powerful marketing touchpoint in a brand\'s arsenal — one that turns customers into advocates.',
                img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=700&q=80',
              },
            ].map((c, i) => (
              <div key={i} data-aos="fade-up" data-aos-delay={i * 100}
                style={{ borderRadius: 20, overflow: 'hidden', border: '1px solid #E8E4DC', position: 'relative' }}>
                <div style={{ height: 220, overflow: 'hidden' }}>
                  <img src={c.img} alt={c.label} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.6s' }}
                    onMouseEnter={e => e.target.style.transform = 'scale(1.05)'} onMouseLeave={e => e.target.style.transform = 'scale(1)'} />
                </div>
                <div style={{ padding: '28px 32px 32px' }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 10 }}>{c.label}</p>
                  <h3 style={{ fontSize: 20, fontWeight: 700, color: G, fontFamily: 'Outfit,sans-serif', marginBottom: 14, lineHeight: 1.25 }}>{c.title}</h3>
                  <p style={{ fontSize: 14, color: '#555', lineHeight: 1.75 }}>{c.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Values grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }} className="values-grid">
            {VALUES.map((v, i) => (
              <div key={i} data-aos="fade-up" data-aos-delay={i * 60}
                style={{ padding: '28px', borderRadius: 14, border: '1px solid #E8E4DC', background: BG, transition: 'box-shadow 0.2s, transform 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: '#fff', border: '1px solid #E8E4DC', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>{v.icon}</div>
                <h4 style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A', fontFamily: 'Outfit,sans-serif', marginBottom: 10 }}>{v.title}</h4>
                <p style={{ fontSize: 13, color: '#666', lineHeight: 1.7 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5 — Team */}
      <section style={{ padding: '96px 24px', backgroundColor: BG }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }} data-aos="fade-up">
            <p style={{ fontSize: 11, fontWeight: 700, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 12 }}>The People Behind NovaPack</p>
            <h2 style={{ fontSize: 'clamp(28px,3vw,42px)', fontFamily: 'Outfit,sans-serif', fontWeight: 800, color: G }}>Meet the Leadership Team</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 28 }} className="team-grid">
            {TEAM.map((m, i) => (
              <div key={i} data-aos="fade-up" data-aos-delay={i * 80}
                style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', border: '1px solid #E8E4DC', transition: 'box-shadow 0.2s, transform 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.10)'; e.currentTarget.style.transform = 'translateY(-6px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}>
                <div style={{ height: 220, overflow: 'hidden' }}>
                  <img src={m.img} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block', transition: 'transform 0.5s' }}
                    onMouseEnter={e => e.target.style.transform = 'scale(1.05)'} onMouseLeave={e => e.target.style.transform = 'scale(1)'} />
                </div>
                <div style={{ padding: '20px 22px 24px' }}>
                  <h3 style={{ fontSize: 16, fontFamily: 'Outfit,sans-serif', fontWeight: 700, color: '#1A1A1A', marginBottom: 4 }}>{m.name}</h3>
                  <p style={{ fontSize: 11, color: ACCENT, fontWeight: 700, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{m.title}</p>
                  <p style={{ fontSize: 13, color: '#666', lineHeight: 1.65 }}>{m.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6 — Our Process */}
      <section style={{ padding: '96px 24px', backgroundColor: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }} data-aos="fade-up">
            <p style={{ fontSize: 11, fontWeight: 700, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 12 }}>How We Work</p>
            <h2 style={{ fontSize: 'clamp(28px,3vw,42px)', fontFamily: 'Outfit,sans-serif', fontWeight: 800, color: G }}>Our Production Process</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {PROCESS.map((s, i) => (
              <div key={i} data-aos={i % 2 === 0 ? 'fade-right' : 'fade-left'}
                style={{ display: 'grid', gridTemplateColumns: i % 2 === 0 ? '1fr 1.4fr' : '1.4fr 1fr', gap: 48, alignItems: 'center', background: BG, borderRadius: 20, overflow: 'hidden', border: '1px solid #E8E4DC' }}
                className="process-row">
                {i % 2 !== 0 && (
                  <div style={{ padding: '40px 48px' }}>
                    <div style={{ fontSize: 48, fontWeight: 900, color: `${ACCENT}20`, fontFamily: 'Outfit,sans-serif', lineHeight: 1, marginBottom: 8 }}>{s.num}</div>
                    <h3 style={{ fontSize: 22, fontWeight: 700, color: G, fontFamily: 'Outfit,sans-serif', marginBottom: 14 }}>{s.title}</h3>
                    <p style={{ fontSize: 15, color: '#555', lineHeight: 1.75 }}>{s.desc}</p>
                  </div>
                )}
                <div style={{ height: 280, overflow: 'hidden' }}>
                  <img src={s.img} alt={s.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.6s' }}
                    onMouseEnter={e => e.target.style.transform = 'scale(1.06)'} onMouseLeave={e => e.target.style.transform = 'scale(1)'} />
                </div>
                {i % 2 === 0 && (
                  <div style={{ padding: '40px 48px' }}>
                    <div style={{ fontSize: 48, fontWeight: 900, color: `${ACCENT}20`, fontFamily: 'Outfit,sans-serif', lineHeight: 1, marginBottom: 8 }}>{s.num}</div>
                    <h3 style={{ fontSize: 22, fontWeight: 700, color: G, fontFamily: 'Outfit,sans-serif', marginBottom: 14 }}>{s.title}</h3>
                    <p style={{ fontSize: 15, color: '#555', lineHeight: 1.75 }}>{s.desc}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7 — Certifications */}
      <section style={{ padding: '96px 24px', backgroundColor: BG }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }} data-aos="fade-up">
            <p style={{ fontSize: 11, fontWeight: 700, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 12 }}>Credentials</p>
            <h2 style={{ fontSize: 'clamp(28px,3vw,42px)', fontFamily: 'Outfit,sans-serif', fontWeight: 800, color: G }}>Trusted &amp; Certified</h2>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 56 }}>
            {CERTS.map(cert => (
              <div key={cert} data-aos="zoom-in"
                style={{ padding: '14px 24px', border: `2px solid ${G}`, borderRadius: 10, fontSize: 13, fontWeight: 700, color: G, display: 'flex', alignItems: 'center', gap: 8, background: '#fff', transition: 'background 0.15s, color 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.background = G; e.currentTarget.querySelector('span').style.color = '#fff'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.querySelector('span').style.color = ACCENT; e.currentTarget.style.color = G; }}>
                <span style={{ color: ACCENT, fontWeight: 900, transition: 'color 0.15s' }}>✓</span> {cert}
              </div>
            ))}
          </div>

          {/* Client logo placeholders with proper styling */}
          <div data-aos="fade-up">
            <p style={{ textAlign: 'center', fontSize: 13, color: '#999', marginBottom: 28, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Trusted by leading brands worldwide</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 16, alignItems: 'center' }} className="client-grid">
              {[
                'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=200&q=60',
                'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=200&q=60',
                'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&q=60',
                'https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=200&q=60',
                'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=200&q=60',
                'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=200&q=60',
              ].map((img, i) => (
                <div key={i} style={{ height: 60, borderRadius: 10, overflow: 'hidden', background: '#fff', border: '1px solid #E8E4DC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={img} alt={`Client ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6, filter: 'grayscale(100%)', display: 'block', transition: 'opacity 0.2s, filter 0.2s' }}
                    onMouseEnter={e => { e.target.style.opacity = 1; e.target.style.filter = 'grayscale(0%)'; }}
                    onMouseLeave={e => { e.target.style.opacity = 0.6; e.target.style.filter = 'grayscale(100%)'; }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 8 — CTA */}
      <section style={{ padding: '96px 24px', background: `linear-gradient(135deg, ${G} 0%, #0D3520 100%)`, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(200,134,10,0.07) 1px, transparent 1px)', backgroundSize: '24px 24px', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }} data-aos="fade-up">
          <Star size={28} color={ACCENT} fill={ACCENT} style={{ margin: '0 auto 20px', display: 'block' }} />
          <h2 style={{ fontSize: 'clamp(28px,3.5vw,46px)', fontFamily: 'Outfit,sans-serif', fontWeight: 800, color: '#fff', marginBottom: 18, lineHeight: 1.12 }}>
            Ready to create packaging that stands out?
          </h2>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.65)', marginBottom: 40, lineHeight: 1.7 }}>
            Join 10,000+ brands who trust NovaPack for premium custom packaging.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/custom-box"
              style={{ padding: '16px 32px', background: ACCENT, color: '#fff', borderRadius: 10, fontWeight: 700, textDecoration: 'none', fontSize: 15, display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'filter 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.1)'}
              onMouseLeave={e => e.currentTarget.style.filter = 'none'}>
              Get a Custom Box <ArrowRight size={16} />
            </Link>
            <Link to="/contact-us"
              style={{ padding: '16px 32px', background: 'transparent', color: '#fff', border: '1.5px solid rgba(255,255,255,0.3)', borderRadius: 10, fontWeight: 700, textDecoration: 'none', fontSize: 15, transition: 'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              Request Free Sample
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 1000px) {
          .story-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .mv-grid { grid-template-columns: 1fr !important; }
          .values-grid { grid-template-columns: repeat(2,1fr) !important; }
          .team-grid { grid-template-columns: repeat(2,1fr) !important; }
          .process-row { grid-template-columns: 1fr !important; }
          .about-stats { grid-template-columns: repeat(2,1fr) !important; }
          .client-grid { grid-template-columns: repeat(3,1fr) !important; }
        }
        @media (max-width: 600px) {
          .values-grid { grid-template-columns: 1fr !important; }
          .team-grid { grid-template-columns: 1fr !important; }
          .about-stats { grid-template-columns: repeat(2,1fr) !important; }
          .client-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
      `}</style>
    </div>
  );
}

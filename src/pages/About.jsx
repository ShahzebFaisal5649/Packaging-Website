import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle, Award, Users, TrendingUp, Globe, ShieldCheck, Leaf, Clock, ChevronRight, Package, Star } from 'lucide-react';
import jsPDF from 'jspdf';

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
  { name: 'James Carter', title: 'Chief Executive Officer', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=80', bio: 'Visionary leader with 15 years in packaging and manufacturing.' },
  { name: 'Sarah Mitchell', title: 'Chief Operating Officer', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80', bio: 'Operations expert driving efficiency across all production lines.' },
  { name: 'Tom Reynolds', title: 'Head of Design', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&q=80', bio: 'Award winning designer with 12 years of brand storytelling experience.' },
  { name: 'Aisha Johnson', title: 'Head of Operations', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&q=80', bio: 'Supply chain specialist ensuring every order ships on time.' },
];

const CERTS = [
  { name: 'FSC Certified', num: 'FSC-C123456', validYear: 2026 },
  { name: 'ISO 9001', num: 'ISO-9001-789012', validYear: 2025 },
  { name: 'SGP Member', num: 'SGP-MEM-345678', validYear: 2026 },
  { name: 'Eco Friendly Alliance', num: 'EFA-CERT-901234', validYear: 2025 },
  { name: 'ISTA Certified', num: 'ISTA-567890', validYear: 2026 },
];

function downloadCert(certName, certNum, validYear) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  doc.setFillColor(26, 77, 46); doc.rect(0, 0, 297, 30, 'F');
  doc.setFontSize(26); doc.setTextColor(255, 255, 255);
  doc.text('CERTIFICATE OF COMPLIANCE', 148, 18, { align: 'center' });
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(18); doc.text(certName, 148, 50, { align: 'center' });
  doc.setFontSize(12); doc.text('This certifies that: Design Custom Box', 148, 70, { align: 'center' });
  doc.text(`Certificate No: ${certNum}`, 148, 85, { align: 'center' });
  doc.text(`Valid through: December 31, ${validYear}`, 148, 95, { align: 'center' });
  doc.setDrawColor(200, 134, 10); doc.line(60, 155, 130, 155);
  doc.text('Authorized Signature', 95, 162, { align: 'center' });
  doc.save(`${certName.replace(/ /g, '-')}-Certificate.pdf`);
}

const PROCESS = [
  { num: '01', title: 'Configure', desc: 'Use our online 3D configurator to set your box type, material, dimensions, and print specs.', img: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80' },
  { num: '02', title: 'Proof', desc: 'Receive a free digital proof within 24 hours. Request physical samples if needed.', img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80' },
  { num: '03', title: 'Production', desc: 'Expert craftspeople print and assemble your boxes with precision quality control.', img: 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=800&q=80' },
  { num: '04', title: 'Quality Check', desc: 'Every batch passes our 12-point quality inspection before it ever leaves the facility.', img: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&q=80' },
  { num: '05', title: 'Delivery', desc: 'Fast-tracked shipping delivers directly to your door or warehouse in 8–10 business days.', img: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800&q=80' },
];

const VALUES = [
  { icon: <ShieldCheck size={24} color={G} />, title: 'Precision', desc: 'Every dimension, color, and finish is produced to exact specifications without exceptions.' },
  { icon: <Leaf size={24} color="#2E7D32" />, title: 'Sustainability', desc: 'FSC certified materials, soy based inks, and a commitment to zero landfill production.' },
  { icon: <Clock size={24} color={ACCENT} />, title: 'Speed', desc: '8 to 10 day standard turnaround with rush options available because your dates matter.' },
  { icon: <Users size={24} color={G} />, title: 'Partnership', desc: 'Dedicated account managers for every client, from the first order onwards.' },
  { icon: <Award size={24} color={ACCENT} />, title: 'Excellence', desc: 'Industry leading print quality backed by a 100% satisfaction guarantee on every order.' },
  { icon: <Globe size={24} color={G} />, title: 'Reach', desc: 'Shipping to 40 plus countries with a global logistics network that scales with your brand.' },
];

export default function About() {
  const { scrollY } = useScroll();
  const yHero = useTransform(scrollY, [0, 800], [0, 250]);
  const opacityHero = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <div style={{ backgroundColor: BG, minHeight: '100vh', overflowX: 'hidden' }}>

      {/* 1 — Parallax Hero */}
      <section style={{ position: 'relative', minHeight: '85vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <motion.div style={{ position: 'absolute', inset: -50, y: yHero, scale: 1.05 }}>
          <img
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1600&q=80"
            alt="Design Custom Box facility"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(20,60,36,0.5) 0%, rgba(20,60,36,0.85) 100%)' }} />
        </motion.div>

        <motion.div
          style={{ position: 'relative', zIndex: 2, maxWidth: 1200, margin: '0 auto', padding: '0 24px', width: '100%', opacity: opacityHero }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <div style={{ maxWidth: 700 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
              <Link to="/" style={{ fontSize: 13, fontFamily: '"DM Mono", monospace', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'color 0.2s' }}>Home</Link>
              <ChevronRight size={14} color="rgba(255,255,255,0.4)" />
              <span style={{ fontSize: 13, fontFamily: '"DM Mono", monospace', color: 'rgba(255,255,255,0.9)' }}>About Us</span>
            </div>
            <motion.p
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.6 }}
              style={{ fontSize: 13, fontFamily: '"DM Mono", monospace', fontWeight: 500, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 20 }}
            >
              Our Story
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }}
              style={{ fontSize: 'clamp(42px, 6vw, 76px)', fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 800, color: '#fff', lineHeight: 1.05, marginBottom: 28 }}
            >
              Built on Craft.<br />Driven by Brand.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }}
              style={{ fontSize: 18, fontFamily: '"DM Sans", sans-serif', color: 'rgba(255,255,255,0.8)', lineHeight: 1.7, maxWidth: 540, marginBottom: 44 }}
            >
              Since 2010, we've helped over 10,000 brands create packaging that leaves a lasting impression from ambitious startups to Fortune 500 leaders.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8 }}
              style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}
            >
              <Link to="/custom-box"
                style={{ padding: '16px 36px', background: ACCENT, color: '#fff', borderRadius: 8, fontWeight: 700, fontFamily: '"DM Sans", sans-serif', textDecoration: 'none', fontSize: 15, display: 'inline-flex', alignItems: 'center', gap: 10, transition: 'all 0.3s' }}
                onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.1)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.filter = 'none'; e.currentTarget.style.transform = 'none'; }}>
                Get a Quote <ArrowRight size={16} />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* 2 — Stats Strip (Refined) */}
      <section style={{ backgroundColor: '#fff', borderBottom: '1px solid #E8E4DC', position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            {[
              { value: <CountUp target={500} suffix="K+" />, label: 'Boxes Shipped', icon: Package },
              { value: <CountUp target={10} suffix="K+" />, label: 'Happy Clients', icon: Users },
              { value: <CountUp target={30} suffix="+" />, label: 'Industries', icon: Globe },
              { value: <CountUp target={98} suffix="%" />, label: 'On-Time Rate', icon: TrendingUp },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                style={{ padding: '48px 24px', textAlign: 'center', borderRight: i < 3 ? '1px solid #F0EDE8' : 'none' }}
              >
                <s.icon size={24} color={ACCENT} style={{ margin: '0 auto 16px', opacity: 0.8 }} />
                <div style={{ fontSize: 42, fontWeight: 700, color: G, fontFamily: '"Playfair Display", Georgia, serif', lineHeight: 1, marginBottom: 8 }}>{s.value}</div>
                <div style={{ fontSize: 12, fontFamily: '"DM Mono", monospace', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 500 }}>{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3 — Asymmetrical Story Grid */}
      <section style={{ padding: '120px 24px', backgroundColor: BG }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }} className="story-grid">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              style={{ position: 'relative' }}
            >
              <div style={{ paddingRight: '20%', paddingBottom: '10%' }}>
                <img src="https://images.unsplash.com/photo-1553481187-be93c21490a9?w=800&q=80" alt="Warehouse" style={{ width: '100%', borderRadius: 16, boxShadow: '0 24px 48px rgba(0,0,0,0.08)' }} />
              </div>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.8 }}
                style={{ position: 'absolute', bottom: 0, right: 0, width: '55%', backgroundColor: '#fff', padding: '32px', borderRadius: 16, boxShadow: '0 32px 64px rgba(26,77,46,0.12)' }}
              >
                <div style={{ fontSize: 36, fontWeight: 800, color: G, fontFamily: '"Playfair Display", Georgia, serif', marginBottom: 4 }}>Est. 2010</div>
                <div style={{ fontSize: 13, fontFamily: '"DM Sans", sans-serif', color: '#6B6B6B', lineHeight: 1.6 }}>Founded in Chicago, now serving brands globally.</div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <p style={{ fontSize: 12, fontFamily: '"DM Mono", monospace', fontWeight: 500, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 20 }}>Our Story</p>
              <h2 style={{ fontSize: 'clamp(32px,4vw,48px)', fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 700, color: G, marginBottom: 32, lineHeight: 1.15 }}>From Small Shop to Industry Leader</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {[
                  'What started as a passion for beautiful, functional packaging has evolved into a comprehensive platform that empowers brands of all sizes, from solo entrepreneurs to Fortune 500 companies.',
                  'Today, we combine cutting-edge 3D design tools, sustainably sourced materials, and an expert team of designers and engineers to deliver packaging solutions that tell your brand\'s unique story.'
                ].map((p, i) => (
                  <p key={i} style={{ fontSize: 16, fontFamily: '"DM Sans", sans-serif', color: '#4A4A4A', lineHeight: 1.8 }}>{p}</p>
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 36 }}>
                {['Free digital 3D proof on every order', 'Dedicated account manager from day one', 'FSC certified and eco friendly options'].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <CheckCircle size={18} color={ACCENT} strokeWidth={2.5} />
                    <span style={{ fontSize: 15, fontFamily: '"DM Sans", sans-serif', color: '#1A1A1A', fontWeight: 600 }}>{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4 — Editorial Mission/Vision Grid */}
      <section style={{ padding: '120px 24px', backgroundColor: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 80 }}>
            <p style={{ fontSize: 12, fontFamily: '"DM Mono", monospace', fontWeight: 500, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 16 }}>What Drives Us</p>
            <h2 style={{ fontSize: 'clamp(32px,4vw,48px)', fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 700, color: G }}>Mission, Vision &amp; Values</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 40, marginBottom: 80 }} className="mv-grid">
            {[
              { label: 'Our Mission', title: 'Packaging that makes an impression.', desc: 'To empower every brand with custom packaging that creates a powerful first impression. We believe great packaging is the first handshake.', img: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80' },
              { label: 'Our Vision', title: 'Every unboxing should be an experience.', desc: 'We envision packaging as the most powerful marketing touchpoint in a brand\'s arsenal—one that turns regular customers into loyal advocates.', img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80' },
            ].map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: i * 0.2, duration: 0.8 }}
                style={{ position: 'relative', overflow: 'hidden', borderRadius: 20, group: 'true' }}
                className="group"
              >
                <div style={{ height: 460, width: '100%', overflow: 'hidden' }}>
                  <img src={c.img} alt={c.label} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }} className="group-hover:scale-105" />
                </div>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '40px' }}>
                  <p style={{ fontSize: 11, fontFamily: '"DM Mono", monospace', fontWeight: 500, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 12 }}>{c.label}</p>
                  <h3 style={{ fontSize: 26, fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 700, color: '#fff', marginBottom: 16, lineHeight: 1.2 }}>{c.title}</h3>
                  <p style={{ fontSize: 15, fontFamily: '"DM Sans", sans-serif', color: 'rgba(255,255,255,0.8)', lineHeight: 1.7 }}>{c.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32 }} className="values-grid">
            {VALUES.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                style={{ padding: '36px', borderRadius: 16, border: '1px solid #F0EDE8', backgroundColor: BG, transition: 'all 0.3s ease' }}
                whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.06)', backgroundColor: '#fff' }}
              >
                <div style={{ width: 56, height: 56, borderRadius: 12, backgroundColor: '#fff', border: '1px solid #E8E4DC', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                  {v.icon}
                </div>
                <h4 style={{ fontSize: 18, fontWeight: 700, color: G, fontFamily: '"Playfair Display", Georgia, serif', marginBottom: 12 }}>{v.title}</h4>
                <p style={{ fontSize: 14, fontFamily: '"DM Sans", sans-serif', color: '#666', lineHeight: 1.7 }}>{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5 — Interactive Team Roster */}
      <section style={{ padding: '120px 24px', backgroundColor: G }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 80 }}>
            <p style={{ fontSize: 12, fontFamily: '"DM Mono", monospace', fontWeight: 500, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 16 }}>The People</p>
            <h2 style={{ fontSize: 'clamp(32px,4vw,48px)', fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 700, color: '#fff' }}>Meet the Leadership</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 32 }} className="team-grid">
            {TEAM.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', cursor: 'crosshair', group: 'true' }}
                className="group"
              >
                <div style={{ height: 380, width: '100%', overflow: 'hidden' }}>
                  <img src={m.img} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(30%)', transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }} className="group-hover:scale-105 group-hover:grayscale-0" />
                </div>

                {/* Default Info Layer */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', transition: 'opacity 0.3s', opacity: 1 }} className="group-hover:opacity-0">
                  <h3 style={{ fontSize: 20, fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 700, color: '#fff', marginBottom: 4 }}>{m.name}</h3>
                  <p style={{ fontSize: 11, fontFamily: '"DM Mono", monospace', color: ACCENT, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{m.title}</p>
                </div>

                {/* Hover Bio Layer (Glassmorphism) */}
                <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(26, 77, 46, 0.85)', backdropFilter: 'blur(4px)', padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'center', opacity: 0, transition: 'opacity 0.4s ease' }} className="group-hover:opacity-100">
                  <h3 style={{ fontSize: 24, fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 700, color: '#fff', marginBottom: 8 }}>{m.name}</h3>
                  <p style={{ fontSize: 12, fontFamily: '"DM Mono", monospace', color: ACCENT, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 20 }}>{m.title}</p>
                  <p style={{ fontSize: 14, fontFamily: '"DM Sans", sans-serif', color: 'rgba(255,255,255,0.9)', lineHeight: 1.7 }}>{m.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6 — Vertical Animated Process Timeline */}
      <section style={{ padding: '120px 24px', backgroundColor: '#fff', position: 'relative' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 100 }}>
            <p style={{ fontSize: 12, fontFamily: '"DM Mono", monospace', fontWeight: 500, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 16 }}>How It Works</p>
            <h2 style={{ fontSize: 'clamp(32px,4vw,48px)', fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 700, color: G }}>Our Production Process</h2>
          </div>

          <div style={{ position: 'relative' }}>
            {/* Vertical Line */}
            <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: 2, backgroundColor: '#F0EDE8', transform: 'translateX(-50%)' }} className="hidden md:block" />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 80 }}>
              {PROCESS.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.7 }}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: i % 2 === 0 ? 'row' : 'row-reverse', position: 'relative' }}
                  className="process-timeline-row"
                >
                  {/* Content */}
                  <div style={{ width: '45%', padding: i % 2 === 0 ? '0 40px 0 0' : '0 0 0 40px', textAlign: i % 2 === 0 ? 'right' : 'left' }} className="process-content">
                    <div style={{ fontSize: 56, fontWeight: 800, color: `${ACCENT}25`, fontFamily: '"Playfair Display", Georgia, serif', lineHeight: 1, marginBottom: 16 }}>{s.num}</div>
                    <h3 style={{ fontSize: 26, fontWeight: 700, color: G, fontFamily: '"Playfair Display", Georgia, serif', marginBottom: 16 }}>{s.title}</h3>
                    <p style={{ fontSize: 16, fontFamily: '"DM Sans", sans-serif', color: '#555', lineHeight: 1.7 }}>{s.desc}</p>
                  </div>

                  {/* Center Node */}
                  <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: 16, height: 16, borderRadius: '50%', backgroundColor: ACCENT, border: '4px solid #fff', boxShadow: '0 0 0 4px rgba(200,134,10,0.2)' }} className="hidden md:block" />

                  {/* Image */}
                  <div style={{ width: '45%' }} className="process-image">
                    <div style={{ borderRadius: 20, overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}>
                      <img src={s.img} alt={s.title} style={{ width: '100%', height: 320, objectFit: 'cover' }} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7 — Certifications & Clients */}
      <section style={{ padding: '100px 24px', backgroundColor: BG }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <h2 style={{ fontSize: 'clamp(28px,3vw,36px)', fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 700, color: G }}>Trusted &amp; Certified</h2>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 80 }}>
            {CERTS.map((cert, i) => (
              <motion.button
                key={cert.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                onClick={() => downloadCert(cert.name, cert.num, cert.validYear)}
                style={{ padding: '16px 28px', border: `1.5px solid #D0CAC0`, borderRadius: 100, fontSize: 13, fontFamily: '"DM Sans", sans-serif', fontWeight: 700, color: G, display: 'flex', alignItems: 'center', gap: 10, background: '#fff', cursor: 'pointer', transition: 'all 0.2s' }}
                whileHover={{ borderColor: ACCENT, color: ACCENT, y: -2, boxShadow: '0 10px 20px rgba(200,134,10,0.1)' }}
              >
                <CheckCircle size={16} color={ACCENT} /> {cert.name}
              </motion.button>
            ))}
          </div>

          <div>
            <p style={{ textAlign: 'center', fontSize: 12, fontFamily: '"DM Mono", monospace', color: '#888', marginBottom: 32, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Trusted by leading brands worldwide</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 24, alignItems: 'center' }}>
              {[
                'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=300&q=60',
                'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=300&q=60',
                'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=300&q=60',
                'https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=300&q=60',
                'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=300&q=60',
                'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=300&q=60',
              ].map((img, i) => (
                <div key={i} style={{ height: 80, borderRadius: 12, overflow: 'hidden', background: '#fff', border: '1px solid #E8E4DC', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
                  <img src={img} alt={`Client ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'contain', opacity: 0.4, filter: 'grayscale(100%)', transition: 'all 0.3s' }}
                    onMouseEnter={e => { e.target.style.opacity = 1; e.target.style.filter = 'grayscale(0%)'; }}
                    onMouseLeave={e => { e.target.style.opacity = 0.4; e.target.style.filter = 'grayscale(100%)'; }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 8 — CTA */}
      <section style={{ padding: '120px 24px', backgroundColor: G, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(200,134,10,0.1) 2px, transparent 2px)', backgroundSize: '32px 32px' }} />
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <Star size={32} color={ACCENT} fill={ACCENT} style={{ margin: '0 auto 24px', display: 'block' }} />
          <h2 style={{ fontSize: 'clamp(32px,5vw,56px)', fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 700, color: '#fff', marginBottom: 24, lineHeight: 1.1 }}>
            Ready to create packaging that stands out?
          </h2>
          <p style={{ fontSize: 18, fontFamily: '"DM Sans", sans-serif', color: 'rgba(255,255,255,0.8)', marginBottom: 48, lineHeight: 1.7 }}>
            Join 10,000+ brands who trust us for premium custom packaging.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/custom-box"
              style={{ padding: '18px 40px', background: ACCENT, color: '#fff', borderRadius: 8, fontWeight: 700, fontFamily: '"DM Sans", sans-serif', textDecoration: 'none', fontSize: 15, display: 'inline-flex', alignItems: 'center', gap: 10, transition: 'all 0.3s' }}
              onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.1)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.filter = 'none'; e.currentTarget.style.transform = 'none'; }}>
              Start Designing <ArrowRight size={16} />
            </Link>
            <Link to="/contact-us"
              style={{ padding: '18px 40px', background: 'transparent', color: '#fff', border: '1.5px solid rgba(255,255,255,0.3)', borderRadius: 8, fontWeight: 700, fontFamily: '"DM Sans", sans-serif', textDecoration: 'none', fontSize: 15, transition: 'all 0.3s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; }}>
              Request Sample
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        .group:hover .group-hover\\:scale-105 { transform: scale(1.05); }
        .group:hover .group-hover\\:grayscale-0 { filter: grayscale(0%); }
        .group:hover .group-hover\\:opacity-0 { opacity: 0; }
        .group:hover .group-hover\\:opacity-100 { opacity: 1; }

        @media (max-width: 768px) {
          .story-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .mv-grid { grid-template-columns: 1fr !important; }
          .process-timeline-row { flex-direction: column !important; gap: 32px !important; }
          .process-content { width: 100% !important; padding: 0 !important; text-align: left !important; }
          .process-image { width: 100% !important; }
          .hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
}

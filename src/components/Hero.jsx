import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Play, Star, Package, Zap, Shield, Award, Truck, CheckCircle } from 'lucide-react';

const CYCLING_WORDS = ['Your Brand', 'Your Vision', 'Your Identity', 'Your Story'];

const STATS = [
  { num: '500K+', label: 'Boxes Shipped' },
  { num: '98%', label: 'Happy Customers' },
  { num: '50+', label: 'Countries Served' },
  { num: '7 Day', label: 'Average Turnaround' },
];

const TRUST_ITEMS = [
  { icon: <Shield size={14} color="#C8860A" />, text: 'Free Samples' },
  { icon: <CheckCircle size={14} color="#C8860A" />, text: 'No Minimum Order' },
  { icon: <Truck size={14} color="#C8860A" />, text: 'Free Shipping' },
  { icon: <Award size={14} color="#C8860A" />, text: 'Quality Guarantee' },
];

export default function Hero() {
  const [wordIdx, setWordIdx] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const { scrollY } = useScroll();

  // Parallax effects
  const yImage = useTransform(scrollY, [0, 1000], [0, 150]);
  const opacityHero = useTransform(scrollY, [0, 600], [1, 0]);

  useEffect(() => {
    const cycle = setInterval(() => {
      setWordIdx(prev => (prev + 1) % CYCLING_WORDS.length);
    }, 3000);
    return () => clearInterval(cycle);
  }, []);

  // Animation variants
  const staggerContainer = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 50, damping: 15 } }
  };

  return (
    <div style={{ position: 'relative', overflow: 'hidden', backgroundColor: '#071810', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* ── Immersive Background ────────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(135deg, #071810 0%, #0E2A1A 30%, #1A4D2E 65%, #0A1F14 100%)',
        zIndex: 0
      }} />

      {/* Grid pattern */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.05,
        backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
        backgroundSize: '64px 64px',
        zIndex: 1
      }} />

      {/* Glow blobs */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'absolute', top: '-10%', right: '-5%', width: 600, height: 600, background: 'radial-gradient(circle, rgba(200,134,10,0.15) 0%, transparent 60%)', borderRadius: '50%', zIndex: 1, pointerEvents: 'none' }}
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: 700, height: 700, background: 'radial-gradient(circle, rgba(26,77,46,0.5) 0%, transparent 60%)', borderRadius: '50%', zIndex: 1, pointerEvents: 'none' }}
      />

      {/* ── Main Content ──────────────────────────────────────────────── */}
      <motion.div style={{ opacity: opacityHero, flex: 1, display: 'flex', alignItems: 'center' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '120px 24px 64px', width: '100%', position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 60, alignItems: 'center' }} className="hero-grid">

            {/* LEFT - Typography & CTA */}
            <motion.div variants={staggerContainer} initial="hidden" animate="show" className="hero-left text-center lg:text-left">

              {/* Badge */}
              <motion.div variants={fadeUp} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '8px 20px', background: 'rgba(200,134,10,0.1)', border: '1px solid rgba(200,134,10,0.3)', borderRadius: 100, marginBottom: 32, backdropFilter: 'blur(10px)' }}>
                <motion.span animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }} transition={{ duration: 2, repeat: Infinity }} style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#C8860A' }} />
                <span style={{ fontSize: 11, fontWeight: 600, color: '#C8860A', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: '"DM Mono", monospace' }}>
                  Industry leading custom packaging
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1 variants={fadeUp} style={{ fontSize: 'clamp(46px, 6vw, 76px)', fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.05, marginBottom: 28, letterSpacing: '-0.02em' }}>
                Packaging That<br />
                Elevates<br />
                <div style={{ position: 'relative', display: 'inline-block', whiteSpace: 'nowrap', minWidth: '300px', color: '#C8860A', overflow: 'visible', height: '1.1em', verticalAlign: 'bottom' }}>
                  <AnimatePresence mode="popLayout">
                    <motion.span
                      key={wordIdx}
                      initial={{ y: 40, opacity: 0, rotateX: -90 }}
                      animate={{ y: 0, opacity: 1, rotateX: 0 }}
                      exit={{ y: -40, opacity: 0, rotateX: 90 }}
                      transition={{ duration: 0.6, type: 'spring', bounce: 0.3 }}
                      style={{ position: 'absolute', left: 0, top: 0, transformOrigin: 'center' }}
                    >
                      {CYCLING_WORDS[wordIdx]}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </motion.h1>

              {/* Subtext */}
              <p className="hero-subtext text-left md:text-left">



              </p>

              {/* CTA Buttons */}
              <motion.div variants={fadeUp} style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 48 }} className="hero-actions">
                <Link to="/custom-box" style={{ textDecoration: 'none' }}>
                  <motion.div
                    whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(200,134,10,0.4)' }}
                    whileTap={{ scale: 0.95 }}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '18px 36px', borderRadius: 12, background: 'linear-gradient(135deg, #C8860A 0%, #E09520 100%)', color: '#fff', fontWeight: 800, fontSize: 16, fontFamily: '"DM Sans", sans-serif', boxShadow: '0 8px 24px rgba(200,134,10,0.25)' }}
                  >
                    Start Designing Free <ArrowRight size={18} />
                  </motion.div>
                </Link>

                <motion.button
                  onClick={() => setShowVideo(true)}
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
                  whileTap={{ scale: 0.95 }}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '14px 28px', borderRadius: 12, cursor: 'pointer', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontWeight: 700, fontSize: 16, fontFamily: '"DM Sans", sans-serif', backdropFilter: 'blur(10px)' }}
                >
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Play size={16} fill="#fff" color="#fff" />
                  </div>
                  Watch Process
                </motion.button>
              </motion.div>

              {/* Social Proof */}
              <motion.div variants={fadeUp} style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap', marginBottom: 32 }} className="hero-social-proof">
                <div style={{ display: 'flex' }}>
                  {['https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80'].map((src, i) => (
                    <img key={i} src={src} alt="Client" style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid #071810', marginLeft: i > 0 ? -12 : 0, zIndex: 10 - i, objectFit: 'cover' }} />
                  ))}
                  <div style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid #071810', marginLeft: -12, zIndex: 5, backgroundColor: '#C8860A', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, fontFamily: '"DM Mono", monospace' }}>
                    5k+
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <div style={{ display: 'flex', gap: 2 }}>
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} fill="#C8860A" color="#C8860A" />)}
                  </div>
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', fontFamily: '"DM Sans", sans-serif' }}>
                    <strong style={{ color: '#fff' }}>4.9/5</strong> (2,400+ reviews)
                  </span>
                </div>
              </motion.div>

              {/* Trust Pills */}
              <motion.div variants={fadeUp} style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }} className="hero-trust-pills">
                {TRUST_ITEMS.map((t, i) => (
                  <div key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 100, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: 600, fontFamily: '"DM Sans", sans-serif' }}>
                    {t.icon} {t.text}
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* RIGHT - Floating 3D Showcase */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.5 }}
              style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', y: yImage }}
              className="hero-right"
            >
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '85%', height: '85%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(200,134,10,0.2) 0%, transparent 70%)', filter: 'blur(40px)', zIndex: 0 }} />

              <motion.div
                animate={{ y: [-15, 15, -15] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                style={{ position: 'relative', zIndex: 2 }}
              >
                <img
                  src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80"
                  alt="Premium custom packaging"
                  style={{ width: '100%', maxWidth: 560, height: 'auto', borderRadius: 24, boxShadow: '0 40px 80px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}
                />
              </motion.div>

              {/* Floating Element 1 - Orders */}
              <motion.div
                animate={{ y: [10, -10, 10], rotate: [0, -2, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                style={{ position: 'absolute', top: '10%', left: '-5%', zIndex: 10, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', borderRadius: 16, padding: '16px 20px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', gap: 14, border: '1px solid rgba(255,255,255,0.5)' }}
                className="hidden md:flex"
              >
                <div style={{ width: 44, height: 44, borderRadius: 12, background: '#1A4D2E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Package size={20} color="#fff" />
                </div>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#111', fontFamily: '"Playfair Display", serif', lineHeight: 1 }}>500K+</div>
                  <div style={{ fontSize: 12, color: '#666', fontWeight: 600, fontFamily: '"DM Sans", sans-serif', marginTop: 4 }}>Orders Shipped</div>
                </div>
              </motion.div>

              {/* Floating Element 2 - Speed */}
              <motion.div
                animate={{ y: [-10, 10, -10], rotate: [0, 2, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                style={{ position: 'absolute', bottom: '15%', right: '-8%', zIndex: 10, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', borderRadius: 16, padding: '16px 20px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', gap: 14, border: '1px solid rgba(255,255,255,0.5)' }}
                className="hidden md:flex"
              >
                <div style={{ width: 44, height: 44, borderRadius: 12, background: '#C8860A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Zap size={20} color="#fff" />
                </div>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#111', fontFamily: '"Playfair Display", serif', lineHeight: 1 }}>7 Day</div>
                  <div style={{ fontSize: 12, color: '#666', fontWeight: 600, fontFamily: '"DM Sans", sans-serif', marginTop: 4 }}>Fast Delivery</div>
                </div>
              </motion.div>

              {/* Floating Badge - Rating */}
              <motion.div
                animate={{ y: [5, -5, 5] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                style={{ position: 'absolute', top: '-5%', right: '10%', zIndex: 10, background: 'rgba(255,255,255,0.95)', borderRadius: 100, padding: '10px 18px', boxShadow: '0 12px 24px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: 8, border: '1px solid rgba(255,255,255,0.5)' }}
                className="hidden md:flex"
              >
                <div style={{ display: 'flex', gap: 2 }}>{[1, 2, 3, 4, 5].map(i => <Star key={i} size={12} fill="#C8860A" color="#C8860A" />)}</div>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#111', fontFamily: '"DM Sans", sans-serif' }}>4.9/5 Rating</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* ── Video Modal ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showVideo && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }}
            onClick={() => setShowVideo(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} transition={{ type: 'spring', damping: 20 }}
              style={{ background: '#111', borderRadius: 24, padding: '48px', textAlign: 'center', maxWidth: 480, border: '1px solid rgba(255,255,255,0.1)' }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#1A4D2E', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 0 40px rgba(26,77,46,0.5)' }}>
                <Play size={28} fill="#fff" color="#fff" />
              </div>
              <h3 style={{ color: '#fff', fontSize: 24, fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 800, marginBottom: 12 }}>Process Video</h3>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15, fontFamily: '"DM Sans", sans-serif', marginBottom: 32, lineHeight: 1.6 }}>
                Our production walkthrough video is currently being updated. In the meantime, explore our premium product range.
              </p>
              <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
                <Link
                  to="/products"
                  onClick={() => setShowVideo(false)}
                  style={{ padding: '14px 28px', background: '#1A4D2E', color: '#fff', borderRadius: 10, fontWeight: 700, fontSize: 15, fontFamily: '"DM Sans", sans-serif', textDecoration: 'none' }}
                >
                  Browse Products
                </Link>
                <button
                  onClick={() => setShowVideo(false)}
                  style={{ padding: '14px 28px', background: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: 10, fontWeight: 700, fontSize: 15, fontFamily: '"DM Sans", sans-serif', border: 'none', cursor: 'pointer' }}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 1024px) {
          .hero-grid { grid-template-columns: 1fr !important; text-align: center; gap: 40px !important; }
          .hero-left { display: flex; flex-direction: column; align-items: center; }
          .hero-actions { justify-content: center; }
          .hero-social-proof { justify-content: center; }
          .hero-trust-pills { justify-content: center; }
          .hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
}

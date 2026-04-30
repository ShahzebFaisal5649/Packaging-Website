import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Star, Package, Zap, Shield, Award, Truck, CheckCircle } from 'lucide-react';

const CYCLING_WORDS = ['Your Brand', 'Your Vision', 'Your Identity', 'Your Story'];

const STATS = [
  { num: '500K+', label: 'Boxes Shipped' },
  { num: '98%', label: 'Satisfaction Rate' },
  { num: '50+', label: 'Countries Served' },
  { num: '7-Day', label: 'Avg Turnaround' },
];

const TRUST_ITEMS = [
  { icon: <Shield size={14} />, text: 'Free Samples' },
  { icon: <CheckCircle size={14} />, text: 'No Minimum Order' },
  { icon: <Truck size={14} />, text: 'Free Shipping' },
  { icon: <Award size={14} />, text: 'Quality Guarantee' },
];

export default function Hero() {
  const [wordIdx, setWordIdx] = useState(0);
  const [wordVisible, setWordVisible] = useState(true);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    const cycle = setInterval(() => {
      setWordVisible(false);
      setTimeout(() => {
        setWordIdx(prev => (prev + 1) % CYCLING_WORDS.length);
        setWordVisible(true);
      }, 380);
    }, 2600);
    return () => clearInterval(cycle);
  }, []);

  return (
    <div style={{ position: 'relative', overflow: 'hidden', paddingTop: 0 }}>

      {/* ── Background ────────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(135deg, #071810 0%, #0E2A1A 30%, #1A4D2E 65%, #0A1F14 100%)',
      }} />

      {/* Grid pattern */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.4,
        backgroundImage: `linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)`,
        backgroundSize: '64px 64px',
      }} />

      {/* Glow blobs */}
      <div className="hero-blob hero-blob-1" />
      <div className="hero-blob hero-blob-2" />
      <div className="hero-blob hero-blob-3" />

      {/* ── Main Content ──────────────────────────────────────────────── */}
      <div style={{ position: 'relative', zIndex: 10, maxWidth: 1400, margin: '0 auto', padding: '32px 24px 0' }}>
        <div className="hero-grid">

          {/* LEFT */}
          <div className="hero-left">

            {/* Badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 18px',
              background: 'rgba(200,134,10,0.12)', border: '1px solid rgba(200,134,10,0.3)',
              borderRadius: 100, marginBottom: 28,
            }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#C8860A', animation: 'heroPulse 2s ease-in-out infinite' }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#C8860A', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Industry-Leading Custom Packaging
              </span>
            </div>

            {/* Headline */}
            <h1 style={{
              fontSize: 'clamp(38px, 4.8vw, 68px)',
              fontFamily: 'Outfit, sans-serif', fontWeight: 900,
              color: '#FFFFFF', lineHeight: 1.08, marginBottom: 28,
              letterSpacing: '-0.02em',
            }}>
              Packaging That<br />
              Elevates<br />
              <span style={{
                color: '#C8860A',
                display: 'inline-block',
                opacity: wordVisible ? 1 : 0,
                transform: wordVisible ? 'translateY(0px)' : 'translateY(10px)',
                transition: 'opacity 0.38s ease, transform 0.38s ease',
                minWidth: '2ch',
              }}>
                {CYCLING_WORDS[wordIdx]}
              </span>
            </h1>

            {/* Subtext */}
            <p style={{
              fontSize: 'clamp(15px, 1.3vw, 18px)',
              color: 'rgba(255,255,255,0.65)', lineHeight: 1.75,
              marginBottom: 36, maxWidth: 500,
            }}>
              Deliver unforgettable unboxing experiences with custom-printed,
              premium-grade packaging. Fast turnaround. No minimums. Just results.
            </p>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 36 }}>
              <Link
                to="/custom-box"
                className="hero-btn-primary"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10,
                  padding: '15px 30px', borderRadius: 12, textDecoration: 'none',
                  background: 'linear-gradient(135deg, #C8860A 0%, #E09520 100%)',
                  color: '#fff', fontWeight: 800, fontSize: 15,
                  boxShadow: '0 8px 28px rgba(200,134,10,0.4)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
              >
                Start Designing Free <ArrowRight size={17} />
              </Link>

              <button
                onClick={() => setShowVideo(true)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 12,
                  padding: '15px 26px', borderRadius: 12, cursor: 'pointer',
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.16)',
                  color: '#fff', fontWeight: 700, fontSize: 15,
                  backdropFilter: 'blur(10px)',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.13)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
              >
                <div style={{
                  width: 34, height: 34, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.14)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Play size={14} fill="#fff" color="#fff" />
                </div>
                Watch Process
              </button>
            </div>

            {/* Social proof row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex' }}>
                {['A', 'S', 'M', 'J', 'R'].map((l, i) => (
                  <div key={i} style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: `hsl(${140 + i * 25}, 40%, ${28 + i * 4}%)`,
                    border: '2.5px solid rgba(10,31,20,0.9)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 800, color: '#fff',
                    marginLeft: i > 0 ? -10 : 0, zIndex: 5 - i,
                  }}>{l}</div>
                ))}
              </div>
              <div>
                <div style={{ display: 'flex', gap: 2, marginBottom: 3 }}>
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} size={13} fill="#C8860A" color="#C8860A" />)}
                </div>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>
                  <strong style={{ color: '#fff' }}>4.9/5</strong> from 2,400+ brands
                </span>
              </div>
              <div style={{ width: 1, height: 32, background: 'rgba(255,255,255,0.15)' }} />
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>
                <span style={{ color: '#4ADE80', fontWeight: 700 }}>✓</span> No credit card required
              </div>
            </div>

            {/* Trust pills */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 28 }}>
              {TRUST_ITEMS.map((t, i) => (
                <div key={i} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '6px 12px', borderRadius: 100,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: 600,
                }}>
                  <span style={{ color: '#4ADE80' }}>{t.icon}</span>
                  {t.text}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — image with floating cards */}
          <div className="hero-right">
            {/* Glow ring behind image */}
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '85%', height: '85%', borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(26,77,46,0.6) 0%, transparent 70%)',
              animation: 'heroGlow 5s ease-in-out infinite',
            }} />

            {/* Main image */}
            <div style={{ animation: 'heroFloat 4.5s ease-in-out infinite', position: 'relative', zIndex: 2 }}>
              <img
                src="/src/assets/Premium-Custom-Box-Mockup.png"
                alt="Premium custom packaging"
                style={{
                  width: '100%', maxWidth: 500, height: 'auto',
                  borderRadius: 24,
                  filter: 'drop-shadow(0 40px 80px rgba(0,0,0,0.55))',
                }}
                onError={e => {
                  e.target.src = 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=700&q=80';
                  e.target.style.borderRadius = '24px';
                }}
              />
            </div>

            {/* Floating card — Orders */}
            <div className="hero-card" style={{
              top: '8%', left: '-4%',
              animation: 'heroCard1 5.5s ease-in-out infinite',
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 11, background: '#1A4D2E',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Package size={19} color="#fff" />
              </div>
              <div>
                <div style={{ fontSize: 17, fontWeight: 900, color: '#111', lineHeight: 1 }}>500K+</div>
                <div style={{ fontSize: 11, color: '#777', fontWeight: 500, marginTop: 2 }}>Orders Shipped</div>
              </div>
            </div>

            {/* Floating card — Speed */}
            <div className="hero-card" style={{
              bottom: '14%', right: '-6%',
              animation: 'heroCard2 6s ease-in-out infinite',
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 11, background: '#C8860A',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Zap size={19} color="#fff" />
              </div>
              <div>
                <div style={{ fontSize: 17, fontWeight: 900, color: '#111', lineHeight: 1 }}>7-Day</div>
                <div style={{ fontSize: 11, color: '#777', fontWeight: 500, marginTop: 2 }}>Fast Delivery</div>
              </div>
            </div>

            {/* Floating badge — Eco */}
            <div style={{
              position: 'absolute', top: '42%', right: '-9%', zIndex: 10,
              background: 'rgba(255,255,255,0.96)',
              borderRadius: 100, padding: '9px 16px',
              boxShadow: '0 8px 28px rgba(0,0,0,0.18)',
              display: 'flex', alignItems: 'center', gap: 7,
              animation: 'heroCard3 7s ease-in-out infinite',
            }}>
              <Shield size={14} color="#1A4D2E" />
              <span style={{ fontSize: 12, fontWeight: 700, color: '#1A4D2E', whiteSpace: 'nowrap' }}>Eco-Certified</span>
            </div>

            {/* Rating badge */}
            <div style={{
              position: 'absolute', top: '-4%', right: '12%', zIndex: 10,
              background: 'rgba(255,255,255,0.96)',
              borderRadius: 14, padding: '10px 16px',
              boxShadow: '0 8px 28px rgba(0,0,0,0.15)',
              display: 'flex', alignItems: 'center', gap: 7,
              animation: 'heroCard1 8s ease-in-out infinite 1s',
            }}>
              <div style={{ display: 'flex', gap: 1 }}>
                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={11} fill="#C8860A" color="#C8860A" />)}
              </div>
              <span style={{ fontSize: 12, fontWeight: 800, color: '#111' }}>4.9/5 Rating</span>
            </div>
          </div>
        </div>

        {/* ── Stats Bar ─────────────────────────────────────────────────── */}
        <div style={{
          position: 'relative', zIndex: 10,
          marginTop: 56,
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '20px 20px 0 0',
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          padding: '28px 24px',
        }} className="hero-stats">
          {STATS.map((s, i) => (
            <div key={i} style={{
              textAlign: 'center', padding: '0 16px',
              borderRight: i < 3 ? '1px solid rgba(255,255,255,0.1)' : 'none',
            }}>
              <div style={{
                fontSize: 'clamp(24px, 2.5vw, 34px)', fontWeight: 900,
                fontFamily: 'Outfit, sans-serif', color: '#FFFFFF', lineHeight: 1,
                letterSpacing: '-0.02em',
              }}>{s.num}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 7, fontWeight: 500, letterSpacing: '0.03em' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Keyframes & responsive ────────────────────────────────────── */}
      <style>{`
        .hero-grid {
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          gap: 64px;
          align-items: center;
        }
        .hero-left { }
        .hero-right {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .hero-card {
          position: absolute;
          z-index: 10;
          background: rgba(255,255,255,0.97);
          borderRadius: 16px;
          padding: 13px 18px;
          box-shadow: 0 12px 40px rgba(0,0,0,0.22);
          display: flex;
          align-items: center;
          gap: 12px;
          border: 1px solid rgba(255,255,255,0.6);
        }
        .hero-btn-primary:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 14px 36px rgba(200,134,10,0.5) !important;
        }
        .hero-blob {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }
        .hero-blob-1 {
          top: -15%;
          right: -8%;
          width: 560px;
          height: 560px;
          background: radial-gradient(circle, rgba(200,134,10,0.13) 0%, transparent 65%);
          animation: heroBlob1 9s ease-in-out infinite;
        }
        .hero-blob-2 {
          bottom: -20%;
          left: -10%;
          width: 480px;
          height: 480px;
          background: radial-gradient(circle, rgba(26,77,46,0.45) 0%, transparent 65%);
          animation: heroBlob2 11s ease-in-out infinite;
        }
        .hero-blob-3 {
          top: 30%;
          left: 40%;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(200,134,10,0.07) 0%, transparent 65%);
          animation: heroBlob2 14s ease-in-out infinite reverse;
        }
        @keyframes heroFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-18px); }
        }
        @keyframes heroGlow {
          0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.9; transform: translate(-50%, -50%) scale(1.12); }
        }
        @keyframes heroBlob1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-25px, 18px) scale(1.08); }
          66% { transform: translate(18px, -25px) scale(0.93); }
        }
        @keyframes heroBlob2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(22px, -18px) scale(1.05); }
          66% { transform: translate(-18px, 22px) scale(0.95); }
        }
        @keyframes heroCard1 {
          0%, 100% { transform: translateY(0) rotate(-1.5deg); }
          50% { transform: translateY(-10px) rotate(1deg); }
        }
        @keyframes heroCard2 {
          0%, 100% { transform: translateY(0) rotate(2deg); }
          50% { transform: translateY(-8px) rotate(-1deg); }
        }
        @keyframes heroCard3 {
          0%, 100% { transform: translateX(0) rotate(-0.5deg); }
          50% { transform: translateX(-6px) rotate(0.5deg); }
        }
        @keyframes heroPulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(200,134,10,0.4); }
          50% { opacity: 0.7; box-shadow: 0 0 0 5px rgba(200,134,10,0); }
        }
        @media (max-width: 1024px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
          }
          .hero-right { min-height: 340px; }
        }
        @media (max-width: 640px) {
          .hero-stats { grid-template-columns: repeat(2, 1fr) !important; }
          .hero-stats > div:nth-child(2) { border-right: none !important; }
          .hero-stats > div:nth-child(1),
          .hero-stats > div:nth-child(2) { border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 20px; }
          .hero-stats > div:nth-child(3),
          .hero-stats > div:nth-child(4) { padding-top: 20px; }
        }
      `}</style>

      {/* Video modal */}
      {showVideo && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => setShowVideo(false)}
        >
          <div
            style={{ background: '#111', borderRadius: 16, padding: '40px 48px', textAlign: 'center', maxWidth: 480 }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#1A4D2E', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <Play size={26} fill="#fff" color="#fff" />
            </div>
            <h3 style={{ color: '#fff', fontSize: 20, fontFamily: 'Outfit,sans-serif', fontWeight: 800, marginBottom: 10 }}>Process Video</h3>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, marginBottom: 24 }}>
              Our production walkthrough video is coming soon. Meanwhile, explore our product range!
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <Link
                to="/products"
                onClick={() => setShowVideo(false)}
                style={{ padding: '11px 24px', background: '#1A4D2E', color: '#fff', borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: 'none' }}
              >
                Browse Products
              </Link>
              <button
                onClick={() => setShowVideo(false)}
                style={{ padding: '11px 24px', background: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: 10, fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

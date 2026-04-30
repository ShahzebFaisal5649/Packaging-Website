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
    <div className="hero-container" style={{ position: 'relative', overflow: 'hidden', paddingTop: 0 }}>

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
      <div className="hero-content">
        <div className="hero-grid">

          {/* LEFT */}
          <div className="hero-left">

            {/* Badge */}
            <div className="hero-badge">
              <span className="hero-badge-dot" />
              <span className="hero-badge-text">
                Industry-Leading Custom Packaging
              </span>
            </div>

            {/* Headline */}
            <h1 className="hero-headline">
              Packaging That<br />
              Elevates<br />
              <span className="hero-cycling-word" style={{
                opacity: wordVisible ? 1 : 0,
                transform: wordVisible ? 'translateY(0px)' : 'translateY(10px)',
              }}>
                {CYCLING_WORDS[wordIdx]}
              </span>
            </h1>

            {/* Subtext */}
            <p className="hero-subtext">
              Deliver unforgettable unboxing experiences with custom-printed,
              premium-grade packaging. Fast turnaround. No minimums. Just results.
            </p>

            {/* CTA Buttons */}
            <div className="hero-actions">
              <Link to="/custom-box" className="hero-btn-primary">
                Start Designing Free <ArrowRight size={17} />
              </Link>

              <button onClick={() => setShowVideo(true)} className="hero-btn-secondary">
                <div className="play-icon-wrapper">
                  <Play size={14} fill="#fff" color="#fff" />
                </div>
                Watch Process
              </button>
            </div>

            {/* Social proof row */}
            <div className="hero-social-proof">
              <div className="avatar-group">
                {['A', 'S', 'M', 'J', 'R'].map((l, i) => (
                  <div key={i} className="avatar-item" style={{
                    background: `hsl(${140 + i * 25}, 40%, ${28 + i * 4}%)`,
                    marginLeft: i > 0 ? -10 : 0, zIndex: 5 - i,
                  }}>{l}</div>
                ))}
              </div>
              <div className="rating-info">
                <div className="stars-row">
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} size={12} fill="#C8860A" color="#C8860A" />)}
                </div>
                <span className="rating-text">
                  <strong>4.9/5</strong> (2,400+ brands)
                </span>
              </div>
            </div>

            {/* Trust pills */}
            <div className="hero-trust-pills">
              {TRUST_ITEMS.map((t, i) => (
                <div key={i} className="trust-pill">
                  <span className="trust-pill-icon">{t.icon}</span>
                  {t.text}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — image with floating cards */}
          <div className="hero-right">
            {/* Glow ring behind image */}
            <div className="hero-glow-ring" />

            {/* Main image */}
            <div className="hero-image-wrapper">
              <img
                src="/src/assets/Premium-Custom-Box-Mockup.png"
                alt="Premium custom packaging"
                className="hero-main-img"
                onError={e => {
                  e.target.src = 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=700&q=80';
                  e.target.style.borderRadius = '24px';
                }}
              />
            </div>

            {/* Floating card — Orders */}
            <div className="hero-card hero-card-1">
              <div className="card-icon-green"><Package size={19} color="#fff" /></div>
              <div>
                <div className="card-value">500K+</div>
                <div className="card-label">Orders Shipped</div>
              </div>
            </div>

            {/* Floating card — Speed */}
            <div className="hero-card hero-card-2">
              <div className="card-icon-gold"><Zap size={19} color="#fff" /></div>
              <div>
                <div className="card-value">7-Day</div>
                <div className="card-label">Fast Delivery</div>
              </div>
            </div>

            {/* Floating badge — Eco */}
            <div className="hero-eco-badge">
              <Shield size={14} color="#1A4D2E" />
              <span>Eco-Certified</span>
            </div>

            {/* Rating badge */}
            <div className="hero-rating-badge">
              <div className="stars-row-small">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={11} fill="#C8860A" color="#C8860A" />)}
              </div>
              <span className="rating-score">4.9/5 Rating</span>
            </div>
          </div>
        </div>

        {/* ── Stats Bar ─────────────────────────────────────────────────── */}
        <div className="hero-stats">
          {STATS.map((s, i) => (
            <div key={i} className="stats-item" style={{ borderRight: i < 3 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
              <div className="stats-num">{s.num}</div>
              <div className="stats-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .hero-content {
          position: relative;
          z-index: 10;
          maxWidth: 1400px;
          margin: 0 auto;
          padding: clamp(32px, 8vh, 64px) clamp(24px, 8vw, 64px) 0;
        }
        .hero-grid {
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          gap: 64px;
          align-items: center;
        }
        .hero-left { text-align: left; }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 18px;
          background: rgba(200,134,10,0.12);
          border: 1px solid rgba(200,134,10,0.3);
          border-radius: 100px;
          margin-bottom: 28px;
        }
        .hero-badge-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #C8860A;
          animation: heroPulse 2s ease-in-out infinite;
        }
        .hero-badge-text {
          font-size: 10px;
          font-weight: 700;
          color: #C8860A;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .hero-headline {
          font-size: clamp(32px, 8vw, 68px);
          font-family: 'Outfit', sans-serif;
          font-weight: 900;
          color: #FFFFFF;
          line-height: 1.1;
          margin-bottom: 28px;
          letter-spacing: -0.02em;
          max-width: 100%;
        }
        .hero-cycling-word {
          color: #C8860A;
          display: inline-block;
          transition: opacity 0.38s ease, transform 0.38s ease;
          min-width: 2ch;
        }
        .hero-subtext {
          font-size: clamp(14px, 1.2vw, 18px);
          color: rgba(255,255,255,0.65);
          line-height: 1.7;
          margin-bottom: 36px;
          max-width: 500px;
        }
        .hero-actions {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
          margin-bottom: 36px;
          justify-content: flex-start;
        }
        .hero-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 16px 32px;
          border-radius: 12px;
          text-decoration: none;
          background: linear-gradient(135deg, #C8860A 0%, #E09520 100%);
          color: #fff;
          font-weight: 800;
          font-size: 15px;
          box-shadow: 0 8px 28px rgba(200,134,10,0.4);
          transition: all 0.2s;
        }
        .hero-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 36px rgba(200,134,10,0.5);
        }
        .hero-btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 16px 28px;
          border-radius: 12px;
          cursor: pointer;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.16);
          color: #fff;
          font-weight: 700;
          font-size: 15px;
          backdrop-filter: blur(10px);
          transition: all 0.2s;
        }
        .hero-btn-secondary:hover { background: rgba(255,255,255,0.13); }
        .play-icon-wrapper {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(255,255,255,0.14);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .hero-social-proof {
          display: flex;
          align-items: center;
          gap: 18px;
          flex-wrap: wrap;
          justify-content: flex-start;
        }
        .avatar-group { display: flex; }
        .avatar-item {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: 2px solid #0A1F14;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 800;
          color: #fff;
        }
        .rating-info { display: flex; flex-direction: column; }
        .stars-row { display: flex; gap: 2px; margin-bottom: 2px; }
        .rating-text { font-size: 12px; color: rgba(255,255,255,0.6); }
        .hero-trust-pills {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-top: 28px;
          justify-content: flex-start;
        }
        .trust-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 100px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          font-size: 11px;
          color: rgba(255,255,255,0.7);
          font-weight: 600;
        }
        .trust-pill-icon { color: #4ADE80; }

        .hero-right {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .hero-glow-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 85%;
          height: 85%;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(26,77,46,0.6) 0%, transparent 70%);
          animation: heroGlow 5s ease-in-out infinite;
        }
        .hero-image-wrapper { animation: heroFloat 4.5s ease-in-out infinite; position: relative; z-index: 2; }
        .hero-main-img {
          width: 100%;
          max-width: 500px;
          height: auto;
          border-radius: 24px;
          filter: drop-shadow(0 40px 80px rgba(0,0,0,0.55));
        }
        .hero-card {
          position: absolute;
          z-index: 10;
          background: rgba(255,255,255,0.97);
          border-radius: 16px;
          padding: 13px 18px;
          box-shadow: 0 12px 40px rgba(0,0,0,0.22);
          display: flex;
          align-items: center;
          gap: 12px;
          border: 1px solid rgba(255,255,255,0.6);
        }
        .card-icon-green {
          width: 40px;
          height: 40px;
          border-radius: 11px;
          background: #1A4D2E;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .card-icon-gold {
          width: 40px;
          height: 40px;
          border-radius: 11px;
          background: #C8860A;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .card-value { font-size: 17px; font-weight: 900; color: #111; line-height: 1; }
        .card-label { font-size: 11px; color: #777; font-weight: 500; margin-top: 2px; }

        .hero-card-1 { top: 8%; left: -4%; animation: heroCard1 5.5s ease-in-out infinite; }
        .hero-card-2 { bottom: 14%; right: -6%; animation: heroCard2 6s ease-in-out infinite; }
        
        .hero-eco-badge {
          position: absolute; top: 42%; right: -9%; z-index: 10;
          background: rgba(255,255,255,0.96);
          border-radius: 100px; padding: 9px 16px;
          box-shadow: 0 8px 28px rgba(0,0,0,0.18);
          display: flex; alignItems: center; gap: 7px;
          animation: heroCard3 7s ease-in-out infinite;
          font-size: 12px; font-weight: 700; color: #1A4D2E; white-space: nowrap;
        }
        .hero-rating-badge {
          position: absolute; top: -4%; right: 12%; z-index: 10;
          background: rgba(255,255,255,0.96);
          border-radius: 14px; padding: 10px 16px;
          box-shadow: 0 8px 28px rgba(0,0,0,0.15);
          display: flex; alignItems: center; gap: 7px;
          animation: heroCard1 8s ease-in-out infinite 1s;
        }
        .stars-row-small { display: flex; gap: 1px; }
        .rating-score { font-size: 12px; font-weight: 800; color: #111; }

        .hero-stats {
          position: relative; z-index: 10;
          margin-top: 56px;
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px 20px 0 0;
          display: grid; grid-template-columns: repeat(4, 1fr);
          padding: 28px 24px;
        }
        .stats-item { text-align: center; padding: 0 16px; }
        .stats-num { font-size: clamp(24px, 2.5vw, 34px); font-weight: 900; font-family: 'Outfit', sans-serif; color: #FFFFFF; line-height: 1; letter-spacing: -0.02em; }
        .stats-label { font-size: 12px; color: rgba(255,255,255,0.5); margin-top: 7px; font-weight: 500; letter-spacing: 0.03em; }

        .hero-blob { position: absolute; border-radius: 50%; pointer-events: none; }
        .hero-blob-1 { top: -15%; right: -8%; width: 560px; height: 560px; background: radial-gradient(circle, rgba(200,134,10,0.13) 0%, transparent 65%); animation: heroBlob1 9s ease-in-out infinite; }
        .hero-blob-2 { bottom: -20%; left: -10%; width: 480px; height: 480px; background: radial-gradient(circle, rgba(26,77,46,0.45) 0%, transparent 65%); animation: heroBlob2 11s ease-in-out infinite; }
        .hero-blob-3 { top: 30%; left: 40%; width: 300px; height: 300px; background: radial-gradient(circle, rgba(200,134,10,0.07) 0%, transparent 65%); animation: heroBlob2 14s ease-in-out infinite reverse; }

        @keyframes heroFloat { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-18px); } }
        @keyframes heroGlow { 0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); } 50% { opacity: 0.9; transform: translate(-50%, -50%) scale(1.12); } }
        @keyframes heroBlob1 { 0%, 100% { transform: translate(0, 0) scale(1); } 33% { transform: translate(-25px, 18px) scale(1.08); } 66% { transform: translate(18px, -25px) scale(0.93); } }
        @keyframes heroBlob2 { 0%, 100% { transform: translate(0, 0) scale(1); } 33% { transform: translate(22px, -18px) scale(1.05); } 66% { transform: translate(-18px, 22px) scale(0.95); } }
        @keyframes heroCard1 { 0%, 100% { transform: translateY(0) rotate(-1.5deg); } 50% { transform: translateY(-10px) rotate(1deg); } }
        @keyframes heroCard2 { 0%, 100% { transform: translateY(0) rotate(2deg); } 50% { transform: translateY(-8px) rotate(-1deg); } }
        @keyframes heroCard3 { 0%, 100% { transform: translateX(0) rotate(-0.5deg); } 50% { transform: translateX(-6px) rotate(0.5deg); } }
        @keyframes heroPulse { 0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(200,134,10,0.4); } 50% { opacity: 0.7; box-shadow: 0 0 0 5px rgba(200,134,10,0); } }

        @media (max-width: 1024px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
          .hero-left { text-align: center; }
          .hero-actions { justify-content: center; }
          .hero-social-proof { justify-content: center; }
          .hero-trust-pills { justify-content: center; }
          .hero-subtext { margin-inline: auto; }
          .hero-right { min-height: 340px; margin-top: 40px; }
          /* Fix for floating elements on small screens */
          .hero-card-1 { left: 0; top: 0; }
          .hero-card-2 { right: 0; bottom: 0; }
          .hero-eco-badge { right: 0; top: 40%; }
          .hero-rating-badge { right: 10%; top: -10%; }
        }
        @media (max-width: 640px) {
          .hero-stats { grid-template-columns: repeat(2, 1fr) !important; }
          .hero-stats > div:nth-child(2) { border-right: none !important; }
          .hero-stats > div:nth-child(1), .hero-stats > div:nth-child(2) { border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 20px; }
          .hero-stats > div:nth-child(3), .hero-stats > div:nth-child(4) { padding-top: 20px; }
          .hero-btn-primary, .hero-btn-secondary { width: 100%; justify-content: center; }
          /* Hide decorative cards if they overlap too much */
          .hero-eco-badge { display: none; }
          .hero-rating-badge { display: none; }
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
                onClick={() => setShowVideo(true)}
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

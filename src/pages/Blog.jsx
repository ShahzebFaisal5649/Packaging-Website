import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Clock, User, ArrowUpRight, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../services/api';

const G = '#1A4D2E';
const ACCENT = '#C8860A';
const BG = '#F5F2ED';

import { POSTS } from '../data/blogData';

const CATEGORIES = ['All', 'Branding', 'E-Commerce', 'Marketing', 'Materials', 'Design'];

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [statusMsg, setStatusMsg] = useState('');
  const [focus, setFocus] = useState(false);
  const navigate = useNavigate();

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || status === 'loading') return;
    setStatus('loading');
    try {
      const res = await api.post('/content/subscribe', { email });
      // 200 = already subscribed, 201 = new
      if (res.message && res.message.toLowerCase().includes('already')) {
        setStatus('already');
        setStatusMsg("You're already subscribed.");
      } else {
        setStatus('success');
        setStatusMsg("You've successfully subscribed!");
        setEmail('');
      }
      setTimeout(() => { setStatus('idle'); setStatusMsg(''); }, 6000);
    } catch (err) {
      console.error('Newsletter error:', err);
      setStatus('error');
      setStatusMsg(err.message || 'Subscription failed. Please try again.');
    }
  };

  const filtered = activeCategory === 'All' ? POSTS : POSTS.filter(p => p.category === activeCategory);
  const featured = filtered.find(p => p.featured) || filtered[0];
  const rest = filtered.filter(p => p.id !== featured?.id);

  return (
    <div style={{ backgroundColor: BG, minHeight: '100vh', overflowX: 'hidden' }}>

      {/* Hero — Featured Post */}
      <section style={{ backgroundColor: G, position: 'relative' }}>
        {featured ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }} className="hero-split">
            <motion.div
              initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}
              style={{ padding: '120px 80px 120px 10%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
              className="hero-content-padding"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <span style={{ fontSize: 11, fontFamily: '"DM Mono", monospace', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', padding: '6px 14px', borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}>Featured</span>
                <span style={{ fontSize: 11, fontFamily: '"DM Mono", monospace', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', color: ACCENT }}>{featured.category}</span>
              </div>
              <h1 style={{ fontSize: 'clamp(36px, 4vw, 56px)', fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 800, color: '#fff', marginBottom: 24, lineHeight: 1.1 }}>{featured.title}</h1>
              <p style={{ fontSize: 16, fontFamily: '"DM Sans", sans-serif', color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, marginBottom: 40, maxWidth: 480 }}>{featured.excerpt}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 40 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}><User size={18} /></div>
                  <div>
                    <p style={{ fontSize: 13, fontFamily: '"DM Sans", sans-serif', fontWeight: 700, color: '#fff', margin: 0 }}>{featured.author}</p>
                    <p style={{ fontSize: 11, fontFamily: '"DM Mono", monospace', color: 'rgba(255,255,255,0.5)', margin: 0 }}>{featured.date}</p>
                  </div>
                </div>
                <div style={{ width: 1, height: 30, backgroundColor: 'rgba(255,255,255,0.2)' }} />
                <div style={{ fontSize: 12, fontFamily: '"DM Mono", monospace', color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Clock size={14} /> {featured.readTime}
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.03 }}
                onClick={() => navigate(`/blog/${featured.id}`)}
                style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 8, padding: '16px 32px', backgroundColor: ACCENT, color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontFamily: '"DM Sans", sans-serif', fontSize: 14, cursor: 'pointer' }}
              >
                Read Article <ArrowRight size={16} />
              </motion.button>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}
              style={{ position: 'relative', minHeight: 400, overflow: 'hidden' }}>
              <motion.img initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 1.5, ease: 'easeOut' }}
                src={featured.img} alt={featured.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, #1A4D2E -5%, transparent 30%)' }} className="hero-gradient-overlay" />
            </motion.div>
          </div>
        ) : (
          <div style={{ padding: '120px 24px', textAlign: 'center' }}>
            <h1 style={{ fontSize: 48, fontFamily: '"Playfair Display", Georgia, serif', color: '#fff' }}>Design Journal</h1>
          </div>
        )}
      </section>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px' }}>

        {/* Category Filter */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 64, borderBottom: '1px solid #E8E4DC', paddingBottom: 24 }}>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setActiveCategory(c)}
              style={{ position: 'relative', padding: '8px 20px', borderRadius: 100, fontSize: 13, fontFamily: '"DM Sans", sans-serif', fontWeight: 600, cursor: 'pointer', border: 'none', background: 'none', color: activeCategory === c ? '#fff' : '#6B6B6B', transition: 'color 0.2s', zIndex: 1, touchAction: 'manipulation' }}>
              {activeCategory === c && (
                <motion.div layoutId="activeCategory"
                  style={{ position: 'absolute', inset: 0, backgroundColor: G, borderRadius: 100, zIndex: -1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
              )}
              {c}
            </button>
          ))}
        </div>

        {/* Article Grid */}
        <motion.div layout style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }} className="bento-grid">
          <AnimatePresence mode="popLayout">
            {rest.map((post, i) => {
              const isLarge = i % 5 === 0 && rest.length > 2;
              return (
                <motion.article
                  layout
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, type: 'spring', bounce: 0.2 }}
                  key={post.id}
                  onClick={() => navigate(`/blog/${post.id}`)}
                  style={{
                    backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', border: '1px solid #E2DDD6',
                    gridColumn: isLarge ? 'span 2' : 'span 1',
                    display: 'flex', flexDirection: isLarge ? 'row' : 'column',
                    cursor: 'pointer',
                  }}
                  className={`bento-card ${isLarge ? 'bento-large' : ''} group`}
                >
                  <div style={{ width: isLarge ? '50%' : '100%', height: isLarge ? '100%' : 240, overflow: 'hidden', position: 'relative' }} className="bento-image-container">
                    <img src={post.img} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1)' }} className="group-hover:scale-105" />
                    <div style={{ position: 'absolute', top: 16, left: 16, backgroundColor: '#fff', color: G, fontSize: 10, fontFamily: '"DM Mono", monospace', fontWeight: 600, padding: '4px 12px', borderRadius: 100, textTransform: 'uppercase', letterSpacing: '0.1em', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                      {post.category}
                    </div>
                  </div>
                  <div style={{ width: isLarge ? '50%' : '100%', padding: '32px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }} className="bento-content">
                    <h3 style={{ fontSize: isLarge ? 24 : 18, fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 700, color: '#1A1A1A', marginBottom: 12, lineHeight: 1.25, marginTop: 0 }} className="group-hover:text-accent">
                      {post.title}
                    </h3>
                    <p style={{ fontSize: 14, fontFamily: '"DM Sans", sans-serif', color: '#6B6B6B', lineHeight: 1.6, marginBottom: 24, display: '-webkit-box', WebkitLineClamp: isLarge ? 4 : 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', textAlign: 'justify' }}>
                      {post.excerpt}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 20, borderTop: '1px solid #F0EDE8' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontFamily: '"DM Mono", monospace', color: '#9A9080' }}>
                        <span style={{ fontWeight: 500, color: G }}>{post.author}</span>
                        <span>•</span>
                        <span>{post.date}</span>
                      </div>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: `${ACCENT}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: ACCENT }}>
                        <ArrowUpRight size={16} />
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '100px 24px', color: '#9A9080' }}>
            <p style={{ fontSize: 18, fontFamily: '"DM Sans", sans-serif' }}>No posts found in this category.</p>
          </div>
        )}

        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          style={{ marginTop: 100, backgroundColor: '#fff', borderRadius: 24, display: 'flex', overflow: 'hidden', border: '1px solid #E8E4DC', boxShadow: '0 24px 48px rgba(0,0,0,0.04)' }}
          className="newsletter-split"
        >
          <div style={{ flex: 1, padding: '64px 56px', backgroundColor: G, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -100, right: -100, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(200,134,10,0.15) 0%, transparent 70%)' }} />
            <p style={{ fontSize: 12, fontFamily: '"DM Mono", monospace', fontWeight: 500, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 16 }}>Stay Updated</p>
            <h3 style={{ fontSize: 'clamp(28px, 3vw, 40px)', fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 700, color: '#fff', marginBottom: 12, lineHeight: 1.1 }}>Industry Insights <br />in your inbox.</h3>
            <p style={{ fontSize: 15, fontFamily: '"DM Sans", sans-serif', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, margin: 0 }}>Get the latest packaging trends, material guides, and design inspiration delivered weekly.</p>
          </div>

          <div style={{ flex: 1, padding: '64px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <form onSubmit={handleSubscribe} style={{ width: '100%', maxWidth: 400 }}>
              <div style={{ position: 'relative', marginBottom: 24 }}>
                <label style={{
                  position: 'absolute', left: 0, top: (focus || email) ? -20 : 12, fontSize: (focus || email) ? 11 : 15,
                  fontFamily: (focus || email) ? '"DM Mono", monospace' : '"DM Sans", sans-serif',
                  color: (focus || email) ? ACCENT : '#9A9080', textTransform: (focus || email) ? 'uppercase' : 'none',
                  letterSpacing: (focus || email) ? '0.1em' : 'normal', transition: 'all 0.2s ease', pointerEvents: 'none',
                }}>Email Address</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
                  disabled={status === 'loading' || status === 'success' || status === 'already'}
                  style={{ width: '100%', padding: '12px 0', fontSize: 16, fontFamily: '"DM Sans", sans-serif', color: '#1A1A1A', border: 'none', borderBottom: `2px solid ${focus ? ACCENT : '#E2DDD6'}`, outline: 'none', backgroundColor: 'transparent', transition: 'border-color 0.2s' }}
                />
              </div>

              <button type="submit" disabled={status === 'loading' || status === 'success' || status === 'already'}
                style={{
                  width: '100%', padding: '16px', backgroundColor: status === 'success' ? '#059669' : status === 'already' ? '#6B7280' : G,
                  color: '#fff', border: 'none', borderRadius: 8, fontFamily: '"DM Sans", sans-serif', fontWeight: 700, fontSize: 14,
                  cursor: (['loading','success','already'].includes(status)) ? 'default' : 'pointer', transition: 'all 0.3s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}>
                {status === 'loading' ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} />
                ) : status === 'success' ? (
                  <><CheckCircle size={16} /> {statusMsg}</>
                ) : status === 'already' ? (
                  statusMsg
                ) : (
                  <>Subscribe Now <ArrowRight size={16} /></>
                )}
              </button>

              {status === 'error' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, color: '#DC2626', fontSize: 13, fontFamily: '"DM Sans", sans-serif' }}>
                  <AlertCircle size={14} /> {statusMsg}
                </div>
              )}
            </form>
          </div>
        </motion.div>
      </div>

      <style>{`
        .group:hover .group-hover\\:scale-105 { transform: scale(1.05); }
        .group:hover .group-hover\\:text-accent { color: ${ACCENT} !important; }
        @media (max-width: 900px) {
          .hero-split { grid-template-columns: 1fr !important; }
          .hero-content-padding { padding: 80px 24px !important; text-align: center; align-items: center; }
          .hero-gradient-overlay { display: none; }
          .bento-large { grid-column: span 1 !important; flex-direction: column !important; }
          .bento-image-container { width: 100% !important; height: 240px !important; }
          .bento-content { width: 100% !important; }
          .newsletter-split { flex-direction: column !important; }
        }
        @media (max-width: 480px) {
          .newsletter-split > div { padding: 40px 24px !important; }
        }
      `}</style>
    </div>
  );
}

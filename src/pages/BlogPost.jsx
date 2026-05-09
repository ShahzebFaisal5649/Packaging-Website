import { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, ArrowLeft, Share2, ArrowRight, Ban, AlertCircle } from 'lucide-react';
import { POSTS } from '../data/blogData';

const G = '#1A4D2E';
const ACCENT = '#C8860A';
const BG = '#F5F2ED';

// Inline SVG Social Icons
const FacebookIcon = ({ size = 18 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>;
const TwitterIcon = ({ size = 18 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-1 2.17-2.41 3.06c0 5.69-4.24 12.22-12.22 12.22-2.34 0-4.59-.69-6.5-1.99.31.04.62.06.94.06 1.94 0 3.72-.66 5.13-1.77-1.82-.03-3.35-1.24-3.88-2.89.25.04.51.06.77.06.38 0 .75-.05 1.1-.15-1.9-.38-3.32-2.05-3.32-4.06v-.05c.56.31 1.2.5 1.88.52-1.12-.74-1.85-2-1.85-3.42 0-.75.2-1.45.56-2.05 2.05 2.51 5.11 4.17 8.56 4.34-.07-.3-.11-.61-.11-.93 0-2.25 1.82-4.08 4.08-4.08 1.17 0 2.23.49 2.97 1.28.93-.18 1.8-.52 2.59-1-.31 1-.98 1.84-1.87 2.37.82-.1 1.61-.31 2.34-.64-.54.81-1.23 1.52-2.03 2.09z"/></svg>;
const LinkedinIcon = ({ size = 18 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>;

export default function BlogPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  // Safely find the post
  const post = useMemo(() => {
    try {
      if (!id) return null;
      return POSTS.find(p => String(p.id) === String(id));
    } catch (err) {
      console.error("Blog lookup error:", err);
      return null;
    }
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Handle missing post or render error
  if (!post) {
    return (
      <div style={{ backgroundColor: BG, minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, textAlign: 'center' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, color: '#DC2626' }}>
          <AlertCircle size={40} />
        </div>
        <h1 style={{ fontSize: 32, fontFamily: '"Playfair Display", serif', color: G, marginBottom: 16 }}>Article Not Found</h1>
        <p style={{ fontSize: 16, fontFamily: '"DM Sans", sans-serif', color: '#666', marginBottom: 32, maxWidth: 400 }}>
          The article you are looking for doesn't exist or has been moved.
        </p>
        <Link to="/blog" style={{ backgroundColor: G, color: '#fff', padding: '14px 32px', borderRadius: 12, textDecoration: 'none', fontWeight: 700, transition: 'all 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
          Return to Blog
        </Link>
      </div>
    );
  }

  // Safely calculate related posts
  const relatedPosts = useMemo(() => {
    try {
      return (POSTS || []).filter(p => p.id !== post.id && (p.category === post.category)).slice(0, 3);
    } catch (err) {
      return [];
    }
  }, [post]);

  return (
    <div style={{ backgroundColor: BG, minHeight: '100vh', paddingBottom: 120 }}>
      {/* Hero Section */}
      <section style={{ position: 'relative', height: 500, overflow: 'hidden' }}>
        <motion.img 
          initial={{ scale: 1.1 }} 
          animate={{ scale: 1 }} 
          transition={{ duration: 1.5 }}
          src={post.img || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600&q=80'} 
          alt={post.title} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(26,77,46,0.45)', backdropFilter: 'blur(2px)' }} />
        
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', padding: '0 24px 80px' }}>
          <div style={{ maxWidth: 900, margin: '0 auto', width: '100%' }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <span style={{ 
                backgroundColor: ACCENT, color: '#fff', padding: '6px 16px', borderRadius: 100, 
                fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em',
                marginBottom: 24, display: 'inline-block'
              }}>
                {post.category}
              </span>
              <h1 style={{ 
                fontSize: 'clamp(32px, 5vw, 56px)', fontFamily: '"Playfair Display", serif', 
                fontWeight: 900, color: '#fff', lineHeight: 1.1, marginBottom: 24, textShadow: '0 2px 10px rgba(0,0,0,0.2)'
              }}>
                {post.title}
              </h1>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, color: 'rgba(255,255,255,0.9)', fontSize: 14, fontWeight: 500 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><User size={18} color={ACCENT} /> {post.author}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Calendar size={18} color={ACCENT} /> {post.date}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Clock size={18} color={ACCENT} /> {post.readTime || '5 min read'}</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section style={{ maxWidth: 1200, margin: '-60px auto 0', padding: '0 24px', position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 60 }} className="blog-container">
          <div style={{ backgroundColor: '#fff', padding: '60px 80px', borderRadius: 24, boxShadow: '0 20px 50px rgba(0,0,0,0.05)' }} className="article-body">
            <Link to="/blog" style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#666', textDecoration: 'none', fontSize: 14, fontWeight: 700, marginBottom: 40 }} onMouseEnter={e => e.currentTarget.style.color = G} onMouseLeave={e => e.currentTarget.style.color = '#666'}>
              <ArrowLeft size={16} /> Back to Blog
            </Link>

            <div 
              style={{ 
                fontSize: 18, lineHeight: 1.9, color: '#333', fontFamily: '"DM Sans", sans-serif',
                display: 'flex', flexDirection: 'column', gap: 28, textAlign: 'justify'
              }}
              className="blog-content-html"
              dangerouslySetInnerHTML={{ __html: post.content || '<p>Content coming soon...</p>' }}
            />

            <hr style={{ margin: '60px 0', border: 'none', borderTop: '1px solid #E8E4DC' }} />

            <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
              {['Packaging', 'Branding', 'Design', 'Marketing'].map(tag => (
                <span key={tag} style={{ backgroundColor: '#F5F2ED', padding: '6px 16px', borderRadius: 100, fontSize: 13, color: '#666', fontWeight: 600 }}>#{tag}</span>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="blog-sidebar">
            <div style={{ position: 'sticky', top: 100 }}>
              <div style={{ background: G, padding: 32, borderRadius: 20, color: '#fff' }}>
                <h3 style={{ fontSize: 24, fontFamily: '"Playfair Display", serif', marginBottom: 16 }}>Need Custom Boxes?</h3>
                <p style={{ fontSize: 15, opacity: 0.8, lineHeight: 1.6, marginBottom: 24 }}>Transform your brand with premium packaging designed specifically for your products.</p>
                <Link to="/custom-box" style={{ display: 'block', textAlign: 'center', background: ACCENT, color: '#fff', padding: '14px', borderRadius: 12, textDecoration: 'none', fontWeight: 700 }}>Start Designing</Link>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section style={{ maxWidth: 1200, margin: '100px auto 0', padding: '0 24px' }}>
          <h2 style={{ fontSize: 32, fontFamily: '"Playfair Display", serif', color: G, marginBottom: 40, textAlign: 'center' }}>Continue Reading</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32 }}>
            {relatedPosts.map(p => (
              <motion.div 
                key={p.id}
                whileHover={{ y: -10 }}
                onClick={() => navigate(`/blog/${p.id}`)}
                style={{ backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden', border: '1px solid #E2DDD6', cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}
              >
                <img src={p.img} alt={p.title} style={{ width: '100%', height: 220, objectFit: 'cover' }} />
                <div style={{ padding: 24 }}>
                  <span style={{ color: ACCENT, fontSize: 12, fontWeight: 700, textTransform: 'uppercase' }}>{p.category}</span>
                  <h3 style={{ fontSize: 20, fontFamily: '"Playfair Display", serif', color: G, margin: '12px 0', lineHeight: 1.4 }}>{p.title}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 24 }}>
                    <span style={{ fontSize: 13, color: '#888' }}>{p.date}</span>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: `${G}10`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: G }}>
                      <ArrowRight size={18} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      <style>{`
        @media (max-width: 1024px) {
          .blog-container { grid-template-columns: 1fr !important; }
          .blog-sidebar { display: none; }
        }
        @media (max-width: 768px) {
          .article-body { padding: 40px 24px !important; }
        }
        .blog-content-html h2 { font-family: "Playfair Display", serif; color: ${G}; margin-top: 20px; margin-bottom: 10px; }
        .blog-content-html p { margin-bottom: 20px; }
      `}</style>
    </div>
  );
}

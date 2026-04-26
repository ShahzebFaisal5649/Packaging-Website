import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, User } from 'lucide-react';

const G = '#1A4D2E';
const ACCENT = '#C8860A';
const BG = '#F5F2ED';

const POSTS = [
  {
    id: 1,
    title: 'How Custom Packaging Boosts Brand Recognition',
    excerpt: 'Discover how investing in custom packaging creates a lasting first impression that keeps customers coming back and sharing on social media.',
    author: 'Sarah Mitchell',
    date: 'Apr 12, 2025',
    readTime: '5 min read',
    category: 'Branding',
    img: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80',
    featured: true,
  },
  {
    id: 2,
    title: '10 Sustainable Packaging Trends for 2025',
    excerpt: 'From FSC-certified kraft to soy-based inks and compostable liners — the top eco-friendly packaging trends brands are adopting this year.',
    author: 'James Kowalski',
    date: 'Apr 5, 2025',
    readTime: '7 min read',
    category: 'Sustainability',
    img: 'https://images.unsplash.com/photo-1619468579487-430c4d90f93b?w=600&q=80',
    featured: false,
  },
  {
    id: 3,
    title: 'The Ultimate Guide to Box Styles for E-Commerce',
    excerpt: 'Mailer boxes, shipping boxes, or rigid setup boxes? We break down which box type is right for your products and price point.',
    author: 'Lisa Romero',
    date: 'Mar 28, 2025',
    readTime: '8 min read',
    category: 'E-Commerce',
    img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80',
    featured: false,
  },
  {
    id: 4,
    title: 'Why Unboxing Experience Matters for Customer Retention',
    excerpt: 'Studies show 40% of consumers share unboxing content online. Here\'s how to design packaging that turns buyers into brand ambassadors.',
    author: 'Mark Torres',
    date: 'Mar 20, 2025',
    readTime: '6 min read',
    category: 'Marketing',
    img: 'https://images.unsplash.com/photo-1553531384-cc64ac80f931?w=600&q=80',
    featured: false,
  },
  {
    id: 5,
    title: 'Choosing the Right Material for Your Product Packaging',
    excerpt: 'SBS board, corrugated flute, kraft, or rigid chipboard? A practical guide to matching your material to your product and budget.',
    author: 'Anna Petrov',
    date: 'Mar 15, 2025',
    readTime: '6 min read',
    category: 'Materials',
    img: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&q=80',
    featured: false,
  },
  {
    id: 6,
    title: 'Print Finishes Explained: Matte, Gloss, Soft-Touch & More',
    excerpt: 'Not sure which lamination or finish to choose? We explain every option — from spot UV to foil stamping — with real-world examples.',
    author: 'Sarah Mitchell',
    date: 'Mar 8, 2025',
    readTime: '5 min read',
    category: 'Design',
    img: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&q=80',
    featured: false,
  },
];

const CATEGORIES = ['All', 'Branding', 'Sustainability', 'E-Commerce', 'Marketing', 'Materials', 'Design'];

const CATEGORY_COLORS = {
  Branding: ACCENT,
  Sustainability: '#2E7D32',
  'E-Commerce': '#1565C0',
  Marketing: '#7B1FA2',
  Materials: '#5D4037',
  Design: '#C62828',
};

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All'
    ? POSTS
    : POSTS.filter(p => p.category === activeCategory);

  const featured = filtered.find(p => p.featured) || filtered[0];
  const rest = filtered.filter(p => p.id !== featured?.id);

  return (
    <div style={{ backgroundColor: BG, minHeight: '100vh' }}>

      {/* Hero */}
      <section style={{ backgroundColor: G, paddingTop: 120, paddingBottom: 64, paddingLeft: 24, paddingRight: 24 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 14 }}>
            NovaPack Journal
          </p>
          <h1 style={{ fontSize: 'clamp(28px,4.5vw,52px)', fontFamily: 'Outfit,sans-serif', fontWeight: 800, color: '#fff', marginBottom: 14 }}>
            Packaging Insights & Trends
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.65)', maxWidth: 520, margin: '0 auto' }}>
            Expert tips, industry trends, and design inspiration to help your brand stand out.
          </p>
        </div>
      </section>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '56px 24px' }}>

        {/* Category filter */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 48 }}>
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              style={{
                padding: '7px 18px', borderRadius: 100, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                backgroundColor: activeCategory === c ? ACCENT : 'transparent',
                color: activeCategory === c ? '#fff' : '#6B6B6B',
                border: `2px solid ${activeCategory === c ? ACCENT : '#D0CAC0'}`,
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { if (activeCategory !== c) { e.currentTarget.style.borderColor = ACCENT; e.currentTarget.style.color = ACCENT; } }}
              onMouseLeave={e => { if (activeCategory !== c) { e.currentTarget.style.borderColor = '#D0CAC0'; e.currentTarget.style.color = '#6B6B6B'; } }}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Featured post */}
        {featured && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, marginBottom: 56, backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', border: '1px solid #E2DDD6', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }} className="featured-post">
            <div style={{ height: '100%', minHeight: 320, overflow: 'hidden', position: 'relative' }}>
              <img src={featured.img} alt={featured.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.5s' }}
                onMouseEnter={e => e.target.style.transform = 'scale(1.04)'}
                onMouseLeave={e => e.target.style.transform = 'scale(1)'}
              />
              <div style={{ position: 'absolute', top: 16, left: 16, backgroundColor: ACCENT, color: '#fff', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', padding: '4px 10px', borderRadius: 100 }}>
                Featured
              </div>
            </div>
            <div style={{ padding: '40px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', padding: '3px 10px', borderRadius: 100, backgroundColor: `${CATEGORY_COLORS[featured.category] || G}18`, color: CATEGORY_COLORS[featured.category] || G }}>
                  {featured.category}
                </span>
                <span style={{ fontSize: 11, color: '#9A9080', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Clock size={11} /> {featured.readTime}
                </span>
              </div>
              <h2 style={{ fontSize: 'clamp(20px,2.5vw,28px)', fontFamily: 'Outfit,sans-serif', fontWeight: 800, color: '#1A1A1A', marginBottom: 14, lineHeight: 1.2 }}>
                {featured.title}
              </h2>
              <p style={{ fontSize: 14, color: '#6B6B6B', lineHeight: 1.7, marginBottom: 24 }}>{featured.excerpt}</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#6B6B6B' }}>
                  <User size={13} /> {featured.author} · {featured.date}
                </div>
                <Link to="/blog" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: G, textDecoration: 'none' }}
                  onMouseEnter={e => e.currentTarget.style.color = ACCENT}
                  onMouseLeave={e => e.currentTarget.style.color = G}>
                  Read Article <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Post grid */}
        {rest.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }} className="blog-grid">
            {rest.map(post => (
              <article
                key={post.id}
                style={{ backgroundColor: '#fff', borderRadius: 14, overflow: 'hidden', border: '1px solid #E2DDD6', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', transition: 'box-shadow 0.2s, transform 0.2s', cursor: 'pointer' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.10)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)'; e.currentTarget.style.transform = 'none'; }}
              >
                <div style={{ height: 200, overflow: 'hidden' }}>
                  <img src={post.img} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s' }}
                    onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                    onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                  />
                </div>
                <div style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', padding: '2px 8px', borderRadius: 100, backgroundColor: `${CATEGORY_COLORS[post.category] || G}18`, color: CATEGORY_COLORS[post.category] || G }}>
                      {post.category}
                    </span>
                    <span style={{ fontSize: 10, color: '#9A9080', display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Clock size={10} /> {post.readTime}
                    </span>
                  </div>
                  <h3 style={{ fontSize: 15, fontFamily: 'Outfit,sans-serif', fontWeight: 700, color: '#1A1A1A', marginBottom: 8, lineHeight: 1.3 }}>{post.title}</h3>
                  <p style={{ fontSize: 12, color: '#6B6B6B', lineHeight: 1.65, marginBottom: 16, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{post.excerpt}</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 14, borderTop: '1px solid #F0EDE8' }}>
                    <span style={{ fontSize: 11, color: '#9A9080', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <User size={11} /> {post.author}
                    </span>
                    <span style={{ fontSize: 11, color: '#9A9080' }}>{post.date}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '64px 24px', color: '#9A9080' }}>
            <p style={{ fontSize: 16, fontWeight: 600 }}>No posts in this category yet.</p>
          </div>
        )}

        {/* Newsletter CTA */}
        <div style={{ marginTop: 72, backgroundColor: G, borderRadius: 16, padding: '48px 40px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
          <div>
            <h3 style={{ fontSize: 22, fontFamily: 'Outfit,sans-serif', fontWeight: 800, color: '#fff', marginBottom: 6 }}>Get Packaging Tips in Your Inbox</h3>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)' }}>New articles every week. No spam, ever.</p>
          </div>
          <form style={{ display: 'flex', gap: 0, minWidth: 320, flex: 1, maxWidth: 440 }} onSubmit={e => e.preventDefault()}>
            <input
              type="email"
              placeholder="your@email.com"
              required
              style={{ flex: 1, padding: '12px 16px', border: 'none', borderRadius: '8px 0 0 8px', fontSize: 14, outline: 'none', backgroundColor: 'rgba(255,255,255,0.12)', color: '#fff' }}
            />
            <button type="submit" style={{ padding: '12px 20px', backgroundColor: ACCENT, color: '#fff', border: 'none', borderRadius: '0 8px 8px 0', fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
              Subscribe <ArrowRight size={14} />
            </button>
          </form>
        </div>

      </div>

      <style>{`
        @media (max-width: 900px) {
          .featured-post { grid-template-columns: 1fr !important; }
          .blog-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 600px) {
          .blog-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

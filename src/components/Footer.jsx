import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, MapPin, Mail, ChevronRight } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import logo from '../assets/logo.png';
import api from '../services/api';

import { FaFacebook, FaXTwitter } from 'react-icons/fa6';

const ACCENT = '#C8860A';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const year = new Date().getFullYear();

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      const data = await api.post('/content/subscribe', { email: email.trim() });
      showToast(data.message || 'Successfully subscribed!', 'success');
      setEmail('');
    } catch (err) {
      showToast(err.message || 'Subscription failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const FooterLink = ({ to, children }) => (
    <li>
      <Link 
        to={to} 
        style={{ 
          fontSize: 14, fontFamily: 'DM Sans, sans-serif', color: 'rgba(255,255,255,0.6)', 
          textDecoration: 'none', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 4 
        }}
        onMouseEnter={e => { e.target.style.color = '#fff'; e.target.style.transform = 'translateX(4px)'; }}
        onMouseLeave={e => { e.target.style.color = 'rgba(255,255,255,0.6)'; e.target.style.transform = 'none'; }}
      >
        <ChevronRight size={12} style={{ opacity: 0.5 }} />
        {children}
      </Link>
    </li>
  );

  return (
    <footer style={{ backgroundColor: '#0F2E1A', color: '#fff', borderTop: `1px solid ${ACCENT}` }}>
      
      {/* Upper Footer — Newsletter */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '80px 24px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 40 }}>
          <div style={{ maxWidth: 500 }}>
            <h3 style={{ fontSize: 32, fontFamily: '"Playfair Display", serif', fontWeight: 800, marginBottom: 16 }}>Join the Packaging Revolution</h3>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>Get exclusive design tips, material insights, and industry updates delivered to your inbox.</p>
          </div>
          <form style={{ display: 'flex', gap: 12, width: '100%', maxWidth: 450, flexWrap: 'wrap' }} onSubmit={handleSubscribe} className="footer-subscribe-form">
            <input
              type="email"
              placeholder="Email address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ flex: '1 1 200px', minWidth: 0, backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '16px 20px', color: '#fff', outline: 'none', boxSizing: 'border-box' }}
            />
            <button 
              type="submit" 
              disabled={loading}
              style={{ backgroundColor: ACCENT, color: '#fff', border: 'none', borderRadius: 12, padding: '16px 32px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0, whiteSpace: 'nowrap' }}
              onMouseEnter={e => e.target.style.backgroundColor = '#b37308'}
              onMouseLeave={e => e.target.style.backgroundColor = ACCENT}
            >
              {loading ? '...' : 'Subscribe'}
            </button>
          </form>
        </div>
      </div>

      {/* Middle Footer — Grid */}
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 40 }} className="footer-grid">
          
          {/* Brand Col */}
          <div style={{ gridColumn: 'span 2' }} className="brand-col">
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, textDecoration: 'none' }}>
              <img src={logo} alt="Logo" style={{ height: 40, width: 'auto' }} />
              <span style={{ fontSize: 20, fontWeight: 800, fontFamily: '"Playfair Display", serif', color: '#fff' }}>
                DESIGN CUSTOM <span style={{ color: ACCENT }}>BOX</span>
              </span>
            </Link>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, lineHeight: 1.8, marginBottom: 32, maxWidth: 300 }}>
              Leading provider of premium custom packaging solutions. We help brands tell their story through exceptional structural design and high-end printing.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              {[
                { Icon: FaFacebook, href: 'https://facebook.com/designcustombox' },
                { Icon: FaXTwitter, href: 'https://twitter.com/designcustombox' },
              ].map((s, i) => (
                <a key={i} href={s.href} target="_blank" rel="noreferrer" style={{ 
                  width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.05)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', transition: 'all 0.2s' 
                }} onMouseEnter={e => { e.currentTarget.style.backgroundColor = ACCENT; e.currentTarget.style.transform = 'translateY(-3px)'; }} onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.transform = 'none'; }}>
                  <s.Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Products */}
          <div className="links-col">
            <h4 style={{ fontSize: 11, fontWeight: 700, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 24 }}>Products</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <FooterLink to="/products">Mailer Boxes</FooterLink>
              <FooterLink to="/products">Shipping Boxes</FooterLink>
              <FooterLink to="/products">Product Boxes</FooterLink>
              <FooterLink to="/products">Rigid Boxes</FooterLink>
              <FooterLink to="/products">Folding Cartons</FooterLink>
            </ul>
          </div>

          {/* Industries */}
          <div className="links-col">
            <h4 style={{ fontSize: 11, fontWeight: 700, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 24 }}>Industries</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <FooterLink to="/industries">Cosmetics</FooterLink>
              <FooterLink to="/industries">E-commerce</FooterLink>
              <FooterLink to="/industries">Food & Beverage</FooterLink>
              <FooterLink to="/industries">Retail</FooterLink>
              <FooterLink to="/industries">Electronics</FooterLink>
            </ul>
          </div>

          {/* Resources */}
          <div className="links-col">
            <h4 style={{ fontSize: 11, fontWeight: 700, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 24 }}>Resources</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <FooterLink to="/blog">Our Blog</FooterLink>
              <FooterLink to="/how-it-works">How It Works</FooterLink>
              <FooterLink to="/success-stories">Inspiration</FooterLink>
              <FooterLink to="/faqs">FAQs</FooterLink>
              <FooterLink to="/contact-us">Help Center</FooterLink>
            </ul>
          </div>


        </div>
      </div>

      {/* Lower Footer — Info Bar */}
      <div style={{ backgroundColor: 'rgba(0,0,0,0.2)', padding: '40px 24px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 40, alignItems: 'center' }} className="bottom-grid">
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: ACCENT }}>
              <Phone size={20} />
            </div>
            <div>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: 0 }}>Call Support</p>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: 0 }}>(913) 228-2682</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: ACCENT }}>
              <Mail size={20} />
            </div>
            <div>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: 0 }}>Email Us</p>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: 0 }}>Designcustombox@gmail.com</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: ACCENT }}>
              <MapPin size={20} />
            </div>
            <div>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: 0 }}>Visit Us</p>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: 0 }}>The Colony, Texas, US 75056</p>
            </div>
          </div>

        </div>
        
        <div style={{ maxWidth: 1400, margin: '40px auto 0', paddingTop: 40, borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', margin: 0 }}>
            © {year} Design Custom Box. All rights reserved. Managed by NextStac.
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 1200px) {
          .footer-grid { grid-template-columns: repeat(3, 1fr) !important; }
          .brand-col { grid-column: span 3 !important; text-align: center; display: flex; flex-direction: column; align-items: center; }
          .brand-col p { max-width: 500px !important; }
        }
        @media (max-width: 900px) {
          .bottom-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
        @media (max-width: 600px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
          .brand-col { grid-column: span 2 !important; }
          .footer-subscribe-form { flex-direction: column !important; }
          .footer-subscribe-form input { width: 100% !important; flex: unset !important; }
          .footer-subscribe-form button { width: 100% !important; }
          .footer-upper-inner { flex-direction: column !important; align-items: flex-start !important; gap: 24px !important; }
        }
      `}</style>
    </footer>
  );
}

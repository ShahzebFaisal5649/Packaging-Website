import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, Menu, X, ShoppingCart, User, LogOut, Settings, Package, UserCircle, Heart, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useFavourites } from '../context/FavouritesContext';
import logo from '../assets/logo.png';

const G = '#1A4D2E';
const ACCENT = '#C8860A';

const productCategories = {
  col1: [
    { name: 'Bottom Closure', desc: 'Secure base for heavier items' },
    { name: 'CD Covers', desc: 'Classic media packaging' },
    { name: 'Figure & Pattern', desc: 'Unique structural shapes' },
    { name: 'Fold & Assemble', desc: 'Easy-fold shipping solutions' },
  ],
  col2: [
    { name: 'Rectangular', desc: 'Standard versatile boxes' },
    { name: 'Showcase Exhibit', desc: 'Display-ready packaging' },
    { name: 'Top Closure', desc: 'Classic tuck-top design' },
    { name: 'Tuck End Boxes', desc: 'Simple and elegant' },
  ]
};

const industryCategories = {
  col1: [
    { name: 'Apparel & Fashion', desc: 'Clothing and accessories' },
    { name: 'Candle Boxes', desc: 'Protective and premium' },
    { name: 'CBD Packaging', desc: 'Compliant and secure' },
    { name: 'Cosmetic Boxes', desc: 'Beauty and skincare' },
  ],
  col2: [
    { name: 'Ecommerce Boxes', desc: 'Durable shipping solutions' },
    { name: 'Food & Beverage', desc: 'Food-safe materials' },
    { name: 'Retail Boxes', desc: 'Shelf-ready packaging' },
    { name: 'Shipping & Mailers', desc: 'Cost-effective transit' },
  ]
};

// ── Hook: track window width ──
function useWindowWidth() {
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return width;
}

const MegaMenu = ({ categories, title, isOpen, setActiveMenu }) => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      right: 0,
      top: '100%',
      transition: 'opacity 0.2s ease, transform 0.2s ease',
      overflow: 'hidden',
      boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
      zIndex: 9999,
      background: '#fff',
      borderTop: `3px solid ${ACCENT}`,
      opacity: isOpen ? 1 : 0,
      transform: isOpen ? 'translateY(0)' : 'translateY(-12px)',
      visibility: isOpen ? 'visible' : 'hidden',
      pointerEvents: isOpen ? 'auto' : 'none',
    }}
    onMouseEnter={() => setActiveMenu(title)}
    onMouseLeave={() => setActiveMenu(null)}
  >
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 32 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
        <div>
          <h4 style={{ fontSize: 10, fontWeight: 500, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 20, fontFamily: 'DM Mono, monospace' }}>Popular Categories</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {categories.col1.map((item, idx) => (
              <Link key={idx} to={`/${title.toLowerCase()}/${item.name.toLowerCase().replace(/ /g, '-')}`}
                style={{ textDecoration: 'none' }} onClick={() => setActiveMenu(null)}>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A', display: 'block', transition: 'color 0.15s' }}
                  onMouseEnter={e => e.target.style.color = G} onMouseLeave={e => e.target.style.color = '#1A1A1A'}>{item.name}</span>
                <span style={{ fontSize: 12, color: '#888', display: 'block', marginTop: 2 }}>{item.desc}</span>
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h4 style={{ fontSize: 10, fontWeight: 500, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 20, fontFamily: 'DM Mono, monospace' }}>More Categories</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {categories.col2.map((item, idx) => (
              <Link key={idx} to={`/${title.toLowerCase()}/${item.name.toLowerCase().replace(/ /g, '-')}`}
                style={{ textDecoration: 'none' }} onClick={() => setActiveMenu(null)}>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A', display: 'block', transition: 'color 0.15s' }}
                  onMouseEnter={e => e.target.style.color = G} onMouseLeave={e => e.target.style.color = '#1A1A1A'}>{item.name}</span>
                <span style={{ fontSize: 12, color: '#888', display: 'block', marginTop: 2 }}>{item.desc}</span>
              </Link>
            ))}
            <Link to={`/${title.toLowerCase()}`} onClick={() => setActiveMenu(null)}
              style={{ display: 'inline-block', marginTop: 8, fontSize: 13, fontWeight: 700, color: G, borderBottom: `1px solid ${G}`, paddingBottom: 1, textDecoration: 'none', transition: 'color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.color = ACCENT} onMouseLeave={e => e.currentTarget.style.color = G}>
              View All {title} &rarr;
            </Link>
          </div>
        </div>
      </div>
      <div style={{ borderRadius: 12, overflow: 'hidden', position: 'relative', minHeight: 220 }}>
        <img
          src={title === 'Products'
            ? 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=700&q=80'
            : 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=700&q=80'}
          alt="Featured"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 60%)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, padding: 20 }}>
          <span style={{ display: 'inline-block', padding: '3px 10px', background: ACCENT, color: '#fff', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', borderRadius: 4, marginBottom: 8 }}>Featured</span>
          <h4 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 6 }}>Sustainable Packaging</h4>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>FSC-certified materials for eco-conscious brands.</p>
        </div>
      </div>
    </div>
  </div>
);

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [notificationsDropdownOpen, setNotificationsDropdownOpen] = useState(false);
  const navRef = useRef(null);

  const width = useWindowWidth();
  const isDesktop = width >= 1024;

  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount, toggleDrawer } = useCart();
  const { showToast } = useToast();
  const { count: favCount } = useFavourites();

  const isAdmin = location.pathname.startsWith('/admin');

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully', 'success');
    navigate('/');
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setMobileMenuOpen(false);
      setActiveMenu(null);
      setMobileExpanded({});
      setUserDropdownOpen(false);
      setNotificationsDropdownOpen(false);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [location.pathname]);

  // Fetch Notifications
  useEffect(() => {
    if (isAuthenticated) {
      api.get('/notifications')
        .then(data => setNotifications(data.notifications || []))
        .catch(err => console.error('Failed to load notifications:', err));
    } else {
      setNotifications([]);
    }
  }, [isAuthenticated]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (e) { console.error('Failed to mark read', e); }
  };

  const handleClearAll = async () => {
    try {
      await api.delete('/notifications/all');
      setNotifications([]);
    } catch (e) { console.error('Failed to clear notifications', e); }
  };

  const handleDismissNotification = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n._id !== id));
    } catch (e) { console.error('Failed to dismiss notification', e); }
  };

  useEffect(() => {
    const handleClick = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setActiveMenu(null);
        setUserDropdownOpen(false);
      }
    };
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        setActiveMenu(null);
        setUserDropdownOpen(false);
        setNotificationsDropdownOpen(false);
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, []);



  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const linkStyle = {
    fontSize: 14,
    fontWeight: 600,
    color: '#fff',
    textDecoration: 'none',
    padding: '6px 0',
    transition: 'color 0.15s',
    letterSpacing: '0.01em',
    fontFamily: 'DM Sans, sans-serif',
  };

  return (
    <>
      {/* ── HEADER ── */}
      <header
        ref={navRef}
        style={{
          position: 'sticky',
          top: (isScrolled && width >= 768) ? 12 : 0,
          width: '100%',
          zIndex: 10000,
          transition: 'top 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          pointerEvents: 'none',
        }}
      >
        <div style={{
          maxWidth: (isScrolled && width >= 768) ? 'calc(100% - 48px)' : '100%',
          width: (isScrolled && width >= 768) ? 1360 : '100%',
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: (isScrolled && width >= 768) ? 58 : 68,
          background: (isScrolled && width >= 768) ? 'rgba(26, 77, 46, 0.82)' : G,
          backdropFilter: (isScrolled && width >= 768) ? 'blur(16px)' : 'none',
          borderRadius: (isScrolled && width >= 768) ? 24 : 0,
          boxShadow: isScrolled ? '0 12px 40px rgba(0,0,0,0.3)' : 'none',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          border: (isScrolled && width >= 768) ? '1px solid rgba(255,255,255,0.1)' : 'none',
          pointerEvents: 'auto',
        }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', flexShrink: 0 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0, boxShadow: '0 4px 15px rgba(0,0,0,0.15)' }}>
              <img src={logo} alt="Design Custom Box" style={{ height: '85%', width: '85%', objectFit: 'contain' }}
                onError={e => { e.target.style.display = 'none'; }} />
            </div>
            <span style={{ fontSize: 22, fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>
              Design Custom <span style={{ color: ACCENT }}>Box</span>
            </span>
          </Link>

          {/* ── Desktop Nav — only on desktop ── */}
          {isDesktop && (
            <nav style={{ display: 'flex', alignItems: 'center', gap: 24, flex: 1, justifyContent: 'center' }}>
              <div style={{ position: 'relative', padding: '4px 0' }}
                onMouseEnter={() => setActiveMenu('Products')}
                onMouseLeave={() => setActiveMenu(null)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Link to="/products" 
                    style={{ ...linkStyle, color: (location.pathname.startsWith('/products') || activeMenu === 'Products') ? ACCENT : '#fff', borderBottom: (location.pathname.startsWith('/products') || activeMenu === 'Products') ? `2px solid ${ACCENT}` : 'none' }}
                    onClick={() => setActiveMenu(null)}>Products</Link>
                  <ChevronDown size={13} style={{ color: (location.pathname.startsWith('/products') || activeMenu === 'Products') ? ACCENT : 'rgba(255,255,255,0.6)', transition: 'transform 0.2s', transform: activeMenu === 'Products' ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                </div>
              </div>

              <div style={{ position: 'relative', padding: '4px 0' }}
                onMouseEnter={() => setActiveMenu('Industries')}
                onMouseLeave={() => setActiveMenu(null)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Link to="/industries" 
                    style={{ ...linkStyle, color: (location.pathname.startsWith('/industries') || activeMenu === 'Industries') ? ACCENT : '#fff', borderBottom: (location.pathname.startsWith('/industries') || activeMenu === 'Industries') ? `2px solid ${ACCENT}` : 'none' }}
                    onClick={() => setActiveMenu(null)}>Industries</Link>
                  <ChevronDown size={13} style={{ color: (location.pathname.startsWith('/industries') || activeMenu === 'Industries') ? ACCENT : 'rgba(255,255,255,0.6)', transition: 'transform 0.2s', transform: activeMenu === 'Industries' ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                </div>
              </div>

              <Link to="/about" style={{ ...linkStyle, color: location.pathname === '/about' ? ACCENT : '#fff', borderBottom: location.pathname === '/about' ? `2px solid ${ACCENT}` : 'none' }}>About</Link>
              <Link to="/how-it-works" style={{ ...linkStyle, color: location.pathname === '/how-it-works' ? ACCENT : '#fff', borderBottom: location.pathname === '/how-it-works' ? `2px solid ${ACCENT}` : 'none' }}>How It Works</Link>
              <Link to="/success-stories" style={{ ...linkStyle, color: location.pathname === '/success-stories' ? ACCENT : '#fff', borderBottom: location.pathname === '/success-stories' ? `2px solid ${ACCENT}` : 'none' }}>Inspiration</Link>
              <Link to="/blog" style={{ ...linkStyle, color: location.pathname.startsWith('/blog') ? ACCENT : '#fff', borderBottom: location.pathname.startsWith('/blog') ? `2px solid ${ACCENT}` : 'none' }}>Blog</Link>
              <Link to="/contact-us" style={{ ...linkStyle, color: location.pathname === '/contact-us' ? ACCENT : '#fff', borderBottom: location.pathname === '/contact-us' ? `2px solid ${ACCENT}` : 'none' }}>Contact</Link>
            </nav>
          )}

          {/* ── Desktop Right Actions — only on md+ ── */}
          {isDesktop && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexShrink: 0 }}>
              {!isAdmin && (
                <Link to="/favourites" style={{ position: 'relative', color: 'rgba(255,255,255,0.8)', transition: 'color 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.8)'}>
                  <Heart size={20} strokeWidth={1.5} />
                  {favCount > 0 && (
                    <span style={{ position: 'absolute', top: -6, right: -6, width: 16, height: 16, background: '#EF4444', color: '#fff', fontSize: 9, fontWeight: 700, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{favCount}</span>
                  )}
                </Link>
              )}

              {!isAdmin && (
                <button onClick={() => toggleDrawer()}
                  style={{ position: 'relative', color: 'rgba(255,255,255,0.8)', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.15s', padding: 0 }}
                  onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.8)'}>
                  <ShoppingCart size={20} strokeWidth={1.5} />
                  {cartCount > 0 && (
                    <span style={{ position: 'absolute', top: -6, right: -6, width: 16, height: 16, background: ACCENT, color: '#fff', fontSize: 9, fontWeight: 700, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cartCount}</span>
                  )}
                </button>
              )}

              {isAuthenticated && (
                <div style={{ position: 'relative' }} onMouseEnter={() => setNotificationsDropdownOpen(true)} onMouseLeave={() => setNotificationsDropdownOpen(false)}>
                  <Link to="/profile?tab=notifications" style={{ position: 'relative', color: 'rgba(255,255,255,0.8)', transition: 'color 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.8)'}>
                    <Bell size={20} strokeWidth={1.5} />
                    {unreadCount > 0 && (
                      <span style={{ position: 'absolute', top: -6, right: -6, width: 16, height: 16, background: '#EF4444', color: '#fff', fontSize: 9, fontWeight: 700, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{unreadCount}</span>
                    )}
                  </Link>

                  {/* Notification Dropdown */}
                  <div style={{
                    position: 'absolute', top: '100%', right: -40, marginTop: 12, width: 320, background: '#fff', borderRadius: 12,
                    boxShadow: '0 12px 40px rgba(0,0,0,0.15)', border: '1px solid #eee', overflow: 'hidden',
                    transition: 'all 0.15s', transformOrigin: 'top right',
                    opacity: notificationsDropdownOpen ? 1 : 0, transform: notificationsDropdownOpen ? 'scale(1)' : 'scale(0.95)',
                    visibility: notificationsDropdownOpen ? 'visible' : 'hidden', zIndex: 9999,
                  }}>
                    <div style={{ padding: '14px 16px', borderBottom: '1px solid #f5f5f5', background: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#1A1A1A' }}>Notifications</span>
                        <div style={{ display: 'flex', gap: 12 }}>
                          {unreadCount > 0 && (
                            <button onClick={handleMarkAllRead} style={{ fontSize: 11, color: G, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Mark all read</button>
                          )}
                          {notifications.length > 0 && (
                            <button onClick={handleClearAll} style={{ fontSize: 11, color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Clear all</button>
                          )}
                        </div>
                    </div>
                    <div style={{ maxHeight: 380, overflowY: 'auto', scrollbarWidth: 'thin' }}>
                      {notifications.length === 0 ? (
                        <div style={{ padding: 30, textAlign: 'center', color: '#888', fontSize: 13 }}>No notifications yet</div>
                      ) : (
                        notifications.slice(0, 15).map((n, i) => (
                          <div key={i} style={{ position: 'relative' }}>
                            <Link to={n.link || '/profile'} onClick={() => { setNotificationsDropdownOpen(false); if (!n.isRead) api.put(`/notifications/${n._id}/read`); }}
                              style={{ display: 'block', padding: '14px 16px', borderBottom: '1px solid #f5f5f5', textDecoration: 'none', background: n.isRead ? '#fff' : 'rgba(26, 77, 46, 0.05)', transition: 'background 0.15s', paddingRight: 40 }}
                              onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'} onMouseLeave={e => e.currentTarget.style.background = n.isRead ? '#fff' : 'rgba(26, 77, 46, 0.05)'}>
                              <p style={{ fontSize: 13, fontWeight: n.isRead ? 600 : 700, color: '#1A1A1A', margin: '0 0 4px', paddingRight: 10 }}>{n.title}</p>
                              <p style={{ fontSize: 12, color: '#666', margin: '0 0 6px', lineHeight: 1.4 }}>{n.message}</p>
                              <span style={{ fontSize: 10, color: '#aaa' }}>{new Date(n.createdAt).toLocaleDateString()}</span>
                            </Link>
                            <button 
                              onClick={(e) => handleDismissNotification(e, n._id)}
                              style={{ position: 'absolute', top: 14, right: 10, background: 'none', border: 'none', color: '#ccc', cursor: 'pointer', padding: 4, borderRadius: 4, transition: 'all 0.2s' }}
                              onMouseEnter={e => { e.currentTarget.style.color = '#EF4444'; e.currentTarget.style.background = '#FEE2E2'; }}
                              onMouseLeave={e => { e.currentTarget.style.color = '#ccc'; e.currentTarget.style.background = 'none'; }}
                              title="Dismiss"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                    {notifications.length > 5 && (
                      <Link to="/profile?tab=notifications" onClick={() => setNotificationsDropdownOpen(false)} style={{ display: 'block', padding: 12, textAlign: 'center', background: '#fafafa', color: G, fontSize: 12, fontWeight: 700, textDecoration: 'none', borderTop: '1px solid #eee' }}>
                        View All
                      </Link>
                    )}
                  </div>
                </div>
              )}

              <div style={{ position: 'relative' }} onMouseEnter={() => setUserDropdownOpen(true)} onMouseLeave={() => setUserDropdownOpen(false)}>
                {isAuthenticated ? (
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: ACCENT, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, cursor: 'pointer', border: '2px solid rgba(255,255,255,0.3)' }}>
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                ) : (
                  <Link to="/login" style={{ color: 'rgba(255,255,255,0.8)', transition: 'color 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.8)'}>
                    <User size={20} strokeWidth={1.5} />
                  </Link>
                )}

                {isAuthenticated && (
                  <div style={{
                    position: 'absolute', top: '100%', right: 0, marginTop: 8, width: 240, background: '#fff', borderRadius: 12,
                    boxShadow: '0 12px 40px rgba(0,0,0,0.15)', border: '1px solid #eee', overflow: 'hidden',
                    transition: 'all 0.15s', transformOrigin: 'top right',
                    opacity: userDropdownOpen ? 1 : 0, transform: userDropdownOpen ? 'scale(1)' : 'scale(0.95)',
                    visibility: userDropdownOpen ? 'visible' : 'hidden', zIndex: 9999,
                  }}>
                    <div style={{ padding: '14px 16px', borderBottom: '1px solid #f5f5f5', background: '#fafafa', display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 38, height: 38, borderRadius: '50%', background: G, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, flexShrink: 0 }}>
                        {user?.name?.charAt(0) || 'U'}
                      </div>
                      <div style={{ overflow: 'hidden' }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: '#1A1A1A', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</p>
                        <p style={{ fontSize: 11, color: '#888', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</p>
                      </div>
                    </div>
                    <div style={{ padding: 8 }}>
                      {[
                        { to: '/profile', icon: <UserCircle size={15} />, label: 'My Profile' },
                        { to: '/profile', state: { tab: 'orders' }, icon: <Package size={15} />, label: 'My Orders' },
                        { to: '/favourites', icon: <Heart size={15} />, label: 'Saved Items' },
                      ].map((item, i) => (
                        <Link key={i} to={item.to} state={item.state}
                          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8, fontSize: 13, fontWeight: 500, color: '#333', textDecoration: 'none', transition: 'background 0.1s' }}
                          onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                          <span style={{ color: '#888' }}>{item.icon}</span> {item.label}
                        </Link>
                      ))}
                      {(user?.role === 'admin' || user?.role === 'super_admin') && (
                        <Link to="/admin"
                          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8, fontSize: 13, fontWeight: 500, color: '#333', textDecoration: 'none', borderTop: '1px solid #f0f0f0', marginTop: 4, paddingTop: 12, transition: 'background 0.1s' }}
                          onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                          <Settings size={15} color="#888" /> Admin Panel
                        </Link>
                      )}
                      <button onClick={handleLogout}
                        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8, fontSize: 13, fontWeight: 500, color: '#EF4444', width: '100%', border: 'none', background: 'transparent', cursor: 'pointer', borderTop: '1px solid #f0f0f0', marginTop: 4, paddingTop: 12, transition: 'background 0.1s' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <LogOut size={15} /> Logout
                      </button>
                    </div>
                  </div>
                )}

                {!isAuthenticated && (
                  <div style={{
                    position: 'absolute', top: '100%', right: 0, marginTop: 8, width: 180, background: '#fff', borderRadius: 12,
                    boxShadow: '0 12px 40px rgba(0,0,0,0.15)', border: '1px solid #eee', padding: 8,
                    transition: 'all 0.15s', transformOrigin: 'top right',
                    opacity: userDropdownOpen ? 1 : 0, transform: userDropdownOpen ? 'scale(1)' : 'scale(0.95)',
                    visibility: userDropdownOpen ? 'visible' : 'hidden', zIndex: 9999,
                  }}>
                    <Link to="/login" style={{ display: 'block', textAlign: 'center', padding: '9px', background: G, color: '#fff', borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: 'none', marginBottom: 6, transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = ACCENT} onMouseLeave={e => e.currentTarget.style.background = G}>Sign In</Link>
                    <Link to="/register" style={{ display: 'block', textAlign: 'center', padding: '9px', background: 'transparent', color: '#333', border: '1px solid #e5e5e5', borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: 'none', transition: 'background 0.1s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>Create Account</Link>
                  </div>
                )}
              </div>

              <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.2)' }} />

              <Link to="/custom-box"
                style={{ padding: '10px 22px', background: ACCENT, color: '#fff', borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: 'none', transition: 'filter 0.15s, transform 0.1s', whiteSpace: 'nowrap' }}
                onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.1)'; e.currentTarget.style.transform = 'scale(1.02)'; }}
                onMouseLeave={e => { e.currentTarget.style.filter = 'none'; e.currentTarget.style.transform = 'scale(1)'; }}>
                Get a Quote
              </Link>
            </div>
          )}

          {/* ── Mobile: Cart + Hamburger — only on mobile ── */}
          {!isDesktop && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              {!isAdmin && (
                <button onClick={() => toggleDrawer()}
                  style={{ position: 'relative', color: 'rgba(255,255,255,0.8)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  <ShoppingCart size={22} strokeWidth={1.5} />
                  {cartCount > 0 && (
                    <span style={{ position: 'absolute', top: -6, right: -6, width: 16, height: 16, background: ACCENT, color: '#fff', fontSize: 9, fontWeight: 700, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cartCount}</span>
                  )}
                </button>
              )}

              {/* Hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                style={{
                  background: 'none',
                  border: 'none',
                  color: mobileMenuOpen ? '#1A4D2E' : '#fff',
                  cursor: 'pointer',
                  padding: 6,
                  borderRadius: 6,
                  position: 'relative',
                  zIndex: 10001,
                }}
              >
                {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>
          )}

          {/* Mega Menus (desktop only) */}
          {isDesktop && (
            <>
              <MegaMenu categories={productCategories} title="Products" isOpen={activeMenu === 'Products'} setActiveMenu={setActiveMenu} />
              <MegaMenu categories={industryCategories} title="Industries" isOpen={activeMenu === 'Industries'} setActiveMenu={setActiveMenu} />
            </>
          )}
        </div>
      </header>

      {/* ── Mobile Backdrop ── */}
      {!isDesktop && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.55)',
            zIndex: 9997,
            opacity: mobileMenuOpen ? 1 : 0,
            visibility: mobileMenuOpen ? 'visible' : 'hidden',
            transition: 'opacity 0.3s, visibility 0.3s',
          }}
        />
      )}

      {/* ── Mobile Drawer (slides in from right) ── */}
      {!isDesktop && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            maxWidth: 340,
            background: '#F5F2ED',
            zIndex: 10003,
            transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(100%)',
            transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            overflowY: 'auto',
            paddingBottom: 40,
            display: 'flex',
            flexDirection: 'column',
            boxShadow: mobileMenuOpen ? '-10px 0 30px rgba(0,0,0,0.12)' : 'none',
          }}
        >
          {/* Drawer Header */}
          <div style={{ height: 72, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', borderBottom: '1px solid rgba(26,77,46,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={logo} alt="" style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
              </div>
              <span style={{ fontSize: 16, fontWeight: 700, color: '#1A4D2E', letterSpacing: '-0.02em', fontFamily: '"Playfair Display", serif' }}>Menu</span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
              style={{ 
                background: 'rgba(26,77,46,0.08)', 
                border: 'none', 
                color: '#1A4D2E', 
                cursor: 'pointer', 
                borderRadius: '50%', 
                width: 44, 
                height: 44, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                transition: 'all 0.2s',
                boxShadow: '0 4px 12px rgba(26,77,46,0.08)'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(26,77,46,0.15)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(26,77,46,0.08)'}
            >
              <X size={28} strokeWidth={2.5} />
            </button>
          </div>

          <nav style={{ padding: '8px 24px 0' }}>
            {/* Expandable: Products & Industries */}
            {[
              { to: '/products',   label: 'Products',   key: 'Products',   items: [...productCategories.col1,  ...productCategories.col2]  },
              { to: '/industries', label: 'Industries', key: 'Industries', items: [...industryCategories.col1, ...industryCategories.col2] },
            ].map(item => (
              <div key={item.key} style={{ borderBottom: '1px solid rgba(26,77,46,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', padding: '16px 0' }}>
                  <Link to={item.to}
                    style={{ flex: 1, fontSize: 17, fontWeight: 700, color: location.pathname.startsWith(item.to) ? ACCENT : '#1A4D2E', textDecoration: 'none', fontFamily: '"Playfair Display", serif' }}
                    onClick={() => setMobileMenuOpen(false)}>
                    {item.label}
                  </Link>
                  <button
                    onClick={() => setMobileExpanded(p => ({ ...p, [item.key]: !p[item.key] }))}
                    style={{ background: 'none', border: 'none', color: '#C8860A', cursor: 'pointer', padding: 4 }}>
                    <ChevronDown size={18} style={{ transform: mobileExpanded[item.key] ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                  </button>
                </div>
                {mobileExpanded[item.key] && (
                  <div style={{ paddingLeft: 16, paddingBottom: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {item.items.map((sub, si) => (
                      <Link key={si}
                        to={`/${item.key.toLowerCase()}/${sub.name.toLowerCase().replace(/ /g, '-')}`}
                        style={{ fontSize: 14, color: '#666', textDecoration: 'none', fontFamily: 'DM Sans, sans-serif' }}
                        onClick={() => setMobileMenuOpen(false)}>
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Simple links */}
            {[
              { to: '/about',           label: 'About' },
              { to: '/how-it-works',    label: 'How It Works' },
              { to: '/success-stories', label: 'Inspiration' },
              { to: '/blog',            label: 'Blog' },
              { to: '/contact-us',      label: 'Contact' },
              ...(isAdmin ? [] : [{ to: '/favourites', label: favCount > 0 ? `Favourites (${favCount})` : 'Favourites' }]),
            ].map(item => (
              <Link key={item.to} to={item.to}
                style={{ display: 'block', padding: '16px 0', fontSize: 17, fontWeight: 700, color: location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to)) ? ACCENT : '#1A4D2E', textDecoration: 'none', borderBottom: '1px solid rgba(26,77,46,0.1)', fontFamily: '"Playfair Display", serif' }}
                onClick={() => setMobileMenuOpen(false)}>
                {item.label}
              </Link>
            ))}

            {/* Auth + Cart */}
            <div style={{ paddingTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {isAuthenticated ? (
                <>
                  <Link to="/profile"
                    style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 15, fontWeight: 600, color: '#1A4D2E', textDecoration: 'none' }}
                    onClick={() => setMobileMenuOpen(false)}>
                    <UserCircle size={18} /> My Profile
                  </Link>
                  {(user?.role === 'admin' || user?.role === 'super_admin') && (
                    <Link to="/admin"
                      style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 15, fontWeight: 600, color: '#1A4D2E', textDecoration: 'none' }}
                      onClick={() => setMobileMenuOpen(false)}>
                      <Settings size={18} /> Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 15, fontWeight: 600, color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <LogOut size={18} /> Logout
                  </button>
                </>
              ) : (
                <Link to="/login"
                  style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 15, fontWeight: 600, color: '#1A4D2E', textDecoration: 'none' }}
                  onClick={() => setMobileMenuOpen(false)}>
                  <User size={18} /> Sign In
                </Link>
              )}
            </div>
          </nav>

          {/* CTA */}
          <div style={{ padding: '24px 24px 0', marginTop: 'auto' }}>
            <Link to="/custom-box"
              style={{ display: 'block', width: '100%', padding: '16px', background: ACCENT, color: '#fff', textAlign: 'center', borderRadius: 10, fontWeight: 700, fontSize: 15, textDecoration: 'none', boxSizing: 'border-box' }}
              onClick={() => setMobileMenuOpen(false)}>
              Get a Custom Box
            </Link>
          </div>
        </div>
      )}

      {/* Desktop mega-menu backdrop */}
      {isDesktop && (activeMenu || userDropdownOpen) && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 9997 }}
          onClick={() => { setActiveMenu(null); setUserDropdownOpen(false); }}
        />
      )}
    </>
  );
}
import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, Menu, X, ShoppingCart, User, LogOut, Settings, Package, UserCircle, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
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

const MegaMenu = ({ categories, title, isOpen, setActiveMenu }) => (
  <div
    className={`absolute left-0 right-0 top-full transition-all duration-200 ease-out overflow-hidden ${isOpen ? 'opacity-100 translate-y-0 visible pointer-events-auto' : 'opacity-0 -translate-y-3 invisible pointer-events-none'}`}
    style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.18)', zIndex: 9999, background: '#fff', borderTop: `3px solid ${ACCENT}` }}
    onMouseEnter={() => setActiveMenu(title)}
    onMouseLeave={() => setActiveMenu(null)}
  >
    <div className="max-w-[1200px] mx-auto px-6 py-10 grid grid-cols-12 gap-8">
      <div className="col-span-8 grid grid-cols-2 gap-10">
        <div>
          <h4 style={{ fontSize: 10, fontWeight: 700, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 20 }}>Popular Categories</h4>
          <div className="space-y-5">
            {categories.col1.map((item, idx) => (
              <Link key={idx} to={`/${title.toLowerCase()}/${item.name.toLowerCase().replace(/ /g, '-')}`}
                className="block group/item" onClick={() => setActiveMenu(null)}>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A', display: 'block', transition: 'color 0.15s' }}
                  onMouseEnter={e => e.target.style.color = G} onMouseLeave={e => e.target.style.color = '#1A1A1A'}>{item.name}</span>
                <span style={{ fontSize: 12, color: '#888', display: 'block', marginTop: 2 }}>{item.desc}</span>
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h4 style={{ fontSize: 10, fontWeight: 700, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 20 }}>More Categories</h4>
          <div className="space-y-5">
            {categories.col2.map((item, idx) => (
              <Link key={idx} to={`/${title.toLowerCase()}/${item.name.toLowerCase().replace(/ /g, '-')}`}
                className="block group/item" onClick={() => setActiveMenu(null)}>
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
      <div className="col-span-4 rounded-xl overflow-hidden relative group/feat" style={{ minHeight: 220 }}>
        <img
          src={title === 'Products'
            ? 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=700&q=80'
            : 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=700&q=80'}
          alt="Featured"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/feat:scale-105"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 60%)' }} />
        <div className="absolute bottom-0 left-0 p-5">
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
  const navRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount, toggleDrawer } = useCart();
  const { showToast } = useToast();
  const { count: favCount } = useFavourites();

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
    const timer = setTimeout(() => { setMobileMenuOpen(false); setActiveMenu(null); }, 0);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  useEffect(() => {
    const handleClick = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setActiveMenu(null); setUserDropdownOpen(false);
      }
    };
    const handleKey = (e) => {
      if (e.key === 'Escape') { setActiveMenu(null); setUserDropdownOpen(false); }
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => { document.removeEventListener('mousedown', handleClick); document.removeEventListener('keydown', handleKey); };
  }, []);

  const navBg = isScrolled
    ? 'rgba(20,60,36,0.97)'
    : G;

  const linkStyle = {
    fontSize: 14,
    fontWeight: 600,
    color: '#fff',
    textDecoration: 'none',
    padding: '6px 0',
    transition: 'color 0.15s',
    letterSpacing: '0.01em',
  };

  return (
    <>
      <header
        ref={navRef}
        style={{
          position: 'fixed',
          top: 0,
          width: '100%',
          zIndex: 9999,
          background: navBg,
          boxShadow: isScrolled ? '0 2px 20px rgba(0,0,0,0.18)' : 'none',
          transition: 'background 0.3s, box-shadow 0.3s',
          borderBottom: isScrolled ? 'none' : `1px solid rgba(255,255,255,0.1)`,
        }}
      >
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0, zIndex: 50 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
              <img src={logo} alt="NovaPack" style={{ height: 32, width: 32, objectFit: 'contain', mixBlendMode: 'multiply' }}
                onError={e => { e.target.style.display = 'none'; }} />
            </div>
            <span style={{ fontSize: 20, fontFamily: 'Outfit,sans-serif', fontWeight: 800, color: '#fff', letterSpacing: '-0.01em' }}>
              Nova<span style={{ color: ACCENT }}>Pack</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 32, flex: 1, justifyContent: 'center' }} className="hidden lg:flex">

            {/* Products */}
            <div className="relative py-1" onMouseEnter={() => setActiveMenu('Products')} onMouseLeave={() => setActiveMenu(null)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Link to="/products" style={linkStyle}
                  onMouseEnter={e => e.target.style.color = ACCENT} onMouseLeave={e => e.target.style.color = '#fff'}
                  onClick={() => setActiveMenu(null)}>Products</Link>
                <ChevronDown size={13} style={{ color: 'rgba(255,255,255,0.6)', transition: 'transform 0.2s', transform: activeMenu === 'Products' ? 'rotate(180deg)' : 'rotate(0deg)' }} />
              </div>
            </div>

            {/* Industries */}
            <div className="relative py-1" onMouseEnter={() => setActiveMenu('Industries')} onMouseLeave={() => setActiveMenu(null)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Link to="/industries" style={linkStyle}
                  onMouseEnter={e => e.target.style.color = ACCENT} onMouseLeave={e => e.target.style.color = '#fff'}
                  onClick={() => setActiveMenu(null)}>Industries</Link>
                <ChevronDown size={13} style={{ color: 'rgba(255,255,255,0.6)', transition: 'transform 0.2s', transform: activeMenu === 'Industries' ? 'rotate(180deg)' : 'rotate(0deg)' }} />
              </div>
            </div>

            <Link to="/about" style={linkStyle}
              onMouseEnter={e => e.target.style.color = ACCENT} onMouseLeave={e => e.target.style.color = '#fff'}>About</Link>
            <Link to="/success-stories" style={linkStyle}
              onMouseEnter={e => e.target.style.color = ACCENT} onMouseLeave={e => e.target.style.color = '#fff'}>Inspiration</Link>
            <Link to="/blog" style={linkStyle}
              onMouseEnter={e => e.target.style.color = ACCENT} onMouseLeave={e => e.target.style.color = '#fff'}>Blog</Link>
            <Link to="/contact-us" style={linkStyle}
              onMouseEnter={e => e.target.style.color = ACCENT} onMouseLeave={e => e.target.style.color = '#fff'}>Contact</Link>
          </nav>

          {/* Right Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexShrink: 0 }} className="hidden lg:flex">

            {/* Favourites */}
            <Link to="/favourites" style={{ position: 'relative', color: 'rgba(255,255,255,0.8)', transition: 'color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.8)'}>
              <Heart size={20} strokeWidth={1.5} />
              {favCount > 0 && (
                <span style={{ position: 'absolute', top: -6, right: -6, width: 16, height: 16, background: '#EF4444', color: '#fff', fontSize: 9, fontWeight: 700, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{favCount}</span>
              )}
            </Link>

            {/* Cart */}
            <button onClick={() => toggleDrawer()}
              style={{ position: 'relative', color: 'rgba(255,255,255,0.8)', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.15s', padding: 0 }}
              onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.8)'}>
              <ShoppingCart size={20} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span style={{ position: 'absolute', top: -6, right: -6, width: 16, height: 16, background: ACCENT, color: '#fff', fontSize: 9, fontWeight: 700, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cartCount}</span>
              )}
            </button>

            {/* User */}
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

              {/* Auth dropdown */}
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
                    {user?.role === 'admin' && (
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

              {/* Guest mini dropdown */}
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

          {/* Mobile hamburger */}
          <button
            style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 4, zIndex: 50 }}
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>

          {/* Mega Menus */}
          <MegaMenu categories={productCategories} title="Products" isOpen={activeMenu === 'Products'} setActiveMenu={setActiveMenu} />
          <MegaMenu categories={industryCategories} title="Industries" isOpen={activeMenu === 'Industries'} setActiveMenu={setActiveMenu} />
        </div>

        {/* Mobile Drawer */}
        <div style={{
          position: 'fixed', inset: 0, background: G, zIndex: 9998,
          transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease', overflowY: 'auto', paddingTop: 80, paddingBottom: 32,
        }} className="lg:hidden">
          <nav style={{ padding: '0 24px' }}>
            {[
              { to: '/products', label: 'Products', hasDropdown: true, key: 'Products', items: [...productCategories.col1, ...productCategories.col2] },
              { to: '/industries', label: 'Industries', hasDropdown: true, key: 'Industries', items: [...industryCategories.col1, ...industryCategories.col2] },
            ].map(item => (
              <div key={item.key} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', padding: '16px 0' }}>
                  <Link to={item.to} style={{ flex: 1, fontSize: 17, fontWeight: 700, color: '#fff', textDecoration: 'none' }} onClick={() => setMobileMenuOpen(false)}>{item.label}</Link>
                  <button onClick={() => setMobileExpanded(p => ({ ...p, [item.key]: !p[item.key] }))} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}>
                    <ChevronDown size={18} style={{ transform: mobileExpanded[item.key] ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                  </button>
                </div>
                {mobileExpanded[item.key] && (
                  <div style={{ paddingLeft: 16, paddingBottom: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {item.items.map((sub, si) => (
                      <Link key={si} to={`/${item.key.toLowerCase()}/${sub.name.toLowerCase().replace(/ /g, '-')}`}
                        style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }} onClick={() => setMobileMenuOpen(false)}>{sub.name}</Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {[
              { to: '/about', label: 'About' },
              { to: '/success-stories', label: 'Inspiration' },
              { to: '/blog', label: 'Blog' },
              { to: '/contact-us', label: 'Contact' },
              { to: '/favourites', label: `Favourites${favCount > 0 ? ` (${favCount})` : ''}` },
            ].map(item => (
              <Link key={item.to} to={item.to} style={{ display: 'block', padding: '16px 0', fontSize: 17, fontWeight: 700, color: '#fff', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.1)' }} onClick={() => setMobileMenuOpen(false)}>
                {item.label}
              </Link>
            ))}
            <div style={{ paddingTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {isAuthenticated ? (
                <>
                  <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 15, fontWeight: 600, color: '#fff', textDecoration: 'none' }} onClick={() => setMobileMenuOpen(false)}><UserCircle size={18} /> My Profile</Link>
                  <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 15, fontWeight: 600, color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}><LogOut size={18} /> Logout</button>
                </>
              ) : (
                <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 15, fontWeight: 600, color: '#fff', textDecoration: 'none' }} onClick={() => setMobileMenuOpen(false)}><User size={18} /> Sign In</Link>
              )}
              <button onClick={() => { setMobileMenuOpen(false); toggleDrawer(); }} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 15, fontWeight: 600, color: '#fff', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                <ShoppingCart size={18} /> Cart ({cartCount})
              </button>
            </div>
          </nav>
          <div style={{ padding: '24px 24px 0' }}>
            <Link to="/custom-box" style={{ display: 'block', width: '100%', padding: '16px', background: ACCENT, color: '#fff', textAlign: 'center', borderRadius: 10, fontWeight: 700, fontSize: 15, textDecoration: 'none' }} onClick={() => setMobileMenuOpen(false)}>
              Get a Custom Box
            </Link>
          </div>
        </div>
      </header>

      {(activeMenu || userDropdownOpen) && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9997 }} onClick={() => { setActiveMenu(null); setUserDropdownOpen(false); }} />
      )}
    </>
  );
}

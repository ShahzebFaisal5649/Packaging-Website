import { useState } from 'react';
import { useScrollShadow } from '../../hooks/useScrollShadow';
import { useAuth } from '../../hooks/useAuth';
import { navigate } from '../../hooks/useRoute';
import styles from './Navbar.module.css';

const NAV_LINKS = [
  { label: 'Home',         href: '/' },
  { label: 'Categories',   href: '/categories' },
  { label: 'Custom Box',   href: '/custom-box' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Box Design',   href: '/box-design' },
];

function LogoIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="lg-top" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2dd4bf"/>
          <stop offset="100%" stopColor="#14b8a6"/>
        </linearGradient>
        <linearGradient id="lg-front" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0d9488"/>
          <stop offset="100%" stopColor="#0a7a72"/>
        </linearGradient>
        <linearGradient id="lg-side" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#14b8a6"/>
          <stop offset="100%" stopColor="#0d9488"/>
        </linearGradient>
      </defs>
      <polygon points="17,3 31,11 17,19 3,11" fill="url(#lg-top)"/>
      <polygon points="3,11 17,19 17,31 3,23" fill="url(#lg-front)"/>
      <polygon points="31,11 17,19 17,31 31,23" fill="url(#lg-side)"/>
    </svg>
  );
}

export default function Navbar() {
  const hasShadow = useScrollShadow();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
    setDrawerOpen(false);
  };

  return (
    <>
      <nav
        className={`${styles.navbar} ${hasShadow ? styles.scrolled : ''}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className={`container ${styles.inner}`}>

          {/* Logo */}
          <a href="/" className={styles.logo} aria-label="NovaPack home">
            <LogoIcon />
            <span className={styles.logoText}>
              <span className={styles.logoNova}>Nova</span><span className={styles.logoPack}>Pack</span>
            </span>
          </a>

          {/* Primary nav */}
          <ul className={styles.nav} role="list">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className={styles.navLink}>{link.label}</a>
              </li>
            ))}
          </ul>

          {/* Right utility */}
          <div className={styles.utility}>
            <a href="tel:18005131678" className={styles.phone}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M1.5 1h2.8l1.4 3.2-1.6 1.2a8.7 8.7 0 004.1 4.1l1.2-1.6L12.6 9.4v2.8A1 1 0 0111.5 13C5.7 13 1 8.3 1 2.5A1 1 0 011.5 1z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              1 800 513 1678
            </a>
            {user ? (
              <>
                {isAdmin && <a href="/admin" className={styles.adminBtn}>Admin</a>}
                <a href="/dashboard" className={styles.loginBtn}>{user.name?.split(' ')[0] || 'Dashboard'}</a>
                <button onClick={handleLogout} className={styles.ctaBtn}>Log out</button>
              </>
            ) : (
              <>
                <a href="/login" className={styles.loginBtn}>Log in</a>
                <a href="/custom-box" className={styles.ctaBtn}>Get Quote</a>
              </>
            )}
          </div>

          {/* Hamburger */}
          <button
            className={styles.hamburger}
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
            aria-expanded={drawerOpen}
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        className={`${styles.drawer} ${drawerOpen ? styles.open : ''}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!drawerOpen}
      >
        <div className={styles.drawerHeader}>
          <a href="/" className={styles.logo} onClick={() => setDrawerOpen(false)}>
            <LogoIcon />
            <span className={styles.logoText}>
              <span className={styles.logoNova}>Nova</span><span className={styles.logoPack}>Pack</span>
            </span>
          </a>
          <button className={styles.drawerClose} onClick={() => setDrawerOpen(false)} aria-label="Close menu">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        {NAV_LINKS.map((l) => (
          <a key={l.href} href={l.href} className={styles.drawerLink} onClick={() => setDrawerOpen(false)}>{l.label}</a>
        ))}
        <a href="tel:18005131678" className={styles.drawerLink}>1 800 513 1678</a>
        {user ? (
          <>
            {isAdmin && <a href="/admin" className={styles.drawerLink} onClick={() => setDrawerOpen(false)}>Admin Panel</a>}
            <a href="/dashboard" className={styles.drawerLink} onClick={() => setDrawerOpen(false)}>Dashboard</a>
            <button onClick={handleLogout} className={styles.drawerLink}>Log out</button>
          </>
        ) : (
          <a href="/login" className={styles.drawerLink} onClick={() => setDrawerOpen(false)}>Log in</a>
        )}
        <a href="/custom-box" className={`${styles.drawerLink} ${styles.drawerCta}`} onClick={() => setDrawerOpen(false)}>Get Quote</a>
      </div>

      {drawerOpen && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 99, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}

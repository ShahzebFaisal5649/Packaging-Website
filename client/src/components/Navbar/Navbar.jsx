import { useState } from 'react';
import { useScrollShadow } from '../../hooks/useScrollShadow';
import styles from './Navbar.module.css';

const NAV_LINKS = [
  { label: 'Categories',       href: '/categories' },
  { label: 'How it works',     href: '/how-it-works' },
  { label: 'Find a designer',  href: '/designers' },
  { label: 'Inspiration',      href: '/inspiration' },
  { label: 'Studio',           href: '/studio' },
];

export default function Navbar() {
  const hasShadow = useScrollShadow();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <nav
        className={`${styles.navbar} ${hasShadow ? styles.scrolled : ''}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className={`container ${styles.inner}`}>

          {/* ── Logo ── */}
          <a href="/" className={styles.logo} aria-label="99designs home">
            <span className={styles.logoMark}>99</span>
            <span className={styles.logoWord}>designs</span>
            <span className={styles.byVista}>
              by&nbsp;
              <svg width="36" height="11" viewBox="0 0 36 11" fill="none" aria-hidden="true">
                <path d="M2 2l3 6.5L8 2M11 2v7M11 5.5h4M11 9h4M18 2h2.5C22 2 23 2.8 23 4s-1 2-2.5 2H18V2zm0 4h3c1.6 0 2.5.8 2.5 2s-.9 2-2.5 2H18V6zM27 2l2.5 7L32 2" stroke="#888" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </a>

          {/* ── Primary nav ── */}
          <ul className={styles.nav} role="list">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className={styles.navLink}>{link.label}</a>
              </li>
            ))}
          </ul>

          {/* ── Right utility ── */}
          <div className={styles.utility}>
            <a href="tel:18005131678" className={styles.phone}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M1.5 1h2.8l1.4 3.2-1.6 1.2a8.7 8.7 0 004.1 4.1l1.2-1.6L12.6 9.4v2.8A1 1 0 0111.5 13C5.7 13 1 8.3 1 2.5A1 1 0 011.5 1z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              1 800 513 1678
            </a>
            <a href="/login" className={styles.loginBtn}>Log in</a>
          </div>

          {/* ── Hamburger ── */}
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

      {/* ── Mobile drawer ── */}
      <div
        className={`${styles.drawer} ${drawerOpen ? styles.open : ''}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!drawerOpen}
      >
        <button className={styles.drawerClose} onClick={() => setDrawerOpen(false)} aria-label="Close menu">×</button>
        {NAV_LINKS.map((l) => (
          <a key={l.href} href={l.href} className={styles.drawerLink}>{l.label}</a>
        ))}
        <a href="tel:18005131678" className={styles.drawerLink}>1 800 513 1678</a>
        <a href="/login" className={styles.drawerLink}>Log in</a>
      </div>

      {drawerOpen && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 99, background: 'rgba(0,0,0,0.4)' }}
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}

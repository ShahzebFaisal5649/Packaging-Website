import { useState } from 'react';
import styles from './Footer.module.css';

const COLUMNS = [
  {
    heading: 'Company',
    links: [
      { label: 'About',          href: '/about' },
      { label: 'How it works',   href: '/how-it-works' },
      { label: 'Contact',        href: '/contact' },
      { label: 'Careers',        href: '/careers' },
      { label: 'Team',           href: '/team' },
      { label: 'Press releases', href: '/press' },
      { label: 'Media',          href: '/media' },
      { label: 'Testimonials',   href: '/testimonials' },
      { label: '99nonprofits',   href: '/nonprofits' },
    ],
  },
  {
    heading: 'Design services',
    links: [
      { label: 'Contests',       href: '/contests' },
      { label: '1-to-1 Projects', href: '/projects' },
      { label: 'Designers',      href: '/designers' },
      { label: 'Inspiration',    href: '/inspiration' },
      { label: 'Pricing',        href: '/pricing' },
      { label: 'Studio',         href: '/studio' },
      { label: 'Pro',            href: '/pro' },
    ],
  },
  {
    heading: 'Get a design',
    links: [
      { label: 'Logo',           href: '/categories?tab=logo-identity' },
      { label: 'Business card',  href: '/categories?tab=logo-identity' },
      { label: 'Web',            href: '/categories?tab=web-app-design' },
      { label: 'Brand guide',    href: '/categories?tab=logo-identity' },
      { label: 'Packaging',      href: '/categories?tab=packaging-label' },
      { label: 'T-shirt',        href: '/categories?tab=clothing-merchandise' },
      { label: 'Book cover',     href: '/categories?tab=book-magazine' },
      { label: 'Categories',     href: '/categories' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { label: 'Become a designer',       href: '/become-a-designer' },
      { label: 'Blog',                    href: '/blog' },
      { label: 'Design without borders',  href: '/design-without-borders' },
      { label: 'Awards',                  href: '/awards' },
      { label: 'Affiliates',              href: '/affiliates' },
      { label: 'Ideas',                   href: '/ideas' },
      { label: 'Help',                    href: '/help' },
    ],
  },
];

const SOCIAL = [
  { label: 'Facebook',  href: 'https://facebook.com/99designs',  icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
  )},
  { label: 'Twitter',   href: 'https://twitter.com/99designs',   icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/></svg>
  )},
  { label: 'LinkedIn',  href: 'https://linkedin.com/company/99designs', icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
  )},
  { label: 'Pinterest', href: 'https://pinterest.com/99designs',  icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>
  )},
  { label: 'Instagram', href: 'https://instagram.com/99designs', icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/></svg>
  )},
];

export default function Footer() {
  const [lang, setLang] = useState('English');

  return (
    <footer className={styles.footer} role="contentinfo">
      <div className="container">
        <div className={styles.grid}>
          {COLUMNS.map((col) => (
            <div key={col.heading} className={styles.column}>
              <h3 className={styles.heading}>{col.heading}</h3>
              <ul className={styles.links} role="list">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className={styles.link}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={styles.bottom}>
          <div className={styles.bottomLeft}>
            <span className={styles.copyright}>
              © {new Date().getFullYear()} 99designs is a Vistaprint company
            </span>
            <div className={styles.legal}>
              <a href="/terms"   className={styles.legalLink}>Terms</a>
              <a href="/privacy" className={styles.legalLink}>Privacy</a>
              <a href="/sitemap" className={styles.legalLink}>Sitemap</a>
            </div>
          </div>

          <div className={styles.bottomRight}>
            {/* Language switcher */}
            <div className={styles.langSwitch} role="group" aria-label="Language">
              {['English', 'Español'].map((l) => (
                <button
                  key={l}
                  className={`${styles.langBtn} ${l === lang ? styles.langActive : ''}`}
                  onClick={() => setLang(l)}
                  aria-pressed={l === lang}
                >
                  {l}
                </button>
              ))}
            </div>

            {/* Social icons */}
            <div className={styles.social} aria-label="Social media links">
              {SOCIAL.map((s) => (
                <a key={s.label} href={s.href} className={styles.socialIcon} aria-label={s.label} target="_blank" rel="noopener noreferrer">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

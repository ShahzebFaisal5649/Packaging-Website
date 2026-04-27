import styles from './Footer.module.css';

const COLUMNS = [
  {
    heading: 'Company',
    links: [
      { label: 'About NovaPack',  href: '/about' },
      { label: 'How It Works',    href: '/how-it-works' },
      { label: 'Contact Us',      href: '/contact' },
      { label: 'Careers',         href: '/careers' },
      { label: 'Press',           href: '/press' },
      { label: 'Testimonials',    href: '/testimonials' },
    ],
  },
  {
    heading: 'Packaging',
    links: [
      { label: 'Custom Boxes',       href: '/custom-box' },
      { label: 'Mailer Boxes',       href: '/categories?tab=mailer-boxes' },
      { label: 'Product Packaging',  href: '/categories?tab=product-packaging' },
      { label: 'Retail Boxes',       href: '/categories?tab=retail-boxes' },
      { label: 'Shipping Boxes',     href: '/categories?tab=shipping-boxes' },
      { label: 'Eco Packaging',      href: '/categories?tab=eco-packaging' },
    ],
  },
  {
    heading: 'Services',
    links: [
      { label: 'Box Designer',       href: '/box-design' },
      { label: 'Custom Printing',    href: '/categories' },
      { label: 'Brand Packaging',    href: '/categories?tab=brand' },
      { label: 'Bulk Orders',        href: '/categories?tab=bulk' },
      { label: 'Get a Quote',        href: '/custom-box' },
      { label: 'Pricing',            href: '/pricing' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { label: 'Help Center',        href: '/help' },
      { label: 'Design Guide',       href: '/design-guide' },
      { label: 'Packaging Blog',     href: '/blog' },
      { label: 'Size Calculator',    href: '/calculator' },
      { label: 'Affiliates',         href: '/affiliates' },
      { label: 'Sitemap',            href: '/sitemap' },
    ],
  },
];

const SOCIAL = [
  {
    label: 'Facebook',
    href: 'https://facebook.com',
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>,
  },
  {
    label: 'Twitter/X',
    href: 'https://twitter.com',
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com',
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>,
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com',
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>,
  },
  {
    label: 'YouTube',
    href: 'https://youtube.com',
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.97C18.88 4 12 4 12 4s-6.88 0-8.59.45A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.4a2.78 2.78 0 001.95-1.97A29 29 0 0023 12a29 29 0 00-.46-5.58z"/><polygon points="9.75,15.02 15.5,12 9.75,8.98 9.75,15.02" fill="#050c1a"/></svg>,
  },
];

function BoxIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 34 34" fill="none" aria-hidden="true">
      <polygon points="17,3 31,11 17,19 3,11" fill="#ff6b35"/>
      <polygon points="3,11 17,19 17,31 3,23" fill="#c44818"/>
      <polygon points="31,11 17,19 17,31 31,23" fill="#e05220"/>
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.glow} aria-hidden="true" />
      <div className="container">

        {/* Top brand bar */}
        <div className={styles.brand}>
          <a href="/" className={styles.brandLogo} aria-label="NovaPack home">
            <BoxIcon />
            <span className={styles.brandText}>
              <span className={styles.brandNova}>Nova</span><span className={styles.brandPack}>Pack</span>
            </span>
          </a>
          <p className={styles.brandTagline}>
            Premium custom packaging for brands that stand out.
          </p>
        </div>

        {/* Link grid */}
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

        {/* Bottom bar */}
        <div className={styles.bottom}>
          <div className={styles.bottomLeft}>
            <span className={styles.copyright}>
              © {new Date().getFullYear()} NovaPack. All rights reserved.
            </span>
            <div className={styles.legal}>
              <a href="/terms"   className={styles.legalLink}>Terms</a>
              <a href="/privacy" className={styles.legalLink}>Privacy</a>
              <a href="/sitemap" className={styles.legalLink}>Sitemap</a>
            </div>
          </div>

          <div className={styles.bottomRight}>
            <div className={styles.social} aria-label="Social media">
              {SOCIAL.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className={styles.socialIcon}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
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

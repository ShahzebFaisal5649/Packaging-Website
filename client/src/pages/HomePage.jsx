import { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import styles from './HomePage.module.css';

/* ─── Hero slides ───────────────────────────────────────────────────────── */
const SLIDES = [
  {
    img: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=640&q=85&auto=format',
    label: 'Cosmetics Brand',
    tag: 'Luxury Packaging',
  },
  {
    img: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=640&q=85&auto=format',
    label: 'Artisan Products',
    tag: 'Eco Packaging',
  },
  {
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=640&q=85&auto=format',
    label: 'Premium Tea Co.',
    tag: 'Retail Boxes',
  },
  {
    img: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=640&q=85&auto=format',
    label: 'Apparel Studio',
    tag: 'Brand Packaging',
  },
];

/* ─── Service categories ────────────────────────────────────────────────── */
const SERVICES = [
  {
    href: '/categories?tab=mailer-boxes',
    img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&q=80&auto=format',
    label: 'Mailer Boxes',
    desc: 'Custom printed mailers that make unboxing unforgettable.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="15" rx="2"/><polyline points="17,7 17,2 7,2 7,7"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
      </svg>
    ),
  },
  {
    href: '/categories?tab=product-packaging',
    img: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&q=80&auto=format',
    label: 'Product Packaging',
    desc: 'Rigid boxes and sleeves that elevate your product on shelves.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
        <polyline points="3.27,6.96 12,12.01 20.73,6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
      </svg>
    ),
  },
  {
    href: '/categories?tab=retail-boxes',
    img: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=400&q=80&auto=format',
    label: 'Retail Boxes',
    desc: 'Point-of-sale packaging designed to convert browsers to buyers.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 01-8 0"/>
      </svg>
    ),
  },
  {
    href: '/categories?tab=eco-packaging',
    img: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=400&q=80&auto=format',
    label: 'Eco Packaging',
    desc: 'Sustainable materials — kraft, recycled, biodegradable.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s-8-4.5-8-11.8A8 8 0 0112 2a8 8 0 018 8.2c0 7.3-8 11.8-8 11.8z"/>
        <path d="M12 13a3 3 0 100-6 3 3 0 000 6z" fill="currentColor" stroke="none" opacity="0.3"/>
      </svg>
    ),
  },
  {
    href: '/categories?tab=shipping-boxes',
    img: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=400&q=80&auto=format',
    label: 'Shipping Boxes',
    desc: 'Durable, stackable boxes built for e-commerce at scale.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13"/><polygon points="16,8 20,8 23,11 23,16 16,16 16,8"/>
        <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    ),
  },
  {
    href: '/custom-box',
    img: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=400&q=80&auto=format',
    label: 'Custom Builder',
    desc: 'Design your own box step-by-step with our live 3D configurator.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 00-14.14 0M4.93 19.07a10 10 0 0014.14 0"/>
        <path d="M12 2v2M12 20v2M2 12h2M20 12h2"/>
      </svg>
    ),
  },
];

/* ─── Process steps ─────────────────────────────────────────────────────── */
const STEPS = [
  {
    num: '01',
    title: 'Choose Your Box',
    body: 'Pick from 20+ box styles — mailer, tuck-top, rigid, sleeve, and more.',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 4L36 12v16L20 36 4 28V12z"/><line x1="4" y1="12" x2="20" y2="20"/><line x1="36" y1="12" x2="20" y2="20"/><line x1="20" y1="20" x2="20" y2="36"/>
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Set Dimensions',
    body: 'Enter exact measurements in cm, mm, or inches. Real-time cost updates.',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="6" y="6" width="28" height="28" rx="3"/><line x1="14" y1="6" x2="14" y2="34"/><line x1="22" y1="6" x2="22" y2="34"/>
        <line x1="6" y1="14" x2="34" y2="14"/><line x1="6" y1="22" x2="34" y2="22"/>
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Select Material',
    body: 'Kraft, corrugated, rigid board, recycled — choose the strength you need.',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 8l12 6-12 6L8 14z"/><path d="M8 22l12 6 12-6"/><line x1="8" y1="14" x2="8" y2="22"/><line x1="32" y1="14" x2="32" y2="22"/>
      </svg>
    ),
  },
  {
    num: '04',
    title: 'Upload Artwork',
    body: 'Drop your print-ready file or work with our in-house design team.',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M28 28H12a4 4 0 01-4-4V10a4 4 0 014-4h10l10 10v8a4 4 0 01-4 4z"/>
        <polyline points="22,6 22,16 32,16"/><line x1="20" y1="22" x2="20" y2="30"/>
        <polyline points="16,26 20,22 24,26"/>
      </svg>
    ),
  },
  {
    num: '05',
    title: 'Get Your Quote',
    body: 'Instant pricing with volume discounts. Minimum quantities from 50 units.',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="20" cy="20" r="14"/><line x1="20" y1="14" x2="20" y2="20"/><polyline points="20,20 26,23"/>
        <path d="M14 8l2 4M26 8l-2 4"/>
      </svg>
    ),
  },
];

/* ─── Stats ─────────────────────────────────────────────────────────────── */
const STATS = [
  { num: '10M+',   label: 'Boxes Delivered' },
  { num: '50K+',   label: 'Happy Brands' },
  { num: '192',    label: 'Countries Shipped' },
  { num: '24h',    label: 'Sample Turnaround' },
];

/* ─── Testimonials ──────────────────────────────────────────────────────── */
const TESTIMONIALS = [
  {
    text: 'NovaPack transformed our unboxing experience completely. The quality of print and material is far beyond what we expected at this price point. Our customers literally film their unboxings.',
    name: 'Sarah Mitchell',
    role: 'Founder, Bloom Wellness Co.',
    initial: 'S',
    rating: 5,
  },
  {
    text: 'From quote to delivery in 8 days. We needed 2,000 custom mailers on a tight deadline and NovaPack delivered flawlessly. The online configurator made it so easy to get exactly what we wanted.',
    name: 'Marcus Chen',
    role: 'Operations Lead, Launchpad Commerce',
    initial: 'M',
    rating: 5,
  },
  {
    text: 'Switched from our previous supplier and the difference is night and day. Print precision, structural integrity, customer service — everything is premium. This is our packaging partner for life.',
    name: 'Emma Rodriguez',
    role: 'Brand Director, Café Nomad',
    initial: 'E',
    rating: 5,
  },
];

/* ─── Trust logos (placeholder SVG wordmarks) ───────────────────────────── */
const TRUST_BRANDS = ['Bloom', 'Launchpad', 'Nomad Co.', 'Artisan Lab', 'Verdant', 'Stackr'];

/* ─── Helper: Star rating ───────────────────────────────────────────────── */
function Stars({ count = 5 }) {
  return (
    <div className={styles.stars} aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 14 14" fill="#fbbf24" aria-hidden="true">
          <path d="M7 1l1.6 3.3 3.6.5-2.6 2.5.6 3.6L7 9.3 3.8 11l.6-3.6L2 4.8l3.6-.5z"/>
        </svg>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   COMPONENT
════════════════════════════════════════════════════════════════════════ */
export default function HomePage() {
  const [slideIdx, setSlideIdx] = useState(0);
  const timerRef = useRef(null);

  const startTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setSlideIdx((i) => (i + 1) % SLIDES.length), 4500);
  };

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, []);

  const goTo = (i) => { setSlideIdx(i); startTimer(); };

  return (
    <div className={styles.page}>
      <Navbar />

      <main>

        {/* ══ HERO ═════════════════════════════════════════════════════════ */}
        <section className={styles.hero} aria-label="Hero">
          {/* Orb backgrounds */}
          <div className={styles.orbOrange} aria-hidden="true" />
          <div className={styles.orbBlue}   aria-hidden="true" />
          <div className={styles.orbViolet} aria-hidden="true" />

          <div className="container">
            <div className={styles.heroInner}>

              {/* Left — text content */}
              <div className={styles.heroContent}>
                <span className={styles.heroBadge}>
                  <span className={styles.heroBadgeDot} />
                  Trusted by 50,000+ brands worldwide
                </span>

                <h1 className={styles.heroHeadline}>
                  Packaging that<br />
                  <span className={styles.heroAccent}>sells your brand</span>
                </h1>

                <p className={styles.heroSub}>
                  Custom printed boxes, mailers, and packaging — designed online, delivered fast.
                  Premium quality from 50 units with no setup fees.
                </p>

                <div className={styles.heroCtas}>
                  <a href="/custom-box" className={styles.btnPrimary}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M8 1.5L14 5v6l-6 3.5L2 11V5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                      <line x1="2" y1="5" x2="8" y2="8.5" stroke="currentColor" strokeWidth="1.5"/>
                      <line x1="14" y1="5" x2="8" y2="8.5" stroke="currentColor" strokeWidth="1.5"/>
                      <line x1="8" y1="8.5" x2="8" y2="15" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                    Build Your Box
                  </a>
                  <a href="/categories" className={styles.btnSecondary}>
                    Browse All Packaging
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                </div>

                <div className={styles.heroTrustRow}>
                  <div className={styles.heroAvatars}>
                    {['S','M','E','R','J'].map((l, i) => (
                      <span key={i} className={styles.heroAvatar} style={{ left: i * 22 }}>{l}</span>
                    ))}
                  </div>
                  <p className={styles.heroTrustText}>
                    <strong>4.9/5</strong> from 12,000+ orders
                  </p>
                </div>
              </div>

              {/* Right — image carousel */}
              <div className={styles.heroVisual}>
                <div className={styles.slideWrap}>
                  {SLIDES.map((s, i) => (
                    <div
                      key={i}
                      className={`${styles.slide} ${i === slideIdx ? styles.slideActive : ''}`}
                      aria-hidden={i !== slideIdx}
                    >
                      <div className={styles.slideCard}>
                        <img
                          src={s.img}
                          alt={s.label}
                          loading={i === 0 ? 'eager' : 'lazy'}
                          decoding="async"
                        />
                        <div className={styles.slideOverlay}>
                          <span className={styles.slideTag}>{s.tag}</span>
                          <span className={styles.slideLabel}>{s.label}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Dots */}
                <div className={styles.dots} role="tablist">
                  {SLIDES.map((_, i) => (
                    <button
                      key={i}
                      role="tab"
                      aria-selected={i === slideIdx}
                      aria-label={`Slide ${i + 1}`}
                      className={`${styles.dot} ${i === slideIdx ? styles.dotActive : ''}`}
                      onClick={() => goTo(i)}
                    />
                  ))}
                </div>

                {/* Floating stat cards */}
                <div className={styles.floatCard1}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <div>
                    <p className={styles.floatTitle}>Order placed</p>
                    <p className={styles.floatSub}>500 mailer boxes</p>
                  </div>
                </div>
                <div className={styles.floatCard2}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2">
                    <path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z"/>
                  </svg>
                  <div>
                    <p className={styles.floatTitle}>4.9 Rating</p>
                    <p className={styles.floatSub}>12,000+ reviews</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ══ STATS STRIP ═════════════════════════════════════════════════ */}
        <section className={styles.statsStrip} aria-label="Key statistics">
          <div className="container">
            <div className={styles.statsGrid}>
              {STATS.map((s) => (
                <div key={s.label} className={styles.statItem}>
                  <span className={styles.statNum}>{s.num}</span>
                  <span className={styles.statLabel}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ TRUST BAR ══════════════════════════════════════════════════ */}
        <section className={styles.trustBar} aria-label="Trusted by">
          <div className="container">
            <p className={styles.trustBarLabel}>Trusted by leading brands</p>
            <div className={styles.trustBrands}>
              {TRUST_BRANDS.map((b) => (
                <span key={b} className={styles.trustBrand}>{b}</span>
              ))}
            </div>
          </div>
        </section>

        {/* ══ SERVICES GRID ═══════════════════════════════════════════════ */}
        <section className={styles.services} aria-label="Packaging services">
          <div className="container">
            <div className={styles.sectionHead}>
              <span className={styles.sectionLabel}>What We Offer</span>
              <h2 className={styles.sectionTitle}>Every box you need, <span className={styles.accent}>perfectly made</span></h2>
              <p className={styles.sectionSub}>
                From cosmetics to food, from startups to enterprises — we have the packaging to match your brand.
              </p>
            </div>

            <div className={styles.servicesGrid}>
              {SERVICES.map((svc, i) => (
                <a key={i} href={svc.href} className={styles.serviceCard}>
                  <div className={styles.serviceImg}>
                    <img src={svc.img} alt={svc.label} loading="lazy" decoding="async" />
                    <div className={styles.serviceImgOverlay} />
                  </div>
                  <div className={styles.serviceBody}>
                    <div className={styles.serviceIcon}>{svc.icon}</div>
                    <h3 className={styles.serviceTitle}>{svc.label}</h3>
                    <p className={styles.serviceDesc}>{svc.desc}</p>
                    <span className={styles.serviceArrow}>
                      Explore
                      <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                        <path d="M1 6.5h11M7 1.5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ══ PROCESS ═════════════════════════════════════════════════════ */}
        <section className={styles.process} aria-label="How it works">
          <div className={styles.processGlow} aria-hidden="true" />
          <div className="container">
            <div className={styles.sectionHead}>
              <span className={styles.sectionLabel}>How It Works</span>
              <h2 className={styles.sectionTitle}>From idea to doorstep <span className={styles.accent}>in days</span></h2>
            </div>

            <div className={styles.processGrid}>
              {STEPS.map((step, i) => (
                <div key={i} className={styles.processStep}>
                  <div className={styles.processIconWrap}>
                    <div className={styles.processIcon}>{step.icon}</div>
                    {i < STEPS.length - 1 && <div className={styles.processLine} aria-hidden="true" />}
                  </div>
                  <div className={styles.processNum}>{step.num}</div>
                  <h3 className={styles.processTitle}>{step.title}</h3>
                  <p className={styles.processBody}>{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ CTA BANNER ══════════════════════════════════════════════════ */}
        <section className={styles.ctaBanner} aria-label="Start building">
          <div className={styles.ctaBannerBg} aria-hidden="true" />
          <div className="container">
            <div className={styles.ctaBannerInner}>
              <div className={styles.ctaBannerContent}>
                <h2 className={styles.ctaBannerTitle}>Ready to build your perfect box?</h2>
                <p className={styles.ctaBannerSub}>
                  Get an instant quote in minutes. No account required.
                  Samples available in 24 hours.
                </p>
              </div>
              <div className={styles.ctaBannerActions}>
                <a href="/custom-box" className={styles.btnPrimary}>
                  Start the Builder
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
                    <path d="M1 7.5h13M8 1.5l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
                <a href="/categories" className={styles.btnGhost}>
                  View Gallery
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ══ TESTIMONIALS ════════════════════════════════════════════════ */}
        <section className={styles.testimonials} aria-label="Customer testimonials">
          <div className="container">
            <div className={styles.sectionHead}>
              <span className={styles.sectionLabel}>Testimonials</span>
              <h2 className={styles.sectionTitle}>Brands that <span className={styles.accent}>love NovaPack</span></h2>
            </div>

            <div className={styles.testimonialsGrid}>
              {TESTIMONIALS.map((t, i) => (
                <div key={i} className={styles.testimonialCard}>
                  <Stars count={t.rating} />
                  <p className={styles.testimonialText}>{t.text}</p>
                  <div className={styles.testimonialAuthor}>
                    <div className={styles.authorAvatar}>{t.initial}</div>
                    <div>
                      <p className={styles.authorName}>{t.name}</p>
                      <p className={styles.authorRole}>{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ FINAL CTA ═══════════════════════════════════════════════════ */}
        <section className={styles.finalCta} aria-label="Final call to action">
          <div className={styles.finalCtaOrb} aria-hidden="true" />
          <div className="container">
            <div className={styles.finalCtaInner}>
              <h2 className={styles.finalCtaTitle}>
                Premium packaging,<br />
                <span className={styles.accent}>zero compromise</span>
              </h2>
              <p className={styles.finalCtaSub}>
                Join 50,000+ brands who trust NovaPack for their custom packaging.
                Start with as few as 50 units.
              </p>
              <div className={styles.finalCtaActions}>
                <a href="/custom-box" className={styles.btnPrimary}>
                  Get Your Free Quote
                </a>
                <a href="/how-it-works" className={styles.btnGhost}>
                  Learn More
                </a>
              </div>
              <div className={styles.finalCtaFeatures}>
                {['No setup fees', 'Samples in 24h', 'Free design support', 'Carbon-neutral shipping'].map((f) => (
                  <span key={f} className={styles.featureChip}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                      <path d="M2 6l3 3 5-5" stroke="#22c55e" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}

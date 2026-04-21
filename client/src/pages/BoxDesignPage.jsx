import { useState } from 'react';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import styles from './BoxDesignPage.module.css';

/* ─── Data ──────────────────────────────────────────────────────────────── */
const HERO_THUMBS = [
  { src: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&q=85&auto=format', alt: 'Box design 1' },
  { src: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=85&auto=format', alt: 'Box design 2' },
  { src: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&q=85&auto=format', alt: 'Box design 3' },
  { src: 'https://images.unsplash.com/photo-1574634534894-89d7576c8259?w=600&q=85&auto=format', alt: 'Box design 4' },
];

const DESIGNERS = [
  {
    name: 'Marco Visuals',
    level: 'Top Level',
    rating: '4.9',
    reviews: 312,
    initial: 'M',
    portfolio: [
      'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=300&q=75&auto=format',
      'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=300&q=75&auto=format',
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300&q=75&auto=format',
      'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=75&auto=format',
    ],
  },
  {
    name: 'Zara Kraft',
    level: 'Mid Level',
    rating: '4.8',
    reviews: 184,
    initial: 'Z',
    portfolio: [
      'https://images.unsplash.com/photo-1574634534894-89d7576c8259?w=300&q=75&auto=format',
      'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=300&q=75&auto=format',
      'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=300&q=75&auto=format',
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300&q=75&auto=format',
    ],
  },
  {
    name: 'Ben Typecraft',
    level: 'Top Level',
    rating: '5.0',
    reviews: 429,
    initial: 'B',
    portfolio: [
      'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&q=75&auto=format',
      'https://images.unsplash.com/photo-1574634534894-89d7576c8259?w=300&q=75&auto=format',
      'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=300&q=75&auto=format',
      'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=300&q=75&auto=format',
    ],
  },
];

const SERVICES = [
  {
    icon: '🏆',
    title: 'Run a design contest',
    priceFrom: 'US$299',
    desc: 'Post your project and get dozens of unique box designs from our global community of designers. Pick your favourite.',
    features: [
      'Receive 30–100+ unique concepts',
      'Work with multiple designers',
      'Full copyright ownership',
      'Money-back guarantee',
      'Dedicated design manager',
    ],
    cta: 'Start a contest',
    popular: true,
  },
  {
    icon: '🤝',
    title: 'Hire a designer 1-to-1',
    priceFrom: 'US$199',
    desc: 'Browse our directory of top packaging designers. Invite one you love and work directly together on your box design.',
    features: [
      'Direct collaboration',
      'Browse by style & specialty',
      'Flexible project scope',
      'Secure payment protection',
      'Review before you pay',
    ],
    cta: 'Find a designer',
    popular: false,
  },
];

const PROCESS_STEPS = [
  {
    num: '1',
    title: 'Launch your project',
    desc: 'Write your design brief. Tell us about your brand, product, target audience, and visual preferences.',
  },
  {
    num: '2',
    title: 'Receive custom designs',
    desc: 'Talented designers deliver concepts within days. Review, give feedback, and watch your box come to life.',
  },
  {
    num: '3',
    title: 'Download final files',
    desc: 'Choose your winner, request final tweaks, then download print-ready files in all formats you need.',
  },
];

const STYLES = [
  { src: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&q=80&auto=format', label: 'Minimalist' },
  { src: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&q=80&auto=format', label: 'Bold & Vibrant' },
  { src: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80&auto=format', label: 'Artisan & Craft' },
  { src: 'https://images.unsplash.com/photo-1574634534894-89d7576c8259?w=400&q=80&auto=format', label: 'Premium & Luxury' },
];

const FAQS = [
  {
    q: 'How much does box design cost?',
    a: 'Box design starts from US$299 for a design contest where you receive dozens of concepts from top designers. For 1-to-1 projects you can hire a designer starting from US$199 depending on scope. Pricing includes full copyright of the final design.',
  },
  {
    q: 'What files will I receive for my box design?',
    a: 'You will receive all source files including AI, EPS, PDF, and PNG formats. Files are delivered print-ready at the correct resolution, with bleed and crop marks included so you can send directly to any print supplier.',
  },
  {
    q: 'How long does a box design project take?',
    a: 'Design contests typically run for 7 days and you begin receiving concepts within the first 24 hours. 1-to-1 projects vary by designer and scope, but most packaging projects are completed within 5–14 business days.',
  },
  {
    q: 'Can I get a box design for any type of product?',
    a: 'Absolutely. Our designers specialise across all categories including food & beverage, cosmetics, electronics, apparel, subscription boxes, retail packaging, and more. Simply describe your product in your brief.',
  },
  {
    q: 'What if I am not happy with the designs I receive?',
    a: 'We offer a money-back guarantee on all design contests. If you are not satisfied with the quality of designs you receive, we will refund your entry fee in full — no questions asked.',
  },
];

/* ─── Chevron icon ───────────────────────────────── */
function ChevronDown({ className }) {
  return (
    <svg className={className} viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <path d="M5 8l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ════════════════════════════════════════════════════
   PAGE COMPONENT
════════════════════════════════════════════════════ */
export default function BoxDesignPage() {
  const [activeThumb, setActiveThumb]   = useState(0);
  const [openFaq,     setOpenFaq]       = useState(null);

  const toggleFaq = (i) => setOpenFaq(openFaq === i ? null : i);

  return (
    <div className={styles.page}>
      <Navbar />

      <main>
        {/* ══ HERO ════════════════════════════════════════ */}
        <section className={styles.hero} aria-label="Hero">
          <div className="container">
            <div className={styles.heroContent}>

              {/* Left text */}
              <div className={styles.heroLeft}>
                <div className={styles.heroBadge}>📦 Packaging &amp; Label Design</div>
                <h1 className={styles.heroTitle}>
                  Custom box design<br />for your brand
                </h1>
                <p className={styles.heroSub}>
                  Stand out on the shelf with professional box design from the world's best packaging designers.
                  Get dozens of unique concepts and choose the perfect one.
                </p>
                <div className={styles.heroCtas}>
                  <a href="/categories" className={styles.btnPrimary}>Start a contest</a>
                  <a href="/categories" className={styles.btnSecondary}>Hire a designer</a>
                </div>
              </div>

              {/* Right: image showcase */}
              <div className={styles.heroRight}>
                <div className={styles.heroImageStack}>
                  {/* Floating social-proof badges */}
                  <div className={styles.heroImgBadge}>
                    <span className={styles.badgeIcon}>⭐</span>
                    <div>
                      <div className={styles.badgeText}>4.9 / 5 rating</div>
                      <div className={styles.badgeSub}>from 500k+ clients</div>
                    </div>
                  </div>

                  <img
                    src={HERO_THUMBS[activeThumb].src}
                    alt={HERO_THUMBS[activeThumb].alt}
                    className={styles.heroImgMain}
                    loading="eager"
                    decoding="async"
                  />

                  <div className={styles.heroImgBadge2}>
                    <span className={styles.badgeIcon}>🎨</span>
                    <div>
                      <div className={styles.badgeText}>30–100+ concepts</div>
                      <div className={styles.badgeSub}>per contest</div>
                    </div>
                  </div>

                  {/* Thumbnail strip */}
                  <div className={styles.heroThumbs}>
                    {HERO_THUMBS.map((t, i) => (
                      <button
                        key={i}
                        className={`${styles.heroThumb} ${i === activeThumb ? styles.activeThumb : ''}`}
                        onClick={() => setActiveThumb(i)}
                        aria-label={`View design ${i + 1}`}
                        aria-pressed={i === activeThumb}
                      >
                        <img src={t.src} alt={t.alt} loading="lazy" decoding="async"/>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══ TRUST BAR ═══════════════════════════════════ */}
        <div className={styles.trustBar}>
          <div className={`container ${styles.trustInner}`}>
            <div className={styles.trustItem}><span className={styles.trustStar}>★</span> 4.9/5 average rating</div>
            <div className={styles.trustItem}>🏆 500,000+ happy clients</div>
            <div className={styles.trustItem}>🎨 1.7M designs created</div>
            <div className={styles.trustItem}>🌍 Designers in 90+ countries</div>
          </div>
        </div>

        {/* ══ VALUE PROP ══════════════════════════════════ */}
        <section className={styles.valueSection} aria-labelledby="value-title">
          <div className="container">
            <div className={styles.valueSplit}>
              <div className={styles.valueImgWrap}>
                <img
                  className={styles.valueImg}
                  src="https://images.unsplash.com/photo-1612817288484-6f916006741a?w=720&q=85&auto=format"
                  alt="Custom box design examples"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div>
                <p className={styles.valueLabel}>Why 99designs</p>
                <h2 className={styles.valueTitle} id="value-title">
                  Custom box design: creative ideas from professional designers
                </h2>
                <p className={styles.valueBody}>
                  Your packaging is often the first physical touchpoint customers have with your brand.
                  Great box design tells your story, builds trust, and turns one-time buyers into loyal fans.
                  Our global network of packaging specialists brings your vision to life.
                </p>
                <div className={styles.valueChecks}>
                  {[
                    'Work with specialists in packaging and print design',
                    'Receive concepts within 24 hours of launching',
                    'Full copyright ownership — forever',
                    'Print-ready files for any manufacturer',
                    '100% money-back guarantee',
                  ].map((item) => (
                    <div key={item} className={styles.valueCheck}>
                      <div className={styles.checkDot}/>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <a href="/categories" className={styles.btnPrimary}>Get started</a>
              </div>
            </div>
          </div>
        </section>

        {/* ══ DESIGNERS ═══════════════════════════════════ */}
        <section className={styles.designersSection} aria-labelledby="designers-title">
          <div className="container">
            <p className={styles.sectionLabel}>Our designers</p>
            <h2 className={styles.sectionTitle} id="designers-title">The right designer is just a click away</h2>
            <p className={styles.sectionSub}>
              Browse our global community of top-rated packaging and box designers — each vetted for quality.
            </p>
            <div className={styles.designersGrid}>
              {DESIGNERS.map((d) => (
                <div key={d.name} className={styles.designerCard}>
                  <div className={styles.designerPortfolio}>
                    {d.portfolio.map((src, i) => (
                      <img key={i} src={src} alt={`${d.name} portfolio`} className={styles.portfolioImg} loading="lazy" decoding="async"/>
                    ))}
                  </div>
                  <div className={styles.designerInfo}>
                    <div className={styles.designerAvatarFallback}>{d.initial}</div>
                    <div>
                      <div className={styles.designerName}>{d.name}</div>
                      <div className={styles.designerLevel}>
                        <span className={styles.levelBadge}>{d.level}</span>
                        · {d.reviews} reviews
                      </div>
                    </div>
                    <div className={styles.designerRating}>
                      <span className={styles.ratingStar}>★</span>
                      {d.rating}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ SERVICE OPTIONS ═════════════════════════════ */}
        <section className={styles.serviceSection} aria-labelledby="service-title">
          <div className="container">
            <p className={styles.sectionLabel}>Choose your path</p>
            <h2 className={styles.sectionTitle} id="service-title">Professional box design, no matter your budget</h2>
            <p className={styles.sectionSub}>Two great ways to get your perfect box design.</p>
            <div className={styles.serviceGrid}>
              {SERVICES.map((s) => (
                <div key={s.title} className={`${styles.serviceCard} ${s.popular ? styles.serviceCardPopular : ''}`}>
                  {s.popular && <span className={styles.popularBadge}>Most popular</span>}
                  <span className={styles.serviceIcon}>{s.icon}</span>
                  <h3 className={styles.serviceTitle}>{s.title}</h3>
                  <p className={styles.servicePrice}>Starting from <strong>{s.priceFrom}</strong></p>
                  <p className={styles.serviceDesc}>{s.desc}</p>
                  <div className={styles.serviceFeatures}>
                    {s.features.map((f) => (
                      <div key={f} className={styles.serviceFeature}>
                        <div className={styles.featureCheck}>✓</div>
                        {f}
                      </div>
                    ))}
                  </div>
                  <a href="/categories" className={styles.btnPrimary}>{s.cta}</a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ PROCESS ═════════════════════════════════════ */}
        <section className={styles.processSection} aria-labelledby="process-title">
          <div className="container">
            <p className={styles.sectionLabel}>How it works</p>
            <h2 className={styles.sectionTitle} id="process-title">The box design process</h2>
            <p className={styles.sectionSub}>From brief to print-ready files in as little as 7 days.</p>
            <div className={styles.processSteps}>
              {PROCESS_STEPS.map((step) => (
                <div key={step.num} className={styles.processStep}>
                  <div className={styles.processNum}>{step.num}</div>
                  <h3 className={styles.processTitle}>{step.title}</h3>
                  <p className={styles.processDesc}>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ STYLES SHOWCASE ═════════════════════════════ */}
        <section className={styles.stylesSection} aria-labelledby="styles-title">
          <div className="container">
            <p className={styles.sectionLabel}>Styles &amp; industries</p>
            <h2 className={styles.sectionTitle} id="styles-title">Any style, any industry. Our box designers do it all.</h2>
            <p className={styles.sectionSub}>
              Whether you need minimalist, bold, artisan, or luxury — our designers deliver exactly the aesthetic your brand needs.
            </p>
            <div className={styles.stylesGrid}>
              {STYLES.map((s) => (
                <div key={s.label} className={styles.styleCard}>
                  <img src={s.src} alt={s.label} className={styles.styleImg} loading="lazy" decoding="async"/>
                  <div className={styles.styleOverlay}>
                    <span className={styles.styleLabel}>{s.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ FAQ ═════════════════════════════════════════ */}
        <section className={styles.faqSection} aria-labelledby="faq-title">
          <div className="container">
            <p className={styles.sectionLabel}>Common questions</p>
            <h2 className={styles.sectionTitle} id="faq-title">Your burning box design FAQs, answered.</h2>
            <div className={styles.faqList}>
              {FAQS.map((faq, i) => (
                <div key={i} className={styles.faqItem}>
                  <button
                    className={styles.faqQuestion}
                    onClick={() => toggleFaq(i)}
                    aria-expanded={openFaq === i}
                    aria-controls={`faq-answer-${i}`}
                    id={`faq-question-${i}`}
                  >
                    {faq.q}
                    <ChevronDown className={`${styles.faqChevron} ${openFaq === i ? styles.open : ''}`} />
                  </button>
                  <div
                    id={`faq-answer-${i}`}
                    role="region"
                    aria-labelledby={`faq-question-${i}`}
                    className={`${styles.faqAnswer} ${openFaq === i ? styles.open : ''}`}
                  >
                    <p>{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ FINAL CTA ═══════════════════════════════════ */}
        <section className={styles.ctaBanner} aria-label="Get started">
          <div className="container">
            <h2 className={styles.ctaTitle}>Ready to create your perfect box design?</h2>
            <p className={styles.ctaSub}>
              Join over 500,000 businesses that have trusted 99designs to bring their packaging vision to life.
            </p>
            <div className={styles.ctaBtns}>
              <a href="/categories" className={styles.btnPrimary}>Start a design contest</a>
              <a href="/categories" className={`${styles.btnSecondary}`} style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.35)' }}>
                Browse designers
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

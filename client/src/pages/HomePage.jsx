import { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import styles from './HomePage.module.css';

/* ─── Hero carousel slides ──────────────────────────────────────────────── */
const SLIDES = [
  {
    img: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=560&q=85&auto=format',
    type: 'Packaging',
    designer: 'Mj.vass',
    client: 'Vegan Jerky Co',
    initial: 'M',
  },
  {
    img: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=560&q=85&auto=format',
    type: 'Branding',
    designer: 'Kamilla O.',
    client: 'Little Danube',
    initial: 'K',
  },
  {
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=560&q=85&auto=format',
    type: 'Identity',
    designer: 'Raveart',
    client: 'Feel Good Tea Co.',
    initial: 'R',
  },
  {
    img: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=560&q=85&auto=format',
    type: 'Merchandise',
    designer: 'illusive trust',
    client: 'The Studio Chicago',
    initial: 'I',
  },
];

/* ─── Category tiles ────────────────────────────────────────────────────── */
const CAT_TILES = [
  { label: 'Logo & branding design',     href: '/categories?tab=logo-identity',        img: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=300&q=75&auto=format' },
  { label: 'Website & app design',        href: '/categories?tab=web-app-design',       img: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=300&q=75&auto=format' },
  { label: 'Business & advertising',      href: '/categories?tab=business-advertising', img: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=300&q=75&auto=format' },
  { label: 'Art & illustration',           href: '/categories?tab=art-illustration',    img: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=300&q=75&auto=format' },
  { label: 'Packaging & label',           href: '/categories?tab=packaging-label',      img: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300&q=75&auto=format' },
];

/* ─── Designer profiles ─────────────────────────────────────────────────── */
const DESIGNERS = [
  {
    name: 'Reza Ernanda',
    level: 'Top Level',
    rating: '4.9',
    reviews: 312,
    initial: 'R',
    portfolio: [
      'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=240&q=70&auto=format',
      'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=240&q=70&auto=format',
      'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=240&q=70&auto=format',
      'https://images.unsplash.com/photo-1558655146-d09347e92766?w=240&q=70&auto=format',
    ],
  },
  {
    name: 'Mad Pepper',
    level: 'Mid Level',
    rating: '4.8',
    reviews: 184,
    initial: 'P',
    portfolio: [
      'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=240&q=70&auto=format',
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=240&q=70&auto=format',
      'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=240&q=70&auto=format',
      'https://images.unsplash.com/photo-1574634534894-89d7576c8259?w=240&q=70&auto=format',
    ],
  },
  {
    name: 'Radovan C.',
    level: 'Top Level',
    rating: '5.0',
    reviews: 429,
    initial: 'D',
    portfolio: [
      'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=240&q=70&auto=format',
      'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=240&q=70&auto=format',
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=240&q=70&auto=format',
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=240&q=70&auto=format',
    ],
  },
];

/* ─── Testimonials ──────────────────────────────────────────────────────── */
const TESTIMONIALS = [
  {
    stars: '★★★★★',
    text: '"The quality of designs was outstanding. The process was seamless and designers really understood my vision. I couldn\'t be happier with my new brand identity."',
    name: 'Sarah Mitchell',
    role: 'Founder, Bloom Wellness',
    initial: 'S',
  },
  {
    stars: '★★★★★',
    text: '"Working with 99designs was a game changer for our startup. We got 47 logo concepts in 7 days. Fun, fast, and professional — I\'d recommend it to any founder."',
    name: 'Marcus Chen',
    role: 'CEO, Launchpad Tech',
    initial: 'M',
  },
  {
    stars: '★★★★★',
    text: '"I\'ve used 99designs three times now. Every single time the quality has been incredible. The designers are talented, responsive, and truly professional."',
    name: 'Emma Rodriguez',
    role: 'Marketing Director, Café Nomad',
    initial: 'E',
  },
];

const STATS = [
  { num: 'Every 2s',  label: 'A new design is created' },
  { num: '697K+',     label: 'Client–designer connections' },
  { num: '192',       label: 'Countries represented' },
  { num: '11.6K',     label: 'People discussing design' },
];

/* ─── SVG city sketch ───────────────────────────────────────────────────── */
function CitySketch() {
  return (
    <svg className={styles.citySketch} viewBox="0 0 700 560" fill="none" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
      {/* Stars */}
      <g fill="#b8a8e8" opacity="0.75">
        <path d="M90 60l2.5-7 2.5 7 7 2.5-7 2.5-2.5 7-2.5-7-7-2.5z"/>
        <path d="M580 42l2-5.5 2 5.5 5.5 2-5.5 2-2 5.5-2-5.5-5.5-2z"/>
        <path d="M620 115l1.4-4 1.4 4 4 1.4-4 1.4-1.4 4-1.4-4-4-1.4z"/>
        <path d="M55 210l1.4-4 1.4 4 4 1.4-4 1.4-1.4 4-1.4-4-4-1.4z"/>
        <path d="M500 185l1.4-4 1.4 4 4 1.4-4 1.4-1.4 4-1.4-4-4-1.4z"/>
        <path d="M120 345l1.2-3.5 1.2 3.5 3.5 1.2-3.5 1.2-1.2 3.5-1.2-3.5-3.5-1.2z"/>
      </g>

      {/* Buildings outline */}
      <g stroke="#b8a8e8" strokeWidth="1.5" fill="none" strokeLinecap="round">
        {/* LEFT cluster */}
        <rect x="18" y="215" width="52" height="305"/>
        <rect x="26" y="198" width="36" height="17"/>
        <rect x="33" y="182" width="22" height="16"/>
        <line x1="44" y1="182" x2="44" y2="158"/>
        <path d="M37 158h14l-7-16z"/>
        <rect x="28" y="228" width="7" height="7"/><rect x="43" y="228" width="7" height="7"/><rect x="58" y="228" width="7" height="7"/>
        <rect x="28" y="244" width="7" height="7"/><rect x="43" y="244" width="7" height="7"/><rect x="58" y="244" width="7" height="7"/>
        <rect x="28" y="260" width="7" height="7"/><rect x="43" y="260" width="7" height="7"/>

        <rect x="74" y="258" width="58" height="262"/>
        <rect x="82" y="242" width="42" height="16"/>
        <rect x="84" y="272" width="7" height="7"/><rect x="99" y="272" width="7" height="7"/><rect x="114" y="272" width="7" height="7"/>
        <rect x="84" y="288" width="7" height="7"/><rect x="99" y="288" width="7" height="7"/><rect x="114" y="288" width="7" height="7"/>
        <rect x="84" y="304" width="7" height="7"/><rect x="99" y="304" width="7" height="7"/>

        <rect x="137" y="278" width="44" height="242"/>
        <rect x="143" y="264" width="32" height="14"/>
        <line x1="159" y1="264" x2="159" y2="244"/>
        <rect x="144" y="290" width="6" height="6"/><rect x="157" y="290" width="6" height="6"/><rect x="170" y="290" width="6" height="6"/>

        {/* Cloud LEFT */}
        <path d="M150 115 Q163 100 180 105 Q185 88 205 90 Q228 88 232 105 Q250 100 257 115 Q250 125 232 123v7Q205 135 180 130v-7Q165 125 150 115z" opacity="0.55"/>

        {/* RIGHT cluster */}
        <rect x="480" y="208" width="65" height="312"/>
        <rect x="489" y="191" width="47" height="17"/>
        <rect x="498" y="172" width="29" height="19"/>
        <line x1="512" y1="172" x2="512" y2="150"/>
        <path d="M505 150h14l-7-17z"/>
        <rect x="492" y="222" width="8" height="8"/><rect x="507" y="222" width="8" height="8"/><rect x="522" y="222" width="8" height="8"/><rect x="537" y="222" width="8" height="8"/>
        <rect x="492" y="240" width="8" height="8"/><rect x="507" y="240" width="8" height="8"/><rect x="522" y="240" width="8" height="8"/>
        <rect x="492" y="258" width="8" height="8"/><rect x="507" y="258" width="8" height="8"/>

        <rect x="549" y="238" width="76" height="282"/>
        <rect x="557" y="222" width="60" height="16"/>
        <rect x="559" y="252" width="8" height="8"/><rect x="574" y="252" width="8" height="8"/><rect x="589" y="252" width="8" height="8"/><rect x="604" y="252" width="8" height="8"/>
        <rect x="559" y="270" width="8" height="8"/><rect x="574" y="270" width="8" height="8"/><rect x="589" y="270" width="8" height="8"/>
        <rect x="559" y="288" width="8" height="8"/><rect x="574" y="288" width="8" height="8"/>

        <rect x="629" y="280" width="55" height="240"/>
        <rect x="636" y="266" width="41" height="14"/>
        <rect x="638" y="294" width="7" height="7"/><rect x="651" y="294" width="7" height="7"/><rect x="664" y="294" width="7" height="7"/>

        {/* Cloud RIGHT */}
        <path d="M400 148 Q412 135 426 139 Q431 125 447 126 Q463 125 467 139 Q481 135 490 148 Q481 157 467 155v5Q447 163 426 159v-5Q414 157 400 148z" opacity="0.45"/>
      </g>

      {/* Ground */}
      <line x1="0" y1="520" x2="700" y2="520" stroke="#b8a8e8" strokeWidth="1.2" opacity="0.35"/>
    </svg>
  );
}

/* ════════════════════════════════════════════════════════════
   COMPONENT
════════════════════════════════════════════════════════════ */
export default function HomePage() {
  const [slideIdx, setSlideIdx] = useState(0);
  const [query, setQuery]       = useState('');
  const timerRef                = useRef(null);

  const startTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(
      () => setSlideIdx((i) => (i + 1) % SLIDES.length),
      4500
    );
  };

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, []);

  const goTo = (i) => { setSlideIdx(i); startTimer(); };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) window.location.href = `/search?q=${encodeURIComponent(query)}`;
  };

  return (
    <div className={styles.page}>
      <Navbar />

      <main>
        {/* ══ HERO ══════════════════════════════════════════ */}
        <section className={styles.hero} aria-label="Hero">

          {/* LEFT — showcase */}
          <div className={styles.heroLeft}>
            <CitySketch />

            <div className={styles.slideStack}>
              {SLIDES.map((s, i) => (
                <div
                  key={i}
                  className={`${styles.slide} ${i === slideIdx ? styles.slideActive : ''}`}
                  aria-hidden={i !== slideIdx}
                >
                  <div className={styles.designCard}>
                    <img
                      src={s.img}
                      alt={`${s.type} by ${s.designer} for ${s.client}`}
                      loading={i === 0 ? 'eager' : 'lazy'}
                      decoding="async"
                    />
                    <div className={styles.attribution}>
                      <div className={styles.attributionAvatar}>{s.initial}</div>
                      {s.type} by {s.designer}
                    </div>
                  </div>
                  <p className={styles.caption}>Created for {s.client}</p>
                </div>
              ))}
            </div>

            {/* Dot nav */}
            <div className={styles.slideDots} role="tablist">
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
          </div>

          {/* RIGHT — CTA */}
          <div className={styles.heroRight}>
            <h1 className={styles.headline}>
              Grow with<br />great design
            </h1>
            <p className={styles.subtext}>
              No matter what your business needs, we can connect you with a creative expert
              to make your business <strong>look</strong> and <strong>feel</strong> professional.
              Because good design makes great business.
            </p>

            <form className={styles.searchRow} onSubmit={handleSearch} role="search">
              <div className={styles.searchWrap}>
                <svg className={styles.searchIconSvg} viewBox="0 0 18 18" fill="none" aria-hidden="true">
                  <circle cx="7.5" cy="7.5" r="5.5" stroke="currentColor" strokeWidth="1.6"/>
                  <path d="M13 13l3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
                <input
                  className={styles.searchInput}
                  type="search"
                  placeholder="What do you need designed?"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  aria-label="Search for design services"
                />
              </div>
              <button className={styles.ctaBtn} type="submit">Get a design</button>
            </form>

            <div className={styles.popular}>
              <span className={styles.popularLabel}>Popular:</span>
              {[
                { label: 'Logo design', href: '/categories?tab=logo-identity' },
                { label: 'Website',     href: '/categories?tab=web-app-design' },
                { label: 'Branding',    href: '/categories?tab=logo-identity' },
                { label: 'Packaging',   href: '/categories?tab=packaging-label' },
              ].map((tag) => (
                <a key={tag.label} href={tag.href} className={styles.popularTag}>{tag.label}</a>
              ))}
            </div>
          </div>
        </section>

        {/* ══ "DESIGN FOR WHAT YOU NEED" ════════════════════ */}
        <section className={styles.catSection} aria-labelledby="cat-title">
          <div className="container">
            <h2 className={styles.catSectionTitle} id="cat-title">Design for what you need</h2>
            <div className={styles.catTiles}>
              {CAT_TILES.map((cat) => (
                <a key={cat.label} href={cat.href} className={styles.catTile}>
                  <img src={cat.img} alt={cat.label} className={styles.catTileImg} loading="lazy" decoding="async"/>
                  <span className={styles.catTileName}>{cat.label}</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ══ "YOUR BUSINESS DESERVES GREAT DESIGN" ═════════ */}
        <section className={styles.businessSection} aria-labelledby="business-title">
          <div className="container">
            <div className={styles.businessInner}>
              <div className={styles.businessLeft}>
                <p className={styles.businessTag}>Why 99designs</p>
                <h2 className={styles.businessTitle} id="business-title">
                  Your business deserves great design
                </h2>
                <p className={styles.businessBody}>
                  Work with the world's best designers — vetted for quality, available on demand.
                  Whether you need a logo, packaging, a website, or a full brand identity, our
                  global community delivers creative work that moves your business forward.
                </p>
                <div className={styles.businessBtnWrap}>
                  <a href="/categories" className={styles.btnDark}>Start a project</a>
                  <a href="/categories" className={styles.btnOutline}>Browse designers</a>
                </div>
              </div>

              {/* 2×2 mosaic */}
              <div className={styles.businessRight}>
                <img className={styles.mosaicImg} src="https://images.unsplash.com/photo-1626785774573-4b799315345d?w=340&q=80&auto=format" alt="Brand design" loading="lazy" decoding="async"/>
                <img className={styles.mosaicImg} src="https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=340&q=80&auto=format" alt="Packaging design" loading="lazy" decoding="async"/>
                <img className={styles.mosaicImg} src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=340&q=80&auto=format" alt="Book cover design" loading="lazy" decoding="async"/>
                <img className={styles.mosaicImg} src="https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=340&q=80&auto=format" alt="Website design" loading="lazy" decoding="async"/>
              </div>
            </div>
          </div>
        </section>

        {/* ══ "IT ALL STARTS WITH A LOGO" ═══════════════════ */}
        <section className={styles.logoSection} aria-labelledby="logo-title">
          <div className="container">
            <h2 className={styles.catSectionTitle} id="logo-title">It all starts with a logo</h2>
            <div className={styles.logoInner}>
              <a href="/categories?tab=logo-identity" className={styles.logoCard}>
                <img className={styles.logoCardBg} src="https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=700&q=80&auto=format" alt="Logo design contest" loading="lazy" decoding="async"/>
                <div className={styles.logoCardOverlay}/>
                <div className={styles.logoCardContent}>
                  <p className={styles.logoCardEyebrow}>Design contest</p>
                  <h3 className={styles.logoCardTitle}>Get dozens of logo concepts</h3>
                  <p className={styles.logoCardSub}>Starting from US$299 · 30–100+ designs</p>
                  <span className={styles.logoCardBtn}>Start a contest</span>
                </div>
              </a>
              <a href="/categories?tab=logo-identity" className={styles.logoCard}>
                <img className={styles.logoCardBg} src="https://images.unsplash.com/photo-1558655146-d09347e92766?w=700&q=80&auto=format" alt="Hire a logo designer" loading="lazy" decoding="async"/>
                <div className={styles.logoCardOverlay}/>
                <div className={styles.logoCardContent}>
                  <p className={styles.logoCardEyebrow}>1-to-1 project</p>
                  <h3 className={styles.logoCardTitle}>Work directly with a top designer</h3>
                  <p className={styles.logoCardSub}>Starting from US$199 · Direct collaboration</p>
                  <span className={styles.logoCardBtn}>Hire a designer</span>
                </div>
              </a>
            </div>
          </div>
        </section>

        {/* ══ DESIGNER PROFILES ════════════════════════════ */}
        <section className={styles.designersSection} aria-labelledby="designers-title">
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle} id="designers-title">
                Work with creative experts you can trust
              </h2>
              <a href="/categories" className={styles.sectionLink}>Browse all designers →</a>
            </div>
            <div className={styles.designersGrid}>
              {DESIGNERS.map((d) => (
                <div key={d.name} className={styles.designerCard}>
                  <div className={styles.designerPortfolio}>
                    {d.portfolio.map((src, i) => (
                      <img key={i} src={src} alt={`${d.name} work`} className={styles.portfolioImg} loading="lazy" decoding="async"/>
                    ))}
                  </div>
                  <div className={styles.designerMeta}>
                    <div className={styles.designerAvatar}>{d.initial}</div>
                    <div>
                      <div className={styles.designerName}>{d.name}</div>
                      <div className={styles.designerSub}>
                        <span className={styles.levelPill}>{d.level}</span>
                        · {d.reviews} reviews
                      </div>
                    </div>
                    <div className={styles.ratingWrap}>
                      <span className={styles.ratingStar}>★</span>
                      {d.rating}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ TESTIMONIALS ══════════════════════════════════ */}
        <section className={styles.testimonialsSection} aria-labelledby="testimonials-title">
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle} id="testimonials-title">
                Loved by businesses worldwide
              </h2>
            </div>
            <div className={styles.testimonialsGrid}>
              {TESTIMONIALS.map((t) => (
                <div key={t.name} className={styles.testimonialCard}>
                  <div className={styles.tStars}>{t.stars}</div>
                  <p className={styles.tText}>{t.text}</p>
                  <div className={styles.tAuthor}>
                    <div className={styles.tAvatarWrap}>{t.initial}</div>
                    <div>
                      <div className={styles.tName}>{t.name}</div>
                      <div className={styles.tRole}>{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ STATS ═════════════════════════════════════════ */}
        <section className={styles.statsSection} aria-label="Statistics">
          <div className="container">
            <div className={styles.statsGrid}>
              {STATS.map((s) => (
                <div key={s.label}>
                  <div className={styles.statNum}>{s.num}</div>
                  <div className={styles.statLabel}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ FINAL CTA ═════════════════════════════════════ */}
        <section className={styles.ctaBanner} aria-label="Get started">
          <div className="container">
            <h2 className={styles.ctaTitle}>Ready to level up your look with a great design?</h2>
            <p className={styles.ctaSub}>
              Join over 500,000 businesses that have used 99designs to grow their brand.
            </p>
            <a href="/categories" className={styles.ctaBannerBtn}>Get started today</a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

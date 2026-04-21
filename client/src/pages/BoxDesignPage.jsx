import { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import styles from './BoxDesignPage.module.css';

/* ─── Data ──────────────────────────────────────────────────────────────── */
const HERO_SLIDES = [
  {
    src: 'https://99designs-start-attachments.imgix.net/alchemy-pictures/2016%2F02%2F12%2F03%2F23%2F00%2F5f58cf59-27ed-4de7-95f8-965d41fd2b5b%2FHero3.png?auto=format&ch=Width%2CDPR&crop=false&fm=png&q=25&w=900&h=900',
    alt: 'Packaging design by Khramova', designer: 'Khramova', color: '#D61D56',
  },
  {
    src: 'https://99designs-start-attachments.imgix.net/alchemy-pictures/2016%2F02%2F19%2F05%2F04%2F52%2F345d2885-7d23-4381-aa98-e1fd7e2f526b%2FHero2.png?auto=format&ch=Width%2CDPR&crop=false&fm=png&q=25&w=900&h=900',
    alt: 'Packaging design by Imee008', designer: 'Imee008', color: '#739341',
  },
];

const INFO_CARDS = [
  {
    title: 'Run a box design contest',
    desc: 'Designers from around the world enter your contest by sending you ideas. You give feedback to create the ideal box design.',
  },
  {
    title: 'Hire a professional packaging designer',
    desc: "Tell us what you're looking for and we'll match you with the perfect design partner. Or, if you'd prefer, browse portfolios and pick your own.",
  },
  {
    title: "We're your creative partner",
    desc: "No matter how you choose to work, rest assured you're working with the best. All of our designers are hand-vetted and rated, and our team provides 24/7 support.",
  },
];

const DESIGNERS = [
  {
    id: 1315030, name: 'Emir Alicic', level: 'Top Level', rating: '4.98', reviews: 218,
    stats: [{ a: '302', l: 'Projects' }, { a: '71', l: 'Repeat clients' }, { a: '84%', l: 'Responds within 24 hrs' }],
    portfolio: [
      { src: 'https://images-platform.99static.com//BUQGzZi2NY7AMZ56Wf1jHD0AT5A=/400x400/99designs-contests-attachments/75/75916/attachment_75916058', alt: 'Chocolate Wrapper' },
      { src: 'https://images-platform.99static.com//ZRt2e3EfC9zwhnfj-iNG1Tk0ppE=/400x400/99designs-work-samples/work-sample-designs/1315030/dda0b22d-e2d6-40d2-8425-84511f0f5cac', alt: 'Food Packaging' },
      { src: 'https://images-platform.99static.com//5_U-0mQk-dKKnhUhV2yc1tiwrmI=/400x400/99designs-work-samples/work-sample-designs/1315030/fcc527bb-ced2-4c83-9408-930c69492e82', alt: 'Brand Packaging' },
      { src: 'https://images-platform.99static.com//1XYjPvxjL_twqFBcsKPn97LKMBc=/400x400/99designs-contests-attachments/132/132547/attachment_132547227', alt: 'Label Design' },
    ], initial: 'E',
  },
  {
    id: 1465010, name: 'Esteban Tolosa', level: 'Top Level', rating: '4.98', reviews: 384,
    stats: [{ a: '657', l: 'Projects' }, { a: '91', l: 'Repeat clients' }, { a: '92%', l: 'Responds within 24 hrs' }],
    portfolio: [
      { src: 'https://images-platform.99static.com//I2IDCrbaxbCuPLEo-j7Qh96yrjE=/400x400/99designs-contests-attachments/89/89372/attachment_89372520', alt: 'Luxury Gin' },
      { src: 'https://images-platform.99static.com//NT0wxaLHZBox1j7M5fUjV3mV4Jo=/400x400/99designs-contests-attachments/77/77921/attachment_77921502', alt: 'Whiskey Box' },
      { src: 'https://images-platform.99static.com//Yen-lGjdqUZBNNW_0B0LlIkxwF8=/400x400/99designs-contests-attachments/73/73382/attachment_73382792', alt: 'Hot Sauce' },
      { src: 'https://images-platform.99static.com//gHmbJC-LzfTrszdsr3yJ6ufNmlQ=/400x400/99designs-work-samples/work-sample-designs/1465010/66bb153e-6755-4100-a159-374fd8df2cbb', alt: 'Mr Kylin' },
    ], initial: 'E',
  },
  {
    id: 3243158, name: 'Pepper Pack Design', level: 'Top Level', rating: '5.0', reviews: 216,
    stats: [{ a: '362', l: 'Projects' }, { a: '54', l: 'Repeat clients' }, { a: '72%', l: 'Responds within 24 hrs' }],
    portfolio: [
      { src: 'https://images-platform.99static.com//EY3Vxpo_9d7_EI6x-_tBKVb2IWI=/400x400/99designs-work-samples/work-sample-designs/3243158/76fdb2c5-f6ed-4a10-bce5-6c12de96ca13', alt: 'Protein Bars' },
      { src: 'https://images-platform.99static.com//ygw5ty5igIfPIOhWoOhZ5FJgmqQ=/400x400/projects-files/206/20628/2062862/a3fd5610-d155-4be5-a814-20ba711ba0a0.jpg', alt: 'Coffee Packaging' },
      { src: 'https://images-platform.99static.com//KrnkmKQ5lmpmvQKD_bWzVchuEdY=/400x400/projects-files/200/20048/2004882/11810bcf-91d4-4879-8f95-1dcebce7f9bc.jpeg', alt: 'Popcorn Packaging' },
      { src: 'https://images-platform.99static.com//u2eV1Pn1_UMSdaAJnFRpFtLOFJk=/400x400/99designs-contests-attachments/108/108022/attachment_108022726', alt: 'Fruit Jellies' },
    ], initial: 'P',
  },
  {
    id: 'd4', name: 'Vasily ERA', level: 'Top Level', rating: '5.0', reviews: 222,
    stats: [{ a: '257', l: 'Projects' }, { a: '63', l: 'Repeat clients' }, { a: '100%', l: 'Responds within 24 hrs' }],
    portfolio: [
      { src: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&q=80&auto=format', alt: 'Packaging' },
      { src: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&q=80&auto=format', alt: 'Packaging' },
      { src: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&q=80&auto=format', alt: 'Packaging' },
      { src: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&q=80&auto=format', alt: 'Packaging' },
    ], initial: 'V',
  },
  {
    id: 'd5', name: 'vitalfuerze', level: 'Top Level', rating: '5.0', reviews: 165,
    stats: [{ a: '246', l: 'Projects' }, { a: '32', l: 'Repeat clients' }, { a: '82%', l: 'Responds within 24 hrs' }],
    portfolio: [
      { src: 'https://images.unsplash.com/photo-1574634534894-89d7576c8259?w=400&q=80&auto=format', alt: 'Packaging' },
      { src: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80&auto=format', alt: 'Packaging' },
      { src: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400&q=80&auto=format', alt: 'Packaging' },
      { src: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&q=80&auto=format', alt: 'Packaging' },
    ], initial: 'V',
  },
  {
    id: 'd6', name: 'vesmil', level: 'Top Level', rating: '5.0', reviews: 184,
    stats: [{ a: '294', l: 'Projects' }, { a: '44', l: 'Repeat clients' }, { a: '100%', l: 'Responds within 24 hrs' }],
    portfolio: [
      { src: 'https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=400&q=80&auto=format', alt: 'Packaging' },
      { src: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&q=80&auto=format', alt: 'Packaging' },
      { src: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&q=80&auto=format', alt: 'Packaging' },
      { src: 'https://images.unsplash.com/photo-1574634534894-89d7576c8259?w=400&q=80&auto=format', alt: 'Packaging' },
    ], initial: 'V',
  },
  {
    id: 'd7', name: 'eolinart', level: 'Top Level', rating: '5.0', reviews: 117,
    stats: [{ a: '208', l: 'Projects' }, { a: '40', l: 'Repeat clients' }, { a: '100%', l: 'Responds within 24 hrs' }],
    portfolio: [
      { src: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&q=80&auto=format', alt: 'Packaging' },
      { src: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80&auto=format', alt: 'Packaging' },
      { src: 'https://images.unsplash.com/photo-1574634534894-89d7576c8259?w=400&q=80&auto=format', alt: 'Packaging' },
      { src: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400&q=80&auto=format', alt: 'Packaging' },
    ], initial: 'E',
  },
  {
    id: 'd8', name: 'Senchy', level: 'Top Level', rating: '5.0', reviews: 216,
    stats: [{ a: '554', l: 'Projects' }, { a: '59', l: 'Repeat clients' }, { a: '98%', l: 'Responds within 24 hrs' }],
    portfolio: [
      { src: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&q=80&auto=format', alt: 'Packaging' },
      { src: 'https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=400&q=80&auto=format', alt: 'Packaging' },
      { src: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&q=80&auto=format', alt: 'Packaging' },
      { src: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&q=80&auto=format', alt: 'Packaging' },
    ], initial: 'S',
  },
  {
    id: 'd9', name: 'Jan_m', level: 'Top Level', rating: '4.94', reviews: 197,
    stats: [{ a: '543', l: 'Projects' }, { a: '34', l: 'Repeat clients' }, { a: '100%', l: 'Responds within 24 hrs' }],
    portfolio: [
      { src: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&q=80&auto=format', alt: 'Packaging' },
      { src: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80&auto=format', alt: 'Packaging' },
      { src: 'https://images.unsplash.com/photo-1574634534894-89d7576c8259?w=400&q=80&auto=format', alt: 'Packaging' },
      { src: 'https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=400&q=80&auto=format', alt: 'Packaging' },
    ], initial: 'J',
  },
  {
    id: 'd10', name: 'identity pulse', level: 'Top Level', rating: '4.99', reviews: 199,
    stats: [{ a: '246', l: 'Projects' }, { a: '32', l: 'Repeat clients' }, { a: '92%', l: 'Responds within 24 hrs' }],
    portfolio: [
      { src: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400&q=80&auto=format', alt: 'Packaging' },
      { src: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&q=80&auto=format', alt: 'Packaging' },
      { src: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&q=80&auto=format', alt: 'Packaging' },
      { src: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&q=80&auto=format', alt: 'Packaging' },
    ], initial: 'I',
  },
];

const PROCESS_STEPS = [
  {
    color: '#6B5DD3',
    screenTitle: '1. Describe your perfect box design',
    stepTitle: 'Describe your perfect box design',
    stepDesc: 'Our creative brief makes it easy to describe your vision for the perfect box design and set your budget.',
    icon: '✏',
  },
  {
    color: '#3D9B8E',
    screenTitle: '2. Find an amazing design partner',
    stepTitle: 'Find an amazing design partner',
    stepDesc: "We'll help you connect with professional designers to bring your vision to life. You'll collaborate and give feedback to create the ideal box for your product.",
    icon: '⊞',
  },
  {
    color: '#E83E8C',
    screenTitle: '3. Get a box design you love',
    stepTitle: 'Get a box design you love',
    stepDesc: "We're your creative partner from start to finish. Once you finalize your design, we'll transfer the copyright and send you the image files.",
    icon: '♥',
  },
];

const GALLERY_IMGS = [
  'https://images-platform.99static.com//BUQGzZi2NY7AMZ56Wf1jHD0AT5A=/400x400/99designs-contests-attachments/75/75916/attachment_75916058',
  'https://images-platform.99static.com//ZRt2e3EfC9zwhnfj-iNG1Tk0ppE=/400x400/99designs-work-samples/work-sample-designs/1315030/dda0b22d-e2d6-40d2-8425-84511f0f5cac',
  'https://images-platform.99static.com//5_U-0mQk-dKKnhUhV2yc1tiwrmI=/400x400/99designs-work-samples/work-sample-designs/1315030/fcc527bb-ced2-4c83-9408-930c69492e82',
  'https://images-platform.99static.com//I2IDCrbaxbCuPLEo-j7Qh96yrjE=/400x400/99designs-contests-attachments/89/89372/attachment_89372520',
  'https://images-platform.99static.com//NT0wxaLHZBox1j7M5fUjV3mV4Jo=/400x400/99designs-contests-attachments/77/77921/attachment_77921502',
  'https://images-platform.99static.com//Yen-lGjdqUZBNNW_0B0LlIkxwF8=/400x400/99designs-contests-attachments/73/73382/attachment_73382792',
];

const STYLE_IMAGES = [
  { src: 'https://images-platform.99static.com//BUQGzZi2NY7AMZ56Wf1jHD0AT5A=/400x400/99designs-contests-attachments/75/75916/attachment_75916058', label: 'Minimalist' },
  { src: 'https://images-platform.99static.com//I2IDCrbaxbCuPLEo-j7Qh96yrjE=/400x400/99designs-contests-attachments/89/89372/attachment_89372520', label: 'Bold & Vibrant' },
  { src: 'https://images-platform.99static.com//EY3Vxpo_9d7_EI6x-_tBKVb2IWI=/400x400/99designs-work-samples/work-sample-designs/3243158/76fdb2c5-f6ed-4a10-bce5-6c12de96ca13', label: 'Artisan & Craft' },
  { src: 'https://images-platform.99static.com//ygw5ty5igIfPIOhWoOhZ5FJgmqQ=/400x400/projects-files/206/20628/2062862/a3fd5610-d155-4be5-a814-20ba711ba0a0.jpg', label: 'Premium & Luxury' },
];

const FAQS = [
  { q: 'How much does box design cost?', a: 'Box design starts from US$449 for a design contest where you receive dozens of concepts from top designers. For 1-to-1 projects you can hire a designer starting from US$299. Pricing includes full copyright of the final design.' },
  { q: 'What files will I receive for my box design?', a: 'You will receive all source files including AI, EPS, PDF, and PNG formats. Files are delivered print-ready at the correct resolution, with bleed and crop marks included so you can send directly to any print supplier.' },
  { q: 'How long does a box design project take?', a: 'Design contests typically run for 7 days and you begin receiving concepts within the first 24 hours. 1-to-1 projects vary by designer and scope, but most packaging projects are completed within 5–14 business days.' },
  { q: 'Can I get a box design for any type of product?', a: 'Absolutely. Our designers specialise across all categories including food & beverage, cosmetics, electronics, apparel, subscription boxes, retail packaging, and more.' },
  { q: 'What if I am not happy with the designs I receive?', a: 'We offer a money-back guarantee on all design contests. If you are not satisfied with the quality of designs you receive, we will refund your entry fee in full — no questions asked.' },
  { q: 'Do I own the copyright of the box design?', a: 'Yes. Once you select a winner and release the prize, full copyright is transferred to you. You own the design outright and can use it anywhere, forever.' },
  { q: 'Can designers create packaging dielines?', a: 'Many of our packaging designers can work with dielines. You can request this in your brief, and designers will confirm if they can deliver the specific format you need.' },
];

/* ─── Star Rating ────────────────────────────────────────────────────────── */
function StarRating({ rating }) {
  const val = parseFloat(rating);
  return (
    <span className={styles.stars} aria-label={`${rating} stars`}>
      {[1, 2, 3, 4, 5].map((n) => {
        const pct = Math.min(100, Math.max(0, (val - (n - 1)) * 100));
        return (
          <span key={n} className={styles.starWrap}>
            <span className={styles.starBg}>★</span>
            <span className={styles.starFill} style={{ width: `${pct}%` }}>★</span>
          </span>
        );
      })}
    </span>
  );
}

/* ─── Designer Card (with portfolio carousel) ────────────────────────────── */
function DesignerCard({ d }) {
  const [idx, setIdx] = useState(0);
  const total = d.portfolio.length;
  const prev = () => setIdx((i) => (i - 1 + total) % total);
  const next = () => setIdx((i) => (i + 1) % total);

  return (
    <div className={styles.designerCard}>
      <div className={styles.cardMeta}>
        <div className={styles.cardAvatarWrap}>
          <img
            className={styles.cardAvatar}
            src={`https://99designs.com/avatars/users/${d.id}/128`}
            alt={d.name}
            onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'flex'; }}
          />
          <span className={styles.cardAvatarFallback} style={{ display: 'none' }}>{d.initial}</span>
        </div>
        <div>
          <div className={styles.cardName}>{d.name}</div>
          <span className={styles.levelPill}>{d.level}</span>
          <div className={styles.cardRatingRow}>
            <span className={styles.ratingNum}>{d.rating}</span>
            <StarRating rating={d.rating} />
            <span className={styles.reviewCount}>({d.reviews})</span>
          </div>
        </div>
      </div>

      <div className={styles.cardStats}>
        {d.stats.map((s) => (
          <div key={s.l} className={styles.statCol}>
            <div className={styles.statAmount}>{s.a}</div>
            <div className={styles.statLabel}>{s.l}</div>
          </div>
        ))}
      </div>

      <div className={styles.carousel}>
        <div className={styles.carouselViewport}>
          <div className={styles.carouselTrack} style={{ transform: `translateX(-${idx * 100}%)` }}>
            {d.portfolio.map((p, i) => (
              <div key={i} className={styles.carouselSlide}>
                <img src={p.src} alt={p.alt} loading={i === 0 ? 'eager' : 'lazy'} decoding="async" />
              </div>
            ))}
          </div>
          <button className={`${styles.carouselBtn} ${styles.carouselBtnPrev}`} onClick={prev} aria-label="Previous">
            <svg width="7" height="13" viewBox="0 0 7 13" fill="none"><path d="M6 1L1 6.5 6 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <button className={`${styles.carouselBtn} ${styles.carouselBtnNext}`} onClick={next} aria-label="Next">
            <svg width="7" height="13" viewBox="0 0 7 13" fill="none"><path d="M1 1l5 5.5L1 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
        <div className={styles.carouselDots}>
          {d.portfolio.map((_, i) => (
            <button key={i} className={`${styles.carouselDot} ${i === idx ? styles.carouselDotActive : ''}`} onClick={() => setIdx(i)} aria-label={`Design ${i + 1}`} />
          ))}
        </div>
      </div>

      <div className={styles.cardCta}>
        <a href="/categories?tab=packaging-label" className={styles.requestBtn}>Request quote</a>
      </div>
    </div>
  );
}

/* ─── Designer Slider (mouse-edge scrolling) ─────────────────────────────── */
function DesignerSlider() {
  const containerRef = useRef(null);
  const velRef = useRef(0);
  const rafRef = useRef(null);

  const onMouseMove = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    if (pct < 0.12) velRef.current = -4;
    else if (pct > 0.88) velRef.current = 4;
    else velRef.current = 0;
  };

  useEffect(() => {
    const tick = () => {
      if (containerRef.current && velRef.current !== 0) {
        containerRef.current.scrollLeft += velRef.current;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div
      ref={containerRef}
      className={styles.designerSlider}
      onMouseMove={onMouseMove}
      onMouseLeave={() => { velRef.current = 0; }}
    >
      <div className={styles.designerTrack}>
        {DESIGNERS.map((d) => <DesignerCard key={d.id} d={d} />)}
      </div>
    </div>
  );
}

/* ─── Laptop Process ─────────────────────────────────────────────────────── */
function ProcessLaptop({ step, onPrev, onNext }) {
  const s = PROCESS_STEPS[step];

  return (
    <div className={styles.laptopOuter}>
      <button className={`${styles.laptopArrow} ${styles.laptopArrowLeft}`} onClick={onPrev} aria-label="Previous step">
        <svg width="10" height="18" viewBox="0 0 10 18" fill="none"><path d="M9 1L1 9l8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>

      <div className={styles.laptopWrapper}>
        <div className={styles.laptopTop}>
          <div className={styles.laptopCamera} />
          <div className={styles.laptopScreen}>
            {/* Screen header */}
            <div className={styles.screenHeader} style={{ background: s.color }}>
              <span>{s.icon}</span> {s.screenTitle}
            </div>

            {/* Screen body per step */}
            {step === 0 && (
              <div className={styles.screenBrief}>
                <p className={styles.briefText}>We'd like a simple and timeless design</p>
                <p className={styles.briefText}>that's purple in color and appeals to a</p>
                <p className={styles.briefCursor}>youthful audience<span className={styles.cursor}>|</span></p>
                <div className={styles.briefLine} />
                <div className={styles.briefLine} />
                <div className={styles.briefLine} />
              </div>
            )}

            {step === 1 && (
              <div className={styles.screenGallery}>
                {GALLERY_IMGS.map((src, i) => (
                  <div key={i} className={styles.galleryThumb}>
                    <img src={src} alt={`Design ${i + 4}`} />
                    <div className={styles.galleryLabel}>#{i + 4} by designer</div>
                  </div>
                ))}
              </div>
            )}

            {step === 2 && (
              <div className={styles.screenWinner}>
                <div className={styles.winnerLeft}>
                  <img src={GALLERY_IMGS[5]} alt="Winner design" className={styles.winnerImg} />
                </div>
                <div className={styles.winnerRight}>
                  <div className={styles.winnerMeta}>#8 by onripus <span>×</span></div>
                  <button className={styles.winnerBtn} style={{ background: s.color }}>♥ Award as winner!</button>
                  <div className={styles.chatBubbleDesigner}>Hi there! Here's my idea. I'm trying to keep it super simple so that it's timeless.</div>
                  <div className={styles.chatBubbleClient}>Nice! We love it!</div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className={styles.laptopBottom} />
        <div className={styles.laptopBase} />
      </div>

      <button className={`${styles.laptopArrow} ${styles.laptopArrowRight}`} onClick={onNext} aria-label="Next step">
        <svg width="10" height="18" viewBox="0 0 10 18" fill="none"><path d="M1 1l8 8-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
    </div>
  );
}

/* ─── FAQ chevron ────────────────────────────────────────────────────────── */
function Chevron({ open }) {
  return (
    <svg width="20" height="20" viewBox="0 0 22 22" fill="none" style={{ flexShrink: 0, color: open ? '#2d1b69' : '#888', transition: 'transform 300ms, color 150ms', transform: open ? 'rotate(180deg)' : 'none' }}>
      <path d="M5 8l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ════════════════════════════════════════════════════════
   PAGE
════════════════════════════════════════════════════════ */
export default function BoxDesignPage() {
  const [heroIdx, setHeroIdx] = useState(0);
  const [procStep, setProcStep] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);
  const heroTimer = useRef(null);

  useEffect(() => {
    heroTimer.current = setInterval(() => setHeroIdx((i) => (i + 1) % HERO_SLIDES.length), 5000);
    return () => clearInterval(heroTimer.current);
  }, []);

  const goHero = (i) => {
    setHeroIdx(i);
    clearInterval(heroTimer.current);
    heroTimer.current = setInterval(() => setHeroIdx((j) => (j + 1) % HERO_SLIDES.length), 5000);
  };

  const prevStep = () => setProcStep((s) => (s - 1 + PROCESS_STEPS.length) % PROCESS_STEPS.length);
  const nextStep = () => setProcStep((s) => (s + 1) % PROCESS_STEPS.length);
  const slide = HERO_SLIDES[heroIdx];

  return (
    <div className={styles.page}>
      <Navbar />

      <main>
        {/* ══ HERO + INFO CARDS (left image, right text+cards) ══════════════ */}
        <div className={styles.pageTop}>

          {/* LEFT — artwork carousel (spans full height of pageTop) */}
          <div className={styles.artworkCol}>
            {HERO_SLIDES.map((sl, i) => (
              <div key={i} className={`${styles.artSlide} ${i === heroIdx ? styles.artSlideActive : ''}`}>
                <img src={sl.src} alt={sl.alt} loading={i === 0 ? 'eager' : 'lazy'} decoding="async" />
                <figcaption className={styles.artAttrib}>by {sl.designer}</figcaption>
              </div>
            ))}
          </div>

          {/* RIGHT — hero text then 3 info cards */}
          <div className={styles.rightCol}>

            {/* Hero text */}
            <div className={styles.heroText}>
              <h1 className={styles.heroTitle} style={{ color: slide.color }}>
                Custom box design for your brand
              </h1>
              <div className={styles.heroBody}>
                <p>An amazing product needs to come in an equally amazing box. Wow your customers with a box design that's as unique as the product you've got inside.</p>
                <ul className={styles.heroBullets}>
                  <li>Professional designers—all rated and reviewed</li>
                  <li>Custom box design for all budgets</li>
                  <li>Two design options: host a contest or work 1:1 with a freelance designer</li>
                </ul>
              </div>
              <div className={styles.heroCtas}>
                <a href="/categories?tab=packaging-label" className={styles.btnPrimary} style={{ background: slide.color, borderColor: slide.color }}>
                  Start a project
                </a>
                <a href="/categories?tab=packaging-label" className={styles.btnLink} style={{ color: slide.color, borderColor: slide.color }}>
                  Start a contest
                </a>
              </div>
              <div className={styles.heroDots}>
                {HERO_SLIDES.map((_, i) => (
                  <button key={i} className={`${styles.heroDot} ${i === heroIdx ? styles.heroDotActive : ''}`} onClick={() => goHero(i)} aria-label={`Slide ${i + 1}`} style={i === heroIdx ? { background: slide.color } : {}} />
                ))}
              </div>
            </div>

            {/* 3 Info cards */}
            <div className={styles.infoSection}>
              <h2 className={styles.infoTitle}>
                Custom box design: creative ideas from professional designers
              </h2>
              <div className={styles.infoDivider} />
              <p className={styles.infoParagraph}>
                There's no better platform to get a box design. With two ways to work, you get the design you want, in the manner that works best for you. No templates. No robots. No frustrating apps. Just a 100% unique box for your product.
              </p>
              <div className={styles.infoCards}>
                {INFO_CARDS.map((card, i) => (
                  <div key={i} className={`${styles.infoCard} ${i === heroIdx ? styles.infoCardActive : ''}`} style={i === heroIdx ? { borderColor: slide.color } : {}}>
                    <h3 className={styles.infoCardTitle} style={i === heroIdx ? { color: slide.color } : {}}>
                      {card.title}
                    </h3>
                    <p className={styles.infoCardDesc} style={i === heroIdx ? { color: slide.color } : {}}>
                      {card.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ══ DESIGNERS ═════════════════════════════════════════════════════ */}
        <section className={styles.designersSection} aria-labelledby="designers-title">
          <div className="container">
            <h2 className={styles.sectionTitle} id="designers-title">The right designer is just a click away</h2>
            <div className={styles.infoDivider} style={{ margin: '12px 0 20px' }} />
            <p className={styles.sectionSub}>
              We've curated the best product packaging designers so you can find the right expert and request a quote instantly.
            </p>
          </div>
          <DesignerSlider />
          <div className={styles.showMoreWrap}>
            <a href="/categories?tab=packaging-label" className={styles.showMoreLink}>
              Show me more designers →
            </a>
          </div>
        </section>

        {/* ══ PROCESS ═══════════════════════════════════════════════════════ */}
        <section className={styles.processSection} aria-labelledby="process-title">
          <div className="container">
            <h2 className={styles.sectionTitle} id="process-title">The box design process</h2>
            <div className={styles.infoDivider} style={{ margin: '12px auto 40px' }} />

            <ProcessLaptop step={procStep} onPrev={prevStep} onNext={nextStep} />

            <div className={styles.processSteps}>
              {PROCESS_STEPS.map((s, i) => (
                <button key={i} className={`${styles.processStep} ${i === procStep ? styles.processStepActive : ''}`} onClick={() => setProcStep(i)}>
                  <div className={styles.processIcon} style={i === procStep ? { color: s.color } : {}}>
                    {i === 0 ? '✏' : i === 1 ? '⊞' : '♥'}
                  </div>
                  <h3 className={styles.processStepTitle} style={i === procStep ? { color: s.color } : {}}>
                    {i + 1}. {s.stepTitle}
                  </h3>
                  <p className={styles.processStepDesc}>{s.stepDesc}</p>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ══ STYLES SHOWCASE ═══════════════════════════════════════════════ */}
        <section className={styles.stylesSection} aria-labelledby="styles-title">
          <div className="container">
            <h2 className={styles.sectionTitle} id="styles-title">Any style, any industry. Our box designers do it all.</h2>
            <div className={styles.stylesGrid}>
              {STYLE_IMAGES.map((s) => (
                <div key={s.label} className={styles.styleCard}>
                  <img src={s.src} alt={s.label} className={styles.styleImg} loading="lazy" decoding="async" />
                  <div className={styles.styleOverlay}><span className={styles.styleLabel}>{s.label}</span></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ FAQ ═══════════════════════════════════════════════════════════ */}
        <section className={styles.faqSection} aria-labelledby="faq-title">
          <div className="container">
            <h2 className={styles.sectionTitle} id="faq-title">Your burning box design FAQs, answered.</h2>
            <div className={styles.faqList}>
              {FAQS.map((faq, i) => (
                <div key={i} className={styles.faqItem}>
                  <button className={styles.faqQuestion} onClick={() => setOpenFaq(openFaq === i ? null : i)} aria-expanded={openFaq === i}>
                    {faq.q}<Chevron open={openFaq === i} />
                  </button>
                  <div className={`${styles.faqAnswer} ${openFaq === i ? styles.open : ''}`}><p>{faq.a}</p></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ CTA BANNER ════════════════════════════════════════════════════ */}
        <section className={styles.ctaBanner} aria-label="Get started">
          <div className="container">
            <h2 className={styles.ctaTitle}>Ready to create your perfect box design?</h2>
            <p className={styles.ctaSub}>Join over 500,000 businesses that have trusted 99designs to bring their packaging vision to life.</p>
            <div className={styles.ctaBtns}>
              <a href="/categories?tab=packaging-label" className={styles.btnPrimary}>Start a design contest</a>
              <a href="/categories?tab=packaging-label" className={styles.btnSecondary}>Browse designers</a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

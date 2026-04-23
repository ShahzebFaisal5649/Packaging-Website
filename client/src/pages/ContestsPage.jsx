import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import styles from './ContestsPage.module.css';

const TIER_COLORS = {
  Bronze: '#cd7f32',
  Silver: '#a8a9ad',
  Gold: '#d4a017',
  Platinum: '#5f4bb6',
};

function ContestCard({ c }) {
  const tierColor = TIER_COLORS[c.tier] || '#888';
  return (
    <a href="/categories?tab=packaging-label" className={styles.contestCard}>
      <div className={styles.contestImgWrap}>
        <img src={c.imageUrl} alt={c.title} className={styles.contestImg} loading="lazy" decoding="async" />
        <div className={styles.contestPriceBadge} style={{ background: tierColor }}>
          US${c.price.toLocaleString()}
        </div>
      </div>
      <div className={styles.contestBody}>
        <h3 className={styles.contestTitle}>{c.title}</h3>
        <div className={styles.contestTags}>
          <span className={styles.contestTierPill} style={{ borderColor: tierColor, color: tierColor }}>{c.tier}</span>
          {c.pills && c.pills.map((p) => (
            <span key={p} className={styles.contestPill}>{p}</span>
          ))}
        </div>
        <div className={styles.contestMeta}>
          <span className={styles.contestIndustry}>{c.industry}</span>
          <span className={styles.contestDot}>·</span>
          <span className={styles.contestDesigns}><strong>{c.designs}</strong> designs</span>
          <span className={styles.contestDot}>·</span>
          <span className={styles.contestFinished}>Finished</span>
        </div>
      </div>
    </a>
  );
}

export default function ContestsPage() {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/contests')
      .then((r) => r.json())
      .then((data) => { setContests(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className={styles.page}>
      <Navbar />

      <main>
        {/* ── Hero ── */}
        <div className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Product packaging contests</h1>
            <p className={styles.heroSub}>Dozens of designs, pick your favorite.</p>
            <div className={styles.heroCtas}>
              <a href="/categories?tab=packaging-label" className={styles.heroBtnPrimary}>Start a contest</a>
              <a href="/categories?tab=packaging-label" className={styles.heroBtnSecondary}>Work with a designer</a>
            </div>
          </div>
          <div className={styles.heroImgCol}>
            <img
              src="https://assets.99static.com/contests/web/images/browse/header-hero-image-3b49cfdd3e.png"
              alt="Product packaging contest designs"
              className={styles.heroImg}
            />
          </div>
        </div>

        {/* ── Filter bar ── */}
        <div className={styles.filterBar}>
          <div className="container">
            <div className={styles.filterRow}>
              <div className={styles.filterDropdown}>Category <span>▾</span></div>
              <div className={styles.filterDropdown}>Industry <span>▾</span></div>
              <div className={styles.filterDropdown}>Show filters <span>▾</span></div>
              <div className={styles.filterSpacer} />
              <div className={styles.filterDropdown}>Sort <span>▾</span></div>
            </div>
          </div>
        </div>

        {/* ── Toolbar ── */}
        <div className={styles.toolbar}>
          <div className="container">
            <p className={styles.toolbarText}>
              Showing <strong>10,619</strong> contests <span className={styles.toolbarStatus}>(Finished)</span>
            </p>
          </div>
        </div>

        {/* ── Listings ── */}
        <div className={styles.listingsSection}>
          <div className="container">
            {loading ? (
              <div className={styles.loading}>Loading contests...</div>
            ) : (
              <div className={styles.listingsGrid}>
                {contests.map((c) => <ContestCard key={c._id} c={c} />)}
              </div>
            )}
          </div>
        </div>

        {/* ── Pagination ── */}
        <div className={styles.pagination}>
          <div className="container">
            <div className={styles.paginationInner}>
              <button className={`${styles.pageBtn} ${styles.pageBtnDisabled}`} disabled>← Prev</button>
              <div className={styles.pageInfo}>1 of 354</div>
              <button className={styles.pageBtn}>Next →</button>
            </div>
          </div>
        </div>

        {/* ── BATHI section ── */}
        <section className={styles.bathiSection}>
          <div className="container">
            <div className={styles.bathiInner}>
              <div className={styles.bathiText}>
                <h2 className={styles.bathiTitle}>Get a design you'll love, guaranteed.</h2>
                <p className={styles.bathiBody}>
                  Launch a contest and get dozens of concepts from our global community of designers. You give feedback, you pick your favorite, and we handle the rest — including full copyright transfer and print-ready files.
                </p>
                <a href="/categories?tab=packaging-label" className={styles.bathiBtn}>Start your contest</a>
              </div>
              <div className={styles.bathiImgCol}>
                <img src="/bathi-frog-c89c57cb7a.jpg" alt="99designs mascot" className={styles.bathiImg} />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

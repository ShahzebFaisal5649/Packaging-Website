import { useState, useEffect } from 'react';
import { useCategories } from '../context/CategoriesContext';
import { useRoute } from '../hooks/useRoute';
import Navbar from '../components/Navbar/Navbar';
import Hero from '../components/Hero/Hero';
import CategoryTabBar from '../components/CategoryTabBar/CategoryTabBar';
import CategoryPanel from '../components/CategoryPanel/CategoryPanel';
import Footer from '../components/Footer/Footer';
import styles from './CategoriesPage.module.css';

export default function CategoriesPage() {
  const { categories, loading, error } = useCategories();
  const { params } = useRoute();
  const [activeTabId, setActiveTabId] = useState(null);

  // Sync active tab from ?tab= query param whenever URL changes
  useEffect(() => {
    const tabFromUrl = params.get('tab');
    if (tabFromUrl) {
      setActiveTabId(tabFromUrl);
      // Scroll to tab bar after a paint so the panel is visible
      requestAnimationFrame(() => {
        document.getElementById(`tab-${tabFromUrl}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      });
    }
  }, [params]);

  const resolvedActive = activeTabId || categories[0]?.slug || null;

  const handleTabChange = (slug) => {
    setActiveTabId(slug);
    // Keep URL in sync so browser back/forward works
    const url = new URL(window.location.href);
    url.searchParams.set('tab', slug);
    window.history.replaceState({}, '', url.toString());
  };

  if (loading) return <LoadingScreen />;
  if (error)   return <ErrorScreen message={error} />;

  return (
    <div className={styles.page}>
      <Navbar />

      <main id="main-content">
        <Hero />

        <CategoryTabBar
          tabs={categories}
          activeTabId={resolvedActive}
          onTabChange={handleTabChange}
        />

        <div className="container">
          {categories.map((cat) => (
            <CategoryPanel
              key={cat.slug}
              category={cat}
              isActive={cat.slug === resolvedActive}
            />
          ))}

          <div className={styles.searchCta} id="search-field-scroll-to-anchor">
            <p className={styles.searchText}>
              Still haven&apos;t found what you&apos;re looking for?{' '}
              <a href="/categories" className={styles.searchLink}>
                Search and ye shall find
              </a>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function LoadingScreen() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <LoadingSpinner />
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div style={{
      width: 40, height: 40,
      border: '3px solid var(--color-border)',
      borderTopColor: 'var(--color-brand)',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
    }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function ErrorScreen({ message }) {
  return (
    <div style={{ padding: '80px 24px', textAlign: 'center' }}>
      <p style={{ color: 'var(--color-brand)', fontWeight: 600, marginBottom: 8 }}>Failed to load categories</p>
      <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>{message}</p>
      <button onClick={() => window.location.reload()} style={{
        marginTop: 24, padding: '10px 24px',
        background: 'var(--color-brand)', color: '#fff',
        borderRadius: 'var(--radius-sm)', fontWeight: 600,
      }}>Retry</button>
    </div>
  );
}

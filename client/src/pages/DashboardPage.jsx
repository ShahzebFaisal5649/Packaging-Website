import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { navigate } from '../hooks/useRoute';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import styles from './DashboardPage.module.css';

function getSavedDesigns() {
  try { return JSON.parse(localStorage.getItem('novapack_saved_designs') || '[]'); } catch { return []; }
}

function getSampleRequests() {
  try {
    const all = JSON.parse(localStorage.getItem('novapack_sample_requests') || '[]');
    return all.filter(r => true);
  } catch { return []; }
}

function getOrders() {
  try { return JSON.parse(localStorage.getItem('novapack_orders') || '[]'); } catch { return []; }
}

const STATUS_COLORS = { active: '#10b981', completed: '#14b8a6', draft: '#94a3b8', pending: '#f59e0b' };

function StatusBadge({ status }) {
  return (
    <span className={styles.badge} style={{ background: `${STATUS_COLORS[status] || '#94a3b8'}22`, color: STATUS_COLORS[status] || '#94a3b8', border: `1px solid ${STATUS_COLORS[status] || '#94a3b8'}44` }}>
      {status}
    </span>
  );
}

export default function DashboardPage() {
  const { user, logout, isAdmin } = useAuth();
  const [designs, setDesigns]   = useState([]);
  const [samples, setSamples]   = useState([]);
  const [orders, setOrders]     = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    setDesigns(getSavedDesigns());
    setSamples(getSampleRequests().filter(s => s.userId === user.id || s.email === user.email));
    setOrders(getOrders().filter(o => o.userId === user.id));
  }, [user]);

  if (!user) return null;

  const handleLogout = () => { logout(); navigate('/'); };

  const deleteDesign = (id) => {
    const updated = designs.filter(d => d.id !== id);
    localStorage.setItem('novapack_saved_designs', JSON.stringify(updated));
    setDesigns(updated);
  };

  const TABS = [
    { id: 'overview', label: 'Overview' },
    { id: 'designs', label: `Designs (${designs.length})` },
    { id: 'samples', label: `Sample Requests (${samples.length})` },
  ];

  return (
    <div className={styles.page}>
      <Navbar />

      <div className={styles.hero}>
        <div className="container">
          <div className={styles.heroInner}>
            <div className={styles.heroLeft}>
              <div className={styles.avatar}>{user.name?.[0]?.toUpperCase() || 'U'}</div>
              <div>
                <h1 className={styles.heroName}>Welcome back, {user.name?.split(' ')[0]}!</h1>
                <p className={styles.heroEmail}>{user.email}</p>
              </div>
            </div>
            <div className={styles.heroActions}>
              {isAdmin && (
                <a href="/admin" className={styles.adminBtn}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                  Admin Panel
                </a>
              )}
              <button onClick={handleLogout} className={styles.logoutBtn}>Log out</button>
            </div>
          </div>
        </div>
      </div>

      <main className={styles.main}>
        <div className="container">

          {/* Stats */}
          <div className={styles.statsGrid}>
            {[
              { label: 'Saved Designs', value: designs.length, icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>), color: '#14b8a6' },
              { label: 'Sample Requests', value: samples.length, icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="7" width="20" height="15" rx="2"/><polyline points="17,7 17,2 7,2 7,7"/></svg>), color: '#8b5cf6' },
              { label: 'Active Orders', value: orders.length, icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 001.97 1.61H19a2 2 0 001.97-1.61L23 6H6"/></svg>), color: '#f59e0b' },
              { label: 'Member Since', value: new Date(user.createdAt || Date.now()).getFullYear(), icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>), color: '#10b981' },
            ].map(s => (
              <div key={s.label} className={styles.statCard}>
                <div className={styles.statIcon} style={{ color: s.color, background: `${s.color}18` }}>{s.icon}</div>
                <div>
                  <div className={styles.statValue}>{s.value}</div>
                  <div className={styles.statLabel}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className={styles.tabs}>
            {TABS.map(t => (
              <button key={t.id} className={`${styles.tab} ${activeTab === t.id ? styles.tabActive : ''}`} onClick={() => setActiveTab(t.id)}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Overview tab */}
          {activeTab === 'overview' && (
            <div className={styles.tabContent}>
              <div className={styles.quickActions}>
                <h2 className={styles.sectionTitle}>Quick Actions</h2>
                <div className={styles.actionsGrid}>
                  {[
                    { href: '/custom-box', icon: '📦', label: 'New Custom Box', desc: 'Start designing with our 6-step builder' },
                    { href: '/categories', icon: '🗂️', label: 'Browse Products', desc: 'Explore our packaging catalog' },
                    { href: '/box-design', icon: '🎨', label: 'Box Design', desc: 'Find a professional packaging designer' },
                    { href: '/how-it-works', icon: '📋', label: 'How It Works', desc: 'Learn about our process' },
                  ].map(a => (
                    <a key={a.href} href={a.href} className={styles.actionCard}>
                      <span className={styles.actionIcon}>{a.icon}</span>
                      <div>
                        <div className={styles.actionLabel}>{a.label}</div>
                        <div className={styles.actionDesc}>{a.desc}</div>
                      </div>
                      <svg className={styles.actionArrow} width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1 8h14M9 2l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </a>
                  ))}
                </div>
              </div>

              {designs.length > 0 && (
                <div>
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Recent Designs</h2>
                    <button className={styles.seeAll} onClick={() => setActiveTab('designs')}>See all</button>
                  </div>
                  <div className={styles.designsGrid}>
                    {designs.slice(0, 3).map(d => (
                      <DesignCard key={d.id} design={d} onDelete={deleteDesign} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Designs tab */}
          {activeTab === 'designs' && (
            <div className={styles.tabContent}>
              {designs.length === 0 ? (
                <div className={styles.empty}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.3"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>
                  <p>No saved designs yet.</p>
                  <a href="/custom-box" className={styles.emptyBtn}>Create your first design</a>
                </div>
              ) : (
                <div className={styles.designsGrid}>
                  {designs.map(d => <DesignCard key={d.id} design={d} onDelete={deleteDesign} />)}
                </div>
              )}
            </div>
          )}

          {/* Sample requests tab */}
          {activeTab === 'samples' && (
            <div className={styles.tabContent}>
              {samples.length === 0 ? (
                <div className={styles.empty}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.3"><rect x="2" y="7" width="20" height="15" rx="2"/><polyline points="17,7 17,2 7,2 7,7"/></svg>
                  <p>No sample requests yet.</p>
                  <a href="/box-design" className={styles.emptyBtn}>Request a physical sample</a>
                </div>
              ) : (
                <div className={styles.samplesList}>
                  {samples.map((s, i) => (
                    <div key={i} className={styles.sampleCard}>
                      <div className={styles.sampleHeader}>
                        <div>
                          <h3 className={styles.sampleProduct}>{s.productName || 'Custom Box Sample'}</h3>
                          <p className={styles.sampleDate}>{new Date(s.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                        <StatusBadge status={s.status || 'pending'} />
                      </div>
                      <div className={styles.sampleDetails}>
                        <span><strong>Name:</strong> {s.name}</span>
                        <span><strong>Phone:</strong> {s.phone}</span>
                        <span><strong>Address:</strong> {s.address}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}

function DesignCard({ design, onDelete }) {
  return (
    <div className={styles.designCard}>
      <div className={styles.designMeta}>
        <h3 className={styles.designName}>{design.name || 'Untitled Design'}</h3>
        <p className={styles.designDate}>{design.savedAt ? new Date(design.savedAt).toLocaleDateString() : '—'}</p>
      </div>
      <div className={styles.designInfo}>
        {design.config && (
          <>
            {design.config.boxType && <span className={styles.designTag}>{design.config.boxType}</span>}
            {design.config.material && <span className={styles.designTag}>{design.config.material}</span>}
          </>
        )}
      </div>
      <div className={styles.designActions}>
        <a href="/custom-box" className={styles.designEditBtn}>Edit</a>
        <button onClick={() => onDelete(design.id)} className={styles.designDeleteBtn}>Delete</button>
      </div>
    </div>
  );
}

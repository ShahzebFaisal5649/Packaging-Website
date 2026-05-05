import { useState, useEffect } from 'react';
import { Heart, Search, Package, ChevronRight, Filter, X } from 'lucide-react';
import { useModal } from '../context/ModalContext';
import { useFavourites } from '../context/FavouritesContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const G = '#1A4D2E';
const ACCENT = '#C8860A';
const BG = '#F5F2ED';

const STATIC_CATEGORIES = [
  'All Products',
  'Bottom Closure',
  'CD Covers',
  'Figure & Pattern',
  'Fold & Assemble',
  'Rectangular',
  'Showcase Exhibit',
];

// Unsplash images keyed by category for fallback
const CATEGORY_IMGS = {
  'Bottom Closure': 'https://images.unsplash.com/photo-1553531384-cc64ac80f931?w=600&q=80',
  'CD Covers': 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&q=80',
  'Figure & Pattern': 'https://images.unsplash.com/photo-1619468579487-430c4d90f93b?w=600&q=80',
  'Fold & Assemble': 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&q=80',
  'Rectangular': 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600&q=80',
  'Showcase Exhibit': 'https://images.unsplash.com/photo-1592921870789-04563d55041c?w=600&q=80',
  default: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80',
};

const SidebarContent = ({ search, setSearch, activeCategory, setActiveCategory, allCategories, setSidebarOpen, ACCENT }) => (
  <>
    <div style={{ position: 'relative', marginBottom: 28 }}>
      <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9A9080' }} />
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ width: '100%', padding: '10px 12px 10px 34px', border: '1.5px solid #D8D3CB', borderRadius: 8, fontSize: 13, color: '#1A1A1A', backgroundColor: '#fff', outline: 'none', boxSizing: 'border-box' }}
      />
    </div>

    <p style={{ fontSize: 10, fontFamily: '"DM Mono", monospace', fontWeight: 500, color: '#9A9080', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>Categories</p>
    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
      {allCategories.map(cat => (
        <li key={cat}>
          <button
            onClick={() => { setActiveCategory(cat); setSidebarOpen(false); }}
            style={{
              width: '100%',
              textAlign: 'left',
              padding: '9px 12px',
              borderRadius: 8,
              border: 'none',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: activeCategory === cat ? 700 : 500,
              fontFamily: '"DM Sans", sans-serif',
              backgroundColor: activeCategory === cat ? `${ACCENT}18` : 'transparent',
              color: activeCategory === cat ? ACCENT : '#6B6B6B',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { if (activeCategory !== cat) e.target.style.backgroundColor = '#F0EDE8'; }}
            onMouseLeave={e => { if (activeCategory !== cat) e.target.style.backgroundColor = 'transparent'; }}
          >
            {cat}
          </button>
        </li>
      ))}
    </ul>
  </>
);

function ProductCard({ product }) {

  const [hovered, setHovered] = useState(false);
  const { openQuickView: openModal } = useModal();
  const { isFavourite, toggleFavourite } = useFavourites();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const isFav = isFavourite(product._id || product.id);
  const imgSrc = product.img || CATEGORY_IMGS[product.cat] || CATEGORY_IMGS.default;

  const handleFavourite = (e) => {
    e.stopPropagation();
    toggleFavourite(product);
    showToast(isFav ? 'Removed from favourites' : 'Added to favourites');
  };

  const handleConfigure = (e) => {
    e.stopPropagation();
    // Spread product fields at the top level so CustomBox.jsx can read them directly
    navigate('/custom-box', {
      state: {
        boxType: product.boxType || 'Mailer Box',
        material: product.material || 'Corrugated E-Flute',
        finish: product.finish || 'Matte Lam',
        productName: product.name,
        price: product.price,
        suggestedDimensions: product.dims
          ? (() => { const parts = product.dims.match(/[\d.]+/g); return parts ? { l: parts[0], w: parts[1], h: parts[2] } : { l: 8, w: 6, h: 3 }; })()
          : { l: 8, w: 6, h: 3 },
        addons: product.addons || [],
      },
    });
  };

  return (
    <div
      onClick={() => openModal(product)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: '#fff',
        borderRadius: 14,
        overflow: 'hidden',
        boxShadow: hovered ? '0 8px 32px rgba(26,77,46,0.13)' : '0 2px 12px rgba(0,0,0,0.07)',
        transition: 'box-shadow 0.25s, transform 0.25s',
        transform: hovered ? 'translateY(-4px)' : 'none',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Image area */}
      <div style={{ position: 'relative', height: 200, overflow: 'hidden', backgroundColor: '#F0EDE8' }}>
        <img
          src={imgSrc}
          alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease', transform: hovered ? 'scale(1.07)' : 'scale(1)' }}
          loading="lazy"
          onError={e => { e.target.src = CATEGORY_IMGS[product.cat] || CATEGORY_IMGS.default; }}
        />
        {/* Category badge */}
        <div style={{ position: 'absolute', top: 10, left: 10, backgroundColor: G, color: '#fff', fontSize: 9, fontFamily: '"DM Mono", monospace', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.07em', padding: '4px 8px', borderRadius: 4 }}>
          {product.cat}
        </div>
        {/* Favourite button */}
        <button onClick={handleFavourite} aria-label="Toggle favourite"
          style={{ position: 'absolute', top: 10, right: 10, width: 32, height: 32, borderRadius: '50%', backgroundColor: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.12)', opacity: hovered ? 1 : 0.7, transition: 'opacity 0.2s' }}>
          <Heart size={14} style={{ color: isFav ? '#EF4444' : '#888', fill: isFav ? '#EF4444' : 'none' }} />
        </button>
        {/* View details hint */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(26,77,46,0.85))', padding: '24px 12px 10px', opacity: hovered ? 1 : 0, transition: 'opacity 0.25s' }}>
          <span style={{ color: '#fff', fontSize: 11, fontFamily: '"DM Mono", monospace', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Search size={11} /> View Details <ChevronRight size={11} />
          </span>
        </div>
      </div>

      {/* Card footer */}
      <div style={{ padding: '14px 16px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1A1A1A', marginBottom: 2, fontFamily: '"DM Sans", sans-serif', lineHeight: 1.3 }}>{product.name}</h3>
          <span style={{ fontSize: 9, fontFamily: '"DM Mono", monospace', fontWeight: 500, color: ACCENT, backgroundColor: `${ACCENT}15`, padding: '2px 6px', borderRadius: 3, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{product.boxType}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
          <div>
            <span style={{ fontSize: 20, fontWeight: 700, color: ACCENT, fontFamily: '"DM Sans", sans-serif' }}>{product.price}</span>
            <span style={{ fontSize: 10, fontFamily: '"DM Sans", sans-serif', color: '#9A9080', marginLeft: 3 }}>/ unit</span>
          </div>
          <button
            onClick={handleConfigure}
            style={{
              padding: '10px 16px',
              backgroundColor: hovered ? ACCENT : G,
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              fontSize: 12,
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              fontFamily: '"DM Sans", sans-serif',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: hovered ? `0 4px 12px ${ACCENT}40` : 'none',
              transform: hovered ? 'scale(1.05)' : 'scale(1)',
            }}
          >
            <span>Design</span> <ChevronRight size={14} style={{ transform: hovered ? 'translateX(2px)' : 'none', transition: 'transform 0.3s' }} />
          </button>
        </div>

        <p style={{ fontSize: 10, fontFamily: '"DM Sans", sans-serif', color: '#B0A898', margin: 0, fontStyle: 'italic' }}>
          Tap card to see full specs &amp; details
        </p>
      </div>
    </div>
  );
}

export default function Products() {
  const [activeCategory, setActiveCategory] = useState('All Products');
  const [search, setSearch] = useState('');
  const [fetchedProducts, setFetchedProducts] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError('');
      const cached = localStorage.getItem('designcustombox_products');
      try {
        const data = await api.get('/content/products');
        const products = Array.isArray(data.products) ? data.products : [];
        setFetchedProducts(products);
        localStorage.setItem('designcustombox_products', JSON.stringify(products));
      } catch (err) {
        console.error('Products load failed', err);
        if (cached) {
          setFetchedProducts(JSON.parse(cached));
          setError('Unable to load latest products. Showing cached catalog.');
        } else {
          setError('Unable to load products. Please refresh the page.');
          setFetchedProducts([]);
        }
      } finally {
        setLoading(false);
        setHasFetched(true);
      }
    };
    loadProducts();
  }, []);

  const productsList = fetchedProducts;

  // Only show categories that actually have products in DB (plus "All Products")
  const dynamicCategories = ['All Products', ...Array.from(new Set(productsList.map(p => p.cat).filter(Boolean))).sort()];
  const allCategories = dynamicCategories;

  const filtered = productsList.filter(p => {
    const matchCat = activeCategory === 'All Products' || p.cat === activeCategory;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || (p.description || p.desc || '').toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div style={{ backgroundColor: BG, minHeight: '100vh' }}>

      {/* Hero */}
      <section style={{ position: 'relative', overflow: 'hidden', minHeight: 420, backgroundColor: '#1A4D2E' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=1600&q=80)', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.75)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(20,60,36,0.3), rgba(20,60,36,0.6))' }} />
        <div className="mx-auto max-w-[1400px]" style={{ position: 'relative', padding: '60px 24px', display: 'flex', alignItems: 'center' }}>
          <div style={{ maxWidth: 700 }} className="mobile-center-text">
            <p style={{ fontSize: 11, fontFamily: '"DM Mono", monospace', fontWeight: 500, color: '#F9C054', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 14 }}>Full Catalog</p>
            <h1 style={{ fontSize: 'clamp(32px,4vw,52px)', fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 700, color: '#fff', marginBottom: 18, lineHeight: 1.05 }}>Products</h1>
            <p style={{ maxWidth: 560, color: 'rgba(255,255,255,0.95)', fontSize: 16, fontFamily: '"DM Sans", sans-serif', lineHeight: 1.8, textAlign: 'left', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }} className="mobile-center-text">Browse our full range of custom box styles. Just tap any card to see full details, then pick your exact sizes.</p>
          </div>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto w-full overflow-x-hidden px-4 py-12">

        {/* Mobile filter button */}
        <button
          className="products-filter-btn flex md:hidden items-center gap-2 mb-4 rounded-xl bg-[#1A4D2E] px-4 py-3 text-sm font-bold text-white"
          onClick={() => setSidebarOpen(s => !s)}>
          <Filter size={14} /> {sidebarOpen ? 'Close Filters' : 'Filter & Search'}
        </button>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Mobile sidebar drawer */}
        <div className={`products-sidebar-mobile md:hidden fixed inset-y-0 left-0 z-50 flex h-full w-full max-w-sm flex-col bg-white p-6 pt-24 shadow-[4px_0_20px_rgba(0,0,0,0.15)] transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <button onClick={() => setSidebarOpen(false)}
            style={{ position: 'absolute', top: 20, right: 16, background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            <X size={20} color="#666" />
          </button>
          <SidebarContent search={search} setSearch={setSearch} activeCategory={activeCategory} setActiveCategory={setActiveCategory} allCategories={allCategories} setSidebarOpen={setSidebarOpen} ACCENT={ACCENT} />
        </div>

        <div className="products-layout flex gap-10 md:flex-row flex-col">

          {/* Desktop Sidebar */}
          <div className="products-sidebar-desktop hidden md:block md:w-64 shrink-0 sticky top-28 self-start">
            <SidebarContent search={search} setSearch={setSearch} activeCategory={activeCategory} setActiveCategory={setActiveCategory} allCategories={allCategories} setSidebarOpen={setSidebarOpen} ACCENT={ACCENT} />
          </div>

          {/* Grid */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
              {hasFetched && (
                <p className="text-sm text-[#6B6B6B]">
                  Showing <strong className="text-[#1A1A1A]">{filtered.length}</strong> {filtered.length === 1 ? 'product' : 'products'}
                </p>
              )}
              <p className="text-xs italic text-[#9A9080]">Click any card to see full specifications</p>
            </div>

            {error && filtered.length > 0 && (
              <div style={{ backgroundColor: '#FEF3C7', border: '1px solid #FDE68A', padding: '14px 18px', borderRadius: 14, color: '#92400E', marginBottom: 20 }}>
                {error}
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div key={idx} className="animate-pulse rounded-3xl bg-white p-5 shadow-sm">
                    <div className="mb-4 h-52 rounded-3xl bg-[#E8E3DC]" />
                    <div className="space-y-3">
                      <div className="h-4 w-3/4 rounded-full bg-[#E8E3DC]" />
                      <div className="h-4 w-1/2 rounded-full bg-[#E8E3DC]" />
                      <div className="h-3 w-full rounded-full bg-[#E8E3DC]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="rounded-3xl bg-white p-10 text-center text-sm text-[#6B6B6B] shadow-sm">
                <Package size={48} className="mx-auto mb-4 text-[#D0CAC0]" />
                <p className="font-semibold text-[#1A1A1A]">Unable to load products</p>
                <p className="mt-2">Please refresh the page or try again later.</p>
              </div>
            ) : filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map(p => <ProductCard key={p.id || p._id} product={p} />)}
              </div>
            ) : (
              <div className="rounded-3xl bg-white p-10 text-center text-sm text-[#6B6B6B] shadow-sm">
                <Package size={48} className="mx-auto mb-4 text-[#D0CAC0]" />
                <p className="font-semibold text-[#1A1A1A]">No products found</p>
                <p className="mt-2">Try a different search or category.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .products-filter-btn { display: flex !important; }
          .products-sidebar-mobile { display: block !important; }
          .products-sidebar-desktop { display: none !important; }
          .products-layout { flex-direction: column !important; gap: 0 !important; }
        }
        @media (max-width: 480px) {
          .products-layout > div:last-child > div { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

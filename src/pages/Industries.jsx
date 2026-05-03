import { useState, useEffect } from 'react';
import { Heart, Search, Package, ChevronRight } from 'lucide-react';
import { useFavourites } from '../context/FavouritesContext';
import { useModal } from '../context/ModalContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const G = '#1A4D2E';
const ACCENT = '#C8860A';
const BG = '#F5F2ED';

function IndustryCard({ product }) {
  const [hovered, setHovered] = useState(false);
  const { isFavourite, toggleFavourite } = useFavourites();
  const { openQuickView } = useModal();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const isFav = isFavourite(product._id || product.id);

  const handleFavourite = (e) => {
    e.preventDefault(); e.stopPropagation();
    const added = toggleFavourite(product);
    showToast(added !== false ? `Added "${product.name}" to Favourites ♥` : `Removed "${product.name}" from Favourites`, 'info');
  };

  const handleCardClick = () => openQuickView(product);

  const handleConfigure = (e) => {
    e.stopPropagation();
    navigate('/custom-box', {
      state: {
        boxType: product.boxType,
        material: product.material,
        finish: product.finish,
        productName: product.name,
        suggestedDimensions: product.suggestedDimensions || { l: 10, w: 8, h: 4 },
      },
    });
  };

  return (
    <div
      onClick={handleCardClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: '#fff',
        borderRadius: 12,
        border: `1.5px solid ${hovered ? ACCENT + '55' : '#E8E3DC'}`,
        boxShadow: hovered ? '0 8px 32px rgba(0,0,0,0.10)' : '0 2px 8px rgba(0,0,0,0.05)',
        transition: 'all 0.2s ease',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        cursor: 'pointer',
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden', backgroundColor: '#F0EDE8' }}>
        <img
          src={product.img}
          alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease', transform: hovered ? 'scale(1.07)' : 'scale(1)' }}
          loading="lazy"
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80'; }}
        />
        <div style={{ position: 'absolute', top: 10, left: 10, backgroundColor: G, color: '#fff', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', padding: '4px 8px', borderRadius: 4 }}>
          {product.cat}
        </div>
        <button onClick={handleFavourite} aria-label="Toggle favourite"
          style={{ position: 'absolute', top: 10, right: 10, width: 32, height: 32, borderRadius: '50%', backgroundColor: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.12)', opacity: hovered ? 1 : 0.7, transition: 'opacity 0.2s' }}>
          <Heart size={14} style={{ color: isFav ? '#EF4444' : '#888', fill: isFav ? '#EF4444' : 'none' }} />
        </button>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(26,77,46,0.85))', padding: '24px 12px 10px', opacity: hovered ? 1 : 0, transition: 'opacity 0.25s' }}>
          <span style={{ color: '#fff', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Search size={11} /> View Details <ChevronRight size={11} />
          </span>
        </div>
      </div>

      {/* Card footer */}
      <div style={{ padding: '14px 16px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1A1A1A', marginBottom: 2, fontFamily: 'Outfit,sans-serif', lineHeight: 1.3 }}>{product.name}</h3>
          <span style={{ fontSize: 9, fontWeight: 600, color: ACCENT, backgroundColor: `${ACCENT}15`, padding: '2px 6px', borderRadius: 3, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{product.boxType}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
          <div>
            <span style={{ fontSize: 20, fontWeight: 800, color: ACCENT, fontFamily: 'Outfit,sans-serif' }}>{product.price}</span>
            <span style={{ fontSize: 10, color: '#9A9080', marginLeft: 3 }}>/ unit</span>
          </div>
          <button
            onClick={handleConfigure}
            style={{
              padding: '8px 14px',
              backgroundColor: hovered ? ACCENT : G,
              color: '#fff',
              border: 'none',
              borderRadius: 7,
              fontSize: 11,
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              fontFamily: 'Outfit,sans-serif',
              whiteSpace: 'nowrap',
            }}
          >
            Get Custom Box
          </button>
        </div>

        <p style={{ fontSize: 10, color: '#B0A898', margin: 0, fontStyle: 'italic' }}>
          Tap card to see full specs &amp; details
        </p>
      </div>
    </div>
  );
}

export default function Industries() {
  const [activeCategory, setActiveCategory] = useState('All Industries');
  const [search, setSearch] = useState('');
  const [fetchedIndustries, setFetchedIndustries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadIndustries = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await api.get('/content/industries');
        setFetchedIndustries(Array.isArray(data.industries) ? data.industries : []);
      } catch (err) {
        console.error('Industries load failed', err);
        setError('Unable to load industries. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };
    loadIndustries();
  }, []);

  const industriesList = fetchedIndustries;

  // Build categories dynamically from actual data + always include "All Industries"
  const dynamicCategories = ['All Industries', ...Array.from(new Set(industriesList.map(p => p.cat).filter(Boolean))).sort()];

  const filtered = industriesList.filter(p => {
    const matchCat = activeCategory === 'All Industries' || p.cat === activeCategory;
    const normalizedSearch = search.trim().toLowerCase();
    const matchSearch = !normalizedSearch || p.name.toLowerCase().includes(normalizedSearch) || (p.description || '').toLowerCase().includes(normalizedSearch) || p.cat.toLowerCase().includes(normalizedSearch);
    return matchCat && matchSearch;
  });

  return (
    <div style={{ backgroundColor: BG, minHeight: '100vh' }}>

      {/* Hero */}
      <section style={{ position: 'relative', overflow: 'hidden', minHeight: 420, backgroundColor: '#1A4D2E' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600&q=80)', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.75)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(20,60,36,0.3), rgba(20,60,36,0.6))' }} />
        <div className="mx-auto max-w-[1400px]" style={{ position: 'relative', padding: '60px 24px', display: 'flex', alignItems: 'center' }}>
          <div style={{ maxWidth: 700 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#F9C054', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 14 }}>Tailored Solutions</p>
            <h1 style={{ fontSize: 'clamp(32px,4vw,52px)', fontFamily: 'Outfit,sans-serif', fontWeight: 800, color: '#fff', marginBottom: 18, lineHeight: 1.05 }}>Industries</h1>
            <p style={{ maxWidth: 560, color: 'rgba(255,255,255,0.95)', fontSize: 16, lineHeight: 1.8, textAlign: 'left', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>Packaging built for your market. Just tap any card to see full specs, materials, and options then pick your perfect box.</p>
          </div>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto w-full overflow-x-hidden px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-6 w-full overflow-x-hidden">

          {/* Sidebar */}
          <aside className="hidden lg:block w-full lg:w-64 shrink-0 sticky top-32 self-start">
            <div className="relative mb-8">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A9080]" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full rounded-xl border border-[#D8D3CB] bg-white py-3 pl-10 pr-4 text-sm text-[#1A1A1A] outline-none"
              />
            </div>

            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#9A9080] mb-4">Industries</p>
            <ul className="space-y-2">
              {dynamicCategories.map(cat => (
                <li key={cat}>
                  <button
                    onClick={() => setActiveCategory(cat)}
                    className={`w-full text-left rounded-xl px-3 py-2 text-sm font-semibold transition-all ${activeCategory === cat ? 'bg-[#C8860A]10 text-[#C8860A]' : 'bg-transparent text-[#6B6B6B] hover:bg-[#F0EDE8]'}`}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          <div className="w-full flex-1">
            <div className="block lg:hidden mb-6">
              <div className="relative mb-4">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A9080]" />
                <input
                  type="text"
                  placeholder="Search industries..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-[#D8D3CB] bg-white py-3 pl-10 pr-4 text-sm text-[#1A1A1A] outline-none"
                />
              </div>
              <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 no-scrollbar">
                {dynamicCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition ${activeCategory === cat ? 'border-transparent bg-[#C8860A] text-white' : 'border-[#D8D3CB] bg-white text-[#6B6B6B] hover:bg-[#F0EDE8]'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
              <p className="text-sm text-[#6B6B6B]">
                Showing <strong className="text-[#1A1A1A]">{filtered.length}</strong> {filtered.length === 1 ? 'solution' : 'solutions'}
              </p>
              <p className="text-xs italic text-[#9A9080]">Click any card to see full specifications</p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div key={idx} className="animate-pulse rounded-3xl bg-white p-5 shadow-sm">
                    <div className="mb-4 h-40 rounded-3xl bg-[#E8E3DC]" />
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
                <p className="font-semibold text-[#1A1A1A]">Unable to load industries</p>
                <p className="mt-2">Please refresh the page or try again later.</p>
              </div>
            ) : filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(p => <IndustryCard key={p.id} product={p} />)}
              </div>
            ) : (
              <div className="rounded-3xl bg-white p-10 text-center text-sm text-[#6B6B6B] shadow-sm">
                <Package size={48} className="mx-auto mb-4 text-[#D0CAC0]" />
                <p className="font-semibold text-[#1A1A1A]">No results found</p>
                <p className="mt-2">Try a different search or industry.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

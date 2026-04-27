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

const categories = [
  'All Industries',
  'Food & Beverage',
  'Cosmetics',
  'E-commerce',
  'Apparel & Retail',
  'Electronics',
  'Cannabis & CBD',
];

const staticIndustries = [
  {
    id: 'ind1', name: 'Food-Safe Boxes', cat: 'Food & Beverage',
    desc: 'FDA-compliant food-safe packaging with SBS coated for grease and moisture resistance.',
    price: '$1.15', img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80',
    boxType: 'Folding Carton', material: 'SBS Board', finish: 'Uncoated',
    dims: '4×4×2 – 16×12×8 in', minQty: '100 units',
    addons: ['Food-Safe Coating', 'Window Patch', 'Custom Print'],
    suggestedDimensions: { l: 4, w: 4, h: 2 },
  },
  {
    id: 'ind2', name: 'Bakery Packaging', cat: 'Food & Beverage',
    desc: 'Grease-resistant bakery boxes with optional clear window for visual appeal.',
    price: '$1.35', img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80',
    boxType: 'Gable Box', material: 'Kraft', finish: 'Uncoated',
    dims: '4×4×6 – 12×9×12 in', minQty: '100 units',
    addons: ['Window Patch', 'Grease-Resistant Liner', 'Inside Print'],
    suggestedDimensions: { l: 4, w: 4, h: 6 },
  },
  {
    id: 'ind3', name: 'Skincare Boxes', cat: 'Cosmetics',
    desc: 'Premium finishes and custom inserts to elevate your skincare brand.',
    price: '$3.25', img: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&q=80',
    boxType: 'Rigid Box', material: 'Rigid Chipboard', finish: 'Matte Lam',
    dims: '3×3×4 – 10×8×6 in', minQty: '50 units',
    addons: ['Spot UV', 'Embossing', 'Ribbon Pull'],
    suggestedDimensions: { l: 3, w: 3, h: 4 },
  },
  {
    id: 'ind4', name: 'Makeup Palettes', cat: 'Cosmetics',
    desc: 'Custom die-cut solutions for palettes, compacts, and beauty kits.',
    price: '$4.50', img: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80',
    boxType: 'Rigid Box', material: 'Rigid Chipboard', finish: 'Gloss Lam',
    dims: '6×4×1.5 – 14×10×3 in', minQty: '50 units',
    addons: ['Foil Stamping', 'Magnetic Closure', 'Debossing'],
    suggestedDimensions: { l: 6, w: 4, h: 2 },
  },
  {
    id: 'ind5', name: 'Subscription Mailers', cat: 'E-commerce',
    desc: 'Inside printing and branded unboxing experience for subscription boxes.',
    price: '$2.10', img: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80',
    boxType: 'Mailer Box', material: 'Corrugated E-Flute', finish: 'Matte Lam',
    dims: '8×6×4 – 20×16×12 in', minQty: '100 units',
    addons: ['Inside Printing', 'Custom Tape', 'Tear Strip'],
    suggestedDimensions: { l: 8, w: 6, h: 4 },
  },
  {
    id: 'ind6', name: 'E-commerce Shipping', cat: 'E-commerce',
    desc: 'High-volume durable shipping boxes with branding and protective structure.',
    price: '$1.20', img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80',
    boxType: 'Shipping Box', material: 'Corrugated B-Flute', finish: 'Uncoated',
    dims: '10×8×6 – 24×20×16 in', minQty: '250 units',
    addons: ['Exterior Branding', 'Void Fill', 'Fragile Labels'],
    suggestedDimensions: { l: 10, w: 8, h: 6 },
  },
  {
    id: 'ind7', name: 'Apparel Boxes', cat: 'Apparel & Retail',
    desc: 'Boutique-style unboxing for fashion brands that demand premium presentation.',
    price: '$3.80', img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80',
    boxType: 'Rigid Box', material: 'Rigid Chipboard', finish: 'Matte Lam',
    dims: '10×8×3 – 20×16×6 in', minQty: '50 units',
    addons: ['Ribbon Pull', 'Tissue Paper', 'Foil Stamping'],
    suggestedDimensions: { l: 10, w: 8, h: 3 },
  },
  {
    id: 'ind8', name: 'Retail Display Boxes', cat: 'Apparel & Retail',
    desc: 'Shelf-ready retail packaging with premium finish to drive purchase decisions.',
    price: '$2.25', img: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=600&q=80',
    boxType: 'Display Box', material: 'SBS Board', finish: 'Gloss Lam',
    dims: '6×4×8 – 18×12×16 in', minQty: '100 units',
    addons: ['Gloss UV', 'Hang Tab', 'Window Patch'],
    suggestedDimensions: { l: 6, w: 4, h: 8 },
  },
  {
    id: 'ind9', name: 'Tech Packaging', cat: 'Electronics',
    desc: 'Protective anti-static inserts for electronics that keeps products safe in transit.',
    price: '$1.35', img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80',
    boxType: 'Shipping Box', material: 'Corrugated B-Flute', finish: 'Uncoated',
    dims: '8×6×4 – 20×16×12 in', minQty: '100 units',
    addons: ['Anti-Static Liner', 'Foam Insert', 'Branded Tape'],
    suggestedDimensions: { l: 8, w: 6, h: 4 },
  },
  {
    id: 'ind10', name: 'Electronics Retail', cat: 'Electronics',
    desc: 'Premium shelf packaging for consumer electronics with high visual impact.',
    price: '$3.95', img: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&q=80',
    boxType: 'Rigid Box', material: 'Rigid Chipboard', finish: 'Gloss Lam',
    dims: '6×4×4 – 14×10×8 in', minQty: '50 units',
    addons: ['Soft-Touch Lam', 'Spot UV', 'Magnetic Closure'],
    suggestedDimensions: { l: 6, w: 4, h: 4 },
  },
  {
    id: 'ind11', name: 'Tincture Boxes', cat: 'Cannabis & CBD',
    desc: 'Child-resistant compliant options for tinctures, oils, and concentrates.',
    price: '$1.85', img: 'https://images.unsplash.com/photo-1574469566586-3f73afb9bc13?w=600&q=80',
    boxType: 'Sleeve Box', material: 'SBS Board', finish: 'Matte Lam',
    dims: '1.5×1.5×4 – 4×4×8 in', minQty: '250 units',
    addons: ['Child-Resistant Lock', 'Tamper Evident', 'Compliance Label'],
    suggestedDimensions: { l: 2, w: 2, h: 4 },
  },
  {
    id: 'ind12', name: 'Cannabis Packaging', cat: 'Cannabis & CBD',
    desc: 'Compliant, secure packaging designed for cannabis products and regulations.',
    price: '$1.45', img: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=600&q=80',
    boxType: 'Folding Carton', material: 'SBS Board', finish: 'Matte Lam',
    dims: '3×3×4 – 8×6×8 in', minQty: '250 units',
    addons: ['CR Packaging', 'Foil Barrier', 'UV Spot'],
    suggestedDimensions: { l: 3, w: 3, h: 4 },
  },
];

function IndustryCard({ product }) {
  const [hovered, setHovered] = useState(false);
  const { isFavourite, toggleFavourite } = useFavourites();
  const { openQuickView } = useModal();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const isFav = isFavourite(product.id);

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

  useEffect(() => {
    const loadIndustries = async () => {
      try {
        const data = await api.get('/content/industries');
        if (data.industries && data.industries.length > 0) {
          setFetchedIndustries(data.industries);
        }
      } catch (_err) {
        console.log('Using static industry data');
      }
    };
    loadIndustries();
  }, []);

  const industriesList = fetchedIndustries.length > 0 ? fetchedIndustries : staticIndustries;

  const filtered = industriesList.filter(p => {
    const matchCat = activeCategory === 'All Industries' || p.cat === activeCategory;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.desc.toLowerCase().includes(search.toLowerCase()) || p.cat.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div style={{ backgroundColor: BG, minHeight: '100vh' }}>

      {/* Hero */}
      <section style={{ backgroundColor: G, paddingTop: 120, paddingBottom: 56, paddingLeft: 24, paddingRight: 24 }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>Tailored Solutions</p>
          <h1 style={{ fontSize: 'clamp(28px,4vw,48px)', fontFamily: 'Outfit,sans-serif', fontWeight: 800, color: '#fff', marginBottom: 12 }}>Shop by Industry</h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', maxWidth: 520 }}>
            Packaging built for your market. Tap any card to see full specs, materials, and options then configure your perfect box.
          </p>
        </div>
      </section>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ display: 'flex', gap: 48, alignItems: 'flex-start' }}>

          {/* Sidebar */}
          <div style={{ width: 200, flexShrink: 0, position: 'sticky', top: 120 }}>
            <div style={{ position: 'relative', marginBottom: 28 }}>
              <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9A9080' }} />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ width: '100%', padding: '10px 12px 10px 34px', border: '1.5px solid #D8D3CB', borderRadius: 8, fontSize: 13, color: '#1A1A1A', backgroundColor: '#fff', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <p style={{ fontSize: 10, fontWeight: 700, color: '#9A9080', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>Industries</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {categories.map(cat => (
                <li key={cat}>
                  <button
                    onClick={() => setActiveCategory(cat)}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '9px 12px',
                      borderRadius: 8,
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: 13,
                      fontWeight: activeCategory === cat ? 700 : 500,
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
          </div>

          {/* Grid */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <p style={{ fontSize: 13, color: '#6B6B6B' }}>
                Showing <strong style={{ color: '#1A1A1A' }}>{filtered.length}</strong> {filtered.length === 1 ? 'solution' : 'solutions'}
              </p>
              <p style={{ fontSize: 11, color: '#9A9080', fontStyle: 'italic' }}>Click any card to see full specifications</p>
            </div>

            {filtered.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 24 }}>
                {filtered.map(p => <IndustryCard key={p.id} product={p} />)}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '80px 24px', color: '#9A9080' }}>
                <Package size={48} style={{ color: '#D0CAC0', margin: '0 auto 16px' }} />
                <p style={{ fontSize: 16, fontWeight: 600 }}>No results found</p>
                <p style={{ fontSize: 13, marginTop: 6 }}>Try a different search or industry</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

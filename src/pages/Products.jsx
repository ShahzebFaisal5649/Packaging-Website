import { useState, useEffect } from 'react';
import { Heart, Search, Package, ChevronRight } from 'lucide-react';
import { useModal } from '../context/ModalContext';
import { useFavourites } from '../context/FavouritesContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const G = '#1A4D2E';
const ACCENT = '#C8860A';
const BG = '#F5F2ED';

const categories = [
  'All Products',
  'Bottom Closure',
  'CD Covers',
  'Figure & Pattern',
  'Fold & Assemble',
  'Rectangular',
  'Showcase Exhibit',
];

const staticProducts = [
  {
    id: 'pr1', name: 'Seal End Auto Bottom', cat: 'Bottom Closure',
    desc: 'Secure auto-lock base for heavier items — no tape required on the bottom.',
    price: '$1.20', img: 'https://images.unsplash.com/photo-1553531384-cc64ac80f931?w=600&q=80',
    boxType: 'Folding Carton', material: 'SBS Board', finish: 'Matte Lam',
    dims: '6×4×2 – 18×12×8 in', minQty: '100 units',
    addons: ['Spot UV', 'Embossing', 'Window Patch'],
    suggestedDimensions: { l: 6, w: 4, h: 2 },
  },
  {
    id: 'pr2', name: 'Full Flap Auto Bottom', cat: 'Bottom Closure',
    desc: 'Maximum bottom protection with full flap — ideal for retail products.',
    price: '$1.35', img: 'https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=600&q=80',
    boxType: 'Folding Carton', material: 'SBS Board', finish: 'Gloss Lam',
    dims: '4×4×4 – 16×12×10 in', minQty: '100 units',
    addons: ['Foil Stamping', 'Gloss UV', 'Embossing'],
    suggestedDimensions: { l: 4, w: 4, h: 4 },
  },
  {
    id: 'pr3', name: 'Two Panel CD Cover', cat: 'CD Covers',
    desc: 'Classic two-panel media packaging with a clean professional look.',
    price: '$0.85', img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&q=80',
    boxType: 'Folding Carton', material: 'SBS Board', finish: 'Gloss Lam',
    dims: '5.5×5 – 6×6 in', minQty: '250 units',
    addons: ['Spot UV', 'Gloss Lam', 'Custom Die-Cut'],
    suggestedDimensions: { l: 6, w: 6, h: 1 },
  },
  {
    id: 'pr4', name: 'Gable Bag', cat: 'Figure & Pattern',
    desc: 'Unique carrying handle for gift packaging — stands out on any shelf.',
    price: '$1.50', img: 'https://images.unsplash.com/photo-1619468579487-430c4d90f93b?w=600&q=80',
    boxType: 'Gable Box', material: 'Kraft', finish: 'Uncoated',
    dims: '4×4×7 – 12×9×12 in', minQty: '100 units',
    addons: ['1-Color Print', '4-Color Print', 'Custom Handle'],
    suggestedDimensions: { l: 4, w: 4, h: 7 },
  },
  {
    id: 'pr5', name: 'Double Wall Tuck Front', cat: 'Fold & Assemble',
    desc: 'Premium double-wall construction for high-end unboxing experiences.',
    price: '$2.10', img: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&q=80',
    boxType: 'Rigid Box', material: 'Rigid Chipboard', finish: 'Matte Lam',
    dims: '5×5×2 – 14×10×6 in', minQty: '50 units',
    addons: ['Foil Stamping', 'Embossing', 'Magnetic Closure'],
    suggestedDimensions: { l: 5, w: 5, h: 2 },
  },
  {
    id: 'pr6', name: 'Dispenser Box', cat: 'Rectangular',
    desc: 'Perfect for retail counter display with perforated tear strip.',
    price: '$1.80', img: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600&q=80',
    boxType: 'Display Box', material: 'SBS Board', finish: 'Gloss Lam',
    dims: '6×4×8 – 20×12×16 in', minQty: '100 units',
    addons: ['Spot UV', 'Window Patch', 'Hang Tab'],
    suggestedDimensions: { l: 6, w: 4, h: 8 },
  },
  {
    id: 'pr7', name: 'Reverse Tuck End', cat: 'Rectangular',
    desc: 'Industry-standard versatile tuck-end box — lowest cost per unit.',
    price: '$1.10', img: 'https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=600&q=80',
    boxType: 'Mailer Box', material: 'Corrugated E-Flute', finish: 'Matte Lam',
    dims: '4×4×2 – 18×14×10 in', minQty: '100 units',
    addons: ['Inside Printing', 'Spot UV', 'Perforation'],
    suggestedDimensions: { l: 4, w: 4, h: 2 },
  },
  {
    id: 'pr8', name: 'Paper Briefcase', cat: 'Showcase Exhibit',
    desc: 'Display-ready showcase packaging with premium visual impact.',
    price: '$3.50', img: 'https://images.unsplash.com/photo-1592921870789-04563d55041c?w=600&q=80',
    boxType: 'Sleeve Box', material: 'Rigid Chipboard', finish: 'Matte Lam',
    dims: '9×6×3 – 18×12×6 in', minQty: '50 units',
    addons: ['Foil Stamping', 'Debossing', 'Ribbon Pull'],
    suggestedDimensions: { l: 9, w: 6, h: 3 },
  },
  {
    id: 'pr9', name: 'Straight Tuck End', cat: 'Rectangular',
    desc: 'Classic straight tuck box — versatile for cosmetics, pharma, and food.',
    price: '$0.95', img: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80',
    boxType: 'Folding Carton', material: 'SBS Board', finish: 'Gloss Lam',
    dims: '3×2×5 – 12×8×10 in', minQty: '100 units',
    addons: ['Matte Lam', 'Soft-Touch', 'Spot UV'],
    suggestedDimensions: { l: 3, w: 2, h: 5 },
  },
  {
    id: 'pr10', name: 'Four Corner Tray', cat: 'Rectangular',
    desc: 'Sturdy tray-style base for gift sets, cosmetics, and food display.',
    price: '$1.65', img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80',
    boxType: 'Display Box', material: 'SBS Board', finish: 'Matte Lam',
    dims: '8×6×2 – 20×16×4 in', minQty: '100 units',
    addons: ['Foil Stamping', 'Gloss UV', 'Window Patch'],
    suggestedDimensions: { l: 8, w: 6, h: 2 },
  },
  {
    id: 'pr11', name: 'Five Panel Hanger', cat: 'Showcase Exhibit',
    desc: 'Retail-ready display box with euro-hole hanger for peg display.',
    price: '$2.45', img: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600&q=80',
    boxType: 'Display Box', material: 'SBS Board', finish: 'Gloss Lam',
    dims: '4×2×7 – 10×6×14 in', minQty: '100 units',
    addons: ['Euro Hole', 'Hang Tab', 'Window Patch'],
    suggestedDimensions: { l: 4, w: 2, h: 7 },
  },
  {
    id: 'pr12', name: 'Hexagon Gift Box', cat: 'Figure & Pattern',
    desc: 'Eye-catching hexagonal shape for premium gift packaging.',
    price: '$2.80', img: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&q=80',
    boxType: 'Rigid Box', material: 'Rigid Chipboard', finish: 'Matte Lam',
    dims: '6×6×4 – 14×14×8 in', minQty: '50 units',
    addons: ['Foil Stamping', 'Embossing', 'Ribbon Pull'],
    suggestedDimensions: { l: 6, w: 6, h: 4 },
  },
];

function ProductCard({ product }) {
  const [hovered, setHovered] = useState(false);
  const { openQuickView: openModal } = useModal();
  const { isFavourite, toggleFavourite } = useFavourites();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const isFav = isFavourite(product.id);

  const handleFavourite = (e) => {
    e.stopPropagation();
    toggleFavourite(product);
    showToast(isFav ? 'Removed from favourites' : 'Added to favourites');
  };

  const handleConfigure = (e) => {
    e.stopPropagation();
    navigate('/custom-box', { state: { product } });
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
          src={product.img}
          alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease', transform: hovered ? 'scale(1.07)' : 'scale(1)' }}
          loading="lazy"
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80'; }}
        />
        {/* Category badge */}
        <div style={{ position: 'absolute', top: 10, left: 10, backgroundColor: G, color: '#fff', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', padding: '4px 8px', borderRadius: 4 }}>
          {product.cat}
        </div>
        {/* Favourite button */}
        <button onClick={handleFavourite} aria-label="Toggle favourite"
          style={{ position: 'absolute', top: 10, right: 10, width: 32, height: 32, borderRadius: '50%', backgroundColor: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.12)', opacity: hovered ? 1 : 0.7, transition: 'opacity 0.2s' }}>
          <Heart size={14} style={{ color: isFav ? '#EF4444' : '#888', fill: isFav ? '#EF4444' : 'none' }} />
        </button>
        {/* View details hint */}
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

export default function Products() {
  const [activeCategory, setActiveCategory] = useState('All Products');
  const [search, setSearch] = useState('');
  const [fetchedProducts, setFetchedProducts] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await api.get('/content/products');
        if (data.products && data.products.length > 0) {
          setFetchedProducts(data.products);
        }
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        console.log('Using static product data');
      }
    };
    loadProducts();
  }, []);

  const productsList = fetchedProducts.length > 0 ? fetchedProducts : staticProducts;

  const filtered = productsList.filter(p => {
    const matchCat = activeCategory === 'All Products' || p.cat === activeCategory;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.desc.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div style={{ backgroundColor: BG, minHeight: '100vh' }}>

      {/* Hero */}
      <section style={{ backgroundColor: G, paddingTop: 120, paddingBottom: 56, paddingLeft: 24, paddingRight: 24 }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>Full Catalog</p>
          <h1 style={{ fontSize: 'clamp(28px,4vw,48px)', fontFamily: 'Outfit,sans-serif', fontWeight: 800, color: '#fff', marginBottom: 12 }}>Shop Products</h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', maxWidth: 520 }}>
            Browse our full range of custom box styles. Tap any card to see full specs, then configure your exact dimensions.
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
                placeholder="Search products..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ width: '100%', padding: '10px 12px 10px 34px', border: '1.5px solid #D8D3CB', borderRadius: 8, fontSize: 13, color: '#1A1A1A', backgroundColor: '#fff', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <p style={{ fontSize: 10, fontWeight: 700, color: '#9A9080', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>Categories</p>
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
                Showing <strong style={{ color: '#1A1A1A' }}>{filtered.length}</strong> {filtered.length === 1 ? 'product' : 'products'}
              </p>
              <p style={{ fontSize: 11, color: '#9A9080', fontStyle: 'italic' }}>Click any card to see full specifications</p>
            </div>

            {filtered.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 24 }}>
                {filtered.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '80px 24px', color: '#9A9080' }}>
                <Package size={48} style={{ color: '#D0CAC0', margin: '0 auto 16px' }} />
                <p style={{ fontSize: 16, fontWeight: 600 }}>No products found</p>
                <p style={{ fontSize: 13, marginTop: 6 }}>Try a different search or category</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .products-layout { flex-direction: column !important; }
        }
      `}</style>
    </div>
  );
}

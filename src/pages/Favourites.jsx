import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Trash2, X, ShoppingBag, Search, ChevronRight } from 'lucide-react';
import { useFavourites } from '../context/FavouritesContext';
import { useToast } from '../context/ToastContext';
import { useCart } from '../context/CartContext';
import { useModal } from '../context/ModalContext';

// Correct image map — fix wrong images regardless of what was stored
const CORRECT_IMAGES = {
  'Rigid Setup Boxes': 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&q=80',
  'Custom Mailer Boxes': 'https://images.unsplash.com/photo-1553531384-cc64ac80f931?w=600&q=80',
  'Printed Sleeve Boxes': 'https://images.unsplash.com/photo-1601056282023-0ece673c74d4?w=600&q=80',
  'Retail Display Boxes': 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600&q=80',
  'Eco-Friendly Kraft': 'https://images.unsplash.com/photo-1619468579487-430c4d90f93b?w=600&q=80',
  'Folding Cartons': 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&q=80',
  'Shipping Boxes': 'https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=600&q=80',
  'Luxury Mailer Boxes': 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?w=600&q=80',
  'Food-Safe Boxes': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80',
  'Bakery Packaging': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80',
  'Skincare Boxes': 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&q=80',
  'Makeup Palettes': 'https://images.unsplash.com/photo-1512207736890-6ffed8a84e8d?w=600&q=80',
  'Subscription Mailers': 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80',
  'Apparel Boxes': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80',
  'Tech Packaging': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80',
  'Tincture Boxes': 'https://images.unsplash.com/photo-1596395463486-bc1e2d56b8c5?w=600&q=80',
};

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80';

function getImage(product) {
  return CORRECT_IMAGES[product.name] || product.img || FALLBACK_IMG;
}

export default function Favourites() {
  const { favourites, removeFavourite, clearFavourites, count } = useFavourites();
  const { showToast } = useToast();
  const { addToCart, toggleDrawer } = useCart();
  const { openQuickView } = useModal();
  const navigate = useNavigate();
  const [confirmClear, setConfirmClear] = useState(false);

  const handleRemove = (id, name) => {
    removeFavourite(id);
    showToast(`Removed "${name}" from Favourites`, 'info');
  };

  const handleClearAll = () => {
    if (confirmClear) {
      clearFavourites();
      showToast('All favourites cleared', 'info');
      setConfirmClear(false);
    } else {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 3000);
    }
  };

  const handleAddToCart = (product) => {
    addToCart({
      id: product._id || product.id || `fav_${Date.now()}`,
      name: product.name,
      image: getImage(product),
      price: parseFloat((product.price || '$1.20').replace(/[^0-9.]/g, '')) || 1.20,
      quantity: 100,
    });
    showToast(`"${product.name}" added to cart!`, 'success');
    setTimeout(() => toggleDrawer(true), 300);
  };

  const handleConfigure = (product) => {
    navigate('/custom-box', {
      state: {
        boxType: product.boxType || 'Mailer Box',
        material: product.material || 'Corrugated E-Flute',
        finish: product.finish || 'Matte Lam',
        productName: product.name,
        suggestedDimensions: { l: 10, w: 8, h: 4 }
      }
    });
  };

  const handleQuickView = (e, product) => {
    e.stopPropagation();
    openQuickView({ ...product, img: getImage(product) });
  };

  return (
    <div style={{ backgroundColor: '#fff' }}>
      {/* Hero Section */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '100px 24px 80px', backgroundColor: '#1A4D2E', minHeight: 450, display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600&q=80)', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(1.1) contrast(1.15)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(26,77,46,0.35), rgba(26,77,46,0.65))' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6" style={{ position: 'relative', zIndex: 1, width: '100%' }}>
          <div className="flex items-center gap-2 text-white/70 text-xs mb-5 mobile-center-header">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={12} />
            <span className="text-white font-semibold">Favourites</span>
          </div>
          <div className="max-w-2xl mobile-center-text">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 12px', background: 'rgba(200,134,10,0.15)', border: '1px solid rgba(200,134,10,0.3)', borderRadius: 100, marginBottom: 16 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#C8860A' }} />
              <span style={{ fontSize: 10, fontWeight: 700, color: '#C8860A', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Your Collection</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold text-white mt-1 mb-6 leading-tight">
              My Favourites
            </h1>
            <p className="text-white/90 text-lg leading-relaxed text-left mobile-center-text max-w-xl">
              Your curated collection of premium packaging. Access your saved designs and start your custom project in seconds.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-[1200px] mx-auto px-6 py-12">
        {/* Actions Bar */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-brand-textPrimary">Saved Items</h2>
            {count > 0 && (
              <span className="px-3 py-1 bg-brand-primary text-white rounded-full text-[14px] font-bold">{count} {count === 1 ? 'item' : 'items'}</span>
            )}
          </div>
          {count > 0 && (
            <button
              onClick={handleClearAll}
              className={`flex items-center gap-2 px-4 py-2 rounded-button border text-[13px] font-bold transition-colors ${confirmClear ? 'bg-red-500 text-white border-red-500' : 'border-gray-300 text-brand-textSecondary hover:border-red-400 hover:text-red-500'}`}
            >
              {confirmClear ? <><X size={13} /> Confirm Clear All</> : <><Trash2 size={13} /> Clear All</>}
            </button>
          )}
        </div>

        {/* Empty State */}
        {count === 0 && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
              <Heart size={40} className="text-gray-300" />
            </div>
            <h2 className="text-2xl font-display font-bold text-brand-textPrimary mb-3">No favourites yet</h2>
            <p className="text-brand-textSecondary mb-8 max-w-sm">Click the ♡ icon on any product to save it here for easy access later.</p>
            <Link to="/products" className="px-8 py-3.5 bg-brand-primary text-white font-bold rounded-button hover:bg-brand-accent transition-colors">
              Browse Products
            </Link>
          </div>
        )}

        {/* Grid */}
        {count > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favourites.map((product, idx) => {
              const imgSrc = getImage(product);
              const stableId = product._id || product.id;
              return (
                <div key={stableId || idx} className="fav-card bg-white rounded-card border border-gray-100 shadow-card overflow-hidden group flex flex-col relative">

                  {/* Action buttons top-right */}
                  <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">
                    <button
                      onClick={(e) => handleQuickView(e, product)}
                      className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform text-brand-primary"
                      aria-label="Quick view"
                    >
                      <Search size={15} />
                    </button>
                    <button
                      onClick={() => handleRemove(product._id || product.id || product.name, product.name)}
                      className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-red-50 transition-colors"
                      aria-label="Remove from favourites"
                    >
                      <Heart size={15} className="fill-red-500 text-red-500" />
                    </button>
                  </div>

                  {/* Image */}
                  <div className="overflow-hidden flex-shrink-0 aspect-[4/3] relative bg-gray-50">
                    <img
                      src={imgSrc}
                      alt={product.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      onError={e => { e.target.src = FALLBACK_IMG; }}
                    />
                    {/* Category badge on image */}
                    {product.cat && (
                      <div style={{ position: 'absolute', bottom: 8, left: 8, background: '#1A4D2E', color: '#fff', fontSize: 9, fontFamily: '"DM Mono", monospace', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', padding: '3px 8px', borderRadius: 4 }}>
                        {product.cat}
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div className="flex-1 p-4 flex flex-col">
                    {/* Pills */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
                      {(product.boxType || product.cat) && (
                        <span style={{ fontSize: 9, fontFamily: '"DM Mono", monospace', fontWeight: 600, color: '#C8860A', background: 'rgba(200,134,10,0.1)', padding: '2px 7px', borderRadius: 3, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                          {product.boxType || product.cat}
                        </span>
                      )}
                      {product.material && (
                        <span style={{ fontSize: 9, fontFamily: '"DM Mono", monospace', fontWeight: 600, color: '#1A4D2E', background: 'rgba(26,77,46,0.08)', padding: '2px 7px', borderRadius: 3, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                          {product.material}
                        </span>
                      )}
                    </div>

                    <h3 className="text-[15px] font-bold text-brand-textPrimary mb-1 line-clamp-2">{product.name}</h3>
                    {(product.description || product.desc) && <p className="text-[12px] text-brand-textSecondary mb-2 line-clamp-2">{product.description || product.desc}</p>}
                    {product.price && <p className="text-[17px] font-bold text-[#C8860A] mb-3">{product.price} <span style={{ fontSize: 10, color: '#9A9080', fontWeight: 500 }}>/ unit</span></p>}

                    {/* CTA Buttons — stacked, full-width */}
                    <div className="mt-auto" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {/* PRIMARY: Configure This Box */}
                      <button
                        onClick={() => handleConfigure(product)}
                        style={{ width: '100%', padding: '11px 16px', background: '#1A4D2E', color: '#fff', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, minHeight: 44, transition: 'background 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#C8860A'}
                        onMouseLeave={e => e.currentTarget.style.background = '#1A4D2E'}
                      >
                        <ChevronRight size={14} /> Configure This Box
                      </button>
                      {/* SECONDARY: Add to Cart */}
                      <button
                        onClick={() => handleAddToCart(product)}
                        style={{ width: '100%', padding: '10px 16px', background: '#fff', color: '#1A4D2E', border: '1.5px solid #1A4D2E', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, minHeight: 44, transition: 'all 0.2s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#F5F2ED'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}
                      >
                        <ShoppingBag size={14} /> Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <style>{`
          @media (max-width: 480px) {
            .fav-card { flex-direction: column !important; }
          }
        `}</style>
      </div>
    </div>
  );
}

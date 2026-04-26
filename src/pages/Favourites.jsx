import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Trash2, X, ShoppingBag, Search } from 'lucide-react';
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
      id: product.id || `fav_${Date.now()}`,
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
    <div className="min-h-screen pt-[100px] pb-24" style={{ backgroundColor: '#F5F2ED' }}>
      <div className="max-w-[1200px] mx-auto px-6 py-12">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-brand-textPrimary">My Favourites</h1>
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
              return (
                <div key={product.id || idx} className="bg-white rounded-card border border-gray-100 shadow-card overflow-hidden group flex flex-col relative">

                  {/* Action buttons top-right */}
                  <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">
                    {/* Quick view */}
                    <button
                      onClick={(e) => handleQuickView(e, product)}
                      className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform text-brand-primary"
                      aria-label="Quick view"
                    >
                      <Search size={15} />
                    </button>
                    {/* Remove from favourites */}
                    <button
                      onClick={() => handleRemove(product.id || product.name, product.name)}
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
                  </div>

                  {/* Body */}
                  <div className="flex-1 p-4 flex flex-col">
                    <h3 className="text-[15px] font-bold text-brand-textPrimary mb-1 truncate">{product.name}</h3>
                    {product.desc && <p className="text-[12px] text-brand-textSecondary mb-3 line-clamp-2">{product.desc}</p>}
                    {product.price && <p className="text-[15px] font-bold text-brand-accent mb-4">{product.price}</p>}

                    <div className="mt-auto space-y-2">
                      <button
                        onClick={() => handleConfigure(product)}
                        className="w-full py-2.5 bg-brand-primary text-white text-[13px] font-bold rounded-button hover:bg-brand-accent transition-colors"
                      >
                        Configure This Box
                      </button>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="w-full py-2.5 border border-gray-200 text-brand-textPrimary text-[13px] font-bold rounded-button hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
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
      </div>
    </div>
  );
}

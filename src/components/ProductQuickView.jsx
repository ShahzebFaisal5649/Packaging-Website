import { useState } from 'react';
import { useModal } from '../context/ModalContext';
import { useCart } from '../context/CartContext';
import { useFavourites } from '../context/FavouritesContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { X, Heart, ShoppingBag, Check, Minus, Plus, Ruler, Layers, Palette, Package } from 'lucide-react';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80';
const G = '#1A4D2E';
const ACCENT = '#C8860A';

function SpecRow({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '8px 0', borderBottom: '1px solid #F0EDE8' }}>
      <div style={{ width: 28, height: 28, borderRadius: 6, backgroundColor: `${ACCENT}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
        <Icon size={13} style={{ color: ACCENT }} />
      </div>
      <div>
        <div style={{ fontSize: 9, fontWeight: 700, color: '#9A9080', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A' }}>{value}</div>
      </div>
    </div>
  );
}

export default function ProductQuickView() {
  const { activeModal, modalData, closeModal } = useModal();
  const { addToCart, toggleDrawer } = useCart();
  const { isFavourite, toggleFavourite } = useFavourites();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [qty, setQty] = useState(100);
  const [imgError, setImgError] = useState(false);

  if (activeModal !== 'quickView' || !modalData) return null;

  const isFav = isFavourite(modalData.id || modalData.name);
  const imgSrc = imgError ? FALLBACK_IMG : (modalData.img || FALLBACK_IMG);

  const handleAddToCart = () => {
    addToCart({
      id: modalData.id || `prod_${Date.now()}`,
      name: modalData.name,
      image: imgSrc,
      price: parseFloat((modalData.price || '$1.20').replace(/[^0-9.]/g, '')) || 1.20,
      quantity: qty,
    });
    showToast('Added to cart!', 'success');
    closeModal();
    setTimeout(() => toggleDrawer(true), 300);
  };

  const handleFavourite = () => {
    const added = toggleFavourite(modalData);
    showToast(added !== false ? `Added "${modalData.name}" to Favourites ♥` : `Removed from Favourites`, 'info');
  };

  const handleConfigure = () => {
    closeModal();
    navigate('/custom-box', {
      state: {
        boxType: modalData.boxType || 'Mailer Box',
        material: modalData.material || 'Corrugated E-Flute',
        finish: modalData.finish || 'Matte Lam',
        productName: modalData.name,
        suggestedDimensions: modalData.suggestedDimensions || { l: 10, w: 8, h: 4 },
      },
    });
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[9999]"
        style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
        onClick={closeModal}
      />

      {/* Modal */}
      <div
        className="fixed z-[10000] bg-white rounded-2xl shadow-2xl overflow-hidden"
        style={{
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(94vw, 960px)',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        {/* Close */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-gray-500 hover:text-red-500 transition-colors shadow-sm"
          aria-label="Close"
        >
          <X size={16} />
        </button>

        {/* LEFT — Image */}
        <div style={{ width: '42%', flexShrink: 0, position: 'relative', backgroundColor: '#F5F5F5', overflow: 'hidden' }}>
          <img
            src={imgSrc}
            alt={modalData.name}
            onError={() => setImgError(true)}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          {/* Category overlay */}
          {modalData.cat && (
            <div style={{ position: 'absolute', top: 14, left: 14, backgroundColor: G, color: '#fff', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', padding: '4px 10px', borderRadius: 4 }}>
              {modalData.cat}
            </div>
          )}
          {/* Favourite */}
          <button
            onClick={handleFavourite}
            style={{ position: 'absolute', top: 10, right: 10, width: 38, height: 38, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: '50%', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
            aria-label={isFav ? 'Remove from favourites' : 'Add to favourites'}
          >
            <Heart size={17} style={{ color: isFav ? '#EF4444' : '#888', fill: isFav ? '#EF4444' : 'none' }} />
          </button>
          {/* Price badge */}
          {modalData.price && (
            <div style={{ position: 'absolute', bottom: 14, left: 14, backgroundColor: '#fff', borderRadius: 8, padding: '6px 12px', boxShadow: '0 2px 10px rgba(0,0,0,0.15)' }}>
              <span style={{ fontSize: 18, fontWeight: 800, color: ACCENT, fontFamily: 'Outfit,sans-serif' }}>{modalData.price}</span>
              <span style={{ fontSize: 10, color: '#9A9080', marginLeft: 3 }}>/ unit</span>
            </div>
          )}
        </div>

        {/* RIGHT — Content */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <div style={{ padding: '28px 28px 0' }}>
            <h2 style={{ fontSize: 22, fontFamily: 'Outfit,sans-serif', fontWeight: 800, color: '#1A1A1A', marginBottom: 6 }}>{modalData.name}</h2>
            <p style={{ fontSize: 13, color: '#7A7060', lineHeight: 1.6, marginBottom: 0 }}>
              {modalData.desc || 'Premium custom packaging tailored to your brand requirements.'}
            </p>
          </div>

          {/* Specs section */}
          {(modalData.boxType || modalData.material || modalData.finish || modalData.dims) && (
            <div style={{ padding: '16px 28px 0' }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: '#9A9080', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Specifications</p>
              <SpecRow icon={Package} label="Box Type" value={modalData.boxType} />
              <SpecRow icon={Layers} label="Material" value={modalData.material} />
              <SpecRow icon={Palette} label="Finish" value={modalData.finish} />
              <SpecRow icon={Ruler} label="Dimensions" value={modalData.dims} />
              {modalData.minQty && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '8px 0', borderBottom: '1px solid #F0EDE8' }}>
                  <div style={{ width: 28, height: 28, borderRadius: 6, backgroundColor: `${G}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: G }}>Q</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 9, fontWeight: 700, color: '#9A9080', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>Min. Order</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A' }}>{modalData.minQty}</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Add-ons */}
          {modalData.addons?.length > 0 && (
            <div style={{ padding: '14px 28px 0' }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: '#9A9080', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Available Add-ons</p>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {modalData.addons.map(a => (
                  <span key={a} style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', padding: '3px 8px', borderRadius: 4, backgroundColor: `${ACCENT}14`, color: ACCENT, border: `1px solid ${ACCENT}30` }}>{a}</span>
                ))}
              </div>
            </div>
          )}

          {/* Qty */}
          <div style={{ padding: '16px 28px 0' }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: '#9A9080', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Order Quantity</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button onClick={() => setQty(q => Math.max(50, q - 50))} style={{ width: 36, height: 36, borderRadius: 8, border: '1.5px solid #E0DAD2', backgroundColor: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Minus size={14} />
              </button>
              <span style={{ minWidth: 90, textAlign: 'center', fontWeight: 700, fontSize: 15, color: '#1A1A1A' }}>{qty.toLocaleString()} units</span>
              <button onClick={() => setQty(q => Math.min(50000, q + 50))} style={{ width: 36, height: 36, borderRadius: 8, border: '1.5px solid #E0DAD2', backgroundColor: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* Features */}
          <div style={{ padding: '14px 28px 0' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {['Free digital 3D proof', 'No die-cut plate fees', 'Full CMYK + specialty printing', 'Fast 8–10 day turnaround'].map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#5A5A5A' }}>
                  <Check size={12} style={{ color: '#16A34A', flexShrink: 0 }} /> {f}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div style={{ padding: '20px 28px 28px', marginTop: 'auto', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              onClick={handleAddToCart}
              style={{ flex: 1, padding: '13px 0', backgroundColor: G, color: '#fff', fontWeight: 700, fontSize: 13, borderRadius: 8, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, fontFamily: 'Outfit,sans-serif', transition: 'background 0.15s', minWidth: 120 }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = ACCENT}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = G}
            >
              <ShoppingBag size={14} /> Add to Cart
            </button>
            <button
              onClick={handleConfigure}
              style={{ flex: 1, padding: '13px 0', backgroundColor: 'transparent', color: G, fontWeight: 700, fontSize: 13, borderRadius: 8, border: `1.5px solid ${G}`, cursor: 'pointer', fontFamily: 'Outfit,sans-serif', transition: 'all 0.15s', minWidth: 120 }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = G; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = G; }}
            >
              Configure This Box
            </button>
          </div>
        </div>

        <style>{`
          @media (max-width: 640px) {
            .quick-view-modal { flex-direction: column !important; }
          }
        `}</style>
      </div>
    </>
  );
}

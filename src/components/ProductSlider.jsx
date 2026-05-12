import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Heart, Search } from 'lucide-react';
import { useModal } from '../context/ModalContext';
import { useFavourites } from '../context/FavouritesContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';

const BOX_TYPE_MAP = {
  'Custom Mailer Boxes': { boxType: 'Mailer Box', material: 'Corrugated E-Flute', finish: 'Matte Lam', suggestedDimensions: { l: 12, w: 8, h: 4 } },
  'Printed Sleeve Boxes': { boxType: 'Sleeve Box', material: 'SBS Board', finish: 'Gloss Lam', suggestedDimensions: { l: 10, w: 6, h: 3 } },
  'Retail Display Boxes': { boxType: 'Display Box', material: 'SBS Board', finish: 'Gloss Lam', suggestedDimensions: { l: 14, w: 10, h: 6 } },
  'Rigid Setup Boxes': { boxType: 'Rigid Box', material: 'Rigid Chipboard', finish: 'Matte Lam', suggestedDimensions: { l: 10, w: 8, h: 4 } },
  'Eco-Friendly Kraft': { boxType: 'Kraft Box', material: 'Kraft', finish: 'Uncoated', suggestedDimensions: { l: 10, w: 8, h: 6 } },
  'Folding Cartons': { boxType: 'Folding Carton', material: 'SBS Board', finish: 'Matte Lam', suggestedDimensions: { l: 8, w: 5, h: 3 } },
  'Shipping Boxes': { boxType: 'Shipping Box', material: 'Corrugated B-Flute', finish: 'Uncoated', suggestedDimensions: { l: 16, w: 12, h: 8 } },
  'Luxury Mailer Boxes': { boxType: 'Mailer Box', material: 'Rigid Chipboard', finish: 'Matte Lam', suggestedDimensions: { l: 12, w: 9, h: 4 } },
};

export default function ProductSlider({ products = [], title = 'Featured Products' }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const sliderRef = useRef(null);

  const { openQuickView } = useModal();
  const { isFavourite, toggleFavourite } = useFavourites();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const getVisibleItems = () => {
    if (typeof window === 'undefined') return 4;
    if (window.innerWidth < 768) return 1;
    if (window.innerWidth < 1200) return 2;
    return 4;
  };

  const [visibleCount, setVisibleCount] = useState(getVisibleItems());

  useEffect(() => {
    const handleResize = () => setVisibleCount(getVisibleItems());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, products.length - Math.floor(visibleCount));

  const handleDragStart = (e) => {
    setIsDragging(false); // reset; only set true on actual move
    setStartX(e.type.includes('mouse') ? e.pageX : e.touches[0].pageX);
    setScrollLeft(currentIndex);
  };

  const handleDragMove = (e) => {
    const x = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
    const delta = Math.abs(x - startX);
    if (delta < 5) return; // ignore tiny movements
    setIsDragging(true);
    e.preventDefault();
    let newIndex = scrollLeft - (x - startX) / 100;
    if (newIndex < 0) newIndex = 0;
    if (newIndex > maxIndex) newIndex = maxIndex;
    setCurrentIndex(newIndex);
  };

  const handleDragEnd = (e) => {
    const wasDragging = isDragging;
    setIsDragging(false);
    if (!wasDragging) return;
    
    const x = e.type.includes('mouse') ? e.pageX : (e.changedTouches?.[0]?.pageX || startX);
    const walk = (x - startX) / 100;
    if (Math.abs(walk) > 0.3) {
      if (walk > 0) handlePrev();
      else handleNext();
    } else {
      setCurrentIndex(Math.round(currentIndex));
    }
  };

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(maxIndex, Math.floor(prev + 1)));
  };

  const handlePrev = () => {
    setCurrentIndex(prev => Math.max(0, Math.ceil(prev - 1)));
  };

  const handleFavourite = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleFavourite(product);
    showToast(added !== false ? `Added "${product.name}" to Favourites ♥` : `Removed "${product.name}" from Favourites`, 'info');
  };

  const handleQuickView = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    openQuickView(product);
  };

  const handleConfigure = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    const preConfig = BOX_TYPE_MAP[product.name] || { boxType: 'Mailer Box', material: 'Corrugated E-Flute', finish: 'Matte Lam', suggestedDimensions: { l: 10, w: 8, h: 4 } };
    navigate('/custom-box', { state: { ...preConfig, productName: product.name } });
  };

  const GAP = 24;

  return (
    <div className="w-full relative group py-8">
      <div className="flex justify-between items-end mb-8 px-6 lg:px-0">
        <h2 className="text-3xl font-display font-bold text-brand-textPrimary">{title}</h2>
        <div className="flex gap-2">
          <button
            onClick={handlePrev}
            disabled={Math.round(currentIndex) === 0}
            className="w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 bg-white/90 shadow-sm hover:bg-brand-primary hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ minWidth: 44, minHeight: 44 }}
            aria-label="Previous products"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={handleNext}
            disabled={Math.round(currentIndex) >= maxIndex}
            className="w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 bg-white/90 shadow-sm hover:bg-brand-primary hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ minWidth: 44, minHeight: 44 }}
            aria-label="Next products"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="overflow-hidden px-6 lg:px-0 relative" ref={sliderRef}>
        <div
          className={`flex ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} transition-transform ease-out`}
          style={{ 
            gap: `${GAP}px`,
            transform: `translateX(calc(-${currentIndex} * (100% + ${GAP}px) / ${visibleCount}))`, 
            transitionDuration: isDragging ? '0ms' : '500ms' 
          }}
          onMouseDown={handleDragStart}
          onMouseMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={handleDragStart}
          onTouchMove={handleDragMove}
          onTouchEnd={handleDragEnd}
        >
          {products.map((product, idx) => {
            const isFav = isFavourite(product.id);
            return (
              <div
                key={idx}
                className="flex-shrink-0 group/card"
                style={{ width: `calc(${100 / visibleCount}% - ${GAP * (visibleCount - 1) / visibleCount}px)` }}
              >
                <div className="bg-white rounded-card overflow-hidden border border-transparent hover:border-gray-200 hover:shadow-card-hover flex flex-col relative transition-shadow duration-300 h-full">

                  {/* Action buttons */}
                  <div className="absolute top-3 right-3 z-20 flex flex-col gap-2 opacity-0 group-hover/card:opacity-100 transition-all duration-200 translate-x-3 group-hover/card:translate-x-0">
                    <button onClick={(e) => handleFavourite(e, product)} className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform" aria-label="Add to favourites">
                      <Heart size={16} className={isFav ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
                    </button>
                    <button onClick={(e) => handleQuickView(e, product)} className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform text-brand-primary" aria-label="Quick view">
                      <Search size={16} />
                    </button>
                  </div>

                  {/* Image */}
                  <div className="overflow-hidden flex-shrink-0 aspect-[4/3] relative bg-gray-50">
                    <img
                      src={product.img}
                      alt={product.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105"
                      draggable="false"
                      loading="lazy"
                      onError={e => { e.target.src = 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80'; }}
                    />
                  </div>

                  {/* Card Body */}
                  <div className="flex-1 p-4 md:p-5 flex flex-col bg-white">
                    <div className="flex-1 mb-4">
                      <h3 className="text-[15px] font-bold text-brand-textPrimary mb-1 truncate">{product.name}</h3>
                      <p className="text-[12px] text-brand-textSecondary line-clamp-2 mb-2">{product.desc}</p>
                      <p className="text-[15px] font-bold text-brand-accent">{product.price} <span className="text-[11px] font-normal text-gray-400">/ unit</span></p>
                    </div>
                    <button
                      onClick={(e) => handleConfigure(e, product)}
                      style={{ pointerEvents: isDragging ? 'none' : 'auto' }}
                      className="w-full mt-auto py-3 bg-brand-primary text-white text-[14px] font-bold rounded-button hover:bg-brand-accent transition-all duration-300 flex items-center justify-center gap-2 group/btn active:scale-95 shadow-sm hover:shadow-md"
                    >
                      <span>Get a Custom Box</span>
                      <ChevronRight size={16} className="transition-transform duration-300 group-hover/btn:translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center mt-8 gap-2">
        {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
          <button 
            key={idx} 
            onClick={() => setCurrentIndex(idx)} 
            className={`h-2 rounded-full transition-all duration-300 ${idx === Math.round(currentIndex) ? 'bg-brand-primary w-6' : 'bg-gray-300 hover:bg-gray-400 w-2'}`} 
          />
        ))}
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { X, Minus, Plus, ShoppingBag, ChevronRight, Trash2, CheckSquare, Square } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function CartDrawer() {
  const { cartItems, isDrawerOpen, toggleDrawer, updateQuantity, removeFromCart, removeMultipleFromCart, selectedCartTotal, selectedItemIndices, toggleSelectedItem, selectAllItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // Selected items are now managed globally in CartContext so Checkout can see them


  // Close cart when user navigates to a different page
  useEffect(() => {
    toggleDrawer(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Close cart when tab becomes hidden (user switches tabs)
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) toggleDrawer(false);
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/40 z-[10001] backdrop-blur-sm transition-opacity duration-300 ${isDrawerOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={() => toggleDrawer(false)}
      ></div>
      
      <div className={`fixed top-0 right-0 h-full w-[100vw] max-w-[400px] bg-white shadow-2xl z-[10002] transform transition-transform duration-300 ease-out flex flex-col ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="flex flex-col border-b border-gray-100">
          <div className="flex items-center justify-between p-6 pb-4">
            <h2 className="text-xl font-display font-bold text-brand-textPrimary flex items-center gap-2">
              <ShoppingBag size={20} /> Your Cart ({cartItems.length})
            </h2>
            <button 
              onClick={() => toggleDrawer(false)} 
              className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-brand-textPrimary transition-all"
              aria-label="Close cart"
            >
              <X size={20} strokeWidth={2.5} />
            </button>
          </div>
          {cartItems.length > 0 && (
            <div className="flex items-center justify-between px-6 pb-4">
              <button 
                onClick={() => selectAllItems(selectedItemIndices.length !== cartItems.length)}
                className="flex items-center gap-2 text-[13px] font-semibold text-gray-500 hover:text-brand-primary transition-colors"
              >
                {selectedItemIndices.length === cartItems.length ? <CheckSquare size={16} className="text-brand-primary" /> : <Square size={16} />}
                Select All
              </button>
              {selectedItemIndices.length > 0 && (
                <button 
                  onClick={() => removeMultipleFromCart(selectedItemIndices)}
                  className="flex items-center gap-1.5 text-[13px] font-semibold text-red-500 hover:text-red-600 transition-colors bg-red-50 px-3 py-1.5 rounded-md"
                >
                  <Trash2 size={14} /> Remove Selected
                </button>
              )}
            </div>
          )}
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 space-y-4">
              <ShoppingBag size={48} className="opacity-20" />
              <p className="text-[15px] font-medium text-brand-textSecondary">Your cart is empty</p>
              <button 
                onClick={() => toggleDrawer(false)}
                className="mt-4 px-6 py-2.5 bg-brand-primary text-white font-bold rounded-button hover:bg-brand-accent transition-colors text-[13px]"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cartItems.map((item, idx) => (
              <div key={idx} className={`flex gap-4 border-b border-gray-50 pb-6 last:border-0 last:pb-0 transition-colors ${selectedItemIndices.includes(idx) ? 'bg-[#EEF4FB]/50 -mx-6 px-6 pt-2 pb-8 rounded-lg' : ''}`}>
                <button
                  onClick={() => toggleSelectedItem(idx)}
                  className="mt-6 flex-shrink-0 text-gray-400 hover:text-brand-primary transition-colors"
                >
                  {selectedItemIndices.includes(idx) ? <CheckSquare size={18} className="text-brand-primary" /> : <Square size={18} />}
                </button>
                <div 
                  className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100 cursor-pointer"
                  onClick={() => { toggleDrawer(false); navigate('/custom-box', { state: { ...item.configuration } }); }}
                >
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-1">
                    <h4 
                      className="text-[14px] font-bold text-brand-textPrimary truncate pr-2 cursor-pointer hover:text-brand-primary transition-colors"
                      onClick={() => { toggleDrawer(false); navigate('/custom-box', { state: { ...item.configuration } }); }}
                    >
                      {item.name}
                    </h4>
                    <button onClick={() => removeFromCart(idx)} className="text-gray-300 hover:text-red-500 transition-colors">
                      <X size={16} />
                    </button>
                  </div>
                  {item.configuration && (
                    <p className="text-[11px] text-brand-textSecondary mb-2 leading-tight">
                      {item.configuration.l}x{item.configuration.w}x{item.configuration.h} {item.configuration.unit} • {item.configuration.material} • {item.configuration.finish}
                    </p>
                  )}
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center border border-gray-200 rounded-md">
                      <button onClick={() => updateQuantity(idx, item.quantity - 1)} className="px-2 py-1 text-gray-500 hover:text-brand-primary transition-colors"><Minus size={12} /></button>
                      <span className="px-2 text-[12px] font-bold text-brand-textPrimary w-8 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(idx, item.quantity + 1)} className="px-2 py-1 text-gray-500 hover:text-brand-primary transition-colors"><Plus size={12} /></button>
                    </div>
                    <span className="text-[14px] font-bold text-brand-accent">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-brand-bg">
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-[14px] text-brand-textSecondary">
                <span>Subtotal ({selectedItemIndices.length} items)</span>
                <span>${selectedCartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[14px] text-brand-textSecondary">
                <span>Shipping</span>
                <span className="text-brand-success font-medium">Free</span>
              </div>
              <div className="flex justify-between text-[18px] font-bold text-brand-textPrimary pt-3 border-t border-gray-200">
                <span>Total</span>
                <span>${selectedCartTotal.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <button 
                onClick={() => {
                  if (selectedItemIndices.length === 0) {
                    alert('Please select at least one item to proceed to checkout.');
                    return;
                  }
                  toggleDrawer(false);
                  navigate('/checkout');
                }}
                className={`block w-full py-3.5 text-white text-center font-bold text-[14px] rounded-button shadow-sm transition-all ${selectedItemIndices.length === 0 ? 'bg-gray-400 cursor-not-allowed opacity-70' : 'bg-brand-accent hover:bg-[#b57a3d] hover:scale-[1.02] active:scale-[0.97]'}`}
              >
                Proceed to Checkout
              </button>
              <button
                onClick={() => { toggleDrawer(false); navigate('/products'); }}
                className="w-full py-3.5 px-6 bg-white border-2 border-[#1A4D2E] text-[#1A4D2E] font-bold text-[14px] rounded-button hover:shadow-[0_8px_25px_rgba(26,77,46,0.15)] transition-all duration-300 flex items-center justify-between group overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-[#1A4D2E] translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <div className="flex items-center gap-2 relative z-10 group-hover:text-white transition-colors duration-300">
                  <ShoppingBag size={18} />
                  <span>Explore More Products</span>
                </div>
                <ChevronRight size={18} className="relative z-10 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

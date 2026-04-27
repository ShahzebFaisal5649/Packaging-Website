import { useCart } from '../context/CartContext';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function CartDrawer() {
  const { cartItems, isDrawerOpen, toggleDrawer, updateQuantity, removeFromCart, cartTotal } = useCart();
  const navigate = useNavigate();

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/40 z-[9990] backdrop-blur-sm transition-opacity duration-300 ${isDrawerOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={() => toggleDrawer(false)}
      ></div>
      
      <div className={`fixed top-0 right-0 h-full w-[100vw] max-w-[400px] bg-white shadow-2xl z-[9999] transform transition-transform duration-300 ease-out flex flex-col ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-display font-bold text-brand-textPrimary flex items-center gap-2">
            <ShoppingBag size={20} /> Your Cart ({cartItems.length})
          </h2>
          <button onClick={() => toggleDrawer(false)} className="text-gray-400 hover:text-brand-textPrimary transition-colors">
            <X size={24} />
          </button>
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
              <div key={idx} className="flex gap-4 border-b border-gray-50 pb-6 last:border-0 last:pb-0">
                <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-[14px] font-bold text-brand-textPrimary truncate pr-2">{item.name}</h4>
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
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[14px] text-brand-textSecondary">
                <span>Shipping</span>
                <span className="text-brand-success font-medium">Free</span>
              </div>
              <div className="flex justify-between text-[18px] font-bold text-brand-textPrimary pt-3 border-t border-gray-200">
                <span>Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <Link 
                to="/checkout" 
                onClick={() => toggleDrawer(false)}
                className="block w-full py-3.5 bg-brand-accent text-white text-center font-bold text-[14px] rounded-button shadow-sm hover:bg-[#b57a3d] hover:scale-[1.02] active:scale-[0.97] transition-button"
              >
                Proceed to Checkout
              </Link>
              <button
                onClick={() => { toggleDrawer(false); navigate('/products'); }}
                className="w-full py-3.5 bg-transparent border border-gray-300 text-brand-textPrimary font-bold text-[14px] rounded-button hover:bg-gray-50 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

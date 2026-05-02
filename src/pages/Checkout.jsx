import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Lock, Shield, ArrowLeft, CheckCircle, CreditCard, Package, Truck, AlertCircle } from 'lucide-react';

const G = '#1A4D2E';
const ACCENT = '#C8860A';

const CARD_STYLE = {
  style: {
    base: {
      fontSize: '15px',
      color: '#1A1A1A',
      fontFamily: 'Inter, sans-serif',
      '::placeholder': { color: '#aaa' },
    },
    invalid: { color: '#EF4444' },
  },
};

const CARD_OPTIONS = {
  hidePostalCode: true,
};

// ── Payment Form ──────────────────────────────────────────────────────────────
function PaymentForm({ clientSecret, amount }) {
  const stripe = useStripe();
  const elements = useElements();
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [cardReady, setCardReady] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    address: '',
    city: '',
    zip: '',
  });

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;
    if (!form.name || !form.email) {
      showToast('Please fill in your name and email', 'error');
      return;
    }
    setLoading(true);
    try {
      // Build billing details, only include postal_code if provided
      const billingDetails = {
        name: form.name,
        email: form.email,
        address: {
          line1: form.address,
          city: form.city,
        },
      };
      if (form.zip) billingDetails.address.postal_code = form.zip;

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: billingDetails,
        },
      });
      if (error) {
        showToast(error.message, 'error');
      } else if (paymentIntent?.status === 'succeeded') {
        try {
          const orderData = {
            items: cartItems,
            total: amount,
            shippingAddress: {
              name: form.name,
              email: form.email,
              line1: form.address,
              city: form.city,
              postal_code: form.zip,
            },
            paymentIntentId: paymentIntent.id,
          };

          let savedSuccessfully = false;
          if (localStorage.getItem('designcustombox_token')) {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/users/orders`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('designcustombox_token')}`,
              },
              body: JSON.stringify(orderData),
            });
            if (response.ok) savedSuccessfully = true;
          }

          if (!savedSuccessfully) {
            // Save to localStorage as guest / fallback
            const guestList = JSON.parse(localStorage.getItem('packagingUsersList') || '[]');
            const guestIdx = guestList.findIndex(u => u.email === form.email);
            const fallbackOrder = {
              orderId: `ORD-${Date.now()}`,
              items: cartItems,
              total: amount,
              status: 'Processing',
              date: new Date().toISOString().split('T')[0],
              product: cartItems.length > 0 ? cartItems[0].name : 'Custom Box',
              qty: cartItems.reduce((acc, item) => acc + item.quantity, 0),
              paymentIntentId: paymentIntent.id,
              userName: form.name,
              userEmail: form.email
            };
            
            if (guestIdx > -1) {
              guestList[guestIdx].orders = [...(guestList[guestIdx].orders || []), fallbackOrder];
            } else {
              guestList.push({ 
                id: `guest_${Date.now()}`, 
                name: form.name, 
                email: form.email, 
                role: 'user', 
                orders: [fallbackOrder], 
                quotes: [] 
              });
            }
            localStorage.setItem('packagingUsersList', JSON.stringify(guestList));
          }
        } catch (err) {
          console.error('Order save error:', err);
          // Continue anyway as payment already succeeded and local save is attempted
        }

        setSuccess(true);
        clearCart();
        showToast('Payment successful! Your order is confirmed. 🎉', 'success');
        setTimeout(() => navigate('/profile'), 3500);
      }
    } catch (err) {
      showToast(err.message || 'Payment failed', 'error');
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 24px' }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%', background: '#D1FAE5',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px',
        }}>
          <CheckCircle size={40} color="#059669" />
        </div>
        <h2 style={{ fontSize: 26, fontFamily: 'Outfit,sans-serif', fontWeight: 800, color: '#111', marginBottom: 10 }}>
          Payment Successful!
        </h2>
        <p style={{ fontSize: 15, color: '#666', marginBottom: 8 }}>
          Your order has been confirmed and is being processed.
        </p>
        <p style={{ fontSize: 13, color: '#aaa' }}>Redirecting to your profile in a moment…</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Contact info */}
      <p style={{ fontSize: 13, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 14 }}>
        Contact Information
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 14 }}>
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 6 }}>Full Name *</label>
          <input
            name="name" value={form.name} onChange={handleChange} required
            placeholder="John Doe"
            style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #E0DBD3', borderRadius: 9, fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
            onFocus={e => e.target.style.borderColor = G}
            onBlur={e => e.target.style.borderColor = '#E0DBD3'}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 6 }}>Email *</label>
          <input
            name="email" type="email" value={form.email} onChange={handleChange} required
            placeholder="you@company.com"
            style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #E0DBD3', borderRadius: 9, fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
            onFocus={e => e.target.style.borderColor = G}
            onBlur={e => e.target.style.borderColor = '#E0DBD3'}
          />
        </div>
      </div>
      <div style={{ marginBottom: 14 }}>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 6 }}>Shipping Address</label>
        <input
          name="address" value={form.address} onChange={handleChange}
          placeholder="123 Main Street"
          style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #E0DBD3', borderRadius: 9, fontSize: 14, outline: 'none', boxSizing: 'border-box', marginBottom: 10 }}
          onFocus={e => e.target.style.borderColor = G}
          onBlur={e => e.target.style.borderColor = '#E0DBD3'}
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 }}>
          <input
            name="city" value={form.city} onChange={handleChange}
            placeholder="City"
            style={{ width: '100%', boxSizing: 'border-box', padding: '11px 14px', border: '1.5px solid #E0DBD3', borderRadius: 9, fontSize: 14, outline: 'none' }}
            onFocus={e => e.target.style.borderColor = G}
            onBlur={e => e.target.style.borderColor = '#E0DBD3'}
          />
          <input
            name="zip" value={form.zip} onChange={handleChange}
            placeholder="ZIP / Postal Code (Optional)"
            style={{ width: '100%', boxSizing: 'border-box', padding: '11px 14px', border: '1.5px solid #E0DBD3', borderRadius: 9, fontSize: 14, outline: 'none' }}
            onFocus={e => e.target.style.borderColor = G}
            onBlur={e => e.target.style.borderColor = '#E0DBD3'}
          />
        </div>
      </div>

      {/* Card element */}
      <p style={{ fontSize: 13, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '22px 0 14px' }}>
        Card Details
      </p>
      <div style={{
        padding: '14px 16px',
        border: '1.5px solid #E0DBD3', borderRadius: 9,
        background: '#fff', marginBottom: 6,
        transition: 'border-color 0.15s',
      }}>
        <CardElement options={{ ...CARD_STYLE, ...CARD_OPTIONS }} onReady={() => setCardReady(true)} />
      </div>
      <p style={{ fontSize: 11, color: '#aaa', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 5 }}>
        <Lock size={11} /> Test card: 4242 4242 4242 4242 · any future date · any CVC
      </p>

      {/* Pay button */}
      <button
        type="submit"
        disabled={!stripe || !cardReady || loading}
        style={{
          width: '100%', padding: '15px',
          background: loading ? '#aaa' : `linear-gradient(135deg, ${G}, #2E6B47)`,
          color: '#fff', border: 'none', borderRadius: 11,
          fontWeight: 800, fontSize: 16, cursor: loading ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          transition: 'opacity 0.2s',
          boxShadow: loading ? 'none' : '0 6px 20px rgba(26,77,46,0.3)',
        }}
      >
        <Lock size={17} />
        {loading ? 'Processing…' : `Pay $${amount.toFixed(2)} Now`}
      </button>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, marginTop: 16 }}>
        {['Visa', 'Mastercard', 'Amex', 'Discover'].map(b => (
          <span key={b} style={{ fontSize: 11, fontWeight: 700, color: '#bbb', padding: '3px 8px', border: '1px solid #E0DBD3', borderRadius: 4 }}>{b}</span>
        ))}
      </div>
    </form>
  );
}

// ── Main Checkout Page ────────────────────────────────────────────────────────
export default function Checkout() {
  const { cartItems, cartTotal } = useCart();
  const navigate = useNavigate();
  const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';
  const [clientSecret, setClientSecret] = useState('');
  const [stripePromise] = useState(() => publishableKey ? loadStripe(publishableKey) : null);
  const [loadError, setLoadError] = useState(publishableKey ? '' : 'Stripe publishable key is not configured. Please contact support.');

  const tax = cartTotal * 0.08;
  const orderTotal = cartTotal + tax;

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/products');
      return;
    }
    if (!publishableKey) return;

    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/payment/create-intent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: orderTotal }),
    })
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}: ${r.statusText}`);
        return r.json();
      })
      .then(d => {
        if (d.clientSecret) setClientSecret(d.clientSecret);
        else setLoadError(d.message || 'Could not initialise payment');
      })
      .catch(err => setLoadError(err.message || 'Server unreachable. Please try again.'));
  }, [cartItems.length, orderTotal, navigate, publishableKey]);

  return (
    <div style={{ minHeight: 'calc(100vh - (var(--nav-h) + var(--ann-h)))', background: '#F5F2ED', paddingTop: 32, paddingBottom: 64 }}>

      {/* Test mode banner */}
      <div style={{ background: '#FEF3C7', borderBottom: '1px solid #FDE68A', padding: '10px 24px', textAlign: 'center' }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#92400E', display: 'block', textAlign: 'center', lineHeight: 1.6 }}>
          Stripe Test Mode: use card <strong>4242 4242 4242 4242</strong>, any future date, any CVC
        </span>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '36px 24px 60px' }}>

        {/* Header */}
        <div className="checkout-header" style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32, flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <div className="checkout-header-top" style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <Link to="/products" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: '#666', textDecoration: 'none' }}>
              <ArrowLeft size={16} /> Back
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#059669', fontWeight: 700 }}>
              <Shield size={14} /> SSL Encrypted
            </div>
          </div>
          <div style={{ width: '100%', textAlign: 'center' }}>
            <h1 style={{ fontSize: 'clamp(20px, 4vw, 26px)', fontFamily: 'Outfit,sans-serif', fontWeight: 800, color: '#1A1A1A', margin: 0 }}>
              <Lock size={20} style={{ verticalAlign: 'middle', marginRight: 8, color: G }} />
              Secure Checkout
            </h1>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 28, alignItems: 'start' }} className="checkout-grid">

          {/* LEFT — payment form */}
          <div className="checkout-payment-card" style={{ background: '#fff', borderRadius: 16, padding: 'clamp(16px, 4vw, 28px)', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
              <CreditCard size={20} color={G} />
              <h2 style={{ fontSize: 17, fontWeight: 800, color: '#1A1A1A', margin: 0 }}>Payment Details</h2>
            </div>

            {loadError ? (
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '16px 20px', color: '#991B1B', fontSize: 14 }}>
                <AlertCircle size={16} style={{ verticalAlign: 'middle', marginRight: 8 }} />
                {loadError}
              </div>
            ) : !publishableKey ? (
              <div style={{ background: '#FEF9C3', border: '1px solid #FDE047', borderRadius: 10, padding: '16px 20px', color: '#7C3AED', fontSize: 14 }}>
                <AlertCircle size={16} style={{ verticalAlign: 'middle', marginRight: 8 }} />
                Stripe is not configured for this environment.
              </div>
            ) : !stripePromise || !clientSecret ? (
              <div style={{ padding: '48px 24px', textAlign: 'center', color: '#aaa' }}>
                <div style={{ width: 32, height: 32, border: `3px solid ${G}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
                Initialising secure payment…
              </div>
            ) : (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <PaymentForm clientSecret={clientSecret} amount={orderTotal} />
              </Elements>
            )}
          </div>

          {/* RIGHT — order summary */}
          <div className="checkout-summary" style={{ position: 'sticky', top: 100 }}>
            <div className="checkout-summary-card" style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
              {/* Header */}
              <div style={{ background: G, padding: '16px 22px', display: 'flex', alignItems: 'center', gap: 10 }}>
                <Package size={17} color="#fff" />
                <h3 style={{ fontSize: 15, fontWeight: 800, color: '#fff', margin: 0 }}>
                  Order Summary ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
                </h3>
              </div>

              {/* Items */}
              <div style={{ padding: '18px 22px', borderBottom: '1px solid #F0EDE8', maxHeight: 260, overflowY: 'auto' }}>
                {cartItems.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, marginBottom: i < cartItems.length - 1 ? 16 : 0, alignItems: 'center' }}>
                    <div style={{ width: 52, height: 52, borderRadius: 8, background: '#F5F2ED', overflow: 'hidden', flexShrink: 0 }}>
                      <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={e => { e.target.src = 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=200&q=60'; }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#1A1A1A', lineHeight: 1.3 }}>{item.name}</div>
                      <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>Qty: {item.quantity}</div>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: ACCENT }}>${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div style={{ padding: '18px 22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#666', marginBottom: 10 }}>
                  <span>Subtotal</span><span>${cartTotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#666', marginBottom: 10 }}>
                  <span>Tax (8%)</span><span>${tax.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#059669', fontWeight: 700, marginBottom: 14 }}>
                  <span>Shipping</span><span>FREE</span>
                </div>
                <div style={{ borderTop: '2px solid #F0EDE8', paddingTop: 14, display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 900, color: '#1A1A1A' }}>
                  <span>Total</span><span style={{ color: G }}>${orderTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Guarantees */}
              <div style={{ background: '#F5F2ED', padding: '14px 22px', borderTop: '1px solid #E8E4DC' }}>
                {[
                  { icon: <Shield size={13} />, text: '256-bit SSL encryption' },
                  { icon: <Truck size={13} />, text: 'Free shipping on all orders' },
                  { icon: <CheckCircle size={13} />, text: '100% quality guarantee' },
                ].map((g, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#555', fontSize: 12, fontWeight: 600, marginBottom: i < 2 ? 8 : 0 }}>
                    <span style={{ color: G }}>{g.icon}</span> {g.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 960px) {
          .checkout-grid { grid-template-columns: 1fr !important; }
          .checkout-summary { position: static !important; top: auto !important; width: 100% !important; order: -1; }
          .checkout-summary-card { width: 100% !important; }
          .checkout-payment-card { padding: 20px !important; }
        }
        @media (max-width: 680px) {
          .checkout-grid { gap: 20px !important; }
          .checkout-header-top { margin-bottom: 20px !important; }
        }
      `}</style>
    </div>
  );
}

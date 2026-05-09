import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { User, Package, FileText, Layout, MapPin, Settings, LogOut, ChevronLeft, X, Edit, Trash2, Plus, Bell, CheckCircle, Info, AlertCircle, Eye, RefreshCw } from 'lucide-react';
import api from '../services/api';
import Button from '../components/Button';

const G = '#1A4D2E';
const ACCENT = '#C8860A';
const BG = '#F5F2ED';

const STATUS_COLORS = {
  'Delivered': { bg: '#D1FAE5', text: '#065F46' },
  'Processing': { bg: '#DBEAFE', text: '#1E40AF' },
  'Shipped': { bg: '#FEF3C7', text: '#92400E' },
  'Cancelled': { bg: '#FEE2E2', text: '#991B1B' },
  'Quoted': { bg: '#D1FAE5', text: '#065F46' },
  'Reviewing': { bg: '#FEF3C7', text: '#92400E' },
  'New': { bg: '#DBEAFE', text: '#1E40AF' },
};

function Badge({ status }) {
  const s = STATUS_COLORS[status] || { bg: '#F3F4F6', text: '#374151' };
  return <span style={{ backgroundColor: s.bg, color: s.text, padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 700 }}>{status}</span>;
}

function Modal({ onClose, title, children }) {
  return (
    <>
      <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9000 }} onClick={onClose} />
      <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', backgroundColor: '#fff', borderRadius: 16, padding: 32, width: 'min(90vw,560px)', zIndex: 9001, maxHeight: '85vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontSize: 18, fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 700, color: '#1A1A1A' }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B' }}><X size={20} /></button>
        </div>
        {children}
      </div>
    </>
  );
}

// --- OVERVIEW TAB ---
function OverviewTab({ user, setTab, updateUser, showToast }) {
  const loyaltyPoints = user?.loyaltyPoints || 0;
  const TIERS = [
    { name: 'Bronze',   min: 0,    next: 'Silver',   max: 350  },
    { name: 'Silver',   min: 350,  next: 'Gold',      max: 750  },
    { name: 'Gold',     min: 750,  next: 'Platinum',  max: 1500 },
    { name: 'Platinum', min: 1500, next: 'Diamond',   max: 3000 },
    { name: 'Diamond',  min: 3000, next: null,        max: 3000 },
  ];
  const currentTier = [...TIERS].reverse().find(t => loyaltyPoints >= t.min) || TIERS[0];
  const { name: tier, next: nextTier, min: tierMin, max: tierMax } = currentTier;
  const needed = nextTier ? tierMax - loyaltyPoints : 0;
  const progress = nextTier ? Math.min(((loyaltyPoints - tierMin) / (tierMax - tierMin)) * 100, 100) : 100;



  const stats = [
    { label: 'Total Orders', value: user?.orders?.length || 0 },
    { label: 'Pending', value: user?.orders?.filter(o => o.status === 'Processing').length || 0 },
    { label: 'Saved Designs', value: user?.savedDesigns?.length || 0 },
    { label: 'Loyalty Points', value: loyaltyPoints },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <h2 style={{ fontSize: 22, fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 700, color: '#1A1A1A' }}>Account Overview</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 16, marginBottom: 28 }}>
        {stats.map((s, i) => (
          <div key={i} style={{ backgroundColor: BG, borderRadius: 12, padding: '18px 16px', border: '1px solid #E2DDD6' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{s.label}</p>
            <p style={{ fontSize: 28, fontFamily: '"DM Mono", monospace', fontWeight: 500, color: '#1A1A1A' }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div style={{ backgroundColor: '#fff', border: '1px solid #E2DDD6', borderRadius: 12, padding: '20px 24px', marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Loyalty Tier</p>
            <h3 style={{ fontSize: 20, fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 700, color: ACCENT }}>{tier} Member</h3>
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#1A1A1A' }}>{loyaltyPoints} pts</span>
        </div>
        <div style={{ height: 8, backgroundColor: '#E2DDD6', borderRadius: 8, overflow: 'hidden', marginBottom: 8 }}>
          <div style={{ height: '100%', width: `${Math.min(progress, 100)}%`, backgroundColor: ACCENT, borderRadius: 8, transition: 'width 1s ease' }} />
        </div>
        {nextTier && <p style={{ fontSize: 12, color: '#6B6B6B' }}>{needed} more points to reach {nextTier}</p>}
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <button onClick={() => setTab('orders')} style={{ padding: '10px 20px', backgroundColor: G, color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
          View Order History
        </button>
      </div>


    </div>
  );
}

// --- ORDERS TAB ---
function OrdersTab({ orders, loading }) {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const displayOrders = orders?.length ? orders.map(o => ({
    ...o,
    id: o.orderId || o.id,
    date: o.createdAt ? new Date(o.createdAt).toLocaleDateString() : o.date,
    product: o.items && o.items.length > 0 ? `${o.items[0].name}${o.items.length > 1 ? ` + ${o.items.length - 1} more` : ''}` : (o.product || 'Custom Order'),
    qty: o.items ? o.items.reduce((acc, item) => acc + (item.quantity || item.qty || 1), 0) : o.qty,
  })) : [];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#888' }}><RefreshCw size={24} style={{ animation: 'spin 1s linear infinite' }} /></div>;

  return (
    <div>
      <h2 style={{ fontSize: 22, fontFamily: '"Playfair Display", serif', fontWeight: 700, color: '#1A1A1A', marginBottom: 24 }}>My Orders</h2>
      {displayOrders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px', backgroundColor: BG, borderRadius: 12, border: '1px dashed #D0CAC0' }}>
          <Package size={48} style={{ color: '#D0CAC0', margin: '0 auto 12px' }} />
          <p style={{ color: '#6B6B6B' }}>No orders found. Place your first order to get started!</p>
        </div>
      ) : isMobile ? (
        /* ── Mobile Card Layout ── */
        <div style={{ display: 'grid', gap: 16 }}>
          {displayOrders.map((o, i) => (
            <div key={i} style={{ backgroundColor: '#fff', borderRadius: 12, padding: 16, border: '1px solid #E2DDD6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: G }}>{o.id}</p>
                <Badge status={o.status} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 13 }}>
                <p><strong>Product:</strong> {o.product}</p>
                <p><strong>Qty:</strong> {o.qty}</p>
                <p><strong>Date:</strong> {o.date}</p>
                <p><strong>Total:</strong> ${(+o.total).toFixed(2)}</p>
              </div>
              <button onClick={() => setSelectedOrder(o)} style={{ marginTop: 12, fontSize: 12, fontWeight: 700, color: G, background: 'none', border: `1px solid ${G}`, cursor: 'pointer', padding: '6px 12px', borderRadius: 6 }}>View Details</button>
            </div>
          ))}
        </div>
      ) : (
        /* ── Desktop Table Layout ── */
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #E2DDD6' }}>
                {['Order ID', 'Date', 'Product', 'Qty', 'Status', 'Total', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayOrders.map((o, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #F0EDE8' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = BG} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <td style={{ padding: '14px 12px', fontSize: 13, fontWeight: 700, color: G }}>{o.id}</td>
                  <td style={{ padding: '14px 12px', fontSize: 13, color: '#6B6B6B', whiteSpace: 'nowrap' }}>{o.date}</td>
                  <td style={{ padding: '14px 12px', fontSize: 13, color: '#1A1A1A' }}>{o.product}</td>
                  <td style={{ padding: '14px 12px', fontSize: 13, color: '#6B6B6B' }}>{o.qty}</td>
                  <td style={{ padding: '14px 12px' }}><Badge status={o.status} /></td>
                  <td style={{ padding: '14px 12px', fontSize: 13, fontWeight: 700 }}>${(+o.total).toFixed(2)}</td>
                  <td style={{ padding: '14px 12px' }}>
                    <button onClick={() => setSelectedOrder(o)} style={{ fontSize: 12, fontWeight: 700, color: G, background: 'none', cursor: 'pointer', padding: '6px 12px', borderRadius: 6, border: `1px solid ${G}` }}
                      onMouseEnter={e => { e.currentTarget.style.backgroundColor = G; e.currentTarget.style.color = '#fff'; }}
                      onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = G; }}>
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedOrder && (
        <Modal onClose={() => setSelectedOrder(null)} title={`Order ${selectedOrder.id}`}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { label: 'Product', value: selectedOrder.product },
                { label: 'Quantity', value: `${selectedOrder.qty} units` },
                { label: 'Order Date', value: selectedOrder.date },
                { label: 'Total', value: `$${(+selectedOrder.total).toFixed(2)}` },
                { label: 'Status', value: <Badge status={selectedOrder.status} /> },
                { label: 'Shipping Address', value: (() => {
                    const sa = selectedOrder.shippingAddress;
                    if (sa && (sa.line1 || sa.street)) {
                      return [sa.line1 || sa.street, sa.city, sa.state, sa.postal_code || sa.zip].filter(Boolean).join(', ');
                    }
                    return selectedOrder.address || selectedOrder.fullAddress || 'Not provided';
                  })() },
              ].map(({ label, value }, i) => (
                <div key={i} style={{ backgroundColor: BG, borderRadius: 8, padding: '12px 14px' }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: '#6B6B6B', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
                  <p style={{ fontSize: 14, color: '#1A1A1A', fontWeight: 600 }}>{value}</p>
                </div>
              ))}
            </div>
            {selectedOrder.tracking && (
              <div style={{ backgroundColor: '#D1FAE5', borderRadius: 8, padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: '#065F46', marginBottom: 2 }}>TRACKING NUMBER</p>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#1A1A1A' }}>{selectedOrder.tracking}</p>
                </div>
                <a href={`https://www.ups.com/track?tracknum=${selectedOrder.tracking}`} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: G, textDecoration: 'none' }}>
                  Track Package <ExternalLink size={14} />
                </a>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}

// --- QUOTES TAB ---
function QuotesTab({ quotes, loading }) {
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const displayQuotes = quotes?.length ? quotes.map(q => ({
    ...q,
    id: q.quoteId || q.id,
    date: q.createdAt ? new Date(q.createdAt).toLocaleDateString() : q.date,
  })) : [];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#888' }}><RefreshCw size={24} style={{ animation: 'spin 1s linear infinite' }} /></div>;

  return (
    <div>
      <h2 style={{ fontSize: 22, fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 700, color: '#1A1A1A', marginBottom: 24 }}>My Quotes</h2>
      {displayQuotes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px', backgroundColor: BG, borderRadius: 12, border: '1px dashed #D0CAC0' }}>
          <FileText size={48} style={{ color: '#D0CAC0', margin: '0 auto 12px' }} />
          <p style={{ color: '#6B6B6B' }}>No quotes yet. Request a custom quote from the contact page.</p>
        </div>
      ) : isMobile ? (
        <div style={{ display: 'grid', gap: 16 }}>
          {displayQuotes.map((q, i) => (
            <div key={i} style={{ backgroundColor: '#fff', borderRadius: 12, padding: 16, border: '1px solid #E2DDD6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: G }}>{q.id}</p>
                <Badge status={q.status} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 13 }}>
                <p><strong>Box Type:</strong> {q.boxType}</p>
                <p><strong>Qty:</strong> {q.qty}</p>
                <p><strong>Material:</strong> {q.material}</p>
                <p><strong>Date:</strong> {q.date}</p>
                <p style={{ gridColumn: 'span 2' }}><strong>Price:</strong> {q.quotedPrice || 'Pending'}</p>
              </div>
              <button onClick={() => setSelectedQuote(q)} style={{ marginTop: 12, fontSize: 12, fontWeight: 700, color: G, background: 'none', border: `1px solid ${G}`, cursor: 'pointer', padding: '6px 12px', borderRadius: 6 }}>View Details</button>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #E2DDD6' }}>
                {['Quote ID', 'Box Type', 'Qty', 'Material', 'Date', 'Status', 'Price', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayQuotes.map((q, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #F0EDE8' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = BG} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <td style={{ padding: '14px 12px', fontSize: 13, fontWeight: 700, color: G }}>{q.id}</td>
                  <td style={{ padding: '14px 12px', fontSize: 13, color: '#1A1A1A' }}>{q.boxType}</td>
                  <td style={{ padding: '14px 12px', fontSize: 13, color: '#6B6B6B' }}>{q.qty}</td>
                  <td style={{ padding: '14px 12px', fontSize: 13, color: '#6B6B6B' }}>{q.material}</td>
                  <td style={{ padding: '14px 12px', fontSize: 13, color: '#6B6B6B', whiteSpace: 'nowrap' }}>{q.date}</td>
                  <td style={{ padding: '14px 12px' }}><Badge status={q.status} /></td>
                  <td style={{ padding: '14px 12px', fontSize: 13, fontWeight: 700, color: q.quotedPrice ? G : '#6B6B6B' }}>{q.quotedPrice || 'Pending'}</td>
                  <td style={{ padding: '14px 12px' }}>
                    <button onClick={() => setSelectedQuote(q)} style={{ fontSize: 12, fontWeight: 700, color: G, background: 'none', border: `1px solid ${G}`, cursor: 'pointer', padding: '6px 12px', borderRadius: 6 }}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedQuote && (
        <Modal onClose={() => setSelectedQuote(null)} title={`Quote ${selectedQuote.id}`}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { label: 'Box Type', value: selectedQuote.boxType },
              { label: 'Quantity', value: `${selectedQuote.qty} units` },
              { label: 'Dimensions', value: selectedQuote.dims },
              { label: 'Material', value: selectedQuote.material },
              { label: 'Date Requested', value: selectedQuote.date },
              { label: 'Status', value: <Badge status={selectedQuote.status} /> },
              { label: 'Quoted Price', value: selectedQuote.quotedPrice || 'Quote in progress...' },
            ].map(({ label, value }, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #F0EDE8' }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#6B6B6B' }}>{label}</p>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#1A1A1A' }}>{value}</p>
              </div>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}

// --- DESIGNS TAB ---
function DesignsTab({ designs, saveDesign, deleteDesign, showToast, navigate }) {
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleDelete = async (d, idx) => {
    if (confirmDelete === idx) {
      try {
        if (d._id) {
          await deleteDesign(d._id);
        }
        showToast('Design deleted', 'info');
      } catch {
        showToast('Failed to delete design', 'error');
      }
      setConfirmDelete(null);
    } else {
      setConfirmDelete(idx);
      setTimeout(() => setConfirmDelete(null), 3000);
    }
  };

  const handleDuplicate = async (d) => {
    setSaving(true);
    try {
      // eslint-disable-next-line no-unused-vars
      const { _id, ...designData } = d;
      await saveDesign({ ...designData, name: `Copy of ${d.name || 'Design'}` });
      showToast('Design duplicated!', 'success');
    } catch {
      showToast('Failed to duplicate design', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 700, color: '#1A1A1A' }}>Saved Designs</h2>
        <button onClick={() => navigate('/custom-box')} style={{ padding: '9px 18px', backgroundColor: G, color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Plus size={15} /> Start New Design
        </button>
      </div>
      {designs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px', backgroundColor: BG, borderRadius: 12, border: '1px dashed #D0CAC0' }}>
          <Layout size={48} style={{ color: '#D0CAC0', margin: '0 auto 12px' }} />
          <p style={{ color: '#6B6B6B', marginBottom: 16 }}>No saved designs yet.</p>
          <button onClick={() => navigate('/custom-box')} style={{ padding: '10px 20px', backgroundColor: G, color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>Create Your First Design</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
          {designs.map((d, i) => (
            <div key={i} style={{ border: '1px solid #E2DDD6', borderRadius: 12, overflow: 'hidden', backgroundColor: '#fff' }}>
              <div style={{ height: 140, backgroundColor: BG, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {d.thumbnail ? (
                  <img src={d.thumbnail} alt={d.name || 'Design'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <Package size={48} style={{ color: '#D0CAC0' }} />
                )}
              </div>
              <div style={{ padding: '14px 14px' }}>
                <h4 style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: '#1A1A1A' }}>{d.name || 'Untitled Design'}</h4>
                <p style={{ fontSize: 12, color: '#6B6B6B', marginBottom: 4 }}>{d.boxType || d.style || 'Custom Box'}</p>
                {d.l && d.w && d.h && (
                  <p style={{ fontSize: 11, color: '#9A9080', marginBottom: 4 }}>
                    {d.l}×{d.w}×{d.h} {d.unit || 'in'} · {d.material || ''}
                  </p>
                )}
                {d.finish && (
                  <p style={{ fontSize: 11, color: ACCENT, marginBottom: 10, fontWeight: 600 }}>{d.finish}{d.addons?.length > 0 ? ` + ${d.addons.length} add-on${d.addons.length > 1 ? 's' : ''}` : ''}</p>
                )}
                {!d.l && <div style={{ marginBottom: 10 }} />}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
                  <button
                    onClick={() => navigate('/custom-box', { state: { ...d, _savedDesign: true } })}
                    style={{ padding: '7px 0', backgroundColor: G, color: '#fff', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
                  >Edit</button>
                  <button onClick={() => handleDuplicate(d)} style={{ padding: '7px 0', backgroundColor: 'transparent', border: '1px solid #D0CAC0', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3 }} disabled={saving}>
                    <Copy size={11} /> Copy
                  </button>
                  <button onClick={() => handleDelete(d, i)} style={{ padding: '7px 0', backgroundColor: confirmDelete === i ? '#DC2626' : 'transparent', color: confirmDelete === i ? '#fff' : '#DC2626', border: '1px solid #DC2626', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                    {confirmDelete === i ? 'Confirm' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// --- ADDRESSES TAB ---
const EMPTY_ADDR = { label: 'Home', name: '', street: '', city: '', state: '', zip: '', country: 'United States' };

function AddressesTab({ addresses, addAddress, updateAddress, deleteAddress, showToast }) {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null); // MongoDB _id of address being edited
  const [form, setForm] = useState(EMPTY_ADDR);
  const [errors, setErrors] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [saving, setSaving] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name required';
    if (!form.street.trim()) e.street = 'Street required';
    if (!form.city.trim()) e.city = 'City required';
    if (!form.state.trim()) e.state = 'State required';
    if (!form.zip.trim()) e.zip = 'ZIP required';
    return e;
  };

  const handleSave = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      if (editId) {
        await updateAddress(editId, form);
        showToast('Address updated!', 'success');
      } else {
        await addAddress({ ...form, isDefault: addresses.length === 0 });
        showToast('Address added!', 'success');
      }
      setShowForm(false); setEditId(null); setForm(EMPTY_ADDR); setErrors({});
    } catch {
      showToast('Failed to save address. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (address, idx) => {
    if (confirmDelete === idx) {
      try {
        if (address._id) await deleteAddress(address._id);
        showToast('Address removed', 'info');
      } catch {
        showToast('Failed to remove address', 'error');
      }
      setConfirmDelete(null);
    } else {
      setConfirmDelete(idx);
      setTimeout(() => setConfirmDelete(null), 3000);
    }
  };

  const handleSetDefault = async (address) => {
    try {
      if (address._id) await updateAddress(address._id, { ...address.toObject?.() ?? address, isDefault: true });
      showToast('Default address updated', 'success');
    } catch {
      showToast('Failed to update default', 'error');
    }
  };

  const handleEdit = (address, idx) => {
    setEditId(address._id || null);
    setForm({ label: address.label || 'Home', name: address.name || '', street: address.street || '', city: address.city || '', state: address.state || '', zip: address.zip || '', country: address.country || 'United States' });
    setErrors({});
    setShowForm(true);
  };

  const inp = { width: '100%', padding: '10px 12px', border: '1.5px solid #D0CAC0', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'Inter,sans-serif' };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 700, color: '#1A1A1A' }}>Saved Addresses</h2>
        <button onClick={() => { setShowForm(true); setEditId(null); setForm(EMPTY_ADDR); setErrors({}); }} style={{ padding: '9px 18px', backgroundColor: G, color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Plus size={15} /> Add Address
        </button>
      </div>

      {addresses.length === 0 && !showForm && (
        <div style={{ textAlign: 'center', padding: '48px', backgroundColor: BG, borderRadius: 12, border: '1px dashed #D0CAC0' }}>
          <MapPin size={48} style={{ color: '#D0CAC0', margin: '0 auto 12px' }} />
          <p style={{ color: '#6B6B6B' }}>No saved addresses yet.</p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: showForm ? 24 : 0 }}>
        {addresses.map((a, i) => (
          <div key={i} style={{ border: '1px solid #E2DDD6', borderRadius: 12, padding: '16px 18px', position: 'relative', backgroundColor: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ fontSize: 10, fontWeight: 700, backgroundColor: BG, color: '#6B6B6B', padding: '3px 10px', borderRadius: 100, textTransform: 'uppercase' }}>{a.label}</span>
                {a.isDefault && <span style={{ fontSize: 10, fontWeight: 700, backgroundColor: `${ACCENT}20`, color: ACCENT, padding: '3px 10px', borderRadius: 100 }}>Default</span>}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => handleEdit(a, i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B', padding: 4 }}><Edit size={14} /></button>
                <button onClick={() => handleDelete(a, i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: confirmDelete === i ? '#DC2626' : '#6B6B6B', padding: 4, fontWeight: confirmDelete === i ? 700 : 400, fontSize: confirmDelete === i ? 11 : undefined }}>
                  {confirmDelete === i ? 'Confirm?' : <Trash2 size={14} />}
                </button>
              </div>
            </div>
            <p style={{ fontWeight: 700, fontSize: 14, color: '#1A1A1A', marginBottom: 4 }}>{a.name}</p>
            <p style={{ fontSize: 13, color: '#6B6B6B', lineHeight: 1.6 }}>{a.street}<br />{a.city}, {a.state} {a.zip}<br />{a.country}</p>
            {!a.isDefault && (
              <button onClick={() => handleSetDefault(a)} style={{ marginTop: 10, fontSize: 11, fontWeight: 700, color: G, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                Set as Default
              </button>
            )}
          </div>
        ))}
      </div>

      {showForm && (
        <div style={{ backgroundColor: BG, borderRadius: 12, padding: '24px', border: '1px solid #E2DDD6' }}>
          <h3 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 700, fontSize: 16, color: '#1A1A1A', marginBottom: 16 }}>{editId ? 'Edit Address' : 'New Address'}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
            {[
              { key: 'label', label: 'Label', placeholder: 'Home, Work, etc.' },
              { key: 'name', label: 'Full Name *', placeholder: 'Jane Smith' },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#6B6B6B', display: 'block', marginBottom: 6 }}>{label}</label>
                <input style={{ ...inp, borderColor: errors[key] ? '#DC2626' : '#D0CAC0' }} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={placeholder} />
                {errors[key] && <p style={{ fontSize: 11, color: '#DC2626', marginTop: 3 }}>{errors[key]}</p>}
              </div>
            ))}
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: '#6B6B6B', display: 'block', marginBottom: 6 }}>Street Address *</label>
            <input style={{ ...inp, borderColor: errors.street ? '#DC2626' : '#D0CAC0' }} value={form.street} onChange={e => setForm(f => ({ ...f, street: e.target.value }))} placeholder="123 Main Street" />
            {errors.street && <p style={{ fontSize: 11, color: '#DC2626', marginTop: 3 }}>{errors.street}</p>}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 20 }}>
            {[
              { key: 'city', label: 'City *', placeholder: 'Chicago' },
              { key: 'state', label: 'State *', placeholder: 'IL' },
              { key: 'zip', label: 'ZIP *', placeholder: '60601' },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#6B6B6B', display: 'block', marginBottom: 6 }}>{label}</label>
                <input style={{ ...inp, borderColor: errors[key] ? '#DC2626' : '#D0CAC0' }} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={placeholder} />
                {errors[key] && <p style={{ fontSize: 11, color: '#DC2626', marginTop: 3 }}>{errors[key]}</p>}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={handleSave} disabled={saving} style={{ padding: '10px 24px', backgroundColor: G, color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>{saving ? 'Saving...' : 'Save Address'}</button>
            <button onClick={() => { setShowForm(false); setEditId(null); setErrors({}); }} style={{ padding: '10px 24px', border: '1.5px solid #D0CAC0', borderRadius: 8, fontWeight: 700, cursor: 'pointer', background: 'none' }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

// --- SETTINGS TAB ---
//// ── Password Strength Helper ───────────────────────────────────────────────
const getStrength = (pw) => {
  if (!pw) return null;
  if (pw.length < 6) return { label: 'Too short', color: '#E24B4A', width: '20%' };
  if (pw.length < 8 || !/[0-9]/.test(pw)) return { label: 'Weak', color: '#EF9F27', width: '40%' };
  if (!/[A-Z]/.test(pw) || !/[^a-zA-Z0-9]/.test(pw)) return { label: 'Medium', color: '#EF9F27', width: '65%' };
  return { label: 'Strong', color: '#639922', width: '100%' };
};

function PasswordStrengthBar({ password }) {
  const strength = getStrength(password);
  if (!strength) return null;
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ height: 4, width: '100%', backgroundColor: '#E2DDD6', borderRadius: 2, overflow: 'hidden', marginBottom: 4 }}>
        <div style={{ height: '100%', width: strength.width, backgroundColor: strength.color, transition: 'width 0.3s ease' }} />
      </div>
      <p style={{ fontSize: 11, fontWeight: 700, color: strength.color, margin: 0 }}>{strength.label}</p>
    </div>
  );
}

// ── Phone Validation Helper ────────────────────────────────────────────────
const validatePhone = (v) => /^\+?[\d\s\-().]{7,15}$/.test(v);

function SettingsTab({ user, updateUser, showToast, logout }) {
  const navigate = useNavigate();
  const [info, setInfo] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [phoneErr, setPhoneErr] = useState('');
  const [pwd, setPwd] = useState({ current: '', newPwd: '', confirm: '' });
  const [pwdErr, setPwdErr] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [notifs, setNotifs] = useState({
    orders: user?.notifications?.orders ?? true,
    quotes: user?.notifications?.quotes ?? true,
    designs: user?.notifications?.designs ?? true,
  });

  useEffect(() => {
    if (user?.notifications) {
      setNotifs({
        orders: user.notifications.orders ?? true,
        quotes: user.notifications.quotes ?? true,
        designs: user.notifications.designs ?? true,
      });
    }
  }, [user]);

  const handleSaveInfo = async () => {
    if (info.phone && !validatePhone(info.phone)) {
      setPhoneErr('Invalid phone number. Use 7–15 digits.');
      return;
    }
    setPhoneErr('');
    setSaving(true);
    try {
      await updateUser(info);
      showToast('Profile updated!', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to save', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!pwd.current) { setPwdErr('Enter your current password'); return; }
    if (pwd.newPwd.length < 6) { setPwdErr('Password must be at least 6 characters'); return; }
    if (pwd.newPwd !== pwd.confirm) { setPwdErr('Passwords do not match'); return; }
    const strength = getStrength(pwd.newPwd);
    if (!strength || strength.label === 'Too short' || strength.label === 'Weak') {
      setPwdErr('Password is too weak — add uppercase, numbers or symbols');
      return;
    }
    setPwdErr('');
    try {
      await api.put('/users/password', { currentPassword: pwd.current, newPassword: pwd.newPwd });
      showToast('Password updated successfully!', 'success');
      setPwd({ current: '', newPwd: '', confirm: '' });
    } catch (err) {
      setPwdErr(err.message || 'Current password is incorrect');
    }
  };

  const handleToggleNotif = async (key) => {
    const updated = { ...notifs, [key]: !notifs[key] };
    setNotifs(updated);
    await updateUser({ notifications: updated });
    showToast('Notification preferences saved.', 'success');
  };

  const confirmDeleteAccount = async () => {
    setDeleteConfirmOpen(false);
    try {
      // Revoke Google token if exists
      const googleToken = localStorage.getItem('google_token');
      if (googleToken) {
        await fetch(`https://accounts.google.com/o/oauth2/revoke?token=${googleToken}`).catch(() => {});
      }
      // Delete account on backend
      await api.delete('/users/account');
    } catch (e) { /* proceed anyway */ }
    logout();
    localStorage.clear();
    sessionStorage.clear();
    // Force Google to show account picker on next login
    document.cookie.split(';').forEach(c => {
      document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
    });
    navigate('/');
  };

  const inp = { width: '100%', padding: '10px 12px', border: '1.5px solid #D0CAC0', borderRadius: 8, fontSize: 14, fontFamily: '"DM Sans", sans-serif', outline: 'none', boxSizing: 'border-box', backgroundColor: BG };
  const section = { backgroundColor: '#fff', borderRadius: 12, padding: '24px', marginBottom: 20, border: '1px solid #E2DDD6' };

  if (!user) return <div style={{ padding: 24 }}>Loading settings...</div>;

  return (
    <div style={{ maxWidth: 560 }}>
      <h2 style={{ fontSize: 22, fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 700, color: '#1A1A1A', marginBottom: 24 }}>Account Settings</h2>

      {/* Personal Information */}
      <div style={section}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1A1A1A', marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid #F0EDE8' }}>Personal Information</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#6B6B6B', display: 'block', marginBottom: 6 }}>Full Name</label>
            <input style={inp} value={info.name} onChange={e => setInfo(f => ({ ...f, name: e.target.value }))}
              onFocus={e => e.target.style.borderColor = G} onBlur={e => e.target.style.borderColor = '#D0CAC0'} />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#6B6B6B', display: 'block', marginBottom: 6 }}>Email (cannot change)</label>
            <input style={{ ...inp, opacity: 0.6, cursor: 'not-allowed' }} value={user?.email || ''} disabled />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#6B6B6B', display: 'block', marginBottom: 6 }}>Phone Number</label>
            <input style={{ ...inp, borderColor: phoneErr ? '#EF4444' : '#D0CAC0' }}
              value={info.phone}
              onChange={e => { setInfo(f => ({ ...f, phone: e.target.value })); setPhoneErr(''); }}
              onFocus={e => e.target.style.borderColor = G}
              onBlur={e => { e.target.style.borderColor = phoneErr ? '#EF4444' : '#D0CAC0'; if (info.phone && !validatePhone(info.phone)) setPhoneErr('Enter a valid phone number (7–15 digits)'); }}
              placeholder="+1 (555) 000-0000" />
            {phoneErr && <p style={{ fontSize: 11, color: '#EF4444', marginTop: 4 }}>{phoneErr}</p>}
          </div>
          <Button 
            onClick={handleSaveInfo} 
            loading={saving}
            style={{ alignSelf: 'flex-start' }}
          >
            {saving ? 'Saving…' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Security & Password */}
      <div style={section}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid #F0EDE8' }}>
          <Lock size={18} color={G} />
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1A1A1A', margin: 0 }}>Security & Password</h3>
        </div>
        <p style={{ fontSize: 13, color: '#6B6B6B', marginBottom: 20 }}>
          Use a strong, unique password with uppercase, numbers and symbols.
        </p>
        {pwdErr && <p style={{ fontSize: 12, color: '#DC2626', marginBottom: 16, padding: '10px 14px', backgroundColor: '#FEE2E2', borderRadius: 8, border: '1px solid #FECACA' }}>{pwdErr}</p>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#6B6B6B', display: 'block', marginBottom: 6 }}>Current Password</label>
            <input type="password" style={inp} placeholder="••••••••" value={pwd.current}
              onChange={e => setPwd(f => ({ ...f, current: e.target.value }))}
              onFocus={e => e.target.style.borderColor = G} onBlur={e => e.target.style.borderColor = '#D0CAC0'} />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#6B6B6B', display: 'block', marginBottom: 6 }}>New Password</label>
            <input type="password" style={inp} placeholder="Min. 8 characters" value={pwd.newPwd}
              onChange={e => setPwd(f => ({ ...f, newPwd: e.target.value }))}
              onFocus={e => e.target.style.borderColor = G} onBlur={e => e.target.style.borderColor = '#D0CAC0'} />
            <PasswordStrengthBar password={pwd.newPwd} />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#6B6B6B', display: 'block', marginBottom: 6 }}>Confirm New Password</label>
            <input type="password" style={{ ...inp, borderColor: pwd.confirm && pwd.confirm !== pwd.newPwd ? '#EF4444' : '#D0CAC0' }}
              placeholder="Repeat new password" value={pwd.confirm}
              onChange={e => setPwd(f => ({ ...f, confirm: e.target.value }))}
              onFocus={e => e.target.style.borderColor = G} onBlur={e => e.target.style.borderColor = '#D0CAC0'} />
            {pwd.confirm && pwd.confirm !== pwd.newPwd && <p style={{ fontSize: 11, color: '#EF4444', marginTop: 4 }}>Passwords do not match</p>}
          </div>
          <Button 
            onClick={handleUpdatePassword}
            loading={saving}
          >
            {saving ? 'Updating...' : 'Update Password'}
          </Button>
        </div>
      </div>

      {/* Notifications */}
      <div style={section}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1A1A1A', marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid #F0EDE8' }}>Notifications</h3>
        {[
          { key: 'orders', label: 'Order Updates', desc: 'Get notified when your order status changes' },
          { key: 'quotes', label: 'Quote Updates', desc: 'Receive updates on your custom quotes' },
          { key: 'designs', label: 'Design Reminders', desc: 'Reminders for saved designs and customizations' },
        ].map(({ key, label, desc }) => (
          <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #F0EDE8' }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A', marginBottom: 2 }}>{label}</p>
              <p style={{ fontSize: 12, color: '#6B6B6B' }}>{desc}</p>
            </div>
            <button onClick={() => handleToggleNotif(key)} style={{ width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer', backgroundColor: notifs[key] ? G : '#D0CAC0', position: 'relative', transition: 'background 0.2s' }}>
              <span style={{ position: 'absolute', top: 2, left: notifs[key] ? 22 : 2, width: 20, height: 20, borderRadius: '50%', backgroundColor: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
            </button>
          </div>
        ))}
      </div>

      {/* Danger Zone */}
      <div style={{ ...section, borderColor: '#FECACA' }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#DC2626', marginBottom: 8 }}>Danger Zone</h3>
        <p style={{ fontSize: 13, color: '#6B6B6B', marginBottom: 16 }}>Once you delete your account, there is no going back. All your data will be permanently removed.</p>
        <button onClick={() => setDeleteConfirmOpen(true)} style={{ padding: '10px 20px', border: '1.5px solid #DC2626', color: '#DC2626', backgroundColor: 'transparent', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>
          Delete My Account
        </button>
      </div>

      {deleteConfirmOpen && (
        <Modal title="Delete Account" onClose={() => setDeleteConfirmOpen(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ padding: '14px', backgroundColor: '#FEF2F2', borderRadius: 8, border: '1px solid #FECACA' }}>
              <p style={{ fontSize: 14, color: '#DC2626', fontWeight: 700, marginBottom: 4 }}>⚠️ This action is permanent</p>
              <p style={{ fontSize: 13, color: '#991B1B' }}>Your account, orders, quotes and all data will be deleted immediately. This cannot be undone.</p>
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button onClick={() => setDeleteConfirmOpen(false)} style={{ padding: '10px 18px', backgroundColor: '#F3F4F6', border: '1px solid #D0CAC0', borderRadius: 8, color: '#374151', cursor: 'pointer' }}>Cancel</button>
              <button onClick={confirmDeleteAccount} style={{ padding: '10px 18px', backgroundColor: '#DC2626', border: 'none', borderRadius: 8, color: '#fff', cursor: 'pointer', fontWeight: 700 }}>Yes, Delete Forever</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// --- NOTIFICATIONS TAB ---
function NotificationsTab() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchNotifications = async () => {
    try {
      const data = await api.get('/notifications');
      setNotifications(data.notifications || []);
    } catch (e) {
      showToast('Failed to load notifications', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (e) { showToast('Failed to mark as read', 'error'); }
  };

  const handleDismiss = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n._id !== id));
      showToast('Notification dismissed', 'success');
    } catch (e) { showToast('Failed to dismiss notification', 'error'); }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      showToast('All marked as read', 'success');
    } catch (e) { showToast('Action failed', 'error'); }
  };

  const handleClearAll = async () => {
    try {
      await api.delete('/notifications/all');
      setNotifications([]);
      showToast('All notifications cleared', 'success');
    } catch (e) { showToast('Action failed', 'error'); }
  };

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}><Bell size={32} style={{ color: '#ccc', animation: 'pulse 2s infinite' }} /></div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <h2 style={{ fontSize: 22, fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 700, color: '#1A1A1A' }}>Notifications</h2>
        <div style={{ display: 'flex', gap: 16 }}>
          {notifications.some(n => !n.isRead) && (
            <button onClick={handleMarkAllRead} style={{ background: 'none', border: 'none', color: G, fontWeight: 700, fontSize: 13, cursor: 'pointer', textDecoration: 'underline' }}>
              Mark all as read
            </button>
          )}
          {notifications.length > 0 && (
            <button onClick={handleClearAll} style={{ background: 'none', border: 'none', color: '#DC2626', fontWeight: 700, fontSize: 13, cursor: 'pointer', textDecoration: 'underline' }}>
              Clear All
            </button>
          )}
        </div>
      </div>

      {notifications.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', padding: '60px 24px', backgroundColor: BG, borderRadius: 16, border: '1px dashed #D0CAC0' }}>
          <Bell size={48} style={{ color: '#D0CAC0', marginBottom: 16 }} />
          <p style={{ fontSize: 16, fontWeight: 600, color: '#1A1A1A', marginBottom: 4 }}>All caught up!</p>
          <p style={{ fontSize: 13, color: '#6B6B6B' }}>You don't have any notifications at the moment.</p>
        </motion.div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <AnimatePresence initial={false}>
            {notifications.map((n) => (
              <motion.div 
                key={n._id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10, transition: { duration: 0.2 } }}
                style={{ 
                  padding: '16px 20px', 
                  borderRadius: 12, 
                  border: '1px solid #E2DDD6', 
                  backgroundColor: n.isRead ? '#fff' : 'rgba(26, 77, 46, 0.03)',
                  display: 'flex',
                  gap: 16,
                  transition: 'all 0.2s',
                  position: 'relative'
                }}
              >
                <div style={{ 
                  width: 40, height: 40, borderRadius: 10, 
                  backgroundColor: n.isRead ? '#f3f4f6' : `${G}15`, 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 
                }}>
                  {n.type === 'order_status' && <Package size={18} color={n.isRead ? '#888' : G} />}
                  {n.type === 'quote_update' && <FileText size={18} color={n.isRead ? '#888' : G} />}
                  {n.type === 'message_reply' && <Info size={18} color={n.isRead ? '#888' : G} />}
                  {n.type === 'system' && <Bell size={18} color={n.isRead ? '#888' : G} />}
                </div>
                <div style={{ flex: 1, pr: 30 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                    <h4 style={{ fontSize: 14, fontWeight: 700, color: '#1A1A1A', margin: 0 }}>{n.title}</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: 11, color: '#888' }}>{new Date(n.createdAt).toLocaleDateString()}</span>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDismiss(n._id); }} 
                        style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', fontSize: 18, padding: '0 4px', lineHeight: 1, transition: 'color 0.2s' }}
                        onMouseEnter={e => e.target.style.color = '#DC2626'}
                        onMouseLeave={e => e.target.style.color = '#9CA3AF'}
                      >
                        &times;
                      </button>
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: '#4B5563', margin: '0 0 12px', lineHeight: 1.5 }}>{n.message}</p>
                  <div style={{ display: 'flex', gap: 12 }}>
                    {n.link && (
                      <Link to={n.link} style={{ fontSize: 12, fontWeight: 700, color: G, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Eye size={12} /> View Details
                      </Link>
                    )}
                    {!n.isRead && (
                      <button onClick={() => handleMarkRead(n._id)} style={{ background: 'none', border: 'none', color: '#6B7280', fontSize: 12, fontWeight: 600, cursor: 'pointer', padding: 0 }}>
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => handleDismiss(n._id)}
                  style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: '#D1D5DB', cursor: 'pointer', padding: 4, borderRadius: 6, transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#EF4444'; e.currentTarget.style.backgroundColor = '#FEE2E2'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#D1D5DB'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <Trash2 size={14} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

// --- MAIN PROFILE ---
const TABS = [
  { id: 'overview', label: 'Overview', icon: User },
  { id: 'orders', label: 'My Orders', icon: Package },
  { id: 'quotes', label: 'My Quotes', icon: FileText },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'designs', label: 'Saved Designs', icon: Layout },
  { id: 'addresses', label: 'Addresses', icon: MapPin },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Profile() {
  const { user, logout, updateUser, addAddress, updateAddress, deleteAddress, saveDesign, deleteDesign } = useAuth();
  const { showToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState(() => location.state?.tab || 'overview');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [quotesLoading, setQuotesLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await api.get('/users/orders');
        setOrders(Array.isArray(data) ? data : (data.orders || []));
      } catch (e) { console.error('Orders fetch err:', e); }
      finally { setOrdersLoading(false); }
    };
    const fetchQuotes = async () => {
      try {
        const data = await api.get('/users/quotes');
        setQuotes(Array.isArray(data) ? data : (data.quotes || []));
      } catch (e) { console.error('Quotes fetch err:', e); }
      finally { setQuotesLoading(false); }
    };
    fetchOrders();
    fetchQuotes();
  }, []);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const handleLogout = () => { logout(); showToast('Logged out', 'success'); navigate('/'); };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => { updateUser({ avatar: reader.result }); showToast('Photo updated!', 'success'); };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: BG, paddingTop: 100, paddingBottom: 64 }}>
      <div style={{ maxWidth: 1300, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start', flexDirection: isMobile ? 'column' : 'row' }}>

          {/* Sidebar */}
          <div style={{ width: isMobile ? '100%' : 240, flexShrink: 0, backgroundColor: '#fff', borderRadius: 14, border: '1px solid #E2DDD6', padding: 16, position: isMobile ? 'static' : 'sticky', top: 120 }}>
            {/* Avatar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 4px', borderBottom: '1px solid #F0EDE8', marginBottom: 12 }}>
              <div style={{ position: 'relative', width: 48, height: 48, cursor: 'pointer' }} onClick={() => fileInputRef.current.click()}>
                {user?.avatar ? (
                  <img src={user.avatar} alt="Avatar" style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: G, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700 }}>
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                )}
                <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '1'} onMouseLeave={e => e.currentTarget.style.opacity = '0'}>
                  <Camera size={16} color="#fff" />
                </div>
              </div>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarUpload} style={{ display: 'none' }} />
              <div style={{ overflow: 'hidden' }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#1A1A1A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</p>
                <p style={{ fontSize: 11, color: '#6B6B6B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</p>
              </div>
            </div>

            {isMobile && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <button type="button" onClick={() => setMobileNavOpen(true)} style={{ width: 36, height: 36, borderRadius: 12, border: '1px solid #E2DDD6', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <Menu size={18} />
                </button>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#1A1A1A' }}>Profile Menu</span>
              </div>
            )}
            {!isMobile && (
              <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {TABS.map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: 13, fontWeight: activeTab === tab.id ? 700 : 500, backgroundColor: activeTab === tab.id ? `${G}0D` : 'transparent', color: activeTab === tab.id ? G : '#4A4A4A', transition: 'all 0.15s' }}>
                    <tab.icon size={16} style={{ color: activeTab === tab.id ? G : '#6B6B6B' }} />
                    {tab.label}
                  </button>
                ))}
                <div style={{ height: 1, backgroundColor: '#F0EDE8', margin: '8px 0' }} />
                <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: 13, fontWeight: 500, backgroundColor: 'transparent', color: '#DC2626', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#FEE2E2'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <LogOut size={16} /> Logout
                </button>
              </nav>
            )}
            {isMobile && (
              <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, width: '100%', marginTop: 12, padding: '10px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', backgroundColor: '#fff', color: '#DC2626', transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#FEE2E2'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                <LogOut size={16} /> Logout
              </button>
            )}
          </div>

          {isMobile && mobileNavOpen && (
            <>
              <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)', zIndex: 10000 }} onClick={() => setMobileNavOpen(false)} />
              <div style={{ position: 'fixed', top: 0, left: 0, width: '85vw', maxWidth: 320, height: '100%', backgroundColor: '#fff', zIndex: 10001, padding: 24, boxShadow: '2px 0 24px rgba(0,0,0,0.18)', overflowY: 'auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <ChevronLeft size={18} />
                    <span style={{ fontSize: 15, fontWeight: 700, color: '#1A1A1A' }}>Navigate</span>
                  </div>
                  <button type="button" onClick={() => setMobileNavOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B' }}><X size={20} /></button>
                </div>
                <nav style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {TABS.map(tab => (
                    <button key={tab.id} onClick={() => { setActiveTab(tab.id); setMobileNavOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 12, border: '1px solid #E2DDD6', backgroundColor: activeTab === tab.id ? G : '#fff', color: activeTab === tab.id ? '#fff' : '#4A4A4A', fontWeight: 700, cursor: 'pointer', textAlign: 'left' }}>
                      <tab.icon size={16} />
                      {tab.label}
                    </button>
                  ))}
                </nav>
                <button onClick={() => { setMobileNavOpen(false); handleLogout(); }} style={{ marginTop: 24, width: '100%', padding: '12px 16px', backgroundColor: '#fff', border: '1px solid #FECACA', color: '#DC2626', borderRadius: 12, fontWeight: 700, cursor: 'pointer' }}>
                  Logout
                </button>
              </div>
            </>
          )}

          {/* Main Content */}
          <div style={{ flex: 1, minWidth: 0, backgroundColor: '#fff', borderRadius: 14, border: '1px solid #E2DDD6', padding: isMobile ? '24px 16px' : '32px', minHeight: 600 }}>
            {activeTab === 'overview' && <OverviewTab user={{ ...user, orders, quotes }} setTab={setActiveTab} updateUser={updateUser} showToast={showToast} />}
            {activeTab === 'orders' && <OrdersTab orders={orders} loading={ordersLoading} />}
            {activeTab === 'quotes' && <QuotesTab quotes={quotes} loading={quotesLoading} />}
            {activeTab === 'notifications' && <NotificationsTab />}
            {activeTab === 'designs' && <DesignsTab designs={user?.savedDesigns || []} saveDesign={saveDesign} deleteDesign={deleteDesign} showToast={showToast} navigate={navigate} />}
            {activeTab === 'addresses' && <AddressesTab addresses={user?.addresses || []} addAddress={addAddress} updateAddress={updateAddress} deleteAddress={deleteAddress} showToast={showToast} />}
            {activeTab === 'settings' && <SettingsTab user={user} updateUser={updateUser} showToast={showToast} logout={logout} />}
          </div>

        </div>
      </div>
    </div>
  );
}

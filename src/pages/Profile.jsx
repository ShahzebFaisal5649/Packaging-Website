import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { User, Package, FileText, Layout, MapPin, Settings, LogOut, ChevronLeft, X, Edit, Trash2, Plus, Bell, CheckCircle, Info, AlertCircle, Eye, RefreshCw, Lock, Camera, Copy, ExternalLink, Menu, Ruler, Search } from 'lucide-react';
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
function OverviewTab({ user, setTab, updateUser, showToast, isMobile }) {
  const loyaltyPoints = user?.loyaltyPoints || 0;
  const TIERS = [
    { name: 'Bronze',   threshold: 0,    bonus: 'Welcome' },
    { name: 'Silver',   threshold: 350,  bonus: '10 free boxes' },
    { name: 'Gold',     threshold: 750,  bonus: '20 free boxes' },
    { name: 'Platinum', threshold: 1500, bonus: '30 free boxes' },
    { name: 'Diamond',  threshold: 3000, bonus: '50 free boxes' },
  ];
  const currentTierIndex = [...TIERS].reverse().findIndex(t => loyaltyPoints >= t.threshold);
  const tierIndex = currentTierIndex === -1 ? 0 : TIERS.length - 1 - currentTierIndex;
  const currentTier = TIERS[tierIndex];
  const nextTier = TIERS[tierIndex + 1];
  
  const { name: tier } = currentTier;
  const needed = nextTier ? nextTier.threshold - loyaltyPoints : 0;
  const progress = nextTier ? Math.min((loyaltyPoints / nextTier.threshold) * 100, 100) : 100;

  const stats = [
    { label: 'Total Orders', value: user?.orders?.length || 0 },
    { label: 'Pending', value: user?.orders?.filter(o => o.status === 'Processing')?.length || 0 },
    { label: 'Saved Designs', value: user?.savedDesigns?.length || 0 },
    { label: 'Loyalty Points', value: loyaltyPoints },
  ];

  return (
    <div>
      <h2 style={{ fontSize: 22, fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 700, color: '#1A1A1A', marginBottom: 24 }}>
        Account Overview
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '260px 1fr',
        gap: 24,
        alignItems: 'start'
      }}>

        {/* LEFT COLUMN — Identity card */}
        <div style={{ background: '#fff', borderRadius: 16, padding: 28, border: '1px solid #E2DDD6', textAlign: 'center' }}>
          {/* Avatar */}
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: G, color: '#fff',
            fontSize: 32, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 14px'
          }}>
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>

          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1A1A1A', marginBottom: 4 }}>{user?.name || 'User'}</h3>
          <p style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>{user?.email}</p>

          {/* Tier badge */}
          <span style={{
            display: 'inline-block',
            fontSize: 12, fontWeight: 700,
            background: ACCENT + '22', color: ACCENT,
            padding: '4px 14px', borderRadius: 100, marginBottom: 14
          }}>
            {tier} Member
          </span>

          {/* Loyalty progress bar */}
          <div style={{ height: 6, background: '#E2DDD6', borderRadius: 6, overflow: 'hidden', marginBottom: 6 }}>
            <div style={{
              height: '100%',
              width: `${Math.min(progress, 100)}%`,
              background: ACCENT,
              borderRadius: 6,
              transition: 'width 1s ease'
            }} />
          </div>
          <p style={{ fontSize: 11, color: '#888', marginBottom: 14 }}>
            {loyaltyPoints} pts
            {nextTier ? ` · ${needed} more to ${nextTier.name}` : ' · Maximum tier reached'}
          </p>

          {/* Member since */}
          <p style={{ fontSize: 11, color: '#aaa', marginBottom: 20 }}>
            Member since {user?.createdAt
              ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
              : 'N/A'}
          </p>

          {/* Action buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button
              onClick={() => setTab('orders')}
              style={{ padding: '10px 0', background: G, color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer', width: '100%' }}
            >
              View Order History
            </button>
            <button
              onClick={() => setTab('settings')}
              style={{ padding: '10px 0', background: '#fff', color: G, border: `1.5px solid ${G}`, borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer', width: '100%' }}
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN — Stats + recent orders */}
        <div>
          {/* Stat cards row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
            gap: 12,
            marginBottom: 20
          }}>
            {stats.map((s, i) => (
              <div key={i} style={{
                background: '#fff', borderRadius: 12,
                padding: '16px 14px', border: '1px solid #E2DDD6', textAlign: 'center'
              }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{s.label}</p>
                <p style={{ fontSize: 26, fontWeight: 700, color: '#1A1A1A', fontFamily: '"DM Mono", monospace', margin: 0 }}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Recent orders */}
          <div style={{ background: '#fff', borderRadius: 12, padding: '20px 20px', border: '1px solid #E2DDD6' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid #F0EDE8' }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1A1A1A', margin: 0 }}>Recent Orders</h3>
              <button onClick={() => setTab('orders')} style={{ fontSize: 12, color: ACCENT, fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}>
                View All
              </button>
            </div>
            {(user?.orders || []).length === 0 ? (
              <p style={{ fontSize: 13, color: '#888', textAlign: 'center', padding: '20px 0' }}>No orders yet</p>
            ) : (
              (user?.orders || []).slice(0, 3).map((o, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: (user.orders.slice(0, 3).length > 1 && i < user.orders.slice(0, 3).length - 1) ? '1px solid #F5F2ED' : 'none' }}>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A', margin: 0 }}>{o.orderId || o.product || 'Order'}</p>
                    <p style={{ fontSize: 11, color: '#888', margin: '2px 0 0' }}>
                      {o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                    </p>
                  </div>
                  <Badge status={o.status || 'Processing'} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- ORDERS TAB ---
function OrdersTab({ orders, loading }) {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  const displayOrders = orders?.length ? orders.map(o => ({
    ...o,
    id: o.orderId || o.id,
    date: o.createdAt ? new Date(o.createdAt).toLocaleDateString() : o.date,
    product: o.items && o.items.length > 0 ? `${o.items[0].name}${o.items.length > 1 ? ` + ${o.items.length - 1} more` : ''}` : (o.product || 'Custom Order'),
    qty: o.items ? o.items.reduce((acc, item) => acc + (item.quantity || item.qty || 1), 0) : o.qty,
  })) : [];

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
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
  const [isMobile, setIsMobile] = useState(false);

  const displayQuotes = quotes?.length ? quotes.map(q => ({
    ...q,
    id: q.quoteId || q.id,
    date: q.createdAt ? new Date(q.createdAt).toLocaleDateString() : q.date,
  })) : [];

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#888' }}><RefreshCw size={24} style={{ animation: 'spin 1s linear infinite' }} /></div>;

  return (
    <div>
      <h2 style={{ fontSize: 22, fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 700, color: '#1A1A1A', marginBottom: 24 }}>My Sample Quotes</h2>
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
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '1.25rem',
          marginTop: '1rem'
        }}>
          {designs.map((design, i) => (
            <div key={design._id || i} style={{
              background: '#fff',
              borderRadius: 12,
              border: '1px solid #e8e3da',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              transition: 'box-shadow 0.2s',
              cursor: 'pointer'
            }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'}
            >
              {/* Preview thumbnail area */}
              <div style={{ background: '#F5F2ED', height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {design.thumbnail ? (
                  <img src={design.thumbnail} alt={design.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ fontSize: 48 }}>📦</div>
                )}
              </div>
              {/* Card body */}
              <div style={{ padding: '1rem' }}>
                <div style={{ fontWeight: 600, fontSize: 15, color: '#1A4D2E', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {design.name || 'Untitled Design'}
                </div>
                <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>
                  {design.boxType || design.style || 'Custom Box'} · {design.material || 'Standard'}
                </div>
                <div style={{ fontSize: 12, color: '#666', marginBottom: 12 }}>
                  {design.l || design.dimensions?.length}×{design.w || design.dimensions?.width}×{design.h || design.dimensions?.height} {design.unit || 'cm'} &nbsp;·&nbsp; Qty: {design.quantity || 100}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => navigate('/custom-box', { state: { ...design, _savedDesign: true } })} style={{
                    flex: 1, padding: '7px 0', background: '#1A4D2E', color: '#fff',
                    border: 'none', borderRadius: 7, fontSize: 13, cursor: 'pointer', fontWeight: 500
                  }}>Restore</button>
                  <button onClick={() => handleDelete(design, i)} style={{
                    padding: '7px 12px', background: '#fff', color: '#E24B4A',
                    border: confirmDelete === i ? 'none' : '1px solid #E24B4A', 
                    backgroundColor: confirmDelete === i ? '#E24B4A' : '#fff',
                    color: confirmDelete === i ? '#fff' : '#E24B4A',
                    borderRadius: 7, fontSize: 13, cursor: 'pointer'
                  }}>{confirmDelete === i ? 'Confirm' : 'Delete'}</button>
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
  const [pwdSaving, setPwdSaving] = useState(false);
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
    setPwdSaving(true);
    try {
      await api.put('/users/password', { currentPassword: pwd.current, newPassword: pwd.newPwd });
      showToast('Password updated successfully!', 'success');
      setPwd({ current: '', newPwd: '', confirm: '' });
    } catch (err) {
      setPwdErr(err.message || 'Current password is incorrect');
    } finally {
      setPwdSaving(false);
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
            loading={pwdSaving}
            style={{ alignSelf: 'flex-start' }}
          >
            {pwdSaving ? 'Updating…' : 'Update Password'}
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
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 5; // Smaller limit for profile notifications
  const { showToast } = useToast();

  useEffect(() => {
    let cancelled = false;
    api.get('/notifications')
      .then(data => { if (!cancelled) setNotifications(data.notifications || []); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const handleMarkAllRead = async () => {
    await api.put('/notifications/read-all').catch(() => {});
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleClearAll = async () => {
    await api.delete('/notifications/all').catch(() => {});
    setNotifications([]);
    showToast('All notifications cleared.', 'success');
  };

  const handleDismiss = async (id) => {
    await api.delete(`/notifications/${id}`).catch(() => {});
    setNotifications(prev => prev.filter(n => n._id !== id));
  };

  const handleMarkRead = async (id) => {
    await api.put(`/notifications/${id}/read`).catch(() => {});
    setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
  };

  const filtered = notifications.filter(n => 
    !search || 
    (n.title || '').toLowerCase().includes(search.toLowerCase()) || 
    (n.message || '').toLowerCase().includes(search.toLowerCase())
  );

  const paginated = filtered.slice((page - 1) * limit, page * limit);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ fontSize: 22, fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 700, color: '#1A1A1A' }}>
          Notifications
        </h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={handleMarkAllRead} style={{ fontSize: 12, fontWeight: 600, color: G, background: 'none', border: `1px solid ${G}`, borderRadius: 8, padding: '6px 12px', cursor: 'pointer' }}>
            Mark All Read
          </button>
          <button onClick={handleClearAll} style={{ fontSize: 12, fontWeight: 600, color: '#EF4444', background: 'none', border: '1px solid #EF4444', borderRadius: 8, padding: '6px 12px', cursor: 'pointer' }}>
            Clear All
          </button>
        </div>
      </div>

      <div style={{ position: 'relative', marginBottom: 20 }}>
        <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search notifications…" 
          style={{ width: '100%', paddingLeft: 36, paddingRight: 12, paddingTop: 10, paddingBottom: 10, border: '1px solid #E2DDD6', borderRadius: 10, fontSize: 13, outline: 'none' }} />
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40 }}><RefreshCw size={24} style={{ animation: 'spin 1s linear infinite', color: '#aaa' }} /></div>
      ) : notifications.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 24px', color: '#888' }}>
          <Bell size={32} style={{ marginBottom: 12, opacity: 0.3 }} />
          <p style={{ fontSize: 15, fontWeight: 600 }}>No notifications</p>
          <p style={{ fontSize: 13 }}>You are all caught up!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {paginated.map(n => (
            <div key={n._id} style={{
              display: 'flex', alignItems: 'flex-start', gap: 14,
              padding: '14px 16px',
              background: n.isRead ? '#FAFAF9' : '#FFF8EE',
              border: `1px solid ${n.isRead ? '#E2DDD6' : '#F0C87A'}`,
              borderRadius: 10,
              position: 'relative'
            }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, fontWeight: n.isRead ? 500 : 700, color: '#1A1A1A', margin: 0, marginBottom: 2 }}>{n.title}</p>
                <p style={{ fontSize: 12, color: '#6B6B6B', margin: 0, marginBottom: 4 }}>{n.message}</p>
                <p style={{ fontSize: 11, color: '#aaa', margin: 0 }}>
                  {new Date(n.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}
                </p>
              </div>
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                {!n.isRead && (
                  <button onClick={() => handleMarkRead(n._id)} style={{ fontSize: 11, color: G, background: 'none', border: `1px solid ${G}`, borderRadius: 6, padding: '3px 8px', cursor: 'pointer', fontWeight: 600 }}>
                    Read
                  </button>
                )}
                <button onClick={() => handleDismiss(n._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', padding: 4, display: 'flex', alignItems: 'center' }}>
                  <X size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// --- MAIN PROFILE ---
const TABS = [
  { id: 'overview', label: 'Overview', icon: User },
  { id: 'orders', label: 'My Orders', icon: Package },
  { id: 'quotes', label: 'My Sample Quotes', icon: FileText },
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
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || location.state?.tab || 'overview';
  const setActiveTab = (val) => setSearchParams({ tab: val });
  const [isMobile, setIsMobile] = useState(false);
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

    // Real-time polling
    const interval = setInterval(() => {
      fetchOrders();
      fetchQuotes();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
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
            {activeTab === 'overview' && <OverviewTab user={{ ...user, orders, quotes }} setTab={setActiveTab} updateUser={updateUser} showToast={showToast} isMobile={isMobile} />}
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

import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { User, Package, FileText, Layout, MapPin, Settings, LogOut, Camera, Plus, Trash2, Edit, X, ExternalLink, Copy, Menu, ChevronLeft } from 'lucide-react';

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
          <h3 style={{ fontSize: 18, fontFamily: 'Outfit,sans-serif', fontWeight: 700, color: '#1A1A1A' }}>{title}</h3>
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
  let tier = 'Bronze', nextTier = 'Silver', needed = 500 - loyaltyPoints;
  let progress = (loyaltyPoints / 500) * 100;
  if (loyaltyPoints >= 500) { tier = 'Silver'; nextTier = 'Gold'; needed = 1000 - loyaltyPoints; progress = ((loyaltyPoints - 500) / 500) * 100; }
  if (loyaltyPoints >= 1000) { tier = 'Gold'; nextTier = 'Platinum'; needed = 2500 - loyaltyPoints; progress = ((loyaltyPoints - 1000) / 1500) * 100; }
  if (loyaltyPoints >= 2500) { tier = 'Platinum'; nextTier = null; needed = 0; progress = 100; }

  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ name: user?.name || '', phone: user?.phone || '' });

  const handleSaveEdit = async () => {
    await updateUser(editForm);
    showToast('Profile updated!', 'success');
    setEditOpen(false);
  };

  const stats = [
    { label: 'Total Orders', value: user?.orders?.length || 0 },
    { label: 'Pending', value: user?.orders?.filter(o => o.status === 'Processing').length || 0 },
    { label: 'Saved Designs', value: user?.savedDesigns?.length || 0 },
    { label: 'Loyalty Points', value: loyaltyPoints },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <h2 style={{ fontSize: 22, fontFamily: 'Outfit,sans-serif', fontWeight: 700, color: '#1A1A1A' }}>Account Overview</h2>
        <button onClick={() => setEditOpen(true)} style={{ padding: '8px 18px', border: `1.5px solid #D0CAC0`, borderRadius: 8, background: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, color: '#1A1A1A', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Edit size={14} /> Edit Profile
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 16, marginBottom: 28 }}>
        {stats.map((s, i) => (
          <div key={i} style={{ backgroundColor: BG, borderRadius: 12, padding: '18px 16px', border: '1px solid #E2DDD6' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{s.label}</p>
            <p style={{ fontSize: 28, fontFamily: 'Outfit,sans-serif', fontWeight: 800, color: '#1A1A1A' }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div style={{ backgroundColor: '#fff', border: '1px solid #E2DDD6', borderRadius: 12, padding: '20px 24px', marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Loyalty Tier</p>
            <h3 style={{ fontSize: 20, fontFamily: 'Outfit,sans-serif', fontWeight: 700, color: ACCENT }}>{tier} Member</h3>
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
        <button onClick={() => setEditOpen(true)} style={{ padding: '10px 20px', backgroundColor: 'transparent', color: '#1A1A1A', border: '1.5px solid #D0CAC0', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
          Edit Profile
        </button>
      </div>

      {editOpen && (
        <Modal onClose={() => setEditOpen(false)} title="Edit Profile">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#6B6B6B', display: 'block', marginBottom: 6 }}>Full Name</label>
              <input value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #D0CAC0', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#6B6B6B', display: 'block', marginBottom: 6 }}>Phone</label>
              <input value={editForm.phone} onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))} style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #D0CAC0', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <button onClick={handleSaveEdit} style={{ flex: 1, padding: '10px', backgroundColor: G, color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>Save Changes</button>
              <button onClick={() => setEditOpen(false)} style={{ flex: 1, padding: '10px', backgroundColor: 'transparent', border: '1.5px solid #D0CAC0', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// --- ORDERS TAB ---
function OrdersTab({ orders }) {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const displayOrders = orders?.length ? orders : [];

  return (
    <div>
      <h2 style={{ fontSize: 22, fontFamily: 'Outfit,sans-serif', fontWeight: 700, color: '#1A1A1A', marginBottom: 24 }}>My Orders</h2>
      {displayOrders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px', backgroundColor: BG, borderRadius: 12, border: '1px dashed #D0CAC0' }}>
          <Package size={48} style={{ color: '#D0CAC0', margin: '0 auto 12px' }} />
          <p style={{ color: '#6B6B6B' }}>No orders found. Place your first order to get started!</p>
        </div>
      ) : (
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
                { label: 'Shipping Address', value: selectedOrder.address || 'N/A' },
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
function QuotesTab({ quotes }) {
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const displayQuotes = quotes?.length ? quotes : [];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div>
      <h2 style={{ fontSize: 22, fontFamily: 'Outfit,sans-serif', fontWeight: 700, color: '#1A1A1A', marginBottom: 24 }}>My Quotes</h2>
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
function DesignsTab({ designs, updateUser, showToast, navigate }) {
  const [confirmDelete, setConfirmDelete] = useState(null);

  const handleDelete = (idx) => {
    if (confirmDelete === idx) {
      const updated = designs.filter((_, i) => i !== idx);
      updateUser({ savedDesigns: updated });
      showToast('Design deleted', 'info');
      setConfirmDelete(null);
    } else {
      setConfirmDelete(idx);
      setTimeout(() => setConfirmDelete(null), 3000);
    }
  };

  const handleDuplicate = (d) => {
    const copy = { ...d, name: `Copy of ${d.name || 'Design'}`, id: `design_${Date.now()}` };
    updateUser({ savedDesigns: [...designs, copy] });
    showToast('Design duplicated!', 'success');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontFamily: 'Outfit,sans-serif', fontWeight: 700, color: '#1A1A1A' }}>Saved Designs</h2>
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
                  <button onClick={() => handleDuplicate(d)} style={{ padding: '7px 0', backgroundColor: 'transparent', border: '1px solid #D0CAC0', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
                    <Copy size={11} /> Copy
                  </button>
                  <button onClick={() => handleDelete(i)} style={{ padding: '7px 0', backgroundColor: confirmDelete === i ? '#DC2626' : 'transparent', color: confirmDelete === i ? '#fff' : '#DC2626', border: '1px solid #DC2626', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
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

function AddressesTab({ addresses, updateUser, showToast }) {
  const [showForm, setShowForm] = useState(false);
  const [editIdx, setEditIdx] = useState(null);
  const [form, setForm] = useState(EMPTY_ADDR);
  const [errors, setErrors] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(null);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name required';
    if (!form.street.trim()) e.street = 'Street required';
    if (!form.city.trim()) e.city = 'City required';
    if (!form.state.trim()) e.state = 'State required';
    if (!form.zip.trim()) e.zip = 'ZIP required';
    return e;
  };

  const handleSave = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    let updated;
    if (editIdx !== null) {
      updated = addresses.map((a, i) => i === editIdx ? form : a);
    } else {
      updated = [...addresses, { ...form, isDefault: addresses.length === 0 }];
    }
    updateUser({ addresses: updated });
    showToast(editIdx !== null ? 'Address updated!' : 'Address added!', 'success');
    setShowForm(false); setEditIdx(null); setForm(EMPTY_ADDR); setErrors({});
  };

  const handleDelete = (idx) => {
    if (confirmDelete === idx) {
      updateUser({ addresses: addresses.filter((_, i) => i !== idx) });
      showToast('Address removed', 'info');
      setConfirmDelete(null);
    } else {
      setConfirmDelete(idx);
      setTimeout(() => setConfirmDelete(null), 3000);
    }
  };

  const handleSetDefault = (idx) => {
    updateUser({ addresses: addresses.map((a, i) => ({ ...a, isDefault: i === idx })) });
    showToast('Default address updated', 'success');
  };

  const inp = { width: '100%', padding: '10px 12px', border: '1.5px solid #D0CAC0', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'Inter,sans-serif' };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontFamily: 'Outfit,sans-serif', fontWeight: 700, color: '#1A1A1A' }}>Saved Addresses</h2>
        <button onClick={() => { setShowForm(true); setEditIdx(null); setForm(EMPTY_ADDR); setErrors({}); }} style={{ padding: '9px 18px', backgroundColor: G, color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
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
                <button onClick={() => { setEditIdx(i); setForm(a); setShowForm(true); setErrors({}); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B', padding: 4 }}><Edit size={14} /></button>
                <button onClick={() => handleDelete(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: confirmDelete === i ? '#DC2626' : '#6B6B6B', padding: 4, fontWeight: confirmDelete === i ? 700 : 400, fontSize: confirmDelete === i ? 11 : undefined }}>
                  {confirmDelete === i ? 'Confirm?' : <Trash2 size={14} />}
                </button>
              </div>
            </div>
            <p style={{ fontWeight: 700, fontSize: 14, color: '#1A1A1A', marginBottom: 4 }}>{a.name}</p>
            <p style={{ fontSize: 13, color: '#6B6B6B', lineHeight: 1.6 }}>{a.street}<br />{a.city}, {a.state} {a.zip}<br />{a.country}</p>
            {!a.isDefault && (
              <button onClick={() => handleSetDefault(i)} style={{ marginTop: 10, fontSize: 11, fontWeight: 700, color: G, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                Set as Default
              </button>
            )}
          </div>
        ))}
      </div>

      {showForm && (
        <div style={{ backgroundColor: BG, borderRadius: 12, padding: '24px', border: '1px solid #E2DDD6' }}>
          <h3 style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: 16, color: '#1A1A1A', marginBottom: 16 }}>{editIdx !== null ? 'Edit Address' : 'New Address'}</h3>
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
            <button onClick={handleSave} style={{ padding: '10px 24px', backgroundColor: G, color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>Save Address</button>
            <button onClick={() => { setShowForm(false); setEditIdx(null); setErrors({}); }} style={{ padding: '10px 24px', border: '1.5px solid #D0CAC0', borderRadius: 8, fontWeight: 700, cursor: 'pointer', background: 'none' }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

// --- SETTINGS TAB ---
function SettingsTab({ user, updateUser, showToast, logout }) {
  const navigate = useNavigate();
  const [info, setInfo] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [pwd, setPwd] = useState({ current: '', newPwd: '', confirm: '' });
  const [pwdErr, setPwdErr] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [notifs, setNotifs] = useState(() => ({
    orders: user?.notifications?.orders ?? true,
    quotes: user?.notifications?.quotes ?? true,
    designs: user?.notifications?.designs ?? false,
  }));

  const handleSaveInfo = async () => {
    await updateUser(info);
    showToast('Profile updated!', 'success');
  };

  const handleUpdatePassword = async () => {
    if (!pwd.current) { setPwdErr('Enter your current password'); return; }
    if (pwd.current !== user?.password) { setPwdErr('Current password is incorrect'); return; }
    if (pwd.newPwd.length < 6) { setPwdErr('New password must be at least 6 characters'); return; }
    if (pwd.newPwd !== pwd.confirm) { setPwdErr('Passwords do not match'); return; }
    await updateUser({ password: pwd.newPwd });
    showToast('Password updated!', 'success');
    setPwd({ current: '', newPwd: '', confirm: '' });
    setPwdErr('');
  };

  const handleToggleNotif = async (key) => {
    const updated = { ...notifs, [key]: !notifs[key] };
    setNotifs(updated);
    await updateUser({ notifications: updated });
    showToast('Notification preferences saved.', 'success');
  };

  const handleDeleteAccount = () => {
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteAccount = () => {
    setDeleteConfirmOpen(false);
    logout();
    localStorage.clear();
    navigate('/');
  };

  const inp = { width: '100%', padding: '10px 12px', border: '1.5px solid #D0CAC0', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'Inter,sans-serif', backgroundColor: BG };
  const section = { backgroundColor: '#fff', borderRadius: 12, padding: '24px', marginBottom: 20, border: '1px solid #E2DDD6' };

  return (
    <div style={{ maxWidth: 560 }}>
      <h2 style={{ fontSize: 22, fontFamily: 'Outfit,sans-serif', fontWeight: 700, color: '#1A1A1A', marginBottom: 24 }}>Account Settings</h2>

      <div style={section}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1A1A1A', marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid #F0EDE8' }}>Personal Information</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#6B6B6B', display: 'block', marginBottom: 6 }}>Full Name</label>
            <input style={inp} value={info.name} onChange={e => setInfo(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#6B6B6B', display: 'block', marginBottom: 6 }}>Email (cannot change)</label>
            <input style={{ ...inp, opacity: 0.6, cursor: 'not-allowed' }} value={user?.email || ''} disabled />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#6B6B6B', display: 'block', marginBottom: 6 }}>Phone</label>
            <input style={inp} value={info.phone} onChange={e => setInfo(f => ({ ...f, phone: e.target.value }))} placeholder="+1 (555) 000-0000" />
          </div>
          <button onClick={handleSaveInfo} style={{ padding: '10px 24px', backgroundColor: G, color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer', alignSelf: 'flex-start' }}>Save Changes</button>
        </div>
      </div>

      <div style={section}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1A1A1A', marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid #F0EDE8' }}>Change Password</h3>
        {pwdErr && <p style={{ fontSize: 12, color: '#DC2626', marginBottom: 12, padding: '8px 12px', backgroundColor: '#FEE2E2', borderRadius: 6 }}>{pwdErr}</p>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { key: 'current', label: 'Current Password', field: 'current' },
            { key: 'newPwd', label: 'New Password', field: 'newPwd' },
            { key: 'confirm', label: 'Confirm New Password', field: 'confirm' },
          ].map(({ key, label, field }) => (
            <div key={key}>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#6B6B6B', display: 'block', marginBottom: 6 }}>{label}</label>
              <input type="password" style={inp} value={pwd[field]} onChange={e => setPwd(f => ({ ...f, [field]: e.target.value }))} />
            </div>
          ))}
          <button onClick={handleUpdatePassword} style={{ padding: '10px 24px', border: `1.5px solid ${G}`, color: G, backgroundColor: 'transparent', borderRadius: 8, fontWeight: 700, cursor: 'pointer', alignSelf: 'flex-start' }}>Update Password</button>
        </div>
      </div>

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

      <div style={{ ...section, borderColor: '#FECACA' }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#DC2626', marginBottom: 8 }}>Danger Zone</h3>
        <p style={{ fontSize: 13, color: '#6B6B6B', marginBottom: 16 }}>Once you delete your account, there is no going back. All your data will be permanently removed.</p>
        <button onClick={handleDeleteAccount} style={{ padding: '10px 20px', border: '1.5px solid #DC2626', color: '#DC2626', backgroundColor: 'transparent', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>Delete My Account</button>
      </div>

      {deleteConfirmOpen && (
        <Modal title="Delete Account" onClose={() => setDeleteConfirmOpen(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p style={{ color: '#1A1A1A' }}>Please confirm that you want to permanently delete your account. This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button onClick={() => setDeleteConfirmOpen(false)} style={{ padding: '10px 18px', backgroundColor: '#F3F4F6', border: '1px solid #D0CAC0', borderRadius: 8, color: '#374151', cursor: 'pointer' }}>Cancel</button>
              <button onClick={confirmDeleteAccount} style={{ padding: '10px 18px', backgroundColor: '#DC2626', border: 'none', borderRadius: 8, color: '#fff', cursor: 'pointer' }}>Delete Account</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// --- MAIN PROFILE ---
const TABS = [
  { id: 'overview', label: 'Overview', icon: User },
  { id: 'orders', label: 'My Orders', icon: Package },
  { id: 'quotes', label: 'My Quotes', icon: FileText },
  { id: 'designs', label: 'Saved Designs', icon: Layout },
  { id: 'addresses', label: 'Addresses', icon: MapPin },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Profile() {
  const { user, logout, updateUser } = useAuth();
  const { showToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState(() => location.state?.tab || 'overview');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

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
          <div style={{ flex: 1, backgroundColor: '#fff', borderRadius: 14, border: '1px solid #E2DDD6', padding: '32px', minHeight: 600 }}>
            {activeTab === 'overview' && <OverviewTab user={user} setTab={setActiveTab} updateUser={updateUser} showToast={showToast} />}
            {activeTab === 'orders' && <OrdersTab orders={user?.orders} />}
            {activeTab === 'quotes' && <QuotesTab quotes={user?.quotes || []} />}
            {activeTab === 'designs' && <DesignsTab designs={user?.savedDesigns || []} updateUser={updateUser} showToast={showToast} navigate={navigate} />}
            {activeTab === 'addresses' && <AddressesTab addresses={user?.addresses || []} updateUser={updateUser} showToast={showToast} />}
            {activeTab === 'settings' && <SettingsTab user={user} updateUser={updateUser} showToast={showToast} logout={logout} />}
          </div>

        </div>
      </div>
    </div>
  );
}

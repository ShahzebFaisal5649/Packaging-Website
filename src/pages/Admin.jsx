import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import {
  LayoutDashboard, ShoppingBag, Users, BarChart2, FileText,
  LogOut, TrendingUp, TrendingDown, Edit, Trash2, X, Download,
  RefreshCw, Search, DollarSign, Clock,
  Eye, Mail, Phone, Calendar,
  Shield, Ban, Star, ArrowUpRight,
  Package, Building, Upload, Menu, Plus,
} from 'lucide-react';

const G = '#1A4D2E';
const ACCENT = '#C8860A';
const BG = '#F5F2ED';

const BOX_TYPES = ['Mailer Box', 'Shipping Box', 'Rigid Box', 'Folding Carton', 'Sleeve Box', 'Display Box', 'Kraft Box', 'Gable Box'];
const MATERIALS = ['Corrugated E-Flute', 'Corrugated B-Flute', 'Kraft', 'SBS Board', 'Rigid Chipboard'];
const FINISHES = ['Matte Lam', 'Gloss Lam', 'Uncoated', 'Soft-Touch', 'Foil Stamp'];
const ADDON_OPTIONS = ['Spot UV', 'Embossing', 'Debossing', 'Foil Stamping', 'Window Patch', 'Hang Tab', 'Ribbon Pull', 'Magnetic Closure', 'Inside Printing', 'Custom Die-Cut'];

// ── helpers ───────────────────────────────────────────────────────────────────
const STATUS_COLORS = {
  Delivered:  { bg: '#D1FAE5', text: '#065F46' },
  Processing: { bg: '#DBEAFE', text: '#1E40AF' },
  Shipped:    { bg: '#FEF3C7', text: '#92400E' },
  Cancelled:  { bg: '#FEE2E2', text: '#991B1B' },
  Quoted:     { bg: '#D1FAE5', text: '#065F46' },
  Reviewing:  { bg: '#FEF3C7', text: '#92400E' },
  New:        { bg: '#DBEAFE', text: '#1E40AF' },
  Pending:    { bg: '#F3E8FF', text: '#6B21A8' },
};
function Badge({ status }) {
  const s = STATUS_COLORS[status] || { bg: '#F3F4F6', text: '#374151' };
  return <span style={{ backgroundColor: s.bg, color: s.text, padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap' }}>{status}</span>;
}

function Modal({ onClose, title, children, wide }) {
  return (
    <>
      <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9000 }} onClick={onClose} />
      <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', backgroundColor: '#fff', borderRadius: 16, padding: 28, width: `min(95vw,${wide ? '760px' : '540px'})`, zIndex: 9001, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #F0EDE8' }}>
          <h3 style={{ fontSize: 18, fontFamily: 'Outfit,sans-serif', fontWeight: 700, color: '#1A1A1A' }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B', padding: 4, borderRadius: 6 }}><X size={18} /></button>
        </div>
        {children}
      </div>
    </>
  );
}

function BarChart({ data, color = G, label }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div>
      {label && <p style={{ fontSize: 12, fontWeight: 700, color: '#6B6B6B', marginBottom: 12 }}>{label}</p>}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 110 }}>
        {data.map((d, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end' }}>
            <span style={{ fontSize: 9, color: '#6B6B6B', fontWeight: 600 }}>{d.value}</span>
            <div style={{ width: '100%', height: `${Math.max((d.value / max) * 85, 2)}%`, backgroundColor: color, borderRadius: '4px 4px 0 0', transition: 'height 0.5s ease' }} />
            <span style={{ fontSize: 9, color: '#6B6B6B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%', textAlign: 'center' }}>{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Image upload helper ───────────────────────────────────────────────────────
function ImageUploader({ value, onChange, label = 'Product Image' }) {
  const ref = useRef(null);
  const handleFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => onChange(reader.result);
    reader.readAsDataURL(file);
  };
  return (
    <div>
      <label style={{ fontSize: 11, fontWeight: 700, color: '#555', display: 'block', marginBottom: 6 }}>{label}</label>
      <div
        onClick={() => ref.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
        style={{ border: `2px dashed ${value ? G : '#D0CAC0'}`, borderRadius: 10, padding: value ? 8 : 20, textAlign: 'center', cursor: 'pointer', background: value ? `${G}06` : '#FAFAF9', transition: 'all 0.2s', position: 'relative' }}
      >
        {value ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src={value} alt="preview" style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8, border: '1px solid #E2DDD6', flexShrink: 0 }} onError={e => { e.target.style.display = 'none'; }} />
            <div style={{ textAlign: 'left', flex: 1 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: G, margin: 0 }}>Image ready</p>
              <p style={{ fontSize: 11, color: '#888', margin: '2px 0 0' }}>Click to replace</p>
            </div>
            <button onClick={e => { e.stopPropagation(); onChange(''); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#DC2626', padding: 4 }}><X size={14} /></button>
          </div>
        ) : (
          <>
            <Upload size={22} color="#9A9080" style={{ marginBottom: 6 }} />
            <p style={{ fontSize: 12, fontWeight: 600, color: '#555', margin: 0 }}>Upload Image</p>
            <p style={{ fontSize: 11, color: '#999', margin: '3px 0 0' }}>PNG, JPG, WebP — drag & drop or click</p>
          </>
        )}
        <input ref={ref} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleFile(e.target.files[0])} />
      </div>
    </div>
  );
}

// ── Addons tag input ──────────────────────────────────────────────────────────
function AddonsInput({ value = [], onChange }) {
  const [input, setInput] = useState('');
  const add = (tag) => {
    const t = tag.trim();
    if (t && !value.includes(t)) onChange([...value, t]);
    setInput('');
  };
  const remove = (tag) => onChange(value.filter(v => v !== tag));
  return (
    <div>
      <label style={{ fontSize: 11, fontWeight: 700, color: '#555', display: 'block', marginBottom: 6 }}>Available Add-ons</label>
      {/* Quick-select chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
        {ADDON_OPTIONS.map(opt => (
          <button key={opt} type="button" onClick={() => value.includes(opt) ? remove(opt) : add(opt)}
            style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 100, border: `1px solid ${value.includes(opt) ? G : '#D0CAC0'}`, background: value.includes(opt) ? `${G}15` : '#fff', color: value.includes(opt) ? G : '#666', cursor: 'pointer' }}>
            {opt}
          </button>
        ))}
      </div>
      {/* Custom add */}
      <div style={{ display: 'flex', gap: 6 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add(input); } }} placeholder="Custom add-on…"
          style={{ flex: 1, padding: '8px 10px', border: '1.5px solid #E2DDD6', borderRadius: 8, fontSize: 12, outline: 'none' }} />
        <button type="button" onClick={() => add(input)} style={{ padding: '8px 12px', background: G, color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center' }}><Plus size={14} /></button>
      </div>
      {/* Selected tags */}
      {value.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 8 }}>
          {value.map(v => (
            <span key={v} style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 100, background: `${ACCENT}15`, color: ACCENT, border: `1px solid ${ACCENT}30`, display: 'flex', alignItems: 'center', gap: 4 }}>
              {v}
              <button type="button" onClick={() => remove(v)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: ACCENT, padding: 0, display: 'flex', lineHeight: 1 }}><X size={10} /></button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Sidebar nav ───────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'orders',    label: 'Orders',    icon: ShoppingBag },
  { key: 'users',     label: 'Users',     icon: Users },
  { key: 'products',  label: 'Products',  icon: Package },
  { key: 'industries', label: 'Industries', icon: Building },
  { key: 'quotes',    label: 'Quotes',    icon: FileText },
  { key: 'analytics', label: 'Analytics', icon: BarChart2 },
];

// ── KPI card ──────────────────────────────────────────────────────────────────
function KpiCard({ label, value, sub, icon: Icon, trend, up, accent }) {
  return (
    <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E2DDD6', padding: '20px 22px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: accent ? `${ACCENT}15` : `${G}12`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={20} color={accent ? ACCENT : G} />
        </div>
        {trend && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, color: up ? '#059669' : '#DC2626' }}>
            {up ? <TrendingUp size={13} /> : <TrendingDown size={13} />} {trend}
          </div>
        )}
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, color: '#1A1A1A', fontFamily: 'Outfit,sans-serif', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 12, color: '#888', marginTop: 6 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: accent ? ACCENT : G, fontWeight: 600, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
function DashboardSection() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [s, o] = await Promise.all([api.get('/admin/stats'), api.get('/admin/orders')]);
      setStats(s);
      setRecentOrders((o.orders || []).slice(0, 6));
    } catch {
      const list = JSON.parse(localStorage.getItem('packagingUsersList') || '[]');
      const orders = list.flatMap(u => (u.orders || []).map(o => ({ ...o, userName: u.name, userEmail: u.email })));
      setStats({ totalUsers: list.filter(u => u.role !== 'admin').length, totalOrders: orders.length, revenue: orders.reduce((s, o) => s + (parseFloat(o.total) || 0), 0), pending: orders.filter(o => o.status === 'Processing').length, newThisWeek: 0 });
      setRecentOrders(orders.slice(0, 6));
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#888' }}><RefreshCw size={24} style={{ animation: 'spin 1s linear infinite' }} /></div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <h2 style={{ fontSize: 22, fontFamily: 'Outfit,sans-serif', fontWeight: 700 }}>Dashboard Overview</h2>
        <button onClick={load} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: G, background: 'none', border: `1px solid ${G}`, borderRadius: 8, padding: '7px 14px', cursor: 'pointer' }}>
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 16, marginBottom: 28 }}>
        <KpiCard label="Total Revenue" value={`$${(stats?.revenue || 0).toFixed(0)}`} icon={DollarSign} trend="+12%" up />
        <KpiCard label="Total Orders" value={stats?.totalOrders || 0} icon={ShoppingBag} trend="+8%" up />
        <KpiCard label="Pending Orders" value={stats?.pending || 0} icon={Clock} trend={stats?.pending > 5 ? '+' : '–'} up={stats?.pending <= 5} accent />
        <KpiCard label="Total Customers" value={stats?.totalUsers || 0} icon={Users} sub={stats?.newThisWeek ? `+${stats.newThisWeek} this week` : ''} trend="+22%" up />
      </div>

      <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E2DDD6', overflow: 'hidden' }}>
        <div style={{ padding: '18px 22px', borderBottom: '1px solid #F0EDE8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>Recent Orders</h3>
          <ArrowUpRight size={16} color="#aaa" />
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#FAFAF9' }}>
                {['Order ID', 'Customer', 'Product', 'Status', 'Total'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: 24, textAlign: 'center', color: '#aaa', fontSize: 13 }}>No orders yet</td></tr>
              ) : recentOrders.map((o, i) => (
                <tr key={i} style={{ borderTop: '1px solid #F0EDE8' }}>
                  <td style={{ padding: '13px 16px', fontSize: 13, fontWeight: 700, color: G }}>{o.id || o.orderId}</td>
                  <td style={{ padding: '13px 16px', fontSize: 13, color: '#1A1A1A' }}>{o.userName}</td>
                  <td style={{ padding: '13px 16px', fontSize: 13, color: '#666' }}>{o.product}</td>
                  <td style={{ padding: '13px 16px' }}><Badge status={o.status} /></td>
                  <td style={{ padding: '13px 16px', fontSize: 13, fontWeight: 700 }}>${(+o.total || 0).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Products ─────────────────────────────────────────────────────────────────
function ProductsSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editForm, setEditForm] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const emptyForm = { name: '', slug: '', cat: '', description: '', price: '', img: '', featured: false, boxType: '', material: '', finish: '', dims: '', minQty: '', addons: [] };

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get('/admin/products');
      setProducts(data.products || []);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  const handleEdit = (product) => {
    setEditForm({
      id: product._id,
      name: product.name || '',
      slug: product.slug || '',
      cat: product.cat || '',
      description: product.description || '',
      price: product.price || '',
      img: product.img || '',
      featured: product.featured || false,
      boxType: product.boxType || '',
      material: product.material || '',
      finish: product.finish || '',
      dims: product.dims || '',
      minQty: product.minQty || '',
      addons: product.addons || [],
    });
  };

  const autoSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const handleSave = async () => {
    const payload = { ...editForm };
    delete payload.id;
    try {
      if (editForm.id) {
        await api.put(`/admin/products/${editForm.id}`, payload);
      } else {
        if (!payload.slug) payload.slug = autoSlug(payload.name);
        await api.post('/admin/products', payload);
      }
      setEditForm(null);
      loadProducts();
    } catch (err) {
      console.error('Failed to save product:', err);
      alert(err.message || 'Save failed');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/products/${id}`);
      setDeleteConfirm(null);
      loadProducts();
    } catch (err) {
      console.error('Failed to delete product:', err);
    }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.cat || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <h2 style={{ fontSize: 22, fontFamily: 'Outfit,sans-serif', fontWeight: 700 }}>Products Management</h2>
        <button onClick={() => setEditForm(emptyForm)}
          style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: '#fff', background: G, border: 'none', borderRadius: 8, padding: '9px 18px', cursor: 'pointer' }}>
          <Plus size={14} /> Add Product
        </button>
      </div>

      <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E2DDD6', overflow: 'hidden' }}>
        <div style={{ padding: '14px 16px', borderBottom: '1px solid #F0EDE8' }}>
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products…"
              style={{ width: '100%', paddingLeft: 36, paddingRight: 12, paddingTop: 9, paddingBottom: 9, border: '1px solid #E2DDD6', borderRadius: 8, fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#FAFAF9' }}>
                {['Product', 'Category', 'Box Type', 'Price', 'Featured', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '11px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ padding: 32, textAlign: 'center' }}><RefreshCw size={20} style={{ animation: 'spin 1s linear infinite', color: '#aaa' }} /></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: 32, textAlign: 'center', color: '#aaa' }}>No products found</td></tr>
              ) : filtered.map((p) => (
                <tr key={p._id} style={{ borderTop: '1px solid #F0EDE8' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#FAFAF9'}
                  onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <img src={p.img || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=80&q=70'} alt={p.name}
                        style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 8, flexShrink: 0, border: '1px solid #E2DDD6' }}
                        onError={e => { e.target.src = 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=80&q=70'; }} />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#1A1A1A' }}>{p.name}</div>
                        <div style={{ fontSize: 11, color: '#888' }}>{p.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: 12, color: '#555' }}>{p.cat}</td>
                  <td style={{ padding: '12px 14px', fontSize: 12, color: '#555' }}>{p.boxType || '—'}</td>
                  <td style={{ padding: '12px 14px', fontSize: 12, fontWeight: 700, color: ACCENT }}>{p.price ? `$${p.price}` : '—'}</td>
                  <td style={{ padding: '12px 14px' }}>
                    {p.featured && <span style={{ background: '#D1FAE5', color: '#065F46', padding: '2px 8px', borderRadius: 100, fontSize: 10, fontWeight: 700 }}>Featured</span>}
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => handleEdit(p)}
                        style={{ padding: '5px 10px', borderRadius: 6, border: `1px solid ${G}`, color: G, background: 'none', fontSize: 11, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Edit size={11} />
                      </button>
                      <button onClick={() => setDeleteConfirm(p._id)}
                        style={{ padding: '5px 10px', borderRadius: 6, border: '1px solid #FEE2E2', color: '#DC2626', background: 'none', fontSize: 11, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit/Add Modal */}
      {editForm && (
        <Modal onClose={() => setEditForm(null)} title={editForm.id ? 'Edit Product' : 'Add New Product'} wide>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {/* Basic info */}
            <div style={{ gridColumn: '1 / -1' }}>
              <ImageUploader value={editForm.img} onChange={v => setEditForm(f => ({ ...f, img: v }))} label="Product Image (upload file)" />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#555', display: 'block', marginBottom: 4 }}>Product Name *</label>
              <input value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value, slug: f.slug || autoSlug(e.target.value) }))}
                placeholder="e.g. Mailer Box Premium" style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#555', display: 'block', marginBottom: 4 }}>Slug *</label>
              <input value={editForm.slug} onChange={e => setEditForm(f => ({ ...f, slug: e.target.value }))}
                placeholder="mailer-box-premium" style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#555', display: 'block', marginBottom: 4 }}>Category *</label>
              <input value={editForm.cat} onChange={e => setEditForm(f => ({ ...f, cat: e.target.value }))}
                placeholder="e.g. Rectangular" style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#555', display: 'block', marginBottom: 4 }}>Price (per unit)</label>
              <input value={editForm.price} onChange={e => setEditForm(f => ({ ...f, price: e.target.value }))}
                placeholder="e.g. 1.20" style={inputStyle} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#555', display: 'block', marginBottom: 4 }}>Description</label>
              <textarea value={editForm.description} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Describe the product…" rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
            </div>

            {/* Specifications */}
            <div style={{ gridColumn: '1 / -1', borderTop: '1px solid #F0EDE8', paddingTop: 14, marginTop: 4 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px' }}>Specifications</p>
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#555', display: 'block', marginBottom: 4 }}>Box Type</label>
              <select value={editForm.boxType} onChange={e => setEditForm(f => ({ ...f, boxType: e.target.value }))} style={inputStyle}>
                <option value="">— Select —</option>
                {BOX_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#555', display: 'block', marginBottom: 4 }}>Material</label>
              <select value={editForm.material} onChange={e => setEditForm(f => ({ ...f, material: e.target.value }))} style={inputStyle}>
                <option value="">— Select —</option>
                {MATERIALS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#555', display: 'block', marginBottom: 4 }}>Finish</label>
              <select value={editForm.finish} onChange={e => setEditForm(f => ({ ...f, finish: e.target.value }))} style={inputStyle}>
                <option value="">— Select —</option>
                {FINISHES.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#555', display: 'block', marginBottom: 4 }}>Dimensions Range</label>
              <input value={editForm.dims} onChange={e => setEditForm(f => ({ ...f, dims: e.target.value }))}
                placeholder="e.g. 4×4×2 – 16×12×8 in" style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#555', display: 'block', marginBottom: 4 }}>Min. Order Qty</label>
              <input value={editForm.minQty} onChange={e => setEditForm(f => ({ ...f, minQty: e.target.value }))}
                placeholder="e.g. 100 units" style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#555', display: 'block', marginBottom: 4 }}>Featured</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', paddingTop: 6 }}>
                <input type="checkbox" checked={editForm.featured} onChange={e => setEditForm(f => ({ ...f, featured: e.target.checked }))} />
                <span style={{ fontSize: 13, color: '#1A1A1A' }}>Mark as featured</span>
              </label>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <AddonsInput value={editForm.addons} onChange={v => setEditForm(f => ({ ...f, addons: v }))} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 20, paddingTop: 16, borderTop: '1px solid #F0EDE8' }}>
            <button onClick={handleSave} style={{ flex: 1, padding: '11px', background: G, color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
              {editForm.id ? 'Save Changes' : 'Add Product'}
            </button>
            <button onClick={() => setEditForm(null)} style={{ flex: 1, padding: '11px', background: '#fff', color: '#666', border: '1px solid #E2DDD6', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </Modal>
      )}

      {deleteConfirm && (
        <Modal onClose={() => setDeleteConfirm(null)} title="Delete Product">
          <p style={{ color: '#555', fontSize: 14, marginBottom: 20 }}>Are you sure? This cannot be undone.</p>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => handleDelete(deleteConfirm)} style={{ flex: 1, padding: '10px', background: '#DC2626', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>Delete</button>
            <button onClick={() => setDeleteConfirm(null)} style={{ flex: 1, padding: '10px', background: '#fff', color: '#666', border: '1px solid #E2DDD6', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// shared input style
const inputStyle = { width: '100%', padding: '9px 11px', border: '1.5px solid #E2DDD6', borderRadius: 8, fontSize: 13, outline: 'none', boxSizing: 'border-box', background: '#fff' };

// ── Industries ───────────────────────────────────────────────────────────────
function IndustriesSection() {
  const [industries, setIndustries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editForm, setEditForm] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const emptyForm = { name: '', slug: '', cat: '', description: '', img: '', products: [] };

  const loadIndustries = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get('/admin/industries');
      setIndustries(data.industries || []);
    } catch (err) {
      console.error('Failed to load industries:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadIndustries(); }, [loadIndustries]);

  const handleEdit = (industry) => {
    setEditForm({
      id: industry._id,
      name: industry.name || '',
      slug: industry.slug || '',
      cat: industry.cat || '',
      description: industry.description || '',
      img: industry.img || '',
      products: industry.products || [],
    });
  };

  const autoSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const handleSave = async () => {
    const payload = { ...editForm };
    delete payload.id;
    try {
      if (editForm.id) {
        await api.put(`/admin/industries/${editForm.id}`, payload);
      } else {
        if (!payload.slug) payload.slug = autoSlug(payload.name);
        await api.post('/admin/industries', payload);
      }
      setEditForm(null);
      loadIndustries();
    } catch (err) {
      console.error('Failed to save industry:', err);
      alert(err.message || 'Save failed');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/industries/${id}`);
      setDeleteConfirm(null);
      loadIndustries();
    } catch (err) {
      console.error('Failed to delete industry:', err);
    }
  };

  const filtered = industries.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    (i.cat || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <h2 style={{ fontSize: 22, fontFamily: 'Outfit,sans-serif', fontWeight: 700 }}>Industries Management</h2>
        <button onClick={() => setEditForm(emptyForm)}
          style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: '#fff', background: G, border: 'none', borderRadius: 8, padding: '9px 18px', cursor: 'pointer' }}>
          <Plus size={14} /> Add Industry
        </button>
      </div>

      <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E2DDD6', overflow: 'hidden' }}>
        <div style={{ padding: '14px 16px', borderBottom: '1px solid #F0EDE8' }}>
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search industries…"
              style={{ width: '100%', paddingLeft: 36, paddingRight: 12, paddingTop: 9, paddingBottom: 9, border: '1px solid #E2DDD6', borderRadius: 8, fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#FAFAF9' }}>
                {['Industry', 'Category', 'Products', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '11px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} style={{ padding: 32, textAlign: 'center' }}><RefreshCw size={20} style={{ animation: 'spin 1s linear infinite', color: '#aaa' }} /></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={4} style={{ padding: 32, textAlign: 'center', color: '#aaa' }}>No industries found</td></tr>
              ) : filtered.map((ind) => (
                <tr key={ind._id} style={{ borderTop: '1px solid #F0EDE8' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#FAFAF9'}
                  onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <img src={ind.img || 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=80&q=70'} alt={ind.name}
                        style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 8, flexShrink: 0, border: '1px solid #E2DDD6' }}
                        onError={e => { e.target.src = 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=80&q=70'; }} />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#1A1A1A' }}>{ind.name}</div>
                        <div style={{ fontSize: 11, color: '#888' }}>{ind.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: 12, color: '#555' }}>{ind.cat}</td>
                  <td style={{ padding: '12px 14px', fontSize: 12, color: '#555' }}>{(ind.products || []).length} products</td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => handleEdit(ind)}
                        style={{ padding: '5px 10px', borderRadius: 6, border: `1px solid ${G}`, color: G, background: 'none', fontSize: 11, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Edit size={11} />
                      </button>
                      <button onClick={() => setDeleteConfirm(ind._id)}
                        style={{ padding: '5px 10px', borderRadius: 6, border: '1px solid #FEE2E2', color: '#DC2626', background: 'none', fontSize: 11, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editForm && (
        <Modal onClose={() => setEditForm(null)} title={editForm.id ? 'Edit Industry' : 'Add New Industry'} wide>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <ImageUploader value={editForm.img} onChange={v => setEditForm(f => ({ ...f, img: v }))} label="Industry Image (upload file)" />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#555', display: 'block', marginBottom: 4 }}>Industry Name *</label>
              <input value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value, slug: f.slug || autoSlug(e.target.value) }))}
                placeholder="e.g. Food & Beverage" style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#555', display: 'block', marginBottom: 4 }}>Slug *</label>
              <input value={editForm.slug} onChange={e => setEditForm(f => ({ ...f, slug: e.target.value }))}
                placeholder="food-beverage" style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#555', display: 'block', marginBottom: 4 }}>Category</label>
              <input value={editForm.cat} onChange={e => setEditForm(f => ({ ...f, cat: e.target.value }))}
                placeholder="e.g. Food" style={inputStyle} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#555', display: 'block', marginBottom: 4 }}>Description</label>
              <textarea value={editForm.description} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Describe the industry…" rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 20, paddingTop: 16, borderTop: '1px solid #F0EDE8' }}>
            <button onClick={handleSave} style={{ flex: 1, padding: '11px', background: G, color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
              {editForm.id ? 'Save Changes' : 'Add Industry'}
            </button>
            <button onClick={() => setEditForm(null)} style={{ flex: 1, padding: '11px', background: '#fff', color: '#666', border: '1px solid #E2DDD6', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </Modal>
      )}

      {deleteConfirm && (
        <Modal onClose={() => setDeleteConfirm(null)} title="Delete Industry">
          <p style={{ color: '#555', fontSize: 14, marginBottom: 20 }}>Are you sure? This cannot be undone.</p>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => handleDelete(deleteConfirm)} style={{ flex: 1, padding: '10px', background: '#DC2626', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>Delete</button>
            <button onClick={() => setDeleteConfirm(null)} style={{ flex: 1, padding: '10px', background: '#fff', color: '#666', border: '1px solid #E2DDD6', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Orders ────────────────────────────────────────────────────────────────────
function OrdersSection() {
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState(null);
  const [editTracking, setEditTracking] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get('/admin/orders');
      setOrders(data.orders || []);
    } catch {
      const list = JSON.parse(localStorage.getItem('packagingUsersList') || '[]');
      setOrders(list.flatMap(u => (u.orders || []).map(o => ({ ...o, userName: u.name, userEmail: u.email, userId: u.id }))));
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleStatusChange = async (order, status) => {
    try {
      if (order.userId && order._id) {
        await api.put(`/admin/orders/${order.userId}/${order._id}`, { status });
      } else {
        const list = JSON.parse(localStorage.getItem('packagingUsersList') || '[]');
        const ui = list.findIndex(u => u.id === order.userId);
        if (ui > -1) { const oi = list[ui].orders.findIndex(o => o.id === (order.id || order.orderId)); if (oi > -1) list[ui].orders[oi].status = status; }
        localStorage.setItem('packagingUsersList', JSON.stringify(list));
      }
      await load();
      showToast('Order status updated', 'success');
      if (selected?.id === order.id) setSelected(prev => ({ ...prev, status }));
    } catch (e) { showToast(e.message, 'error'); }
  };

  const handleSaveTracking = async () => {
    if (!selected) return;
    try {
      if (selected.userId && selected._id) {
        await api.put(`/admin/orders/${selected.userId}/${selected._id}`, { tracking: editTracking });
      }
      setSelected(prev => ({ ...prev, tracking: editTracking }));
      await load();
      showToast('Tracking updated', 'success');
    } catch (e) { showToast(e.message, 'error'); }
  };

  const exportCSV = () => {
    const rows = [['Order ID', 'Customer', 'Email', 'Product', 'Qty', 'Status', 'Total', 'Date']];
    orders.forEach(o => rows.push([o.id || o.orderId, o.userName, o.userEmail, o.product, o.qty, o.status, o.total, o.date || '']));
    const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const a = document.createElement('a'); a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv); a.download = 'orders.csv'; a.click();
  };

  const filtered = orders.filter(o => {
    const matchSearch = !search || [o.id, o.orderId, o.userName, o.userEmail, o.product].some(v => v && String(v).toLowerCase().includes(search.toLowerCase()));
    const matchFilter = filter === 'All' || o.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <h2 style={{ fontSize: 22, fontFamily: 'Outfit,sans-serif', fontWeight: 700 }}>Orders Management</h2>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={load} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: G, background: 'none', border: `1px solid ${G}`, borderRadius: 8, padding: '7px 14px', cursor: 'pointer' }}><RefreshCw size={13} /> Refresh</button>
          <button onClick={exportCSV} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: '#fff', background: G, border: 'none', borderRadius: 8, padding: '7px 16px', cursor: 'pointer' }}><Download size={13} /> Export CSV</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 18, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search orders…" style={{ width: '100%', paddingLeft: 36, paddingRight: 12, paddingTop: 9, paddingBottom: 9, border: '1px solid #E2DDD6', borderRadius: 8, fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              style={{ padding: '7px 14px', borderRadius: 8, border: `1px solid ${filter === s ? G : '#E2DDD6'}`, background: filter === s ? G : '#fff', color: filter === s ? '#fff' : '#666', fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s' }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E2DDD6', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center' }}><RefreshCw size={22} style={{ animation: 'spin 1s linear infinite', color: '#aaa' }} /></div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#FAFAF9' }}>
                  {['Order ID', 'Customer', 'Product', 'Qty', 'Status', 'Total', 'Date', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '11px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={8} style={{ padding: 32, textAlign: 'center', color: '#aaa' }}>No orders found</td></tr>
                ) : filtered.map((o, i) => (
                  <tr key={i} style={{ borderTop: '1px solid #F0EDE8', transition: 'background 0.1s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#FAFAF9'}
                    onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                    <td style={{ padding: '12px 14px', fontSize: 12, fontWeight: 700, color: G }}>{o.id || o.orderId}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A' }}>{o.userName}</div>
                      <div style={{ fontSize: 11, color: '#888' }}>{o.userEmail}</div>
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: 12, color: '#555' }}>{o.product}</td>
                    <td style={{ padding: '12px 14px', fontSize: 12, color: '#555' }}>{o.qty}</td>
                    <td style={{ padding: '12px 14px' }}><Badge status={o.status} /></td>
                    <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 700 }}>${(+o.total || 0).toFixed(2)}</td>
                    <td style={{ padding: '12px 14px', fontSize: 11, color: '#888', whiteSpace: 'nowrap' }}>{o.date || '—'}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => { setSelected(o); setEditTracking(o.tracking || ''); }}
                          style={{ padding: '5px 10px', borderRadius: 6, border: `1px solid ${G}`, color: G, background: 'none', fontSize: 11, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Eye size={11} /> View
                        </button>
                        <select value={o.status} onChange={e => handleStatusChange(o, e.target.value)}
                          style={{ padding: '5px 8px', borderRadius: 6, border: '1px solid #E2DDD6', fontSize: 11, fontWeight: 700, cursor: 'pointer', color: '#555' }}>
                          {['Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && (
        <Modal onClose={() => setSelected(null)} title={`Order ${selected.id || selected.orderId}`} wide>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
            {[
              { label: 'Customer', value: selected.userName },
              { label: 'Email', value: selected.userEmail },
              { label: 'Product', value: selected.product },
              { label: 'Quantity', value: `${selected.qty} units` },
              { label: 'Total', value: `$${(+selected.total || 0).toFixed(2)}` },
              { label: 'Date', value: selected.date || '—' },
              { label: 'Address', value: selected.address || '—' },
              { label: 'Status', value: <Badge status={selected.status} /> },
            ].map(({ label, value }) => (
              <div key={label} style={{ background: BG, borderRadius: 10, padding: '12px 14px' }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>{label}</p>
                <p style={{ fontSize: 13, color: '#1A1A1A', fontWeight: 600, margin: 0 }}>{value}</p>
              </div>
            ))}
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>Tracking Number</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input value={editTracking} onChange={e => setEditTracking(e.target.value)} placeholder="e.g. UPS1234567890"
                style={{ flex: 1, padding: '10px 12px', border: '1.5px solid #E2DDD6', borderRadius: 8, fontSize: 13, outline: 'none' }} />
              <button onClick={handleSaveTracking} style={{ padding: '10px 18px', background: G, color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Save</button>
            </div>
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>Update Status</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => (
                <button key={s} onClick={() => handleStatusChange(selected, s)}
                  style={{ padding: '8px 16px', borderRadius: 8, border: `1.5px solid ${selected.status === s ? G : '#E2DDD6'}`, background: selected.status === s ? G : '#fff', color: selected.status === s ? '#fff' : '#555', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Users ─────────────────────────────────────────────────────────────────────
function UsersSection() {
  const { showToast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get('/admin/users');
      setUsers(data.users || []);
    } catch {
      const list = JSON.parse(localStorage.getItem('packagingUsersList') || '[]');
      setUsers(list.filter(u => u.role !== 'admin'));
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (user) => {
    try {
      if (user._id) await api.delete(`/admin/users/${user._id}`);
      else {
        const list = JSON.parse(localStorage.getItem('packagingUsersList') || '[]');
        localStorage.setItem('packagingUsersList', JSON.stringify(list.filter(u => u.id !== user.id)));
      }
      await load();
      setDeleteConfirm(null);
      showToast('User deleted', 'success');
    } catch (e) { showToast(e.message, 'error'); }
  };

  const handleRoleChange = async (user, role) => {
    try {
      if (user._id) await api.put(`/admin/users/${user._id}`, { role });
      else {
        const list = JSON.parse(localStorage.getItem('packagingUsersList') || '[]');
        const idx = list.findIndex(u => u.id === user.id);
        if (idx > -1) list[idx].role = role;
        localStorage.setItem('packagingUsersList', JSON.stringify(list));
      }
      await load();
      showToast('Role updated', 'success');
    } catch (e) { showToast(e.message, 'error'); }
  };

  const handleLoyalty = async (user, points) => {
    try {
      if (user._id) await api.put(`/admin/users/${user._id}`, { loyaltyPoints: points });
      await load();
      setSelected(prev => prev ? { ...prev, loyaltyPoints: points } : null);
      showToast('Loyalty points updated', 'success');
    } catch (e) { showToast(e.message, 'error'); }
  };

  const exportCSV = () => {
    const rows = [['Name', 'Email', 'Phone', 'Role', 'Orders', 'Loyalty Points', 'Joined']];
    users.forEach(u => rows.push([u.name, u.email, u.phone || '', u.role, (u.orders || []).length, u.loyaltyPoints || 0, u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '']));
    const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const a = document.createElement('a'); a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv); a.download = 'users.csv'; a.click();
  };

  const filtered = users.filter(u => !search || [u.name, u.email, u.phone].some(v => v && String(v).toLowerCase().includes(search.toLowerCase())));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <h2 style={{ fontSize: 22, fontFamily: 'Outfit,sans-serif', fontWeight: 700 }}>User Management</h2>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={load} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: G, background: 'none', border: `1px solid ${G}`, borderRadius: 8, padding: '7px 14px', cursor: 'pointer' }}><RefreshCw size={13} /> Refresh</button>
          <button onClick={exportCSV} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: '#fff', background: G, border: 'none', borderRadius: 8, padding: '7px 16px', cursor: 'pointer' }}><Download size={13} /> Export CSV</button>
        </div>
      </div>

      <div style={{ position: 'relative', marginBottom: 16 }}>
        <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, email, phone…"
          style={{ width: '100%', paddingLeft: 36, paddingRight: 12, paddingTop: 10, paddingBottom: 10, border: '1px solid #E2DDD6', borderRadius: 8, fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
      </div>

      <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E2DDD6', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center' }}><RefreshCw size={22} style={{ animation: 'spin 1s linear infinite', color: '#aaa' }} /></div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#FAFAF9' }}>
                  {['Customer', 'Contact', 'Role', 'Orders', 'Loyalty Pts', 'Joined', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '11px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} style={{ padding: 32, textAlign: 'center', color: '#aaa' }}>No users found</td></tr>
                ) : filtered.map((u, i) => (
                  <tr key={i} style={{ borderTop: '1px solid #F0EDE8' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#FAFAF9'}
                    onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${G}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: G, flexShrink: 0 }}>
                          {(u.name || 'U')[0].toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: '#1A1A1A' }}>{u.name}</div>
                          <div style={{ fontSize: 11, color: '#888' }}>{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      {u.phone && <div style={{ fontSize: 12, color: '#555', display: 'flex', alignItems: 'center', gap: 4 }}><Phone size={11} color="#aaa" /> {u.phone}</div>}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <select value={u.role || 'user'} onChange={e => handleRoleChange(u, e.target.value)}
                        style={{ padding: '5px 8px', borderRadius: 6, border: '1px solid #E2DDD6', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 600, color: '#1A1A1A' }}>{(u.orders || []).length}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Star size={12} color={ACCENT} style={{ fill: ACCENT }} /><span style={{ fontSize: 13, fontWeight: 600 }}>{u.loyaltyPoints || 0}</span></div>
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: 11, color: '#888' }}>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => setSelected(u)}
                          style={{ padding: '5px 10px', borderRadius: 6, border: `1px solid ${G}`, color: G, background: 'none', fontSize: 11, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Eye size={11} /> View
                        </button>
                        <button onClick={() => setDeleteConfirm(u)}
                          style={{ padding: '5px 10px', borderRadius: 6, border: '1px solid #FEE2E2', color: '#DC2626', background: 'none', fontSize: 11, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Trash2 size={11} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && (
        <Modal onClose={() => setSelected(null)} title={`Customer: ${selected.name}`} wide>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
            {[
              { icon: <Mail size={14} />, label: 'Email', value: selected.email },
              { icon: <Phone size={14} />, label: 'Phone', value: selected.phone || '—' },
              { icon: <Shield size={14} />, label: 'Role', value: selected.role },
              { icon: <Star size={14} />, label: 'Loyalty Points', value: selected.loyaltyPoints || 0 },
              { icon: <ShoppingBag size={14} />, label: 'Orders', value: (selected.orders || []).length },
              { icon: <Calendar size={14} />, label: 'Member Since', value: selected.createdAt ? new Date(selected.createdAt).toLocaleDateString() : '—' },
            ].map(({ icon, label, value }) => (
              <div key={label} style={{ background: BG, borderRadius: 10, padding: '12px 14px', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <div style={{ color: G, marginTop: 1 }}>{icon}</div>
                <div>
                  <p style={{ fontSize: 10, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 3px' }}>{label}</p>
                  <p style={{ fontSize: 13, color: '#1A1A1A', fontWeight: 600, margin: 0 }}>{value}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginBottom: 16, padding: '14px 16px', background: `${ACCENT}08`, borderRadius: 10, border: `1px solid ${ACCENT}20` }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#888', marginBottom: 8 }}>Adjust Loyalty Points</p>
            <div style={{ display: 'flex', gap: 8 }}>
              {[50, 100, 200].map(pts => (
                <button key={pts} onClick={() => handleLoyalty(selected, (selected.loyaltyPoints || 0) + pts)}
                  style={{ padding: '7px 14px', background: G, color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                  +{pts}
                </button>
              ))}
              <button onClick={() => handleLoyalty(selected, 0)}
                style={{ padding: '7px 14px', background: '#FEE2E2', color: '#DC2626', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                Reset
              </button>
            </div>
          </div>
          {(selected.orders || []).length > 0 && (
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#888', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Order History</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {(selected.orders || []).slice(0, 5).map((o, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#FAFAF9', borderRadius: 8, fontSize: 13 }}>
                    <span style={{ fontWeight: 700, color: G }}>{o.id || o.orderId}</span>
                    <span style={{ color: '#555' }}>{o.product}</span>
                    <Badge status={o.status} />
                    <span style={{ fontWeight: 700 }}>${(+o.total || 0).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Modal>
      )}

      {deleteConfirm && (
        <Modal onClose={() => setDeleteConfirm(null)} title="Delete User">
          <div style={{ textAlign: 'center', padding: '8px 0 24px' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Trash2 size={24} color="#DC2626" />
            </div>
            <p style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A', marginBottom: 8 }}>Delete {deleteConfirm.name}?</p>
            <p style={{ fontSize: 13, color: '#888', marginBottom: 24 }}>This will permanently delete the user and all their data.</p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button onClick={() => setDeleteConfirm(null)} style={{ padding: '10px 24px', background: '#fff', border: '1px solid #E2DDD6', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} style={{ padding: '10px 24px', background: '#DC2626', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>Delete User</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Quotes ────────────────────────────────────────────────────────────────────
function QuotesSection() {
  const { showToast } = useToast();
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [priceInput, setPriceInput] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get('/admin/quotes');
      setQuotes(data.quotes || []);
    } catch {
      const list = JSON.parse(localStorage.getItem('packagingUsersList') || '[]');
      setQuotes(list.flatMap(u => (u.quotes || []).map(q => ({ ...q, userName: u.name, userEmail: u.email, userId: u.id }))));
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleUpdateQuote = async (q, updates) => {
    try {
      if (q.userId && q._id) await api.put(`/admin/quotes/${q.userId}/${q._id}`, updates);
      else {
        const list = JSON.parse(localStorage.getItem('packagingUsersList') || '[]');
        const ui = list.findIndex(u => u.id === q.userId);
        if (ui > -1) { const qi = list[ui].quotes?.findIndex(x => x.id === q.id); if (qi > -1) list[ui].quotes[qi] = { ...list[ui].quotes[qi], ...updates }; }
        localStorage.setItem('packagingUsersList', JSON.stringify(list));
      }
      await load();
      showToast('Quote updated', 'success');
      setSelected(null);
    } catch (e) { showToast(e.message, 'error'); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ fontSize: 22, fontFamily: 'Outfit,sans-serif', fontWeight: 700 }}>Quote & Sample Requests</h2>
        <button onClick={load} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: G, background: 'none', border: `1px solid ${G}`, borderRadius: 8, padding: '7px 14px', cursor: 'pointer' }}><RefreshCw size={13} /> Refresh</button>
      </div>
      <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E2DDD6', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center' }}><RefreshCw size={22} style={{ animation: 'spin 1s linear infinite', color: '#aaa' }} /></div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#FAFAF9' }}>
                  {['Quote ID', 'Type', 'Customer', 'Product / Box', 'Qty', 'Delivery Address', 'Status', 'Price', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '11px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {quotes.length === 0 ? (
                  <tr><td colSpan={9} style={{ padding: 32, textAlign: 'center', color: '#aaa' }}>No quote or sample requests yet</td></tr>
                ) : quotes.map((q, i) => (
                  <tr key={i} style={{ borderTop: '1px solid #F0EDE8' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#FAFAF9'}
                    onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                    <td style={{ padding: '12px 14px', fontSize: 12, fontWeight: 700, color: G }}>{q.quoteId || q.id}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 100, background: q.type === 'sample' ? '#FEF3C7' : '#DBEAFE', color: q.type === 'sample' ? '#92400E' : '#1E40AF' }}>
                        {q.type === 'sample' ? '📦 Sample' : '💬 Quote'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{q.userName}</div>
                      <div style={{ fontSize: 11, color: '#888' }}>{q.userEmail}</div>
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: 12, color: '#555' }}>{q.productName || q.boxType || '—'}</td>
                    <td style={{ padding: '12px 14px', fontSize: 12, color: '#555' }}>{q.qty || '—'}</td>
                    <td style={{ padding: '12px 14px', fontSize: 12, color: '#555', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={q.deliveryAddress || '—'}>{q.deliveryAddress || '—'}</td>
                    <td style={{ padding: '12px 14px' }}><Badge status={q.status || 'Pending'} /></td>
                    <td style={{ padding: '12px 14px', fontSize: 12, fontWeight: 700, color: ACCENT }}>{q.quotedPrice || '—'}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <button onClick={() => { setSelected(q); setPriceInput(q.quotedPrice || ''); }}
                        style={{ padding: '5px 12px', borderRadius: 6, border: `1px solid ${G}`, color: G, background: 'none', fontSize: 11, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Edit size={11} /> Reply
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && (
        <Modal onClose={() => setSelected(null)} title={`Reply — ${selected.quoteId || selected.id}`}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ padding: '12px 14px', background: BG, borderRadius: 10, marginBottom: 16 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px' }}>Request Details</p>
              <p style={{ fontSize: 13, color: '#1A1A1A', margin: '0 0 4px' }}><strong>{selected.userName}</strong> ({selected.userEmail})</p>
              {selected.type === 'sample' && <p style={{ fontSize: 13, color: '#555', margin: '0 0 4px' }}>Type: <strong>Physical Sample</strong></p>}
              {selected.productName && <p style={{ fontSize: 13, color: '#555', margin: '0 0 4px' }}>Product: <strong>{selected.productName}</strong></p>}
              {selected.boxType && <p style={{ fontSize: 13, color: '#555', margin: '0 0 4px' }}>Box: <strong>{selected.qty} × {selected.boxType}</strong></p>}
              {selected.deliveryAddress && (
                <p style={{ fontSize: 13, color: '#555', margin: '0 0 4px' }}>Delivery to: <strong>{selected.deliveryAddress}</strong></p>
              )}
            </div>
            <label style={{ fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>Quoted Price per Unit</label>
            <input value={priceInput} onChange={e => setPriceInput(e.target.value)} placeholder="e.g. $1.24/unit"
              style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #E2DDD6', borderRadius: 8, fontSize: 13, outline: 'none', boxSizing: 'border-box', marginBottom: 16 }} />
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
              {['Reviewing', 'Quoted', 'Accepted', 'Rejected'].map(s => (
                <button key={s} onClick={() => handleUpdateQuote(selected, { status: s, quotedPrice: priceInput })}
                  style={{ flex: 1, minWidth: 80, padding: '9px', background: s === 'Quoted' ? G : '#fff', color: s === 'Quoted' ? '#fff' : '#555', border: `1.5px solid ${s === 'Quoted' ? G : '#E2DDD6'}`, borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Analytics ─────────────────────────────────────────────────────────────────
function AnalyticsSection() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const d = await api.get('/admin/analytics');
      setData(d);
    } catch {
      const list = JSON.parse(localStorage.getItem('packagingUsersList') || '[]');
      const orders = list.flatMap(u => u.orders || []);
      setData({
        statusCounts: ['Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => ({ label: s, value: orders.filter(o => o.status === s).length })),
        monthRevenue: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m, i) => ({ label: m, value: (i + 1) * 347 % 3000 })),
        userGrowth: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m, i) => ({ label: m, value: (i * 41 + 7) % 20 })),
      });
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}><RefreshCw size={22} style={{ animation: 'spin 1s linear infinite', color: '#aaa' }} /></div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <h2 style={{ fontSize: 22, fontFamily: 'Outfit,sans-serif', fontWeight: 700 }}>Analytics</h2>
        <button onClick={load} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: G, background: 'none', border: `1px solid ${G}`, borderRadius: 8, padding: '7px 14px', cursor: 'pointer' }}><RefreshCw size={13} /> Refresh</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 20 }}>
        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E2DDD6', padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: '#1A1A1A' }}>Orders by Status</h3>
          <BarChart data={data?.statusCounts || []} color={ACCENT} />
        </div>
        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E2DDD6', padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: '#1A1A1A' }}>Revenue Last 6 Months</h3>
          <BarChart data={data?.monthRevenue || []} color={G} />
        </div>
        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E2DDD6', padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: '#1A1A1A' }}>New Users per Month</h3>
          <BarChart data={data?.userGrowth || []} color="#3B82F6" />
        </div>
      </div>
    </div>
  );
}

// ── Main Admin Page ───────────────────────────────────────────────────────────
export default function Admin() {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (user && user.role !== 'admin') {
      showToast('Access denied.', 'error');
    }
  }, [user, showToast]);

  if (!user || user.role !== 'admin') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: BG }}>
        <div style={{ textAlign: 'center' }}>
          <Ban size={48} color="#DC2626" style={{ marginBottom: 16 }} />
          <p style={{ fontSize: 18, fontWeight: 700, color: '#1A1A1A' }}>Admin access required</p>
          <p style={{ fontSize: 14, color: '#888', marginTop: 8 }}>Login with admin@novapack.com / Admin@123</p>
        </div>
      </div>
    );
  }

  const SECTION_MAP = { dashboard: DashboardSection, orders: OrdersSection, users: UsersSection, products: ProductsSection, industries: IndustriesSection, quotes: QuotesSection, analytics: AnalyticsSection };
  const SectionComp = SECTION_MAP[activeSection] || DashboardSection;

  const handleNavClick = (key) => {
    setActiveSection(key);
    setSidebarOpen(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: BG, display: 'flex', paddingTop: 72 }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200 }} onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className="admin-sidebar" style={{
        width: 220, flexShrink: 0, background: G,
        minHeight: 'calc(100vh - 72px)', position: 'sticky', top: 72,
        display: 'flex', flexDirection: 'column',
        transition: 'transform 0.25s',
      }}>
        <div style={{ padding: '24px 20px 16px' }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 4 }}>Admin Panel</p>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#fff', margin: 0 }}>{user.name}</p>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', margin: '2px 0 0' }}>{user.email}</p>
        </div>
        <nav style={{ flex: 1, padding: '8px 12px' }}>
          {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => handleNavClick(key)}
              style={{
                width: '100%', padding: '11px 14px', borderRadius: 10, border: 'none',
                background: activeSection === key ? 'rgba(255,255,255,0.12)' : 'transparent',
                color: activeSection === key ? '#fff' : 'rgba(255,255,255,0.55)',
                fontWeight: activeSection === key ? 700 : 500,
                fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
                marginBottom: 2, transition: 'all 0.15s', textAlign: 'left',
              }}
              onMouseEnter={e => { if (activeSection !== key) e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; }}
              onMouseLeave={e => { if (activeSection !== key) e.currentTarget.style.background = 'transparent'; }}>
              <Icon size={17} />
              {label}
            </button>
          ))}
        </nav>
        <div style={{ padding: '16px 12px 20px' }}>
          <button onClick={() => { logout(); window.location.href = '/'; }}
            style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: 'none', background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,0,0,0.15)'; e.currentTarget.style.color = '#ff9999'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}>
            <LogOut size={17} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Content */}
      <main style={{ flex: 1, padding: '32px 28px', overflowX: 'hidden', minWidth: 0 }}>
        {/* Mobile hamburger */}
        <button className="admin-hamburger" onClick={() => setSidebarOpen(s => !s)}
          style={{ display: 'none', alignItems: 'center', gap: 8, marginBottom: 20, padding: '8px 14px', background: G, color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
          <Menu size={16} /> Menu
        </button>
        <SectionComp />
      </main>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .admin-sidebar {
            position: fixed !important;
            top: 72px !important;
            left: 0;
            height: calc(100vh - 72px);
            z-index: 300;
            transform: translateX(${sidebarOpen ? '0' : '-100%'}) !important;
          }
          .admin-hamburger { display: flex !important; }
          main { padding: 20px 16px !important; }
        }
        @media (max-width: 480px) {
          main { padding: 16px 12px !important; }
        }
      `}</style>
    </div>
  );
}

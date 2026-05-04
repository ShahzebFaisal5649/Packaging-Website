import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import {
  LayoutDashboard, ShoppingBag, Users, BarChart2, FileText,
  LogOut, TrendingUp, TrendingDown, Edit, Trash2, X, Download,
  RefreshCw, Search, DollarSign, Clock,
  Eye, Mail, Phone, Calendar,
  Shield, Ban, Star, ArrowUpRight,
  Package, Building, Upload, Menu, Plus, MapPin,
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
  Delivered:  { bg: '#DCFCE7', text: '#15803D', icon: <CheckCircle size={12} /> },
  Processing: { bg: '#DBEAFE', text: '#1D4ED8', icon: <RefreshCw size={12} className="spin" /> },
  Shipped:    { bg: '#FEF3C7', text: '#B45309', icon: <Truck size={12} /> },
  Cancelled:  { bg: '#FEE2E2', text: '#B91C1C', icon: <X size={12} /> },
  Quoted:     { bg: '#F0FDF4', text: '#16A34A', icon: <FileText size={12} /> },
  Reviewing:  { bg: '#F5F3FF', text: '#6D28D9', icon: <Eye size={12} /> },
  New:        { bg: '#EFF6FF', text: '#2563EB', icon: <Star size={12} /> },
  Pending:    { bg: '#FAF5FF', text: '#7E22CE', icon: <Clock size={12} /> },
};
function Badge({ status }) {
  const s = STATUS_COLORS[status] || { bg: '#F1F5F9', text: '#475569', icon: null };
  return (
    <span style={{ 
      backgroundColor: s.bg, color: s.text, 
      padding: '5px 12px', borderRadius: 100, 
      fontSize: 11, fontWeight: 700, 
      display: 'inline-flex', alignItems: 'center', gap: 6,
      letterSpacing: '0.02em',
      boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.02)'
    }}>
      {s.icon} {status}
    </span>
  );
}

function Modal({ onClose, title, children, wide }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, zIndex: 100000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(8px)' }} onClick={onClose} />
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        style={{ 
          position: 'relative', backgroundColor: '#fff', borderRadius: 24, padding: 32, 
          width: `min(100%,${wide ? '840px' : '580px'})`, zIndex: 100001, 
          maxHeight: 'min(90vh, 900px)', overflowY: 'auto', 
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
          border: '1px solid #E2E8F0'
        }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <h3 style={{ fontSize: 22, fontFamily: 'Outfit,sans-serif', fontWeight: 800, color: '#0F172A', margin: 0 }}>{title}</h3>
          <button onClick={onClose} style={{ background: '#F1F5F9', border: 'none', cursor: 'pointer', color: '#64748B', padding: 8, borderRadius: 12, transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#E2E8F0'} onMouseLeave={e => e.currentTarget.style.background = '#F1F5F9'}><X size={20} /></button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
}

function BarChart({ data, color = '#3B82F6', label }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div style={{ padding: '0 10px' }}>
      {label && <p style={{ fontSize: 13, fontWeight: 700, color: '#64748B', marginBottom: 20, letterSpacing: '0.02em' }}>{label}</p>}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 160 }}>
        {data.map((d, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, height: '100%', justifyContent: 'flex-end' }}>
            <div style={{ width: '100%', height: `${Math.max((d.value / max) * 90, 4)}%`, background: `linear-gradient(to top, ${color}, ${color}CC)`, borderRadius: '8px 8px 4px 4px', position: 'relative', transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}>
               <div style={{ position: 'absolute', top: -24, left: '50%', transform: 'translateX(-50%)', fontSize: 11, fontWeight: 800, color: '#0F172A' }}>{d.value}</div>
            </div>
            <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%', textAlign: 'center' }}>{d.label}</span>
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
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        const dataUrl = canvas.toDataURL('image/webp', 0.8);
        onChange(dataUrl);
      };
      img.src = e.target.result;
    };
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
  { key: 'dashboard',   label: 'Dashboard',   icon: LayoutDashboard },
  { key: 'orders',      label: 'Orders',      icon: ShoppingBag },
  { key: 'users',       label: 'Users',       icon: Users },
  { key: 'products',    label: 'Products',    icon: Package },
  { key: 'industries',  label: 'Industries',  icon: Building },
  { key: 'quotes',      label: 'Quotes',      icon: FileText },
  { key: 'messages',    label: 'Messages',    icon: Mail },
  { key: 'subscribers', label: 'Subscribers', icon: Star },
  { key: 'analytics',   label: 'Analytics',   icon: BarChart2 },
];

// ── KPI card ──────────────────────────────────────────────────────────────────
// ── KPI card ──────────────────────────────────────────────────────────────────
function KpiCard({ label, value, sub, icon: Icon, trend, up, accent }) {
  const color = accent ? '#3B82F6' : '#10B981';
  return (
    <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #E2E8F0', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02), 0 2px 4px -1px rgba(0,0,0,0.01)', transition: 'all 0.2s ease' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0,0,0,0.05), 0 10px 10px -5px rgba(0,0,0,0.02)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.02), 0 2px 4px -1px rgba(0,0,0,0.01)'; }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ width: 48, height: 48, borderRadius: 14, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: color }}>
          <Icon size={24} />
        </div>
        {trend && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 700, color: up ? '#10B981' : '#EF4444', background: up ? '#D1FAE5' : '#FEE2E2', padding: '4px 10px', borderRadius: 100 }}>
            {up ? <TrendingUp size={14} /> : <TrendingDown size={14} />} {trend}
          </div>
        )}
      </div>
      <div style={{ fontSize: 32, fontWeight: 800, color: '#1E293B', fontFamily: 'Outfit,sans-serif', lineHeight: 1, letterSpacing: '-0.02em' }}>{value}</div>
      <div style={{ fontSize: 14, color: '#64748B', marginTop: 8, fontWeight: 500 }}>{label}</div>
      {sub && <div style={{ fontSize: 12, color: color, fontWeight: 600, marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>{sub}</div>}
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
function DashboardSection() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('Request timeout')), 10000));
        const [s, o] = await Promise.race([
          Promise.all([api.get('/admin/stats'), api.get('/admin/orders')]),
          timeout
        ]);
        if (!cancelled) {
          setStats(s);
          setRecentOrders((o.orders || []).slice(0, 6));
        }
      } catch (err) {
        if (!cancelled) {
          console.warn('Admin stats load failed:', err.message);
          setStats({ totalUsers: 0, totalOrders: 0, revenue: 0, pending: 0, newThisWeek: 0 });
          setRecentOrders([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [refreshKey]);

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#888' }}><RefreshCw size={24} style={{ animation: 'spin 1s linear infinite' }} /></div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 36, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ fontSize: 28, fontFamily: 'Outfit,sans-serif', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>Command Center</h2>
          <p style={{ fontSize: 14, color: '#64748B', marginTop: 4, fontWeight: 500 }}>Overview of your business performance and logistics.</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => setRefreshKey(k => k + 1)} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700, color: '#0F172A', background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '10px 18px', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }} onMouseEnter={e => e.currentTarget.style.borderColor = '#3B82F6'} onMouseLeave={e => e.currentTarget.style.borderColor = '#E2E8F0'}>
            <RefreshCw size={16} className={loading ? 'spin' : ''} /> Synchronize
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 20, marginBottom: 32 }}>
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
          <KpiCard label="Total Revenue" value={`$${(stats?.revenue || 0).toLocaleString()}`} icon={DollarSign} trend="+12.5%" up accent />
        </motion.div>
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
          <KpiCard label="Total Orders" value={stats?.totalOrders || 0} icon={ShoppingBag} trend="+8.2%" up />
        </motion.div>
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
          <KpiCard label="Pending Orders" value={stats?.pending || 0} icon={Clock} trend={stats?.pending > 5 ? 'High' : 'Low'} up={stats?.pending <= 5} accent />
        </motion.div>
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
          <KpiCard label="Active Customers" value={stats?.totalUsers || 0} icon={Users} sub={stats?.newThisWeek ? `+${stats.newThisWeek} new` : 'Steady growth'} trend="+22%" up />
        </motion.div>
      </div>

      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} style={{ background: '#fff', borderRadius: 20, border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: 10, color: '#0F172A' }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3B82F6' }}>
              <ShoppingBag size={18} />
            </div>
            Recent Transactions
          </h3>
          <button style={{ background: 'rgba(59, 130, 246, 0.05)', border: 'none', color: '#3B82F6', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 100 }}>
            Inspect All <ArrowUpRight size={14} />
          </button>
        </div>
        <div className="responsive-table-container">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F8FAFC' }}>
                {['Reference', 'Customer', 'Product', 'Status', 'Amount'].map(h => (
                  <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
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
                  <td style={{ padding: '13px 16px', fontSize: 12, color: '#666' }}>
                    {(o.items && o.items.length > 0) ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <span style={{ fontWeight: 600, color: '#333' }}>{o.items[0].name}</span>
                        {o.items.length > 1 && <span style={{ fontSize: 10, color: '#999' }}>+{o.items.length - 1} more items</span>}
                      </div>
                    ) : (
                      o.product || 'Custom Design'
                    )}
                  </td>
                  <td style={{ padding: '13px 16px' }}><Badge status={o.status} /></td>
                  <td style={{ padding: '13px 16px', fontSize: 13, fontWeight: 700 }}>${(+o.total || 0).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Products ─────────────────────────────────────────────────────────────────
function ProductsSection() {
  const { showToast } = useToast();
  const [products, setProducts] = useState([]);
  const [industryOptions, setIndustryOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editForm, setEditForm] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const emptyForm = { name: '', slug: '', cat: '', description: '', price: '', img: '', featured: false, boxType: '', material: '', finish: '', dimL: '', dimW: '', dimH: '', minQty: '', addons: [], customIndustry: '' };
  // Helper: parse stored dims string like "10×8×4 in" into parts
  const parseDims = (dims = '') => { const m = dims.match(/([\d.]+)[×x]([\d.]+)[×x]([\d.]+)/); return m ? { dimL: m[1], dimW: m[2], dimH: m[3] } : { dimL: '', dimW: '', dimH: '' }; };
  const joinDims = (f) => f.dimL && f.dimW && f.dimH ? `${f.dimL}×${f.dimW}×${f.dimH} in` : '';

  async function loadProducts(showLoader = true) {
    let cancelled = false;
    if (showLoader) setLoading(true);
    try {
      const data = await api.get('/admin/products');
      if (!cancelled) setProducts(data.products || []);
    } catch (err) {
      if (!cancelled) console.error('Failed to load products:', err);
    } finally {
      if (!cancelled && showLoader) setLoading(false);
    }
  }

  async function loadIndustryOptions() {
    let cancelled = false;
    try {
      const data = await api.get('/admin/industries');
      if (!cancelled) setIndustryOptions(data.industries || []);
    } catch (err) {
      if (!cancelled) console.error('Failed to load industry options:', err);
    }
    return () => { cancelled = true; };
  }

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    async function load() {
      setLoading(true);
      try {
        const [productsData, industriesData] = await Promise.all([
          api.get('/admin/products'),
          api.get('/admin/industries'),
        ]);
        if (!cancelled) {
          setProducts(productsData.products || []);
          setIndustryOptions(industriesData.industries || []);
        }
      } catch (err) {
        if (!cancelled) {
          console.warn('Admin products load failed:', err.message);
          setProducts([]);
          setIndustryOptions([]);
          showToast('Failed to load products from database', 'error');
        }
      } finally {
        // Always clear spinner — do NOT gate on cancelled
        clearTimeout(timeout);
        setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; controller.abort(); };
  }, []);

  const handleEdit = (product) => {
    const industryName = product.cat || '';
    const matchedIndustry = industryOptions.find(i => i.name.toLowerCase() === industryName.toLowerCase());
    const dimParts = parseDims(product.dims || '');
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
      dimL: dimParts.dimL,
      dimW: dimParts.dimW,
      dimH: dimParts.dimH,
      minQty: product.minQty || '',
      addons: product.addons || [],
      customIndustry: matchedIndustry ? '' : industryName,
    });
  };

  const autoSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const handleSave = async () => {
    const productData = { ...editForm };
    delete productData.id;
    // Build dims string from individual fields
    productData.dims = joinDims(editForm);
    delete productData.dimL; delete productData.dimW; delete productData.dimH;
    const industryName = editForm.cat === '__other' ? editForm.customIndustry?.trim() : editForm.cat;
    if (!industryName) {
      showToast('Please select or add an industry for this product.', 'warning');
      return;
    }

    if (!productData.slug) productData.slug = autoSlug(productData.name);
    
    // Prevent duplicate slugs on the frontend
    if (editForm.id) {
      if (products.some(p => p._id !== editForm.id && p.slug === productData.slug)) {
        return showToast('A product with this slug already exists. Please use a unique slug.', 'error');
      }
    } else {
      if (products.some(p => p.slug === productData.slug)) {
        return showToast('A product with this slug already exists. Please use a unique slug.', 'error');
      }
    }

    setIsSaving(true);
    let finalIndustry = industryName;

    try {
      const existingIndustry = industryOptions.find(i => i.name.toLowerCase() === industryName.toLowerCase());
      if (!existingIndustry) {
        const autoIndSlug = autoSlug(industryName);
        if (industryOptions.some(i => i.slug === autoIndSlug)) {
           setIsSaving(false);
           return showToast(`An industry with a similar name already exists. Please pick a different name.`, 'error');
        }
        const newIndustry = await api.post('/admin/industries', {
          name: industryName,
          slug: autoIndSlug,
          cat: '',
          description: '',
          img: '',
          products: [],
        });
        finalIndustry = newIndustry.industry?.name || newIndustry.name || industryName;
        setIndustryOptions(prev => [...prev, { name: finalIndustry, slug: autoIndSlug }]);
        showToast(`Created new industry “${finalIndustry}”.`, 'success');
      } else {
        finalIndustry = existingIndustry.name;
      }

      const payload = { ...productData, cat: finalIndustry };
      delete payload.customIndustry;

      if (editForm.id) {
        const updated = await api.put(`/admin/products/${editForm.id}`, payload);
        setProducts(prev => prev.map(p => p._id === editForm.id ? updated.product : p));
      } else {
        const created = await api.post('/admin/products', payload);
        setProducts(prev => [created.product, ...prev]);
      }
      
      setEditForm(null); // Close immediately
      // Background refetch
      loadProducts(false);
      loadIndustryOptions();
    } catch (err) {
      console.error('Failed to save product:', err);
      showToast(err.message || 'Save failed', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/products/${id}`);
      setDeleteConfirm(null);
      loadProducts(false);
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

        <div className="responsive-table-container">
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
              <label style={{ fontSize: 11, fontWeight: 700, color: '#555', display: 'block', marginBottom: 4 }}>Industry *</label>
              <select value={editForm.cat} onChange={e => setEditForm(f => ({ ...f, cat: e.target.value, customIndustry: '' }))} style={inputStyle}>
                <option value="">— Select existing industry —</option>
                {industryOptions.map(ind => <option key={ind._id || ind.name} value={ind.name}>{ind.name}</option>)}
                <option value="__other">Add new industry…</option>
              </select>
              {editForm.cat === '__other' && (
                <input value={editForm.customIndustry} onChange={e => setEditForm(f => ({ ...f, customIndustry: e.target.value }))}
                  placeholder="Type a new industry name" style={{ ...inputStyle, marginTop: 10 }} />
              )}
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
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#555', display: 'block', marginBottom: 8 }}>Dimensions (inches)</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                {[['dimL','Length (L)'],['dimW','Width (W)'],['dimH','Height (H)']].map(([key,lbl]) => (
                  <div key={key}>
                    <label style={{ fontSize: 10, fontWeight: 600, color: '#888', display: 'block', marginBottom: 4 }}>{lbl}</label>
                    <div style={{ position: 'relative' }}>
                      <input type="number" min="0.5" step="0.5" value={editForm[key]}
                        onChange={e => setEditForm(f => ({ ...f, [key]: e.target.value }))}
                        placeholder="e.g. 10" style={{ ...inputStyle, paddingRight: 32, textAlign: 'center' }} />
                      <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 10, color: '#aaa', pointerEvents: 'none' }}>in</span>
                    </div>
                  </div>
                ))}
              </div>
              {editForm.dimL && editForm.dimW && editForm.dimH && (
                <div style={{ marginTop: 8, fontSize: 11, color: '#888', fontStyle: 'italic' }}>Preview: {editForm.dimL}×{editForm.dimW}×{editForm.dimH} in</div>
              )}
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
            <button onClick={handleSave} disabled={isSaving} style={{ flex: 1, padding: '11px', background: isSaving ? '#9CA3AF' : G, color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: isSaving ? 'not-allowed' : 'pointer' }}>
              {isSaving ? 'Saving...' : editForm.id ? 'Save Changes' : 'Add Product'}
            </button>
            <button onClick={() => setEditForm(null)} disabled={isSaving} style={{ flex: 1, padding: '11px', background: '#fff', color: '#666', border: '1px solid #E2DDD6', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: isSaving ? 'not-allowed' : 'pointer' }}>
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
  const [isSaving, setIsSaving] = useState(false);
  const { showToast } = useToast();

  const emptyForm = { name: '', slug: '', cat: '', description: '', img: '', products: [] };

  async function loadIndustries(showLoader = true) {
    let cancelled = false;
    if (showLoader) setLoading(true);
    try {
      const data = await api.get('/admin/industries');
      if (!cancelled) setIndustries(data.industries || []);
    } catch (err) {
      if (!cancelled) console.error('Failed to load industries:', err);
    } finally {
      if (!cancelled && showLoader) setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const data = await api.get('/admin/industries');
        if (!cancelled) setIndustries(data.industries || []);
      } catch (err) {
        if (!cancelled) console.error('Failed to load industries:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

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
    if (!payload.slug) payload.slug = autoSlug(payload.name);

    if (editForm.id) {
      if (industries.some(i => i._id !== editForm.id && i.slug === payload.slug)) {
        return showToast('An industry with this slug already exists.', 'error');
      }
    } else {
      if (industries.some(i => i.slug === payload.slug)) {
        return showToast('An industry with this slug already exists.', 'error');
      }
    }

    setIsSaving(true);
    try {
      if (editForm.id) {
        const updated = await api.put(`/admin/industries/${editForm.id}`, payload);
        setIndustries(prev => prev.map(i => i._id === editForm.id ? updated.industry : i));
      } else {
        const created = await api.post('/admin/industries', payload);
        setIndustries(prev => [created.industry, ...prev]);
      }
      setEditForm(null);
      loadIndustries(false);
    } catch (err) {
      console.error('Failed to save industry:', err);
      showToast(err.message || 'Save failed', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/industries/${id}`);
      setDeleteConfirm(null);
      loadIndustries(false);
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

        <div className="responsive-table-container">
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
            <button onClick={handleSave} disabled={isSaving} style={{ flex: 1, padding: '11px', background: isSaving ? '#9CA3AF' : G, color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: isSaving ? 'not-allowed' : 'pointer' }}>
              {isSaving ? 'Saving...' : editForm.id ? 'Save Changes' : 'Add Industry'}
            </button>
            <button onClick={() => setEditForm(null)} disabled={isSaving} style={{ flex: 1, padding: '11px', background: '#fff', color: '#666', border: '1px solid #E2DDD6', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: isSaving ? 'not-allowed' : 'pointer' }}>
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

  async function load() {
    setLoading(true);
    try {
      const data = await api.get('/admin/orders');
      setOrders(data.orders || []);
    } catch (e) {
      showToast('Failed to load orders: ' + e.message, 'error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;
    async function loadOrders() {
      setLoading(true);
      try {
        const data = await api.get('/admin/orders');
        if (!cancelled) setOrders(data.orders || []);
      } catch (e) {
        if (!cancelled) showToast('Failed to load orders', 'error');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadOrders();
    return () => { cancelled = true; };
  }, []);

  const handleStatusChange = async (order, status) => {
    try {
      if (order.userId && order._id) {
        await api.put(`/admin/orders/${order.userId}/${order._id}`, { status });
      }
      if (selected?._id === order._id) setSelected(prev => ({ ...prev, status }));
      showToast('Order status updated', 'success');
      load();
    } catch (e) { showToast(e.message, 'error'); }
  };

  const handleSaveTracking = async () => {
    if (!selected) return;
    try {
      if (selected.userId && selected._id) {
        await api.put(`/admin/orders/${selected.userId}/${selected._id}`, { tracking: editTracking });
      }
      setSelected(prev => ({ ...prev, tracking: editTracking }));
      showToast('Tracking updated', 'success');
      load();
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
          <div className="responsive-table-container">
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
                    <td style={{ padding: '12px 14px', fontSize: 12, color: '#555' }}>
                      {(o.items && o.items.length > 0) ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <span style={{ fontWeight: 600, color: '#333' }}>{o.items[0].name}</span>
                          {o.items.length > 1 && <span style={{ fontSize: 10, color: '#999' }}>+{o.items.length - 1} items</span>}
                        </div>
                      ) : (
                        o.product || 'Custom Design'
                      )}
                    </td>
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 20 }}>
            {[
              { label: 'Order ID', value: selected.id || selected.orderId, break: true },
              { label: 'Customer', value: selected.userName },
              { label: 'Email', value: selected.userEmail, break: true },
              { label: 'Product', value: (selected.items && selected.items.length > 0) ? selected.items.map(i => i.name).join(', ') : selected.product },
              { label: 'Quantity', value: `${selected.qty} units` },
              { label: 'Total', value: `$${(+selected.total || 0).toFixed(2)}` },
              { label: 'Date', value: selected.date || '—' },
              { label: 'Address', value: selected.address || '—' },
              { label: 'Status', value: <Badge status={selected.status} /> },
            ].map((item) => (
              <div key={item.label} style={{ background: BG, borderRadius: 10, padding: '12px 14px', wordBreak: item.break ? 'break-all' : 'normal' }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>{item.label}</p>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A' }}>{item.value}</div>
              </div>
            ))}
          </div>

          {selected.items?.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#888', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Items Breakdown</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {selected.items.map((it, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: '#FAFAF9', borderRadius: 10, border: '1px solid #F0EDE8' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 6, background: '#fff', overflow: 'hidden', flexShrink: 0, border: '1px solid #eee' }}>
                       <img src={it.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                         onError={e => e.target.src = 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=100'} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 13, fontWeight: 700, margin: 0, color: '#1A1A1A' }}>{it.name}</p>
                      <p style={{ fontSize: 11, color: '#888', margin: '2px 0 0' }}>Quantity: {it.quantity || it.qty} · Unit Price: ${it.price}</p>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: G }}>${((it.price || 0) * (it.quantity || it.qty || 0)).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>Tracking Number</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input value={editTracking} onChange={e => setEditTracking(e.target.value)} placeholder="e.g. UPS1234567890"
                style={{ flex: 1, padding: '10px 12px', border: '1.5px solid #E2DDD6', borderRadius: 8, fontSize: 13, outline: 'none' }} />
              <button onClick={handleSaveTracking} style={{ padding: '10px 18px', background: G, color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Save</button>
            </div>
          </div>

          {/* Customer Location Map */}
          {selected.address && selected.address !== '—' && selected.address !== 'Sample Address' && (
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>Customer Location</label>
              <div style={{ borderRadius: 10, overflow: 'hidden', height: 200, border: '1px solid #E2DDD6' }}>
                <iframe
                  title="Customer Location Map"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(selected.address)}&output=embed&z=13`}
                  width="100%" height="100%"
                  style={{ border: 0, display: 'block' }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          )}

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
  const [showMap, setShowMap] = useState(false);

  // Extract all addresses and login locations for the map
  const allAddresses = users.flatMap(u => {
    const locs = (u.addresses || []).map(a => ({ 
      user: u.name, 
      full: `${a.street || ''}, ${a.city}, ${a.state} ${a.zip}, ${a.country}`,
      type: 'Address'
    }));
    if (u.lastLocation && u.lastLocation.city) {
      locs.push({
        user: u.name,
        full: `${u.lastLocation.city}, ${u.lastLocation.country}`,
        type: 'Login'
      });
    }
    return locs;
  });

  async function load() {
    setLoading(true);
    try {
      const data = await api.get('/admin/users');
      setUsers(data.users || []);
    } catch (e) {
      showToast('Failed to load users: ' + e.message, 'error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;
    async function loadUsers() {
      setLoading(true);
      try {
        const data = await api.get('/admin/users');
        if (!cancelled) setUsers(data.users || []);
      } catch {
        if (!cancelled) showToast('Failed to load users', 'error');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadUsers();
    return () => { cancelled = true; };
  }, []);

  const handleDelete = async (user) => {
    try {
      if (user._id) await api.delete(`/admin/users/${user._id}`);
      setDeleteConfirm(null);
      showToast('User deleted', 'success');
      load();
    } catch (e) { showToast(e.message, 'error'); }
  };

  const handleRoleChange = async (user, role) => {
    try {
      if (user._id) await api.put(`/admin/users/${user._id}`, { role });
      showToast('Role updated', 'success');
      load();
    } catch (e) { showToast(e.message, 'error'); }
  };

  const handleLoyalty = async (user, points) => {
    try {
      if (user._id) await api.put(`/admin/users/${user._id}`, { loyaltyPoints: points });
      setSelected(prev => prev ? { ...prev, loyaltyPoints: points } : null);
      showToast('Loyalty points updated', 'success');
      load();
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
          <button onClick={() => setShowMap(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: G, background: 'none', border: `1px solid ${G}`, borderRadius: 8, padding: '7px 14px', cursor: 'pointer' }}>
            <MapPin size={13} /> View Customer Map
          </button>
          <button onClick={load} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: '#fff', background: G, border: 'none', borderRadius: 8, padding: '7px 14px', cursor: 'pointer' }}>
            <RefreshCw size={13} /> Refresh
          </button>
          <button onClick={exportCSV} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: '#fff', background: G, border: 'none', borderRadius: 8, padding: '7px 16px', cursor: 'pointer' }}>
            <Download size={13} /> Export CSV
          </button>
        </div>
      </div>

      {showMap && (
        <Modal onClose={() => setShowMap(false)} title="Customer Distribution Map" wide>
          <p style={{ fontSize: 13, color: '#666', marginBottom: 16 }}>Showing locations for {allAddresses.length} saved addresses.</p>
          <div style={{ height: 450, borderRadius: 12, overflow: 'hidden', border: '1px solid #E2DDD6', position: 'relative' }}>
            {allAddresses.length > 0 ? (
              <iframe
                title="Customer Map"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(allAddresses[0]?.full || 'USA')}&output=embed&z=4`}
                width="100%" height="100%" style={{ border: 0 }}
              />
            ) : (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f8f8', color: '#aaa' }}>
                No customer locations found
              </div>
            )}
            <div style={{ position: 'absolute', bottom: 16, right: 16, background: '#fff', padding: '10px 16px', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: 11, color: '#666', maxWidth: 200 }}>
              Showing {allAddresses.length} customer locations.
            </div>
          </div>
          <div style={{ marginTop: 16, maxHeight: 150, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
             {allAddresses.map((a, i) => (
               <div key={i} style={{ fontSize: 11, padding: '8px 12px', background: '#f8f8f8', borderRadius: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                   <span style={{ padding: '2px 6px', borderRadius: 4, background: a.type === 'Login' ? '#DBEAFE' : '#D1FAE5', color: a.type === 'Login' ? '#1E40AF' : '#065F46', fontSize: 9, fontWeight: 800 }}>{a.type}</span>
                   <span style={{ fontWeight: 700 }}>{a.user}</span>
                 </div>
                 <span style={{ color: '#666' }}>{a.full}</span>
               </div>
             ))}
          </div>
        </Modal>
      )}

      <div style={{ position: 'relative', marginBottom: 16 }}>
        <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, email, phone…"
          style={{ width: '100%', paddingLeft: 36, paddingRight: 12, paddingTop: 10, paddingBottom: 10, border: '1px solid #E2DDD6', borderRadius: 8, fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
      </div>

      <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E2DDD6', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center' }}><RefreshCw size={22} style={{ animation: 'spin 1s linear infinite', color: '#aaa' }} /></div>
        ) : (
          <div className="responsive-table-container">
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
  const [refreshKey, setRefreshKey] = useState(0);

  const loadQuotes = async (signal = { cancelled: false }) => {
    if (!signal.cancelled) setLoading(true);
    try {
      const data = await api.get('/admin/quotes');
      if (!signal.cancelled) setQuotes(data.quotes || []);
    } catch (e) {
      if (!signal.cancelled) showToast('Failed to load quotes: ' + e.message, 'error');
    } finally {
      if (!signal.cancelled) setLoading(false);
    }
  };

  useEffect(() => {
    let signal = { cancelled: false };
    Promise.resolve().then(() => loadQuotes(signal));
    return () => { signal.cancelled = true; };
  }, [refreshKey]);

  const handleUpdateQuote = async (q, updates) => {
    try {
      if (q.userId && q._id) await api.put(`/admin/quotes/${q.userId}/${q._id}`, updates);
      setSelected(null);
      showToast('Quote updated', 'success');
      loadQuotes();
    } catch (e) { showToast(e.message, 'error'); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ fontSize: 22, fontFamily: 'Outfit,sans-serif', fontWeight: 700 }}>Quote & Sample Requests</h2>
        <button onClick={() => setRefreshKey(k => k + 1)} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: G, background: 'none', border: `1px solid ${G}`, borderRadius: 8, padding: '7px 14px', cursor: 'pointer' }}><RefreshCw size={13} /> Refresh</button>
      </div>
      <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E2DDD6', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center' }}><RefreshCw size={22} style={{ animation: 'spin 1s linear infinite', color: '#aaa' }} /></div>
        ) : (
          <div className="responsive-table-container">
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


// ── Messages ─────────────────────────────────────────────────────────────────
function MessagesSection() {
  const { showToast } = useToast();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    api.get('/admin/contact-messages')
      .then(data => setMessages(data.messages || []))
      .catch(() => showToast('Failed to load messages', 'error'))
      .finally(() => setLoading(false));
  }, []);

  const handleMarkReplied = async (id) => {
    try {
      await api.put(`/admin/contact-messages/${id}`, { status: 'Replied' });
      setMessages(prev => prev.map(m => m._id === id ? { ...m, status: 'Replied' } : m));
      if (selected?._id === id) setSelected(prev => ({ ...prev, status: 'Replied' }));
      showToast('Marked as replied', 'success');
    } catch {
      showToast('Failed to update message', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/contact-messages/${id}`);
      setMessages(prev => prev.filter(m => m._id !== id));
      setSelected(null);
      showToast('Message deleted', 'success');
    } catch {
      showToast('Failed to delete message', 'error');
    }
  };

  const exportCSV = () => {
    const rows = [['Name', 'Email', 'Subject', 'Message', 'Status', 'Date']];
    messages.forEach(m => rows.push([m.name, m.email, m.subject, m.message, m.status, m.createdAt ? new Date(m.createdAt).toLocaleDateString() : '']));
    const csv = rows.map(r => r.map(v => `"${(v || '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const a = document.createElement('a'); a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv); a.download = 'messages.csv'; a.click();
  };

  const filtered = messages.filter(m => !search || [m.name, m.email, m.subject].some(v => v && v.toLowerCase().includes(search.toLowerCase())));
  const newCount = messages.filter(m => m.status === 'New').length;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <h2 style={{ fontSize: 22, fontFamily: 'Outfit,sans-serif', fontWeight: 700 }}>Contact Messages</h2>
          {newCount > 0 && <span style={{ padding: '3px 10px', borderRadius: 100, background: '#DBEAFE', color: '#1E40AF', fontSize: 12, fontWeight: 700 }}>{newCount} New</span>}
        </div>
        <button onClick={exportCSV} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: '#fff', background: G, border: 'none', borderRadius: 8, padding: '7px 16px', cursor: 'pointer' }}><Download size={13} /> Export CSV</button>
      </div>

      <div style={{ position: 'relative', marginBottom: 16 }}>
        <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search messages…" style={{ width: '100%', paddingLeft: 36, paddingRight: 12, paddingTop: 9, paddingBottom: 9, border: '1px solid #E2DDD6', borderRadius: 8, fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
      </div>

      <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E2DDD6', overflow: 'hidden' }}>
        <div className="responsive-table-container">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#FAFAF9' }}>
                {['Name', 'Email', 'Subject', 'Date', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '11px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: 32, textAlign: 'center', color: '#aaa' }}>{loading ? 'Loading messages…' : 'No messages yet. They will appear here when users submit the contact form.'}</td></tr>
              ) : filtered.map((m, i) => (
                <tr key={m._id || i} style={{ borderTop: '1px solid #F0EDE8' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#FAFAF9'}
                  onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                  <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 600, color: '#1A1A1A' }}>{m.name}</td>
                  <td style={{ padding: '12px 14px', fontSize: 12, color: '#555', wordBreak: 'break-all' }}>{m.email}</td>
                  <td style={{ padding: '12px 14px', fontSize: 12, color: '#555' }}>{m.subject}</td>
                  <td style={{ padding: '12px 14px', fontSize: 11, color: '#888', whiteSpace: 'nowrap' }}>{m.createdAt ? new Date(m.createdAt).toLocaleDateString() : '—'}</td>
                  <td style={{ padding: '12px 14px' }}><Badge status={m.status || 'New'} /></td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => setSelected(m)}
                        style={{ padding: '5px 10px', borderRadius: 6, border: `1px solid ${G}`, color: G, background: 'none', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                        <Eye size={11} />
                      </button>
                      {m.status !== 'Replied' && (
                        <button onClick={() => handleMarkReplied(m._id)}
                          style={{ padding: '5px 10px', borderRadius: 6, border: '1px solid #D1FAE5', color: '#065F46', background: 'none', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                          ✓
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <Modal onClose={() => setSelected(null)} title={`Message from ${selected.name}`} wide>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 20 }}>
            {[
              { label: 'From', value: selected.name },
              { label: 'Email', value: selected.email },
              { label: 'Phone', value: selected.phone || '—' },
              { label: 'Company', value: selected.company || '—' },
              { label: 'Subject', value: selected.subject },
              { label: 'Date', value: selected.createdAt ? new Date(selected.createdAt).toLocaleString() : '—' },
            ].map(({ label, value }) => (
              <div key={label} style={{ background: BG, borderRadius: 10, padding: '10px 14px' }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>{label}</p>
                <p style={{ fontSize: 13, color: '#1A1A1A', fontWeight: 600, margin: 0, wordBreak: 'break-all' }}>{value}</p>
              </div>
            ))}
          </div>
          <div style={{ background: BG, borderRadius: 10, padding: '16px', marginBottom: 20 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px' }}>Message</p>
            <p style={{ fontSize: 14, color: '#333', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap' }}>{selected.message}</p>
          </div>
          {selected.interests?.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Interested In</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {selected.interests.map(i => <span key={i} style={{ padding: '4px 10px', borderRadius: 100, background: `${ACCENT}15`, color: ACCENT, fontSize: 12, fontWeight: 700 }}>{i}</span>)}
              </div>
            </div>
          )}
          <div style={{ display: 'flex', gap: 10, paddingTop: 16, borderTop: '1px solid #F0EDE8' }}>
            {selected.status !== 'Replied' && (
              <button onClick={() => handleMarkReplied(selected._id)} style={{ flex: 1, padding: '10px', background: G, color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>Mark as Replied</button>
            )}
            <a href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject || '')}`}
              style={{ flex: 1, padding: '10px', background: ACCENT, color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <Mail size={14} /> Reply via Email
            </a>
            <button onClick={() => handleDelete(selected._id)} style={{ padding: '10px 16px', background: '#FEE2E2', color: '#DC2626', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}><Trash2 size={14} /></button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Subscribers ───────────────────────────────────────────────────────────────
function SubscribersSection() {
  const { showToast } = useToast();
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    api.get('/admin/subscribers')
      .then(data => setSubscribers(data.subscribers || []))
      .catch(() => showToast('Failed to load subscribers', 'error'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/subscribers/${id}`);
      setSubscribers(prev => prev.filter(s => s._id !== id));
      showToast('Subscriber removed', 'success');
    } catch {
      showToast('Failed to remove subscriber', 'error');
    }
  };

  const exportCSV = () => {
    const rows = [['Email', 'Date Subscribed']];
    subscribers.forEach(s => rows.push([s.email, s.createdAt ? new Date(s.createdAt).toLocaleDateString() : '']));
    const csv = rows.map(r => r.map(v => `"${(v || '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const a = document.createElement('a'); a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv); a.download = 'subscribers.csv'; a.click();
  };

  const filtered = subscribers.filter(s => !search || s.email?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <h2 style={{ fontSize: 22, fontFamily: 'Outfit,sans-serif', fontWeight: 700 }}>Newsletter Subscribers</h2>
          <span style={{ padding: '3px 10px', borderRadius: 100, background: `${G}15`, color: G, fontSize: 12, fontWeight: 700 }}>{subscribers.length} total</span>
        </div>
        <button onClick={exportCSV} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: '#fff', background: G, border: 'none', borderRadius: 8, padding: '7px 16px', cursor: 'pointer' }}><Download size={13} /> Export CSV</button>
      </div>

      <div style={{ position: 'relative', marginBottom: 16 }}>
        <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search subscribers…" style={{ width: '100%', paddingLeft: 36, paddingRight: 12, paddingTop: 9, paddingBottom: 9, border: '1px solid #E2DDD6', borderRadius: 8, fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
      </div>

      <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E2DDD6', overflow: 'hidden' }}>
        <div className="responsive-table-container">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#FAFAF9' }}>
                {['#', 'Email Address', 'Date Subscribed', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '11px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={4} style={{ padding: 32, textAlign: 'center', color: '#aaa' }}>{loading ? 'Loading subscribers…' : 'No subscribers yet. They will appear here when users subscribe via the footer form.'}</td></tr>
              ) : filtered.map((s, i) => (
                <tr key={s._id || i} style={{ borderTop: '1px solid #F0EDE8' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#FAFAF9'}
                  onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                  <td style={{ padding: '12px 14px', fontSize: 12, color: '#888' }}>{i + 1}</td>
                  <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 600, color: '#1A1A1A' }}>{s.email}</td>
                  <td style={{ padding: '12px 14px', fontSize: 12, color: '#888' }}>{s.createdAt ? new Date(s.createdAt).toLocaleDateString() : '—'}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <button onClick={() => handleDelete(s._id)}
                      style={{ padding: '5px 10px', borderRadius: 6, border: '1px solid #FEE2E2', color: '#DC2626', background: 'none', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                      <Trash2 size={11} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Analytics ─────────────────────────────────────────────────────────────
function AnalyticsSection() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    setLoading(true);
    api.get('/admin/analytics')
      .then(res => setData(res))
      .catch(() => showToast('Failed to load analytics', 'error'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 60, textAlign: 'center' }}><RefreshCw size={32} style={{ animation: 'spin 1s linear infinite', color: '#aaa' }} /></div>;
  if (!data) return <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>No data available</div>;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <h2 style={{ fontSize: 22, fontFamily: 'Outfit,sans-serif', fontWeight: 700, marginBottom: 24 }}>Advanced Analytics</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 24, marginBottom: 32 }}>
        
        {/* Revenue Chart */}
        <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #E2E8F0', padding: 28, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10, color: '#1E293B' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}>
              <DollarSign size={18} />
            </div>
            Monthly Revenue
          </h3>
          <BarChart data={data.monthRevenue || []} color="#10B981" label="Revenue (USD)" />
        </div>

        {/* User Growth Chart */}
        <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #E2E8F0', padding: 28, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10, color: '#1E293B' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3B82F6' }}>
              <Users size={18} />
            </div>
            Customer Acquisition
          </h3>
          <BarChart data={data.userGrowth || []} color="#3B82F6" label="New Signups" />
        </div>

      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginBottom: 32 }}>
        
        {/* Order Status Distribution */}
        <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #E2E8F0', padding: 28, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 24, color: '#1E293B' }}>Fulfillment Pulse</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {data.statusCounts?.map((s, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
                  <span style={{ fontWeight: 600, color: '#64748B' }}>{s.label}</span>
                  <span style={{ fontWeight: 800, color: '#1E293B' }}>{s.value}</span>
                </div>
                <div style={{ height: 10, background: '#F1F5F9', borderRadius: 100, overflow: 'hidden' }}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (s.value / (data.statusCounts.reduce((a,b)=>a+b.value, 0) || 1)) * 100)}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    style={{ height: '100%', background: s.label === 'Delivered' ? '#10B981' : (s.label === 'Cancelled' ? '#EF4444' : '#3B82F6'), borderRadius: 100 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Customer Map */}
        <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #E2E8F0', padding: 28, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10, color: '#1E293B' }}>
            <MapPin size={20} color="#3B82F6" /> Market Presence
          </h3>
          <p style={{ fontSize: 13, color: '#64748B', marginBottom: 20 }}>Geospatial density of your customer base.</p>
          <div style={{ height: 220, borderRadius: 16, overflow: 'hidden', border: '1px solid #E2E8F0' }}>
            {data.locations && data.locations.length > 0 ? (
              <iframe
                title="Global Distribution Map"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(data.locations[0].city || 'USA')}&output=embed&z=3`}
                width="100%" height="100%" style={{ border: 0 }}
              />
            ) : (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC', color: '#94A3B8', fontSize: 13 }}>
                Waiting for data...
              </div>
            )}
          </div>
          <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: '#3B82F6', background: 'rgba(59, 130, 246, 0.1)', padding: '4px 10px', borderRadius: 100 }}>{data.locations?.length || 0} Markets</span>
            <span style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>Live Feed</span>
          </div>
        </div>

        {/* Average Order Value */}
        <div style={{ background: 'linear-gradient(135deg, #0F172A, #1E293B)', borderRadius: 20, padding: 28, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', color: '#fff', boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.2)' }}>
             <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', margin: 0, fontWeight: 600 }}>Avg. Transaction Value</p>
             <h4 style={{ fontSize: 44, fontWeight: 900, color: '#fff', fontFamily: 'Outfit,sans-serif', margin: '12px 0', letterSpacing: '-0.03em' }}>
               ${((data.monthRevenue?.reduce((a,b)=>a+b.value, 0) || 0) / (data.statusCounts?.reduce((a,b)=>a+b.value, 0) || 1)).toFixed(2)}
             </h4>
             <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: 'rgba(16, 185, 129, 0.2)', color: '#34D399', borderRadius: 100, fontSize: 12, fontWeight: 700, alignSelf: 'center' }}>
               <TrendingUp size={14} /> +8.4%
             </div>
        </div>

      </div>
    </motion.div>
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
          <p style={{ fontSize: 14, color: '#888', marginTop: 8 }}>Login with admin@designcustombox.com / Admin@123</p>
        </div>
      </div>
    );
  }

  const SECTION_MAP = { dashboard: DashboardSection, orders: OrdersSection, users: UsersSection, products: ProductsSection, industries: IndustriesSection, quotes: QuotesSection, messages: MessagesSection, subscribers: SubscribersSection, analytics: AnalyticsSection };
  const SectionComp = SECTION_MAP[activeSection] || DashboardSection;

  const handleNavClick = (key) => {
    setActiveSection(key);
    setSidebarOpen(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', display: 'flex' }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200 }} onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`} style={{
        width: 260, flexShrink: 0, background: '#0F172A',
        minHeight: 'calc(100vh - var(--nav-h))', position: 'sticky', top: 'var(--nav-h)',
        display: 'flex', flexDirection: 'column',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        borderRight: '1px solid rgba(255,255,255,0.05)',
        zIndex: 1001,
        boxShadow: '10px 0 40px rgba(0,0,0,0.1)',
      }}>
        <div style={{ padding: '32px 24px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #3B82F6, #1E40AF)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 18 }}>
              {user.name[0]}
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#fff', margin: 0 }}>{user.name}</p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', margin: '2px 0 0', fontWeight: 500 }}>System Administrator</p>
            </div>
          </div>
        </div>
        <nav style={{ flex: 1, padding: '8px 16px' }}>
          {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => handleNavClick(key)}
              style={{
                width: '100%', padding: '12px 16px', borderRadius: 12, border: 'none',
                background: activeSection === key ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                color: activeSection === key ? '#60A5FA' : 'rgba(255,255,255,0.65)',
                fontSize: 14, fontWeight: 600, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 12,
                transition: 'all 0.2s ease',
                marginBottom: 4,
              }}
              onMouseEnter={e => { if (activeSection !== key) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { if (activeSection !== key) e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; }}>
              <Icon size={18} style={{ opacity: activeSection === key ? 1 : 0.7 }} />
              {label}
            </button>
          ))}
        </nav>
        <div style={{ padding: '16px 16px 24px' }}>
          <button onClick={() => { logout(); window.location.href = '/'; }}
            style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: 'none', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)'; e.currentTarget.style.color = '#F87171'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}>
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Content */}
      <main style={{ flex: 1, padding: '40px 48px', overflowX: 'hidden', minWidth: 0 }}>
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
            top: 0 !important;
            left: 0;
            width: 280px !important;
            max-width: 85% !important;
            height: 100vh !important;
            z-index: 10001;
            transform: translateX(${sidebarOpen ? '0' : '-100%'}) !important;
            box-shadow: ${sidebarOpen ? '20px 0 60px rgba(0,0,0,0.5)' : 'none'};
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

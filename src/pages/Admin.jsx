import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import Button from '../components/Button';
import {
  LayoutDashboard, ShoppingBag, Users, BarChart2, FileText,
  LogOut, TrendingUp, TrendingDown, Edit, Trash2, X, Download,
  RefreshCw, Search, DollarSign, Clock,
  Eye, Mail, Phone, Calendar,
  Shield, Ban, Star, ArrowUpRight,
  Package, Building, Upload, Menu, Plus, MapPin,
  CheckCircle, Truck, ChevronDown, Filter, Layers,
  Bell, BellRing, Settings
} from 'lucide-react';

const G = '#1A4D2E';
const ACCENT = '#C8860A';
const BG = '#F5F2ED';

const BOX_TYPES = ['Mailer Box', 'Shipping Box', 'Rigid Box', 'Folding Carton', 'Sleeve Box', 'Display Box', 'Kraft Box', 'Gable Box'];
const MATERIALS = ['Corrugated E-Flute', 'Corrugated B-Flute', 'Kraft', 'SBS Board', 'Rigid Chipboard'];
const FINISHES = ['Matte Lam', 'Gloss Lam', 'Uncoated', 'Soft-Touch', 'Foil Stamp'];
const ADDON_OPTIONS = ['Spot UV', 'Embossing', 'Debossing', 'Foil Stamping', 'Window Patch', 'Hang Tab', 'Ribbon Pull', 'Magnetic Closure', 'Inside Printing', 'Custom Die-Cut'];

// ── helpers ───────────────────────────────────────────────────────────────────
class SectionErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Admin Section Error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, textAlign: 'center', background: '#FEF2F2', borderRadius: 16, border: '1px solid #FECACA' }}>
          <Ban size={40} color="#DC2626" style={{ marginBottom: 16 }} />
          <h3 style={{ fontSize: 18, fontWeight: 800, color: '#991B1B', margin: 0 }}>Section Unavailable</h3>
          <p style={{ fontSize: 14, color: '#B91C1C', marginTop: 8 }}>This part of the admin panel encountered an error. Please try refreshing.</p>
          <button onClick={() => this.setState({ hasError: false })} style={{ marginTop: 20, padding: '8px 20px', background: '#DC2626', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700 }}>Retry Section</button>
        </div>
      );
    }
    return this.props.children;
  }
}

const STATUS_COLORS = {
  Delivered: { bg: '#DCFCE7', text: '#15803D', icon: <CheckCircle size={12} /> },
  Processing: { bg: '#DBEAFE', text: '#1D4ED8', icon: <RefreshCw size={12} className="spin" /> },
  Shipped: { bg: '#FEF3C7', text: '#B45309', icon: <Truck size={12} /> },
  Cancelled: { bg: '#FEE2E2', text: '#B91C1C', icon: <X size={12} /> },
  Quoted: { bg: '#F0FDF4', text: '#16A34A', icon: <FileText size={12} /> },
  Reviewing: { bg: '#F5F3FF', text: '#6D28D9', icon: <Eye size={12} /> },
  New: { bg: '#EFF6FF', text: '#2563EB', icon: <Star size={12} /> },
  Pending: { bg: '#FAF5FF', text: '#7E22CE', icon: <Clock size={12} /> },
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

function Pagination({ total, limit, current, onChange }) {
  const pages = Math.ceil(total / limit);
  if (pages <= 1) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 24, padding: '10px 0' }}>
      <button 
        disabled={current === 1} 
        onClick={() => onChange(current - 1)}
        style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #E2E8F0', background: '#fff', cursor: current === 1 ? 'not-allowed' : 'pointer', opacity: current === 1 ? 0.5 : 1, fontSize: 13, fontWeight: 700 }}
      >
        Prev
      </button>
      {[...Array(pages)].map((_, i) => (
        <button 
          key={i} 
          onClick={() => onChange(i + 1)}
          style={{ 
            width: 36, height: 36, borderRadius: 8, border: 'none', 
            background: current === i + 1 ? G : 'transparent', 
            color: current === i + 1 ? '#fff' : '#64748B',
            fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s'
          }}
        >
          {i + 1}
        </button>
      ))}
      <button 
        disabled={current === pages} 
        onClick={() => onChange(current + 1)}
        style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #E2E8F0', background: '#fff', cursor: current === pages ? 'not-allowed' : 'pointer', opacity: current === pages ? 0.5 : 1, fontSize: 13, fontWeight: 700 }}
      >
        Next
      </button>
    </div>
  );
}

function RoleBadge({ role }) {
  if (role === 'super_admin') {
    return (
      <span style={{ backgroundColor: '#FFF7ED', color: '#C2410C', border: '1px solid #FDBA74', padding: '2px 10px', borderRadius: 100, fontSize: 10, fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
        <Shield size={10} fill="#C2410C" /> SUPER ADMIN
      </span>
    );
  }
  if (role === 'admin') {
    return (
      <span style={{ backgroundColor: '#F0FDF4', color: '#15803D', border: '1px solid #86EFAC', padding: '2px 10px', borderRadius: 100, fontSize: 10, fontWeight: 800 }}>
        ADMIN
      </span>
    );
  }
  return null;
}

function Modal({ onClose, title, children, wide }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, zIndex: 100000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(8px)' }} onClick={onClose} />
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        style={{ position: 'relative', background: '#fff', borderRadius: 20, width: '100%', maxWidth: wide ? 1000 : 540, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', border: '1px solid #E2E8F0' }}
      >
        <div style={{ position: 'sticky', top: 0, background: '#fff', padding: '20px 24px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
          <h2 style={{ fontSize: 20, fontFamily: 'Outfit,sans-serif', fontWeight: 800, color: G, margin: 0 }}>{title}</h2>
          <button onClick={onClose} style={{ background: '#F1F5F9', border: 'none', width: 32, height: 32, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748B' }}><X size={18} /></button>
        </div>
        <div style={{ padding: 24 }}>{children}</div>
      </motion.div>
    </motion.div>
  );
}


function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.get('/notifications');
        setNotifications(data.notifications || []);
      } catch (e) { console.error(e); }
    };
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const click = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', click);
    return () => document.removeEventListener('mousedown', click);
  }, []);

  const unread = notifications.filter(n => !n.isRead).length;

  const handleMarkRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (e) { }
  };

  const handleClearAll = async () => {
    try {
      await api.delete('/notifications/all');
      setNotifications([]);
      // Ensure local state reflects empty notifications for immediate UI feedback
      if (window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent('notifications-cleared'));
      }
    } catch (e) { }
  };

  const handleDismiss = async (e, id) => {
    e.stopPropagation();
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n._id !== id));
    } catch (e) { }
  };

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <button onClick={() => setOpen(!open)} style={{ position: 'relative', background: '#fff', border: '1px solid #E2E8F0', padding: 10, borderRadius: 12, cursor: 'pointer', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Bell size={20} />
        {unread > 0 && (
          <span style={{ position: 'absolute', top: -4, right: -4, background: '#EF4444', color: '#fff', fontSize: 10, fontWeight: 800, width: 18, height: 18, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #F8FAFC' }}>
            {unread}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }}
            style={{ position: 'absolute', top: '100%', right: 0, marginTop: 12, width: 340, background: '#fff', borderRadius: 16, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)', border: '1px solid #E2E8F0', zIndex: 1000, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC' }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: '#0F172A' }}>Notifications</span>
              <div style={{ display: 'flex', gap: 12 }}>
                {unread > 0 && <button onClick={handleMarkRead} style={{ background: 'none', border: 'none', color: '#3B82F6', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>Mark all read</button>}
                {notifications.length > 0 && <button onClick={handleClearAll} style={{ background: 'none', border: 'none', color: '#EF4444', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>Clear all</button>}
              </div>
            </div>
            <div style={{ maxHeight: 400, overflowY: 'auto', padding: 8 }}>
              {notifications.length === 0 ? (
                <div style={{ padding: '40px 20px', textAlign: 'center', color: '#94A3B8' }}>
                  <BellRing size={32} style={{ marginBottom: 12, opacity: 0.2 }} />
                  <p style={{ fontSize: 13, fontWeight: 500, margin: 0 }}>All caught up!</p>
                </div>
              ) : (
                notifications.map(n => (
                  <div key={n._id} style={{ position: 'relative', padding: '12px 16px', borderRadius: 12, background: n.isRead ? 'transparent' : 'rgba(59, 130, 246, 0.03)', borderBottom: '1px solid #F1F5F9', cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'} onMouseLeave={e => e.currentTarget.style.background = n.isRead ? 'transparent' : 'rgba(59, 130, 246, 0.03)'}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#1E293B', margin: '0 0 4px' }}>{n.title}</p>
                    <p style={{ fontSize: 12, color: '#64748B', margin: '0 0 6px', lineHeight: 1.5 }}>{n.message}</p>
                    <span style={{ fontSize: 10, color: '#94A3B8', fontWeight: 600 }}>{new Date(n.createdAt).toLocaleDateString()}</span>
                    <button onClick={(e) => handleDismiss(e, n._id)} style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', color: '#CBD5E1', cursor: 'pointer', padding: 4 }}>
                      <X size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
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
  { key: 'dashboard', label: 'Command Center', icon: LayoutDashboard },
  { key: 'orders', label: 'Order Pipeline', icon: ShoppingBag },
  { key: 'quotes', label: 'Sample Quotes', icon: FileText },
  { key: 'users', label: 'Customer Base', icon: Users },
  { key: 'products', label: 'Product Catalog', icon: Package },
  { key: 'industries', label: 'Industry Hub', icon: Building },
  { key: 'messages', label: 'Inquiries', icon: Mail },
  { key: 'loyalty', label: 'Loyalty Logic', icon: Star },
  { key: 'analytics', label: 'Analytics', icon: BarChart2 },
  { key: 'settings', label: 'Global Settings', icon: Settings },
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
      <div style={{ fontSize: 32, fontWeight: 800, color: '#1E293B', fontFamily: 'Outfit,sans-serif', lineHeight: 1, letterSpacing: '-0.02em' }}>{value || 0}</div>
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
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    // Show cached stats immediately — no flicker to zero
    const cached = sessionStorage.getItem('dcb_admin_stats');
    if (cached) {
      try { setStats(JSON.parse(cached)); } catch (e) { }
    }

    let cancelled = false;
    setLoading(true);

    const load = async () => {
      try {
        const [statsData, ordersData] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/orders?limit=6')
        ]);
        if (!cancelled) {
          setStats(statsData);
          setRecentOrders(ordersData.orders || []);
          sessionStorage.setItem('dcb_admin_stats', JSON.stringify(statsData));
        }
      } catch (err) {
        if (!cancelled) console.error('Dashboard load failed:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [refreshKey]);

  const filteredOrders = recentOrders.filter(o => {
    return !search || [o.id, o.orderId, o.userName, o.userEmail].some(v => v && String(v).toLowerCase().includes(search.toLowerCase()));
  });

  const paginatedOrders = filteredOrders.slice((page - 1) * limit, page * limit);

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#888' }}><RefreshCw size={24} style={{ animation: 'spin 1s linear infinite' }} /></div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 36, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ fontSize: 28, fontFamily: 'Outfit,sans-serif', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>Command Center</h2>
          <p style={{ fontSize: 14, color: '#64748B', marginTop: 4, fontWeight: 500 }}>Overview of your business performance and logistics.</p>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <AdminNotifications />
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
        <div style={{ padding: '24px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: 10, color: '#0F172A' }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3B82F6' }}>
              <ShoppingBag size={18} />
            </div>
            Recent Transactions
          </h3>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ position: 'relative', width: 220 }}>
              <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search orders…" 
                style={{ width: '100%', paddingLeft: 36, paddingRight: 12, paddingTop: 8, paddingBottom: 8, border: '1px solid #E2E8F0', borderRadius: 100, fontSize: 12, outline: 'none' }} />
            </div>
            <button style={{ background: 'rgba(59, 130, 246, 0.05)', border: 'none', color: '#3B82F6', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 100 }}>
              Inspect All <ArrowUpRight size={14} />
            </button>
          </div>
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
              {paginatedOrders.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: 24, textAlign: 'center', color: '#aaa', fontSize: 13 }}>No orders yet</td></tr>
              ) : paginatedOrders.map((o, i) => {
                if (!o) return null;
                return (
                  <tr key={i} style={{ borderTop: '1px solid #F0EDE8' }}>
                    <td style={{ padding: '13px 16px', fontSize: 13, fontWeight: 700, color: G }}>{o.id || o.orderId || '—'}</td>
                    <td style={{ padding: '13px 16px', fontSize: 13, color: '#1A1A1A' }}>{o.userName || 'Guest'}</td>
                    <td style={{ padding: '13px 16px', fontSize: 12, color: '#666' }}>
                      {(o.items && o.items.length > 0) ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <span style={{ fontWeight: 600, color: '#333' }}>{o.items[0]?.name || 'Product'}</span>
                          {o.items.length > 1 && <span style={{ fontSize: 10, color: '#999' }}>+{o.items.length - 1} more items</span>}
                        </div>
                      ) : (
                        o.product || 'Custom Design'
                      )}
                    </td>
                    <td style={{ padding: '13px 16px' }}><Badge status={o.status} /></td>
                    <td style={{ padding: '13px 16px', fontSize: 13, fontWeight: 700 }}>${(+o.total || 0).toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{ padding: '0 24px 24px' }}>
          <Pagination 
            total={filteredOrders.length} 
            limit={limit} 
            current={page} 
            onChange={setPage} 
          />
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
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'featured'
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 10;

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
    // If editing existing product — never create a new industry
    // If creating new product and '__new' selected — create industry
    let finalCat = editForm.cat;
    if (editForm.cat === '__new') {
      if (!editForm.id) {
        // New product — create industry
        setIsSaving(true);
        try {
          const newInd = await api.post('/admin/industries', { name: editForm.customIndustry, slug: autoSlug(editForm.customIndustry) });
          finalCat = newInd.industry?.name || editForm.customIndustry;
          setIndustryOptions(prev => [...prev, { name: finalCat, slug: autoSlug(finalCat) }]);
        } catch (e) {
          showToast('Failed to create industry', 'error');
          setIsSaving(false);
          return;
        }
      } else {
        showToast('Select an existing industry or create one separately from the Industries tab.', 'warning');
        return;
      }
    }

    if (!finalCat) {
      showToast('Please select an industry.', 'warning');
      return;
    }

    const productData = { ...editForm, cat: finalCat };
    delete productData.id;
    delete productData.customIndustry;
    productData.dims = joinDims(editForm);
    delete productData.dimL; delete productData.dimW; delete productData.dimH;

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
    try {
      if (editForm.id) {
        const updated = await api.put(`/admin/products/${editForm.id}`, productData);
        setProducts(prev => prev.map(p => p._id === editForm.id ? updated.product : p));
      } else {
        const created = await api.post('/admin/products', productData);
        setProducts(prev => [created.product, ...prev]);
      }

      setEditForm(null); // Close immediately
      loadProducts(false);
    } catch (err) {
      console.error('Failed to save product:', err);
      showToast(err.message || 'Save failed', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    setIsDeleting(true);
    try {
      await api.delete(`/admin/products/${id}`);
      setDeleteConfirm(null);
      showToast('Product deleted');
      loadProducts(false);
    } catch (err) {
      console.error('Failed to delete product:', err);
      showToast(err.message || 'Delete failed', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || (p.cat || '').toLowerCase().includes(search.toLowerCase());
    const matchesFeatured = showFeaturedOnly ? p.featured === true : true;
    if (activeTab === 'featured') return matchesSearch && p.featured;
    return matchesSearch && matchesFeatured;
  });

  const paginated = filtered.slice((page - 1) * limit, page * limit);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', gap: 24, borderBottom: '1px solid #E2DDD6', paddingBottom: 0 }}>
          {['all', 'featured'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{ padding: '12px 4px', background: 'none', border: 'none', borderBottom: `2px solid ${activeTab === tab ? G : 'transparent'}`, color: activeTab === tab ? G : '#64748B', fontWeight: 700, fontSize: 15, cursor: 'pointer', textTransform: 'capitalize', transition: 'all 0.2s' }}>
              {tab === 'all' ? 'All Products' : 'Featured'} ({tab === 'all' ? products.length : products.filter(p => p.featured).length})
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => setShowFeaturedOnly(f => !f)}
            style={{
              padding: '9px 16px', fontSize: 13, fontWeight: 700,
              border: `1.5px solid ${G}`,
              background: showFeaturedOnly ? G : '#fff',
              color: showFeaturedOnly ? '#fff' : G,
              borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6
            }}
          >
            <Star size={13} fill={showFeaturedOnly ? '#fff' : 'none'} />
            {showFeaturedOnly ? 'Showing Featured' : 'Show Featured Only'}
          </button>
          <button onClick={() => setEditForm(emptyForm)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: '#fff', background: G, border: 'none', borderRadius: 8, padding: '9px 18px', cursor: 'pointer' }}>
            <Plus size={14} /> Add Product
          </button>
        </div>
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
              ) : paginated.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: 32, textAlign: 'center', color: '#aaa' }}>No products found</td></tr>
              ) : paginated.map((p) => (
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

      <Pagination 
        total={filtered.length} 
        limit={limit} 
        current={page} 
        onChange={setPage} 
      />

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
              <select
                value={editForm.cat === '__new' ? '__new' : editForm.cat}
                onChange={e => setEditForm(f => ({ ...f, cat: e.target.value, customIndustry: '' }))}
                style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #E2DDD6', borderRadius: 8, fontSize: 13, background: '#fff', outline: 'none' }}
              >
                <option value="">— Select Industry —</option>
                {industryOptions.map(i => (
                  <option key={i._id} value={i.name}>{i.name}</option>
                ))}
                <option value="__new">+ Create New Industry</option>
              </select>
              {editForm.cat === '__new' && (
                <input
                  placeholder="New industry name"
                  value={editForm.customIndustry || ''}
                  onChange={e => setEditForm(f => ({ ...f, customIndustry: e.target.value }))}
                  style={{ marginTop: 8, width: '100%', padding: '10px 12px', border: '1.5px solid #E2DDD6', borderRadius: 8, fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                />
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
                {[['dimL', 'Length (L)'], ['dimW', 'Width (W)'], ['dimH', 'Height (H)']].map(([key, lbl]) => (
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
            <Button onClick={handleSave} loading={isSaving} style={{ flex: 1 }}>
              {editForm.id ? 'Save Changes' : 'Add Product'}
            </Button>
            <Button variant="outline" onClick={() => setEditForm(null)} disabled={isSaving} style={{ flex: 1 }}>
              Cancel
            </Button>
          </div>
        </Modal>
      )}

      {deleteConfirm && (
        <Modal onClose={() => setDeleteConfirm(null)} title="Delete Product">
          <p style={{ color: '#555', fontSize: 14, marginBottom: 20 }}>Are you sure? This cannot be undone.</p>
          <div style={{ display: 'flex', gap: 10 }}>
            <Button variant="danger" onClick={() => handleDelete(deleteConfirm)} loading={isDeleting} style={{ flex: 1 }}>
              Delete
            </Button>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)} disabled={isDeleting} style={{ flex: 1 }}>
              Cancel
            </Button>
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
  const [page, setPage] = useState(1);
  const limit = 10;
  const [editForm, setEditForm] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
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
    setIsDeleting(true);
    try {
      await api.delete(`/admin/industries/${id}`);
      setDeleteConfirm(null);
      showToast('Industry deleted');
      loadIndustries(false);
    } catch (err) {
      console.error('Failed to delete industry:', err);
      showToast(err.message || 'Delete failed', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const filtered = industries.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    (i.cat || '').toLowerCase().includes(search.toLowerCase())
  );

  const paginated = filtered.slice((page - 1) * limit, page * limit);

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
              ) : paginated.length === 0 ? (
                <tr><td colSpan={4} style={{ padding: 32, textAlign: 'center', color: '#aaa' }}>No industries found</td></tr>
              ) : paginated.map((ind) => (
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

      <Pagination 
        total={filtered.length} 
        limit={limit} 
        current={page} 
        onChange={setPage} 
      />

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
            <Button onClick={handleSave} loading={isSaving} style={{ flex: 1 }}>
              {editForm.id ? 'Save Changes' : 'Add Industry'}
            </Button>
            <Button variant="outline" onClick={() => setEditForm(null)} disabled={isSaving} style={{ flex: 1 }}>
              Cancel
            </Button>
          </div>
        </Modal>
      )}

      {deleteConfirm && (
        <Modal onClose={() => setDeleteConfirm(null)} title="Delete Industry">
          <p style={{ color: '#555', fontSize: 14, marginBottom: 20 }}>Are you sure? This cannot be undone.</p>
          <div style={{ display: 'flex', gap: 10 }}>
            <Button variant="danger" onClick={() => handleDelete(deleteConfirm)} loading={isDeleting} style={{ flex: 1 }}>
              Delete
            </Button>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)} disabled={isDeleting} style={{ flex: 1 }}>
              Cancel
            </Button>
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
  const [page, setPage] = useState(1);
  const limit = 10;
  const [selected, setSelected] = useState(null);
  const [editTracking, setEditTracking] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(null); // holds the status string being updated
  const [isSavingTracking, setIsSavingTracking] = useState(false);
  const [trackingErr, setTrackingErr] = useState('');

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

    // Polling setup
    const interval = setInterval(async () => {
      try {
        const data = await api.get('/admin/orders');
        if (!cancelled) setOrders(data.orders || []);
      } catch (e) {
        // silently fail for polling
      }
    }, 15000);

    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  const handleStatusChange = async (order, status) => {
    const current = order.status;
    const allowed = {
      'Processing': ['Shipped', 'Cancelled'],
      'Shipped': ['Delivered'],
      'Delivered': [],
      'Cancelled': []
    };

    if (status !== current && !allowed[current].includes(status)) {
      showToast(`Invalid transition: Cannot move from ${current} to ${status}.`, 'error');
      return;
    }

    if (status === 'Shipped' && !order.tracking && !editTracking) {
      showToast('Please enter a tracking number before marking as Shipped.', 'warning');
      setSelected(order);
      return;
    }

    setUpdatingStatus(status);
    // Optimistic Update
    const previousOrders = [...orders];
    setOrders(prev => prev.map(o => o._id === order._id ? { ...o, status } : o));
    if (selected?._id === order._id) setSelected(prev => ({ ...prev, status }));

    try {
      if (order.userId && order._id) {
        await api.put(`/admin/orders/${order.userId}/${order._id}`, {
          status,
          tracking: status === 'Shipped' ? editTracking : undefined
        });
      }
      showToast('Status updated.', 'success');
      // No need to call full load() if we updated state correctly
    } catch (e) {
      // Rollback on error
      setOrders(previousOrders);
      if (selected?._id === order._id) setSelected(order);
      showToast(e.message, 'error');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleSaveTracking = async () => {
    if (!selected) return;
    const trimmed = editTracking.trim();

    // Validate: 4–40 alphanumeric characters (some UPS numbers are different)
    if (trimmed && !/^[A-Z0-9-]{4,40}$/i.test(trimmed)) {
      setTrackingErr('Tracking number must be 4–40 alphanumeric characters.');
      return;
    }
    setTrackingErr('');
    setIsSavingTracking(true);

    const previousOrders = [...orders];
    setOrders(prev => prev.map(o => o._id === selected._id ? { ...o, tracking: trimmed } : o));
    setSelected(prev => ({ ...prev, tracking: trimmed }));

    try {
      if (selected.userId && selected._id) {
        await api.put(`/admin/orders/${selected.userId}/${selected._id}`, { tracking: trimmed });
      }
      showToast('Tracking number saved.', 'success');
    } catch (e) {
      setOrders(previousOrders);
      setSelected(selected);
      showToast(e.message, 'error');
    } finally {
      setIsSavingTracking(false);
    }
  };

  const exportCSV = () => {
    const rows = [['Order ID', 'Customer', 'Email', 'Product', 'Qty', 'Status', 'Total', 'Date']];
    orders.forEach(o => {
      const qty = (o.items && Array.isArray(o.items)) ? o.items.reduce((s, it) => s + (it?.quantity || it?.qty || 1), 0) : o.qty || 0;
      rows.push([o.id || o.orderId, o.userName, o.userEmail, o.product || (o.items && o.items[0]?.name) || '', qty, o.status, o.total, o.createdAt ? new Date(o.createdAt).toLocaleDateString() : '']);
    });
    const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const a = document.createElement('a'); a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv); a.download = 'orders.csv'; a.click();
  };

  const filtered = orders.filter(o => {
    const matchSearch = !search || [o.id, o.orderId, o.userName, o.userEmail, o.product, o.fullAddress].some(v => v && String(v).toLowerCase().includes(search.toLowerCase()));
    const matchFilter = filter === 'All' || o.status === filter;
    return matchSearch && matchFilter;
  });

  const paginated = filtered.slice((page - 1) * limit, page * limit);

  const handleViewOrder = (order) => {
    setSelected(order);
    setEditTracking(order.tracking || '');
  };

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
                  {['Order ID', 'Customer', 'Product', 'Qty', 'Status', 'Total', 'Shipped On', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '11px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr><td colSpan={8} style={{ padding: 32, textAlign: 'center', color: '#aaa' }}>No orders found</td></tr>
                ) : paginated.map((o, i) => (
                  <tr key={i} style={{ borderTop: '1px solid #F0EDE8', transition: 'background 0.1s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#FAFAF9'}
                    onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                    <td style={{ padding: '12px 14px', fontSize: 12, fontWeight: 700, color: G }}>{o.id || o.orderId}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A' }}>{o.userName}</div>
                      <div style={{ fontSize: 11, color: '#888' }}>{o.userEmail}</div>
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: 12, color: '#555' }}>
                      {(o.items && Array.isArray(o.items) && o.items.length > 0) ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <span style={{ fontWeight: 600, color: '#333' }}>{o.items[0].name}</span>
                          {o.items.length > 1 && <span style={{ fontSize: 10, color: '#999' }}>+{o.items.length - 1} items</span>}
                        </div>
                      ) : (
                        o.product || 'Custom Design'
                      )}
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: 12, color: '#555' }}>{(o.items && Array.isArray(o.items)) ? o.items.reduce((s, it) => s + (it?.quantity || it?.qty || 1), 0) : o.qty || 0}</td>
                    <td style={{ padding: '12px 14px' }}><Badge status={o.status} /></td>
                    <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 700 }}>${(+o.total || 0).toFixed(2)}</td>
                    <td style={{ padding: '12px 14px', fontSize: 11, color: '#888', whiteSpace: 'nowrap' }}>{o.statusDates?.shipped ? new Date(o.statusDates.shipped).toLocaleDateString() : '—'}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => handleViewOrder(o)}
                          style={{ padding: '5px 10px', borderRadius: 6, border: `1px solid ${G}`, color: G, background: 'none', fontSize: 11, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Eye size={11} /> View
                        </button>
                        <select value={o.status} onChange={e => handleStatusChange(o, e.target.value)}
                          disabled={isUpdating || ['Delivered', 'Cancelled'].includes(o.status)}
                          style={{ padding: '5px 8px', borderRadius: 6, border: '1px solid #E2DDD6', fontSize: 11, fontWeight: 700, cursor: (isUpdating || o.status === 'Delivered' || o.status === 'Cancelled') ? 'default' : 'pointer', color: '#555', opacity: (isUpdating || o.status === 'Delivered' || o.status === 'Cancelled') ? 0.7 : 1 }}>
                          {['Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => {
                            const allowed = { 'Processing': ['Shipped', 'Cancelled'], 'Shipped': ['Delivered'], 'Delivered': [], 'Cancelled': [] };
                            const isNext = (allowed[o.status] || []).includes(s);
                            const isCurrent = o.status === s;
                            return <option key={s} value={s} disabled={!isNext && !isCurrent}>{s}</option>;
                          })}
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

<Pagination 
total={filtered.length} 
limit={limit} 
current={page} 
onChange={setPage} 
/>

      {selected && (
        <Modal onClose={() => setSelected(null)} title={`Order ${selected.id || selected.orderId}`} wide>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 20 }}>
            {[
              { label: 'Order ID', value: selected.id || selected.orderId, break: true },
              { label: 'Customer', value: selected.userName },
              { label: 'Email', value: selected.userEmail, break: true },
              { label: 'Product', value: (selected.items && Array.isArray(selected.items) && selected.items.length > 0) ? selected.items.map(i => i.name).join(', ') : selected.product },
              { label: 'Quantity', value: `${(selected.items && Array.isArray(selected.items)) ? selected.items.reduce((s, it) => s + (it?.quantity || it?.qty || 1), 0) : selected.qty || 0} units` },
              { label: 'Total', value: `$${(+selected.total || 0).toFixed(2)}` },
              { label: 'Processing Date', value: selected.statusDates?.processing ? new Date(selected.statusDates.processing).toLocaleDateString() : (selected.createdAt ? new Date(selected.createdAt).toLocaleDateString() : '—') },
              selected.statusDates?.shipped && { label: 'Shipped On', value: new Date(selected.statusDates.shipped).toLocaleDateString() },
              selected.statusDates?.delivered && { label: 'Delivered On', value: new Date(selected.statusDates.delivered).toLocaleDateString() },
              selected.statusDates?.cancelled && { label: 'Cancelled On', value: new Date(selected.statusDates.cancelled).toLocaleDateString() },
              { label: 'Address', value: selected.address || selected.fullAddress || '—' },
              { label: 'Status', value: <Badge status={selected.status} /> },
            ].filter(Boolean).map((item) => (
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
              <input
                value={editTracking}
                onChange={e => { setEditTracking(e.target.value); setTrackingErr(''); }}
                placeholder="e.g. 1Z999AA10123456784"
                style={{ flex: 1, padding: '10px 12px', border: `1.5px solid ${trackingErr ? '#EF4444' : '#E2DDD6'}`, borderRadius: 8, fontSize: 13, outline: 'none' }}
              />
              <button
                onClick={handleSaveTracking}
                disabled={isSavingTracking}
                style={{
                  padding: '10px 18px',
                  background: isSavingTracking ? '#9CA3AF' : G,
                  color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700,
                  cursor: isSavingTracking ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap'
                }}
              >
                {isSavingTracking
                  ? <><RefreshCw size={12} style={{ animation: 'spin 1s linear infinite' }} /> Saving…</>
                  : 'Save'}
              </button>
            </div>
            {trackingErr && <p style={{ fontSize: 11, color: '#EF4444', marginTop: 4 }}>{trackingErr}</p>}
          </div>

          {/* Customer Location Info */}
          {selected.address && selected.address !== '—' && selected.address !== 'Sample Address' && (
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>Customer Location</label>
              <div style={{ padding: 16, background: '#F8FAFC', borderRadius: 10, border: '1px dashed #CBD5E1', color: '#64748B', fontSize: 13, textAlign: 'center' }}>
                Address: {selected.address}
              </div>
            </div>
          )}

          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>Update Status</label>
            {['Delivered', 'Cancelled'].includes(selected.status) ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: '#F8FAFC', borderRadius: 12, border: '1px solid #E2E8F0' }}>
                <Badge status={selected.status} />
                <span style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>This order is {selected.status.toLowerCase()} and cannot be modified.</span>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {['Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => {
                  const current = selected.status;
                  const allowed = {
                    'Processing': ['Shipped', 'Cancelled'],
                    'Shipped': ['Delivered'],
                    'Delivered': [],
                    'Cancelled': []
                  };
                  const isNext = (allowed[current] || []).includes(s);
                  const isCurrent = current === s;

                  return (
                    <button
                      key={s}
                      disabled={(!isNext && !isCurrent) || updatingStatus !== null}
                      onClick={() => handleStatusChange(selected, s)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: 8,
                        border: `1.5px solid ${isCurrent ? G : (isNext ? '#E2DDD6' : '#F1F5F9')}`,
                        background: isCurrent ? G : '#fff',
                        color: isCurrent ? '#fff' : (isNext ? '#555' : '#CBD5E1'),
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: (isNext && !updatingStatus) ? 'pointer' : 'default',
                        opacity: (!isNext && !isCurrent) || (updatingStatus && updatingStatus !== s) ? 0.5 : 1,
                        display: 'flex', alignItems: 'center', gap: 6,
                        transition: 'all 0.2s'
                      }}
                    >
                      {updatingStatus === s
                        ? <><RefreshCw size={12} style={{ animation: 'spin 1s linear infinite' }} /> Updating…</>
                        : s}
                    </button>
                  );
                })}
              </div>
            )}
            {selected.status === 'Processing' && !editTracking && (
              <p style={{ fontSize: 11, color: '#C8860A', marginTop: 8, fontWeight: 600 }}>
                💡 Tip: Add a tracking number before marking as Shipped.
              </p>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Users ─────────────────────────────────────────────────────────────────────
function UsersSection() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'users', or 'admins'
  const [page, setPage] = useState(1);
  const limit = 10;

  const load = async (signal = { cancelled: false }) => {
    if (!signal.cancelled) setLoading(true);
    try {
      const data = await api.get('/admin/users');
      if (!signal.cancelled) setUsers(data.users || []);
    } catch (e) {
      if (!signal.cancelled) showToast('Failed to load users: ' + e.message, 'error');
    } finally {
      if (!signal.cancelled) setLoading(false);
    }
  };

  useEffect(() => {
    let signal = { cancelled: false };
    load(signal);

    // Polling setup for "real-time" sync
    const interval = setInterval(async () => {
      try {
        const data = await api.get('/admin/users');
        if (!signal.cancelled) setUsers(data.users || []);
      } catch (e) { }
    }, 10000); // 10s sync

    return () => { signal.cancelled = true; clearInterval(interval); };
  }, [refreshKey]);

  const handleDelete = async (user) => {
    try {
      if (user._id) await api.delete(`/admin/users/${user._id}`);
      setDeleteConfirm(null);
      showToast('User deleted', 'success');
      load();
    } catch (e) { showToast(e.message, 'error'); }
  };

  const handleRoleChange = async (user, role) => {
    // Block self-demotion
    if (user._id === currentUser?._id && user.role === 'super_admin' && role !== 'super_admin') {
      showToast('Super Admin cannot demote themselves for security reasons.', 'warning');
      return;
    }
    // Block assigning super_admin to anyone else unless the current user is a super_admin
    if (role === 'super_admin' && currentUser?.role !== 'super_admin') {
      showToast('Only a Super Admin can assign the Super Admin role.', 'error');
      return;
    }
    try {
      if (user._id) await api.put(`/admin/users/${user._id}/role`, { role });
      showToast('Role updated successfully.', 'success');
      load();
    } catch (e) {
      showToast(e.message, 'error');
    }
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
    users.forEach(u => rows.push([u.name, u.email, u.phone || '', u.role, u.orderCount || 0, u.loyaltyPoints || 0, u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '']));
    const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const a = document.createElement('a'); a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv); a.download = 'users.csv'; a.click();
  };

  const filtered = users.filter(u => {
    const matchesSearch = !search || [u.name, u.email, u.phone].some(v => v && String(v).toLowerCase().includes(search.toLowerCase()));
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'users') return matchesSearch && (u.role === 'user' || !u.role);
    if (activeTab === 'admins') return matchesSearch && (u.role === 'admin' || u.role === 'super_admin');
    return matchesSearch;
  });

  const paginated = filtered.slice((page - 1) * limit, page * limit);



  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', gap: 24, borderBottom: '1px solid #E2DDD6', paddingBottom: 0 }}>
          {['all', 'users', 'admins'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{ padding: '12px 4px', background: 'none', border: 'none', borderBottom: `2px solid ${activeTab === tab ? G : 'transparent'}`, color: activeTab === tab ? G : '#64748B', fontWeight: 700, fontSize: 15, cursor: 'pointer', textTransform: 'capitalize', transition: 'all 0.2s' }}>
              {tab === 'all' ? 'All Users' : tab} (
              {tab === 'all' ? users.length : (tab === 'users' ? users.filter(u => u.role === 'user' || !u.role).length : users.filter(u => u.role === 'admin' || u.role === 'super_admin').length)}
              )
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => setRefreshKey(k => k + 1)} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: G, background: 'none', border: `1px solid ${G}`, borderRadius: 8, padding: '7px 14px', cursor: 'pointer' }}>
            <RefreshCw size={13} />
          </button>
          <button onClick={exportCSV} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: '#fff', background: G, border: 'none', borderRadius: 8, padding: '7px 16px', cursor: 'pointer' }}>
            <Download size={13} /> Export
          </button>
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
          <div className="responsive-table-container">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#FAFAF9' }}>
                  {['Customer', 'Contact', 'Role', 'Orders', 'Loyalty Pts', 'Joined', 'Last Login', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '11px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr><td colSpan={8} style={{ padding: 32, textAlign: 'center', color: '#aaa' }}>No users found</td></tr>
                ) : paginated.map((u, i) => (
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ position: 'relative' }}>
                          <select
                            value={u.role || 'user'}
                            disabled={u.role === 'super_admin' && currentUser?.role !== 'super_admin'}
                            onChange={e => handleRoleChange(u, e.target.value)}
                            style={{
                              padding: '5px 28px 5px 12px', borderRadius: 100, border: '1px solid #E2DDD6',
                              fontSize: 11, fontWeight: 700, cursor: (u.role === 'super_admin' && currentUser?.role !== 'super_admin') ? 'not-allowed' : 'pointer',
                              appearance: 'none',
                              background: (u.role === 'admin' || u.role === 'super_admin') ? `${G}15` : '#F8FAFC',
                              color: (u.role === 'admin' || u.role === 'super_admin') ? G : '#64748B',
                              outline: 'none',
                              transition: 'all 0.2s'
                            }}>
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                            {currentUser?.role === 'super_admin' && <option value="super_admin">Super Admin</option>}
                          </select>
                          <ChevronDown size={10} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', opacity: 0.5 }} />
                        </div>
                        <RoleBadge role={u.role} />
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 600, color: '#1A1A1A' }}>{u.orderCount || 0}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Star size={12} color={ACCENT} style={{ fill: ACCENT }} /><span style={{ fontSize: 13, fontWeight: 600 }}>{u.loyaltyPoints || 0}</span></div>
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: 11, color: '#888' }}>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</td>
                    <td style={{ padding: '12px 14px', fontSize: 11, color: '#888' }}>{u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString() : 'Never'}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => setSelected(u)}
                          style={{ padding: '5px 10px', borderRadius: 6, border: `1px solid ${G}`, color: G, background: 'none', fontSize: 11, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Eye size={11} /> View
                        </button>
                        {u.role !== 'super_admin' && (
                          <button onClick={() => setDeleteConfirm(u)}
                            style={{ padding: '5px 10px', borderRadius: 6, border: '1px solid #FEE2E2', color: '#DC2626', background: 'none', fontSize: 11, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Trash2 size={11} />
                          </button>
                        )}
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
              { icon: <ShoppingBag size={14} />, label: 'Orders', value: selected.orderCount || 0 },
              { icon: <Calendar size={14} />, label: 'Member Since', value: selected.createdAt ? new Date(selected.createdAt).toLocaleDateString() : '—' },
              selected.lastLoginAt && { icon: <Clock size={14} />, label: 'Last Login', value: new Date(selected.lastLoginAt).toLocaleString() },
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
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {[10, 50, 100].map(pts => (
                <button key={pts} onClick={() => handleLoyalty(selected, (selected.loyaltyPoints || 0) + pts)}
                  style={{ flex: 1, padding: '7px 0', background: '#D1FAE5', color: '#065F46', border: 'none', borderRadius: 6, fontSize: 10, fontWeight: 700, cursor: 'pointer' }}>
                  +{pts}
                </button>
              ))}
              {[-10, -50, -100].map(pts => (
                <button key={pts} onClick={() => handleLoyalty(selected, Math.max(0, (selected.loyaltyPoints || 0) + pts))}
                  style={{ flex: 1, padding: '7px 0', background: '#FEE2E2', color: '#991B1B', border: 'none', borderRadius: 6, fontSize: 10, fontWeight: 700, cursor: 'pointer' }}>
                  {pts}
                </button>
              ))}
              <button onClick={() => handleLoyalty(selected, 0)}
                style={{ flex: 1, padding: '7px 0', background: '#F1F5F9', color: '#64748B', border: 'none', borderRadius: 6, fontSize: 10, fontWeight: 700, cursor: 'pointer' }}>
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
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;
  const [refreshKey, setRefreshKey] = useState(0);
  const [quoteBusy, setQuoteBusy] = useState(false);

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

    // Polling setup
    const interval = setInterval(async () => {
      try {
        const data = await api.get('/admin/quotes');
        if (!signal.cancelled) setQuotes(data.quotes || []);
      } catch (e) {
        // silently fail for polling
      }
    }, 15000);

    return () => { signal.cancelled = true; clearInterval(interval); };
  }, [refreshKey]);

  const filtered = quotes.filter(q => {
    return !search || 
      [q.quoteId, q.userName, q.userEmail, q.productName, q.boxType].some(v => v && String(v).toLowerCase().includes(search.toLowerCase()));
  });

  const paginated = filtered.slice((page - 1) * limit, page * limit);

  const handleQuoteStatus = async (quoteId, status, price) => {
    setQuoteBusy(true);
    try {
      await api.put(`/admin/quotes/${quoteId}`, { status, quotedPrice: price });
      // Optimistically update local state immediately
      setQuotes(prev => prev.map(q => q._id === quoteId ? { ...q, status, quotedPrice: price } : q));
      if (selected?._id === quoteId) {
        setSelected(prev => ({ ...prev, status, quotedPrice: price }));
      }
      showToast(`Status updated to ${status}`, 'success');
    } catch (e) {
      showToast(e.message || 'Update failed', 'error');
    } finally {
      setQuoteBusy(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <h2 style={{ fontSize: 22, fontFamily: 'Outfit,sans-serif', fontWeight: 700 }}>Quote & Sample Requests</h2>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ position: 'relative', width: 260 }}>
            <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search ID, Name, Product…"
              style={{ width: '100%', paddingLeft: 36, paddingRight: 12, paddingTop: 8, paddingBottom: 8, border: '1px solid #E2DDD6', borderRadius: 8, fontSize: 13, outline: 'none' }} />
          </div>
          <button onClick={() => setRefreshKey(k => k + 1)} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: G, background: 'none', border: `1px solid ${G}`, borderRadius: 8, padding: '7px 14px', cursor: 'pointer' }}>
            <RefreshCw size={13} /> Refresh
          </button>
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
                  {['Quote ID', 'Type', 'Customer', 'Product / Box', 'Qty', 'Delivery Address', 'Status', 'Price', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '11px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr><td colSpan={9} style={{ padding: 32, textAlign: 'center', color: '#aaa' }}>No quote or sample requests yet</td></tr>
                ) : paginated.map((q, i) => (
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

      <Pagination 
        total={filtered.length} 
        limit={limit} 
        current={page} 
        onChange={setPage} 
      />

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
                <button
                  key={s}
                  disabled={quoteBusy}
                  onClick={() => handleQuoteStatus(selected._id, s, priceInput)}
                  style={{
                    flex: 1,
                    padding: '10px 0',
                    borderRadius: 8,
                    border: `1.5px solid ${selected.status === s ? G : '#E2DDD6'}`,
                    background: selected.status === s ? G : '#fff',
                    color: selected.status === s ? '#fff' : '#555',
                    fontSize: 12, fontWeight: 700,
                    cursor: quoteBusy ? 'not-allowed' : 'pointer',
                    opacity: quoteBusy ? 0.6 : 1,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
                  }}
                >
                  {quoteBusy && selected.status !== s
                    ? <RefreshCw size={12} style={{ animation: 'spin 1s linear infinite' }} />
                    : null}
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
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api.get('/admin/contact-messages')
      .then(data => { if (!cancelled) setMessages(data.messages || []); })
      .catch(() => { if (!cancelled) showToast('Failed to load messages', 'error'); })
      .finally(() => { if (!cancelled) setLoading(false); });

    // Polling setup
    const interval = setInterval(async () => {
      try {
        const data = await api.get('/admin/contact-messages');
        if (!cancelled) setMessages(data.messages || []);
      } catch (e) {
        // silently fail for polling
      }
    }, 15000);

    return () => { cancelled = true; clearInterval(interval); };
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

  const handleSendReply = async () => {
    if (!replyText.trim()) return showToast('Please enter a reply', 'error');
    if (!window.confirm(`Are you sure you want to send this reply to ${replyingTo.email}?`)) return;
    setIsSendingReply(true);
    try {
      await api.post(`/admin/messages/${replyingTo._id}/reply`, { replyMessage: replyText });
      setMessages(prev => prev.map(m => m._id === replyingTo._id ? { ...m, status: 'Replied' } : m));
      showToast('Reply sent successfully', 'success');
      setReplyingTo(null);
      setReplyText('');
    } catch (err) {
      showToast(err.message || 'Failed to send reply', 'error');
    } finally {
      setIsSendingReply(false);
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
  const paginated = filtered.slice((page - 1) * limit, page * limit);
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
              {paginated.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: 32, textAlign: 'center', color: '#aaa' }}>{loading ? 'Loading messages…' : 'No messages yet.'}</td></tr>
              ) : paginated.map((m, i) => (
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
                      <button onClick={() => setSelected(m)} title="View Message"
                        style={{ padding: '5px 10px', borderRadius: 6, border: `1px solid ${G}`, color: G, background: 'none', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                        <Eye size={11} />
                      </button>
                      <button onClick={() => setReplyingTo(m)} title="Send Reply"
                        style={{ padding: '5px 10px', borderRadius: 6, border: `1px solid ${ACCENT}`, color: ACCENT, background: 'none', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                        <Mail size={11} />
                      </button>
                      {m.status !== 'Replied' && (
                        <button onClick={() => handleMarkReplied(m._id)} title="Mark Replied"
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

      <Pagination 
        total={filtered.length} 
        limit={limit} 
        current={page} 
        onChange={setPage} 
      />

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
              <button onClick={() => setReplyingTo(selected)} style={{ flex: 1, padding: '10px', background: G, color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>Write Reply</button>
            )}

            <button onClick={() => handleDelete(selected._id)} style={{ padding: '10px 16px', background: '#FEE2E2', color: '#DC2626', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}><Trash2 size={14} /></button>
          </div>
        </Modal>
      )}

      {replyingTo && (
        <Modal onClose={() => setReplyingTo(null)} title={`Reply to ${replyingTo.name}`}>
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 12, color: '#666', marginBottom: 12 }}>Replying to: <strong>{replyingTo.subject}</strong></p>
            <textarea
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              placeholder="Write your response here..."
              style={{ width: '100%', minHeight: 180, padding: 14, borderRadius: 10, border: '1.5px solid #E2DDD6', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setReplyingTo(null)} style={{ flex: 1, padding: '12px', background: '#fff', border: '1px solid #E2DDD6', borderRadius: 8, fontWeight: 700 }}>Cancel</button>
            <button
              onClick={handleSendReply}
              disabled={isSendingReply}
              style={{ flex: 1, padding: '12px', background: G, color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: isSendingReply ? 'not-allowed' : 'pointer', opacity: isSendingReply ? 0.7 : 1 }}>
              {isSendingReply ? 'Sending...' : 'Send Reply'}
            </button>
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
                    animate={{ width: `${Math.min(100, (s.value / (data.statusCounts.reduce((a, b) => a + b.value, 0) || 1)) * 100)}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    style={{ height: '100%', background: s.label === 'Delivered' ? '#10B981' : (s.label === 'Cancelled' ? '#EF4444' : '#3B82F6'), borderRadius: 100 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #E2E8F0', padding: 28, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 6, color: '#1E293B', display: 'flex', alignItems: 'center', gap: 8 }}>
            <MapPin size={18} color="#3B82F6" /> Customer Reach
          </h3>
          <p style={{ fontSize: 13, color: '#64748B', marginBottom: 20 }}>Top active markets by region.</p>
          {(() => {
            const cityMap = {};
            (data.locations || []).forEach(l => {
              if (l && l.city) cityMap[l.city] = (cityMap[l.city] || 0) + 1;
            });
            const topCities = Object.entries(cityMap).sort((a, b) => b[1] - a[1]).slice(0, 8);
            return topCities.length ? topCities.map(([city, count]) => (
              <div key={city} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #F1F5F9', fontSize: 13 }}>
                <span style={{ fontWeight: 600, color: '#1E293B' }}>{city}</span>
                <span style={{ color: '#3B82F6', fontWeight: 700, background: 'rgba(59,130,246,0.08)', padding: '2px 10px', borderRadius: 100 }}>{count} Active</span>
              </div>
            )) : (
              <div style={{ textAlign: 'center', color: '#94A3B8', padding: '24px 0', fontSize: 13 }}>
                <MapPin size={24} style={{ marginBottom: 8, opacity: 0.4 }} /><br />No location data yet
              </div>
            );
          })()}
        </div>

        {/* Average Order Value */}
        <div style={{ background: 'linear-gradient(135deg, #0F172A, #1E293B)', borderRadius: 20, padding: 28, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', color: '#fff', boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.2)' }}>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', margin: 0, fontWeight: 600 }}>Avg. Transaction Value</p>
          <h4 style={{ fontSize: 44, fontWeight: 900, color: '#fff', fontFamily: 'Outfit,sans-serif', margin: '12px 0', letterSpacing: '-0.03em' }}>
            ${((data.monthRevenue?.reduce((a, b) => a + b.value, 0) || 0) / (data.statusCounts?.reduce((a, b) => a + b.value, 0) || 1)).toFixed(2)}
          </h4>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: 'rgba(16, 185, 129, 0.2)', color: '#34D399', borderRadius: 100, fontSize: 12, fontWeight: 700, alignSelf: 'center' }}>
            <TrendingUp size={14} /> +8.4%
          </div>
        </div>

      </div>
    </motion.div>
  );
}
// ── Loyalty Logic ─────────────────────────────────────────────────────────────
function LoyaltySection() {
  const { showToast } = useToast();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.get('/admin/settings');
        setSettings(data.settings);
      } catch (e) {
        showToast('Failed to load loyalty settings', 'error');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/admin/settings', settings);
      showToast('Loyalty settings updated', 'success');
    } catch (e) {
      showToast('Update failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}><RefreshCw size={24} className="spin" color={G} /></div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ marginBottom: 36, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2 style={{ fontSize: 28, fontFamily: 'Outfit,sans-serif', fontWeight: 800, color: '#0F172A', margin: 0 }}>Loyalty Management</h2>
          <p style={{ fontSize: 14, color: '#64748B', marginTop: 4 }}>Configure how users earn and spend points.</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          style={{ padding: '12px 24px', background: G, color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
          {saving ? <RefreshCw size={16} className="spin" /> : <CheckCircle size={16} />} Save Loyalty Logic
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24 }}>
        <div style={{ background: '#fff', padding: 28, borderRadius: 24, border: '1px solid #E2E8F0' }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Star size={18} color={ACCENT} /> Earning Logic
          </h3>
          
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 8 }}>Points per $1 Spent</label>
            <input type="number" value={settings.loyaltySettings?.pointsPerDollar || 1} 
              onChange={e => setSettings({ ...settings, loyaltySettings: { ...settings.loyaltySettings, pointsPerDollar: parseFloat(e.target.value) } })}
              style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #E2E8F0', borderRadius: 12, fontSize: 14, outline: 'none' }} />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 8 }}>Point Value (in Currency Units)</label>
            <p style={{ fontSize: 11, color: '#888', marginBottom: 8 }}>e.g. 0.01 means 100 points = $1.00</p>
            <input type="number" step="0.001" value={settings.loyaltySettings?.pointValueInCurrency || 0.01} 
              onChange={e => setSettings({ ...settings, loyaltySettings: { ...settings.loyaltySettings, pointValueInCurrency: parseFloat(e.target.value) } })}
              style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #E2E8F0', borderRadius: 12, fontSize: 14, outline: 'none' }} />
          </div>
        </div>

        <div style={{ background: '#fff', padding: 28, borderRadius: 24, border: '1px solid #E2E8F0' }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
            <TrendingUp size={18} color={G} /> Role Multipliers
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {(settings.loyaltySettings?.multipliers || []).map((m, idx) => (
              <div key={idx} style={{ padding: '16px', background: '#F8FAFC', borderRadius: 16, border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontSize: 12, fontWeight: 800, color: G, textTransform: 'uppercase' }}>{m.role}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input type="number" step="0.1" value={m.multiplier} 
                      onChange={e => {
                        const newMults = [...settings.loyaltySettings.multipliers];
                        newMults[idx].multiplier = parseFloat(e.target.value);
                        setSettings({ ...settings, loyaltySettings: { ...settings.loyaltySettings, multipliers: newMults } });
                      }}
                      style={{ width: 60, padding: '4px 8px', border: '1px solid #E2E8F0', borderRadius: 6, fontSize: 12, fontWeight: 700, textAlign: 'center' }} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#64748B' }}>x</span>
                  </div>
                </div>
                <p style={{ fontSize: 11, color: '#64748B', margin: 0 }}>This role earns {m.multiplier}x the base points per dollar.</p>
              </div>
            ))}
            
            <button type="button" onClick={() => showToast('Role-based logic is tied to platform tiers.', 'info')}
              style={{ padding: '12px', background: 'transparent', border: `1.5px dashed #CBD5E1`, borderRadius: 12, color: '#64748B', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
              + Add Custom Multiplier
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Global Settings ───────────────────────────────────────────────────────────
function GlobalSettingsSection() {
  const { showToast } = useToast();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.get('/admin/settings');
        setSettings(data.settings);
      } catch (e) {
        showToast('Failed to load settings', 'error');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/admin/settings', settings);
      showToast('Settings updated successfully', 'success');
    } catch (e) {
      showToast('Update failed: ' + e.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}><RefreshCw size={24} className="spin" color={G} /></div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: 28, fontFamily: 'Outfit,sans-serif', fontWeight: 800, color: '#0F172A', margin: 0 }}>Global Settings</h2>
        <p style={{ fontSize: 14, color: '#64748B', marginTop: 4 }}>Site configuration and platform-wide variables.</p>
      </div>

      <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
        <div style={{ background: '#fff', padding: 32, borderRadius: 24, border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}><Settings size={18} /> General Config</h3>
          
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 8 }}>Site Name</label>
            <input value={settings.siteName || ''} onChange={e => setSettings({ ...settings, siteName: e.target.value })}
              style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #E2E8F0', borderRadius: 12, fontSize: 14, outline: 'none' }} />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 8 }}>Support Email</label>
            <input value={settings.contactEmail || ''} onChange={e => setSettings({ ...settings, contactEmail: e.target.value })}
              style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #E2E8F0', borderRadius: 12, fontSize: 14, outline: 'none' }} />
          </div>

          <div style={{ display: 'flex', gap: 20 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 8 }}>Currency</label>
              <input value={settings.currency || ''} onChange={e => setSettings({ ...settings, currency: e.target.value })}
                style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #E2E8F0', borderRadius: 12, fontSize: 14, outline: 'none' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 8 }}>Tax Rate (%)</label>
              <input type="number" value={settings.taxRate || 0} onChange={e => setSettings({ ...settings, taxRate: parseFloat(e.target.value) })}
                style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #E2E8F0', borderRadius: 12, fontSize: 14, outline: 'none' }} />
            </div>
          </div>

          <div style={{ marginTop: 24, padding: '16px', background: settings.maintenanceMode ? '#FEF2F2' : '#F0FDF4', borderRadius: 12, border: `1px solid ${settings.maintenanceMode ? '#FECACA' : '#BBF7D0'}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: settings.maintenanceMode ? '#991B1B' : '#166534', margin: 0 }}>Maintenance Mode</p>
              <p style={{ fontSize: 11, color: settings.maintenanceMode ? '#B91C1C' : '#15803D', margin: 0 }}>Prevent users from placing orders</p>
            </div>
            <button type="button" onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
              style={{ width: 48, height: 24, borderRadius: 100, background: settings.maintenanceMode ? '#EF4444' : '#E2E8F0', border: 'none', position: 'relative', cursor: 'pointer', transition: 'all 0.3s' }}>
              <div style={{ position: 'absolute', top: 2, left: settings.maintenanceMode ? 26 : 2, width: 20, height: 20, borderRadius: '50%', background: '#fff', transition: 'all 0.3s' }} />
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          <div style={{ background: '#fff', padding: 32, borderRadius: 24, border: '1px solid #E2E8F0' }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', marginBottom: 24 }}>Social Media Links</h3>
            {['facebook', 'instagram', 'twitter', 'linkedin'].map(social => (
              <div key={social} style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 8 }}>{social}</label>
                <input value={settings.socialLinks?.[social] || ''} onChange={e => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, [social]: e.target.value } })}
                  placeholder={`https://${social}.com/...`}
                  style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #E2E8F0', borderRadius: 12, fontSize: 14, outline: 'none' }} />
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" disabled={saving}
              style={{ padding: '16px 48px', background: G, color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: saving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 10, boxShadow: `0 8px 16px ${G}40` }}>
              {saving ? <RefreshCw size={18} className="spin" /> : <CheckCircle size={18} />}
              Save Changes
            </button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}

// ── Main Admin Page ───────────────────────────────────────────────────────────
const SECTION_MAP = {
  dashboard: DashboardSection,
  orders: OrdersSection,
  users: UsersSection,
  products: ProductsSection,
  industries: IndustriesSection,
  quotes: QuotesSection,
  messages: MessagesSection,
  loyalty: LoyaltySection,
  analytics: AnalyticsSection,
  settings: GlobalSettingsSection
};

export default function Admin() {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeSection = searchParams.get('tab') || 'dashboard';
  const setActiveSection = (val) => setSearchParams({ tab: val });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (user && user.role !== 'admin' && user.role !== 'super_admin') {
      showToast('Access denied.', 'error');
    }
  }, [user, showToast]);

  if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: BG }}>
        <div style={{ textAlign: 'center' }}>
          <Ban size={48} color="#DC2626" style={{ marginBottom: 16 }} />
          <p style={{ fontSize: 18, fontWeight: 700, color: '#1A1A1A' }}>Admin access required</p>
          <p style={{ fontSize: 14, color: '#888', marginTop: 8 }}>Login with Designcustombox@gmail.com / Admin@123</p>
        </div>
      </div>
    );
  }

  const SectionComp = SECTION_MAP[activeSection] || DashboardSection;

  const handleNavClick = (key) => {
    setActiveSection(key);
    setSidebarOpen(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', display: 'flex' }}>
      {/* Mobile Menu Button - Floating Fab */}
      <button
        onClick={() => setSidebarOpen(true)}
        style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 999,
          width: 56, height: 56, borderRadius: '50%', background: G, color: '#fff',
          border: 'none', boxShadow: '0 8px 24px rgba(26,77,46,0.3)',
          display: 'none', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
        }}
        className="admin-mobile-toggle"
      >
        <Menu size={24} />
      </button>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', zIndex: 1000 }} onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`} style={{
        width: 280, flexShrink: 0, background: '#0F172A',
        minHeight: '100vh', position: 'sticky', top: 0,
        display: 'flex', flexDirection: 'column',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        borderRight: '1px solid rgba(255,255,255,0.05)',
        zIndex: 1001,
        boxShadow: '10px 0 40px rgba(0,0,0,0.1)',
        overflowY: 'auto',
      }}>
        <div style={{ padding: '32px 24px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: 12, position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: G, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 8px 16px ${G}40` }}>
              <LayoutDashboard size={24} color="#fff" />
            </div>
            <div>
              <h1 style={{ fontSize: 18, fontWeight: 900, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>DESIGNCUSTOMBOX</h1>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: 700, margin: 0, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Command Center</p>
            </div>
          </div>

          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', padding: '10px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}>
            <ArrowUpRight size={14} color={ACCENT} />
            <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>View Live Store</span>
          </Link>
        </div>

        <nav style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => handleNavClick(key)}
              style={{
                width: '100%', padding: '12px 16px', borderRadius: 12, border: 'none',
                background: activeSection === key ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: activeSection === key ? '#fff' : 'rgba(255,255,255,0.5)',
                fontSize: 14, fontWeight: 600, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 12,
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              onMouseEnter={e => { if (activeSection !== key) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#fff'; } }}
              onMouseLeave={e => { if (activeSection !== key) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; } }}>
              <Icon size={18} strokeWidth={activeSection === key ? 2.5 : 2} />
              {label}
              {activeSection === key && <motion.div layoutId="nav-dot" style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: ACCENT }} />}
            </button>
          ))}
        </nav>

        <div style={{ padding: '24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: 16 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: G, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14 }}>
              {user?.name?.[0]}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</p>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: 600, margin: 0, textTransform: 'uppercase' }}>{user?.role?.replace('_', ' ')}</p>
            </div>
          </div>
          <button onClick={() => { logout(); window.location.href = '/'; }}
            style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: 'none', background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}>
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Content */}
      <main style={{ flex: 1, padding: '40px 48px', overflowX: 'hidden', minWidth: 0, position: 'relative' }}>
        {/* Mobile hamburger header */}
        <div style={{ position: 'sticky', top: 0, zIndex: 100, background: '#F8FAFC', padding: '10px 0', display: 'none', borderBottom: '1px solid #E2E8F0', marginBottom: 24 }} className="admin-mobile-header">
          <button className="admin-hamburger" onClick={() => setSidebarOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', background: G, color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
            <Menu size={16} /> Admin Menu
          </button>
        </div>

        <SectionErrorBoundary key={activeSection}>
          <SectionComp />
        </SectionErrorBoundary>
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
            transform: translateX(-100%) !important;
            box-shadow: none;
            visibility: hidden;
            transition: all 0.3s ease;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
          }
          .admin-sidebar.open {
            transform: translateX(0) !important;
            box-shadow: 20px 0 60px rgba(0,0,0,0.5);
            visibility: visible;
          }
          .admin-close-btn { display: block !important; }
          .admin-mobile-header { display: block !important; }
          main { padding: 20px 16px !important; }
        }
        @media (max-width: 480px) {
          main { padding: 16px 12px !important; }
        }
      `}</style>
    </div>
  );
}

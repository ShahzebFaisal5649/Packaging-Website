import { useState, useEffect, useRef, Suspense } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import {
  Check, Upload, Package, Ruler, Palette, LayoutTemplate, RotateCw, X,
  FileText, Download, ChevronDown, Star, ShieldCheck, Truck, Zap, Save,
  ShoppingCart, ArrowRight, Leaf, Award, MapPin,
} from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, useTexture } from '@react-three/drei';

const G = '#1A4D2E';
const ACCENT = '#C8860A';
const BG = '#F5F2ED';

// ── 3D Models ─────────────────────────────────────────────────────────────────
function BoxModel({ l, w, h, material, finish }) {
  const maxDim = Math.max(l, w, h, 1);
  const sx = (l / maxDim) * 2.5;
  const sy = (h / maxDim) * 2.5;
  const sz = (w / maxDim) * 2.5;
  const color = material?.includes('Kraft') ? '#C19A6B' : (finish === 'Matte Lam' ? '#2A2A2A' : '#FAFAFA');
  return (
    <mesh>
      <boxGeometry args={[sx, sy, sz]} />
      <meshStandardMaterial color={color} roughness={finish === 'Gloss Lam' ? 0.2 : 0.8} metalness={finish === 'Foil Stamp' ? 0.6 : 0} />
    </mesh>
  );
}

function BoxModelTextured({ l, w, h, artworkUrl }) {
  const maxDim = Math.max(l, w, h, 1);
  const sx = (l / maxDim) * 2.5;
  const sy = (h / maxDim) * 2.5;
  const sz = (w / maxDim) * 2.5;
  const texture = useTexture(artworkUrl);
  return (
    <mesh>
      <boxGeometry args={[sx, sy, sz]} />
      <meshStandardMaterial map={texture} roughness={0.4} />
    </mesh>
  );
}

// ── Box type data ─────────────────────────────────────────────────────────────
const BOX_TYPES = [
  { name: 'Mailer Box', icon: '📦', popular: true, desc: 'Perfect for subscriptions & e-commerce' },
  { name: 'Shipping Box', icon: '🚚', desc: 'Heavy-duty protection for transit' },
  { name: 'Rigid Box', icon: '💎', popular: true, desc: 'Premium unboxing experience' },
  { name: 'Folding Carton', icon: '🗂', desc: 'Lightweight retail packaging' },
  { name: 'Sleeve Box', icon: '📋', desc: 'Sleek sleeve-over-tray style' },
  { name: 'Display Box', icon: '🏪', desc: 'Ideal for POS retail display' },
  { name: 'Kraft Box', icon: '♻️', desc: 'Eco-friendly natural look' },
  { name: 'Gable Box', icon: '🎁', desc: 'Handle-top gift & food packaging' },
];

const MATERIALS_DATA = [
  { name: 'Corrugated E-Flute', eco: false, desc: 'Lightweight, strong crush resistance', tag: 'E-Commerce' },
  { name: 'Corrugated B-Flute', eco: false, desc: 'Heavier duty, better stacking strength', tag: 'Shipping' },
  { name: 'Kraft', eco: true, desc: 'FSC-certified, 100% recyclable', tag: 'Eco' },
  { name: 'SBS Board', eco: false, desc: 'Premium coated surface for sharp printing', tag: 'Premium' },
  { name: 'Rigid Chipboard', eco: false, desc: '2–4mm thick luxury packaging', tag: 'Luxury' },
];

const TRUST_ITEMS = [
  { icon: <ShieldCheck size={15} color={G} />, text: 'Quality Guaranteed' },
  { icon: <Truck size={15} color={ACCENT} />, text: 'Free Shipping 500+' },
  { icon: <Leaf size={15} color="#2E7D32" />, text: 'FSC Certified' },
  { icon: <Zap size={15} color={ACCENT} />, text: '8-Day Turnaround' },
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function CustomBox() {
  const { addToCart, toggleDrawer } = useCart();
  const { user, isAuthenticated, updateUser } = useAuth();
  const { showToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [activeStep, setActiveStep] = useState(1);
  const [config, setConfig] = useState({
    boxType: 'Mailer Box',
    l: '8', w: '6', h: '3', unit: 'in', quantity: 500,
    material: 'Corrugated E-Flute',
    print: 'Outside Only', colorMode: 'CMYK Full Color', finish: 'Matte Lam',
    addons: [],
  });
  const [designName, setDesignName] = useState('');
  const [isPricePulsing, setIsPricePulsing] = useState(false);
  const [prefilledName, setPrefilledName] = useState(null);
  const [artworkFile, setArtworkFile] = useState(null);
  const [artworkPreview, setArtworkPreview] = useState(null);
  const [artworkApplied, setArtworkApplied] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [sampleModal, setSampleModal] = useState(false);
  const [sampleForm, setSampleForm] = useState({ name: '', email: '', phone: '', street: '', city: '', state: '', zip: '', country: 'US' });
  const [sampleSubmitting, setSampleSubmitting] = useState(false);

  // Restore saved design or pre-fill from navigation
  useEffect(() => {
    const s = location.state;
    if (!s) return;
    if (s._savedDesign) {
      // eslint-disable-next-line no-unused-vars
      const { _savedDesign, id, date, ...restoredConfig } = s;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setConfig(prev => ({ ...prev, ...restoredConfig }));
      setDesignName(s.name || '');
      setPrefilledName(s.name || null);
      return;
    }
    const updates = {};
    if (s.boxType) updates.boxType = s.boxType;
    if (s.material) updates.material = s.material;
    if (s.finish) updates.finish = s.finish;
    if (s.suggestedDimensions) { updates.l = String(s.suggestedDimensions.l || 8); updates.w = String(s.suggestedDimensions.w || 6); updates.h = String(s.suggestedDimensions.h || 3); }
    if (s.l) updates.l = String(s.l);
    if (s.w) updates.w = String(s.w);
    if (s.h) updates.h = String(s.h);
    if (s.unit) updates.unit = s.unit;
    if (s.quantity) updates.quantity = s.quantity;
    if (s.print) updates.print = s.print;
    if (s.colorMode) updates.colorMode = s.colorMode;
    if (s.addons) updates.addons = s.addons;
    if (Object.keys(updates).length) setConfig(prev => ({ ...prev, ...updates }));
    if (s.productName) setPrefilledName(s.productName);
  }, [location.state]);

  // Pre-fill sample form from user profile
  useEffect(() => {
    if (user) {
      setSampleForm(f => ({
        ...f,
        name: f.name || user.name || '',
        email: f.email || user.email || '',
        phone: f.phone || user.phone || '',
      }));
    }
  }, [user]);

  const handleSampleSubmit = async () => {
    const { name, email, street, city, zip } = sampleForm;
    if (!name || !email || !street || !city || !zip) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }
    setSampleSubmitting(true);
    const deliveryAddress = `${sampleForm.street}, ${sampleForm.city}, ${sampleForm.state} ${sampleForm.zip}, ${sampleForm.country}`;
    const quoteData = {
      type: 'sample',
      boxType: config.boxType,
      material: config.material,
      dims: `${config.l}×${config.w}×${config.h} ${config.unit}`,
      qty: 1,
      deliveryAddress,
      productName: prefilledName || config.boxType,
      status: 'Pending',
    };
    try {
      if (isAuthenticated) {
        await api.post('/users/quotes', quoteData, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('designcustombox_token')}` }
        });
      } else {
        // Save to localStorage as guest
        const guestList = JSON.parse(localStorage.getItem('designcustombox_usersList') || '[]');
        const guestIdx = guestList.findIndex(u => u.email === email);
        const entry = { quoteId: `QT-${Date.now()}`, ...quoteData, userName: name, userEmail: email };
        if (guestIdx > -1) {
          guestList[guestIdx].quotes = [...(guestList[guestIdx].quotes || []), entry];
        } else {
          guestList.push({ id: `guest_${Date.now()}`, name, email, phone: sampleForm.phone, role: 'user', orders: [], quotes: [entry] });
        }
        localStorage.setItem('packagingUsersList', JSON.stringify(guestList));
      }
      setSampleModal(false);
      setSampleForm({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '', street: '', city: '', state: '', zip: '', country: 'US' });
      showToast('Sample request sent! We\'ll contact you within 24 hours.', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to submit request.', 'error');
    }
    setSampleSubmitting(false);
  };

  const handleArtworkUpload = (file) => {
    if (!file) return;
    setArtworkFile(file);
    if (file.type.startsWith('image/')) setArtworkPreview(URL.createObjectURL(file));
    else setArtworkPreview(null);
    showToast('Artwork uploaded!', 'success');
  };
  const clearArtwork = () => { setArtworkFile(null); setArtworkPreview(null); setArtworkApplied(false); };

  const downloadDieline = () => {
    const L = parseFloat(config.l) || 8;
    const W = parseFloat(config.w) || 6;
    const H = parseFloat(config.h) || 3;
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400">
      <rect x="10" y="10" width="580" height="380" fill="none" stroke="#ccc" stroke-width="1" stroke-dasharray="5,5"/>
      <text x="300" y="30" text-anchor="middle" font-size="14" fill="#333">Design Custom Box Dieline — ${config.boxType}</text>
      <rect x="50" y="60" width="${W * 20}" height="${H * 20}" fill="none" stroke="#1A4D2E" stroke-width="2"/>
      <text x="${50 + W * 10}" y="${65 + H * 10}" text-anchor="middle" font-size="11" fill="#666">Side (${W}×${H})</text>
      <rect x="${55 + W * 20}" y="60" width="${L * 20}" height="${H * 20}" fill="none" stroke="#C8860A" stroke-width="2"/>
      <text x="${55 + W * 20 + L * 10}" y="${65 + H * 10}" text-anchor="middle" font-size="11" fill="#666">Front (${L}×${H})</text>
      <rect x="50" y="${65 + H * 20}" width="${L * 20}" height="${W * 20}" fill="none" stroke="#1A4D2E" stroke-width="2" stroke-dasharray="4,4"/>
      <text x="${50 + L * 10}" y="${70 + H * 20 + W * 10}" text-anchor="middle" font-size="11" fill="#666">Bottom (${L}×${W})</text>
      <text x="300" y="380" text-anchor="middle" font-size="10" fill="#999">Dimensions: ${L}×${W}×${H} ${config.unit} | Material: ${config.material}</text>
    </svg>`;
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `design-custom-box-dieline-${config.boxType.toLowerCase().replace(/ /g, '-')}.svg`; a.click();
    URL.revokeObjectURL(url);
    showToast('Dieline downloaded!', 'success');
  };

  // Pricing
  const area = parseFloat(config.l) * parseFloat(config.w);
  const sizeMultiplier = area > 100 ? 1.5 : (area > 50 ? 1.2 : 1);
  const qtyDiscount = config.quantity >= 1000 ? 0.8 : (config.quantity >= 500 ? 0.9 : 1);
  const addonCost = config.addons.length * 0.15;
  const basePrice = config.material === 'Rigid Chipboard' ? 2.4 : (config.material === 'SBS Board' ? 1.6 : 1.2);
  const unitPrice = (basePrice * sizeMultiplier * qtyDiscount) + addonCost;
  const totalPrice = unitPrice * config.quantity;
  const savings = config.quantity >= 500 ? ((basePrice * sizeMultiplier * 1 + addonCost) - unitPrice) * config.quantity : 0;

  const handleConfigChange = (key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }));
    setIsPricePulsing(true);
    setTimeout(() => setIsPricePulsing(false), 500);
  };
  const toggleAddon = (addon) => {
    const newAddons = config.addons.includes(addon) ? config.addons.filter(a => a !== addon) : [...config.addons, addon];
    handleConfigChange('addons', newAddons);
  };
  const handleAddToCart = () => {
    addToCart({ id: `box-${Date.now()}`, name: designName.trim() || `Custom ${config.boxType}`, image: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?q=80&w=400', price: unitPrice, quantity: config.quantity, configuration: config });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
    showToast('Added to cart!', 'success');
    toggleDrawer(true);
  };
  const handleGetQuote = () => {
    addToCart({ id: `box-${Date.now()}`, name: designName.trim() || `Custom ${config.boxType}`, image: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?q=80&w=400', price: unitPrice, quantity: config.quantity, configuration: config });
    navigate('/checkout');
  };
  const handleSaveDesign = () => {
    if (!isAuthenticated) { showToast('Please login to save designs.', 'warning'); return; }
    const finalName = designName.trim() || `My ${config.boxType}`;
    const newDesign = { id: `des_${Date.now()}`, name: finalName, style: config.material, date: new Date().toISOString(), _savedDesign: true, ...config };
    const savedDesigns = user.savedDesigns || [];
    updateUser({ savedDesigns: [...savedDesigns, newDesign] });
    showToast(`Design "${finalName}" saved!`, 'success');
  };

  const stepDone = (n) => {
    if (n === 1) return true;
    if (n === 2) return parseFloat(config.l) > 0 && parseFloat(config.w) > 0 && parseFloat(config.h) > 0;
    if (n === 3) return !!config.material;
    if (n === 4) return !!config.finish;
    return false;
  };

  return (
    <div style={{ backgroundColor: BG, minHeight: 'calc(100vh - (var(--nav-h) + var(--ann-h)))', paddingTop: 32, paddingBottom: 64 }}>

      {/* ── Page Header ───────────────────────────────────────────────────────── */}
      <div style={{ background: `linear-gradient(135deg, ${G} 0%, #0D3520 100%)`, padding: '48px 24px 60px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '28px 28px', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '20%', right: '8%', width: 240, height: 240, borderRadius: '50%', border: '1px solid rgba(200,134,10,0.12)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          {prefilledName && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '8px 18px', background: `${ACCENT}25`, border: `1px solid ${ACCENT}50`, borderRadius: 100, marginBottom: 20 }}>
              <Award size={14} color={ACCENT} />
              <span style={{ fontSize: 12, fontWeight: 700, color: ACCENT }}>Configuring: {prefilledName}</span>
              <button onClick={() => setPrefilledName(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', padding: 0, display: 'flex' }}><X size={12} /></button>
            </div>
          )}
          <h1 style={{ fontSize: 'clamp(28px,4vw,48px)', fontFamily: 'Outfit,sans-serif', fontWeight: 800, color: '#fff', marginBottom: 14, lineHeight: 1.15 }}>
            Design Your Custom Box
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.62)', maxWidth: 500, margin: '0 auto 28px', lineHeight: 1.7 }}>
            Real-time pricing · Live 3D preview · Ships in 8 days
          </p>
          <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
            {TRUST_ITEMS.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.6)' }}>
                {item.icon} {item.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Step Progress Bar ────────────────────────────────────────────────── */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E8E4DC', padding: '0 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex' }}>
          {[{ n: 1, label: 'Box Type' }, { n: 2, label: 'Dimensions' }, { n: 3, label: 'Material' }, { n: 4, label: 'Print & Finish' }, { n: 5, label: 'Artwork' }].map(({ n, label }) => (
            <button key={n} onClick={() => setActiveStep(n)}
              style={{
                flex: 1, padding: '16px 8px', background: 'none', border: 'none', cursor: 'pointer',
                borderBottom: activeStep === n ? `3px solid ${G}` : '3px solid transparent',
                transition: 'border-color 0.2s',
              }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{
                  width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 800,
                  background: stepDone(n) && n < activeStep ? G : (activeStep === n ? G : '#F0EDE8'),
                  color: (stepDone(n) && n < activeStep) || activeStep === n ? '#fff' : '#999',
                }}>
                  {stepDone(n) && n < activeStep ? <Check size={12} /> : n}
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: activeStep === n ? G : '#999', whiteSpace: 'nowrap' }}>{label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Main 3-col Layout ────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1600, margin: '0 auto', padding: '32px 24px 80px' }}>
        <div className="configurator-grid" style={{ display: 'grid', gridTemplateColumns: '320px 1fr 340px', gap: 24, alignItems: 'start' }}>

          {/* ── LEFT: Configurator Steps ────────────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

            {/* Step 1: Box Type */}
            <div style={{ background: '#fff', borderRadius: 16, border: activeStep === 1 ? `2px solid ${G}` : '1px solid #E8E4DC', overflow: 'hidden', boxShadow: activeStep === 1 ? `0 0 0 4px ${G}10` : 'none', transition: 'all 0.2s' }}>
              <button onClick={() => setActiveStep(1)} style={{ width: '100%', padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, background: activeStep > 1 ? G : (activeStep === 1 ? G : '#F0EDE8'), color: activeStep >= 1 ? '#fff' : '#999' }}>
                    {activeStep > 1 ? <Check size={14} /> : '1'}
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: activeStep === 1 ? G : '#1A1A1A', margin: 0 }}>Choose Box Type</p>
                    {activeStep !== 1 && <p style={{ fontSize: 11, color: '#888', margin: '2px 0 0' }}>{config.boxType}</p>}
                  </div>
                </div>
                <ChevronDown size={16} color="#aaa" style={{ transform: activeStep === 1 ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>
              {activeStep === 1 && (
                <div style={{ padding: '0 16px 20px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {BOX_TYPES.map(bt => (
                      <button key={bt.name} onClick={() => { handleConfigChange('boxType', bt.name); setActiveStep(2); }}
                        style={{
                          padding: '12px 10px', border: `2px solid ${config.boxType === bt.name ? G : '#E8E4DC'}`,
                          borderRadius: 10, background: config.boxType === bt.name ? `${G}08` : '#fff',
                          cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s', position: 'relative',
                        }}>
                        {bt.popular && <span style={{ position: 'absolute', top: -6, right: 8, fontSize: 8, fontWeight: 700, background: ACCENT, color: '#fff', padding: '2px 6px', borderRadius: 100, textTransform: 'uppercase' }}>Popular</span>}
                        <div style={{ fontSize: 18, marginBottom: 4 }}>{bt.icon}</div>
                        <p style={{ fontSize: 12, fontWeight: 700, color: config.boxType === bt.name ? G : '#1A1A1A', margin: '0 0 3px' }}>{bt.name}</p>
                        <p style={{ fontSize: 10, color: '#999', margin: 0, lineHeight: 1.3 }}>{bt.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Step 2: Dimensions */}
            <div style={{ background: '#fff', borderRadius: 16, border: activeStep === 2 ? `2px solid ${G}` : '1px solid #E8E4DC', overflow: 'hidden', boxShadow: activeStep === 2 ? `0 0 0 4px ${G}10` : 'none', transition: 'all 0.2s' }}>
              <button onClick={() => setActiveStep(2)} style={{ width: '100%', padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, background: activeStep > 2 ? G : (activeStep === 2 ? G : '#F0EDE8'), color: activeStep >= 2 ? '#fff' : '#999' }}>
                    {activeStep > 2 ? <Check size={14} /> : '2'}
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: activeStep === 2 ? G : '#1A1A1A', margin: 0 }}>Dimensions &amp; Quantity</p>
                    {activeStep !== 2 && <p style={{ fontSize: 11, color: '#888', margin: '2px 0 0' }}>{config.l}×{config.w}×{config.h} {config.unit} · {config.quantity.toLocaleString()} units</p>}
                  </div>
                </div>
                <ChevronDown size={16} color="#aaa" style={{ transform: activeStep === 2 ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>
              {activeStep === 2 && (
                <div style={{ padding: '0 16px 20px' }}>
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginBottom: 14 }}>
                    {['in', 'cm'].map(u => (
                      <button key={u} onClick={() => handleConfigChange('unit', u)}
                        style={{ padding: '6px 16px', borderRadius: 100, border: `1.5px solid ${config.unit === u ? G : '#E8E4DC'}`, background: config.unit === u ? G : '#fff', color: config.unit === u ? '#fff' : '#666', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                        {u === 'in' ? 'Inches' : 'CM'}
                      </button>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                    {[['l', 'Length'], ['w', 'Width'], ['h', 'Height']].map(([key, lbl]) => (
                      <div key={key} style={{ flex: 1 }}>
                        <label style={{ fontSize: 10, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 4 }}>{lbl}</label>
                        <input type="number" min="1" value={config[key]}
                          onChange={e => handleConfigChange(key, Math.max(0.5, parseFloat(e.target.value) || 0).toString())}
                          style={{ width: '100%', padding: '10px 8px', border: '1.5px solid #E8E4DC', borderRadius: 8, textAlign: 'center', fontSize: 15, fontWeight: 700, outline: 'none', boxSizing: 'border-box' }}
                          onFocus={e => e.target.style.borderColor = G} onBlur={e => e.target.style.borderColor = '#E8E4DC'} />
                      </div>
                    ))}
                  </div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: '#1A1A1A', display: 'block', marginBottom: 8 }}>Quantity</label>
                  <select value={config.quantity} onChange={e => handleConfigChange('quantity', parseInt(e.target.value))}
                    style={{ width: '100%', padding: '12px 14px', border: '1.5px solid #E8E4DC', borderRadius: 10, fontSize: 14, fontWeight: 700, outline: 'none', cursor: 'pointer', appearance: 'none', background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E") no-repeat right 12px center / 16px, #fff` }}>
                    {[100, 250, 500, 1000, 2500, 5000].map(q => (
                      <option key={q} value={q}>{q.toLocaleString()} units{q >= 1000 ? ' — Volume Discount' : q >= 500 ? ' — 10% Off' : ''}</option>
                    ))}
                  </select>
                  {config.quantity >= 500 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, padding: '8px 12px', background: '#D1FAE5', borderRadius: 8 }}>
                      <Star size={12} color="#059669" style={{ fill: '#059669' }} />
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#065F46' }}>Volume discount applied — {config.quantity >= 1000 ? '20%' : '10%'} off unit price</span>
                    </div>
                  )}
                  <button onClick={() => setActiveStep(3)} style={{ width: '100%', padding: '12px', marginTop: 16, background: G, color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = ACCENT} onMouseLeave={e => e.currentTarget.style.background = G}>
                    Continue to Material →
                  </button>
                </div>
              )}
            </div>

            {/* Step 3: Material */}
            <div style={{ background: '#fff', borderRadius: 16, border: activeStep === 3 ? `2px solid ${G}` : '1px solid #E8E4DC', overflow: 'hidden', boxShadow: activeStep === 3 ? `0 0 0 4px ${G}10` : 'none', transition: 'all 0.2s' }}>
              <button onClick={() => setActiveStep(3)} style={{ width: '100%', padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, background: activeStep > 3 ? G : (activeStep === 3 ? G : '#F0EDE8'), color: activeStep >= 3 ? '#fff' : '#999' }}>
                    {activeStep > 3 ? <Check size={14} /> : '3'}
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: activeStep === 3 ? G : '#1A1A1A', margin: 0 }}>Material &amp; Structure</p>
                    {activeStep !== 3 && <p style={{ fontSize: 11, color: '#888', margin: '2px 0 0' }}>{config.material}</p>}
                  </div>
                </div>
                <ChevronDown size={16} color="#aaa" style={{ transform: activeStep === 3 ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>
              {activeStep === 3 && (
                <div style={{ padding: '0 16px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {MATERIALS_DATA.map(mat => (
                    <button key={mat.name} onClick={() => handleConfigChange('material', mat.name)}
                      style={{ padding: '14px 16px', border: `2px solid ${config.material === mat.name ? G : '#E8E4DC'}`, borderRadius: 10, background: config.material === mat.name ? `${G}08` : '#fff', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${config.material === mat.name ? G : '#ddd'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {config.material === mat.name && <div style={{ width: 8, height: 8, borderRadius: '50%', background: G }} />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 13, fontWeight: 700, color: '#1A1A1A' }}>{mat.name}</span>
                          <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: mat.eco ? '#D1FAE5' : `${G}14`, color: mat.eco ? '#065F46' : G }}>{mat.tag}</span>
                        </div>
                        <p style={{ fontSize: 11, color: '#777', margin: '3px 0 0' }}>{mat.desc}</p>
                      </div>
                    </button>
                  ))}
                  <button onClick={() => setActiveStep(4)} style={{ padding: '12px', background: G, color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'background 0.15s', marginTop: 4 }}
                    onMouseEnter={e => e.currentTarget.style.background = ACCENT} onMouseLeave={e => e.currentTarget.style.background = G}>
                    Continue to Print →
                  </button>
                </div>
              )}
            </div>

            {/* Step 4: Print & Finish */}
            <div style={{ background: '#fff', borderRadius: 16, border: activeStep === 4 ? `2px solid ${G}` : '1px solid #E8E4DC', overflow: 'hidden', boxShadow: activeStep === 4 ? `0 0 0 4px ${G}10` : 'none', transition: 'all 0.2s' }}>
              <button onClick={() => setActiveStep(4)} style={{ width: '100%', padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, background: activeStep > 4 ? G : (activeStep === 4 ? G : '#F0EDE8'), color: activeStep >= 4 ? '#fff' : '#999' }}>
                    {activeStep > 4 ? <Check size={14} /> : '4'}
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: activeStep === 4 ? G : '#1A1A1A', margin: 0 }}>Print &amp; Finish</p>
                    {activeStep !== 4 && <p style={{ fontSize: 11, color: '#888', margin: '2px 0 0' }}>{config.finish} · {config.print}</p>}
                  </div>
                </div>
                <ChevronDown size={16} color="#aaa" style={{ transform: activeStep === 4 ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>
              {activeStep === 4 && (
                <div style={{ padding: '0 16px 20px' }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Print Coverage</p>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
                    {['Outside Only', 'Inside Only', 'Both Sides'].map(p => (
                      <button key={p} onClick={() => handleConfigChange('print', p)}
                        style={{ flex: 1, padding: '8px 6px', borderRadius: 8, border: `1.5px solid ${config.print === p ? G : '#E8E4DC'}`, background: config.print === p ? G : '#fff', color: config.print === p ? '#fff' : '#666', fontSize: 11, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s' }}>
                        {p}
                      </button>
                    ))}
                  </div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Lamination</p>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
                    {['Matte Lam', 'Gloss Lam', 'Uncoated'].map(fin => (
                      <button key={fin} onClick={() => handleConfigChange('finish', fin)}
                        style={{ flex: 1, padding: '8px 6px', borderRadius: 8, border: `1.5px solid ${config.finish === fin ? G : '#E8E4DC'}`, background: config.finish === fin ? G : '#fff', color: config.finish === fin ? '#fff' : '#666', fontSize: 11, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s' }}>
                        {fin}
                      </button>
                    ))}
                  </div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Special Add-ons (+$0.15/unit each)</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {['Spot UV', 'Foil Stamping Gold', 'Embossing', 'Die-Cut Window'].map(addon => (
                      <label key={addon} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '10px 12px', border: `1.5px solid ${config.addons.includes(addon) ? ACCENT : '#E8E4DC'}`, borderRadius: 8, background: config.addons.includes(addon) ? `${ACCENT}08` : '#fff', transition: 'all 0.15s' }}>
                        <div style={{ width: 16, height: 16, borderRadius: 4, border: `2px solid ${config.addons.includes(addon) ? ACCENT : '#ddd'}`, background: config.addons.includes(addon) ? ACCENT : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {config.addons.includes(addon) && <Check size={10} color="#fff" />}
                        </div>
                        <input type="checkbox" checked={config.addons.includes(addon)} onChange={() => toggleAddon(addon)} style={{ display: 'none' }} />
                        <span style={{ fontSize: 12, fontWeight: 600, color: '#1A1A1A', flex: 1 }}>{addon}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: ACCENT }}>+$0.15</span>
                      </label>
                    ))}
                  </div>
                  <button onClick={() => setActiveStep(5)} style={{ width: '100%', padding: '12px', marginTop: 16, background: G, color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = ACCENT} onMouseLeave={e => e.currentTarget.style.background = G}>
                    Continue to Artwork →
                  </button>
                </div>
              )}
            </div>

            {/* Step 5: Artwork */}
            <div style={{ background: '#fff', borderRadius: 16, border: activeStep === 5 ? `2px solid ${G}` : '1px solid #E8E4DC', overflow: 'hidden', boxShadow: activeStep === 5 ? `0 0 0 4px ${G}10` : 'none', transition: 'all 0.2s' }}>
              <button onClick={() => setActiveStep(5)} style={{ width: '100%', padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, background: activeStep === 5 ? G : '#F0EDE8', color: activeStep === 5 ? '#fff' : '#999' }}>5</div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: activeStep === 5 ? G : '#1A1A1A', margin: 0 }}>Artwork &amp; Design</p>
                </div>
                <ChevronDown size={16} color="#aaa" style={{ transform: activeStep === 5 ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>
              {activeStep === 5 && (
                <div style={{ padding: '0 16px 20px' }}>
                  <input ref={fileInputRef} type="file" accept=".pdf,.ai,.eps,.png,.jpg,.jpeg,.psd" style={{ display: 'none' }} onChange={e => handleArtworkUpload(e.target.files[0])} />
                  <div
                    onClick={() => !artworkFile && fileInputRef.current?.click()}
                    onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={e => { e.preventDefault(); setDragOver(false); handleArtworkUpload(e.dataTransfer.files[0]); }}
                    style={{ border: `2px dashed ${dragOver ? ACCENT : (artworkFile ? '#22C55E' : `${G}50`)}`, borderRadius: 12, padding: '24px 16px', textAlign: 'center', background: dragOver ? `${ACCENT}08` : (artworkFile ? '#F0FDF4' : `${G}05`), cursor: artworkFile ? 'default' : 'pointer', marginBottom: 12, transition: 'all 0.2s' }}>
                    {artworkFile ? (
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                          <div style={{ width: 36, height: 36, borderRadius: 8, background: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Check size={18} color="#059669" /></div>
                          <div style={{ flex: 1, textAlign: 'left' }}>
                            <p style={{ fontSize: 12, fontWeight: 700, color: '#1A1A1A', margin: 0 }}>{artworkFile.name}</p>
                            <p style={{ fontSize: 10, color: '#888', margin: 0 }}>{(artworkFile.size / 1024).toFixed(1)} KB</p>
                          </div>
                          <button onClick={e => { e.stopPropagation(); clearArtwork(); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#aaa' }}><X size={14} /></button>
                        </div>
                        {artworkPreview && <img src={artworkPreview} alt="Preview" style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8, border: '1px solid #E8E4DC' }} />}
                        {!artworkPreview && <div style={{ fontSize: 11, color: '#888', display: 'flex', alignItems: 'center', gap: 6 }}><FileText size={12} /> Design file ready</div>}
                      </div>
                    ) : (
                      <>
                        <Upload size={28} color={G} style={{ marginBottom: 10 }} />
                        <p style={{ fontSize: 13, fontWeight: 700, color: '#1A1A1A', margin: '0 0 4px' }}>Upload Your Artwork</p>
                        <p style={{ fontSize: 11, color: '#888', margin: 0 }}>PDF, AI, EPS, PNG — drag &amp; drop or click</p>
                      </>
                    )}
                  </div>
                  {artworkPreview && !artworkApplied && (
                    <button onClick={() => { setArtworkApplied(true); showToast('Design applied to 3D preview!', 'success'); }}
                      style={{ width: '100%', padding: '11px', background: ACCENT, color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 12, cursor: 'pointer', marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                      <Palette size={14} /> Apply to 3D Preview
                    </button>
                  )}
                  {artworkApplied && (
                    <button onClick={() => setArtworkApplied(false)}
                      style={{ width: '100%', padding: '11px', background: '#D1FAE5', color: '#065F46', border: '1.5px solid #A7F3D0', borderRadius: 10, fontWeight: 700, fontSize: 12, cursor: 'pointer', marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                      <Check size={14} /> Design Applied — Reset
                    </button>
                  )}
                  <button onClick={downloadDieline}
                    style={{ width: '100%', padding: '11px', background: '#fff', color: '#1A1A1A', border: '1.5px solid #E8E4DC', borderRadius: 10, fontWeight: 700, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    <Download size={14} /> Download Free Dieline Template
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ── CENTER: 3D Preview ────────────────────────────────────────────── */}
          <div style={{ position: 'sticky', top: 100 }}>
            {/* 3D Canvas */}
            <div style={{ background: 'linear-gradient(145deg, #F8F5F0 0%, #EDE9E2 100%)', borderRadius: 20, aspectRatio: '4/3', overflow: 'hidden', position: 'relative', border: '1px solid #E8E4DC', boxShadow: '0 20px 60px rgba(0,0,0,0.06)' }}>
              <Suspense fallback={
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: G }}>
                  <RotateCw size={32} style={{ animation: 'spin 1.2s linear infinite', marginBottom: 12 }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#888' }}>Loading 3D Engine…</span>
                </div>
              }>
                <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 4], fov: 50 }}>
                  <Stage environment="city" intensity={0.5}>
                    {artworkApplied && artworkPreview
                      ? <BoxModelTextured l={parseFloat(config.l) || 8} w={parseFloat(config.w) || 6} h={parseFloat(config.h) || 3} artworkUrl={artworkPreview} />
                      : <BoxModel l={parseFloat(config.l) || 8} w={parseFloat(config.w) || 6} h={parseFloat(config.h) || 3} material={config.material} finish={config.finish} />
                    }
                  </Stage>
                  <OrbitControls autoRotate autoRotateSpeed={1.8} enableZoom={true} />
                </Canvas>
              </Suspense>

              {/* Badges */}
              <div style={{ position: 'absolute', top: 16, left: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ padding: '5px 12px', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', borderRadius: 100, fontSize: 10, fontWeight: 700, color: '#1A1A1A', display: 'flex', alignItems: 'center', gap: 5, border: '1px solid rgba(255,255,255,0.8)' }}>
                  <RotateCw size={10} style={{ animation: 'spin 3s linear infinite' }} /> 360° Live
                </span>
                {artworkApplied && (
                  <span style={{ padding: '5px 12px', background: '#22C55E', borderRadius: 100, fontSize: 10, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Check size={10} /> Design Applied
                  </span>
                )}
              </div>

              {/* Spec overlay */}
              <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16, background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)', borderRadius: 12, padding: '14px 18px', border: '1px solid rgba(255,255,255,0.8)', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                <div>
                  <p style={{ fontSize: 9, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 3px' }}>Box Type</p>
                  <p style={{ fontSize: 12, fontWeight: 700, color: '#1A1A1A', margin: 0 }}>{config.boxType}</p>
                </div>
                <div>
                  <p style={{ fontSize: 9, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 3px' }}>Size</p>
                  <p style={{ fontSize: 12, fontWeight: 700, color: G, margin: 0 }}>{config.l}×{config.w}×{config.h}{config.unit}</p>
                </div>
                <div>
                  <p style={{ fontSize: 9, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 3px' }}>Finish</p>
                  <p style={{ fontSize: 12, fontWeight: 700, color: '#1A1A1A', margin: 0 }}>{config.finish}</p>
                </div>
              </div>
            </div>

            {/* Sample request */}
            <button onClick={() => setSampleModal(true)}
              style={{ width: '100%', marginTop: 12, padding: '14px', background: '#fff', border: '1.5px solid #E8E4DC', borderRadius: 12, fontWeight: 700, fontSize: 13, color: '#1A1A1A', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = G; e.currentTarget.style.color = G; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#E8E4DC'; e.currentTarget.style.color = '#1A1A1A'; }}>
              <Package size={15} /> Request a Physical Sample
            </button>

            {/* Material visual cues */}
            <div style={{ marginTop: 12, padding: '16px 18px', background: '#fff', borderRadius: 12, border: '1px solid #E8E4DC' }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px' }}>Active Configuration</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { label: 'Material', value: config.material },
                  { label: 'Printing', value: config.print },
                  { label: 'Color Mode', value: config.colorMode },
                  ...(config.addons.length ? [{ label: 'Add-ons', value: config.addons.join(', ') }] : []),
                ].map(({ label, value }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12 }}>
                    <span style={{ color: '#888', fontWeight: 500 }}>{label}</span>
                    <span style={{ fontWeight: 700, color: '#1A1A1A', textAlign: 'right', maxWidth: '55%' }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT: Pricing Summary ────────────────────────────────────────── */}
          <div style={{ position: 'sticky', top: 100 }}>
            <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #E8E4DC', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.06)' }}>
              {/* Header */}
              <div style={{ background: `linear-gradient(135deg, ${G} 0%, #0D3520 100%)`, padding: '24px 28px' }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 6px' }}>Your Custom Box</p>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
                  <span className={`price-display`} style={{ fontSize: 42, fontWeight: 900, color: '#fff', fontFamily: 'Outfit,sans-serif', lineHeight: 1, transition: 'transform 0.3s', transform: isPricePulsing ? 'scale(1.06)' : 'scale(1)' }}>
                    ${totalPrice.toFixed(2)}
                  </span>
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontWeight: 600, marginBottom: 4 }}>total</span>
                </div>
                <p style={{ fontSize: 13, color: ACCENT, fontWeight: 700, margin: '8px 0 0' }}>${unitPrice.toFixed(2)} per unit</p>
              </div>

              <div style={{ padding: '24px 28px' }}>
                {/* Price breakdown */}
                <div style={{ marginBottom: 20 }}>
                  {[
                    { label: 'Base Price', value: `$${(unitPrice - addonCost).toFixed(2)}/ea` },
                    { label: `Add-ons (${config.addons.length})`, value: `+$${addonCost.toFixed(2)}/ea` },
                    { label: 'Shipping', value: 'FREE', highlight: true },
                  ].map(({ label, value, highlight }) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 13 }}>
                      <span style={{ color: '#888' }}>{label}</span>
                      <span style={{ fontWeight: 700, color: highlight ? '#22C55E' : '#1A1A1A' }}>{value}</span>
                    </div>
                  ))}
                  {savings > 0 && (
                    <div style={{ padding: '10px 14px', background: '#D1FAE5', borderRadius: 8, display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#065F46' }}>You save</span>
                      <span style={{ fontSize: 12, fontWeight: 900, color: '#065F46' }}>${savings.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                {/* Spec summary */}
                <div style={{ borderTop: '1px solid #F0EDE8', paddingTop: 16, marginBottom: 20 }}>
                  {[
                    { icon: <Package size={13} color="#aaa" />, label: config.boxType },
                    { icon: <Ruler size={13} color="#aaa" />, label: `${config.l}×${config.w}×${config.h} ${config.unit}` },
                    { icon: <LayoutTemplate size={13} color="#aaa" />, label: config.material },
                    { icon: <Palette size={13} color="#aaa" />, label: `${config.finish} · ${config.quantity.toLocaleString()} units` },
                  ].map(({ icon, label }) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: 12, color: '#666' }}>
                      {icon} <span>{label}</span>
                    </div>
                  ))}
                </div>

                {/* Design Name */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 10, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 6 }}>
                    Design Name <span style={{ fontWeight: 400, color: '#bbb' }}>(optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder={`My ${config.boxType}`}
                    value={designName}
                    onChange={e => setDesignName(e.target.value)}
                    maxLength={60}
                    style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #E8E4DC', borderRadius: 10, fontSize: 13, outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s' }}
                    onFocus={e => e.target.style.borderColor = G}
                    onBlur={e => e.target.style.borderColor = '#E8E4DC'}
                  />
                </div>

                {/* CTA buttons */}
                <button onClick={handleAddToCart}
                  style={{ width: '100%', padding: '16px', background: addedToCart ? '#22C55E' : G, color: '#fff', border: 'none', borderRadius: 12, fontWeight: 800, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, transition: 'all 0.2s', marginBottom: 10, boxShadow: `0 4px 16px ${addedToCart ? 'rgba(34,197,94,0.35)' : 'rgba(26,77,46,0.25)'}` }}
                  onMouseEnter={e => { if (!addedToCart) { e.currentTarget.style.background = ACCENT; e.currentTarget.style.boxShadow = '0 4px 16px rgba(200,134,10,0.35)'; } }}
                  onMouseLeave={e => { if (!addedToCart) { e.currentTarget.style.background = G; e.currentTarget.style.boxShadow = '0 4px 16px rgba(26,77,46,0.25)'; } }}>
                  {addedToCart ? <><Check size={18} /> Added to Cart!</> : <><ShoppingCart size={18} /> Add to Cart</>}
                </button>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <button onClick={handleSaveDesign}
                    style={{ padding: '12px', background: 'transparent', border: `1.5px solid ${G}`, color: G, borderRadius: 10, fontWeight: 700, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = G; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = G; }}>
                    <Save size={13} /> Save Design
                  </button>
                  <button onClick={handleGetQuote}
                    style={{ padding: '12px', background: 'transparent', border: '1.5px solid #E8E4DC', color: '#666', borderRadius: 10, fontWeight: 700, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = ACCENT; e.currentTarget.style.color = ACCENT; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#E8E4DC'; e.currentTarget.style.color = '#666'; }}>
                    <ArrowRight size={13} /> Get Quote
                  </button>
                </div>

                {/* Guarantees */}
                <div style={{ marginTop: 18, padding: '14px 16px', background: BG, borderRadius: 10, border: '1px solid #E8E4DC' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                    {[
                      { icon: <ShieldCheck size={13} color={G} />, text: '100% quality guarantee' },
                      { icon: <RotateCw size={13} color={ACCENT} />, text: 'Free reprint if we get it wrong' },
                      { icon: <Award size={13} color={G} />, text: 'Free digital proof before print' },
                    ].map(({ icon, text }) => (
                      <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: '#666', fontWeight: 600 }}>
                        {icon} {text}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Sample Request Modal ─────────────────────────────────────────── */}
      {sampleModal && (
        <>
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 9000, backdropFilter: 'blur(4px)' }} onClick={() => setSampleModal(false)} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: '#fff', borderRadius: 20, padding: '32px 28px', width: 'min(95vw,520px)', zIndex: 9001, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}>
            <button onClick={() => setSampleModal(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', color: '#aaa' }}><X size={18} /></button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `${G}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Package size={18} color={G} />
              </div>
              <div>
                <h3 style={{ fontSize: 18, fontFamily: 'Outfit,sans-serif', fontWeight: 800, color: '#1A1A1A', margin: 0 }}>Request a Physical Sample</h3>
                <p style={{ fontSize: 12, color: '#888', margin: 0 }}>We'll ship a sample to your address within 5–7 days</p>
              </div>
            </div>

            <div style={{ background: `${G}08`, borderRadius: 10, padding: '10px 14px', marginBottom: 20, fontSize: 12, color: '#555', border: `1px solid ${G}20` }}>
              Box: <strong>{config.boxType}</strong> · {config.l}×{config.w}×{config.h} {config.unit} · {config.material}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Full Name *</label>
                  <input value={sampleForm.name} onChange={e => setSampleForm(f => ({ ...f, name: e.target.value }))} placeholder="John Smith" style={fieldStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Email *</label>
                  <input type="email" value={sampleForm.email} onChange={e => setSampleForm(f => ({ ...f, email: e.target.value }))} placeholder="you@example.com" style={fieldStyle} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Phone Number</label>
                <input type="tel" value={sampleForm.phone} onChange={e => setSampleForm(f => ({ ...f, phone: e.target.value }))} placeholder="+1 (555) 000-0000" style={fieldStyle} />
              </div>

              <div style={{ borderTop: '1px solid #F0EDE8', paddingTop: 12 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <MapPin size={12} /> Delivery Address
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div>
                    <label style={labelStyle}>Street Address *</label>
                    <input value={sampleForm.street} onChange={e => setSampleForm(f => ({ ...f, street: e.target.value }))} placeholder="123 Main Street, Suite 4" style={fieldStyle} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div>
                      <label style={labelStyle}>City *</label>
                      <input value={sampleForm.city} onChange={e => setSampleForm(f => ({ ...f, city: e.target.value }))} placeholder="New York" style={fieldStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>State / Province</label>
                      <input value={sampleForm.state} onChange={e => setSampleForm(f => ({ ...f, state: e.target.value }))} placeholder="NY" style={fieldStyle} />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div>
                      <label style={labelStyle}>ZIP / Postal Code *</label>
                      <input value={sampleForm.zip} onChange={e => setSampleForm(f => ({ ...f, zip: e.target.value }))} placeholder="10001" style={fieldStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Country</label>
                      <select value={sampleForm.country} onChange={e => setSampleForm(f => ({ ...f, country: e.target.value }))} style={fieldStyle}>
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="GB">United Kingdom</option>
                        <option value="AU">Australia</option>
                        <option value="PK">Pakistan</option>
                        <option value="IN">India</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <button onClick={handleSampleSubmit} disabled={sampleSubmitting}
                style={{ width: '100%', padding: '14px', background: sampleSubmitting ? '#aaa' : G, color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: sampleSubmitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 4, transition: 'background 0.15s' }}>
                {sampleSubmitting ? <><RotateCw size={15} style={{ animation: 'spin 1s linear infinite' }} /> Submitting…</> : <><Package size={15} /> Submit Sample Request</>}
              </button>
              <p style={{ fontSize: 11, color: '#999', textAlign: 'center', margin: 0 }}>Free sample kit · Ships within 5–7 business days</p>
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 1200px) {
          .configurator-grid { grid-template-columns: 300px 1fr 300px !important; }
        }
        @media (max-width: 1024px) {
          .configurator-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .configurator-grid { gap: 16px !important; }
        }
      `}</style>
    </div>
  );
}

const labelStyle = { fontSize: 11, fontWeight: 700, color: '#555', display: 'block', marginBottom: 4 };
const fieldStyle = { width: '100%', padding: '10px 12px', border: '1.5px solid #E2DDD6', borderRadius: 8, fontSize: 13, outline: 'none', boxSizing: 'border-box', background: '#fff' };

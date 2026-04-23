import { useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Download, Share2, RotateCcw, X } from 'lucide-react';
import Box3DPreview from './Box3DPreview';
import SectionLabel from './SectionLabel';
import FAQAccordion from './FAQAccordion';
import CTABanner from './CTABanner';

/* ─── Config data ─────────────────────────────────────────── */
const BOX_STYLES = [
  { id: 'tuck',      label: 'Tuck End Box',  img: 'https://placehold.co/64x48/EEF4FB/1B3F6A?text=Tuck' },
  { id: 'mailer',    label: 'Mailer Box',    img: 'https://placehold.co/64x48/EEF4FB/1B3F6A?text=Mailer' },
  { id: 'sleeve',    label: 'Sleeve Box',    img: 'https://placehold.co/64x48/EEF4FB/1B3F6A?text=Sleeve' },
  { id: 'dispenser', label: 'Dispenser Box', img: 'https://placehold.co/64x48/EEF4FB/1B3F6A?text=Disp' },
  { id: 'gable',     label: 'Gable Box',     img: 'https://placehold.co/64x48/EEF4FB/1B3F6A?text=Gable' },
];

const MATERIALS = [
  { id: '14pt',        label: '14pt Cardstock', sub: 'Lightweight' },
  { id: '16pt',        label: '16pt Cardstock', sub: 'Standard' },
  { id: '18pt',        label: '18pt Cardstock', sub: 'Premium' },
  { id: 'kraft',       label: 'Kraft',           sub: 'Eco-Friendly' },
  { id: 'corrugated',  label: 'Corrugated',      sub: 'Heavy Duty' },
];

const FINISHES = [
  { id: 'Matte',     label: 'Matte',      dot: '#94a3b8' },
  { id: 'Gloss',     label: 'Gloss',      dot: '#60a5fa' },
  { id: 'SoftTouch', label: 'Soft Touch', dot: '#c084fc' },
  { id: 'Kraft',     label: 'Kraft',      dot: '#d97706' },
];

const PRINT_OPTIONS = ['Outside Only', 'Inside & Outside', 'No Print'];

const PRESETS = [
  '#1B3F6A','#F47920','#ef4444','#22c55e',
  '#a855f7','#ec4899','#f59e0b','#1e293b','#ffffff','#14b8a6',
];

const QUANTITIES  = [100, 250, 500, 1000, 2500, 5000];
const PRICING_MAP = {
  100:  { perBox: 3.49, total: 349 },
  250:  { perBox: 2.79, total: 698 },
  500:  { perBox: 1.89, total: 945 },
  1000: { perBox: 1.49, total: 1490 },
  2500: { perBox: 1.19, total: 2975 },
  5000: { perBox: 0.99, total: 4950 },
};

const CONFIGURATOR_FAQS = [
  { q: 'What box dimensions should I enter?',
    a: 'Enter the inner dimensions of your box (Length × Width × Height). This is the usable space inside the box. Our team will account for material thickness when preparing your dieline.' },
  { q: 'Can I upload my own artwork?',
    a: 'Yes! Upload AI, EPS, PDF, or PSD files at 300 DPI with CMYK color mode. If you don\'t have print-ready artwork, our design team will create it for you at no extra charge.' },
  { q: 'Will I see a proof before production starts?',
    a: 'Absolutely. Every order includes a 2D dieline proof and a full-color 3D digital mockup. Production only begins after you provide written approval.' },
  { q: 'What materials are best for my product?',
    a: '16pt Cardstock is our most popular choice for retail packaging. Kraft is ideal for eco-conscious brands. Corrugated is best for heavier products or shipping boxes. Our team can recommend the perfect fit.' },
  { q: 'How does pricing work with different quantities?',
    a: 'Per-unit cost decreases as quantity increases. The live pricing display updates instantly as you select your quantity. Final pricing is confirmed in your quote and includes printing and standard finishing.' },
];

/* ─── Sub-components ─────────────────────────────────────── */

function StepCard({ num, title, children }) {
  return (
    <div className="bg-white rounded-lg shadow-card p-5 mb-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-7 h-7 rounded-full bg-[#1B3F6A] flex items-center justify-center flex-shrink-0">
          <span className="text-white text-xs font-bold">{num}</span>
        </div>
        <h3 className="font-semibold text-[#1B3F6A] text-sm">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between py-2 border-b border-gray-100 last:border-0 text-sm">
      <span className="text-[#6B7280]">{label}</span>
      <span className="font-semibold text-[#1B3F6A]">{value}</span>
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-y-auto max-h-[90vh]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 className="font-bold text-[#1B3F6A] text-lg">{title}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X size={18} />
            </button>
          </div>
          <div className="p-6">{children}</div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function ContactFields({ form, setForm }) {
  return (
    <div className="space-y-3">
      {[
        { k: 'name',    label: 'Full Name',     type: 'text',  ph: 'Jane Smith' },
        { k: 'email',   label: 'Email Address', type: 'email', ph: 'jane@brand.com' },
        { k: 'phone',   label: 'Phone Number',  type: 'tel',   ph: '(800) 123-4567' },
        { k: 'company', label: 'Company',        type: 'text',  ph: 'Acme Brands Co.' },
      ].map(({ k, label, type, ph }) => (
        <div key={k}>
          <label className="block text-xs font-semibold text-[#1B3F6A] mb-1">{label}</label>
          <input
            type={type}
            placeholder={ph}
            value={form[k] || ''}
            onChange={(e) => setForm((f) => ({ ...f, [k]: e.target.value }))}
            className="w-full border border-gray-200 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-[#1B3F6A] focus:ring-1 focus:ring-[#1B3F6A] text-[#1A1A2E] placeholder:text-gray-300"
          />
        </div>
      ))}
    </div>
  );
}

/* ─── How it works steps (matches homepage pattern) ───────── */
const CFG_STEPS = [
  { num: '01', title: 'Enter your box dimensions',       desc: 'Input the exact inner Length, Width, and Height for your product.' },
  { num: '02', title: 'Choose style, material & finish', desc: 'Pick from 5 box styles, 5 material options, and 4 premium finishes.' },
  { num: '03', title: 'Preview your box in 3D',          desc: 'Watch your box update in real-time — rotate, zoom, and switch to dieline view.' },
  { num: '04', title: 'Get your instant quote',          desc: 'Review pricing for your quantity and submit a quote request in seconds.' },
];

const FEATURE_TILES = [
  { emoji: '📦', title: 'Low 100 Minimum',         sub: 'Order as few as 100 units' },
  { emoji: '🎨', title: 'Free Design Support',      sub: 'In-house designers included' },
  { emoji: '⏱️', title: '8–10 Day Turnaround',      sub: 'Rush options available' },
  { emoji: '🚚', title: 'Free Shipping',             sub: 'On all standard orders' },
  { emoji: '🖼️', title: '2D & 3D Mockup Included',  sub: 'Before production begins' },
];

/* ─── Wave divider (matches site pattern) ────────────────── */
function WaveDivider({ flip = false }) {
  return (
    <div className={`w-full overflow-hidden leading-none ${flip ? 'rotate-180' : ''}`}>
      <svg viewBox="0 0 1440 40" preserveAspectRatio="none" className="w-full h-10">
        <path d="M0,20 C480,45 960,0 1440,20 L1440,40 L0,40 Z" fill="#EEF4FB" />
      </svg>
    </div>
  );
}

/* ─── Main Configurator ──────────────────────────────────── */
export default function BoxConfigurator() {
  const [dims, setDims]       = useState({ l: 6, w: 4, h: 3 });
  const [unit, setUnit]       = useState('in');
  const [style, setStyle]     = useState('tuck');
  const [material, setMat]    = useState('16pt');
  const [finish, setFinish]   = useState('Matte');
  const [print, setPrint]     = useState('Outside Only');
  const [color, setColor]     = useState('#1B3F6A');
  const [qty, setQty]         = useState(500);
  const [fileName, setFile]   = useState(null);
  const [viewMode, setView]   = useState('3d');
  const [quoteModal, setQuote]  = useState(false);
  const [sampleModal, setSample] = useState(false);
  const [form, setForm]       = useState({});

  const pricing = PRICING_MAP[qty] || { perBox: 1.89, total: 945 };

  const handleDim = (k, v) => {
    const n = parseFloat(v);
    if (!isNaN(n) && n > 0) setDims((d) => ({ ...d, [k]: n }));
  };

  const reset = () => {
    setDims({ l: 6, w: 4, h: 3 }); setUnit('in'); setStyle('tuck');
    setMat('16pt'); setFinish('Matte'); setPrint('Outside Only');
    setColor('#1B3F6A'); setQty(500); setFile(null);
  };

  const download = () => {
    const spec = {
      dimensions: `${dims.l} × ${dims.w} × ${dims.h} ${unit}`,
      style:    BOX_STYLES.find((s) => s.id === style)?.label,
      material: MATERIALS.find((m) => m.id === material)?.label,
      finish, print, color,
      quantity: qty,
      pricing:  `$${pricing.perBox}/box · $${pricing.total.toLocaleString()} total`,
    };
    const a = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(new Blob([JSON.stringify(spec, null, 2)], { type: 'application/json' })),
      download: 'box-spec.json',
    });
    a.click();
  };

  const share = () => {
    const url = `${window.location.origin}/custom-box?l=${dims.l}&w=${dims.w}&h=${dims.h}&color=${encodeURIComponent(color)}&qty=${qty}`;
    navigator.clipboard.writeText(url).then(() => alert('Link copied to clipboard!'));
  };

  const submitQuote = () => {
    setQuote(false);
    alert('Quote request submitted! We\'ll respond within 24 hours.');
  };
  const submitSample = () => {
    setSample(false);
    alert('Sample kit request received! Expect delivery in 3–5 business days.');
  };

  /* shared input style */
  const inputCls = 'w-full border border-gray-200 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-[#1B3F6A] focus:ring-1 focus:ring-[#1B3F6A] text-[#1A1A2E]';

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="bg-white py-14 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <SectionLabel text="Design Your Packaging" />
          <h1 className="text-4xl sm:text-5xl font-bold text-[#1B3F6A] mt-1 mb-4 leading-tight">
            Build Your Custom Box
          </h1>
          <p className="text-[#6B7280] text-base max-w-xl mx-auto mb-8">
            Enter your dimensions, choose your style and finish, and see your box come to life in real-time 3D.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setQuote(true)}
              className="bg-[#F47920] hover:bg-[#d96510] text-white font-semibold px-7 py-3 rounded-md transition-colors"
            >
              Get Instant Quote
            </button>
            <button
              onClick={() => setSample(true)}
              className="border-2 border-[#1B3F6A] text-[#1B3F6A] hover:bg-[#1B3F6A] hover:text-white font-semibold px-7 py-3 rounded-md transition-all"
            >
              Request a Sample
            </button>
          </div>
        </div>
      </section>

      {/* ── Configurator ─────────────────────────────────── */}
      <section className="bg-[#EEF4FB] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

            {/* LEFT — Config panel */}
            <div className="space-y-0">

              {/* Step 1: Box Style */}
              <StepCard num="1" title="Box Style">
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {BOX_STYLES.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setStyle(s.id)}
                      className={`flex flex-col items-center gap-1.5 p-2.5 rounded-lg border-2 transition-all ${
                        style === s.id
                          ? 'border-[#F47920] bg-orange-50'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <img src={s.img} alt={s.label} className="w-full h-9 object-cover rounded" />
                      <span className="text-[10px] font-semibold text-[#1B3F6A] text-center leading-tight">{s.label}</span>
                    </button>
                  ))}
                </div>
              </StepCard>

              {/* Step 2: Dimensions */}
              <StepCard num="2" title="Box Dimensions">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs text-[#6B7280] font-medium">Unit:</span>
                  <div className="flex bg-gray-100 rounded-md p-0.5">
                    {['in', 'cm'].map((u) => (
                      <button
                        key={u}
                        onClick={() => setUnit(u)}
                        className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
                          unit === u ? 'bg-[#1B3F6A] text-white' : 'text-[#6B7280]'
                        }`}
                      >
                        {u.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[['l','Length'],['w','Width'],['h','Height']].map(([k, label]) => (
                    <div key={k}>
                      <label className="text-xs font-semibold text-[#6B7280] block mb-1">{label}</label>
                      <div className="relative">
                        <input
                          type="number" min="1" max="100" step="0.5"
                          value={dims[k]}
                          onChange={(e) => handleDim(k, e.target.value)}
                          className={inputCls + ' pr-7'}
                        />
                        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">{unit}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-[#6B7280] mt-2">
                  Current: {dims.l} × {dims.w} × {dims.h} {unit}
                </p>
              </StepCard>

              {/* Step 3: Material */}
              <StepCard num="3" title="Material">
                <div className="space-y-2">
                  {MATERIALS.map((m) => (
                    <label
                      key={m.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        material === m.id
                          ? 'border-[#1B3F6A] bg-[#EEF4FB]'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <input
                        type="radio" name="material" value={m.id}
                        checked={material === m.id}
                        onChange={() => setMat(m.id)}
                        className="accent-[#1B3F6A]"
                      />
                      <div>
                        <div className="text-sm font-semibold text-[#1B3F6A]">{m.label}</div>
                        <div className="text-xs text-[#6B7280]">{m.sub}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </StepCard>

              {/* Step 4: Finish */}
              <StepCard num="4" title="Finish">
                <div className="grid grid-cols-2 gap-2">
                  {FINISHES.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setFinish(f.id)}
                      className={`flex items-center gap-2.5 p-3 rounded-lg border-2 transition-all ${
                        finish === f.id
                          ? 'border-[#F47920] bg-orange-50'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ background: f.dot }} />
                      <span className="text-sm font-semibold text-[#1B3F6A]">{f.label}</span>
                    </button>
                  ))}
                </div>
              </StepCard>

              {/* Step 5: Printing */}
              <StepCard num="5" title="Printing">
                <div className="flex flex-wrap gap-2">
                  {PRINT_OPTIONS.map((p) => (
                    <button
                      key={p}
                      onClick={() => setPrint(p)}
                      className={`px-4 py-2 rounded-md border-2 text-sm font-semibold transition-all ${
                        print === p
                          ? 'bg-[#1B3F6A] border-[#1B3F6A] text-white'
                          : 'border-gray-200 text-[#6B7280] hover:border-gray-300 bg-white'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </StepCard>

              {/* Step 6: Color */}
              <StepCard num="6" title="Box Color">
                <div className="flex flex-wrap gap-2 mb-3">
                  {PRESETS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      title={c}
                      className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                        color === c ? 'border-[#F47920] scale-110 ring-2 ring-[#F47920] ring-offset-1' : 'border-transparent'
                      }`}
                      style={{ background: c, outline: c === '#ffffff' ? '1px solid #e5e7eb' : 'none' }}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-[#6B7280]">Hex:</label>
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => { if (/^#[0-9A-Fa-f]{0,6}$/.test(e.target.value)) setColor(e.target.value); }}
                    maxLength={7}
                    className="flex-1 border border-gray-200 rounded-md px-3 py-1.5 text-sm font-mono focus:outline-none focus:border-[#1B3F6A]"
                  />
                  <input
                    type="color"
                    value={color.length === 7 ? color : '#1B3F6A'}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-9 h-9 rounded-md cursor-pointer border border-gray-200 p-0.5"
                  />
                </div>
              </StepCard>

              {/* Step 7: Artwork Upload */}
              <StepCard num="7" title="Upload Artwork">
                <label className="flex flex-col items-center gap-2.5 border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-[#F47920] hover:bg-orange-50 transition-all">
                  <Upload size={22} className="text-[#6B7280]" />
                  <div className="text-center">
                    <p className="text-sm font-semibold text-[#1B3F6A]">
                      {fileName || 'Upload your logo or artwork'}
                    </p>
                    <p className="text-xs text-[#6B7280] mt-0.5">PNG, PDF, AI, EPS — max 50 MB</p>
                  </div>
                  <input
                    type="file"
                    accept=".png,.pdf,.ai,.eps,.psd"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files[0]?.name || null)}
                  />
                </label>
              </StepCard>

              {/* Step 8: Quantity + Pricing */}
              <StepCard num="8" title="Quantity">
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {QUANTITIES.map((q) => (
                    <button
                      key={q}
                      onClick={() => setQty(q)}
                      className={`py-2.5 rounded-md border-2 text-sm font-semibold transition-all ${
                        qty === q
                          ? 'bg-[#F47920] border-[#F47920] text-white'
                          : 'border-gray-200 text-[#1B3F6A] hover:border-gray-300 bg-white'
                      }`}
                    >
                      {q.toLocaleString()}
                    </button>
                  ))}
                </div>
                {/* Live pricing display */}
                <div className="bg-[#EEF4FB] rounded-lg p-4">
                  <div className="flex justify-between items-center mb-1 text-sm">
                    <span className="text-[#6B7280]">{qty.toLocaleString()} units</span>
                    <span className="font-semibold text-[#1B3F6A]">${pricing.perBox}/box</span>
                  </div>
                  <div className="border-t border-[#1B3F6A]/15 pt-2 mt-2 flex justify-between items-center">
                    <span className="font-semibold text-[#1B3F6A] text-sm">Total Estimate</span>
                    <span className="font-bold text-2xl text-[#F47920]">${pricing.total.toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-[#6B7280] mt-1.5">*Final price confirmed in quote. Includes printing & standard finish.</p>
                </div>
              </StepCard>

              {/* Reset link */}
              <button
                onClick={reset}
                className="flex items-center gap-1.5 text-xs text-[#6B7280] hover:text-[#1B3F6A] transition-colors mt-2"
              >
                <RotateCcw size={12} /> Start Over
              </button>
            </div>

            {/* RIGHT — 3D Preview */}
            <div className="lg:sticky lg:top-24">
              <div className="bg-white rounded-lg shadow-card overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                  <h3 className="font-semibold text-[#1B3F6A] text-sm">Live 3D Preview</h3>
                  <div className="flex bg-gray-100 rounded-md p-0.5">
                    {[['3d','3D View'],['dieline','Dieline']].map(([v, label]) => (
                      <button
                        key={v}
                        onClick={() => setView(v)}
                        className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
                          viewMode === v ? 'bg-[#1B3F6A] text-white' : 'text-[#6B7280]'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Canvas */}
                <div
                  className="relative"
                  style={{ height: 480, background: 'linear-gradient(135deg, #f8fbff 0%, #EEF4FB 100%)' }}
                >
                  <Suspense fallback={
                    <div className="absolute inset-0 flex items-center justify-center text-sm text-[#6B7280]">
                      Loading 3D preview…
                    </div>
                  }>
                    <Box3DPreview dims={dims} color={color} finish={finish} viewMode={viewMode} />
                  </Suspense>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/30 text-white text-[10px] px-3 py-1 rounded-full backdrop-blur-sm">
                    Drag to rotate · Scroll to zoom
                  </div>
                </div>

                {/* Toolbar */}
                <div className="flex gap-2 px-5 py-3 border-t border-gray-100">
                  <button
                    onClick={() => setView('3d')}
                    className="flex-1 border-2 border-[#1B3F6A] text-[#1B3F6A] text-xs font-semibold py-2 rounded-md hover:bg-[#1B3F6A] hover:text-white transition-all"
                  >
                    Reset View
                  </button>
                  <button
                    onClick={() => setView(viewMode === '3d' ? 'dieline' : '3d')}
                    className="flex-1 border-2 border-gray-200 text-[#6B7280] text-xs font-semibold py-2 rounded-md hover:border-[#1B3F6A] hover:text-[#1B3F6A] transition-all"
                  >
                    {viewMode === '3d' ? 'Dieline View' : '3D View'}
                  </button>
                </div>

                {/* Spec summary strip */}
                <div className="px-5 pb-4">
                  <div className="bg-[#EEF4FB] rounded-lg p-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                    {[
                      { label: 'Size',     value: `${dims.l}×${dims.w}×${dims.h}${unit}` },
                      { label: 'Style',    value: BOX_STYLES.find((s) => s.id === style)?.label.split(' ')[0] },
                      { label: 'Material', value: MATERIALS.find((m) => m.id === material)?.label.split(' ')[0] },
                      { label: 'Finish',   value: finish },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <div className="text-[10px] text-[#6B7280] mb-0.5">{label}</div>
                        <div className="text-xs font-semibold text-[#1B3F6A] truncate">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Quote Summary ─────────────────────────────────── */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <SectionLabel text="Your Order Summary" />
            <h2 className="text-3xl font-bold text-[#1B3F6A] mt-1">Review Your Configuration</h2>
          </div>
          <div className="bg-[#EEF4FB] rounded-lg p-6 mb-8">
            <Row label="Box Dimensions"  value={`${dims.l} × ${dims.w} × ${dims.h} ${unit}`} />
            <Row label="Box Style"       value={BOX_STYLES.find((s) => s.id === style)?.label || '—'} />
            <Row label="Material"        value={MATERIALS.find((m) => m.id === material)?.label || '—'} />
            <Row label="Finish"          value={finish} />
            <Row label="Printing"        value={print} />
            <Row label="Quantity"        value={`${qty.toLocaleString()} units`} />
            <Row label="Price per Box"   value={`$${pricing.perBox}`} />
            <div className="flex justify-between pt-3 mt-1 border-t-2 border-[#1B3F6A]/20">
              <span className="font-bold text-[#1B3F6A]">Estimated Total</span>
              <span className="font-bold text-xl text-[#F47920]">${pricing.total.toLocaleString()}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setQuote(true)}
              className="bg-[#F47920] hover:bg-[#d96510] text-white font-semibold px-8 py-3 rounded-md transition-colors"
            >
              Get Instant Quote
            </button>
            <button
              onClick={() => setSample(true)}
              className="border-2 border-[#1B3F6A] text-[#1B3F6A] hover:bg-[#1B3F6A] hover:text-white font-semibold px-8 py-3 rounded-md transition-all"
            >
              Request Sample
            </button>
            <button
              onClick={download}
              className="flex items-center gap-2 border-2 border-gray-300 text-[#6B7280] hover:border-[#6B7280] font-semibold px-6 py-3 rounded-md transition-all"
            >
              <Download size={14} /> Save My Design
            </button>
            <button
              onClick={share}
              className="flex items-center gap-2 border-2 border-gray-300 text-[#6B7280] hover:border-[#6B7280] font-semibold px-6 py-3 rounded-md transition-all"
            >
              <Share2 size={14} /> Share Link
            </button>
          </div>
        </div>
      </section>

      {/* ── How the Configurator Works ───────────────────── */}
      <WaveDivider />
      <section className="bg-[#EEF4FB] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <SectionLabel text="How It Works" />
            <h2 className="text-3xl font-bold text-[#1B3F6A] mt-1">
              How the Custom Box Configurator Works
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            <div className="hidden lg:block absolute top-9 left-[12.5%] right-[12.5%] h-px bg-[#1B3F6A]/20 z-0" />
            {CFG_STEPS.map((step, i) => (
              <div
                key={step.num}
                className="relative bg-white rounded-lg shadow-card p-6 text-center z-10"
              >
                <div className="w-14 h-14 bg-[#1B3F6A] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-lg">{step.num}</span>
                </div>
                <h3 className="font-semibold text-[#1B3F6A] mb-2 text-sm leading-snug">{step.title}</h3>
                <p className="text-[#6B7280] text-xs leading-relaxed">{step.desc}</p>
                {i < 3 && (
                  <svg className="hidden lg:block absolute -right-3 top-10 z-20 text-[#F47920]" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      <WaveDivider flip />

      {/* ── Feature tiles (matches homepage stat tiles) ───── */}
      <section className="bg-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {FEATURE_TILES.map(({ emoji, title, sub }) => (
              <div
                key={title}
                className="bg-[#EEF4FB] rounded-lg p-5 text-center hover:shadow-card transition-shadow"
              >
                <div className="text-3xl mb-2">{emoji}</div>
                <div className="font-semibold text-[#1B3F6A] text-sm mb-0.5">{title}</div>
                <div className="text-xs text-[#6B7280]">{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────── */}
      <section className="bg-[#EEF4FB] py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <SectionLabel text="FAQs" />
            <h2 className="text-3xl font-bold text-[#1B3F6A] mt-1">Custom Box Questions Answered</h2>
          </div>
          <FAQAccordion items={CONFIGURATOR_FAQS} />
        </div>
      </section>

      {/* ── Bottom CTA ───────────────────────────────────── */}
      <CTABanner wave={false} />

      {/* ── Modals ───────────────────────────────────────── */}
      {quoteModal && (
        <Modal title="Get Instant Quote" onClose={() => setQuote(false)}>
          <div className="bg-[#EEF4FB] rounded-lg p-4 mb-5 space-y-0">
            <Row label="Dimensions"  value={`${dims.l} × ${dims.w} × ${dims.h} ${unit}`} />
            <Row label="Style"       value={BOX_STYLES.find((s) => s.id === style)?.label} />
            <Row label="Material"    value={MATERIALS.find((m) => m.id === material)?.label} />
            <Row label="Finish"      value={finish} />
            <Row label="Printing"    value={print} />
            <Row label="Quantity"    value={`${qty.toLocaleString()} units`} />
            <div className="flex justify-between pt-3 mt-1 border-t-2 border-[#1B3F6A]/20 font-bold">
              <span className="text-[#1B3F6A]">Estimated Total</span>
              <span className="text-[#F47920]">${pricing.total.toLocaleString()}</span>
            </div>
          </div>
          <ContactFields form={form} setForm={setForm} />
          <button
            onClick={submitQuote}
            className="mt-5 w-full bg-[#F47920] hover:bg-[#d96510] text-white font-semibold py-3.5 rounded-md transition-colors"
          >
            Send Quote Request
          </button>
        </Modal>
      )}

      {sampleModal && (
        <Modal title="Request a Free Sample Kit" onClose={() => setSample(false)}>
          <p className="text-sm text-[#6B7280] mb-5">
            We'll ship a free sample kit with material swatches and print examples directly to you — no strings attached.
          </p>
          <ContactFields form={form} setForm={setForm} />
          <div className="mt-3">
            <label className="block text-xs font-semibold text-[#1B3F6A] mb-1">Shipping Address</label>
            <textarea
              rows={3}
              placeholder="123 Main St, Suite 100&#10;New York, NY 10001"
              className="w-full border border-gray-200 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-[#1B3F6A] resize-none"
            />
          </div>
          <button
            onClick={submitSample}
            className="mt-5 w-full bg-[#1B3F6A] hover:bg-[#152f52] text-white font-semibold py-3.5 rounded-md transition-colors"
          >
            Send Request
          </button>
        </Modal>
      )}
    </div>
  );
}

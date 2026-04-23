import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, Phone, Menu, X, ArrowRight } from 'lucide-react';

/* ─── Nav data ───────────────────────────────────────────── */
const productCols = [
  [
    { label: 'Bottom Closure',   to: '/products/bottom-closure',   img: 'https://placehold.co/48x48/EEF4FB/1B3F6A?text=BC' },
    { label: 'CD Covers',         to: '/products/cd-covers',         img: 'https://placehold.co/48x48/EEF4FB/1B3F6A?text=CD' },
    { label: 'Figure & Pattern',  to: '/products/figure-pattern',   img: 'https://placehold.co/48x48/EEF4FB/1B3F6A?text=FP' },
    { label: 'Fold & Assemble',   to: '/products/fold-assemble',    img: 'https://placehold.co/48x48/EEF4FB/1B3F6A?text=FA' },
  ],
  [
    { label: 'Rectangular',       to: '/products/rectangular',       img: 'https://placehold.co/48x48/EEF4FB/1B3F6A?text=RE' },
    { label: 'Showcase Exhibit',  to: '/products/showcase-exhibit', img: 'https://placehold.co/48x48/EEF4FB/1B3F6A?text=SE' },
    { label: 'Top Closure',       to: '/products/top-closure',       img: 'https://placehold.co/48x48/EEF4FB/1B3F6A?text=TC' },
    { label: 'Tuck End Boxes',    to: '/products/tuck-end',          img: 'https://placehold.co/48x48/EEF4FB/1B3F6A?text=TE' },
  ],
];

const industryCols = [
  [
    { label: 'Apparel & Fashion', to: '/industries/apparel-fashion', img: 'https://placehold.co/48x48/EEF4FB/1B3F6A?text=AF' },
    { label: 'Candle Boxes',      to: '/industries/candle-boxes',    img: 'https://placehold.co/48x48/EEF4FB/1B3F6A?text=CB' },
    { label: 'CBD Packaging',     to: '/industries/cbd-packaging',   img: 'https://placehold.co/48x48/EEF4FB/1B3F6A?text=CBD' },
    { label: 'Cosmetic Boxes',    to: '/industries/cosmetic-boxes',  img: 'https://placehold.co/48x48/EEF4FB/1B3F6A?text=CO' },
  ],
  [
    { label: 'Ecommerce Boxes',   to: '/industries/ecommerce-boxes', img: 'https://placehold.co/48x48/EEF4FB/1B3F6A?text=EC' },
    { label: 'Food & Beverage',   to: '/industries/food-beverage',   img: 'https://placehold.co/48x48/EEF4FB/1B3F6A?text=FB' },
    { label: 'Retail Boxes',      to: '/industries/retail-boxes',    img: 'https://placehold.co/48x48/EEF4FB/1B3F6A?text=RB' },
    { label: 'Shipping & Mailer', to: '/industries/shipping-mailer', img: 'https://placehold.co/48x48/EEF4FB/1B3F6A?text=SM' },
  ],
];

const aboutLinks = [
  { label: 'Why Refine Packaging', to: '/why-us' },
  { label: 'How It Works',         to: '/how-it-works' },
  { label: 'Success Stories',      to: '/about#stories' },
  { label: 'Testimonials',         to: '/about#testimonials' },
  { label: 'Company',              to: '/about' },
  { label: 'FAQs',                 to: '/faqs' },
];

/* ─── Expert panel (col 3 of mega dropdown) ─────────────── */
function ExpertPanel() {
  return (
    <div className="p-6 bg-[#EEF4FB] rounded-br-xl h-full flex flex-col">
      <p className="text-[10px] font-bold uppercase tracking-widest text-[#F47920] mb-3">
        Get Help With
      </p>
      <p className="text-sm font-bold text-[#1B3F6A] mb-2 leading-snug">
        Expert Packaging Guidance
      </p>
      <img
        src="https://placehold.co/220x110/1B3F6A/ffffff?text=Our+Expert+Team"
        alt="Team"
        className="w-full rounded-lg mb-3 object-cover"
      />
      <p className="text-xs text-[#6B7280] mb-4 leading-relaxed flex-1">
        Not sure which style is right? Our specialists will help you choose the perfect packaging.
      </p>
      <a
        href="tel:8001234567"
        className="flex items-center gap-1.5 text-[#1B3F6A] font-semibold text-sm mb-3 hover:text-[#F47920] transition-colors"
      >
        <Phone size={13} /> (800) 123-4567
      </a>
      <Link
        to="/custom-box"
        className="block text-center bg-[#F47920] hover:bg-[#d96510] text-white text-sm font-semibold py-2.5 rounded-md transition-colors"
      >
        Get Free Quote
      </Link>
    </div>
  );
}

/* ─── Reusable Mega Dropdown ─────────────────────────────── */
function MegaDropdown({ cols, viewAllTo }) {
  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 w-[820px] bg-white shadow-2xl rounded-b-xl border-t-2 border-[#F47920] z-50 animate-slide-down overflow-hidden">
      <div className="grid grid-cols-3">
        {/* Col 1 */}
        <div className="p-5 border-r border-gray-100">
          {cols[0].map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-[#EEF4FB] group transition-colors"
            >
              <img src={item.img} alt={item.label} className="w-10 h-10 rounded-md object-cover flex-shrink-0" />
              <span className="text-sm font-medium text-[#1A1A2E] group-hover:text-[#1B3F6A] transition-colors">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
        {/* Col 2 */}
        <div className="p-5 border-r border-gray-100">
          {cols[1].map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-[#EEF4FB] group transition-colors"
            >
              <img src={item.img} alt={item.label} className="w-10 h-10 rounded-md object-cover flex-shrink-0" />
              <span className="text-sm font-medium text-[#1A1A2E] group-hover:text-[#1B3F6A] transition-colors">
                {item.label}
              </span>
            </Link>
          ))}
          <Link
            to={viewAllTo}
            className="flex items-center gap-1 mt-3 px-2 text-xs font-semibold text-[#F47920] hover:gap-2 transition-all"
          >
            View All <ArrowRight size={11} />
          </Link>
        </div>
        {/* Col 3 */}
        <ExpertPanel />
      </div>
    </div>
  );
}

/* ─── About simple dropdown ──────────────────────────────── */
function AboutDropdown() {
  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 w-56 bg-white shadow-2xl rounded-b-xl border-t-2 border-[#F47920] z-50 animate-slide-down py-2">
      {aboutLinks.map((l) => (
        <Link
          key={l.label}
          to={l.to}
          className="block px-5 py-2.5 text-sm font-medium text-[#1A1A2E] hover:bg-[#EEF4FB] hover:text-[#1B3F6A] transition-colors"
        >
          {l.label}
        </Link>
      ))}
    </div>
  );
}

/* ─── Navbar ─────────────────────────────────────────────── */
export default function Navbar() {
  const [open, setOpen] = useState(null);   // 'products' | 'industries' | 'about' | null
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const navRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    setOpen(null);
    setMobileOpen(false);
  }, [location]);

  useEffect(() => {
    const handler = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) setOpen(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const navLinks = [
    { label: 'Products',   key: 'products' },
    { label: 'Industries', key: 'industries' },
    { label: 'About',      key: 'about' },
  ];

  return (
    <nav ref={navRef} className="bg-white shadow-sm sticky top-0 z-40 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-[68px]">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-9 h-9 bg-[#1B3F6A] rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-base">R</span>
            </div>
            <span className="font-black text-xl text-[#1B3F6A] tracking-tight">
              Refine<span className="text-[#F47920]">Packaging</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-0.5">
            {navLinks.map(({ label, key }) => (
              <div key={key} className="relative">
                <button
                  onMouseEnter={() => setOpen(key)}
                  onMouseLeave={() => setOpen(null)}
                  onClick={() => setOpen((p) => (p === key ? null : key))}
                  className={`flex items-center gap-1 px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
                    open === key
                      ? 'text-[#F47920]'
                      : 'text-[#1B3F6A] hover:text-[#F47920]'
                  }`}
                >
                  {label}
                  <ChevronDown
                    size={13}
                    className={`transition-transform duration-200 ${open === key ? 'rotate-180' : ''}`}
                  />
                </button>

                {open === key && (
                  <div
                    onMouseEnter={() => setOpen(key)}
                    onMouseLeave={() => setOpen(null)}
                  >
                    {key === 'products'   && <MegaDropdown cols={productCols}  viewAllTo="/products" />}
                    {key === 'industries' && <MegaDropdown cols={industryCols} viewAllTo="/industries" />}
                    {key === 'about'      && <AboutDropdown />}
                  </div>
                )}
              </div>
            ))}

            <NavLink
              to="/custom-box"
              className={({ isActive }) =>
                `px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
                  isActive ? 'text-[#F47920]' : 'text-[#1B3F6A] hover:text-[#F47920]'
                }`
              }
            >
              Custom Box
            </NavLink>
          </div>

          {/* Right: avatars + phone + CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div className="flex -space-x-2">
                {['A','B','C'].map((l, i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full bg-[#1B3F6A] border-2 border-white flex items-center justify-center text-white text-[10px] font-bold"
                  >
                    {l}
                  </div>
                ))}
              </div>
              <a
                href="tel:8001234567"
                className="flex items-center gap-1.5 text-sm font-semibold text-[#1B3F6A] hover:text-[#F47920] transition-colors"
              >
                <Phone size={13} className="text-[#F47920]" />
                (800) 123-4567
              </a>
            </div>
            <Link
              to="/custom-box"
              className="bg-[#F47920] hover:bg-[#d96510] text-white font-semibold text-sm px-5 py-2.5 rounded-md transition-colors shadow-sm"
            >
              Get Free Quote
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 text-[#1B3F6A]"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg animate-fade-in">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map(({ label, key }) => (
              <div key={key}>
                <button
                  onClick={() => setMobileExpanded((p) => (p === key ? null : key))}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-semibold text-[#1B3F6A] hover:bg-[#EEF4FB] rounded-lg"
                >
                  {label}
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${mobileExpanded === key ? 'rotate-180' : ''}`}
                  />
                </button>
                {mobileExpanded === key && (
                  <div className="ml-3 mt-1 pl-3 border-l-2 border-[#EEF4FB] space-y-1">
                    {(key === 'products'
                      ? [...productCols[0], ...productCols[1]]
                      : key === 'industries'
                      ? [...industryCols[0], ...industryCols[1]]
                      : aboutLinks
                    ).map((item) => (
                      <Link
                        key={item.label || item.to}
                        to={item.to}
                        className="block py-2 text-sm text-[#6B7280] hover:text-[#1B3F6A]"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Link
              to="/custom-box"
              className="block px-3 py-2.5 text-sm font-semibold text-[#F47920] hover:bg-orange-50 rounded-lg"
            >
              Custom Box
            </Link>
            <div className="pt-3 border-t border-gray-100">
              <Link
                to="/custom-box"
                className="block w-full text-center bg-[#F47920] hover:bg-[#d96510] text-white font-semibold py-3 rounded-md transition-colors"
              >
                Get Free Quote
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

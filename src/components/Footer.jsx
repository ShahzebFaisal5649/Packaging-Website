import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

/* ── Social SVGs ─────────────────────────────────── */
const FB  = () => <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>;
const TW  = () => <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/></svg>;
const IG  = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>;
const LI  = () => <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>;

const productLinks = [
  'Bath Bomb Boxes','CBD Boxes','Hair Extension Boxes','Lip Balm Boxes',
  'Mailer Boxes','Product Boxes','Soap Boxes','Vape Cartridge Boxes',
];
const industryLinks = [
  'Cannabis Boxes','Cosmetics & Beauty','Display Packaging','Kraft Boxes',
  'Food Boxes','Gift Boxes','Retail Boxes','Stickers & Labels',
];
const companyLinks = [
  { label:'About',               to:'/about' },
  { label:'Artwork Guidelines',  to:'/about' },
  { label:'Why Refine',          to:'/why-us' },
  { label:'How It Works',        to:'/how-it-works' },
  { label:'Customer Stories',    to:'/about#stories' },
  { label:'Testimonials',        to:'/about#testimonials' },
  { label:'FAQs',                to:'/faqs' },
  { label:'Blog',                to:'/' },
  { label:'Get Free Quote',      to:'/custom-box' },
  { label:'Contact Us',          to:'/custom-box' },
];
const articles = [
  'How Custom Packaging Boosts Brand Recognition',
  '10 Sustainable Packaging Trends for 2025',
  'The Ultimate Guide to Box Styles for E-Commerce',
  'Why Unboxing Experience Matters for Retention',
  'Choosing the Right Material for Product Packaging',
  'Top 7 Custom Box Finishes Explained',
  'How to Reduce Packaging Costs Without Sacrificing Quality',
  'Cannabis Packaging Laws: What Brands Need to Know',
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  return (
    <footer className="bg-[#1B3F6A] text-white">

      {/* ── Row 1: 4 columns ───────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Col 1: Email opt-in */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 bg-[#F47920] rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-sm">R</span>
              </div>
              <span className="font-black text-lg text-white tracking-tight">
                Refine<span className="text-[#F47920]">Packaging</span>
              </span>
            </Link>
            <p className="text-sm font-semibold text-white mb-1">Get 10% off your first order</p>
            <p className="text-xs text-white/50 mb-3">Enter your email to receive your discount code.</p>
            {submitted ? (
              <p className="text-[#F47920] text-sm font-semibold">✓ Code sent! Check your inbox.</p>
            ) : (
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="flex-1 bg-white/10 border border-white/20 rounded-md px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#F47920]"
                />
                <button
                  onClick={() => email && setSubmitted(true)}
                  className="bg-[#F47920] hover:bg-[#d96510] px-4 py-2 rounded-md text-sm font-semibold transition-colors flex-shrink-0"
                >
                  Get Code
                </button>
              </div>
            )}
            <p className="text-xs text-white/30 mt-2">*By subscribing you agree to our privacy policy.</p>

            {/* Social icons */}
            <div className="flex gap-2 mt-6">
              {[
                { Icon: FB,  label: 'Facebook' },
                { Icon: TW,  label: 'Twitter' },
                { Icon: IG,  label: 'Instagram' },
                { Icon: LI,  label: 'LinkedIn' },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-8 h-8 bg-white/10 hover:bg-[#F47920] rounded-md flex items-center justify-center transition-colors"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: Products */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#F47920] mb-5">Products</h4>
            <ul className="space-y-2.5">
              {productLinks.map((l) => (
                <li key={l}>
                  <Link to="/products" className="text-white/65 hover:text-white text-sm transition-colors flex items-center gap-1.5 group">
                    <ArrowRight size={9} className="text-[#F47920] opacity-0 group-hover:opacity-100 transition-opacity" />
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Industries */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#F47920] mb-5">Industries</h4>
            <ul className="space-y-2.5">
              {industryLinks.map((l) => (
                <li key={l}>
                  <Link to="/industries" className="text-white/65 hover:text-white text-sm transition-colors flex items-center gap-1.5 group">
                    <ArrowRight size={9} className="text-[#F47920] opacity-0 group-hover:opacity-100 transition-opacity" />
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Company */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#F47920] mb-5">Company</h4>
            <ul className="space-y-2.5 mb-5">
              {companyLinks.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-white/65 hover:text-white text-sm transition-colors flex items-center gap-1.5 group">
                    <ArrowRight size={9} className="text-[#F47920] opacity-0 group-hover:opacity-100 transition-opacity" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            {/* Team avatars */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex -space-x-2">
                {['A','B','C'].map((l, i) => (
                  <div key={i} className="w-7 h-7 rounded-full bg-[#F47920] border-2 border-[#1B3F6A] flex items-center justify-center text-white text-[10px] font-bold">{l}</div>
                ))}
              </div>
              <a href="tel:8001234567" className="text-xs text-white/60 hover:text-white transition-colors">(800) 123-4567</a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 2: Articles ──────────────────────────────────── */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <h4 className="text-xs font-bold uppercase tracking-widest text-[#F47920] mb-4">Articles</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-2">
            {articles.map((a) => (
              <a
                key={a}
                href="#"
                className="text-xs text-white/55 hover:text-white transition-colors leading-relaxed"
              >
                {a}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom bar ──────────────────────────────────────── */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-4 mb-5">
            {[
              { name: 'Facebook Reviews', stars: '4.9/5', color: 'bg-blue-600' },
              { name: '99designs',        stars: '5.0/5', color: 'bg-green-600' },
              { name: 'Trustpilot',       stars: '4.8/5', color: 'bg-[#00b67a]' },
            ].map((b) => (
              <div key={b.name} className="flex items-center gap-2 bg-white/8 rounded-lg px-4 py-2">
                <div className={`w-4 h-4 ${b.color} rounded-sm flex-shrink-0`} />
                <div>
                  <div className="text-[11px] font-bold text-white">{b.name}</div>
                  <div className="text-[10px] text-yellow-400">★★★★★ {b.stars}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Brand logos strip */}
          <div className="flex flex-wrap justify-center gap-5 mb-5 opacity-30">
            {['T-Mobile','Adidas','Pandora','Marriott','MetLife','Old Spice','Nike','Samsung'].map((b) => (
              <span key={b} className="text-white font-bold text-xs tracking-wider">{b}</span>
            ))}
          </div>

          {/* Copyright + links + payments */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-white/35 text-xs">© {new Date().getFullYear()} RefinePackaging. All rights reserved.</p>
            <div className="flex gap-4">
              {['Sitemap','Privacy Policy','Terms of Service','Accessibility'].map((l) => (
                <a key={l} href="#" className="text-white/35 hover:text-white text-xs transition-colors">{l}</a>
              ))}
            </div>
            <div className="flex gap-1.5">
              {['VISA','MC','AMEX','PayPal','Apple Pay'].map((p) => (
                <div key={p} className="bg-white/15 text-white text-[9px] font-bold px-2 py-1 rounded">{p}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

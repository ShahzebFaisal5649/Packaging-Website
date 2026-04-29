import { Link } from 'react-router-dom';
import { Phone, ArrowRight, MapPin, Mail } from 'lucide-react';

// Inline SVG social icons — no lucide-react dependency issues
const FacebookIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>;
const InstagramIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>;
const LinkedInIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>;
const TwitterIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>;
const YoutubeIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>;

const ACCENT = '#C8860A';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full overflow-x-hidden" style={{ backgroundColor: '#0F2E1A', color: '#fff' }}>

      {/* Newsletter strip */}
      <div className="border-b border-white/10">
        <div className="mx-auto flex w-full max-w-[1400px] flex-col items-center px-4 py-14 text-center">
          <h3 className="text-2xl font-bold tracking-tight text-white mb-2">Stay in the Loop</h3>
          <p className="max-w-[400px] text-sm text-white/70 mb-7">
            Subscribe for packaging insights, trends, and special offers.
          </p>
          <form className="flex w-full max-w-[440px] flex-col gap-3 sm:flex-row" onSubmit={e => e.preventDefault()}>
            <input
              type="email"
              placeholder="Enter your email address"
              required
              className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-white/50"
            />
            <button type="submit" className="rounded-2xl bg-[#C8860A] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#b37308]">
              Subscribe <ArrowRight size={14} />
            </button>
          </form>
        </div>
      </div>

      {/* Main grid */}
      <div className="mx-auto w-full max-w-[1400px] px-4 py-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 items-start">

          {/* Col 1 — Brand */}
          <div className="flex flex-col items-center text-center sm:items-start sm:text-left gap-6">
            <Link to="/" className="inline-flex items-center gap-3 text-white no-underline">
              {/* Logo container — uses accent bg so white-bg PNG is invisible and only the N monogram shows */}
              <div style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                <img
                  src="/logo.png"
                  alt=""
                  onError={e => { e.target.style.display = 'none'; }}
                  style={{ height: 36, width: 36, objectFit: 'contain', display: 'block', mixBlendMode: 'multiply' }}
                />
              </div>
              <span style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: 22, color: '#fff', letterSpacing: '-0.5px' }}>
                NOVA<span style={{ color: ACCENT }}>PACK</span>
              </span>
            </Link>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, maxWidth: 280, marginBottom: 24 }}>
              Premium, industry-grade custom packaging for brands that want to stand out. Fast turnaround, exceptional quality.
            </p>
            <div className="flex flex-wrap justify-center gap-3 sm:justify-start">
              {[
                { Icon: FacebookIcon, href: 'https://facebook.com', label: 'Facebook' },
                { Icon: InstagramIcon, href: 'https://instagram.com', label: 'Instagram' },
                { Icon: LinkedInIcon, href: 'https://linkedin.com', label: 'LinkedIn' },
                { Icon: TwitterIcon, href: 'https://twitter.com', label: 'Twitter' },
                { Icon: YoutubeIcon, href: 'https://youtube.com', label: 'YouTube' },
              ].map(({ Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}
                  style={{ width: 34, height: 34, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.7)', transition: 'all 0.2s', textDecoration: 'none' }}
                  onMouseEnter={e => { e.currentTarget.style.background = ACCENT; e.currentTarget.style.borderColor = ACCENT; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 — Products */}
          <div className="flex flex-col items-center text-center sm:items-start sm:text-left gap-4">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.09em] text-[#C8860A]">Products</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {['Mailer Boxes', 'Shipping Boxes', 'Product Boxes', 'Folding Cartons', 'Rigid Boxes', 'Eco-Friendly'].map(link => (
                <li key={link}>
                  <Link to="/products" style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', textDecoration: 'none', transition: 'color 0.15s' }}
                    onMouseEnter={e => e.target.style.color = '#fff'}
                    onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.65)'}
                  >{link}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Industries */}
          <div className="flex flex-col items-center text-center sm:items-start sm:text-left gap-4">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.09em] text-[#C8860A]">Industries</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {['Food & Beverage', 'Cosmetics', 'E-commerce', 'Apparel & Retail', 'Electronics', 'Cannabis & CBD'].map(link => (
                <li key={link}>
                  <Link to="/industries" style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', textDecoration: 'none', transition: 'color 0.15s' }}
                    onMouseEnter={e => e.target.style.color = '#fff'}
                    onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.65)'}
                  >{link}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Company */}
          <div className="flex flex-col items-center text-center sm:items-start sm:text-left gap-4">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.09em] text-[#C8860A]">Company</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { label: 'About Us', to: '/about' },
                { label: 'Our Process', to: '/how-it-works' },
                { label: 'Inspiration', to: '/success-stories' },
                { label: 'Contact', to: '/contact-us' },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', textDecoration: 'none', transition: 'color 0.15s' }}
                    onMouseEnter={e => e.target.style.color = '#fff'}
                    onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.65)'}
                  >{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 5 — Support & Contact */}
          <div className="flex flex-col items-center text-center sm:items-start sm:text-left gap-4">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.09em] text-[#C8860A]">Support & Contact</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <a href="tel:18007259660" style={{ display: 'flex', gap: 12, alignItems: 'flex-start', textDecoration: 'none', color: 'rgba(255,255,255,0.65)', fontSize: 13 }}>
                <Phone size={16} style={{ color: ACCENT, flexShrink: 0, marginTop: 2 }} />
                <div>
                  <div style={{ color: '#fff', fontWeight: 600, marginBottom: 2, fontSize: 13 }}>Call Us Toll-Free</div>
                  <div>1-800-725-9660</div>
                  <div style={{ fontSize: 11, marginTop: 2 }}>Mon–Fri 9am–6pm EST</div>
                </div>
              </a>
              <a href="mailto:support@novapack.com" style={{ display: 'flex', gap: 12, alignItems: 'flex-start', textDecoration: 'none', color: 'rgba(255,255,255,0.65)', fontSize: 13 }}>
                <Mail size={16} style={{ color: ACCENT, flexShrink: 0, marginTop: 2 }} />
                <div>
                  <div style={{ color: '#fff', fontWeight: 600, marginBottom: 2, fontSize: 13 }}>Email Support</div>
                  <div>support@novapack.com</div>
                  <div style={{ fontSize: 11, marginTop: 2 }}>Reply within 2 hours</div>
                </div>
              </a>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', color: 'rgba(255,255,255,0.65)', fontSize: 13 }}>
                <MapPin size={16} style={{ color: ACCENT, flexShrink: 0, marginTop: 2 }} />
                <div>
                  <div style={{ color: '#fff', fontWeight: 600, marginBottom: 2, fontSize: 13 }}>Headquarters</div>
                  <div>123 Packaging Blvd, Suite 400</div>
                  <div>Chicago, IL 60601</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 py-6">
        <div className="mx-auto flex w-full max-w-[1400px] flex-col items-center justify-between gap-3 px-4 text-center text-sm text-white/70 sm:flex-row sm:text-left">
          <p className="m-0">© {year} NovaPack Industries. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm sm:justify-start">
            {['Privacy Policy', 'Terms of Service', 'Refund Policy'].map(t => (
              <Link key={t} to="/" className="text-white/70 transition hover:text-white">
                {t}
              </Link>
            ))}
          </div>
        </div>
      </div>

    </footer>
  );
}

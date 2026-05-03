import { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, MessageCircle, ChevronDown, Check } from 'lucide-react';
import api from '../services/api';

const FacebookIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>;
const InstagramIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>;

const G = '#1A4D2E';
const ACCENT = '#C8860A';
const BG = '#F5F2ED';

const FAQS = [
  { q: 'What is your minimum order quantity?', a: 'Our minimum order quantity is as low as 50 units, making us perfect for startups and small businesses as well as large enterprises.' },
  { q: 'How long does production take?', a: 'Standard production takes 5–7 business days after proof approval. We also offer a 3-day rush option for urgent orders at an additional fee.' },
  { q: 'Do you offer free proofs?', a: 'Yes! We provide a free digital proof within 24 hours of placing your order. You can request unlimited revisions until you\'re completely satisfied.' },
  { q: 'What file formats do you accept?', a: 'We accept PDF, AI, EPS, PNG (300dpi+), and PSD files. Our design team is available to help format or create your artwork at no extra charge.' },
  { q: 'Is free shipping available?', a: 'Yes, we offer free standard shipping on all orders. Expedited and international shipping options are available at additional cost.' },
  { q: 'Can I order a sample first?', a: 'Absolutely! Request a free sample kit from our website to feel the materials and print quality before placing your full order.' },
];

function ContactForm() {
  const [form, setForm] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('designcustombox_contact_draft')) || { name: '', email: '', phone: '', company: '', subject: '', message: '', interests: [] };
    } catch {
      return { name: '', email: '', phone: '', company: '', subject: '', message: '', interests: [] };
    }
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const interests = ['Custom Boxes', 'Bulk Orders', 'Design Services', 'Sample Kit', 'Other'];

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Valid email is required';
    if (!form.subject) e.subject = 'Please select a subject';
    if (!form.message.trim() || form.message.trim().length < 10) e.message = 'Message must be at least 10 characters';
    return e;
  };

  useEffect(() => {
    if (!submitted) {
      localStorage.setItem('designcustombox_contact_draft', JSON.stringify(form));
    }
  }, [form, submitted]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      company: form.company.trim(),
      subject: form.subject,
      message: form.message.trim(),
      interests: form.interests,
    };

    try {
      const data = await api.post('/content/contact', payload);
      setSubmitMessage(data.message || 'Message received. We\'ll be in touch soon!');
      localStorage.removeItem('designcustombox_contact_draft');
    } catch (err) {
      setSubmitMessage('Failed to send message. Please try again or email us directly.');
      console.error('Contact submit failed:', err);
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  };

  const toggleInterest = (val) => {
    setForm(f => ({ ...f, interests: f.interests.includes(val) ? f.interests.filter(i => i !== val) : [...f.interests, val] }));
  };

  const field = { backgroundColor: BG, border: '1.5px solid #D0CAC0', borderRadius: 8, padding: '12px 14px', fontSize: 14, color: '#1A1A1A', outline: 'none', width: '100%', fontFamily: 'Inter,sans-serif', transition: 'border-color 0.15s' };
  const errStyle = { fontSize: 11, color: '#DC2626', marginTop: 4 };

  if (submitted) return (
    <div style={{ textAlign: 'center', padding: '60px 32px' }}>
      <div style={{ width: 72, height: 72, borderRadius: '50%', backgroundColor: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
        <Check size={36} color="#059669" strokeWidth={2.5} />
      </div>
      <h3 style={{ fontSize: 22, fontFamily: 'Outfit,sans-serif', fontWeight: 700, color: G, marginBottom: 10 }}>Message Sent!</h3>
      <p style={{ fontSize: 15, color: '#4A4A4A', marginBottom: 14 }}>{submitMessage || 'We will reply within 2 hours during business hours.'}</p>
      <button onClick={() => window.location.reload()} style={{ padding: '12px 24px', backgroundColor: G, border: 'none', borderRadius: 8, color: '#fff', fontWeight: 700, cursor: 'pointer' }}>Send Another Message</button>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="form-row-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <label style={{ fontSize: 11, fontWeight: 700, color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>Full Name *</label>
          <input style={{ ...field, borderColor: errors.name ? '#DC2626' : '#D0CAC0' }} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Jane Smith" onFocus={e => e.target.style.borderColor = ACCENT} onBlur={e => e.target.style.borderColor = errors.name ? '#DC2626' : '#D0CAC0'} />
          {errors.name && <p style={errStyle}>{errors.name}</p>}
        </div>
        <div>
          <label style={{ fontSize: 11, fontWeight: 700, color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>Email Address *</label>
          <input type="email" style={{ ...field, borderColor: errors.email ? '#DC2626' : '#D0CAC0' }} value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="jane@company.com" onFocus={e => e.target.style.borderColor = ACCENT} onBlur={e => e.target.style.borderColor = errors.email ? '#DC2626' : '#D0CAC0'} />
          {errors.email && <p style={errStyle}>{errors.email}</p>}
        </div>
      </div>

      <div className="form-row-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <label style={{ fontSize: 11, fontWeight: 700, color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>Phone (optional)</label>
          <input type="tel" style={field} value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+1 (555) 000-0000" onFocus={e => e.target.style.borderColor = ACCENT} onBlur={e => e.target.style.borderColor = '#D0CAC0'} />
        </div>
        <div>
          <label style={{ fontSize: 11, fontWeight: 700, color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>Company (optional)</label>
          <input style={field} value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} placeholder="Acme Inc." onFocus={e => e.target.style.borderColor = ACCENT} onBlur={e => e.target.style.borderColor = '#D0CAC0'} />
        </div>
      </div>

      <div>
        <label style={{ fontSize: 11, fontWeight: 700, color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>Subject *</label>
        <select style={{ ...field, borderColor: errors.subject ? '#DC2626' : '#D0CAC0', cursor: 'pointer', appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236B6B6B' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }} value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} onFocus={e => e.target.style.borderColor = ACCENT} onBlur={e => e.target.style.borderColor = errors.subject ? '#DC2626' : '#D0CAC0'}>
          <option value="">Select a subject...</option>
          <option>General Inquiry</option>
          <option>Request a Quote</option>
          <option>Technical Support</option>
          <option>Partnership</option>
          <option>Press & Media</option>
          <option>Other</option>
        </select>
        {errors.subject && <p style={errStyle}>{errors.subject}</p>}
      </div>

      <div>
        <label style={{ fontSize: 11, fontWeight: 700, color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>Message *</label>
        <textarea style={{ ...field, borderColor: errors.message ? '#DC2626' : '#D0CAC0', minHeight: 120, resize: 'vertical' }} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Tell us about your packaging needs..." onFocus={e => e.target.style.borderColor = ACCENT} onBlur={e => e.target.style.borderColor = errors.message ? '#DC2626' : '#D0CAC0'} />
        {errors.message && <p style={errStyle}>{errors.message}</p>}
      </div>

      <div>
        <label style={{ fontSize: 11, fontWeight: 700, color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 10 }}>I'm interested in:</label>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {interests.map(val => (
            <button key={val} type="button" onClick={() => toggleInterest(val)} style={{ padding: '7px 16px', borderRadius: 100, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: `1.5px solid ${form.interests.includes(val) ? ACCENT : '#D0CAC0'}`, backgroundColor: form.interests.includes(val) ? `${ACCENT}18` : 'transparent', color: form.interests.includes(val) ? ACCENT : '#6B6B6B', transition: 'all 0.15s' }}>
              {val}
            </button>
          ))}
        </div>
      </div>

      <button type="submit" disabled={loading} style={{ padding: '16px', backgroundColor: ACCENT, color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.8 : 1, transition: 'all 0.15s', fontFamily: 'Outfit,sans-serif' }}
        onMouseEnter={e => { if (!loading) e.target.style.filter = 'brightness(1.08)'; }} onMouseLeave={e => e.target.style.filter = 'none'}>
        {loading ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}

function FAQItem({ faq, open, toggle }) {
  return (
    <div style={{ backgroundColor: '#fff', borderRadius: 10, border: '1px solid #E2DDD6', overflow: 'hidden', marginBottom: 10 }}>
      <button onClick={toggle} style={{ width: '100%', padding: '18px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: open ? ACCENT : '#1A1A1A', flex: 1, paddingRight: 16, fontFamily: 'Outfit,sans-serif' }}>{faq.q}</span>
        <ChevronDown size={18} style={{ color: ACCENT, flexShrink: 0, transition: 'transform 0.25s', transform: open ? 'rotate(180deg)' : 'none' }} />
      </button>
      <div style={{ maxHeight: open ? 200 : 0, overflow: 'hidden', transition: 'max-height 0.3s ease' }}>
        <p style={{ padding: '0 20px 18px', fontSize: 14, color: '#4A4A4A', lineHeight: 1.7 }}>{faq.a}</p>
      </div>
    </div>
  );
}

export default function Contact() {
  const [openFaq, setOpenFaq] = useState(null);

  const infoCards = [
    { icon: Phone, label: 'Call Us', value: '(913) 228-2682', sub: 'Mon–Fri 9am–6pm EST', href: 'tel:9132282682' },
    { icon: Mail, label: 'Email', value: 'support@designcustombox.com', sub: 'Response within 2 hours', href: 'mailto:support@designcustombox.com' },
    { icon: MapPin, label: 'Headquarters', value: '5532 Big River Dr', sub: 'The Colony Texas US 75056', href: null },
    { icon: MessageCircle, label: 'Live Support', value: 'Chat with Us', sub: 'Instant responses', href: '#' },
  ];

  const socials = [
    { Icon: FacebookIcon, href: 'https://facebook.com', label: 'Facebook' },
    { Icon: InstagramIcon, href: 'https://instagram.com', label: 'Instagram' },
  ];

  return (
    <div style={{ backgroundColor: BG, minHeight: '100vh' }}>

      {/* Section 1 — Hero */}
      <section style={{ minHeight: 320, backgroundColor: G, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=1600&auto=format&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.7)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(20,77,46,0.3), rgba(20,77,46,0.6))' }} />
        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '0 24px', width: '100%', maxWidth: 880 }} className="mobile-center-text">
          <p style={{ fontSize: 11, fontWeight: 700, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 14, textAlign: 'center' }} className="mobile-center-header">We would love to hear from you</p>
          <h1 style={{ fontSize: 'clamp(32px,5vw,52px)', fontFamily: 'Outfit,sans-serif', fontWeight: 800, color: '#fff', marginBottom: 16, lineHeight: 1.03, textAlign: 'center', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }} className="mobile-center-header">Get In Touch</h1>
          <p style={{ fontSize: 18, color: ACCENT, fontWeight: 700, maxWidth: 640, margin: '0 auto', textAlign: 'center' }} className="mobile-center-text">Our team gets back to you within 2 hours.</p>
        </div>
      </section>

      {/* Section 2 — Split Layout */}
      <section style={{ padding: '72px 24px', backgroundColor: BG }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="contact-split" style={{ display: 'grid', gridTemplateColumns: '55% 1fr', gap: 48, alignItems: 'start' }}>

            {/* Left — Form */}
            <div style={{ backgroundColor: '#fff', borderRadius: 16, padding: '40px', boxShadow: '0 4px 24px rgba(0,0,0,0.07)', border: '1px solid #E2DDD6' }}>
              <h2 style={{ fontSize: 24, fontFamily: 'Outfit,sans-serif', fontWeight: 800, color: G, marginBottom: 8 }}>Send a Message</h2>
              <p style={{ fontSize: 13, color: '#6B6B6B', marginBottom: 28 }}>Fill in the form below and we'll get back to you as soon as possible.</p>
              <ContactForm />
            </div>

            {/* Right — Info Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {infoCards.map(({ icon: Icon, label, value, sub, href }, i) => (
                <div key={i} style={{ backgroundColor: '#fff', borderRadius: 12, padding: '20px 20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #E2DDD6', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: `${ACCENT}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={20} style={{ color: ACCENT }} />
                  </div>
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 700, color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{label}</p>
                    {href ? (
                      <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" style={{ fontSize: 14, fontWeight: 700, color: G, textDecoration: 'none', display: 'block', marginBottom: 2 }}
                        onMouseEnter={e => e.target.style.color = ACCENT} onMouseLeave={e => e.target.style.color = G}>
                        {value}
                      </a>
                    ) : (
                      <p style={{ fontSize: 14, fontWeight: 700, color: G, marginBottom: 2 }}>{value}</p>
                    )}
                    <p style={{ fontSize: 12, color: '#6B6B6B' }}>{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 — Live Map */}
      <section style={{ padding: '0 24px 72px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid #D0CAC0', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', position: 'relative' }}>
            <iframe
              title="Design Custom Box HQ Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3327.0127111669494!2d-96.87956228479018!3d33.08883548079662!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x864c2b5d2b50f643%3A0xcb5a75ec7f90508e!2s5532%20Big%20River%20Dr%2C%20The%20Colony%2C%20TX%2075056!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
              width="100%"
              height="360"
              style={{ display: 'block', border: 0 }}
              loading="lazy"
              allowFullScreen
            />
            {/* Overlay card */}
            <div style={{ position: 'absolute', bottom: 16, left: 16, backgroundColor: '#fff', borderRadius: 10, padding: '12px 18px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', gap: 12, maxWidth: 300 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: `${G}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <MapPin size={18} style={{ color: G }} />
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: G, marginBottom: 2 }}>Design Custom Box HQ</p>
                <p style={{ fontSize: 11, color: '#6B6B6B', lineHeight: 1.4 }}>5532 Big River Dr<br />The Colony Texas US 75056</p>
              </div>
            </div>
            <a
              href="https://www.openstreetmap.org/?mlat=33.0888&mlon=-96.8778#map=14/33.0888/-96.8778"
              target="_blank"
              rel="noreferrer"
              style={{ position: 'absolute', bottom: 16, right: 16, backgroundColor: '#fff', padding: '8px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700, color: G, textDecoration: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.12)', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              Open in Maps →
            </a>
          </div>
        </div>
      </section>

      {/* Section 4 — FAQ Strip */}
      <section style={{ padding: '72px 24px', backgroundColor: '#fff' }}>
        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>Quick Answers</p>
            <h2 style={{ fontSize: 'clamp(24px,3vw,36px)', fontFamily: 'Outfit,sans-serif', fontWeight: 800, color: G }}>Common Questions</h2>
          </div>
          {FAQS.map((faq, i) => (
            <FAQItem key={i} faq={faq} open={openFaq === i} toggle={() => setOpenFaq(openFaq === i ? null : i)} />
          ))}
        </div>
      </section>

      {/* Section 5 — Office Hours + Social Strip */}
      <section style={{ backgroundColor: G, padding: '24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <span><strong style={{ color: '#fff' }}>Office Hours:</strong> Mon–Fri 9am–6pm EST</span>
            <span><strong style={{ color: '#fff' }}>Saturday:</strong> 10am–2pm EST</span>
            <span style={{ color: 'rgba(255,255,255,0.5)' }}>Closed Sundays</span>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {socials.map(({ Icon, href, label }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}
                style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.7)', transition: 'all 0.2s', textDecoration: 'none' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = ACCENT; e.currentTarget.style.borderColor = ACCENT; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}>
                <Icon size={14} />
              </a>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .contact-split { grid-template-columns: 1fr !important; }
          .form-row-2 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

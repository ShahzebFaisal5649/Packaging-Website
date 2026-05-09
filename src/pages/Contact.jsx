import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle, Plus } from 'lucide-react';
import api from '../services/api';
import Button from '../components/Button';

const G = '#1A4D2E';
const ACCENT = '#C8860A';
const BG = '#F5F2ED';

const FAQS = [
  { q: 'What is the minimum order quantity (MOQ)?', a: 'Our minimums vary by box style but typically start as low as 10-25 units for digital printing, making it easy for small businesses to test new designs. For bulk offset printing, MOQs usually start at 100-250 units.' },
  { q: 'Can I get a physical sample before bulk ordering?', a: 'Yes! We offer physical prototyping services for a nominal fee. You can receive a full-color printed sample of your exact box design to verify dimensions and print quality before committing to full production.' },
  { q: 'What is your standard turnaround time?', a: 'Our standard production time is 8-10 business days after digital proof approval. We also offer priority rush options (5-7 days) for urgent brand launches.' },
  { q: 'Do you ship internationally?', a: 'We ship globally to over 50 countries. All international shipments are fully tracked. Delivery times and costs vary by region and will be provided during the quoting process.' },
  { q: 'Are your materials eco-friendly?', a: 'Sustainability is at our core. We offer FSC-certified corrugated board, 100% recycled kraft paper, and use soy-based or water-based inks that are fully biodegradable.' },
];

const inputStyle = {
  width: '100%', padding: '12px 16px', fontSize: 15,
  fontFamily: '"DM Sans", sans-serif', color: '#1A1A1A',
  border: '1.5px solid #E0DBD3', borderRadius: 10, outline: 'none',
  backgroundColor: '#fff', transition: 'border-color 0.2s', boxSizing: 'border-box',
};

const Field = ({ name, label, type = 'text', required, isTextarea, value, onChange, error }) => (
  <div style={{ flex: 1 }}>
    <label style={{ display: 'block', fontSize: 13, fontFamily: '"DM Sans", sans-serif', fontWeight: 600, color: '#333', marginBottom: 7 }}>
      {label} {required && <span style={{ color: ACCENT }}>*</span>}
    </label>
    {isTextarea ? (
      <textarea
        name={name} required={required} value={value} onChange={onChange}
        style={{ ...inputStyle, height: 130, resize: 'none', borderColor: error ? '#DC2626' : '#E0DBD3' }}
        onFocus={e => e.target.style.borderColor = error ? '#DC2626' : G}
        onBlur={e => e.target.style.borderColor = error ? '#DC2626' : '#E0DBD3'}
      />
    ) : (
      <input
        type={type} name={name} required={required} value={value} onChange={onChange}
        style={{ ...inputStyle, borderColor: error ? '#DC2626' : '#E0DBD3' }}
        onFocus={e => e.target.style.borderColor = error ? '#DC2626' : G}
        onBlur={e => e.target.style.borderColor = error ? '#DC2626' : '#E0DBD3'}
      />
    )}
    {error && <p style={{ color: '#DC2626', fontSize: 11, marginTop: 4, marginBottom: 0 }}>{error}</p>}
  </div>
);

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', company: '', phone: '', subject: '', message: '' });
  const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'
  const [errorMsg, setErrorMsg] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [activeFaq, setActiveFaq] = useState(null);

  const handleChange = (e) => {
    if (e.target.name === 'phone') setPhoneError('');
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validatePhone = (v) => /^\+?[\d\s\-().]{7,15}$/.test(v);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.phone && !validatePhone(formData.phone)) {
      setPhoneError('Please enter a valid phone number');
      return;
    }

    setStatus('loading');
    try {
      const res = await api.post('/content/contact', formData);
      setStatus('success');
      setFormData({ name: '', email: '', company: '', phone: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div style={{ backgroundColor: BG, minHeight: '100vh', overflowX: 'hidden' }}>

      {/* Hero & Form */}
      <section style={{ position: 'relative', padding: '160px 24px 120px', backgroundColor: BG }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 60, alignItems: 'start' }} className="contact-grid">

            {/* Left Content */}
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 100, border: '1px solid rgba(26,77,46,0.1)', backgroundColor: '#fff', marginBottom: 24 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: ACCENT }} />
                <p style={{ fontSize: 11, fontFamily: '"DM Mono", monospace', fontWeight: 600, color: G, textTransform: 'uppercase', letterSpacing: '0.15em', margin: 0 }}>We're Online</p>
              </div>
              <h1 style={{ fontSize: 'clamp(42px, 5vw, 64px)', fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 800, color: G, marginBottom: 24, lineHeight: 1.05 }}>
                Let's create something extraordinary.
              </h1>
              <p style={{ fontSize: 18, fontFamily: '"DM Sans", sans-serif', color: '#6B6B6B', lineHeight: 1.7, marginBottom: 48, maxWidth: 480 }}>
                Whether you need a custom quote, packaging advice, or a sample kit, our experts are ready to assist you.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {[
                  { icon: <Mail size={20} color={ACCENT} />, title: 'Email Us', info: 'Designcustombox@gmail.com', sub: 'Reply within 2 hours', href: 'mailto:Designcustombox@gmail.com' },
                  { icon: <Phone size={20} color={ACCENT} />, title: 'Call Us', info: '(913) 228-2682', sub: 'Mon–Fri, 9am–6pm EST', href: 'tel:+19132282682' },
                  { icon: <MapPin size={20} color={ACCENT} />, title: 'Visit Us', info: '5532 Big River Dr', sub: 'The Colony Texas US 75056', href: 'https://maps.google.com/?q=5532+Big+River+Dr,+The+Colony,+Texas,+US+75056', target: '_blank' },
                  {
                    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill={ACCENT}><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.18-2.587-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.633.034-1.089-.044-1.857-.306-3.428-1.299-4.609-2.653-.344-.394-.574-.719-.788-1.21-.188-.413-.235-.803-.135-1.141.1-.331.375-.554.539-.746.157-.185.21-.243.313-.346.103-.103.19-.124.27-.124.079 0 .158.004.23.009.077.005.155-.015.25.223l.509 1.234c.069.166.116.326.01.534-.106.209-.162.339-.321.512-.159.174-.334.309-.476.471-.147.168-.166.312-.039.526.127.214.563.923 1.211 1.496.838.741 1.546.971 1.76 1.062.213.09.463.116.634.025.171-.09.398-.245.565-.479.17-.234.225-.393.336-.526.113-.133.225-.112.338-.07l.835.397c.123.062.205.093.236.144.031.052.031.298-.113.703zM12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22c-5.523 0-10-4.477-10-10S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>,
                    title: 'WhatsApp Us', info: '(913) 228-2682', sub: 'Instant messaging support',
                    href: 'https://wa.me/19132282682', target: '_blank'
                  },
                ].map((c, i) => (
                  <a key={i} href={c.href} target={c.target || '_self'} rel={c.target === '_blank' ? 'noopener noreferrer' : ''}
                    style={{ display: 'flex', alignItems: 'flex-start', gap: 16, textDecoration: 'none', color: 'inherit', padding: '12px', borderRadius: 16, transition: 'all 0.2s', border: '1px solid transparent' }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.borderColor = '#E8E4DC'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.transform = 'none'; }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: '#fff', border: '1px solid #E8E4DC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 8px 16px rgba(0,0,0,0.03)' }}>
                      {c.icon}
                    </div>
                    <div>
                      <h4 style={{ fontSize: 16, fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 700, color: G, marginBottom: 4, marginTop: 0 }}>{c.title}</h4>
                      <p style={{ fontSize: 15, fontFamily: '"DM Sans", sans-serif', fontWeight: 600, color: '#1A1A1A', margin: '0 0 2px 0' }}>{c.info}</p>
                      <p style={{ fontSize: 13, fontFamily: '"DM Sans", sans-serif', color: '#888', margin: 0 }}>{c.sub}</p>
                    </div>
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Right Form */}
            <motion.div
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
              style={{ backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(20px)', borderRadius: 24, padding: '48px', border: '1px solid rgba(255,255,255,0.5)', boxShadow: '0 32px 64px rgba(26,77,46,0.08)' }}
            >
              <h3 style={{ fontSize: 24, fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 700, color: G, marginBottom: 32, marginTop: 0 }}>Send a Message</h3>

              <form onSubmit={handleSubmit}>
                <div style={{ display: 'flex', gap: 20, marginBottom: 20 }} className="form-row">
                  <Field name="name" label="Full Name" required value={formData.name} onChange={handleChange} />
                  <Field name="company" label="Company Name" value={formData.company} onChange={handleChange} />
                </div>
                <div style={{ display: 'flex', gap: 20, marginBottom: 20 }} className="form-row">
                  <Field name="email" type="email" label="Email Address" required value={formData.email} onChange={handleChange} />
                  <Field name="phone" type="tel" label="Phone Number" value={formData.phone} onChange={handleChange} error={phoneError} />
                </div>
                <div style={{ marginBottom: 20 }}>
                  <Field name="subject" label="Subject / Project Type" required value={formData.subject} onChange={handleChange} />
                </div>
                <div style={{ marginBottom: 32 }}>
                  <Field name="message" label="Project Details (Dimensions, Materials...)" required isTextarea value={formData.message} onChange={handleChange} />
                </div>

                <Button
                  type="submit"
                  loading={status === 'loading'}
                  variant="primary"
                  style={{ width: '100%', padding: '18px', borderRadius: 12, backgroundColor: status === 'success' ? '#059669' : G }}
                  icon={status === 'success' ? CheckCircle : Send}
                >
                  {status === 'loading' ? 'Sending...' : status === 'success' ? 'Message Sent' : 'Send Message'}
                </Button>

                {status === 'error' && (
                  <p style={{ color: '#DC2626', fontSize: 13, marginTop: 12, textAlign: 'center', fontFamily: '"DM Sans", sans-serif' }}>
                    {errorMsg}
                  </p>
                )}
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section style={{ padding: '0 24px 120px', backgroundColor: BG }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            style={{ borderRadius: 24, overflow: 'hidden', border: '1px solid #D0CAC0', boxShadow: '0 24px 48px rgba(0,0,0,0.06)', position: 'relative' }}
          >
            <iframe
              title="Design Custom Box HQ Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3327.0127111669494!2d-96.87956228479018!3d33.08883548079662!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x864c2b5d2b50f643%3A0xcb5a75ec7f90508e!2s5532%20Big%20River%20Dr%2C%20The%20Colony%2C%20TX%2075056!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
              width="100%" height="400" style={{ display: 'block', border: 0 }} loading="lazy" allowFullScreen
            />
            <div style={{ position: 'absolute', bottom: 24, left: 24, backgroundColor: '#fff', borderRadius: 16, padding: '16px 24px', boxShadow: '0 12px 32px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', gap: 16, maxWidth: 320, border: '1px solid #E8E4DC' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: `${G}10`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <MapPin size={20} style={{ color: G }} />
              </div>
              <div>
                <p style={{ fontSize: 14, fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 800, color: G, marginBottom: 4, marginTop: 0 }}>Design Custom Box HQ</p>
                <p style={{ fontSize: 13, fontFamily: '"DM Sans", sans-serif', color: '#6B6B6B', lineHeight: 1.5, margin: 0 }}>5532 Big River Dr<br />The Colony, Texas, US 75056</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '0 24px 120px', backgroundColor: '#fff' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p style={{ fontSize: 12, fontFamily: '"DM Mono", monospace', fontWeight: 500, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 16 }}>FAQ</p>
            <h2 style={{ fontSize: 'clamp(32px,4vw,48px)', fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 700, color: G }}>Frequently Asked Questions</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {FAQS.map((faq, i) => {
              const isOpen = activeFaq === i;
              return (
                <div key={i} style={{ borderBottom: '1px solid #E8E4DC' }}>
                  <button onClick={() => setActiveFaq(isOpen ? null : i)}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                    <span style={{ fontSize: 18, fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 700, color: isOpen ? ACCENT : G, transition: 'color 0.3s' }}>{faq.q}</span>
                    <motion.div animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.3 }}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: '50%', backgroundColor: isOpen ? `${ACCENT}15` : '#F5F2ED', color: isOpen ? ACCENT : G, flexShrink: 0 }}>
                      <Plus size={18} />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
                        <p style={{ paddingBottom: 24, fontSize: 15, fontFamily: '"DM Sans", sans-serif', color: '#6B6B6B', lineHeight: 1.7, paddingRight: 40, margin: 0 }}>{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .contact-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .form-row { flex-direction: column !important; gap: 20px !important; }
        }
        @media (max-width: 480px) {
          .contact-grid { padding: 0 !important; }
        }
      `}</style>
    </div>
  );
}

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle, Plus } from 'lucide-react';
import api from '../services/api';

const G = '#1A4D2E';
const ACCENT = '#C8860A';
const BG = '#F5F2ED';

const FAQS = [
  { q: 'What is the minimum order quantity (MOQ)?', a: 'Our standard MOQ is 100 units for most custom boxes. However, for fully rigid luxury boxes, the MOQ starts at 250 units to ensure manufacturing efficiency.' },
  { q: 'Can I get a physical sample before bulk ordering?', a: 'Yes! We offer a physical prototyping service. You can request a full-color printed sample of your exact box design for a flat fee, which is credited towards your bulk order if you proceed.' },
  { q: 'What is your standard turnaround time?', a: 'Our standard production time is 8-10 business days after digital proof approval. We also offer rush production (5-7 days) for an additional fee depending on the complexity of the box.' },
  { q: 'Do you ship internationally?', a: 'Absolutely. We ship to over 50 countries globally. Shipping rates and delivery times vary by destination and order volume, which will be calculated at checkout.' },
  { q: 'Are your materials eco-friendly?', a: 'Yes. We offer FSC-certified corrugated board, recycled kraft, and soy-based inks. Our eco-friendly options are 100% recyclable and biodegradable.' },
];

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', company: '', phone: '', subject: '', message: '' });
  const [status, setStatus] = useState('idle');
  const [activeFaq, setActiveFaq] = useState(null);
  const [focusedField, setFocusedField] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await api.post('/contact/submit', formData);
      setStatus('success');
      setFormData({ name: '', email: '', company: '', phone: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  const FloatingInput = ({ name, type = 'text', label, required = false, isTextarea = false }) => {
    const isFocused = focusedField === name;
    const hasValue = formData[name].length > 0;
    const isActive = isFocused || hasValue;

    return (
      <div style={{ position: 'relative', marginBottom: isTextarea ? 0 : 24, flex: 1 }}>
        <label 
          style={{ 
            position: 'absolute', left: 0, top: isActive ? -20 : (isTextarea ? 16 : 12),
            fontSize: isActive ? 11 : 15, fontFamily: isActive ? '"DM Mono", monospace' : '"DM Sans", sans-serif',
            color: isFocused ? ACCENT : '#9A9080', textTransform: isActive ? 'uppercase' : 'none', letterSpacing: isActive ? '0.1em' : 'normal',
            transition: 'all 0.2s ease', pointerEvents: 'none'
          }}
        >
          {label} {required && <span style={{ color: ACCENT }}>*</span>}
        </label>
        
        {isTextarea ? (
          <textarea
            required={required} value={formData[name]}
            onChange={e => setFormData({ ...formData, [name]: e.target.value })}
            onFocus={() => setFocusedField(name)} onBlur={() => setFocusedField(null)}
            style={{ width: '100%', height: 120, padding: '16px 0', fontSize: 16, fontFamily: '"DM Sans", sans-serif', color: '#1A1A1A', border: 'none', borderBottom: `2px solid ${isFocused ? ACCENT : '#E2DDD6'}`, outline: 'none', backgroundColor: 'transparent', transition: 'border-color 0.2s', resize: 'none' }}
          />
        ) : (
          <input
            type={type} required={required} value={formData[name]}
            onChange={e => setFormData({ ...formData, [name]: e.target.value })}
            onFocus={() => setFocusedField(name)} onBlur={() => setFocusedField(null)}
            style={{ width: '100%', padding: '12px 0', fontSize: 16, fontFamily: '"DM Sans", sans-serif', color: '#1A1A1A', border: 'none', borderBottom: `2px solid ${isFocused ? ACCENT : '#E2DDD6'}`, outline: 'none', backgroundColor: 'transparent', transition: 'border-color 0.2s' }}
          />
        )}
      </div>
    );
  };

  return (
    <div style={{ backgroundColor: BG, minHeight: '100vh', overflowX: 'hidden' }}>

      {/* 1 — Glassmorphic Hero & Form */}
      <section style={{ position: 'relative', padding: '160px 24px 120px', backgroundColor: BG, display: 'flex', alignItems: 'center' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1, width: '100%' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 60, alignItems: 'start' }} className="contact-grid">
            
            {/* Left Content */}
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 100, border: '1px solid rgba(26,77,46,0.1)', backgroundColor: '#fff', marginBottom: 24 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: ACCENT }} />
                <p style={{ fontSize: 11, fontFamily: '"DM Mono", monospace', fontWeight: 600, color: G, textTransform: 'uppercase', letterSpacing: '0.15em' }}>We're Online</p>
              </div>
              <h1 style={{ fontSize: 'clamp(42px, 5vw, 64px)', fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 800, color: G, marginBottom: 24, lineHeight: 1.05 }}>
                Let's create something extraordinary.
              </h1>
              <p style={{ fontSize: 18, fontFamily: '"DM Sans", sans-serif', color: '#6B6B6B', lineHeight: 1.7, marginBottom: 48, maxWidth: 480 }}>
                Whether you need a custom quote, packaging advice, or a sample kit, our experts are ready to assist you.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                {[
                  { icon: <Mail size={20} color={ACCENT} />, title: 'Email Us', info: 'hello@designcustombox.com', sub: 'We reply within 24 hours.' },
                  { icon: <Phone size={20} color={ACCENT} />, title: 'Call Us', info: '+1 (800) 123-4567', sub: 'Mon-Fri, 9am-6pm EST.' },
                  { icon: <MapPin size={20} color={ACCENT} />, title: 'Visit Us', info: '123 Packaging Way', sub: 'Chicago, IL 60601, USA' },
                ].map((c, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: '#fff', border: '1px solid #E8E4DC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 8px 16px rgba(0,0,0,0.03)' }}>
                      {c.icon}
                    </div>
                    <div>
                      <h4 style={{ fontSize: 16, fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 700, color: G, marginBottom: 4 }}>{c.title}</h4>
                      <p style={{ fontSize: 15, fontFamily: '"DM Sans", sans-serif', fontWeight: 600, color: '#1A1A1A', marginBottom: 2 }}>{c.info}</p>
                      <p style={{ fontSize: 13, fontFamily: '"DM Sans", sans-serif', color: '#888' }}>{c.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right Form (Glassmorphic) */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
              style={{ backgroundColor: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)', borderRadius: 24, padding: '48px', border: '1px solid rgba(255,255,255,0.5)', boxShadow: '0 32px 64px rgba(26,77,46,0.08)' }}
            >
              <h3 style={{ fontSize: 24, fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 700, color: G, marginBottom: 40 }}>Send a Message</h3>
              
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'flex', gap: 32, marginBottom: 16 }} className="form-row">
                  <FloatingInput name="name" label="Full Name" required />
                  <FloatingInput name="company" label="Company Name" />
                </div>
                
                <div style={{ display: 'flex', gap: 32, marginBottom: 16 }} className="form-row">
                  <FloatingInput name="email" type="email" label="Email Address" required />
                  <FloatingInput name="phone" type="tel" label="Phone Number" />
                </div>

                <div style={{ marginBottom: 16 }}>
                  <FloatingInput name="subject" label="Subject / Project Type" required />
                </div>

                <div style={{ marginBottom: 40, marginTop: 16 }}>
                  <FloatingInput name="message" label="Project Details (Dimensions, Qty, Materials...)" required isTextarea />
                </div>

                <button
                  type="submit" disabled={status === 'loading' || status === 'success'}
                  style={{ width: '100%', padding: '18px', backgroundColor: status === 'success' ? '#059669' : G, color: '#fff', border: 'none', borderRadius: 12, fontFamily: '"DM Sans", sans-serif', fontWeight: 700, fontSize: 15, cursor: (status === 'loading' || status === 'success') ? 'default' : 'pointer', transition: 'all 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: status === 'success' ? 'none' : '0 12px 24px rgba(26,77,46,0.2)' }}
                >
                  {status === 'loading' ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} />
                  ) : status === 'success' ? (
                    <>Message Sent Successfully <CheckCircle size={18} /></>
                  ) : (
                    <>Send Message <Send size={16} /></>
                  )}
                </button>
                {status === 'error' && <p style={{ color: '#DC2626', fontSize: 13, marginTop: 12, textAlign: 'center', fontFamily: '"DM Sans", sans-serif' }}>Something went wrong. Please try again or email us directly.</p>}
              </form>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 1.5 — Live Map Section */}
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
            {/* Overlay card */}
            <div style={{ position: 'absolute', bottom: 24, left: 24, backgroundColor: '#fff', borderRadius: 16, padding: '16px 24px', boxShadow: '0 12px 32px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', gap: 16, maxWidth: 320, border: '1px solid #E8E4DC' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: `${G}10`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <MapPin size={20} style={{ color: G }} />
              </div>
              <div>
                <p style={{ fontSize: 14, fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 800, color: G, marginBottom: 4 }}>Design Custom Box HQ</p>
                <p style={{ fontSize: 13, fontFamily: '"DM Sans", sans-serif', color: '#6B6B6B', lineHeight: 1.5 }}>5532 Big River Dr<br />The Colony, Texas, US 75056</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2 — Animated FAQ Accordions */}
      <section style={{ padding: '120px 24px', backgroundColor: '#fff' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p style={{ fontSize: 12, fontFamily: '"DM Mono", monospace', fontWeight: 500, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 16 }}>FAQ</p>
            <h2 style={{ fontSize: 'clamp(32px,4vw,48px)', fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 700, color: G }}>Frequently Asked Questions</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {FAQS.map((faq, i) => {
              const isOpen = activeFaq === i;
              return (
                <div key={i} style={{ borderBottom: '1px solid #E8E4DC', overflow: 'hidden' }}>
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : i)}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                  >
                    <span style={{ fontSize: 18, fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 700, color: isOpen ? ACCENT : G, transition: 'color 0.3s' }}>
                      {faq.q}
                    </span>
                    <motion.div animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.3, ease: 'easeInOut' }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: '50%', backgroundColor: isOpen ? `${ACCENT}15` : '#F5F2ED', color: isOpen ? ACCENT : G }}>
                      <Plus size={18} />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: 'easeInOut' }}
                      >
                        <p style={{ paddingBottom: 24, fontSize: 15, fontFamily: '"DM Sans", sans-serif', color: '#6B6B6B', lineHeight: 1.7, paddingRight: 40 }}>
                          {faq.a}
                        </p>
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
          .contact-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
          .form-row { flex-direction: column !important; gap: 0 !important; }
        }
      `}</style>
    </div>
  );
}

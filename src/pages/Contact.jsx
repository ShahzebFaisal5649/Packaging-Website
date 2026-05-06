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

const FormInput = ({ name, type = 'text', label, required = false, isTextarea = false, formData, setFormData }) => {
  return (
    <div style={{ marginBottom: isTextarea ? 0 : 24, flex: 1 }}>
      <label style={{ display: 'block', fontSize: 13, fontFamily: '"DM Sans", sans-serif', fontWeight: 600, color: '#333', marginBottom: 7 }}>
        {label} {required && <span style={{ color: ACCENT }}>*</span>}
      </label>
      
      {isTextarea ? (
        <textarea
          required={required} value={formData[name]}
          onChange={e => setFormData({ ...formData, [name]: e.target.value })}
          style={{ width: '100%', height: 120, padding: '12px 16px', fontSize: 15, fontFamily: '"DM Sans", sans-serif', color: '#1A1A1A', border: '1.5px solid #E0DBD3', borderRadius: 10, outline: 'none', backgroundColor: '#fff', transition: 'border-color 0.2s', resize: 'none' }}
          onFocus={e => e.target.style.borderColor = G} onBlur={e => e.target.style.borderColor = '#E0DBD3'}
        />
      ) : (
        <input
          type={type} required={required} value={formData[name]}
          onChange={e => setFormData({ ...formData, [name]: e.target.value })}
          style={{ width: '100%', padding: '12px 16px', fontSize: 15, fontFamily: '"DM Sans", sans-serif', color: '#1A1A1A', border: '1.5px solid #E0DBD3', borderRadius: 10, outline: 'none', backgroundColor: '#fff', transition: 'border-color 0.2s' }}
          onFocus={e => e.target.style.borderColor = G} onBlur={e => e.target.style.borderColor = '#E0DBD3'}
        />
      )}
    </div>
  );
};

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', company: '', phone: '', subject: '', message: '' });
  const [status, setStatus] = useState('idle');
  const [activeFaq, setActiveFaq] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await api.post('/content/contact', formData);
      setStatus('success');
      setFormData({ name: '', email: '', company: '', phone: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
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
                  { icon: <Mail size={20} color={ACCENT} />, title: 'Email Us', info: 'Designcustombox@gmail.com', sub: 'Reply within 2 hours', href: 'mailto:Designcustombox@gmail.com' },
                  { icon: <Phone size={20} color={ACCENT} />, title: 'Call Us', info: '(913) 228-2682', sub: 'Mon-Fri, 9am-6pm EST', href: 'tel:+19132282682' },
                  { icon: <MapPin size={20} color={ACCENT} />, title: 'Visit Us', info: '5532 Big River Dr', sub: 'The Colony Texas US 75056', href: 'https://maps.google.com/?q=5532+Big+River+Dr,+The+Colony,+Texas,+US+75056', target: '_blank' },
                  { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill={ACCENT}><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.18-2.587-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.633.034-1.089-.044-1.857-.306-3.428-1.299-4.609-2.653-.344-.394-.574-.719-.788-1.21-.188-.413-.235-.803-.135-1.141.1-.331.375-.554.539-.746.157-.185.21-.243.313-.346.103-.103.19-.124.27-.124.079 0 .158.004.23.009.077.005.155-.015.25.223l.509 1.234c.069.166.116.326.01.534-.106.209-.162.339-.321.512-.159.174-.334.309-.476.471-.147.168-.166.312-.039.526.127.214.563.923 1.211 1.496.838.741 1.546.971 1.76.1062.213.09.463.116.634.025.171-.09.398-.245.565-.479.17-.234.225-.393.336-.526.113-.133.225-.112.338-.07.113.041.712.335.835.397.123.062.205.093.236.144.031.052.031.298-.113.703zM12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22c-5.523 0-10-4.477-10-10S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>, title: 'WhatsApp Us', info: '(913) 228-2682', sub: 'Instant messaging support', href: 'https://wa.me/19132282682', target: '_blank' },
                ].map((c, i) => (
                  <a key={i} href={c.href} target={c.target} rel={c.target === '_blank' ? 'noopener noreferrer' : ''} 
                    style={{ display: 'flex', alignItems: 'flex-start', gap: 16, textDecoration: 'none', color: 'inherit', padding: '12px', borderRadius: 16, transition: 'all 0.2s', border: '1px solid transparent' }} 
                    className="contact-link-card"
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.borderColor = '#E8E4DC'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: '#fff', border: '1px solid #E8E4DC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 8px 16px rgba(0,0,0,0.03)' }}>
                      {c.icon}
                    </div>
                    <div>
                      <h4 style={{ fontSize: 16, fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 700, color: G, marginBottom: 4 }}>{c.title}</h4>
                      <p style={{ fontSize: 15, fontFamily: '"DM Sans", sans-serif', fontWeight: 600, color: '#1A1A1A', marginBottom: 2 }}>{c.info}</p>
                      <p style={{ fontSize: 13, fontFamily: '"DM Sans", sans-serif', color: '#888' }}>{c.sub}</p>
                    </div>
                  </a>
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
                  <FormInput name="name" label="Full Name" formData={formData} setFormData={setFormData} required />
                  <FormInput name="company" label="Company Name" formData={formData} setFormData={setFormData} />
                </div>
                
                <div style={{ display: 'flex', gap: 32, marginBottom: 16 }} className="form-row">
                  <FormInput name="email" type="email" label="Email Address" formData={formData} setFormData={setFormData} required />
                  <FormInput name="phone" type="tel" label="Phone Number" formData={formData} setFormData={setFormData} />
                </div>

                <div style={{ display: 'flex', gap: 32, marginBottom: 16 }} className="form-row">
                  <FormInput name="subject" label="Subject / Project Type" formData={formData} setFormData={setFormData} required />
                  <FormInput name="quantity" type="number" label="Approx. Quantity" formData={formData} setFormData={setFormData} required />
                </div>

                <div style={{ marginBottom: 40, marginTop: 16 }}>
                  <FormInput name="message" label="Project Details (Dimensions, Materials...)" formData={formData} setFormData={setFormData} required isTextarea />
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

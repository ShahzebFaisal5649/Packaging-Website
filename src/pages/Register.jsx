import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const G = '#1A4D2E';
const ACCENT = '#C8860A';

const strengthColors = ['#EF4444', '#F59E0B', '#EAB308', '#22C55E'];
const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];

function getStrength(pwd) {
  if (!pwd) return 0;
  let s = 0;
  if (pwd.length > 7) s++;
  if (/[A-Z]/.test(pwd)) s++;
  if (/[0-9]/.test(pwd)) s++;
  if (/[^A-Za-z0-9]/.test(pwd)) s++;
  return s;
}

const FieldInput = ({ icon, type, name, value, onChange, placeholder, onToggle, show }) => (
  <div style={{ position: 'relative' }}>
    <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#aaa' }}>{icon}</span>
    <input
      type={type} name={name} value={value} onChange={onChange} placeholder={placeholder}
      style={{ width: '100%', paddingLeft: 44, paddingRight: onToggle ? 48 : 16, paddingTop: 12, paddingBottom: 12, background: '#fff', border: '1.5px solid #E0DBD3', borderRadius: 10, fontSize: 14, color: '#1A1A1A', outline: 'none', transition: 'border-color 0.15s', boxSizing: 'border-box' }}
      onFocus={e => e.target.style.borderColor = G} onBlur={e => e.target.style.borderColor = '#E0DBD3'}
    />
    {onToggle && (
      <button type="button" onClick={onToggle} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', padding: 0 }}>
        {show ? <EyeOff size={17} /> : <Eye size={17} />}
      </button>
    )}
  </div>
);

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '', terms: false });
  const [showPwd, setShowPwd] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const strength = getStrength(form.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.name.trim().length < 2) return showToast('Name must be at least 2 characters', 'error');
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return showToast('Enter a valid email address', 'error');
    if (form.phone.replace(/\D/g, '').length < 10) return showToast('Enter a valid 10-digit phone number', 'error');
    if (strength < 4) return showToast('Use 8+ chars, 1 uppercase, 1 number, 1 special character', 'error');
    if (form.password !== form.confirmPassword) return showToast('Passwords do not match', 'error');
    if (!form.terms) return showToast('You must agree to the Terms & Privacy Policy', 'error');

    setIsSubmitting(true);
    try {
      await register({ name: form.name, email: form.email, phone: form.phone, password: form.password });
      showToast('Account created! Welcome aboard.', 'success');
      navigate('/profile', { replace: true });
    } catch (err) {
      showToast(err.message || 'Registration failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr', paddingTop: 68 }} className="auth-grid">

      {/* Left — image */}
      <div style={{ position: 'relative', overflow: 'hidden', minHeight: 600 }} className="auth-left">
        <img
          src="https://images.unsplash.com/photo-1553481187-be93c21490a9?w=1000&q=80"
          alt="NovaPack facility"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(20,60,36,0.92) 0%, rgba(20,60,36,0.65) 100%)' }} />
        <div style={{ position: 'relative', zIndex: 2, padding: '60px 56px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 14 }}>Join NovaPack</p>
          <h2 style={{ fontSize: 'clamp(26px,2.8vw,38px)', fontFamily: 'Outfit,sans-serif', fontWeight: 800, color: '#fff', lineHeight: 1.15, marginBottom: 20 }}>
            Everything you need to manage your packaging, in one place.
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.65)', lineHeight: 1.75, marginBottom: 36, maxWidth: 380 }}>
            Create a free account to access your order history, save custom designs, request quotes, and more.
          </p>
          {['Free account setup', 'no credit card required', 'Save unlimited custom box designs', 'Real-time order tracking & history', 'Dedicated account manager on request'].map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <CheckCircle size={16} color={ACCENT} strokeWidth={2.5} />
              <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>{p}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right — form */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 24px', backgroundColor: '#F5F2ED', overflowY: 'auto' }}>
        <div style={{ width: '100%', maxWidth: 440 }}>
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontSize: 28, fontFamily: 'Outfit,sans-serif', fontWeight: 800, color: '#1A1A1A', marginBottom: 8 }}>Create your account</h1>
            <p style={{ fontSize: 14, color: '#777' }}>Join 10,000+ brands on NovaPack. It's free.</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

            {/* Name */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 7 }}>Full Name</label>
              <FieldInput icon={<User size={17} />} type="text" name="name" value={form.name} onChange={handleChange} placeholder="John Doe" />
            </div>

            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 7 }}>Email Address</label>
              <FieldInput icon={<Mail size={17} />} type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@company.com" />
            </div>

            {/* Phone */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 7 }}>Phone Number</label>
              <FieldInput icon={<Phone size={17} />} type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="(555) 123-4567" />
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 7 }}>Password</label>
              <FieldInput icon={<Lock size={17} />} type={showPwd ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} placeholder="••••••••" onToggle={() => setShowPwd(!showPwd)} show={showPwd} />
              {form.password.length > 0 && (
                <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ display: 'flex', flex: 1, gap: 4 }}>
                    {[1, 2, 3, 4].map(n => (
                      <div key={n} style={{ flex: 1, height: 4, borderRadius: 2, background: n <= strength ? strengthColors[strength - 1] : '#E0DBD3', transition: 'background 0.2s' }} />
                    ))}
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: strength > 0 ? strengthColors[strength - 1] : '#aaa', minWidth: 36 }}>{strength > 0 ? strengthLabels[strength - 1] : ''}</span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 7 }}>Confirm Password</label>
              <FieldInput icon={<Lock size={17} />} type={showPwd ? 'text' : 'password'} name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="••••••••" />
            </div>

            {/* Terms */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, paddingTop: 4 }}>
              <input type="checkbox" id="terms" name="terms" checked={form.terms} onChange={handleChange}
                style={{ marginTop: 2, width: 16, height: 16, cursor: 'pointer', accentColor: G }} />
              <label htmlFor="terms" style={{ fontSize: 12, color: '#666', cursor: 'pointer', lineHeight: 1.5 }}>
                I agree to the{' '}
                <a href="#" style={{ color: G, fontWeight: 700, textDecoration: 'none' }}>Terms of Service</a>
                {' '}and{' '}
                <a href="#" style={{ color: G, fontWeight: 700, textDecoration: 'none' }}>Privacy Policy</a>
              </label>
            </div>

            <button type="submit" disabled={isSubmitting}
              style={{ padding: '14px', background: G, color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'background 0.15s', marginTop: 4 }}
              onMouseEnter={e => { if (!isSubmitting) e.currentTarget.style.background = ACCENT; }}
              onMouseLeave={e => e.currentTarget.style.background = G}>
              {isSubmitting ? 'Creating Account...' : <><span>Create Account</span><ArrowRight size={16} /></>}
            </button>
          </form>

          <p style={{ marginTop: 24, textAlign: 'center', fontSize: 13, color: '#888' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ fontWeight: 700, color: G, textDecoration: 'none' }}
              onMouseEnter={e => e.target.style.color = ACCENT} onMouseLeave={e => e.target.style.color = G}>Sign in</Link>
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .auth-grid { grid-template-columns: 1fr !important; }
          .auth-left { display: none !important; }
        }
      `}</style>
    </div>
  );
}

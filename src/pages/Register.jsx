import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import GoogleLoginModal from '../components/GoogleLoginModal';

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
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  const { register, googleLogin } = useAuth();
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

  const handleGoogleSelect = async (account) => {
    setShowGoogleModal(false);
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      await googleLogin(account);
      showToast(`Account created for ${account.name}!`, 'success');
      navigate('/profile');
    } catch {
      showToast('Google registration failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - (var(--nav-h) + var(--ann-h)))', display: 'grid', gridTemplateColumns: '1fr 1fr' }} className="auth-grid">
      <GoogleLoginModal 
        isOpen={showGoogleModal} 
        onClose={() => setShowGoogleModal(false)} 
        onSelect={handleGoogleSelect} 
      />

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
            <button type="button" onClick={() => setShowGoogleModal(true)}
              style={{ width: '100%', padding: '12px', background: '#fff', border: '1.5px solid #E0DBD3', borderRadius: 10, fontSize: 14, fontWeight: 700, color: '#333', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, transition: 'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#fafafa'} onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            <div style={{ position: 'relative', textAlign: 'center', margin: '8px 0' }}>
              <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: '#E0DBD3' }} />
              <span style={{ position: 'relative', background: '#F5F2ED', padding: '0 12px', fontSize: 12, color: '#aaa', fontWeight: 600 }}>OR</span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 7 }}>Full Name</label>
              <FieldInput icon={<User size={17} />} type="text" name="name" value={form.name} onChange={handleChange} placeholder="John Doe" />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 7 }}>Email Address</label>
              <FieldInput icon={<Mail size={17} />} type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@company.com" />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 7 }}>Password</label>
              <FieldInput icon={<Lock size={17} />} type={showPwd ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} placeholder="••••••••" onToggle={() => setShowPwd(!showPwd)} show={showPwd} />
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, paddingTop: 4 }}>
              <input type="checkbox" id="terms" name="terms" checked={form.terms} onChange={handleChange}
                style={{ marginTop: 2, width: 16, height: 16, cursor: 'pointer', accentColor: G }} />
              <label htmlFor="terms" style={{ fontSize: 12, color: '#666', cursor: 'pointer', lineHeight: 1.5 }}>
                I agree to the <Link to="/terms" style={{ color: G, fontWeight: 700, textDecoration: 'none' }}>Terms</Link> & <Link to="/privacy" style={{ color: G, fontWeight: 700, textDecoration: 'none' }}>Privacy</Link>
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

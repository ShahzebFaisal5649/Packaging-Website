import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, CheckCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

const G = '#1A4D2E';
const ACCENT = '#C8860A';

const FieldInput = ({ icon, type, name, value, onChange, placeholder, onToggle, show }) => (
  <div style={{ position: 'relative' }}>
    <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#aaa' }}>{icon}</span>
    <input
      type={type} name={name} value={value} onChange={onChange} placeholder={placeholder}
      style={{ width: '100%', paddingLeft: 44, paddingRight: onToggle ? 48 : 16, paddingTop: 12, paddingBottom: 12, background: '#fff', border: '1.5px solid #E0DBD3', borderRadius: 10, fontSize: 14, fontFamily: '"DM Sans", sans-serif', color: '#1A1A1A', outline: 'none', transition: 'border-color 0.15s', boxSizing: 'border-box' }}
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

  const { register, googleLogin } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.name.trim().length < 2) return showToast('Name must be at least 2 characters', 'error');
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return showToast('Enter a valid email address', 'error');
    if (form.password.length < 6) return showToast('Password must be at least 6 characters', 'error');
    if (form.password !== form.confirmPassword) return showToast('Passwords do not match', 'error');
    if (!form.terms) return showToast('Please agree to the Terms & Privacy', 'error');

    setIsSubmitting(true);
    try {
      await register(form);
      showToast('Account created! Welcome to Design Custom Box.', 'success');
      navigate('/profile');
    } catch (error) {
      showToast(error.message || 'Registration failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsSubmitting(true);
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const googleProfile = {
        id: decoded.sub,
        name: decoded.name,
        email: decoded.email,
        avatar: decoded.picture
      };
      
      await googleLogin(googleProfile);
      showToast(`Welcome, ${decoded.given_name || 'User'}! Account created.`, 'success');
      navigate('/profile');
    } catch (error) {
      console.error('Google register error:', error);
      showToast('Google authentication failed.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - (var(--nav-h) + var(--ann-h)))', display: 'grid', gridTemplateColumns: '1fr 1fr' }} className="auth-grid">

      {/* Left — image */}
      <div style={{ position: 'relative', overflow: 'hidden', minHeight: 600 }} className="auth-left">
        <img
          src="https://images.unsplash.com/photo-1553481187-be93c21490a9?w=1000&q=80"
          alt="Design Custom Box facility"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(20,60,36,0.92) 0%, rgba(20,60,36,0.65) 100%)' }} />
        <div style={{ position: 'relative', zIndex: 2, padding: '60px 56px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <p style={{ fontSize: 11, fontFamily: '"DM Mono", monospace', fontWeight: 500, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 14 }}>Join Design Custom Box</p>
          <h2 style={{ fontSize: 'clamp(26px,2.8vw,38px)', fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 700, color: '#fff', lineHeight: 1.15, marginBottom: 20 }}>
            Everything you need to manage your packaging, in one place.
          </h2>
          <p style={{ fontSize: 15, fontFamily: '"DM Sans", sans-serif', color: 'rgba(255,255,255,0.65)', lineHeight: 1.75, marginBottom: 36, maxWidth: 380 }}>
            Create a free account to access your order history, save custom designs, request quotes, and more.
          </p>
          {['Free account setup', 'no credit card required', 'Save unlimited custom box designs', 'Real-time order tracking & history', 'Dedicated account manager on request'].map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <CheckCircle size={16} color={ACCENT} strokeWidth={2.5} />
              <span style={{ fontSize: 14, fontFamily: '"DM Sans", sans-serif', color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>{p}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right — form */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 24px', backgroundColor: '#F5F2ED', overflowY: 'auto' }}>
        <div style={{ width: '100%', maxWidth: 440 }}>
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontSize: 28, fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 700, color: '#1A1A1A', marginBottom: 8 }}>Create your account</h1>
            <p style={{ fontSize: 14, fontFamily: '"DM Sans", sans-serif', color: '#777' }}>Join 10,000+ brands on Design Custom Box. It's free.</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

            <div style={{ position: 'relative', textAlign: 'center', margin: '8px 0' }}>
              <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: '#E0DBD3' }} />
              <span style={{ position: 'relative', background: '#F5F2ED', padding: '0 12px', fontSize: 12, fontFamily: '"DM Mono", monospace', color: '#aaa', fontWeight: 500 }}>Create Account</span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontFamily: '"DM Sans", sans-serif', fontWeight: 600, color: '#333', marginBottom: 7 }}>Full Name</label>
              <FieldInput icon={<User size={17} />} type="text" name="name" value={form.name} onChange={handleChange} placeholder="John Doe" />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontFamily: '"DM Sans", sans-serif', fontWeight: 600, color: '#333', marginBottom: 7 }}>Email Address</label>
              <FieldInput icon={<Mail size={17} />} type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@company.com" />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontFamily: '"DM Sans", sans-serif', fontWeight: 600, color: '#333', marginBottom: 7 }}>Password</label>
              <FieldInput icon={<Lock size={17} />} type={showPwd ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} placeholder="••••••••" onToggle={() => setShowPwd(!showPwd)} show={showPwd} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontFamily: '"DM Sans", sans-serif', fontWeight: 600, color: '#333', marginBottom: 7 }}>Confirm Password</label>
              <FieldInput icon={<Lock size={17} />} type={showPwd ? 'text' : 'password'} name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="••••••••" />
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, paddingTop: 4 }}>
              <input type="checkbox" id="terms" name="terms" checked={form.terms} onChange={handleChange}
                style={{ marginTop: 2, width: 16, height: 16, cursor: 'pointer', accentColor: G }} />
              <label htmlFor="terms" style={{ fontSize: 12, fontFamily: '"DM Sans", sans-serif', color: '#666', cursor: 'pointer', lineHeight: 1.5 }}>
                I agree to the <Link to="/terms" style={{ color: G, fontWeight: 700, textDecoration: 'none' }}>Terms</Link> & <Link to="/privacy" style={{ color: G, fontWeight: 700, textDecoration: 'none' }}>Privacy</Link>
              </label>
            </div>

            <button type="submit" disabled={isSubmitting}
              style={{ padding: '14px', background: G, color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 15, fontFamily: '"DM Sans", sans-serif', cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'background 0.15s', marginTop: 4 }}
              onMouseEnter={e => { if (!isSubmitting) e.currentTarget.style.background = ACCENT; }}
              onMouseLeave={e => e.currentTarget.style.background = G}>
              {isSubmitting ? 'Creating Account...' : <><span>Create Account</span><ArrowRight size={16} /></>}
            </button>
          </form>

          <div style={{ margin: '24px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1, height: 1, background: '#E0DBD3' }} />
            <span style={{ fontSize: 12, fontFamily: '"DM Sans", sans-serif', color: '#aaa', fontWeight: 500 }}>or sign up with</span>
            <div style={{ flex: 1, height: 1, background: '#E0DBD3' }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => showToast('Google registration failed', 'error')}
              useOneTap
              theme="outline"
              size="large"
              width="100%"
            />
          </div>

          <p style={{ marginTop: 24, textAlign: 'center', fontSize: 13, fontFamily: '"DM Sans", sans-serif', color: '#888' }}>
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

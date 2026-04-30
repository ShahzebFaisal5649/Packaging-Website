import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

const G = '#1A4D2E';
const ACCENT = '#C8860A';

const PERKS = [
  'Track your orders in real-time',
  'Save and revisit custom box designs',
  'Access exclusive pricing for loyal clients',
  'Free digital proof on every order',
];

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, googleLogin } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      showToast('Please enter a valid email address', 'error'); return;
    }
    if (password.length < 6) {
      showToast('Password must be at least 6 characters', 'error'); return;
    }
    setIsSubmitting(true);
    try {
      await login(email, password);
      showToast('Welcome back!', 'success');
      const from = location.state?.from?.pathname || '/profile';
      navigate(from, { replace: true });
    } catch (error) {
      showToast(error.message || 'Invalid email or password', 'error');
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
      showToast(`Welcome back, ${decoded.given_name || 'User'}!`, 'success');
      navigate('/profile');
    } catch (error) {
      console.error('Google login error:', error);
      showToast('Google authentication failed. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - (var(--nav-h) + var(--ann-h)))', display: 'grid', gridTemplateColumns: '1fr 1fr' }} className="auth-grid">

      {/* Left panel — image + branding */}
      <div style={{ position: 'relative', overflow: 'hidden', minHeight: 600 }} className="auth-left">
        <img
          src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1000&q=80"
          alt="Custom packaging"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, rgba(20,60,36,0.92) 0%, rgba(20,60,36,0.70) 100%)` }} />
        <div style={{ position: 'relative', zIndex: 2, padding: '60px 56px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 14 }}>NovaPack Portal</p>
          <h2 style={{ fontSize: 'clamp(28px,3vw,40px)', fontFamily: 'Outfit,sans-serif', fontWeight: 800, color: '#fff', lineHeight: 1.15, marginBottom: 20 }}>
            Your packaging command center in all in one place.
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.65)', lineHeight: 1.75, marginBottom: 40, maxWidth: 380 }}>
            Manage orders, save custom box designs, get quotes, and track shipments with your NovaPack account.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {PERKS.map((p, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <CheckCircle size={16} color={ACCENT} strokeWidth={2.5} />
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>{p}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 24px', backgroundColor: '#F5F2ED' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <div style={{ marginBottom: 36 }}>
            <h1 style={{ fontSize: 30, fontFamily: 'Outfit,sans-serif', fontWeight: 800, color: '#1A1A1A', marginBottom: 8 }}>Welcome back</h1>
            <p style={{ fontSize: 14, color: '#777' }}>Sign in to manage your orders and designs.</p>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 8 }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={17} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@company.com" required
                  style={{ width: '100%', paddingLeft: 44, paddingRight: 16, paddingTop: 12, paddingBottom: 12, background: '#fff', border: '1.5px solid #E0DBD3', borderRadius: 10, fontSize: 14, color: '#1A1A1A', outline: 'none', transition: 'border-color 0.15s', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = G} onBlur={e => e.target.style.borderColor = '#E0DBD3'}
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>Password</label>
                <Link to="/forgot-password" style={{ fontSize: 12, fontWeight: 600, color: G, textDecoration: 'none' }}
                  onMouseEnter={e => e.target.style.color = ACCENT} onMouseLeave={e => e.target.style.color = G}>Forgot?</Link>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={17} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
                <input
                  type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" required
                  style={{ width: '100%', paddingLeft: 44, paddingRight: 48, paddingTop: 12, paddingBottom: 12, background: '#fff', border: '1.5px solid #E0DBD3', borderRadius: 10, fontSize: 14, color: '#1A1A1A', outline: 'none', transition: 'border-color 0.15s', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = G} onBlur={e => e.target.style.borderColor = '#E0DBD3'}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', padding: 0 }}>
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={isSubmitting}
              style={{ padding: '14px', background: G, color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'background 0.15s' }}
              onMouseEnter={e => { if (!isSubmitting) e.currentTarget.style.background = ACCENT; }}
              onMouseLeave={e => e.currentTarget.style.background = G}>
              {isSubmitting ? 'Signing in...' : <><span>Sign In</span> <ArrowRight size={16} /></>}
            </button>
          </form>

          <div style={{ margin: '28px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1, height: 1, background: '#E0DBD3' }} />
            <span style={{ fontSize: 12, color: '#aaa', fontWeight: 500 }}>or continue with</span>
            <div style={{ flex: 1, height: 1, background: '#E0DBD3' }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => showToast('Google login failed', 'error')}
              useOneTap
              theme="outline"
              size="large"
              width="100%"
            />
          </div>

          <p style={{ marginTop: 28, textAlign: 'center', fontSize: 13, color: '#888' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ fontWeight: 700, color: G, textDecoration: 'none' }}
              onMouseEnter={e => e.target.style.color = ACCENT} onMouseLeave={e => e.target.style.color = G}>Create one free</Link>
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

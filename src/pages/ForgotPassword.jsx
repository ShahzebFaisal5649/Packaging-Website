import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, CheckCircle } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import api from '../services/api';

const G = '#1A4D2E';
const ACCENT = '#C8860A';
const BG = '#F5F2ED';

export default function ForgotPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRequestReset = async (e) => {
    e.preventDefault();
    if (!email) { showToast('Please enter your email', 'error'); return; }
    
    setLoading(true);
    try {
      const res = await api.post('/auth/forgot-password', { email });
      setSuccess(true);
      // In a real app, mockToken wouldn't be returned. We use it here for easy local testing.
      if (res.mockToken) {
        showToast('Dev Mode: Check server console for reset link', 'info');
      }
    } catch (err) {
      showToast(err.message || 'Failed to send reset link', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password.length < 6) { showToast('Password must be at least 6 characters', 'error'); return; }
    if (password !== confirmPassword) { showToast('Passwords do not match', 'error'); return; }

    setLoading(true);
    try {
      await api.post('/auth/reset-password', { token, password });
      showToast('Password has been reset successfully', 'success');
      navigate('/login');
    } catch (err) {
      showToast(err.message || 'Invalid or expired token', 'error');
    } finally {
      setLoading(false);
    }
  };

  const inp = { width: '100%', padding: '14px 16px', paddingLeft: 42, border: '1.5px solid #D0CAC0', borderRadius: 10, fontSize: 14, outline: 'none', transition: 'border-color 0.15s' };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: BG, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <div style={{ width: '100%', maxWidth: 440, backgroundColor: '#fff', borderRadius: 16, padding: '40px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', border: '1px solid #E2DDD6' }}>
        
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: `${G}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Lock size={24} color={G} />
          </div>
          <h1 style={{ fontSize: 24, fontFamily: 'Outfit,sans-serif', fontWeight: 800, color: '#1A1A1A', marginBottom: 8 }}>
            {token ? 'Set New Password' : 'Forgot Password'}
          </h1>
          <p style={{ fontSize: 14, color: '#6B6B6B' }}>
            {token 
              ? 'Enter your new password below to regain access to your account.'
              : 'Enter your email address and we\'ll send you a link to reset your password.'}
          </p>
        </div>

        {success && !token ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, borderRadius: '50%', backgroundColor: '#D1FAE5', marginBottom: 16 }}>
              <CheckCircle size={32} color="#059669" />
            </div>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#1A1A1A', marginBottom: 8 }}>Check your inbox</p>
            <p style={{ fontSize: 13, color: '#6B6B6B', marginBottom: 24 }}>If an account exists for {email}, an email will be sent with further instructions.</p>
            <button onClick={() => setSuccess(false)} style={{ background: 'none', border: 'none', color: G, fontSize: 13, fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}>
              Try another email
            </button>
          </div>
        ) : (
          <form onSubmit={token ? handleResetPassword : handleRequestReset} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {!token ? (
              <div style={{ position: 'relative' }}>
                <Mail size={18} color="#9A9080" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="email" 
                  style={inp} 
                  placeholder="Email Address" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  onFocus={e => e.target.style.borderColor = G} 
                  onBlur={e => e.target.style.borderColor = '#D0CAC0'} 
                  required 
                />
              </div>
            ) : (
              <>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} color="#9A9080" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type="password" 
                    style={inp} 
                    placeholder="New Password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    onFocus={e => e.target.style.borderColor = G} 
                    onBlur={e => e.target.style.borderColor = '#D0CAC0'} 
                    required 
                    minLength={6}
                  />
                </div>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} color="#9A9080" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type="password" 
                    style={inp} 
                    placeholder="Confirm New Password" 
                    value={confirmPassword} 
                    onChange={e => setConfirmPassword(e.target.value)} 
                    onFocus={e => e.target.style.borderColor = G} 
                    onBlur={e => e.target.style.borderColor = '#D0CAC0'} 
                    required 
                    minLength={6}
                  />
                </div>
              </>
            )}

            <button 
              type="submit" 
              disabled={loading}
              style={{ padding: '16px', backgroundColor: G, color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 8, opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Processing...' : (token ? 'Reset Password' : 'Send Reset Link')}
              {!loading && !token && <ArrowRight size={18} />}
            </button>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: 24, paddingTop: 24, borderTop: '1px solid #F0EDE8' }}>
          <p style={{ fontSize: 13, color: '#6B6B6B' }}>
            Remember your password?{' '}
            <Link to="/login" style={{ color: G, fontWeight: 700, textDecoration: 'none' }}>
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

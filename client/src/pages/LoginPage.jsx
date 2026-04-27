import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { navigate } from '../hooks/useRoute';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const { login, isLoading, error: authError, clearError } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors]     = useState({});
  const [touched, setTouched]   = useState({});
  const [showPw, setShowPw]     = useState(false);

  const validate = () => {
    const e = {};
    if (!formData.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Enter a valid email';
    if (!formData.password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
    if (touched[name]) setErrors(p => ({ ...p, [name]: '' }));
    clearError();
  };

  const handleBlur = (e) => {
    setTouched(p => ({ ...p, [e.target.name]: true }));
    validate();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const ok = login(formData.email, formData.password);
    if (ok) navigate('/dashboard');
  };

  return (
    <div className={styles.page}>
      {/* Left panel — form */}
      <div className={styles.formPanel}>
        <div className={styles.formWrap}>
          {/* Logo */}
          <a href="/" className={styles.logo}>
            <svg width="32" height="32" viewBox="0 0 34 34" fill="none">
              <defs>
                <linearGradient id="lp-top" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#2dd4bf"/><stop offset="100%" stopColor="#14b8a6"/>
                </linearGradient>
                <linearGradient id="lp-front" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0d9488"/><stop offset="100%" stopColor="#0a7a72"/>
                </linearGradient>
                <linearGradient id="lp-side" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#14b8a6"/><stop offset="100%" stopColor="#0d9488"/>
                </linearGradient>
              </defs>
              <polygon points="17,3 31,11 17,19 3,11" fill="url(#lp-top)"/>
              <polygon points="3,11 17,19 17,31 3,23" fill="url(#lp-front)"/>
              <polygon points="31,11 17,19 17,31 31,23" fill="url(#lp-side)"/>
            </svg>
            <span className={styles.logoText}><span className={styles.logoNova}>Nova</span><span className={styles.logoPack}>Pack</span></span>
          </a>

          <div className={styles.header}>
            <h1 className={styles.title}>Welcome back</h1>
            <p className={styles.subtitle}>Log in to your NovaPack account to manage your designs and orders.</p>
          </div>

          {authError && (
            <div className={styles.alert} role="alert">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7.5" stroke="#ef4444" strokeWidth="1.5"/><path d="M9 5.5v4" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/><circle cx="9" cy="13" r="0.8" fill="#ef4444"/></svg>
              {authError}
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="email">Email address</label>
              <input
                id="email" name="email" type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="email"
                className={`${styles.input} ${touched.email && errors.email ? styles.inputError : ''}`}
              />
              {touched.email && errors.email && <span className={styles.errorMsg}>{errors.email}</span>}
            </div>

            <div className={styles.field}>
              <div className={styles.labelRow}>
                <label className={styles.label} htmlFor="password">Password</label>
                <a href="#" className={styles.forgotLink}>Forgot password?</a>
              </div>
              <div className={styles.passwordWrap}>
                <input
                  id="password" name="password" type={showPw ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="current-password"
                  className={`${styles.input} ${touched.password && errors.password ? styles.inputError : ''}`}
                />
                <button type="button" className={styles.eyeBtn} onClick={() => setShowPw(p => !p)} aria-label="Toggle password visibility">
                  {showPw
                    ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  }
                </button>
              </div>
              {touched.password && errors.password && <span className={styles.errorMsg}>{errors.password}</span>}
            </div>

            <button type="submit" disabled={isLoading} className={styles.submitBtn}>
              {isLoading ? (
                <><span className={styles.spinner} />Logging in…</>
              ) : 'Log In'}
            </button>
          </form>

          <p className={styles.switchText}>
            Don't have an account?{' '}
            <a href="/register" className={styles.switchLink}>Create one free</a>
          </p>

          <div className={styles.adminHint}>
            <span>Admin access:</span> admin@novapack.com / Admin@123
          </div>
        </div>
      </div>

      {/* Right panel — brand visual */}
      <div className={styles.visual} aria-hidden="true">
        <div className={styles.visualOverlay} />
        <img
          src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=900&q=85&auto=format"
          alt=""
          className={styles.visualImg}
        />
        <div className={styles.visualContent}>
          <blockquote className={styles.quote}>
            "NovaPack transformed our unboxing experience. Quality that speaks for itself."
          </blockquote>
          <p className={styles.quoteName}>Sarah Mitchell — Bloom Wellness Co.</p>
          <div className={styles.quoteStars}>
            {[...Array(5)].map((_, i) => (
              <svg key={i} width="16" height="16" viewBox="0 0 14 14" fill="#fbbf24"><path d="M7 1l1.6 3.3 3.6.5-2.6 2.5.6 3.6L7 9.3 3.8 11l.6-3.6L2 4.8l3.6-.5z"/></svg>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

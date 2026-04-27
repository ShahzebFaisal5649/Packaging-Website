import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { navigate } from '../hooks/useRoute';
import styles from './RegisterPage.module.css';

export default function RegisterPage() {
  const { register, isLoading, error: authError, clearError } = useAuth();

  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', terms: false });
  const [errors, setErrors]     = useState({});
  const [touched, setTouched]   = useState({});
  const [showPw, setShowPw]     = useState(false);

  const validate = () => {
    const e = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) e.name = 'Full name is required (min 2 chars)';
    if (!formData.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Enter a valid email';
    if (!formData.password) e.password = 'Password is required';
    else if (formData.password.length < 6) e.password = 'At least 6 characters';
    if (formData.password !== formData.confirmPassword) e.confirmPassword = 'Passwords do not match';
    if (!formData.terms) e.terms = 'You must accept the terms';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
    if (touched[name]) setErrors(p => ({ ...p, [name]: '' }));
    clearError();
  };

  const handleBlur = (e) => {
    setTouched(p => ({ ...p, [e.target.name]: true }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const ok = register(formData.email, formData.password, formData.name);
    if (ok) navigate('/dashboard');
  };

  return (
    <div className={styles.page}>
      {/* Left visual */}
      <div className={styles.visual} aria-hidden="true">
        <div className={styles.visualOverlay} />
        <img
          src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=85&auto=format"
          alt=""
          className={styles.visualImg}
        />
        <div className={styles.visualContent}>
          <div className={styles.badge}>Trusted by 50,000+ brands</div>
          <h2 className={styles.visualTitle}>Premium custom packaging, made simple</h2>
          <ul className={styles.visualFeatures}>
            {['No setup fees', 'Minimum 50 units', 'Free design support', 'Ships in 8 days'].map(f => (
              <li key={f} className={styles.visualFeature}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="8" fill="rgba(20,184,166,0.2)"/><path d="M5 8l2 2 4-4" stroke="#14b8a6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right form */}
      <div className={styles.formPanel}>
        <div className={styles.formWrap}>
          <a href="/" className={styles.logo}>
            <svg width="32" height="32" viewBox="0 0 34 34" fill="none">
              <defs>
                <linearGradient id="rp-top" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#2dd4bf"/><stop offset="100%" stopColor="#14b8a6"/></linearGradient>
                <linearGradient id="rp-front" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0d9488"/><stop offset="100%" stopColor="#0a7a72"/></linearGradient>
                <linearGradient id="rp-side" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#14b8a6"/><stop offset="100%" stopColor="#0d9488"/></linearGradient>
              </defs>
              <polygon points="17,3 31,11 17,19 3,11" fill="url(#rp-top)"/>
              <polygon points="3,11 17,19 17,31 3,23" fill="url(#rp-front)"/>
              <polygon points="31,11 17,19 17,31 31,23" fill="url(#rp-side)"/>
            </svg>
            <span className={styles.logoText}><span className={styles.logoNova}>Nova</span><span className={styles.logoPack}>Pack</span></span>
          </a>

          <div className={styles.header}>
            <h1 className={styles.title}>Create your account</h1>
            <p className={styles.subtitle}>Start designing custom packaging in minutes. No credit card required.</p>
          </div>

          {authError && (
            <div className={styles.alert} role="alert">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7.5" stroke="#ef4444" strokeWidth="1.5"/><path d="M9 5.5v4" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/><circle cx="9" cy="13" r="0.8" fill="#ef4444"/></svg>
              {authError}
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="name">Full Name</label>
              <input id="name" name="name" type="text" placeholder="Jane Smith"
                value={formData.name} onChange={handleChange} onBlur={handleBlur}
                autoComplete="name"
                className={`${styles.input} ${touched.name && errors.name ? styles.inputError : ''}`}
              />
              {touched.name && errors.name && <span className={styles.errorMsg}>{errors.name}</span>}
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="reg-email">Email address</label>
              <input id="reg-email" name="email" type="email" placeholder="you@example.com"
                value={formData.email} onChange={handleChange} onBlur={handleBlur}
                autoComplete="email"
                className={`${styles.input} ${touched.email && errors.email ? styles.inputError : ''}`}
              />
              {touched.email && errors.email && <span className={styles.errorMsg}>{errors.email}</span>}
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="reg-password">Password</label>
                <div className={styles.passwordWrap}>
                  <input id="reg-password" name="password" type={showPw ? 'text' : 'password'}
                    placeholder="Min 6 characters"
                    value={formData.password} onChange={handleChange} onBlur={handleBlur}
                    autoComplete="new-password"
                    className={`${styles.input} ${touched.password && errors.password ? styles.inputError : ''}`}
                  />
                  <button type="button" className={styles.eyeBtn} onClick={() => setShowPw(p => !p)} aria-label="Toggle">
                    {showPw
                      ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    }
                  </button>
                </div>
                {touched.password && errors.password && <span className={styles.errorMsg}>{errors.password}</span>}
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="confirmPassword">Confirm Password</label>
                <input id="confirmPassword" name="confirmPassword" type={showPw ? 'text' : 'password'}
                  placeholder="Re-enter password"
                  value={formData.confirmPassword} onChange={handleChange} onBlur={handleBlur}
                  autoComplete="new-password"
                  className={`${styles.input} ${touched.confirmPassword && errors.confirmPassword ? styles.inputError : ''}`}
                />
                {touched.confirmPassword && errors.confirmPassword && <span className={styles.errorMsg}>{errors.confirmPassword}</span>}
              </div>
            </div>

            <label className={styles.checkLabel}>
              <input type="checkbox" name="terms" checked={formData.terms} onChange={handleChange} className={styles.checkbox} />
              <span className={styles.checkText}>
                I agree to the <a href="#" className={styles.checkLink}>Terms of Service</a> and <a href="#" className={styles.checkLink}>Privacy Policy</a>
              </span>
            </label>
            {touched.terms && errors.terms && <span className={styles.errorMsg}>{errors.terms}</span>}

            <button type="submit" disabled={isLoading} className={styles.submitBtn}>
              {isLoading ? <><span className={styles.spinner} />Creating account…</> : 'Create Free Account'}
            </button>
          </form>

          <p className={styles.switchText}>
            Already have an account?{' '}
            <a href="/login" className={styles.switchLink}>Log in</a>
          </p>
        </div>
      </div>
    </div>
  );
}

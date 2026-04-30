import { useState, useEffect } from 'react';
import { X, UserPlus, ArrowLeft, Loader2 } from 'lucide-react';

const INITIAL_ACCOUNTS = [
  { id: 'g1', name: 'Shahzeb Faisal', email: 'shahzeb@gmail.com', avatar: 'SF' },
  { id: 'g2', name: 'Zohaib Hassan', email: 'zohaib.h@gmail.com', avatar: 'ZH' },
];

export default function GoogleLoginModal({ isOpen, onClose, onSelect }) {
  const [step, setStep] = useState('select'); // 'select', 'input', 'loading'
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [accounts, setAccounts] = useState(INITIAL_ACCOUNTS);

  useEffect(() => {
    if (isOpen) {
      setStep('select');
      const saved = JSON.parse(localStorage.getItem('saved_google_accounts') || '[]');
      setAccounts([...INITIAL_ACCOUNTS, ...saved]);
    }
  }, [isOpen]);

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customEmail || !customName) return;
    
    const newAccount = {
      id: Date.now().toString(),
      name: customName,
      email: customEmail,
      avatar: customName[0].toUpperCase()
    };

    // Save for next time to feel "real"
    const saved = JSON.parse(localStorage.getItem('saved_google_accounts') || '[]');
    localStorage.setItem('saved_google_accounts', JSON.stringify([...saved, newAccount]));

    handleSelect(newAccount);
  };

  const handleSelect = (account) => {
    setStep('loading');
    setTimeout(() => {
      onSelect(account);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 20000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
      <div style={{ background: '#fff', borderRadius: 12, width: '100%', maxWidth: 400, overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,0.3)', fontFamily: 'Roboto, Arial, sans-serif' }}>
        
        {/* Header */}
        <div style={{ padding: '24px 24px 8px', display: 'flex', justifyContent: 'center', position: 'relative' }}>
          <div style={{ textAlign: 'center' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" style={{ marginBottom: 12 }}>
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <h1 style={{ fontSize: 24, fontWeight: 500, color: '#202124', margin: 0 }}>
              {step === 'select' ? 'Choose an account' : step === 'input' ? 'Sign in' : 'Verifying...'}
            </h1>
            <p style={{ fontSize: 16, color: '#202124', marginTop: 8 }}>to continue to <span style={{ fontWeight: 500 }}>NovaPack</span></p>
          </div>
          {step !== 'loading' && (
            <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', color: '#5f6368' }}><X size={20} /></button>
          )}
        </div>

        {/* Content */}
        <div style={{ minHeight: 300, display: 'flex', flexDirection: 'column' }}>
          
          {step === 'select' && (
            <div style={{ padding: '16px 0' }}>
              <div style={{ maxHeight: 280, overflowY: 'auto' }}>
                {accounts.map(account => (
                  <button
                    key={account.id}
                    onClick={() => handleSelect(account)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 16, padding: '12px 24px',
                      border: 'none', borderTop: '1px solid #e8eaed', background: 'none', cursor: 'pointer', textAlign: 'left',
                      width: '100%', transition: 'background 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f7f8f8'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                  >
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%', background: '#1A4D2E',
                      color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 14, fontWeight: 500, flexShrink: 0
                    }}>
                      {account.avatar}
                    </div>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: '#3c4043' }}>{account.name}</p>
                      <p style={{ margin: 0, fontSize: 12, color: '#5f6368', overflow: 'hidden', textOverflow: 'ellipsis' }}>{account.email}</p>
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setStep('input')}
                style={{
                  display: 'flex', alignItems: 'center', gap: 16, padding: '16px 24px',
                  border: 'none', borderTop: '1px solid #e8eaed', background: 'none', cursor: 'pointer', textAlign: 'left',
                  width: '100%', color: '#1a73e8', transition: 'background 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#f7f8f8'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}
              >
                <div style={{ width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <UserPlus size={20} />
                </div>
                <span style={{ fontSize: 14, fontWeight: 500 }}>Use another account</span>
              </button>
            </div>
          )}

          {step === 'input' && (
            <form onSubmit={handleCustomSubmit} style={{ padding: '24px' }}>
              <div style={{ marginBottom: 24 }}>
                <input
                  autoFocus
                  type="email"
                  placeholder="Email or phone"
                  value={customEmail}
                  onChange={e => setCustomEmail(e.target.value)}
                  style={{ width: '100%', padding: '13px 15px', border: '1px solid #dadce0', borderRadius: 4, fontSize: 16, outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ marginBottom: 24 }}>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={customName}
                  onChange={e => setCustomName(e.target.value)}
                  style={{ width: '100%', padding: '13px 15px', border: '1px solid #dadce0', borderRadius: 4, fontSize: 16, outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 32 }}>
                <button type="button" onClick={() => setStep('select')} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', color: '#1a73e8', fontWeight: 500, cursor: 'pointer', padding: 0 }}>
                  <ArrowLeft size={16} /> Back
                </button>
                <button type="submit" style={{ background: '#1a73e8', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 4, fontWeight: 500, cursor: 'pointer' }}>
                  Next
                </button>
              </div>
            </form>
          )}

          {step === 'loading' && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
              <Loader2 size={40} className="animate-spin" color="#1a73e8" />
              <p style={{ marginTop: 16, color: '#5f6368', fontSize: 14 }}>Connecting to NovaPack security...</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 24px 24px', borderTop: '1px solid #e8eaed', fontSize: 12, color: '#5f6368', lineHeight: 1.5 }}>
          To continue, Google will share your name, email address, language preference, and profile picture with NovaPack. See NovaPack's <span style={{ color: '#1a73e8' }}>Privacy Policy</span> and <span style={{ color: '#1a73e8' }}>Terms of Service</span>.
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
}

import { X } from 'lucide-react';

const ACCOUNTS = [
  { id: 'g1', name: 'Shahzeb Faisal', email: 'shahzeb@gmail.com', avatar: 'SF' },
  { id: 'g2', name: 'Zohaib Hassan', email: 'zohaib.h@gmail.com', avatar: 'ZH' },
  { id: 'g3', name: 'Saba Malik', email: 'saba.malik@outlook.com', avatar: 'SM' },
];

export default function GoogleLoginModal({ isOpen, onClose, onSelect }) {
  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 20000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
      <div style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 360, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
        <div style={{ padding: '24px 24px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f0f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: '#1a1a1a' }}>Choose an account</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#aaa' }}><X size={18} /></button>
        </div>

        <div style={{ padding: '16px 0' }}>
          <p style={{ padding: '0 24px', fontSize: 13, color: '#666', marginBottom: 16 }}>to continue to <strong>NovaPack</strong></p>
          
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {ACCOUNTS.map(account => (
              <button
                key={account.id}
                onClick={() => onSelect(account)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14, padding: '12px 24px',
                  border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left',
                  transition: 'background 0.2s', width: '100%',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#f8f8f8'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: '50%', background: '#1A4D2E',
                  color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, fontWeight: 700, flexShrink: 0,
                }}>
                  {account.avatar}
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>{account.name}</p>
                  <p style={{ margin: 0, fontSize: 12, color: '#666', overflow: 'hidden', textOverflow: 'ellipsis' }}>{account.email}</p>
                </div>
              </button>
            ))}

            <button
              style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '16px 24px',
                border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left',
                transition: 'background 0.2s', width: '100%', borderTop: '1px solid #f0f0f0',
                marginTop: 8,
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#f8f8f8'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
                </svg>
              </div>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>Use another account</span>
            </button>
          </div>
        </div>

        <div style={{ padding: '16px 24px 24px', fontSize: 11, color: '#999', lineHeight: 1.5 }}>
          To continue, Google will share your name, email address, language preference, and profile picture with NovaPack.
        </div>
      </div>
    </div>
  );
}

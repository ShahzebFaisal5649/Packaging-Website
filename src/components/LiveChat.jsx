import { useEffect, useState, useRef } from 'react';
import { MessageCircle, X, Send, ChevronDown, Mail, Phone } from 'lucide-react';

/**
 * Tawk.to Live Chat
 *
 * To enable the REAL Tawk.to widget:
 *  1. Sign up free at https://www.tawk.to
 *  2. Go to Admin → Chat Widget → copy your Property ID
 *  3. Open .env in the project root and set:
 *       VITE_TAWK_PROPERTY_ID=your_property_id_here
 *  4. Restart the dev server — Tawk.to will load automatically.
 *
 * Until then, the branded fallback widget below is shown.
 */

const TAWK_PROPERTY_ID = import.meta.env.VITE_TAWK_PROPERTY_ID || '';
const TAWK_WIDGET_ID = import.meta.env.VITE_TAWK_WIDGET_ID || 'default';

const G = '#1A4D2E';

const QUICK_QUESTIONS = [
  'What is your minimum order quantity?',
  'How long does shipping take?',
  'Can I get a free sample?',
  'Do you offer custom printing?',
];

export default function LiveChat() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const [messages, setMessages] = useState([
    {
      from: 'agent',
      text: "Hi there! 👋 Welcome to NovaPack. I'm here to help with any packaging questions.",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [showNotif, setShowNotif] = useState(false);
  const msgEndRef = useRef(null);

  // Tawk.to real integration
  useEffect(() => {
    if (!TAWK_PROPERTY_ID || document.getElementById('tawk-script')) return;
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadTime = new Date();
    const s = document.createElement('script');
    s.id = 'tawk-script';
    s.async = true;
    s.src = `https://embed.tawk.to/${TAWK_PROPERTY_ID}/${TAWK_WIDGET_ID}`;
    s.charset = 'UTF-8';
    s.setAttribute('crossorigin', '*');
    document.head.appendChild(s);
    return () => { const el = document.getElementById('tawk-script'); if (el) el.remove(); };
  }, []);

  // Auto notification pop after 8s
  useEffect(() => {
    if (TAWK_PROPERTY_ID) return;
    const t = setTimeout(() => setShowNotif(true), 8000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    msgEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (text) => {
    const userMsg = text || message.trim();
    if (!userMsg) return;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { from: 'user', text: userMsg, time }]);
    setMessage('');
    // Auto-reply after 1.2s
    setTimeout(() => {
      setMessages(prev => [...prev, {
        from: 'agent',
        text: "Thanks for your message! Our team will get back to you shortly. For immediate help, email us at support@novapack.com or call +1 (555) 123-4567.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
      setSent(true);
    }, 1200);
  };

  const handleKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } };

  // When Tawk.to is configured it handles itself
  if (TAWK_PROPERTY_ID) return null;

  const isMobile = windowWidth <= 480;
  const chatWindowStyle = {
    position: 'fixed',
    right: isMobile ? 0 : 20,
    bottom: isMobile ? 0 : 90,
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    background: '#fff',
    boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
    borderRadius: isMobile ? 0 : 16,
    width: isMobile ? '100vw' : 360,
    maxWidth: isMobile ? '100vw' : 360,
    height: isMobile ? '100%' : 'auto',
    top: isMobile ? 0 : 'auto',
    maxHeight: isMobile ? '100%' : 600,
  };

  if (hidden) {
    return (
      <button
        onClick={() => setHidden(false)}
        style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 9990,
          background: 'rgba(26,77,46,0.9)', border: 'none', borderRadius: 100,
          padding: '12px 24px', cursor: 'pointer', color: '#fff',
          fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}
      >
        <MessageCircle size={16} /> Chat
      </button>
    );
  }

  return (
    <div style={{ position: 'fixed', bottom: isMobile && open ? 0 : 24, right: isMobile && open ? 0 : 16, zIndex: 9990, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10, width: open && isMobile ? '100%' : 'auto', maxWidth: '100vw' }}>

      {/* Notification bubble */}
      {showNotif && !open && (
        <div style={{
          position: 'relative', background: '#fff', borderRadius: 14, padding: '12px 16px', width: 230,
          boxShadow: '0 8px 32px rgba(0,0,0,0.14)', border: '1px solid #E8E4DC',
          animation: 'chatSlide 0.25s ease-out',
          pointerEvents: 'auto',
        }}>
          <button
            onClick={() => setShowNotif(false)}
            style={{ position: 'absolute', top: 8, right: 10, background: 'none', border: 'none', cursor: 'pointer', color: '#ccc' }}
          >
            <X size={13} />
          </button>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#1A1A1A', margin: '0 0 4px' }}>NovaPack Support</p>
          <p style={{ fontSize: 12, color: '#666', margin: '0 0 10px', lineHeight: 1.5 }}>
            Need help with your packaging order? Chat with us!
          </p>
          <button
            onClick={() => { setOpen(true); setShowNotif(false); }}
            style={{ width: '100%', padding: '12px', background: G, color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
          >
            Start Chat
          </button>
        </div>
      )}

      {/* Chat window */}
      {open && (
        <div style={{ ...chatWindowStyle, pointerEvents: 'auto' }}>
          {/* Header */}
          <div style={{ background: `linear-gradient(135deg, ${G}, #2E6B47)`, padding: '16px 18px', position: 'sticky', top: 0, zIndex: 3 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 11, minWidth: 0 }}>
                <div style={{ position: 'relative' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MessageCircle size={19} color="#fff" />
                  </div>
                  <span style={{ position: 'absolute', bottom: 1, right: 1, width: 10, height: 10, borderRadius: '50%', background: '#4ADE80', border: '2px solid #1A4D2E' }} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 800, color: '#fff', margin: 0 }}>NovaPack Support</p>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)', margin: '6px 0 0', display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ADE80', display: 'inline-block' }} />
                    Online · Typically replies in minutes
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <button onClick={() => setOpen(false)} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: 44, height: 44, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                  <ChevronDown size={20} />
                </button>
                <button onClick={() => { setOpen(false); setHidden(true); }} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: 44, height: 44, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                  <X size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 12, minHeight: 220, background: '#FAFAF9' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: m.from === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '82%', padding: '10px 14px', borderRadius: m.from === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                  background: m.from === 'user' ? G : '#fff',
                  color: m.from === 'user' ? '#fff' : '#1A1A1A',
                  fontSize: 13, lineHeight: 1.55,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                }}>
                  {m.text}
                </div>
                <span style={{ fontSize: 10, color: '#bbb', marginTop: 3 }}>{m.time}</span>
              </div>
            ))}
            <div ref={msgEndRef} />
          </div>

          {/* Quick questions */}
          {messages.length < 3 && !sent && (
            <div style={{ padding: '10px 14px', borderTop: '1px solid #F0EDE8', background: '#fff' }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: '#bbb', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 8px' }}>Quick Questions</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {QUICK_QUESTIONS.map((q, i) => (
                  <button key={i} onClick={() => sendMessage(q)} style={{
                    padding: '5px 10px', background: '#F5F2ED', border: '1px solid #E0DBD3',
                    borderRadius: 100, fontSize: 11, fontWeight: 600, color: '#555', cursor: 'pointer',
                    transition: 'background 0.15s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = '#EBE7E0'}
                    onMouseLeave={e => e.currentTarget.style.background = '#F5F2ED'}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div style={{ padding: '12px 14px', borderTop: '1px solid #F0EDE8', background: '#fff', display: 'flex', gap: 8, alignItems: 'flex-end' }}>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Type a message…"
              rows={1}
              style={{
                flex: 1, padding: '10px 12px', border: '1.5px solid #E0DBD3', borderRadius: 10,
                fontSize: 13, resize: 'none', outline: 'none', fontFamily: 'inherit',
                lineHeight: 1.4, maxHeight: 80, overflowY: 'auto',
              }}
              onFocus={e => e.target.style.borderColor = G}
              onBlur={e => e.target.style.borderColor = '#E0DBD3'}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!message.trim()}
              style={{
                width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                background: message.trim() ? G : '#E0DBD3',
                border: 'none', cursor: message.trim() ? 'pointer' : 'default',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.15s',
              }}
            >
              <Send size={16} color="#fff" />
            </button>
          </div>

          {/* Footer links */}
          <div style={{ padding: '10px 14px', background: '#F5F2ED', borderTop: '1px solid #E8E4DC', display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="mailto:support@novapack.com" style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, color: G, textDecoration: 'none' }}>
              <Mail size={12} /> Email Us
            </a>
            <span style={{ color: '#ddd' }}>|</span>
            <a href="tel:+15551234567" style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, color: G, textDecoration: 'none' }}>
              <Phone size={12} /> Call Us
            </a>
          </div>
        </div>
      )}

      {/* Toggle button */}
      {!isMobile && (
        <button
          onClick={() => { setOpen(!open); setShowNotif(false); }}
          style={{
            width: 58, height: 58, borderRadius: '50%',
            background: open ? '#374151' : `linear-gradient(135deg, ${G}, #2E6B47)`,
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 6px 24px rgba(26,77,46,0.45)`,
            transition: 'transform 0.2s, background 0.2s',
            pointerEvents: 'auto',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          title={open ? 'Close chat' : 'Chat with us'}
          aria-label="Live chat"
        >
          {open
            ? <X size={24} color="#fff" />
            : <MessageCircle size={24} color="#fff" />}
        </button>
      )}

      {isMobile && !open && (
        <button
          onClick={() => { setOpen(true); setShowNotif(false); }}
          style={{
            width: 56, height: 56, borderRadius: '50%',
            background: `linear-gradient(135deg, ${G}, #2E6B47)`,
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 6px 24px rgba(26,77,46,0.45)`,
            pointerEvents: 'auto',
          }}
          aria-label="Live chat"
        >
          <MessageCircle size={26} color="#fff" />
        </button>
      )}

      <style>{`
        @keyframes chatSlide {
          from { opacity: 0; transform: translateY(12px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}

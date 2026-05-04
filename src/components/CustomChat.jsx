import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, User, Bot, Minus, Maximize2, RefreshCw, Sparkles } from 'lucide-react';
import api from '../services/api';

const G = '#1A4D2E';
const ACCENT = '#C8860A';

const QUICK_PROMPTS = [
  'What boxes do you offer?',
  'How much do custom boxes cost?',
  'What is your minimum order?',
  'Do you offer free design?',
];

// Simple markdown renderer: bold (**text**) and bullets (- item)
function MarkdownText({ text }) {
  const lines = text.split('\n');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {lines.map((line, i) => {
        if (!line.trim()) return null;
        // Bullet point
        const isBullet = line.trimStart().startsWith('- ') || line.trimStart().startsWith('• ');
        const content = isBullet ? line.replace(/^[\s\-•]+/, '') : line;
        // Parse bold **text**
        const parts = content.split(/\*\*(.*?)\*\*/g);
        const rendered = parts.map((part, j) =>
          j % 2 === 1 ? <strong key={j}>{part}</strong> : part
        );
        if (isBullet) {
          return (
            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <span style={{ color: ACCENT, fontWeight: 900, marginTop: 1, flexShrink: 0 }}>•</span>
              <span>{rendered}</span>
            </div>
          );
        }
        return <div key={i}>{rendered}</div>;
      })}
    </div>
  );
}

const WELCOME = "👋 Welcome to **Design Custom Box**! I'm your AI packaging expert — ask me anything about our products, pricing, or custom design services.";

export default function CustomChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { role: 'model', parts: [{ text: WELCOME }] },
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory, loading, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, isMinimized]);

  const sendMessage = async (text) => {
    const msgText = (text || message).trim();
    if (!msgText || loading) return;

    const userMsg = { role: 'user', parts: [{ text: msgText }] };
    setChatHistory(prev => [...prev, userMsg]);
    setMessage('');
    setLoading(true);

    try {
      const history = chatHistory.slice(1); // exclude welcome message
      const res = await api.post('/chat', { message: msgText, history });
      setChatHistory(prev => [...prev, { role: 'model', parts: [{ text: res.text }] }]);
    } catch {
      setChatHistory(prev => [...prev, {
        role: 'model',
        parts: [{ text: "I'm having a momentary issue. Please email **Designcustombox@gmail.com** or call **(913) 228-2682** for immediate help." }],
      }]);
    } finally {
      setLoading(false);
    }
  };

  const resetChat = () => {
    setChatHistory([{ role: 'model', parts: [{ text: WELCOME }] }]);
    setMessage('');
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 480;

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, fontFamily: "'Inter', sans-serif" }}>

      {/* Floating Trigger Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            key="trigger"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            style={{
              width: 64, height: 64, borderRadius: '50%',
              background: `linear-gradient(135deg, ${G} 0%, #2E6B47 100%)`,
              color: '#fff', border: 'none', cursor: 'pointer',
              boxShadow: '0 8px 32px rgba(26,77,46,0.4), 0 0 0 4px rgba(26,77,46,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative',
            }}
          >
            <MessageSquare size={28} />
            {/* Pulse ring */}
            <span style={{
              position: 'absolute', inset: -4, borderRadius: '50%',
              border: `2px solid ${G}`, opacity: 0.3,
              animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
            }} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-window"
            initial={{ y: 20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1, height: isMinimized ? 68 : (isMobile ? 'calc(100vh - 16px)' : 560) }}
            exit={{ y: 20, opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            style={{
              width: isMobile ? 'calc(100vw - 32px)' : 400,
              background: '#fff',
              borderRadius: isMobile ? 20 : 24,
              boxShadow: '0 24px 64px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.08)',
              display: 'flex', flexDirection: 'column', overflow: 'hidden',
              border: '1px solid rgba(26,77,46,0.12)',
              position: isMobile ? 'fixed' : 'relative',
              bottom: isMobile ? 8 : 'auto',
              right: isMobile ? 16 : 'auto',
            }}
          >
            {/* ── Header ── */}
            <div style={{
              padding: '16px 20px',
              background: `linear-gradient(135deg, ${G} 0%, #2E6B47 100%)`,
              color: '#fff', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0,
            }}>
              <div style={{ position: 'relative' }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '2px solid rgba(255,255,255,0.3)',
                }}>
                  <Sparkles size={20} color="#FFD700" />
                </div>
                <span style={{
                  position: 'absolute', bottom: 1, right: 1,
                  width: 10, height: 10, background: '#4ADE80',
                  borderRadius: '50%', border: '2px solid #1A4D2E',
                }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: '-0.01em' }}>DCB Assistant</div>
                {!isMinimized && <div style={{ fontSize: 11, opacity: 0.8, fontWeight: 500 }}>Powered by Gemini AI · Online</div>}
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={resetChat} title="New chat" style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 8, color: '#fff', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <RefreshCw size={14} />
                </button>
                <button onClick={() => setIsMinimized(m => !m)} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 8, color: '#fff', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  {isMinimized ? <Maximize2 size={14} /> : <Minus size={14} />}
                </button>
                <button onClick={() => setIsOpen(false)} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 8, color: '#fff', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <X size={16} />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* ── Messages ── */}
                <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 16, background: '#F7F8F9' }}>
                  {chatHistory.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      style={{ display: 'flex', gap: 10, flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', alignItems: 'flex-end', maxWidth: '100%' }}
                    >
                      {/* Avatar */}
                      <div style={{
                        width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                        background: msg.role === 'user' ? ACCENT : G,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                      }}>
                        {msg.role === 'user' ? <User size={14} color="#fff" /> : <Bot size={14} color="#fff" />}
                      </div>
                      {/* Bubble */}
                      <div style={{
                        maxWidth: '80%', padding: '12px 16px', borderRadius: 16,
                        fontSize: 13.5, lineHeight: 1.65,
                        background: msg.role === 'user' ? G : '#fff',
                        color: msg.role === 'user' ? '#fff' : '#1A1A1A',
                        boxShadow: msg.role === 'user' ? 'none' : '0 2px 12px rgba(0,0,0,0.06)',
                        border: msg.role === 'user' ? 'none' : '1px solid #E8EBF0',
                        borderBottomRightRadius: msg.role === 'user' ? 4 : 16,
                        borderBottomLeftRadius: msg.role === 'user' ? 16 : 4,
                      }}>
                        <MarkdownText text={msg.parts[0].text} />
                      </div>
                    </motion.div>
                  ))}

                  {/* Typing indicator */}
                  {loading && (
                    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
                      <div style={{ width: 30, height: 30, borderRadius: '50%', background: G, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Bot size={14} color="#fff" />
                      </div>
                      <div style={{ padding: '14px 18px', borderRadius: 16, borderBottomLeftRadius: 4, background: '#fff', border: '1px solid #E8EBF0', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', display: 'flex', gap: 5, alignItems: 'center' }}>
                        {[0, 0.2, 0.4].map((d, i) => (
                          <span key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: G, opacity: 0.6, animation: `bounce 1.2s ${d}s ease-in-out infinite` }} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* ── Quick Prompts ── */}
                {chatHistory.length <= 1 && !loading && (
                  <div style={{ padding: '0 16px 12px', display: 'flex', gap: 6, flexWrap: 'wrap', background: '#F7F8F9' }}>
                    {QUICK_PROMPTS.map(q => (
                      <button key={q} onClick={() => sendMessage(q)}
                        style={{
                          padding: '6px 12px', borderRadius: 100, fontSize: 11.5, fontWeight: 700,
                          border: `1.5px solid ${G}30`, background: '#fff', color: G, cursor: 'pointer',
                          transition: 'all 0.2s', whiteSpace: 'nowrap',
                        }}
                        onMouseEnter={e => { e.target.style.background = G; e.target.style.color = '#fff'; e.target.style.borderColor = G; }}
                        onMouseLeave={e => { e.target.style.background = '#fff'; e.target.style.color = G; e.target.style.borderColor = `${G}30`; }}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}

                {/* ── Input ── */}
                <div style={{ padding: '14px 16px', background: '#fff', borderTop: '1px solid #EAECF0', flexShrink: 0 }}>
                  <form onSubmit={e => { e.preventDefault(); sendMessage(); }} style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#F7F8F9', borderRadius: 14, padding: '8px 8px 8px 16px', border: '1.5px solid #E2E8F0' }}>
                    <input
                      ref={inputRef}
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      placeholder="Ask about boxes, pricing, shipping..."
                      disabled={loading}
                      style={{ flex: 1, border: 'none', outline: 'none', fontSize: 13.5, background: 'none', color: '#1A1A1A', fontWeight: 500 }}
                    />
                    <button type="submit" disabled={!message.trim() || loading}
                      style={{
                        width: 36, height: 36, borderRadius: 10, border: 'none',
                        background: message.trim() && !loading ? G : '#E2E8F0',
                        color: message.trim() && !loading ? '#fff' : '#94A3B8',
                        cursor: message.trim() && !loading ? 'pointer' : 'default',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.2s', flexShrink: 0,
                      }}
                    >
                      <Send size={16} />
                    </button>
                  </form>
                  <p style={{ fontSize: 10, color: '#94A3B8', textAlign: 'center', margin: '8px 0 0', fontWeight: 500 }}>
                    AI responses may not be 100% accurate · Contact us for confirmed details
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes ping { 75%, 100% { transform: scale(1.8); opacity: 0; } }
        @keyframes bounce { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-6px); } }
      `}</style>
    </div>
  );
}

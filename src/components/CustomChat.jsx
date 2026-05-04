import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, User, Bot, Minus, Maximize2, RefreshCw } from 'lucide-react';
import api from '../services/api';

const G = '#1A4D2E';
const ACCENT = '#C8860A';

export default function CustomChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { role: 'model', parts: [{ text: "👋 Hi! I'm your Design Custom Box assistant. How can I help you today?" }] }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || loading) return;

    const userMessage = { role: 'user', parts: [{ text: message }] };
    setChatHistory(prev => [...prev, userMessage]);
    setMessage('');
    setLoading(true);

    try {
      // Prepare history for backend (Gemini format)
      const history = chatHistory.slice(1); // Skip the initial welcome message if needed or keep it
      
      const res = await api.post('/chat', { message, history });
      const botMessage = { role: 'model', parts: [{ text: res.text }] };
      setChatHistory(prev => [...prev, botMessage]);
    } catch (err) {
      setChatHistory(prev => [...prev, { role: 'model', parts: [{ text: "Sorry, I'm having trouble connecting right now. Please try again later." }] }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999 }}>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            style={{
              width: 60, height: 60, borderRadius: '50%',
              background: `linear-gradient(135deg, ${G}, #2E6B47)`,
              color: '#fff', border: 'none', cursor: 'pointer',
              boxShadow: '0 8px 32px rgba(26,77,46,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            <MessageSquare size={28} />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1, height: isMinimized ? 64 : 520 }}
            exit={{ y: 20, opacity: 0, scale: 0.95 }}
            style={{
              width: '100%', maxWidth: 380, background: '#fff', borderRadius: window.innerWidth < 480 ? 0 : 24,
              boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
              display: 'flex', flexDirection: 'column', overflow: 'hidden',
              border: '1px solid rgba(26,77,46,0.1)',
              height: isMinimized ? 64 : (window.innerWidth < 480 ? 'calc(100vh - 40px)' : 520),
              position: window.innerWidth < 480 ? 'fixed' : 'relative',
              bottom: window.innerWidth < 480 ? 0 : 'auto',
              right: window.innerWidth < 480 ? 0 : 'auto',
            }}
          >
            {/* Header */}
            <div style={{
              padding: window.innerWidth < 480 ? '12px 20px' : '18px 24px', 
              background: `linear-gradient(135deg, ${G}, #2E6B47)`, 
              color: '#fff',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              flexShrink: 0
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ position: 'relative' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Bot size={20} />
                  </div>
                  <div style={{ position: 'absolute', bottom: 0, right: 0, width: 10, height: 10, background: '#4ADE80', borderRadius: '50%', border: '2px solid #1A4D2E' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0, letterSpacing: '-0.01em' }}>Premium Support</h3>
                  {!isMinimized && <p style={{ fontSize: 11, margin: 0, opacity: 0.85, fontWeight: 500 }}>Online · Intelligent Assistant</p>}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => setIsMinimized(!isMinimized)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', opacity: 0.8, padding: 4 }}>
                  {isMinimized ? <Maximize2 size={16} /> : <Minus size={16} />}
                </button>
                <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', opacity: 0.8, padding: 4 }}>
                  <X size={20} />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Chat Area */}
                <div ref={scrollRef} style={{
                  flex: 1, padding: window.innerWidth < 480 ? '16px' : '24px', overflowY: 'auto',
                  display: 'flex', flexDirection: 'column', gap: 20,
                  background: '#F9FAF9'
                }}>
                  {chatHistory.map((msg, i) => (
                    <div key={i} style={{
                      display: 'flex', gap: 12,
                      alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                      flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                      maxWidth: '85%'
                    }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: '10px',
                        background: msg.role === 'user' ? ACCENT : G,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, marginTop: 4,
                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                      }}>
                        {msg.role === 'user' ? <User size={16} color="#fff" /> : <Bot size={16} color="#fff" />}
                      </div>
                      <div style={{
                        padding: '14px 18px', borderRadius: 18,
                        fontSize: 14, lineHeight: 1.6,
                        background: msg.role === 'user' ? G : '#fff',
                        color: msg.role === 'user' ? '#fff' : '#1A1A1A',
                        boxShadow: msg.role === 'user' ? '0 4px 15px rgba(26,77,46,0.2)' : '0 4px 20px rgba(0,0,0,0.04)',
                        border: msg.role === 'user' ? 'none' : '1px solid #E2DDD6',
                        borderTopRightRadius: msg.role === 'user' ? 4 : 18,
                        borderTopLeftRadius: msg.role === 'user' ? 18 : 4,
                        wordBreak: 'break-word'
                      }}>
                        {msg.parts[0].text}
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div style={{ display: 'flex', gap: 12, alignSelf: 'flex-start' }}>
                      <div style={{ width: 32, height: 32, borderRadius: '10px', background: G, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Bot size={16} color="#fff" />
                      </div>
                      <div style={{ padding: '14px 24px', borderRadius: 18, background: '#fff', border: '1px solid #E2DDD6', display: 'flex', gap: 4 }}>
                         <span className="dot-bounce">.</span><span className="dot-bounce" style={{animationDelay: '0.2s'}}>.</span><span className="dot-bounce" style={{animationDelay: '0.4s'}}>.</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                {chatHistory.length <= 2 && !loading && (
                  <div style={{ padding: '0 24px 16px', display: 'flex', gap: 8, flexWrap: 'wrap', background: '#F9FAF9' }}>
                    {['Pricing', 'Shipping', 'Custom Design', 'Free Sample'].map(tag => (
                      <button key={tag} onClick={() => { setMessage(tag); }} 
                        style={{ padding: '6px 14px', borderRadius: 100, border: `1px solid ${G}30`, background: '#fff', color: G, fontSize: 11, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}
                        onMouseEnter={e => { e.target.style.background = G; e.target.style.color = '#fff'; }}
                        onMouseLeave={e => { e.target.style.background = '#fff'; e.target.style.color = G; }}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                )}

                {/* Input Area */}
                <form onSubmit={handleSend} style={{ 
                  padding: window.innerWidth < 480 ? '16px' : '20px 24px', background: '#fff',
                  borderTop: '1px solid #E2DDD6', display: 'flex', gap: 12,
                  alignItems: 'center', flexShrink: 0
                }}>
                  <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask about boxes, pricing..."
                    style={{
                      flex: 1, border: 'none', outline: 'none',
                      fontSize: 14, background: 'none', color: '#1A1A1A',
                      fontWeight: 500
                    }}
                  />
                  <button
                    type="submit"
                    disabled={!message.trim() || loading}
                    style={{
                      width: 36, height: 36, borderRadius: '10px',
                      background: message.trim() && !loading ? G : '#F0F0F0',
                      color: message.trim() && !loading ? '#fff' : '#aaa',
                      border: 'none',
                      cursor: message.trim() && !loading ? 'pointer' : 'default',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.3s'
                    }}
                  >
                    <Send size={18} />
                  </button>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .spin { animation: spin 1s linear infinite; }
        .dot-bounce { animation: dot-bounce 1.4s infinite ease-in-out both; font-size: 20px; color: ${G}; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes dot-bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1.0); }
        }
      `}</style>
    </div>
  );
}

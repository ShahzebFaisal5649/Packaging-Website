import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const messages = [
  { text: '⚡ Fast & Free Shipping On All Orders!', href: '/products' },
  { text: '🎉 Get 10% Off Your First Order — Use Code: FIRST10', href: '/custom-box' },
  { text: '📘 Free Ebook: Download Our Custom Packaging Buying Guide', href: '#' },
];

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setCurrent((c) => (c + 1) % messages.length);
        setFading(false);
      }, 400);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  if (!visible) return null;

  const msg = messages[current];

  return (
    <div className="bg-[#1B3F6A] text-white text-sm relative">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-center">
        <a
          href={msg.href}
          className="font-medium tracking-wide hover:text-[#F47920] transition-colors text-center"
          style={{
            opacity: fading ? 0 : 1,
            transition: 'opacity 0.35s ease',
          }}
        >
          {msg.text}
        </a>
      </div>
      <button
        onClick={() => setVisible(false)}
        aria-label="Close"
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
      >
        <X size={13} />
      </button>
    </div>
  );
}

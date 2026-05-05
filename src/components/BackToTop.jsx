import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const percent = docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0;
      setScrollPercent(percent);
      setIsVisible(scrollTop > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // SVG arc progress
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (scrollPercent / 100) * circumference;

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          style={{
            position: 'fixed',
            bottom: 96,
            right: 24,
            width: 52,
            height: 52,
            borderRadius: '50%',
            background: '#1A4D2E',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 40,
            boxShadow: '0 8px 24px rgba(26,77,46,0.35)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            animation: 'fadeInUp 0.3s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(26,77,46,0.45)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(26,77,46,0.35)'; }}
          aria-label="Back to top"
        >
          {/* Progress ring */}
          <svg
            width="52" height="52"
            style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}
          >
            <circle
              cx="26" cy="26" r={radius}
              fill="none"
              stroke="rgba(200,134,10,0.25)"
              strokeWidth="2.5"
            />
            <circle
              cx="26" cy="26" r={radius}
              fill="none"
              stroke="#C8860A"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 0.15s ease' }}
            />
          </svg>
          <ArrowUp size={18} color="#fff" strokeWidth={2.5} />
        </button>
      )}
    </>
  );
}

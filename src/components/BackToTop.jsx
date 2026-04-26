import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-24 right-6 w-12 h-12 bg-white text-brand-textPrimary rounded-full flex items-center justify-center shadow-lg border border-gray-100 hover:bg-gray-50 hover:scale-110 transition-all z-40 animate-fade-in"
          aria-label="Back to top"
        >
          <ArrowUp size={20} strokeWidth={2.5} />
        </button>
      )}
    </>
  );
}

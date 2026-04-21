import { useEffect, useState } from 'react';

export function useScrollShadow(threshold = 4) {
  const [hasShadow, setHasShadow] = useState(false);

  useEffect(() => {
    const handler = () => setHasShadow(window.scrollY > threshold);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, [threshold]);

  return hasShadow;
}

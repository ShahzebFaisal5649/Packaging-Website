import { useEffect, useRef, useState } from 'react';

export function useCarousel(length, intervalMs = 3000, active = true) {
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);

  const reset = () => {
    clearInterval(timerRef.current);
    setIndex(0);
  };

  useEffect(() => {
    if (!active || length <= 1) return;
    timerRef.current = setInterval(
      () => setIndex((i) => (i + 1) % length),
      intervalMs
    );
    return () => clearInterval(timerRef.current);
  }, [active, length, intervalMs]);

  return { index, reset };
}

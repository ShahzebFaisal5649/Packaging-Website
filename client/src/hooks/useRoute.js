import { useState, useEffect } from 'react';

function getLocation() {
  return {
    path: window.location.pathname,
    search: window.location.search,
    params: new URLSearchParams(window.location.search),
  };
}

export function useRoute() {
  const [loc, setLoc] = useState(getLocation);

  useEffect(() => {
    const handler = () => setLoc(getLocation());
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, []);

  return loc;
}

export function navigate(href) {
  window.history.pushState({}, '', href);
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo({ top: 0, behavior: 'instant' });
}

import { useEffect } from 'react';

/**
 * Tawk.to Live Chat Integration
 * Property ID: 69f748e548ca411c3004e297
 * Widget ID:   1jnmv9gk6
 */

const TAWK_PROPERTY_ID = import.meta.env.VITE_TAWK_PROPERTY_ID || '69f748e548ca411c3004e297';
const TAWK_WIDGET_ID   = import.meta.env.VITE_TAWK_WIDGET_ID   || '1jnmv9gk6';

export default function LiveChat() {
  useEffect(() => {
    // Prevent double-loading
    if (document.getElementById('tawk-script')) return;

    window.Tawk_API  = window.Tawk_API  || {};
    window.Tawk_LoadTime = new Date();

    // Customise widget on load
    window.Tawk_API.onLoad = function () {
      if (window.Tawk_API.setAttributes) {
        window.Tawk_API.setAttributes({
          'name'  : 'Design Custom Box Visitor',
          'email' : '',
        }, function () {});
      }
    };

    const s1 = document.createElement('script');
    s1.id        = 'tawk-script';
    s1.async     = true;
    s1.src       = `https://embed.tawk.to/${TAWK_PROPERTY_ID}/${TAWK_WIDGET_ID}`;
    s1.charset   = 'UTF-8';
    s1.setAttribute('crossorigin', '*');

    // Append right before </body>
    document.body.appendChild(s1);

    return () => {
      // Clean up on hot-reload (dev only)
      const el = document.getElementById('tawk-script');
      if (el) el.remove();
      // Reset Tawk state so it re-inits properly on next mount
      delete window.Tawk_API;
      delete window.Tawk_LoadTime;
    };
  }, []);

  // Tawk renders its own widget — nothing to render here
  return null;
}

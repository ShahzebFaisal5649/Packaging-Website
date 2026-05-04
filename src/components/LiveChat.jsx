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
    // Only inject once per page load — check if script already exists
    if (window.Tawk_API && window.Tawk_API.isChatVisible !== undefined) return;
    if (document.getElementById('tawk-script')) return;

    window.Tawk_API  = window.Tawk_API  || {};
    window.Tawk_LoadTime = new Date();

    // Customise widget on load
    window.Tawk_API.onLoad = function () {
      if (window.Tawk_API.setAttributes) {
        window.Tawk_API.setAttributes({
          name: 'Design Custom Box Visitor',
          email: '',
        }, function () {});
      }
    };

    const s1 = document.createElement('script');
    s1.id        = 'tawk-script';
    s1.async     = true;
    s1.src       = `https://embed.tawk.to/${TAWK_PROPERTY_ID}/${TAWK_WIDGET_ID}`;
    s1.charset   = 'UTF-8';
    s1.setAttribute('crossorigin', '*');

    document.body.appendChild(s1);

    // Note: We intentionally do NOT clean up the tawk script on unmount,
    // because tawk.to attaches a global widget that should persist across
    // React route changes. Cleaning it up would break the widget.
  }, []);

  // Tawk renders its own widget — nothing to render here
  return null;
}

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          blue:   '#1B3F6A',
          navy:   '#152f52',
          orange: '#F47920',
          'orange-dark': '#d96510',
          light:  '#EEF4FB',
          gray:   '#F5F7FA',
          dark:   '#1A1A2E',
          muted:  '#6B7280',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-announcement': 'fadeAnnouncement 12s infinite',
        'fade-in':  'fadeIn 0.35s ease-out',
        'slide-in': 'slideIn 0.25s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
      },
      keyframes: {
        fadeAnnouncement: {
          '0%, 28%':   { opacity: 1 },
          '33%':       { opacity: 0 },
          '36%, 61%':  { opacity: 1 },
          '66%':       { opacity: 0 },
          '69%, 94%':  { opacity: 1 },
          '99%, 100%': { opacity: 0 },
        },
        fadeIn: {
          from: { opacity: 0 },
          to:   { opacity: 1 },
        },
        slideIn: {
          from: { opacity: 0, transform: 'translateY(-6px)' },
          to:   { opacity: 1, transform: 'translateY(0)' },
        },
        slideDown: {
          from: { opacity: 0, transform: 'translateY(-12px)' },
          to:   { opacity: 1, transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        card: '0 2px 12px rgba(27,63,106,0.08)',
        'card-hover': '0 8px 28px rgba(27,63,106,0.16)',
      },
    },
  },
  plugins: [],
};

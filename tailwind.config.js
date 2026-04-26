/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#0A2E20', // Forest Green
          accent: '#C88A4A',  // Warm Copper/Gold
          bg: '#FAFAFA',      // Off-white Warm Gray
          surface: '#FFFFFF', // Pure White for cards
          textPrimary: '#1A1A1A',
          textSecondary: '#666666',
          success: '#8A9A8A', // Muted Sage
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1200px',
      },
      spacing: {
        // Enforcing 8px grid spacing explicitly although tailwind does this by default
        'base': '8px',
        '2base': '16px',
        '3base': '24px',
        '4base': '32px',
        '6base': '48px',
        '8base': '64px',
        '10base': '80px',
        '12base': '96px',
      },
      borderRadius: {
        'card': '8px',
        'button': '6px',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(10, 46, 32, 0.05)',
        'card-hover': '0 8px 24px rgba(10, 46, 32, 0.1)',
        'dropdown': '0 10px 40px rgba(0, 0, 0, 0.08)',
      },
      transitionProperty: {
        'card': 'transform, box-shadow, border-color',
        'button': 'background-color, border-color, color, transform',
      },
      transitionDuration: {
        'fast': '150ms',
        'smooth': '200ms',
      },
    },
  },
  plugins: [],
};

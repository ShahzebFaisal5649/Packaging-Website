/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#1A4D2E',
          accent: '#C8860A',
          bg: '#F5F2ED',
          surface: '#FFFFFF',
          footer: '#0F2E1A',
          textPrimary: '#1A1A1A',
          textSecondary: '#666666',
          success: '#8A9A8A',
          navy: '#1A4D2E',
          teal: '#C8860A',
          coral: '#E09515',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"DM Mono"', 'ui-monospace', 'monospace'],
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1200px',
      },
      spacing: {
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
        'card': '16px',
        'button': '8px',
      },
      boxShadow: {
        'card': '0 2px 4px rgba(15,46,26,0.06), 0 8px 24px rgba(15,46,26,0.08)',
        'card-hover': '0 12px 40px rgba(15,46,26,0.14)',
        'dropdown': '0 10px 40px rgba(0, 0, 0, 0.08)',
        'form': '0 4px 6px rgba(15,46,26,0.06), 0 20px 60px rgba(15,46,26,0.10)',
      },
      transitionProperty: {
        'card': 'transform, box-shadow, border-color',
        'button': 'background-color, border-color, color, transform, box-shadow',
      },
      transitionDuration: {
        'fast': '150ms',
        'smooth': '200ms',
      },
      transitionTimingFunction: {
        'premium': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
      }
    },
  },
  plugins: [],
};

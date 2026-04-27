/**
 * NovaPack Premium Design System
 * Luxury dark theme with teal accents inspired by the logo
 */

export const theme = {
  colors: {
    // Primary Colors (Teal/Cyan accents inspired by logo)
    primary: '#14b8a6',      // Vibrant teal
    primaryLight: '#2dd4bf', // Bright teal
    primaryDark: '#0d9488',  // Deep teal
    
    // Background & Neutrals (Matte blacks, charcoals, deep greys)
    bg: {
      primary: '#0a0e27',    // Deep navy-black
      secondary: '#0f1429',  // Slightly lighter
      tertiary: '#1a1f3a',   // Charcoal
      hover: '#242d4a',      // Hover state
    },
    
    // Text Colors
    text: {
      primary: '#f5f7fa',    // Almost white (high contrast)
      secondary: '#cbd5e1',  // Light grey-blue
      muted: '#94a3b8',      // Muted for secondary info
      disabled: '#475569',   // Disabled state
    },
    
    // Accents & Status
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
    
    // Glass & Transparency
    glass: {
      light: 'rgba(20, 184, 166, 0.1)',
      medium: 'rgba(20, 184, 166, 0.15)',
      dark: 'rgba(20, 184, 166, 0.2)',
    },
    
    // Borders
    border: {
      light: 'rgba(255, 255, 255, 0.08)',
      medium: 'rgba(255, 255, 255, 0.15)',
      strong: 'rgba(255, 255, 255, 0.25)',
    },
  },
  
  typography: {
    // Font families (imported from Google Fonts)
    fontFamily: {
      display: "'Poppins', sans-serif",          // Headings - modern, distinctive
      body: "'Inter', sans-serif",               // Body text - clean, readable
      mono: "'JetBrains Mono', monospace",       // Code/technical text
    },
    
    // Font sizes
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem',    // 48px
      '6xl': '3.75rem', // 60px
    },
    
    // Font weights
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    
    // Line heights
    lineHeight: {
      tight: 1.1,
      snug: 1.25,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    },
    
    // Letter spacing
    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0em',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em',
    },
  },
  
  spacing: {
    // 4px base unit
    xs: '0.25rem',  // 4px
    sm: '0.5rem',   // 8px
    md: '1rem',     // 16px
    lg: '1.5rem',   // 24px
    xl: '2rem',     // 32px
    '2xl': '3rem',  // 48px
    '3xl': '4rem',  // 64px
    '4xl': '6rem',  // 96px
  },
  
  radius: {
    sm: '6px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    '2xl': '24px',
    full: '9999px',
  },
  
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 12px rgba(0, 0, 0, 0.15)',
    lg: '0 10px 32px rgba(0, 0, 0, 0.25)',
    xl: '0 20px 48px rgba(0, 0, 0, 0.35)',
    
    // Glow effects (teal accent)
    glow: {
      sm: '0 0 12px rgba(20, 184, 166, 0.2)',
      md: '0 0 20px rgba(20, 184, 166, 0.3)',
      lg: '0 0 32px rgba(20, 184, 166, 0.4)',
    },
  },
  
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    slowest: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
  
  breakpoints: {
    xs: '320px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  
  zIndex: {
    hide: '-1',
    auto: 'auto',
    base: '0',
    dropdown: '100',
    sticky: '500',
    fixed: '600',
    modal: '1000',
    popover: '1100',
    tooltip: '1200',
  },
};

export default theme;

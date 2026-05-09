import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({ 
  children, 
  loading = false, 
  disabled = false, 
  onClick, 
  type = 'button', 
  variant = 'primary', // primary, secondary, outline, danger
  size = 'md', // sm, md, lg
  style = {},
  icon: Icon,
  className = '',
  ...props 
}) => {
  const G = '#1A4D2E';
  const ACCENT = '#C8860A';

  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 10,
    fontWeight: 700,
    cursor: (disabled || loading) ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    border: 'none',
    outline: 'none',
    fontFamily: 'Inter, sans-serif',
    opacity: (disabled || loading) ? 0.6 : 1,
    position: 'relative',
    ...style
  };

  const variants = {
    primary: {
      backgroundColor: G,
      color: '#fff',
      boxShadow: '0 4px 12px rgba(26, 77, 46, 0.15)',
    },
    secondary: {
      backgroundColor: ACCENT,
      color: '#fff',
      boxShadow: '0 4px 12px rgba(200, 134, 10, 0.15)',
    },
    outline: {
      backgroundColor: 'transparent',
      border: `1.5px solid ${G}`,
      color: G,
    },
    danger: {
      backgroundColor: '#DC2626',
      color: '#fff',
      boxShadow: '0 4px 12px rgba(220, 38, 38, 0.15)',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: '#6B7280',
    }
  };

  const sizes = {
    sm: { padding: '8px 16px', fontSize: 12 },
    md: { padding: '12px 24px', fontSize: 14 },
    lg: { padding: '14px 32px', fontSize: 16 }
  };

  const currentStyle = {
    ...baseStyle,
    ...variants[variant],
    ...sizes[size]
  };

  const handleMouseEnter = (e) => {
    if (!disabled && !loading) {
      if (variant === 'primary') e.currentTarget.style.backgroundColor = '#143c24';
      if (variant === 'secondary') e.currentTarget.style.backgroundColor = '#b07509';
      if (variant === 'outline') e.currentTarget.style.backgroundColor = 'rgba(26, 77, 46, 0.05)';
      if (variant === 'danger') e.currentTarget.style.backgroundColor = '#b91c1c';
      e.currentTarget.style.transform = 'translateY(-1px)';
    }
  };

  const handleMouseLeave = (e) => {
    if (!disabled && !loading) {
      e.currentTarget.style.backgroundColor = variants[variant].backgroundColor;
      e.currentTarget.style.transform = 'translateY(0)';
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={currentStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={className}
      {...props}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {!loading && Icon && <Icon size={16} />}
      <span>{children}</span>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}} />
    </button>
  );
};

export default Button;

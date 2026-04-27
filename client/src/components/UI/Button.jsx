import React from 'react';
import { motion } from 'framer-motion';
import styles from './Button.module.css';

/**
 * Premium Button Component
 * Variants: primary (teal accent), secondary (ghost), danger (error)
 * Sizes: sm, md (default), lg
 */
export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  return (
    <motion.button
      className={`${styles.button} ${styles[`variant-${variant}`]} ${styles[`size-${size}`]} ${fullWidth ? styles.fullWidth : ''} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      type={type}
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      {...props}
    >
      {loading ? (
        <span className={styles.spinner}>⋯</span>
      ) : (
        children
      )}
    </motion.button>
  );
};

export default Button;

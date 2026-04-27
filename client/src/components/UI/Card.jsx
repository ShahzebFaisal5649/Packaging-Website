import React from 'react';
import { motion } from 'framer-motion';
import styles from './Card.module.css';

/**
 * Premium Card Component
 * Variants: default, glass, elevated, outline
 */
export const Card = ({
  children,
  variant = 'default',
  className = '',
  hover = true,
  onClick,
  ...props
}) => {
  const cardClass = `${styles.card} ${styles[`variant-${variant}`]} ${className}`;

  if (hover) {
    return (
      <motion.div
        className={cardClass}
        onClick={onClick}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={cardClass} onClick={onClick} {...props}>
      {children}
    </div>
  );
};

export default Card;

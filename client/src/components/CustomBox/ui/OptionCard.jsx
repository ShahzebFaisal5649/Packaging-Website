import { motion, AnimatePresence } from 'framer-motion';
import styles from './OptionCard.module.css';

const BADGE_ICONS = {
  'Eco':     '♻',
  'Eco+':    '♻',
  'Strong':  '⬡',
  'Premium': '◈',
  'Vivid':   '◉',
  'Quality': '◈',
  'Low Min': '↓',
};

export default function OptionCard({
  option,
  isSelected,
  onSelect,
  badge,
  badgeColor = 'primary',
}) {
  const badgeIcon = badge ? (BADGE_ICONS[badge] || '•') : null;

  return (
    <motion.div
      className={`${styles.card} ${isSelected ? styles.selected : ''}`}
      onClick={onSelect}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Selected checkmark */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            className={styles.checkmark}
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            ✓
          </motion.div>
        )}
      </AnimatePresence>

      {/* Badge */}
      {badge && (
        <span className={`${styles.badge} ${styles[`badge-${badgeColor}`] || styles.badgePrimary}`}>
          {badgeIcon} {badge}
        </span>
      )}

      {/* Icon area */}
      <div className={styles.iconArea}>
        <div className={styles.cardIconBg}>
          <span className={styles.cardIcon}>{option.icon || '📦'}</span>
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>
        <h4 className={styles.cardName}>{option.name}</h4>
        {option.description && (
          <p className={styles.cardDesc}>{option.description}</p>
        )}

        <div className={styles.cardFooter}>
          {option.basePrice != null && (
            <span className={styles.cardPrice}>
              ${option.basePrice}/unit
            </span>
          )}
          {option.priceModifier != null && option.priceModifier !== 1 && (
            <span className={styles.cardPrice}>
              +{((option.priceModifier - 1) * 100).toFixed(0)}%
            </span>
          )}
          {option.thickness && (
            <span className={styles.cardDetail}>{option.thickness}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

import { motion, AnimatePresence } from 'framer-motion';
import { getPriceBreakdown } from '../../utils/calculatePrice.js';
import styles from './PriceSummary.module.css';

export default function PriceSummary({ config }) {
  const breakdown = getPriceBreakdown(config);
  const isComplete = config.boxType && config.material && config.finish;

  const handleGetQuote = () => {
    if (isComplete) {
      window.location.href = '/checkout';
    }
  };

  const handleSaveDesign = () => {
    const name = window.prompt('Name your design:');
    if (name) {
      const saved = {
        name,
        config,
        createdAt: new Date().toISOString(),
      };
      const key = `custombox_design_${Date.now()}`;
      try {
        localStorage.setItem(key, JSON.stringify(saved));
        window.alert(`Design "${name}" saved!`);
      } catch {
        window.alert('Could not save design.');
      }
    }
  };

  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.headerIcon}>💰</div>
          <h3 className={styles.headerTitle}>Price Estimate</h3>
        </div>
        <AnimatePresence>
          {breakdown.discountPercent > 0 && (
            <motion.span
              className={styles.discountBadge}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              Save {breakdown.discountPercent}%
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Breakdown */}
      <div className={styles.breakdown}>
        <div className={styles.row}>
          <span className={styles.rowLabel}>Unit price</span>
          <span className={styles.rowAmount}>
            ${breakdown.unitPrice > 0 ? breakdown.unitPrice.toFixed(3) : '—'}
          </span>
        </div>
        <div className={styles.row}>
          <span className={styles.rowLabel}>
            Material cost ({config.quantity} units)
          </span>
          <span className={styles.rowAmount}>
            {breakdown.materialCost > 0 ? `$${breakdown.materialCost.toFixed(2)}` : '—'}
          </span>
        </div>

        <AnimatePresence>
          {breakdown.discountAmount > 0 && (
            <motion.div
              className={`${styles.row} ${styles.rowSavings}`}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <span className={styles.rowLabel}>Quantity discount</span>
              <span className={styles.rowAmount}>-${breakdown.discountAmount.toFixed(2)}</span>
            </motion.div>
          )}
          {breakdown.artworkFee > 0 && (
            <motion.div
              className={styles.row}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <span className={styles.rowLabel}>Artwork setup fee</span>
              <span className={styles.rowAmount}>${breakdown.artworkFee.toFixed(2)}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className={styles.divider} />
        <div className={styles.row}>
          <span className={styles.rowLabel}>Subtotal</span>
          <span className={styles.rowAmount}>
            {breakdown.subtotal > 0 ? `$${breakdown.subtotal.toFixed(2)}` : '—'}
          </span>
        </div>
        <div className={styles.row}>
          <span className={styles.rowLabel}>Tax (10%)</span>
          <span className={styles.rowAmount}>
            {breakdown.tax > 0 ? `$${breakdown.tax.toFixed(2)}` : '—'}
          </span>
        </div>
      </div>

      {/* Total */}
      <AnimatePresence mode="wait">
        {isComplete ? (
          <motion.div
            key="total"
            className={styles.totalBlock}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div>
              <div className={styles.totalLabel}>Total Estimate</div>
              <div className={styles.totalSub}>inc. tax &amp; fees</div>
            </div>
            <motion.div
              key={breakdown.total}
              className={styles.totalAmount}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            >
              ${breakdown.total.toFixed(2)}
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="placeholder"
            className={styles.placeholder}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className={styles.placeholderText}>
              Complete steps 1–4 to unlock your instant price estimate
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Unit price footer */}
      {isComplete && breakdown.unitPrice > 0 && (
        <div className={styles.unitFooter}>
          <p className={styles.unitFooterText}>Per unit:</p>
          <p className={styles.unitFooterPrice}>${breakdown.unitPrice.toFixed(3)}</p>
        </div>
      )}

      {/* CTA Buttons */}
      <div className={styles.actions}>
        <motion.button
          className={styles.btnGetQuote}
          onClick={handleGetQuote}
          disabled={!isComplete}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
        >
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <path d="M7.5 1v13M1 7.5h13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Get Instant Quote
        </motion.button>

        <motion.button
          className={styles.btnSave}
          onClick={handleSaveDesign}
          disabled={!isComplete}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M11 1H3a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2V4l-2-3z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
            <path d="M10 1v4H4V1M4 8h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          Save Design
        </motion.button>
      </div>
    </motion.div>
  );
}

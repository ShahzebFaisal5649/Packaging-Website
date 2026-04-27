import { motion } from 'framer-motion';
import { BOX_TYPES, MATERIALS, FINISHES, COLOR_OPTIONS } from '../../../data/boxOptions.js';
import { getPriceBreakdown } from '../../../utils/calculatePrice.js';
import styles from './Step.module.css';

export default function Step6_Review({ config }) {
  const breakdown = getPriceBreakdown(config);
  const boxType   = BOX_TYPES.find(b => b.id === config.boxType);
  const material  = MATERIALS.find(m => m.id === config.material);
  const finish    = FINISHES.find(f => f.id === config.finish);
  const primary   = COLOR_OPTIONS.find(c => c.hex === config.colors.primary);
  const accent    = COLOR_OPTIONS.find(c => c.hex === config.colors.accent);

  const isComplete = config.boxType && config.material && config.finish;

  const handleGetQuote = () => {
    window.location.href = '/checkout';
  };

  const handleContinueShopping = () => {
    window.location.href = '/categories';
  };

  const specs = [
    { label: 'Box Type',    value: boxType?.name },
    { label: 'Dimensions',  value: `${config.dimensions.length} × ${config.dimensions.width} × ${config.dimensions.height} ${config.dimensions.unit}` },
    { label: 'Quantity',    value: `${config.quantity.toLocaleString()} units` },
    { label: 'Material',    value: material?.name },
    { label: 'Finish',      value: finish?.name },
    { label: 'Primary',     value: primary?.name },
    { label: 'Accent',      value: accent?.name },
    { label: 'Artwork',     value: config.artwork ? config.artwork.name : 'Not uploaded' },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.stepHeader}>
        <div className={styles.stepLabel}>
          <span className={styles.stepLabelIcon}>06</span>
          Final Review
        </div>
        <h2 className={styles.stepTitle}>Review & Get Quote</h2>
        <p className={styles.stepSub}>
          Confirm your configuration and request an instant quote or continue customizing.
        </p>
      </div>

      {/* Configuration Summary */}
      <motion.div
        className={styles.reviewSection}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <p className={styles.reviewSectionTitle}>Box Configuration</p>
        <div className={styles.reviewGrid}>
          {specs.map((item) => (
            <div key={item.label} className={styles.reviewItem}>
              <p className={styles.reviewLabel}>{item.label}</p>
              <p className={styles.reviewValue}>{item.value || '—'}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Price Breakdown */}
      {isComplete && (
        <motion.div
          className={styles.reviewSection}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <p className={styles.reviewSectionTitle}>Price Breakdown</p>
          <div className={styles.priceList}>
            <div className={styles.priceRow}>
              <span className={styles.priceRowLabel}>Unit price</span>
              <span className={styles.priceRowAmount}>${breakdown.unitPrice.toFixed(3)}</span>
            </div>
            <div className={styles.priceRow}>
              <span className={styles.priceRowLabel}>Material cost ({config.quantity}×)</span>
              <span className={styles.priceRowAmount}>${breakdown.materialCost.toFixed(2)}</span>
            </div>
            {breakdown.discountAmount > 0 && (
              <div className={`${styles.priceRow} ${styles.priceRowGreen}`}>
                <span className={styles.priceRowLabel}>Quantity discount ({breakdown.discountPercent}%)</span>
                <span className={styles.priceRowAmount}>-${breakdown.discountAmount.toFixed(2)}</span>
              </div>
            )}
            {breakdown.artworkFee > 0 && (
              <div className={styles.priceRow}>
                <span className={styles.priceRowLabel}>Artwork setup fee</span>
                <span className={styles.priceRowAmount}>${breakdown.artworkFee.toFixed(2)}</span>
              </div>
            )}
            <div className={styles.priceDivider} />
            <div className={styles.priceRow}>
              <span className={styles.priceRowLabel}>Subtotal</span>
              <span className={styles.priceRowAmount}>${breakdown.subtotal.toFixed(2)}</span>
            </div>
            <div className={styles.priceRow}>
              <span className={styles.priceRowLabel}>Tax (10%)</span>
              <span className={styles.priceRowAmount}>${breakdown.tax.toFixed(2)}</span>
            </div>
            <div className={styles.priceDivider} />
            <div className={`${styles.priceRow} ${styles.priceRowTotal}`}>
              <span className={styles.priceRowLabel}>Total</span>
              <span className={styles.priceRowAmount}>${breakdown.total.toFixed(2)}</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Actions */}
      <motion.div
        className={styles.reviewActions}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <motion.button
          className={styles.btnPrimary}
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
          className={styles.btnSecondary}
          onClick={handleContinueShopping}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Continue Shopping
        </motion.button>

        <p className={styles.termsLine}>
          By requesting a quote you agree to our terms. Pricing is an estimate and may vary.
        </p>
      </motion.div>
    </div>
  );
}

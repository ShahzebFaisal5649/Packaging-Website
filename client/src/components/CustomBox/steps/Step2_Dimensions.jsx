import { motion } from 'framer-motion';
import DimensionInput from '../ui/DimensionInput.jsx';
import styles from './Step.module.css';

const DISCOUNT_TIERS = [
  { min: 1000, pct: 15, label: 'Bulk discount unlocked — 15% off' },
  { min: 500,  pct: 10, label: 'Volume savings — 10% off' },
  { min: 250,  pct: 5,  label: 'Savings tier — 5% off' },
];

export default function Step2_Dimensions({ config, updateConfig }) {
  const { dimensions } = config;

  const handleDim = (key, val) => {
    updateConfig('dimensions', { ...dimensions, [key]: val });
  };

  const handleUnit = (unit) => {
    updateConfig('dimensions', { ...dimensions, unit });
  };

  const volume = (dimensions.length * dimensions.width * dimensions.height).toFixed(1);
  const surfaceArea = (2 * (
    dimensions.length * dimensions.width +
    dimensions.width * dimensions.height +
    dimensions.height * dimensions.length
  )).toFixed(1);

  const discount = DISCOUNT_TIERS.find(t => config.quantity >= t.min);

  return (
    <div className={styles.container}>
      <div className={styles.stepHeader}>
        <div className={styles.stepLabel}>
          <span className={styles.stepLabelIcon}>02</span>
          Size & Quantity
        </div>
        <h2 className={styles.stepTitle}>Dimensions & Order Qty</h2>
        <p className={styles.stepSub}>
          Enter your exact box measurements. Larger orders unlock better per-unit pricing.
        </p>
      </div>

      {/* Dimensions */}
      <div className={styles.formGroup}>
        <p className={styles.groupLabel}>Box Dimensions</p>
        <div className={styles.dimRow}>
          <DimensionInput
            label="Length"
            value={dimensions.length}
            onChange={(v) => handleDim('length', v)}
            unit={dimensions.unit}
            onUnitChange={handleUnit}
          />
          <DimensionInput
            label="Width"
            value={dimensions.width}
            onChange={(v) => handleDim('width', v)}
          />
          <DimensionInput
            label="Height"
            value={dimensions.height}
            onChange={(v) => handleDim('height', v)}
          />
        </div>
      </div>

      {/* Stats */}
      <motion.div
        className={styles.statStrip}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Volume</span>
          <span className={styles.statValue}>{volume}</span>
          <span className={styles.statUnit}>{dimensions.unit}³</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Surface</span>
          <span className={styles.statValue}>{surfaceArea}</span>
          <span className={styles.statUnit}>{dimensions.unit}²</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Unit</span>
          <span className={styles.statValue}>{dimensions.unit}</span>
          <span className={styles.statUnit}>measure</span>
        </div>
      </motion.div>

      {/* Quantity */}
      <div className={styles.formGroup}>
        <p className={styles.groupLabel}>Order Quantity</p>
        <div className={styles.quantityRow}>
          <input
            type="range"
            min="50"
            max="10000"
            step="50"
            value={config.quantity}
            onChange={(e) => updateConfig('quantity', parseInt(e.target.value))}
            className={styles.slider}
          />
          <input
            type="number"
            value={config.quantity}
            onChange={(e) => updateConfig('quantity', Math.max(50, parseInt(e.target.value) || 50))}
            min="50"
            max="100000"
            className={styles.qtyInput}
          />
        </div>

        {discount ? (
          <motion.div
            className={styles.discountPill}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {discount.label}
          </motion.div>
        ) : (
          <p style={{ fontSize: '0.75rem', color: 'var(--cb-text-3)', margin: 0 }}>
            Order 250+ units for volume pricing — up to 15% savings
          </p>
        )}
      </div>
    </div>
  );
}

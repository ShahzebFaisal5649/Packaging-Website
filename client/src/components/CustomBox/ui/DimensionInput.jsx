import { motion } from 'framer-motion';
import styles from './DimensionInput.module.css';

export default function DimensionInput({
  label,
  value,
  onChange,
  unit,
  onUnitChange,
  min = 0.1,
  max = 999,
  step = 0.5,
  error,
}) {
  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <label className={styles.label}>{label}</label>
      <div className={styles.inputRow}>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          min={min}
          max={max}
          step={step}
          className={`${styles.input} ${error ? styles.hasError : ''}`}
          aria-label={label}
        />
        {onUnitChange && (
          <select
            value={unit}
            onChange={(e) => onUnitChange(e.target.value)}
            className={styles.unitSelect}
            aria-label="Unit"
          >
            <option value="cm">cm</option>
            <option value="mm">mm</option>
            <option value="in">in</option>
          </select>
        )}
      </div>
      {error && <p className={styles.errorText}>{error}</p>}
    </motion.div>
  );
}

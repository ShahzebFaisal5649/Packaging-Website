import { motion, AnimatePresence } from 'framer-motion';
import { FINISHES, COLOR_OPTIONS } from '../../../data/boxOptions.js';
import styles from './Step.module.css';

export default function Step4_DesignColors({ config, updateConfig }) {
  const setPrimary = (hex) => updateConfig('colors', { ...config.colors, primary: hex });
  const setAccent  = (hex) => updateConfig('colors', { ...config.colors, accent: hex });
  const setFinish  = (id)  => updateConfig('finish', id);

  const primaryColor = COLOR_OPTIONS.find(c => c.hex === config.colors.primary);
  const accentColor  = COLOR_OPTIONS.find(c => c.hex === config.colors.accent);
  const selectedFinish = FINISHES.find(f => f.id === config.finish);

  return (
    <div className={styles.container}>
      <div className={styles.stepHeader}>
        <div className={styles.stepLabel}>
          <span className={styles.stepLabelIcon}>04</span>
          Design
        </div>
        <h2 className={styles.stepTitle}>Colors & Finish</h2>
        <p className={styles.stepSub}>
          Define your brand palette and surface treatment for a signature look.
        </p>
      </div>

      {/* Primary Color */}
      <div className={styles.formGroup}>
        <p className={styles.groupLabel}>Primary Color</p>
        <div className={styles.colorGrid}>
          {COLOR_OPTIONS.map((color) => (
            <motion.button
              key={color.hex}
              className={`${styles.colorSwatch} ${config.colors.primary === color.hex ? styles.swatchSelected : ''}`}
              style={{ backgroundColor: color.hex }}
              onClick={() => setPrimary(color.hex)}
              whileHover={{ scale: 1.18 }}
              whileTap={{ scale: 0.9 }}
              title={color.name}
              aria-label={color.name}
            >
              <AnimatePresence>
                {config.colors.primary === color.hex && (
                  <motion.span
                    className={styles.swatchCheck}
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    ✓
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </div>
        {primaryColor && (
          <p className={styles.colorNameLabel}>
            Primary: <strong style={{ color: 'var(--cb-text-1)' }}>{primaryColor.name}</strong>
          </p>
        )}
      </div>

      {/* Accent Color */}
      <div className={styles.formGroup}>
        <p className={styles.groupLabel}>Accent Color</p>
        <div className={styles.colorGrid}>
          {COLOR_OPTIONS.filter(c => c.category === 'accent').map((color) => (
            <motion.button
              key={color.hex}
              className={`${styles.colorSwatch} ${config.colors.accent === color.hex ? styles.swatchSelected : ''}`}
              style={{ backgroundColor: color.hex }}
              onClick={() => setAccent(color.hex)}
              whileHover={{ scale: 1.18 }}
              whileTap={{ scale: 0.9 }}
              title={color.name}
              aria-label={color.name}
            >
              <AnimatePresence>
                {config.colors.accent === color.hex && (
                  <motion.span
                    className={styles.swatchCheck}
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    ✓
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </div>
        {accentColor && (
          <p className={styles.colorNameLabel}>
            Accent: <strong style={{ color: 'var(--cb-text-1)' }}>{accentColor.name}</strong>
          </p>
        )}
      </div>

      {/* Live color preview mini bar */}
      <motion.div
        style={{
          display: 'flex',
          gap: 0,
          borderRadius: 'var(--cb-r-md)',
          overflow: 'hidden',
          height: 40,
          border: '1px solid var(--cb-border)',
        }}
        layout
      >
        <motion.div
          style={{ flex: 3, background: config.colors.primary }}
          layout
          transition={{ duration: 0.4, ease: [0.22,1,0.36,1] }}
        />
        <motion.div
          style={{ flex: 1, background: config.colors.accent }}
          layout
          transition={{ duration: 0.4, ease: [0.22,1,0.36,1] }}
        />
      </motion.div>

      {/* Finish Type */}
      <div className={styles.formGroup}>
        <p className={styles.groupLabel}>Surface Finish</p>
        <div className={styles.finishGrid}>
          {FINISHES.map((finish, i) => (
            <motion.button
              key={finish.id}
              className={`${styles.finishCard} ${config.finish === finish.id ? styles.finishSelected : ''}`}
              onClick={() => setFinish(finish.id)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className={styles.finishName}>{finish.name}</div>
              <div className={styles.finishDesc}>{finish.description}</div>
              <div className={styles.finishPriceTag}>
                {finish.priceModifier > 1 ? `+${((finish.priceModifier - 1) * 100).toFixed(0)}%` : 'Base'}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedFinish && (
          <motion.div
            className={styles.selectionBanner}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className={styles.selectionIcon}>✓</div>
            <div>
              <p className={styles.selectionText}>{selectedFinish.name} finish selected</p>
              <p className={styles.selectionSub}>{selectedFinish.description}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { motion, AnimatePresence } from 'framer-motion';
import OptionCard from '../ui/OptionCard.jsx';
import { BOX_TYPES } from '../../../data/boxOptions.js';
import styles from './Step.module.css';

export default function Step1_BoxType({ config, updateConfig }) {
  const selected = BOX_TYPES.find(b => b.id === config.boxType);

  return (
    <div className={styles.container}>
      <div className={styles.stepHeader}>
        <div className={styles.stepLabel}>
          <span className={styles.stepLabelIcon}>01</span>
          Box Configuration
        </div>
        <h2 className={styles.stepTitle}>Select Your Box Style</h2>
        <p className={styles.stepSub}>
          Choose the packaging form factor that best suits your product and brand vision.
        </p>
      </div>

      <div className={styles.grid2}>
        {BOX_TYPES.map((boxType, i) => (
          <motion.div
            key={boxType.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <OptionCard
              option={boxType}
              isSelected={config.boxType === boxType.id}
              onSelect={() => updateConfig('boxType', boxType.id)}
              badge={boxType.minQuantity < 100 ? 'Low Min' : null}
              badgeColor={boxType.minQuantity < 100 ? 'success' : 'primary'}
            />
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            className={styles.selectionBanner}
            initial={{ opacity: 0, y: 10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className={styles.selectionIcon}>✓</div>
            <div>
              <p className={styles.selectionText}>{selected.name} selected</p>
              <p className={styles.selectionSub}>
                Base price ${selected.basePrice}/unit · Min qty {selected.minQuantity}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { motion, AnimatePresence } from 'framer-motion';
import OptionCard from '../ui/OptionCard.jsx';
import { MATERIALS } from '../../../data/boxOptions.js';
import styles from './Step.module.css';

export default function Step3_Material({ config, updateConfig }) {
  const selected = MATERIALS.find(m => m.id === config.material);

  return (
    <div className={styles.container}>
      <div className={styles.stepHeader}>
        <div className={styles.stepLabel}>
          <span className={styles.stepLabelIcon}>03</span>
          Material
        </div>
        <h2 className={styles.stepTitle}>Choose Your Material</h2>
        <p className={styles.stepSub}>
          Each material affects durability, print quality, and sustainability profile of your packaging.
        </p>
      </div>

      <div className={styles.grid2}>
        {MATERIALS.map((mat, i) => (
          <motion.div
            key={mat.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <OptionCard
              option={mat}
              isSelected={config.material === mat.id}
              onSelect={() => updateConfig('material', mat.id)}
              badge={mat.badge}
              badgeColor={mat.badgeColor}
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
                {selected.thickness} ·{' '}
                {selected.priceModifier > 1
                  ? `+${((selected.priceModifier - 1) * 100).toFixed(0)}% cost`
                  : 'standard cost'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

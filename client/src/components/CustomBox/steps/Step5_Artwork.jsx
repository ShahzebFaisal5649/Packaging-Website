import { motion, AnimatePresence } from 'framer-motion';
import FileUploader from '../ui/FileUploader.jsx';
import styles from './Step.module.css';

const PLACEMENTS = [
  { id: 'front',      label: 'Front Only',   icon: '▣' },
  { id: 'front-back', label: 'Front & Back',  icon: '⇔' },
  { id: 'all-faces',  label: 'All Faces',     icon: '⬡' },
];

export default function Step5_Artwork({ config, updateConfig }) {
  const handleUpload = (file) => updateConfig('artwork', file);
  const handlePlacement = (id) => updateConfig('artworkPlacement', id);

  return (
    <div className={styles.container}>
      <div className={styles.stepHeader}>
        <div className={styles.stepLabel}>
          <span className={styles.stepLabelIcon}>05</span>
          Artwork
        </div>
        <h2 className={styles.stepTitle}>Upload Your Design</h2>
        <p className={styles.stepSub}>
          Drop in your logo or print-ready artwork. PNG, JPG, PDF, AI, EPS accepted.
          <strong style={{ color: 'var(--cb-teal)', fontWeight: 600 }}> Optional</strong> — you can add artwork later.
        </p>
      </div>

      <FileUploader
        onUpload={handleUpload}
        currentFile={config.artwork}
      />

      <AnimatePresence>
        {config.artwork && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Placement selector */}
            <div className={styles.formGroup} style={{ marginTop: '16px' }}>
              <p className={styles.groupLabel}>Apply artwork to</p>
              <div className={styles.placementRow}>
                {PLACEMENTS.map((p) => (
                  <motion.button
                    key={p.id}
                    className={`${styles.placementBtn} ${config.artworkPlacement === p.id ? styles.placementSelected : ''}`}
                    onClick={() => handlePlacement(p.id)}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <span style={{ fontSize: '1rem' }}>{p.icon}</span>
                    <span className={styles.placementBtnLabel}>{p.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* File meta */}
            <div className={styles.artworkMeta} style={{ marginTop: '12px' }}>
              <div className={styles.artworkMetaItem}>
                <p className={styles.artworkMetaLabel}>File</p>
                <p className={styles.artworkMetaValue}>{config.artwork.name}</p>
              </div>
              <div className={styles.artworkMetaItem}>
                <p className={styles.artworkMetaLabel}>Size</p>
                <p className={styles.artworkMetaValue}>
                  {(config.artwork.size / 1024).toFixed(0)} KB
                </p>
              </div>
              <div className={styles.artworkMetaItem}>
                <p className={styles.artworkMetaLabel}>Placement</p>
                <p className={styles.artworkMetaValue}>
                  {PLACEMENTS.find(p => p.id === config.artworkPlacement)?.label || 'All Faces'}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!config.artwork && (
        <p className={styles.infoNote}>
          No artwork uploaded. Our design team can create custom artwork for your brand (additional fee applies). You can also proceed now and upload artwork before production.
        </p>
      )}
    </div>
  );
}

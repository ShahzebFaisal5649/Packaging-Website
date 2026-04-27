import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BOX_TYPES, MATERIALS, FINISHES } from '../../data/boxOptions.js';
import styles from './PreviewPanel.module.css';

/* ── helpers ── */
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}
function lighten(hex, amt) {
  const { r, g, b } = hexToRgb(hex);
  return `rgb(${Math.min(255,r+amt)},${Math.min(255,g+amt)},${Math.min(255,b+amt)})`;
}
function darken(hex, amt) {
  const { r, g, b } = hexToRgb(hex);
  return `rgb(${Math.max(0,r-amt)},${Math.max(0,g-amt)},${Math.max(0,b-amt)})`;
}

/* ── Isometric box SVG ── */
function BoxSVG({ config, view }) {
  const primary = config.colors.primary || '#0f172a';
  const accent  = config.colors.accent  || '#0cdbb8';
  const boxType = BOX_TYPES.find(b => b.id === config.boxType);
  const material = MATERIALS.find(m => m.id === config.material);
  const { length, width, height, unit } = config.dimensions;

  const topColor   = lighten(primary, 55);
  const frontColor = primary;
  const sideColor  = darken(primary, 38);

  const isReady = config.boxType;

  if (!isReady) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>📦</div>
        <p className={styles.emptyText}>Select a box type to see your preview</p>
      </div>
    );
  }

  if (view === 'flat') {
    return (
      <svg viewBox="0 0 400 280" aria-label="Box flat preview">
        <defs>
          <linearGradient id="flatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={topColor} />
            <stop offset="100%" stopColor={frontColor} />
          </linearGradient>
          <filter id="flatShadow">
            <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="rgba(0,0,0,0.5)" />
          </filter>
        </defs>

        {/* Main face */}
        <rect x="50" y="30" width="300" height="200" rx="10"
          fill="url(#flatGrad)" filter="url(#flatShadow)" />

        {/* Accent header stripe */}
        <rect x="50" y="30" width="300" height="44" rx="10"
          fill={accent} opacity="0.18" />
        <line x1="50" y1="74" x2="350" y2="74"
          stroke={accent} strokeWidth="1" strokeOpacity="0.3" />

        {/* Accent border */}
        <rect x="50" y="30" width="300" height="200" rx="10"
          fill="none" stroke={accent} strokeWidth="1.5" strokeOpacity="0.5" />

        {/* Artwork overlay */}
        {config.artwork && (
          <rect x="76" y="56" width="248" height="148" rx="6"
            fill="none" stroke={accent} strokeWidth="1.5" strokeDasharray="7,4" strokeOpacity="0.7" />
        )}

        {/* Center content */}
        <text x="200" y="118" textAnchor="middle"
          fontSize="30" fontWeight="800" fontFamily="Inter,sans-serif" fill={accent} opacity="0.9">
          {config.quantity}×
        </text>
        <text x="200" y="148" textAnchor="middle"
          fontSize="13" fontWeight="700" fontFamily="Inter,sans-serif"
          fill="rgba(255,255,255,0.7)">
          {boxType?.name || 'Custom Box'}
        </text>
        <text x="200" y="168" textAnchor="middle"
          fontSize="11" fontFamily="Inter,sans-serif" fill="rgba(255,255,255,0.4)">
          {length} × {width} × {height} {unit}
        </text>
        {material && (
          <text x="200" y="186" textAnchor="middle"
            fontSize="10" fontFamily="Inter,sans-serif" fill="rgba(255,255,255,0.3)">
            {material.name}
          </text>
        )}
      </svg>
    );
  }

  /* 3D Isometric */
  return (
    <svg viewBox="0 0 480 360" aria-label="Box 3D preview">
      <defs>
        <linearGradient id="topGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={topColor} stopOpacity="0.95" />
          <stop offset="100%" stopColor={lighten(primary, 30)} stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="frontGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={frontColor} stopOpacity="0.95" />
          <stop offset="100%" stopColor={darken(primary, 20)} stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id="sideGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={sideColor} stopOpacity="0.95" />
          <stop offset="100%" stopColor={darken(primary, 55)} stopOpacity="0.95" />
        </linearGradient>
        <filter id="boxDrop">
          <feDropShadow dx="0" dy="20" stdDeviation="20" floodColor="rgba(0,0,0,0.55)" />
        </filter>
      </defs>

      {/* Drop shadow */}
      <ellipse cx="240" cy="308" rx="130" ry="18"
        fill="rgba(0,0,0,0.35)" />

      {/* 3D Box group */}
      <g filter="url(#boxDrop)">
        {/* Top face */}
        <polygon
          points="240,70 364,143 240,216 116,143"
          fill="url(#topGrad)"
          stroke={accent} strokeWidth="0.8" strokeOpacity="0.4"
        />

        {/* Front-left face */}
        <polygon
          points="116,143 240,216 240,308 116,235"
          fill="url(#frontGrad)"
          stroke={accent} strokeWidth="0.8" strokeOpacity="0.35"
        />

        {/* Right face */}
        <polygon
          points="364,143 240,216 240,308 364,235"
          fill="url(#sideGrad)"
          stroke={accent} strokeWidth="0.8" strokeOpacity="0.3"
        />
      </g>

      {/* Edge highlight lines */}
      <line x1="240" y1="70" x2="240" y2="216" stroke={accent} strokeWidth="0.6" strokeOpacity="0.25" />
      <line x1="240" y1="216" x2="240" y2="308" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />

      {/* Top face: accent stripe */}
      <polygon
        points="240,70 364,143 240,216 116,143"
        fill={accent} fillOpacity="0.08"
      />

      {/* Artwork overlay on front face */}
      {config.artwork && (
        <polygon
          points="130,152 240,220 240,296 130,228"
          fill="none"
          stroke={accent} strokeWidth="1.5" strokeDasharray="7,4" strokeOpacity="0.65"
        />
      )}

      {/* Labels on top face */}
      <text x="240" y="148" textAnchor="middle"
        fontSize="22" fontWeight="800" fontFamily="Inter,sans-serif"
        fill={accent} opacity="0.9">
        {config.quantity}×
      </text>
      <text x="240" y="172" textAnchor="middle"
        fontSize="11" fontWeight="600" fontFamily="Inter,sans-serif"
        fill="rgba(255,255,255,0.65)">
        {boxType?.name}
      </text>

      {/* Dimension labels */}
      <text x="172" y="284" textAnchor="middle"
        fontSize="9" fontFamily="Inter,sans-serif" fill="rgba(255,255,255,0.35)"
        transform="skewY(-30) translate(0,0)">
        W {width}{unit}
      </text>
      <text x="310" y="284" textAnchor="middle"
        fontSize="9" fontFamily="Inter,sans-serif" fill="rgba(255,255,255,0.25)">
        D {length}{unit}
      </text>
      <text x="374" y="200" textAnchor="start"
        fontSize="9" fontFamily="Inter,sans-serif" fill="rgba(255,255,255,0.25)">
        H {height}{unit}
      </text>
    </svg>
  );
}

/* ── Main Component ── */
export default function PreviewPanel({ config }) {
  const [view, setView] = useState('3d');

  const boxType  = BOX_TYPES.find(b => b.id === config.boxType);
  const material = MATERIALS.find(m => m.id === config.material);
  const finish   = FINISHES.find(f => f.id === config.finish);

  const chips = useMemo(() => [
    { label: boxType?.name || 'No box type', empty: !config.boxType },
    { label: material?.name || 'No material', empty: !config.material },
    { label: finish?.name || 'No finish', empty: !config.finish },
    { label: `${config.quantity} units`, empty: false },
  ], [boxType, material, finish, config.quantity]);

  return (
    <motion.div
      className={styles.panel}
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.liveDot} />
          <h3 className={styles.headerTitle}>Live Preview</h3>
        </div>
        <div className={styles.controls}>
          <button
            className={`${styles.ctrlBtn} ${view === '3d' ? styles.ctrlActive : ''}`}
            onClick={() => setView('3d')}
            title="3D View"
          >
            3D
          </button>
          <button
            className={`${styles.ctrlBtn} ${view === 'flat' ? styles.ctrlActive : ''}`}
            onClick={() => setView('flat')}
            title="Flat View"
          >
            2D
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className={styles.canvas}>
        <AnimatePresence mode="wait">
          <motion.div
            key={`${view}-${config.boxType}-${config.colors.primary}-${config.colors.accent}-${config.quantity}`}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <BoxSVG config={config} view={view} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Config Chips */}
      <div className={styles.chips}>
        {chips.map((chip, i) => (
          <motion.span
            key={i}
            className={`${styles.chip} ${chip.empty ? styles.chipEmpty : ''}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            {!chip.empty && <span className={styles.chipDot} />}
            {chip.label}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}

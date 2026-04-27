import { motion, AnimatePresence } from 'framer-motion';
import styles from './Stepper.module.css';

const STEPS = [
  { number: 1, label: 'Box Type' },
  { number: 2, label: 'Dimensions' },
  { number: 3, label: 'Material' },
  { number: 4, label: 'Colors' },
  { number: 5, label: 'Artwork' },
  { number: 6, label: 'Review' },
];

export default function Stepper({ currentStep, totalSteps = 6, onStepClick }) {
  const progressPct = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className={styles.stepper}>
      {/* Step track with circles + connectors */}
      <div className={styles.track}>
        {STEPS.map((step, i) => {
          const isActive    = step.number === currentStep;
          const isCompleted = step.number < currentStep;
          const isPending   = step.number > currentStep;
          const stateClass  = isActive ? styles.active : isCompleted ? styles.completed : styles.pending;

          return (
            <div
              key={step.number}
              style={{ display: 'flex', alignItems: 'flex-start', flex: 1 }}
            >
              <motion.button
                className={`${styles.step} ${stateClass}`}
                onClick={() => isCompleted && onStepClick && onStepClick(step.number)}
                disabled={isPending}
                aria-label={`Step ${step.number}: ${step.label}`}
                aria-current={isActive ? 'step' : undefined}
                whileHover={isCompleted ? { scale: 1.08 } : undefined}
                whileTap={isCompleted ? { scale: 0.94 } : undefined}
              >
                <motion.div
                  className={styles.circle}
                  animate={
                    isActive
                      ? { boxShadow: '0 0 0 4px rgba(12,219,184,0.18), 0 0 14px rgba(12,219,184,0.3)' }
                      : { boxShadow: 'none' }
                  }
                  transition={{ duration: 0.3 }}
                >
                  <AnimatePresence mode="wait">
                    {isCompleted ? (
                      <motion.span
                        key="check"
                        className={styles.circleCheck}
                        initial={{ scale: 0, rotate: -90 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      >
                        ✓
                      </motion.span>
                    ) : (
                      <motion.span
                        key={`num-${step.number}`}
                        className={styles.circleNumber}
                        initial={{ scale: 0.6, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.6, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {step.number}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
                <span className={styles.label}>{step.label}</span>
              </motion.button>

              {/* Connector line between steps */}
              {i < STEPS.length - 1 && (
                <div className={styles.connector}>
                  <motion.div
                    className={styles.connectorFill}
                    initial={{ width: '0%' }}
                    animate={{ width: isCompleted ? '100%' : '0%' }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className={styles.progressBar}>
        <motion.div
          className={styles.progressFill}
          initial={{ width: '0%' }}
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../Navbar/Navbar.jsx';
import Stepper from './Stepper.jsx';
import PreviewPanel from './PreviewPanel.jsx';
import PriceSummary from './PriceSummary.jsx';
import { useCustomBox } from './hooks/useCustomBox.js';

import Step1_BoxType from './steps/Step1_BoxType.jsx';
import Step2_Dimensions from './steps/Step2_Dimensions.jsx';
import Step3_Material from './steps/Step3_Material.jsx';
import Step4_DesignColors from './steps/Step4_DesignColors.jsx';
import Step5_Artwork from './steps/Step5_Artwork.jsx';
import Step6_Review from './steps/Step6_Review.jsx';

import styles from './CustomBoxPage.module.css';
import './CustomBox.css';

const STEPS = [
  Step1_BoxType,
  Step2_Dimensions,
  Step3_Material,
  Step4_DesignColors,
  Step5_Artwork,
  Step6_Review,
];

const STEP_META = [
  { label: 'Box Type' },
  { label: 'Dimensions' },
  { label: 'Material' },
  { label: 'Colors' },
  { label: 'Artwork' },
  { label: 'Review' },
];

const slideVariants = {
  enter: (dir) => ({ opacity: 0, x: dir > 0 ? 32 : -32 }),
  center: { opacity: 1, x: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
  exit: (dir) => ({ opacity: 0, x: dir > 0 ? -32 : 32, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } }),
};

export default function CustomBoxPage() {
  const {
    config,
    updateConfig,
    currentStep,
    setCurrentStep,
    price,
    nextStep,
    prevStep,
  } = useCustomBox();

  const [direction, setDirection] = useState(1);
  const [mobileView, setMobileView] = useState('config'); // 'config' | 'preview'

  const CurrentStep = STEPS[currentStep - 1];

  const canProceed = () => {
    switch (currentStep) {
      case 1: return config.boxType !== null;
      case 2: return config.quantity >= 50 && config.dimensions.length > 0 && config.dimensions.width > 0 && config.dimensions.height > 0;
      case 3: return config.material !== null;
      case 4: return config.finish !== null;
      case 5: return true;
      case 6: return config.boxType && config.material && config.finish;
      default: return false;
    }
  };

  const handleNext = () => {
    setDirection(1);
    nextStep();
  };

  const handlePrev = () => {
    setDirection(-1);
    prevStep();
  };

  const handleStepClick = (stepNum) => {
    if (stepNum < currentStep) {
      setDirection(-1);
      setCurrentStep(stepNum);
    }
  };

  return (
    <div className={styles.page}>
      {/* Dark Navbar Wrapper */}
      <div className={styles.navWrapper}>
        <Navbar />
      </div>

      {/* Hero */}
      <motion.div
        className={styles.hero}
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className={styles.heroPill}>
          <span className={styles.heroPillDot} />
          Premium Packaging Studio
        </div>
        <h1 className={styles.heroTitle}>
          Build Your{' '}
          <span className={styles.heroTitleAccent}>Custom Box</span>
        </h1>
        <p className={styles.heroSub}>
          Configure packaging tailored to your brand — get a live preview and instant quote in minutes.
        </p>
        <div className={styles.heroDivider} />
      </motion.div>

      {/* Main Layout */}
      <div className={styles.layout}>
        {/* ── Left: Config Panel ── */}
        <motion.div
          className={`${styles.configPanel} ${mobileView === 'preview' ? '' : ''}`}
          style={{ display: mobileView === 'preview' ? 'none' : undefined }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Stepper */}
          <Stepper
            currentStep={currentStep}
            totalSteps={6}
            onStepClick={handleStepClick}
          />

          {/* Step Content */}
          <div className={styles.stepCard}>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentStep}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <CurrentStep config={config} updateConfig={updateConfig} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Step Navigation */}
          <div className={styles.stepNav}>
            <motion.button
              className={styles.btnPrev}
              onClick={handlePrev}
              disabled={currentStep === 1}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back
            </motion.button>

            <div className={styles.stepNavInfo}>
              <span className={styles.stepNavCount}>
                Step {currentStep} of 6
              </span>
              <span className={styles.stepNavLabel}>
                {STEP_META[currentStep - 1].label}
              </span>
            </div>

            {currentStep < 6 ? (
              <motion.button
                className={styles.btnNext}
                onClick={handleNext}
                disabled={!canProceed()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                Continue
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.button>
            ) : (
              <motion.a
                href="/categories"
                className={styles.btnNext}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                Shop More
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.a>
            )}
          </div>
        </motion.div>

        {/* ── Right: Preview + Price ── */}
        <motion.div
          className={styles.previewPanel}
          style={{ display: mobileView === 'config' ? undefined : undefined }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          <PreviewPanel config={config} />
          <PriceSummary config={config} />
        </motion.div>
      </div>

      {/* ── Mobile Tab Bar ── */}
      <div className={styles.mobileTabBar}>
        <button
          className={`${styles.mobileTabBtn} ${mobileView === 'config' ? styles.activeTab : ''}`}
          onClick={() => setMobileView('config')}
        >
          Configure
        </button>
        <button
          className={`${styles.mobileTabBtn} ${mobileView === 'preview' ? styles.activeTab : ''}`}
          onClick={() => setMobileView('preview')}
        >
          Preview & Price
        </button>
      </div>
    </div>
  );
}

/**
 * Custom hook for CustomBox state and logic
 * Wraps context usage with additional business logic
 */

import { useCustomBox as useContext } from '../../../context/CustomBoxContext.jsx';
import { calculatePrice, getPriceBreakdown, validateConfig } from '../../../utils/calculatePrice.js';

export const useCustomBox = () => {
  const context = useContext();

  const price = calculatePrice(context.config);
  const priceBreakdown = getPriceBreakdown(context.config);
  const validation = validateConfig(context.config);

  const nextStep = () => {
    if (context.currentStep < 6) {
      context.setCurrentStep(context.currentStep + 1);
    }
  };

  const prevStep = () => {
    if (context.currentStep > 1) {
      context.setCurrentStep(context.currentStep - 1);
    }
  };

  const goToStep = (step) => {
    if (step >= 1 && step <= 6) {
      context.setCurrentStep(step);
    }
  };

  return {
    ...context,
    price,
    priceBreakdown,
    validation,
    nextStep,
    prevStep,
    goToStep,
  };
};

import React, { createContext, useState, useCallback } from 'react';
import { DEFAULT_CONFIG } from '../data/boxOptions';

export const CustomBoxContext = createContext();

export const CustomBoxProvider = ({ children }) => {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [savedDesigns, setSavedDesigns] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);

  const updateConfig = useCallback((key, value) => {
    setConfig(prev => {
      if (typeof key === 'object') {
        return { ...prev, ...key };
      }
      return { ...prev, [key]: value };
    });
  }, []);

  const resetConfig = useCallback(() => {
    setConfig(DEFAULT_CONFIG);
    setCurrentStep(1);
  }, []);

  const saveDesign = useCallback((designName) => {
    const newDesign = {
      id: Date.now(),
      name: designName,
      config: { ...config },
      createdAt: new Date().toISOString(),
    };
    setSavedDesigns(prev => [...prev, newDesign]);
    return newDesign.id;
  }, [config]);

  const loadDesign = useCallback((designId) => {
    const design = savedDesigns.find(d => d.id === designId);
    if (design) {
      setConfig(design.config);
      setCurrentStep(1);
    }
  }, [savedDesigns]);

  const deleteDesign = useCallback((designId) => {
    setSavedDesigns(prev => prev.filter(d => d.id !== designId));
  }, []);

  const value = {
    config,
    updateConfig,
    resetConfig,
    currentStep,
    setCurrentStep,
    savedDesigns,
    saveDesign,
    loadDesign,
    deleteDesign,
  };

  return (
    <CustomBoxContext.Provider value={value}>
      {children}
    </CustomBoxContext.Provider>
  );
};

export const useCustomBox = () => {
  const context = React.useContext(CustomBoxContext);
  if (!context) {
    throw new Error('useCustomBox must be used within CustomBoxProvider');
  }
  return context;
};

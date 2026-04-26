/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
  const [activeModal, setActiveModal] = useState(null);
  const [modalData, setModalData] = useState(null);

  const openQuickView = (product) => {
    setModalData(product);
    setActiveModal('quickView');
  };

  const closeQuickView = () => {
    setActiveModal(null);
    setTimeout(() => setModalData(null), 300); // Clear data after animation
  };

  const openQuoteModal = () => setActiveModal('quote');
  const closeQuoteModal = () => setActiveModal(null);

  const closeModal = () => {
    setActiveModal(null);
    setTimeout(() => setModalData(null), 300);
  };

  return (
    <ModalContext.Provider value={{
      activeModal,
      modalData,
      openQuickView,
      closeQuickView,
      openQuoteModal,
      closeQuoteModal,
      closeModal
    }}>
      {children}
    </ModalContext.Provider>
  );
};

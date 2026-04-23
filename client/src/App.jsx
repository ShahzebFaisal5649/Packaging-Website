import React from 'react';
import { useRoute } from './hooks/useRoute';
import { CategoriesProvider } from './context/CategoriesContext';
import HomePage from './pages/HomePage';
import CategoriesPage from './pages/CategoriesPage';
import BoxDesignPage from './pages/BoxDesignPage';
import HowItWorksPage from './pages/HowItWorksPage';
import ContestsPage from './pages/ContestsPage';

export default function App() {
  const { path } = useRoute();

  if (path === '/categories') {
    return (
      <CategoriesProvider>
        <CategoriesPage />
      </CategoriesProvider>
    );
  }

  if (path === '/box-design') {
    return <BoxDesignPage />;
  }

  if (path === '/how-it-works') {
    return <HowItWorksPage />;
  }

  if (path === '/contests') {
    return <ContestsPage />;
  }

  // All other paths fall back to HomePage
  return <HomePage />;
}

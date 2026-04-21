import React from 'react';
import { useRoute } from './hooks/useRoute';
import { CategoriesProvider } from './context/CategoriesContext';
import HomePage from './pages/HomePage';
import CategoriesPage from './pages/CategoriesPage';
import BoxDesignPage from './pages/BoxDesignPage';

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

  // All other paths fall back to HomePage
  return <HomePage />;
}

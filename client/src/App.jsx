import React from 'react';
import { useRoute } from './hooks/useRoute';
import { CategoriesProvider } from './context/CategoriesContext';
import { AuthProvider } from './context/AuthContext.jsx';
import Navbar from './components/Navbar/Navbar.jsx';
import HomePage from './pages/HomePage';
import CategoriesPage from './pages/CategoriesPage';
import BoxDesignPage from './pages/BoxDesignPage';
import HowItWorksPage from './pages/HowItWorksPage';
import ContestsPage from './pages/ContestsPage';
import CustomBoxPage from './pages/CustomBoxPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';

function AppContent() {
  const { path } = useRoute();

  if (path === '/login')     return <LoginPage />;
  if (path === '/register')  return <RegisterPage />;
  if (path === '/dashboard') return <DashboardPage />;
  if (path === '/admin')     return <AdminPage />;

  if (path === '/categories') {
    return (
      <CategoriesProvider>
        <Navbar />
        <CategoriesPage />
      </CategoriesProvider>
    );
  }

  if (path === '/box-design') {
    return (
      <>
        <Navbar />
        <BoxDesignPage />
      </>
    );
  }

  if (path === '/custom-box') {
    return (
      <>
        <Navbar />
        <CustomBoxPage />
      </>
    );
  }

  if (path === '/how-it-works') {
    return (
      <>
        <Navbar />
        <HowItWorksPage />
      </>
    );
  }

  if (path === '/contests') {
    return (
      <>
        <Navbar />
        <ContestsPage />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <HomePage />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

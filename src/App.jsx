import { Suspense, lazy, useEffect, Component } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

import AnnouncementBar from './components/AnnouncementBar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LiveChat from './components/LiveChat';
import BackToTop from './components/BackToTop';
import ProductQuickView from './components/ProductQuickView';

// Contexts
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider, useToast } from './context/ToastContext';
import { CartProvider } from './context/CartContext';
import { ModalProvider } from './context/ModalContext';
import { FavouritesProvider } from './context/FavouritesContext';
import ToastContainer from './components/ToastContainer';
import CartDrawer from './components/CartDrawer';

// Lazy loaded pages
const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const Industries = lazy(() => import('./pages/Industries'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const SuccessStories = lazy(() => import('./pages/SuccessStories'));
const Blog = lazy(() => import('./pages/Blog'));
const CustomBox = lazy(() => import('./pages/CustomBox'));
const HowItWorks = lazy(() => import('./pages/HowItWorks'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Favourites = lazy(() => import('./pages/Favourites'));

// Auth Pages
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Profile = lazy(() => import('./pages/Profile'));
const Admin = lazy(() => import('./pages/Admin'));
const Checkout = lazy(() => import('./pages/Checkout'));

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '50px', backgroundColor: '#fff1f0', border: '5px solid #ff4d4f', margin: '20px', borderRadius: '20px' }}>
          <h1 style={{ color: '#ff4d4f' }}>Something went wrong.</h1>
          <pre style={{ whiteSpace: 'pre-wrap', color: '#850505' }}>{this.state.error?.toString()}</pre>
          <button onClick={() => window.location.reload()} style={{ padding: '10px 20px', backgroundColor: '#ff4d4f', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '20px' }}>
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen relative">
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
      <ToastContainer />
      <ProductQuickView />
      <LiveChat />
      <BackToTop />
    </div>
  );
}

const AuthGuard = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const { showToast } = useToast();
  useEffect(() => {
    if (!loading && !isAuthenticated) showToast('Please login to continue', 'warning');
  }, [loading, isAuthenticated, showToast]);
  if (loading) return null;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AdminGuard = ({ children }) => {
  const { user, loading } = useAuth();
  const { showToast } = useToast();
  useEffect(() => {
    if (!loading && user?.role !== 'admin') showToast('Access denied', 'error');
  }, [loading, user, showToast]);
  if (loading) return null;
  return user?.role === 'admin' ? children : <Navigate to="/" replace />;
};

export default function App() {
  // Replace this with your real Client ID from Google Cloud Console
  const GOOGLE_CLIENT_ID = "734487564892-6ep5ihbjertaf9ijso44a33859dsq625.apps.googleusercontent.com";

  return (
    <ErrorBoundary>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <BrowserRouter>
          <AuthProvider>
            <ToastProvider>
              <CartProvider>
                <FavouritesProvider>
                  <ModalProvider>
                    <ScrollToTop />
                    <Layout>
                      <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh] text-brand-primary font-black animate-pulse text-2xl">Design Custom Box Loading...</div>}>
                        <Routes>
                          <Route path="/" element={<Home />} />
                          <Route path="/products" element={<Products />} />
                          <Route path="/products/:slug" element={<Products />} />
                          <Route path="/industries" element={<Industries />} />
                          <Route path="/industries/:slug" element={<Industries />} />
                          <Route path="/about" element={<About />} />
                          <Route path="/get-free-quote" element={<CustomBox />} />
                          <Route path="/custom-box" element={<CustomBox />} />
                          <Route path="/how-it-works" element={<HowItWorks />} />
                          <Route path="/why-refine-packaging" element={<About />} />
                          <Route path="/success-stories" element={<SuccessStories />} />
                          <Route path="/customer-stories" element={<SuccessStories />} />
                          <Route path="/testimonials" element={<SuccessStories />} />
                          <Route path="/faqs" element={<FAQ />} />
                          <Route path="/blog" element={<Blog />} />
                          <Route path="/contact-us" element={<Contact />} />
                          <Route path="/favourites" element={<Favourites />} />
                          <Route path="/login" element={<Login />} />
                          <Route path="/register" element={<Register />} />
                          <Route path="/checkout" element={<Checkout />} />
                          <Route path="/profile" element={<AuthGuard><Profile /></AuthGuard>} />
                          <Route path="/admin" element={<AdminGuard><Admin /></AdminGuard>} />
                          <Route path="*" element={
                            <div className="py-32 text-center">
                              <h1 className="text-6xl font-display font-bold text-brand-textPrimary">404</h1>
                              <p className="text-xl text-brand-textSecondary mt-4">Page Not Found</p>
                              <a href="/" className="mt-8 inline-block bg-brand-primary text-white px-8 py-3 rounded-button font-bold">Back to Home</a>
                            </div>
                          } />
                        </Routes>
                      </Suspense>
                    </Layout>
                  </ModalProvider>
                </FavouritesProvider>
              </CartProvider>
            </ToastProvider>
          </AuthProvider>
        </BrowserRouter>
      </GoogleOAuthProvider>
    </ErrorBoundary>
  );
}

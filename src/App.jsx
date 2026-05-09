import { Suspense, lazy, useEffect, Component } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

import AnnouncementBar from './components/AnnouncementBar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CustomChat from './components/CustomChat';
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
const Terms = lazy(() => import('./pages/Terms'));
const Privacy = lazy(() => import('./pages/Privacy'));

// Auth Pages
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const Profile = lazy(() => import('./pages/Profile'));
const Admin = lazy(() => import('./pages/Admin'));
const Checkout = lazy(() => import('./pages/Checkout'));
const BlogPost = lazy(() => import('./pages/BlogPost'));

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
    // Check if it's a chunk loading error (dynamic import failure)
    const isChunkError = error?.message?.includes('Failed to fetch dynamically imported module') || 
                         error?.message?.includes('Importing a module script failed');
    if (isChunkError) {
      if (!sessionStorage.getItem('chunk_failed_reload')) {
        sessionStorage.setItem('chunk_failed_reload', 'true');
        window.location.reload();
        return;
      } else {
        // If it already reloaded once and failed again, clear the flag so it can retry later,
        // but let the error UI show up to avoid infinite reload loop
        sessionStorage.removeItem('chunk_failed_reload');
      }
    }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '50px', backgroundColor: '#fff1f0', border: '5px solid #ff4d4f', margin: '20px', borderRadius: '20px' }}>
          <h1 style={{ color: '#ff4d4f' }}>Oops! Something went wrong.</h1>
          <p style={{ color: '#850505' }}>We're sorry for the inconvenience. Please try reloading the page.</p>
          <button onClick={() => window.location.reload()} style={{ padding: '10px 20px', backgroundColor: '#ff4d4f', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '20px' }}>
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

class LeafletErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return (
      <div style={{ padding: 40, textAlign: 'center', background: '#F8FAFC', borderRadius: 20, border: '1px solid #E2E8F0', margin: 20 }}>
        <h2 style={{ color: '#1A4D2E', marginBottom: 12 }}>Map Loading Issue</h2>
        <p style={{ color: '#64748B', fontSize: 14 }}>The interactive map failed to initialize. You can still manage all other administrative features.</p>
        <button onClick={() => window.location.reload()} style={{ marginTop: 20, padding: '10px 24px', background: '#1A4D2E', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>Reload</button>
      </div>
    );
    return this.props.children;
  }
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function Layout({ children }) {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) {
    return (
      <div className="flex flex-col min-h-screen relative bg-[#F8FAFC]">
        <main className="flex-1">{children}</main>
        <ToastContainer />
        <ModalProvider>{/* Re-provide if needed inside admin */}</ModalProvider>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen relative">
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
      <ToastContainer />
      <ProductQuickView />
      <CustomChat />
      <BackToTop />
    </div>
  );
}

const AuthGuard = ({ children }) => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { showToast } = useToast();
  const location = useLocation();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) showToast('Please login to continue', 'warning');
  }, [authLoading, isAuthenticated, showToast]);

  if (authLoading) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F5F2ED', gap: 20 }}>
      <div style={{ width: 40, height: 40, border: '3px solid #E2DDD6', borderTopColor: '#1A4D2E', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <p style={{ fontFamily: '"DM Mono", monospace', fontSize: 13, color: '#1A4D2E', fontWeight: 600, letterSpacing: '0.1em' }}>RE-AUTHENTICATING...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
};

const AdminGuard = ({ children }) => {
  const { user, loading } = useAuth();
  const { showToast } = useToast();
  const location = useLocation();
  useEffect(() => {
    if (!loading && user && (user.role !== 'admin' && user.role !== 'super_admin')) showToast('Access denied', 'error');
  }, [loading, user, showToast]);
  if (loading) return null;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return (user?.role === 'admin' || user?.role === 'super_admin') ? children : <Navigate to="/" replace />;
};

export default function App() {
  // Replace this with your real Client ID from Google Cloud Console
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "734487564892-6ep5ihbjertaf9ijso44a33859dsq625.apps.googleusercontent.com";

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
                          <Route path="/blog/:id" element={<BlogPost />} />
                          <Route path="/contact-us" element={<Contact />} />
                          <Route path="/terms" element={<Terms />} />
                          <Route path="/privacy" element={<Privacy />} />
                          <Route path="/favourites" element={<Favourites />} />
                          <Route path="/login" element={<Login />} />
                          <Route path="/register" element={<Register />} />
                          <Route path="/forgot-password" element={<ForgotPassword />} />
                          <Route path="/reset-password" element={<ForgotPassword />} />
                          <Route path="/checkout" element={<Checkout />} />
                          <Route path="/profile" element={<AuthGuard><Profile /></AuthGuard>} />
                          <Route path="/admin" element={<AdminGuard><LeafletErrorBoundary><Admin /></LeafletErrorBoundary></AdminGuard>} />
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

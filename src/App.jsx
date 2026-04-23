import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AnnouncementBar from './components/AnnouncementBar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import Industries from './pages/Industries';
import About from './pages/About';
import WhyUs from './pages/WhyUs';
import HowItWorks from './pages/HowItWorks';
import FAQs from './pages/FAQs';

const CustomBox = lazy(() => import('./pages/CustomBox'));

function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center px-4">
      <div className="text-8xl font-black text-brand-blue mb-4">404</div>
      <h1 className="text-2xl font-black text-gray-800 mb-3">Page Not Found</h1>
      <p className="text-gray-500 mb-7">The page you're looking for doesn't exist.</p>
      <a
        href="/"
        className="bg-brand-orange text-white font-bold px-7 py-3.5 rounded-xl hover:bg-brand-orange-dark transition-colors"
      >
        Back to Home
      </a>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:slug" element={<Products />} />
          <Route path="/industries" element={<Industries />} />
          <Route path="/industries/:slug" element={<Industries />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/custom-box"
            element={
              <Suspense fallback={<div className="flex items-center justify-center py-32 text-brand-blue font-semibold">Loading 3D Builder...</div>}>
                <CustomBox />
              </Suspense>
            }
          />
          <Route path="/why-us" element={<WhyUs />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

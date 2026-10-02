import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import Home from './pages/Home';
import OrderBuilder from './pages/OrderBuilder';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import CustomerNavbar from './components/CustomerNavbar';
import Footer from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import GlobalGlowCursor from './components/GlobalGlowCursor';
// Lazy-loaded route-level chunks for performance and code-splitting
const Checkout = lazy(() => import('./pages/Checkout'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const MyOrders = lazy(() => import('./pages/MyOrders'));
const OrderTracker = lazy(() => import('./pages/OrderTracker'));
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'));
const Profile = lazy(() => import('./pages/Profile'));
const Makers = lazy(() => import('./pages/Makers'));
const SRMKtrPrinting = lazy(() => import('./pages/SRMKtrPrinting'));
const PricingPage = lazy(() => import('./pages/PricingPage'));
const HowItWorksPage = lazy(() => import('./pages/HowItWorksPage'));
const FAQPage = lazy(() => import('./pages/FAQPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const BlogIndexPage = lazy(() => import('./pages/BlogIndexPage'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'));

const RouteFallback: React.FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem' }}>
    <Loader2 className="animate-spin" size={36} style={{ color: 'var(--ink)' }} />
    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Loading page...</span>
  </div>
);

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <GlobalGlowCursor />
      <ScrollToTop />
      <div className="flex flex-col" style={{ minHeight: '100vh' }}>
        <CustomerNavbar />

        <main className="zap-page-content" style={{ flex: 1 }}>
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Navigate to="/" replace />} />
              <Route path="/srm-ktr-printing" element={<SRMKtrPrinting />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/blog" element={<BlogIndexPage />} />
              <Route path="/blog/:slug" element={<BlogPostPage />} />
              <Route path="/order" element={<OrderBuilder />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/orders" element={<MyOrders />} />
              <Route path="/orders/:id" element={<OrderTracker />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/makers" element={<Makers />} />
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;

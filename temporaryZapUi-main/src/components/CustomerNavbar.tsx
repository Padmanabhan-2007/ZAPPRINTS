import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User as UserIcon, Home, FileText, HelpCircle, Layers, ArrowRight } from 'lucide-react';
import { auth } from '../utils/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import ThemeSwitcher from './ThemeSwitcher';

const DESKTOP_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/srm-ktr-printing', label: 'SRM Printing' },
  { to: '/how-it-works', label: 'How it works' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/faq', label: 'FAQ' },
];

const CustomerNavbar: React.FC = () => {
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Isolate Admin layout: Do not render customer navbar on admin routes
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  const path = location.pathname;
  const isActive = (to: string) => path === to;

  return (
    <>
      {/* Mobile top bar — brand + status only; navigation lives in the thumb-reach dock below */}
      <header className="zap-mobile-top-bar">
        <Link to="/" className="zap-mobile-brand-link" aria-label="ZapPrints home">
          <img src="/zap%20prints%20logo.png" alt="" />
          <span>ZAP<span className="g">PRINTS</span></span>
        </Link>

        <div className="zap-mobile-top-meta">
          <ThemeSwitcher compact />
          <span className="zap-live"><span className="dot-live" />Live</span>
          {currentUser ? (
            <Link to="/profile" className="icon-btn" style={{ width: 36, height: 36 }} aria-label="Profile">
              {currentUser.photoURL ? (
                <img src={currentUser.photoURL} alt="" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <UserIcon size={18} />
              )}
            </Link>
          ) : (
            <Link to="/login" className="zap-mobile-signin">Sign in</Link>
          )}
        </div>
      </header>

      {/* Desktop bar — logo / links / actions on a hairline */}
      <header className="zap-nav">
        <nav className="zap-nav-inner" aria-label="Primary">
          <Link to="/" className="zap-nav-logo">
            <img src="/zap%20prints%20logo.png" alt="" />
            <span>ZAP<span className="g">PRINTS</span></span>
          </Link>

          <div className="zap-nav-links">
            {DESKTOP_LINKS.map((l) => (
              <Link key={l.to} to={l.to} className={`zap-nav-link ${isActive(l.to) ? 'active' : ''}`}>
                {l.label}
              </Link>
            ))}
            {currentUser && (
              <Link to="/orders" className={`zap-nav-link ${isActive('/orders') ? 'active' : ''}`}>
                My orders
              </Link>
            )}
          </div>

          <div className="zap-nav-actions">
            <ThemeSwitcher />
            {currentUser ? (
              <Link to="/profile" className="btn btn-ghost">
                {currentUser.photoURL ? (
                  <img src={currentUser.photoURL} alt="" style={{ width: 20, height: 20, borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <UserIcon size={15} />
                )}
                Profile
              </Link>
            ) : (
              <Link to="/login" className="btn btn-ghost">Sign in</Link>
            )}
            <Link to="/order" className="btn btn-primary">
              Start printing <ArrowRight size={14} data-arrow />
            </Link>
          </div>
        </nav>
      </header>

      {/* Mobile bottom dock — five targets, Print is the anchor */}
      <nav className="zap-mobile-bottom-dock" aria-label="Primary">
        <Link to="/" className={`zap-dock-item ${isActive('/') ? 'active' : ''}`}>
          <Home size={18} />
          <span>Home</span>
        </Link>
        <Link to="/srm-ktr-printing" className={`zap-dock-item ${isActive('/srm-ktr-printing') ? 'active' : ''}`}>
          <Layers size={18} />
          <span>SRM</span>
        </Link>
        <Link to="/order" className="zap-dock-cta">
          <span>Print</span>
          <ArrowRight size={16} />
        </Link>
        <Link to="/pricing" className={`zap-dock-item ${isActive('/pricing') ? 'active' : ''}`}>
          <FileText size={18} />
          <span>Pricing</span>
        </Link>
        {currentUser ? (
          <Link to="/orders" className={`zap-dock-item ${isActive('/orders') ? 'active' : ''}`}>
            <UserIcon size={18} />
            <span>Orders</span>
          </Link>
        ) : (
          <Link to="/faq" className={`zap-dock-item ${isActive('/faq') ? 'active' : ''}`}>
            <HelpCircle size={18} />
            <span>FAQ</span>
          </Link>
        )}
      </nav>
    </>
  );
};

export default CustomerNavbar;

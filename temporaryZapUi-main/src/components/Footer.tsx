import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => (
  <footer className="zap-footer">
    <div className="container">
      <div className="foot-grid">
        <div className="foot-brand">
          <Link to="/" className="zap-nav-logo">
            <img src="/zap%20prints%20logo.png" alt="" />
            <span>ZAP<span className="g">PRINTS</span></span>
          </Link>
          <p>Fast &amp; fresh campus printing. Upload from your phone, collect at Java Canteen, SRM KTR.</p>
        </div>

        <nav className="foot-col" aria-label="Service">
          <h4>Service</h4>
          <ul>
            <li><Link to="/order">Start printing</Link></li>
            <li><Link to="/pricing">Pricing</Link></li>
            <li><Link to="/how-it-works">How it works</Link></li>
            <li><Link to="/srm-ktr-printing">SRM KTR printing</Link></li>
          </ul>
        </nav>

        <nav className="foot-col" aria-label="Company">
          <h4>Company</h4>
          <ul>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/blog">Guides</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
            <li><Link to="/makers">Made by the team</Link></li>
          </ul>
        </nav>

        <nav className="foot-col" aria-label="Contact">
          <h4>Contact</h4>
          <ul>
            <li><Link to="/contact">Contact</Link></li>
            <li><a href="https://wa.me/917904447870" target="_blank" rel="noreferrer">WhatsApp</a></li>
          </ul>
        </nav>
      </div>

      <div className="foot-word" aria-hidden="true">ZAP<span className="g">PRINTS</span></div>

      <div className="foot-base mono">
        <span>© {new Date().getFullYear()} ZapPrints</span>
        <span>Java Canteen · SRM KTR</span>
      </div>
    </div>
  </footer>
);

export default Footer;

import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Clock, Coffee } from 'lucide-react';
import SEOHead, { PRIMARY_DOMAIN } from '../components/SEOHead';

const ContactPage: React.FC = () => {
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "name": "Contact ZapPrints Support & Inquiries",
      "description": "Get in touch with ZapPrints support for campus printing questions, bulk club orders, and pickup assistance at SRM KTR.",
      "url": `${PRIMARY_DOMAIN}/contact`,
      "mainEntity": {
        "@type": "Organization",
        "name": "ZapPrints",
        "url": PRIMARY_DOMAIN,
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+91-7904447870",
          "contactType": "Customer Support",
          "availableLanguage": ["English", "Tamil", "Hindi"]
        }
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": PRIMARY_DOMAIN
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Contact",
          "item": `${PRIMARY_DOMAIN}/contact`
        }
      ]
    }
  ];

  return (
    <div style={{ backgroundColor: 'var(--bg-page, #faf9f7)', color: 'var(--text-main, #2a1f1a)', minHeight: '100vh', paddingBottom: '3rem' }}>
      <SEOHead
        title="Contact ZapPrints — Campus Printing Support & Inquiries"
        description="Contact ZapPrints for order support, campus pickup queries at Java Canteen, bulk college club printing, or partnership inquiries."
        canonicalPath="/contact"
        schema={schema}
      />

      <div style={{ borderBottom: '1px solid var(--border-subtle, #ede9e5)', background: '#ffffff', padding: '0.65rem 0' }}>
        <div className="container" style={{ fontSize: '0.8rem', color: 'var(--color-muted, #7a6a62)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
          <span>/</span>
          <span style={{ color: 'var(--orange)', fontWeight: 600 }}>Contact</span>
        </div>
      </div>

      <section style={{ padding: '3.5rem 0 2.5rem 0', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '780px' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--orange)' }}>
            Get In Touch
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', fontWeight: 800, letterSpacing: '-0.03em', marginTop: '0.35rem', marginBottom: '0.65rem', color: '#0f172a' }}>
            Contact ZapPrints Support
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--color-muted, #7a6a62)', lineHeight: 1.55 }}>
            Have a question about an ongoing print order, need bulk documentation, or want to coordinate a campus event batch? We are here to help.
          </p>
        </div>
      </section>

      <section style={{ padding: '0 0 3.5rem 0' }}>
        <div className="container" style={{ maxWidth: '880px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
            
            {/* WhatsApp Card */}
            <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'color-mix(in srgb, var(--orange) 10%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--orange)', marginBottom: '1.25rem' }}>
                <MessageSquare size={22} />
              </div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.35rem' }}>Direct WhatsApp</h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-muted, #7a6a62)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                Instant responses for active order tracking, special requests, and bulk order enquiries.
              </p>
              <a 
                href="https://wa.me/917904447870" 
                target="_blank" 
                rel="noreferrer" 
                className="btn btn-primary"
                style={{ width: '100%', borderRadius: 'var(--radius-full, 99px)', textDecoration: 'none' }}
              >
                Chat on WhatsApp (+91 7904447870)
              </a>
            </div>

            {/* Pickup Counter Location */}
            <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'color-mix(in srgb, var(--orange) 10%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--orange)', marginBottom: '1.25rem' }}>
                <Coffee size={22} />
              </div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.35rem' }}>Campus Pickup Counter</h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-muted, #7a6a62)', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                <strong>Java Canteen</strong>, SRM Institute of Science and Technology, Kattankulathur, Tamil Nadu.
              </p>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-muted, #7a6a62)', marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Clock size={15} style={{ color: 'var(--orange)' }} />
                <span>Morning: 7:00–7:50 AM · Afternoon: 12:00–12:30 PM</span>
              </div>
            </div>

          </div>

          <div style={{ textAlign: 'center' }}>
            <Link to="/srm-ktr-printing" className="btn btn-ghost" style={{ fontSize: '0.9rem', color: 'var(--orange)' }}>
              Learn more about SRM KTR Campus Pickup &amp; Services →
            </Link>
          </div>

        </div>
      </section>
    </div>
  );
};

export default ContactPage;

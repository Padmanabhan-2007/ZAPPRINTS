import React from 'react';
import { Link } from 'react-router-dom';
import { UploadCloud, Sliders, CreditCard, Coffee, ArrowRight, FileText, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import SEOHead, { PRIMARY_DOMAIN } from '../components/SEOHead';
import SectionHead from '../components/SectionHead';

// Visual Mock Components
const MockUpload = () => (
  <div style={{ padding: '1.25rem', background: 'var(--paper-sunk)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', width: '100%', boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.02)' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', background: 'var(--paper)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-md)' }}>
      <div style={{ padding: '0.6rem', background: 'var(--color-accent-subtle)', color: 'var(--color-accent)', borderRadius: 'var(--radius-sm)' }}>
        <FileText size={22} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>document.pdf</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>12 pages • Ready</div>
      </div>
    </div>
  </div>
);

const MockConfigure = () => (
  <div style={{ padding: '1.25rem', background: 'var(--paper-sunk)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', width: '100%', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
    <div style={{ display: 'flex', gap: '0.6rem' }}>
      <div style={{ flex: 1, textAlign: 'center', padding: '0.5rem', fontSize: '0.8rem', fontWeight: 600, background: 'var(--color-accent)', color: 'var(--paper)', borderRadius: 'var(--radius-full)' }}>B&W</div>
      <div style={{ flex: 1, textAlign: 'center', padding: '0.5rem', fontSize: '0.8rem', fontWeight: 600, background: 'var(--paper)', color: 'var(--text-muted)', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-subtle)' }}>Color</div>
    </div>
    <div style={{ display: 'flex', gap: '0.6rem' }}>
      <div style={{ flex: 1, textAlign: 'center', padding: '0.5rem', fontSize: '0.8rem', fontWeight: 600, background: 'var(--paper)', color: 'var(--text-muted)', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-subtle)' }}>Single</div>
      <div style={{ flex: 1, textAlign: 'center', padding: '0.5rem', fontSize: '0.8rem', fontWeight: 600, background: 'var(--color-accent-subtle)', color: 'var(--color-accent)', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-accent)' }}>Duplex</div>
    </div>
  </div>
);

const MockCheckout = () => (
  <div style={{ padding: '1.25rem', background: 'var(--paper)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', width: '100%', boxShadow: 'var(--shadow-lg)' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
      <span>Subtotal</span>
      <span>₹36.00</span>
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem', fontSize: '1.05rem', fontWeight: 800, color: 'var(--ink)' }}>
      <span>Total</span>
      <span>₹36.00</span>
    </div>
    <div style={{ width: '100%', padding: '0.75rem', textAlign: 'center', background: 'var(--ink)', color: 'var(--paper)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', fontWeight: 600 }}>
      Pay Securely
    </div>
  </div>
);

const MockPickup = () => (
  <div style={{ padding: '1.5rem', background: 'var(--paper-sunk)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border-hover)', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-success)', fontSize: '0.9rem', fontWeight: 700 }}>
      <CheckCircle2 size={18} />
      <span>Ready for pickup</span>
    </div>
    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--ink)', letterSpacing: '-0.03em' }}>Java Canteen</div>
    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Show receipt at counter</div>
  </div>
);

const STEPS = [
  {
    id: '01',
    title: 'Upload Your Documents',
    desc: 'Drop your PDF, PNG, or JPG files into the browser. Our client-side analyzer counts pages instantly without uploading unneeded data, protecting your bandwidth and privacy.',
    icon: <UploadCloud size={24} />,
    visual: <MockUpload />
  },
  {
    id: '02',
    title: 'Customize Print Preferences',
    desc: 'Select monochrome (B&W) or vibrant color, toggle single or double-sided (duplex) printing, and choose the number of copies needed. The live price calculator updates immediately.',
    icon: <Sliders size={24} />,
    visual: <MockConfigure />
  },
  {
    id: '03',
    title: 'Instant UPI Checkout',
    desc: 'Review your order summary and pay in seconds via Razorpay using UPI (Google Pay, PhonePe, Paytm, BHIM) or debit/credit cards.',
    icon: <CreditCard size={24} />,
    visual: <MockCheckout />
  },
  {
    id: '04',
    title: 'Pickup at Java Canteen',
    desc: 'Collect your sorted prints at the Java Canteen counter during the scheduled morning (7:00 AM – 7:50 AM) or afternoon (12:00 PM – 12:30 PM) pickup sessions.',
    icon: <Coffee size={24} />,
    visual: <MockPickup />
  }
];

const HowItWorksPage: React.FC = () => {
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Order Online Printouts at ZapPrints",
      "description": "Step-by-step guide to uploading PDF documents, customizing print settings, paying securely, and collecting prints at Java Canteen.",
      "image": `${PRIMARY_DOMAIN}/zap%20prints%20logo%20banner.png`,
      "step": STEPS.map((s, i) => ({
        "@type": "HowToStep",
        "position": i + 1,
        "name": s.title,
        "text": s.desc
      }))
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
          "name": "How It Works",
          "item": `${PRIMARY_DOMAIN}/how-it-works`
        }
      ]
    }
  ];

  return (
    <div style={{ backgroundColor: 'var(--bg-page)', minHeight: '100vh' }}>
      <SEOHead
        title="How It Works — Online Campus Printing Guide | ZapPrints"
        description="Learn how ZapPrints works in 4 easy steps: Upload your PDF, configure duplex/color, pay via UPI, and grab your fresh prints at Java Canteen."
        canonicalPath="/how-it-works"
        schema={schema}
      />

      <div style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--paper-raised)' }}>
        <div className="container" style={{ padding: '0.65rem var(--gutter)', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Link to="/" className="hover-link" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
          <span style={{ opacity: 0.5 }}>/</span>
          <span style={{ color: 'var(--color-accent)', fontWeight: 600 }}>How It Works</span>
        </div>
      </div>

      <main style={{ paddingBottom: '6rem' }}>
        <section style={{ padding: '4rem 0 3rem 0', textAlign: 'center' }}>
          <div className="container" style={{ maxWidth: '780px' }}>
            <SectionHead 
              title="How ZapPrints Works" 
              intro="From your phone to physical printouts ready at Java Canteen in 4 straightforward steps." 
            />
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              gap: '0.5rem', 
              marginTop: '1.5rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--color-accent)'
            }}>
              <span>Upload</span>
              <ArrowRight size={14} style={{ opacity: 0.5 }} />
              <span>Configure</span>
              <ArrowRight size={14} style={{ opacity: 0.5 }} />
              <span>Pay</span>
              <ArrowRight size={14} style={{ opacity: 0.5 }} />
              <span>Pickup</span>
            </div>
          </div>
        </section>

        <section style={{ padding: '0 0 4rem 0' }}>
          <div className="container" style={{ maxWidth: '880px' }}>
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              
              {/* Connecting Line */}
              <div style={{ 
                position: 'absolute', 
                left: '2rem', 
                top: '2rem', 
                bottom: '2rem', 
                width: '2px', 
                background: 'linear-gradient(to bottom, var(--color-accent-subtle), transparent)',
                zIndex: 0 
              }} className="desktop-only-line" />

              {STEPS.map((step, idx) => (
                <motion.div 
                  key={step.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  style={{ position: 'relative', zIndex: 1 }}
                >
                  <div 
                    className="card step-flow-card" 
                    style={{ 
                      padding: '2rem', 
                      display: 'grid', 
                      gridTemplateColumns: '1fr', 
                      gap: '2rem', 
                      alignItems: 'center',
                      background: 'var(--paper)',
                      borderRadius: 'var(--radius-2xl)',
                      border: '1px solid var(--border-subtle)',
                      transition: 'transform 0.3s var(--ease), box-shadow 0.3s var(--ease)'
                    }}
                  >
                    {/* Content Left */}
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                      <div style={{ 
                        width: '3.5rem', 
                        height: '3.5rem', 
                        borderRadius: 'var(--radius-lg)', 
                        background: 'var(--color-accent-subtle)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        color: 'var(--color-accent)', 
                        flexShrink: 0,
                        boxShadow: '0 0 0 4px var(--paper)'
                      }}>
                        {step.icon}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.3rem' }}>
                          Step {step.id}
                        </div>
                        <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 0.6rem 0', color: 'var(--ink)' }}>
                          {step.title}
                        </h2>
                        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                          {step.desc}
                        </p>
                      </div>
                    </div>

                    {/* Visual Right */}
                    <div className="step-visual-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      {step.visual}
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Inline styles for responsive layout */}
              <style>{`
                .desktop-only-line { display: none; }
                .step-flow-card:hover {
                  transform: translateY(-2px);
                  box-shadow: var(--shadow-lg);
                  border-color: var(--color-accent-subtle);
                }
                @media (min-width: 768px) {
                  .desktop-only-line { 
                    display: block; 
                    left: 2.75rem !important; 
                  }
                  .step-flow-card {
                    grid-template-columns: 1.2fr 1fr !important;
                  }
                  .step-visual-container {
                    justify-content: flex-end !important;
                    padding-left: 2rem;
                    border-left: 1px solid var(--border-subtle);
                  }
                }
              `}</style>

            </div>

            <div style={{ textAlign: 'center', marginTop: '4rem' }}>
              <Link to="/order" className="btn btn-primary" style={{ padding: '0.9rem 2.5rem', fontSize: '1.05rem', fontWeight: 700, borderRadius: 'var(--radius-full)', gap: '0.6rem', display: 'inline-flex', alignItems: 'center' }}>
                <span>Try It Now — Start Printing</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HowItWorksPage;

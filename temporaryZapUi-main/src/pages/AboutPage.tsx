import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Zap, 
  Users, 
  ArrowRight, 
  FileText, 
  Settings2, 
  CreditCard, 
  Coffee,
  Lock,
  ChevronRight,
  Code
} from 'lucide-react';
import { motion } from 'motion/react';
import SEOHead, { PRIMARY_DOMAIN } from '../components/SEOHead';
import SectionHead from '../components/SectionHead';

const VisualMockup = () => (
  <div style={{ position: 'relative', width: '100%', maxWidth: '380px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
    {/* Upload Mock */}
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      style={{ background: 'var(--paper)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: 'var(--shadow-sm)' }}
    >
      <div style={{ background: 'var(--color-accent-subtle)', color: 'var(--color-accent)', padding: '0.6rem', borderRadius: 'var(--radius-md)' }}>
        <FileText size={20} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '0.15rem' }}>physics_lab_record.pdf</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>12 Pages • Ready</div>
      </div>
    </motion.div>

    {/* Config Mock */}
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      style={{ background: 'var(--paper)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: 'var(--shadow-sm)', marginLeft: '1rem' }}
    >
      <div style={{ background: 'var(--paper-sunk)', color: 'var(--ink)', padding: '0.6rem', borderRadius: 'var(--radius-md)' }}>
        <Settings2 size={20} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '0.15rem' }}>B&W • Duplex</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>₹36.00</div>
      </div>
    </motion.div>

    {/* Pickup Mock */}
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      style={{ background: 'var(--paper)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: 'var(--shadow-sm)', marginLeft: '2rem' }}
    >
      <div style={{ background: 'color-mix(in srgb, var(--color-success) 15%, transparent)', color: 'var(--color-success)', padding: '0.6rem', borderRadius: 'var(--radius-md)' }}>
        <Coffee size={20} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '0.15rem' }}>Java Canteen Pickup</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Ready between 12:00 PM – 12:30 PM</div>
      </div>
    </motion.div>
  </div>
);

const AboutPage: React.FC = () => {
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "name": "About ZapPrints",
      "description": "Learn how ZapPrints is modernizing campus printing for college students with automated queue-free print stations.",
      "url": `${PRIMARY_DOMAIN}/about`,
      "mainEntity": {
        "@type": "Organization",
        "name": "ZapPrints",
        "url": PRIMARY_DOMAIN,
        "logo": `${PRIMARY_DOMAIN}/zap%20prints%20logo.png`,
        "description": "Smart campus printing network engineered for fast document turnaround and convenient college canteen pickup."
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
          "name": "About",
          "item": `${PRIMARY_DOMAIN}/about`
        }
      ]
    }
  ];

  return (
    <div style={{ backgroundColor: 'var(--bg-page)', color: 'var(--text-main)', minHeight: '100vh', paddingBottom: '3rem' }}>
      <SEOHead
        title="About ZapPrints — Modern Campus Printing Network"
        description="ZapPrints is built by students for students to solve campus printing hassles. Fast online uploads, automated print stations, and Java Canteen pickup."
        canonicalPath="/about"
        schema={schema}
      />

      <div style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--paper-raised)' }}>
        <div className="container" style={{ padding: '0.65rem var(--gutter)', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Link to="/" className="hover-link" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
          <span style={{ opacity: 0.5 }}>/</span>
          <span style={{ color: 'var(--color-accent)', fontWeight: 600 }}>About</span>
        </div>
      </div>

      <main>
        {/* Hero Section */}
        <section style={{ padding: '5rem 0 4rem 0', position: 'relative', overflow: 'hidden' }}>
          <div className="container" style={{ maxWidth: '1100px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '4rem', alignItems: 'center' }} className="hero-grid">
              
              <div>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-accent)' }}>
                  Our Mission
                </span>
                <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1, marginTop: '0.75rem', marginBottom: '1.25rem', color: 'var(--ink)' }}>
                  Fixing Campus Printing for College Students
                </h1>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: '580px', marginBottom: '2.5rem' }}>
                  Every college student knows the rush: standing in long lines at crowded print shops before 8:00 AM classes or lab submissions. ZapPrints is built to eliminate the queue entirely, placing print control directly in your pocket.
                </p>
                <Link to="/order" className="btn btn-primary" style={{ padding: '0.85rem 2.25rem', fontSize: '1rem', fontWeight: 700, borderRadius: 'var(--radius-full)', gap: '0.5rem', display: 'inline-flex', alignItems: 'center' }}>
                  <span>Experience ZapPrints</span>
                  <ArrowRight size={18} />
                </Link>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <VisualMockup />
              </div>

            </div>
          </div>
        </section>

        {/* Why We Built It / Pillars */}
        <section style={{ padding: '5rem 0', background: 'var(--paper-sunk)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
          <div className="container" style={{ maxWidth: '1080px' }}>
            <SectionHead 
              title="Why ZapPrints Exists" 
              intro="The three pillars that guide everything we build." 
            />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '4rem' }}>
              
              {/* Pillar 1 */}
              <motion.div whileHover={{ scale: 0.98, translateY: -4 }} className="card" style={{ padding: '2rem', background: 'var(--paper)', borderRadius: 'var(--radius-2xl)', border: '1px solid var(--border-subtle)', transition: 'all 0.3s' }}>
                <div style={{ width: '100%', height: '80px', background: 'var(--paper-sunk)', borderRadius: 'var(--radius-lg)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', overflow: 'hidden' }}>
                   <div style={{ width: '30px', height: '4px', background: 'var(--color-accent)', borderRadius: '2px' }} />
                   <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
                   <div style={{ width: '30px', height: '4px', background: 'var(--color-accent)', borderRadius: '2px' }} />
                   <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
                   <div style={{ width: '30px', height: '4px', background: 'var(--color-success)', borderRadius: '2px' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={{ color: 'var(--color-accent)' }}><Zap size={24} /></div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--ink)', margin: 0 }}>Speed &amp; Convenience</h3>
                </div>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                  Order from your phone anytime and pick up right when you reach campus or between lectures at Java Canteen. No more waiting.
                </p>
              </motion.div>

              {/* Pillar 2 */}
              <motion.div whileHover={{ scale: 0.98, translateY: -4 }} className="card" style={{ padding: '2rem', background: 'var(--paper)', borderRadius: 'var(--radius-2xl)', border: '1px solid var(--border-subtle)', transition: 'all 0.3s' }}>
                <div style={{ width: '100%', height: '80px', background: 'var(--paper-sunk)', borderRadius: 'var(--radius-lg)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   <div style={{ padding: '1rem', background: 'var(--paper)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-full)', boxShadow: 'var(--shadow-sm)', color: 'var(--ink)' }}>
                     <Lock size={20} />
                   </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={{ color: 'var(--color-accent)' }}><ShieldCheck size={24} /></div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--ink)', margin: 0 }}>Data Privacy</h3>
                </div>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                  Your private assignments, resumes, and project code are never left visible on shared shop desktop screens. Files are processed securely.
                </p>
              </motion.div>

              {/* Pillar 3 */}
              <motion.div whileHover={{ scale: 0.98, translateY: -4 }} className="card" style={{ padding: '2rem', background: 'var(--paper)', borderRadius: 'var(--radius-2xl)', border: '1px solid var(--border-subtle)', transition: 'all 0.3s' }}>
                <div style={{ width: '100%', height: '80px', background: 'var(--paper-sunk)', borderRadius: 'var(--radius-lg)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                   <div style={{ width: '24px', height: '32px', border: '2px solid var(--color-accent)', borderRadius: '4px' }} />
                   <div style={{ width: '24px', height: '32px', border: '2px dashed var(--border-hover)', borderRadius: '4px' }} />
                   <div style={{ width: '24px', height: '32px', border: '2px solid var(--color-accent)', borderRadius: '4px' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={{ color: 'var(--color-accent)' }}><Users size={24} /></div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--ink)', margin: 0 }}>Student Centric</h3>
                </div>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                  Engineered specifically for academic formats, duplex lab manuals, transparent pricing, and instant UPI micro-transactions.
                </p>
              </motion.div>

            </div>
          </div>
        </section>

        {/* Workflow Section */}
        <section style={{ padding: '6rem 0', background: 'var(--paper)' }}>
          <div className="container" style={{ maxWidth: '1000px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--ink)', marginBottom: '3rem', letterSpacing: '-0.02em' }}>ZapPrints in Practice</h2>
            
            <div className="workflow-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', position: 'relative' }}>
              <div className="desktop-workflow-line" style={{ position: 'absolute', top: '32px', left: '12%', right: '12%', height: '2px', background: 'var(--border-subtle)', zIndex: 0 }}></div>
              
              <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '64px', height: '64px', background: 'var(--paper)', border: '2px solid var(--border-subtle)', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink)', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                  <FileText size={24} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--ink)', margin: '0 0 0.25rem 0' }}>Upload</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>Choose your files securely</p>
                </div>
              </div>

              <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '64px', height: '64px', background: 'var(--paper)', border: '2px solid var(--color-accent)', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-accent)', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                  <Settings2 size={24} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--ink)', margin: '0 0 0.25rem 0' }}>Configure</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>Choose B&W, duplex, pages</p>
                </div>
              </div>

              <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '64px', height: '64px', background: 'var(--paper)', border: '2px solid var(--border-subtle)', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink)', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                  <CreditCard size={24} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--ink)', margin: '0 0 0.25rem 0' }}>Pay</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>Review total and checkout</p>
                </div>
              </div>

              <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '64px', height: '64px', background: 'var(--paper)', border: '2px solid var(--border-subtle)', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-success)', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                  <Coffee size={24} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--ink)', margin: '0 0 0.25rem 0' }}>Pick Up</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>Collect at Java Canteen</p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Team Section */}
        <section style={{ padding: '0 0 5rem 0' }}>
          <div className="container" style={{ maxWidth: '800px' }}>
            <div className="card" style={{ padding: '3.5rem 2rem', textAlign: 'center', background: 'var(--paper-raised)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-2xl)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '56px', height: '56px', background: 'var(--color-accent-subtle)', color: 'var(--color-accent)', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <Code size={28} />
              </div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--ink)' }}>Meet the Engineering Team</h2>
              <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', maxWidth: '540px', margin: '0 auto 2rem auto', lineHeight: 1.6 }}>
                ZapPrints is engineered from scratch by a team of passionate student builders across full-stack software and hardware daemons.
              </p>
              <Link to="/makers" className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', borderRadius: 'var(--radius-full)', padding: '0.85rem 2rem', fontSize: '1rem', fontWeight: 700 }}>
                <span>View The Makers Archive</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>

      </main>

      <style>{`
        @media (min-width: 900px) {
          .hero-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 767px) {
          .workflow-grid { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
          .desktop-workflow-line { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default AboutPage;

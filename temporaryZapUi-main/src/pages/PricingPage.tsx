import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Minus, Plus, FileText, Calculator } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import SEOHead, { PRIMARY_DOMAIN } from '../components/SEOHead';
import { API_URL } from '../utils/api';
import { calculateItemPrice } from '../utils/pricing';

const PricingCalculator = ({ pricing }: { pricing: { bw: number, color: number, binding: number } }) => {
  const [pages, setPages] = useState(10);
  const [colorMode, setColorMode] = useState<'B_AND_W' | 'COLOR'>('B_AND_W');
  const [sides, setSides] = useState<'FRONT_ONLY' | 'FRONT_AND_BACK'>('FRONT_AND_BACK');
  const [copies, setCopies] = useState(1);

  const price = calculateItemPrice({
    serviceType: 'A4_DOCUMENT',
    copies,
    colorMode,
    sides,
    pageCount: pages
  }, pricing);

  return (
    <div className="card" style={{ padding: '2rem', background: 'var(--paper)', borderRadius: 'var(--radius-2xl)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-md)', maxWidth: '500px', margin: '0 auto', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem', color: 'var(--color-accent)' }}>
        <Calculator size={20} />
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--ink)', margin: 0 }}>Try a Price</h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Pages</label>
          <input 
            type="range" 
            min="1" max="100" 
            value={pages} 
            onChange={(e) => setPages(parseInt(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--color-accent)' }}
          />
          <div style={{ textAlign: 'right', fontSize: '0.9rem', fontWeight: 700, color: 'var(--ink)' }}>{pages} pages</div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Print</label>
          <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--paper-sunk)', padding: '0.25rem', borderRadius: 'var(--radius-md)' }}>
            <button 
              onClick={() => setColorMode('B_AND_W')}
              style={{ flex: 1, padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: 'none', background: colorMode === 'B_AND_W' ? 'var(--paper)' : 'transparent', color: colorMode === 'B_AND_W' ? 'var(--ink)' : 'var(--text-muted)', fontWeight: colorMode === 'B_AND_W' ? 700 : 500, boxShadow: colorMode === 'B_AND_W' ? 'var(--shadow-sm)' : 'none', cursor: 'pointer', transition: 'all 0.2s' }}
            >B&W</button>
            <button 
              onClick={() => setColorMode('COLOR')}
              style={{ flex: 1, padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: 'none', background: colorMode === 'COLOR' ? 'var(--paper)' : 'transparent', color: colorMode === 'COLOR' ? 'var(--ink)' : 'var(--text-muted)', fontWeight: colorMode === 'COLOR' ? 700 : 500, boxShadow: colorMode === 'COLOR' ? 'var(--shadow-sm)' : 'none', cursor: 'pointer', transition: 'all 0.2s' }}
            >Colour</button>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Sides</label>
          <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--paper-sunk)', padding: '0.25rem', borderRadius: 'var(--radius-md)' }}>
            <button 
              onClick={() => setSides('FRONT_ONLY')}
              style={{ flex: 1, padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: 'none', background: sides === 'FRONT_ONLY' ? 'var(--paper)' : 'transparent', color: sides === 'FRONT_ONLY' ? 'var(--ink)' : 'var(--text-muted)', fontWeight: sides === 'FRONT_ONLY' ? 700 : 500, boxShadow: sides === 'FRONT_ONLY' ? 'var(--shadow-sm)' : 'none', cursor: 'pointer', transition: 'all 0.2s' }}
            >Single</button>
            <button 
              onClick={() => setSides('FRONT_AND_BACK')}
              style={{ flex: 1, padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: 'none', background: sides === 'FRONT_AND_BACK' ? 'var(--paper)' : 'transparent', color: sides === 'FRONT_AND_BACK' ? 'var(--ink)' : 'var(--text-muted)', fontWeight: sides === 'FRONT_AND_BACK' ? 700 : 500, boxShadow: sides === 'FRONT_AND_BACK' ? 'var(--shadow-sm)' : 'none', cursor: 'pointer', transition: 'all 0.2s' }}
            >Duplex</button>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Copies</label>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--paper-sunk)', padding: '0.25rem', borderRadius: 'var(--radius-md)' }}>
            <button onClick={() => setCopies(Math.max(1, copies - 1))} style={{ padding: '0.5rem', border: 'none', background: 'transparent', color: 'var(--ink)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><Minus size={18} /></button>
            <span style={{ fontWeight: 700, color: 'var(--ink)' }}>{copies}</span>
            <button onClick={() => setCopies(copies + 1)} style={{ padding: '0.5rem', border: 'none', background: 'transparent', color: 'var(--ink)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><Plus size={18} /></button>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px dashed var(--border-subtle)', display: 'flex', justifyItems: 'flex-end', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Estimated total</span>
        <AnimatePresence mode="popLayout">
          <motion.div 
            key={price}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--color-accent)', lineHeight: 1, fontFamily: 'monospace' }}
          >
            ₹{price}
          </motion.div>
        </AnimatePresence>
      </div>

      <Link to="/order" className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem', borderRadius: 'var(--radius-full)', padding: '0.85rem', display: 'flex', justifyContent: 'center' }}>
        Start printing →
      </Link>
    </div>
  );
};

const PricingPage: React.FC = () => {
  const [pricing, setPricing] = useState({ bw: 3, color: 12, binding: 35 });

  useEffect(() => {
    fetch(`${API_URL}/config`)
      .then(res => res.json())
      .then(data => {
        const rules = data.pricingRules || [];
        const bwRate = rules.find((r: any) => r.ruleKey === 'bw_page')?.price || 3;
        const colorRate = rules.find((r: any) => r.ruleKey === 'color_page')?.price || 12;
        const bindingRate = rules.find((r: any) => r.ruleKey === 'soft_binding')?.price || 35;
        setPricing({ bw: bwRate, color: colorRate, binding: bindingRate });
      })
      .catch(err => console.error('Failed to load dynamic pricing', err));
  }, []);

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "ZapPrints Student Document Printing",
      "description": "Affordable student document printing rates for B&W and Color prints at SRM KTR campus.",
      "image": `${PRIMARY_DOMAIN}/zap%20prints%20logo%20banner.png`,
      "brand": {
        "@type": "Brand",
        "name": "ZapPrints"
      },
      "offers": {
        "@type": "AggregateOffer",
        "priceCurrency": "INR",
        "lowPrice": `${pricing.bw}.00`,
        "highPrice": `${pricing.color}.00`,
        "offerCount": "2"
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
          "name": "Pricing",
          "item": `${PRIMARY_DOMAIN}/pricing`
        }
      ]
    }
  ];

  return (
    <div style={{ backgroundColor: 'var(--bg-page)', color: 'var(--text-main)', minHeight: '100vh', paddingBottom: '3rem' }}>
      <SEOHead
        title="Student Printing Rates & Pricing | ZapPrints"
        description="Clear, student-friendly printing pricing for SRM KTR students. Black & White A4 prints starting from ₹3/page and vibrant color prints from ₹12/page. Zero hidden charges."
        canonicalPath="/pricing"
        schema={schema}
      />

      <div style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--paper-raised)' }}>
        <div className="container" style={{ padding: '0.65rem var(--gutter)', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Link to="/" className="hover-link" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
          <span style={{ opacity: 0.5 }}>/</span>
          <span style={{ color: 'var(--color-accent)', fontWeight: 600 }}>Pricing</span>
        </div>
      </div>

      <section style={{ padding: '4rem 0 3rem 0', textAlign: 'center', borderBottom: '1px solid var(--border-subtle)', background: 'var(--paper)' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-accent)' }}>
            Transparent Rates
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.04em', marginTop: '0.5rem', marginBottom: '1rem', color: 'var(--ink)' }}>
            Simple Student-Friendly Pricing
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: '600px', margin: '0 auto 2.5rem auto' }}>
            No minimum order sizes. Pay solely for the pages you print with instant upfront pricing before checkout.
          </p>
          
          <div style={{ display: 'inline-flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', background: 'var(--paper-sunk)', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-subtle)' }}>
             <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--ink)' }}>Pages</span>
             <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>×</span>
             <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--ink)' }}>Print Type</span>
             <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>×</span>
             <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--ink)' }}>Copies</span>
             <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>=</span>
             <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-accent)' }}>Total</span>
          </div>
        </div>
      </section>

      <section style={{ padding: '4rem 0' }}>
        <div className="container" style={{ maxWidth: '1080px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
            
            {/* Standard B&W Printing */}
            <motion.div whileHover={{ scale: 0.99, translateY: -4 }} className="card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', borderRadius: 'var(--radius-2xl)', border: '2px solid var(--border-subtle)', background: 'var(--paper)', transition: 'border-color 0.3s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, background: 'var(--color-accent-subtle)', color: 'var(--color-accent)', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-full)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Most Popular
                </span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>B&W</span>
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--ink)' }}>Black &amp; White</h2>
              <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--ink)', marginBottom: '1.5rem', lineHeight: 1, fontFamily: 'monospace' }}>
                ₹{pricing.bw} <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-muted)', fontFamily: 'var(--font-sans)' }}>/ page</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                <li style={{ display: 'flex', gap: '0.5rem' }}>
                  <CheckCircle2 size={18} style={{ color: 'var(--color-accent)', flexShrink: 0, marginTop: '2px' }} />
                  <span>High-clarity 1200 DPI laser printing</span>
                </li>
                <li style={{ display: 'flex', gap: '0.5rem' }}>
                  <CheckCircle2 size={18} style={{ color: 'var(--color-accent)', flexShrink: 0, marginTop: '2px' }} />
                  <span>Best for lab records, assignments &amp; notes</span>
                </li>
              </ul>
            </motion.div>

            {/* High-Resolution Color Printing */}
            <motion.div whileHover={{ scale: 0.99, translateY: -4 }} className="card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', borderRadius: 'var(--radius-2xl)', border: '2px solid var(--border-subtle)', background: 'var(--paper)', transition: 'border-color 0.3s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, background: 'rgba(59,130,246,0.1)', color: '#2563eb', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-full)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Full Colour
                </span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Colour</span>
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--ink)' }}>Vibrant Colour</h2>
              <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--ink)', marginBottom: '1.5rem', lineHeight: 1, fontFamily: 'monospace' }}>
                ₹{pricing.color} <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-muted)', fontFamily: 'var(--font-sans)' }}>/ page</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                <li style={{ display: 'flex', gap: '0.5rem' }}>
                  <CheckCircle2 size={18} style={{ color: '#2563eb', flexShrink: 0, marginTop: '2px' }} />
                  <span>Vivid colour reproduction for graphs &amp; charts</span>
                </li>
                <li style={{ display: 'flex', gap: '0.5rem' }}>
                  <CheckCircle2 size={18} style={{ color: '#2563eb', flexShrink: 0, marginTop: '2px' }} />
                  <span>Best for project presentations &amp; reports</span>
                </li>
              </ul>
            </motion.div>

          </div>

        </div>
      </section>

      <section style={{ padding: '2rem 0 5rem 0' }}>
        <div className="container" style={{ maxWidth: '1080px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem', alignItems: 'start' }}>
            
            {/* Visual Explainers */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--ink)', marginBottom: '1rem' }}>Single vs Duplex</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={{ background: 'var(--paper)', padding: '1.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                     <div style={{ width: '40px', height: '56px', background: 'var(--paper-sunk)', border: '1px solid var(--border-subtle)', margin: '0 auto 1rem auto', position: 'relative', boxShadow: '2px 2px 0 var(--border-subtle)' }}>
                        <div style={{ position: 'absolute', top: 10, left: 8, right: 8, height: 2, background: 'var(--color-accent)' }}></div>
                        <div style={{ position: 'absolute', top: 16, left: 8, right: 8, height: 2, background: 'var(--border-hover)' }}></div>
                     </div>
                     <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0, color: 'var(--ink)' }}>Single</h4>
                     <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.25rem 0 0 0' }}>One printed side</p>
                  </div>
                  <div style={{ background: 'var(--paper)', padding: '1.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                     <div style={{ width: '40px', height: '56px', background: 'var(--paper-sunk)', border: '1px solid var(--border-subtle)', margin: '0 auto 1rem auto', position: 'relative', boxShadow: '-4px -4px 0 var(--paper), -5px -5px 0 var(--border-subtle)' }}>
                        <div style={{ position: 'absolute', top: 10, left: 8, right: 8, height: 2, background: 'var(--color-accent)' }}></div>
                        <div style={{ position: 'absolute', top: 16, left: 8, right: 8, height: 2, background: 'var(--border-hover)' }}></div>
                     </div>
                     <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0, color: 'var(--ink)' }}>Duplex</h4>
                     <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.25rem 0 0 0' }}>Front + back</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--ink)', marginBottom: '1rem' }}>Only print the pages you need</h3>
                <div style={{ background: 'var(--paper)', padding: '1.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                     <FileText size={20} style={{ color: 'var(--color-accent)' }} />
                     <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--ink)' }}>96-page PDF</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontFamily: 'monospace' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>1–10</span> <span>B&W</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>11–12</span> <span>Colour</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>20–25</span> <span>B&W</span></div>
                  </div>
                  <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px dashed var(--border-subtle)', fontSize: '0.85rem', fontWeight: 700, color: 'var(--ink)' }}>
                    Total: 18 pages selected
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Calculator */}
            <div>
              <PricingCalculator pricing={pricing} />
              <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                See your exact price before checkout.
              </div>
            </div>

          </div>
        </div>
      </section>

      <section style={{ padding: '0 0 5rem 0' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="card" style={{ padding: '2.5rem', textAlign: 'center', background: 'var(--paper-raised)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-2xl)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--ink)' }}>Have questions about bulk orders?</h3>
            <p style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '1.5rem', maxWidth: '400px', margin: '0 auto 1.5rem auto', lineHeight: 1.6 }}>
              Printing event booklets or entire course curriculum batches? Reach out directly via our contact channels.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/contact" className="btn btn-ghost" style={{ fontSize: '0.95rem', padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-full)' }}>
                Contact Team
              </Link>
              <Link to="/srm-ktr-printing" className="btn btn-ghost" style={{ fontSize: '0.95rem', color: 'var(--color-accent)', padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-full)' }}>
                SRM KTR Pickup Details →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;

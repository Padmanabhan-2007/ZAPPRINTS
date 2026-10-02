import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Clock, 
  Coffee, 
  ArrowRight, 
  Sparkles,
  Layers,
  MapPin,
  ChevronDown,
  FileCheck2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import SEOHead, { PRIMARY_DOMAIN } from '../components/SEOHead';
import Reveal from '../components/Reveal';
import SectionHead from '../components/SectionHead';

const HeroVisual = () => (
  <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '340px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      style={{ width: '100%', maxWidth: '380px' }}
    >
      <div style={{ padding: '1.5rem', background: 'var(--paper)', borderRadius: 'var(--radius-2xl)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-lg)' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
           <div style={{ padding: '0.85rem', background: 'var(--color-accent-subtle)', color: 'var(--color-accent)', borderRadius: 'var(--radius-md)' }}>
             <FileText size={28} />
           </div>
           <div>
             <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--ink)' }}>srm_assignment.pdf</div>
             <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>14 pages • A4</div>
           </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'var(--paper-sunk)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', border: '1px solid var(--border-subtle)' }}>
           <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)' }}>B&W, Duplex</span>
           <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--color-accent)' }}>₹42.00</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-success)', background: 'color-mix(in srgb, var(--color-success) 12%, transparent)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
           <Coffee size={18} />
           <span>Ready at Java Canteen: 12:00 PM</span>
        </div>
      </div>
    </motion.div>
  </div>
);

const DocWireframe = ({ type }: { type: 'lab' | 'report' | 'notes' }) => {
  return (
    <div style={{ width: '100%', height: '120px', background: 'var(--paper-sunk)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
      <div style={{ width: '80px', height: '110px', background: 'var(--paper-raised)', borderRadius: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid var(--border-subtle)', padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '4px', position: 'absolute', top: '15px' }}>
        <div style={{ width: '40%', height: '4px', background: 'var(--color-accent)', borderRadius: '2px', marginBottom: '4px' }}></div>
        <div style={{ width: '80%', height: '3px', background: 'var(--border-hover)', borderRadius: '2px' }}></div>
        <div style={{ width: '70%', height: '3px', background: 'var(--border-hover)', borderRadius: '2px' }}></div>
        <div style={{ width: '90%', height: '3px', background: 'var(--border-hover)', borderRadius: '2px' }}></div>
        {type === 'lab' && <div style={{ width: '100%', height: '24px', background: 'var(--paper-sunk)', borderRadius: '2px', marginTop: '4px' }}></div>}
        {type === 'report' && <div style={{ width: '60%', height: '3px', background: 'var(--border-hover)', borderRadius: '2px', marginTop: 'auto' }}></div>}
        {type === 'notes' && <><div style={{ width: '85%', height: '3px', background: 'var(--border-hover)', borderRadius: '2px' }}></div><div style={{ width: '75%', height: '3px', background: 'var(--border-hover)', borderRadius: '2px' }}></div></>}
      </div>
    </div>
  );
};

const FAQ_ITEMS = [
  {
    q: "Where can SRM KTR students pick up their prints?",
    a: "All print orders are delivered to the official pickup counter at Java Canteen, SRM KTR campus, during morning (7:00 AM – 7:50 AM) and afternoon (12:00 PM – 12:30 PM) sessions."
  },
  {
    q: "What are the printing rates for SRM students?",
    a: "Standard Black & White A4 prints start from ₹3 per page (both single and duplex). High-resolution color prints start from ₹12 per page."
  },
  {
    q: "What file types can I upload?",
    a: "We support PDF, PNG, and JPG/JPEG files. Upload your documents directly from your smartphone or laptop browser."
  },
  {
    q: "How does order cutoff work for same-day pickup?",
    a: "Orders placed before 6:59 AM are ready for the 7:00 AM morning slot. Orders placed before 11:40 AM are ready for the 12:00 PM afternoon slot at Java Canteen."
  },
  {
    q: "What happens immediately after completing UPI payment?",
    a: "Once your payment is verified via Razorpay, your order is assigned a unique tracking ID and queued on our automated print daemon. You can track your print progress in real time under My Orders."
  }
];

const SRMKtrPrinting: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "SRM KTR Online Printing Service",
      "serviceType": "Document Printing & Campus Delivery",
      "provider": {
        "@type": "Organization",
        "name": "ZapPrints",
        "url": PRIMARY_DOMAIN,
        "logo": `${PRIMARY_DOMAIN}/zap%20prints%20logo.png`
      },
      "areaServed": {
        "@type": "EducationalOrganization",
        "name": "SRM Institute of Science and Technology, Kattankulathur (SRM KTR)"
      },
      "description": "Fast online document printing for SRM KTR students. Upload PDFs, customize B&W or color, duplex or single-sided, and pick up at Java Canteen between class sessions.",
      "offers": {
        "@type": "Offer",
        "priceCurrency": "INR",
        "price": "3.00",
        "description": "Black & White A4 document printing starts at ₹3 per page."
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
          "name": "SRM KTR Printing Service",
          "item": `${PRIMARY_DOMAIN}/srm-ktr-printing`
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": FAQ_ITEMS.map(f => ({
        "@type": "Question",
        "name": f.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": f.a
        }
      }))
    }
  ];

  return (
    <div style={{ backgroundColor: 'var(--bg-page)', color: 'var(--text-main)', minHeight: '100vh' }}>
      <SEOHead
        title="SRM KTR Printing Service | Online Printouts & Delivery | ZapPrints"
        description="Fast online document printing for SRM KTR students. Upload PDFs, customize B&W or color, duplex or single-sided, and pick up at Java Canteen without waiting in lines."
        canonicalPath="/srm-ktr-printing"
        schema={schema}
      />

      {/* Breadcrumb Bar */}
      <div style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--paper-raised)' }}>
        <div className="container" style={{ padding: '0.65rem var(--gutter)', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Link to="/" className="hover-link" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
          <span style={{ opacity: 0.5 }}>/</span>
          <span style={{ color: 'var(--color-accent)', fontWeight: 600 }}>SRM KTR Printing</span>
        </div>
      </div>

      <main style={{ paddingBottom: '4rem' }}>
        {/* Hero Section */}
        <section style={{ padding: '4rem 0 3rem 0', borderBottom: '1px solid var(--border-subtle)', position: 'relative', overflow: 'hidden' }}>
          <div className="container" style={{ maxWidth: '1200px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3rem', alignItems: 'center' }} className="hero-grid">
              
              {/* Left Content */}
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1rem', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--color-accent-subtle)', color: 'var(--color-accent)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '1.5rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  <MapPin size={16} />
                  <span>Dedicated Campus Print Service · SRM IST KTR</span>
                </div>

                <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 3.5rem)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.15, marginBottom: '1.25rem', color: 'var(--ink)' }}>
                  Printing Service for <span style={{ color: 'var(--color-accent)' }}>SRM Students</span>
                </h1>

                <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.65, maxWidth: '580px', marginBottom: '2.5rem' }}>
                  Skip the chaotic xerox and print shop queues in Tech Park and Potheri. Upload your PDFs online, customize your print settings, and pick up your documents directly at <strong>Java Canteen</strong> between classes.
                </p>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <Link to="/order" className="btn btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1rem', fontWeight: 700, borderRadius: 'var(--radius-full)', gap: '0.5rem', display: 'inline-flex', alignItems: 'center' }}>
                    <span>Upload Document to Print</span>
                    <ArrowRight size={18} />
                  </Link>
                  <Link to="/pricing" className="btn" style={{ padding: '0.85rem 1.5rem', fontSize: '1rem', fontWeight: 700, borderRadius: 'var(--radius-full)', backgroundColor: 'var(--paper-sunk)', border: '1px solid var(--border-subtle)', color: 'var(--ink)', textDecoration: 'none' }}>
                    Check Transparent Rates
                  </Link>
                </div>
              </div>

              {/* Right Visual */}
              <div className="hero-visual-wrapper">
                <HeroVisual />
              </div>

            </div>
          </div>
        </section>

        {/* Student Use Cases */}
        <section style={{ padding: '5rem 0' }}>
          <div className="container" style={{ maxWidth: '1080px' }}>
            <SectionHead 
              title="What SRM Students Print with ZapPrints" 
              intro="Fast and accurate printing for daily academic submissions and projects." 
            />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '3rem' }}>
              
              <motion.div whileHover={{ scale: 0.98, translateY: -4 }} className="card" style={{ padding: 0, overflow: 'hidden', background: 'var(--paper)', borderRadius: 'var(--radius-2xl)', border: '1px solid var(--border-subtle)', transition: 'box-shadow 0.3s, border-color 0.3s' }}>
                <DocWireframe type="lab" />
                <div style={{ padding: '1.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div style={{ color: 'var(--color-accent)' }}><FileCheck2 size={24} /></div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--ink)' }}>Lab Records & Manuals</h3>
                  </div>
                  <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                    Print clean code outputs, graph pages, and experiment writeups in crisp monochrome or color duplex before your lab session begins.
                  </p>
                </div>
              </motion.div>

              <motion.div whileHover={{ scale: 0.98, translateY: -4 }} className="card" style={{ padding: 0, overflow: 'hidden', background: 'var(--paper)', borderRadius: 'var(--radius-2xl)', border: '1px solid var(--border-subtle)', transition: 'box-shadow 0.3s, border-color 0.3s' }}>
                <DocWireframe type="report" />
                <div style={{ padding: '1.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div style={{ color: 'var(--color-accent)' }}><Layers size={24} /></div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--ink)' }}>Project Reports & Dissertations</h3>
                  </div>
                  <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                    Capstone projects, mini-projects, and thesis documents formatted with precise page numbering, duplex alignment, and high-density text rendering.
                  </p>
                </div>
              </motion.div>

              <motion.div whileHover={{ scale: 0.98, translateY: -4 }} className="card" style={{ padding: 0, overflow: 'hidden', background: 'var(--paper)', borderRadius: 'var(--radius-2xl)', border: '1px solid var(--border-subtle)', transition: 'box-shadow 0.3s, border-color 0.3s' }}>
                <DocWireframe type="notes" />
                <div style={{ padding: '1.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div style={{ color: 'var(--color-accent)' }}><Sparkles size={24} /></div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--ink)' }}>Assignments & Notes</h3>
                  </div>
                  <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                    Upload multiple PDF handouts, lecture slides, and tutorial problem sets. Instant page-counting calculates your exact total upfront.
                  </p>
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* Pickup Schedule Bento */}
        <section style={{ backgroundColor: 'var(--paper-sunk)', padding: '5rem 0', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
          <div className="container" style={{ maxWidth: '980px' }}>
            <SectionHead 
              title="Collect at Java Canteen Twice Daily" 
              intro="Automated physical printing dispatched right before major class breaks." 
            />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginTop: '3rem' }}>
              <div className="card" style={{ padding: '2rem', background: 'var(--paper)', borderRadius: 'var(--radius-2xl)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-accent)', fontWeight: 800, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.85rem' }}>
                  <Clock size={20} />
                  <span>Morning Session</span>
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--ink)', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
                  7:00 AM – 7:50 AM
                </div>
                <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                  Place orders by <strong>6:59 AM</strong> to collect before your first hour lecture.
                </p>
              </div>

              <div className="card" style={{ padding: '2rem', background: 'var(--paper)', borderRadius: 'var(--radius-2xl)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-accent)', fontWeight: 800, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.85rem' }}>
                  <Clock size={20} />
                  <span>Afternoon Session</span>
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--ink)', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
                  12:00 PM – 12:30 PM
                </div>
                <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                  Place orders by <strong>11:40 AM</strong> to collect during your midday lunch interval.
                </p>
              </div>
            </div>

            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginTop: '3rem', padding: '1rem 1.5rem', background: 'var(--paper)', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-subtle)', fontSize: '1rem', color: 'var(--ink)', fontWeight: 700, margin: '3rem auto 0 auto', width: '100%', maxWidth: 'max-content' }}>
              <Coffee size={20} style={{ color: 'var(--color-accent)' }} />
              <span>Counter Location: Java Canteen, SRM KTR Main Campus</span>
            </div>
          </div>
        </section>

        {/* SRM FAQ */}
        <section style={{ padding: '5rem 0' }}>
          <div className="container" style={{ maxWidth: '820px' }}>
            <SectionHead 
              title="Everything You Need to Know About SRM Printing" 
              intro="Frequently asked questions by SRM students." 
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '3rem' }}>
              {FAQ_ITEMS.map((item, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <Reveal key={idx} delay={idx * 50}>
                    <motion.div 
                      className="faq-card" 
                      initial={false}
                      whileHover={{ scale: 0.995 }}
                      style={{ 
                        backgroundColor: 'var(--paper)',
                        borderRadius: 'var(--radius-xl)',
                        border: '1px solid var(--border-subtle)',
                        overflow: 'hidden',
                        transition: 'border-color 0.2s, box-shadow 0.2s',
                        boxShadow: isOpen ? '0 8px 30px rgba(0,0,0,0.04)' : 'none',
                        borderColor: isOpen ? 'var(--color-accent)' : 'var(--border-subtle)'
                      }} 
                    >
                      <button 
                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                        style={{ 
                          width: '100%', 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center', 
                          padding: '1.25rem 1.5rem',
                          background: 'transparent',
                          border: 'none',
                          textAlign: 'left',
                          cursor: 'pointer',
                          color: 'var(--ink)'
                        }}
                      >
                        <span style={{ fontWeight: 700, fontSize: '1.05rem', paddingRight: '1rem', lineHeight: 1.4 }}>{item.q}</span>
                        <motion.div
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                          style={{ flexShrink: 0, color: isOpen ? 'var(--color-accent)' : 'var(--text-muted)' }}
                        >
                          <ChevronDown size={20} strokeWidth={2.5} />
                        </motion.div>
                      </button>
                      
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                          >
                            <div style={{ 
                              padding: '0 1.5rem 1.25rem 1.5rem', 
                              fontSize: '0.95rem', 
                              color: 'var(--text-muted)', 
                              lineHeight: 1.6 
                            }}>
                              <div style={{ 
                                height: '1px', 
                                background: 'var(--border-subtle)', 
                                marginBottom: '1rem',
                                opacity: 0.5
                              }} />
                              {item.a}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* Practical Guides */}
        <section style={{ backgroundColor: 'var(--paper)', padding: '5rem 0', borderTop: '1px solid var(--border-subtle)' }}>
          <div className="container" style={{ maxWidth: '1080px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ maxWidth: '600px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-accent)' }}>
                  Student Guides & Tutorials
                </span>
                <h2 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em', marginTop: '0.5rem', color: 'var(--ink)' }}>
                  Step-by-Step Printing Advice
                </h2>
              </div>
              <Link to="/blog" className="hover-link" style={{ fontSize: '0.95rem', color: 'var(--color-accent)', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>View All Guides</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
              {[
                { title: 'How to Print College Assignments at SRM KTR', tag: 'Assignment Guide', desc: 'Formatting PDFs, margins, page order, and pickup tips for daily submissions.', link: '/blog/srm-assignment-printing' },
                { title: 'SRM Project Report Printing Guide', tag: 'Project Reports', desc: 'Capstone document preparation, duplex pagination, and team copies.', link: '/blog/srm-project-report-printing' },
                { title: 'Printing Lab Records at SRM KTR', tag: 'Lab Records', desc: 'Code snippets, circuit diagrams, waveforms, and duplex lab records.', link: '/blog/srm-lab-record-printing' }
              ].map((guide, i) => (
                <Link to={guide.link} key={i} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
                  <motion.div whileHover={{ scale: 0.98, translateY: -4 }} className="card" style={{ padding: '2rem', background: 'var(--paper-sunk)', borderRadius: 'var(--radius-2xl)', border: '1px solid var(--border-subtle)', height: '100%', display: 'flex', flexDirection: 'column', transition: 'box-shadow 0.3s, border-color 0.3s' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-accent)', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>{guide.tag}</span>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--ink)', marginBottom: '0.75rem', lineHeight: 1.4 }}>{guide.title}</h3>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.6, flex: 1, margin: 0 }}>{guide.desc}</p>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-accent)', marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      Read Guide <ArrowRight size={16} />
                    </span>
                  </motion.div>
                </Link>
              ))}
            </div>

            <div style={{ textAlign: 'center' }}>
              <Link to="/order" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.05rem', fontWeight: 700, borderRadius: 'var(--radius-full)', gap: '0.6rem', display: 'inline-flex', alignItems: 'center' }}>
                <span>Start Your SRM Print Order</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <style>{`
        @media (min-width: 900px) {
          .hero-grid { grid-template-columns: 1.2fr 1fr !important; gap: 4rem !important; }
          .hero-visual-wrapper { display: flex; justify-content: flex-end; }
        }
      `}</style>
    </div>
  );
};

export default SRMKtrPrinting;

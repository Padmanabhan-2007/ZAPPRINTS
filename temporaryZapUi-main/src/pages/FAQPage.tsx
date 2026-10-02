import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import SEOHead, { PRIMARY_DOMAIN } from '../components/SEOHead';
import SectionHead from '../components/SectionHead';
import Reveal from '../components/Reveal';

const FAQ_ITEMS = [
  {
    q: 'Which file formats does ZapPrints accept?',
    a: 'ZapPrints accepts PDF (.pdf), PNG (.png), and JPG/JPEG (.jpg, .jpeg) files. To ensure accurate page formatting and font rendering, please convert Word or PowerPoint files to PDF before uploading.'
  },
  {
    q: 'Where do I collect my printed documents?',
    a: 'All documents are collected directly at Java Canteen, SRM KTR campus during the daily designated collection windows.'
  },
  {
    q: 'What are the pickup hours and order cutoffs?',
    a: 'We operate two daily collection windows: Morning Session (7:00 AM – 7:50 AM with cutoff at 6:59 AM) and Afternoon Session (12:00 PM – 12:30 PM with cutoff at 11:40 AM).'
  },
  {
    q: 'How much does printing cost?',
    a: 'Standard Black & White A4 prints start from ₹3 per page. Full color A4 prints start from ₹12 per page. Both single-sided and double-sided (duplex) layouts are supported.'
  },
  {
    q: 'How do I specify double-sided (duplex) printing?',
    a: 'When customizing your uploaded file in the order builder, toggle the Layout setting to Double Sided. The page count estimate and pricing will adjust automatically.'
  },
  {
    q: 'How are my files protected?',
    a: 'Uploaded files are securely transmitted, held in private cloud storage solely for automated physical print execution, and permanently wiped once your order is processed.'
  },
  {
    q: 'What payment methods are supported?',
    a: 'We accept all major UPI apps (Google Pay, PhonePe, Paytm, BHIM) and debit/credit cards through our secure Razorpay gateway.'
  },
  {
    q: 'What if I need bulk prints for a club or department event?',
    a: 'For large volume orders, symposium booklets, or custom academic materials, you can contact our team directly via WhatsApp for coordinated handling.'
  }
];

const FAQPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": FAQ_ITEMS.map(item => ({
        "@type": "Question",
        "name": item.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.a
        }
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
          "name": "FAQ",
          "item": `${PRIMARY_DOMAIN}/faq`
        }
      ]
    }
  ];

  return (
    <div style={{ backgroundColor: 'var(--bg-page)', minHeight: '100vh' }}>
      <SEOHead
        title="Frequently Asked Questions — Campus Printing FAQ | ZapPrints"
        description="Find answers to common questions about ZapPrints online document printing, pickup slots at Java Canteen, supported file types, duplex printing, and pricing."
        canonicalPath="/faq"
        schema={schema}
      />

      {/* Breadcrumb - using standard theme colors */}
      <div style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--paper-raised)' }}>
        <div className="container" style={{ padding: '0.65rem var(--gutter)', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Link to="/" className="hover-link" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
          <span style={{ opacity: 0.5 }}>/</span>
          <span style={{ color: 'var(--color-accent)', fontWeight: 600 }}>FAQ</span>
        </div>
      </div>

      <main style={{ paddingBottom: '6rem' }}>
        <section className="block">
          <div className="container" style={{ maxWidth: '780px' }}>
            <SectionHead 
              title="Frequently Asked Questions" 
              intro="Everything you need to know about uploading, ordering, and collecting your campus printouts." 
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '2rem' }}>
              {FAQ_ITEMS.map((item, idx) => {
                const isOpen = openIndex === idx;
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
                        onClick={() => toggle(idx)}
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

            <Reveal delay={FAQ_ITEMS.length * 50 + 100}>
              <div 
                className="bento" 
                style={{ marginTop: '4rem' }}
              >
                <div className="tb tb-tan" style={{ alignItems: 'center', textAlign: 'center', padding: '2.5rem 1.5rem' }}>
                  <h3 className="tb-name" style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>Still have a question?</h3>
                  <p className="tb-desc" style={{ maxWidth: '40ch', margin: '0 auto 1.5rem auto' }}>
                    Chat with our team directly on WhatsApp for quick assistance regarding any print queries.
                  </p>
                  <a 
                    href="https://wa.me/917904447870" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="btn btn-primary"
                    style={{ textDecoration: 'none', borderRadius: 'var(--radius-full)' }}
                  >
                    <MessageSquare size={18} />
                    <span>WhatsApp +91 7904447870</span>
                  </a>
                </div>
              </div>
            </Reveal>

          </div>
        </section>
      </main>
    </div>
  );
};

export default FAQPage;

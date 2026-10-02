import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import LoadingScreen from '../components/LoadingScreen';
import HeroSheets from '../components/HeroSheets';
import PromoStrip from '../components/PromoStrip';
import Reveal from '../components/Reveal';
import SectionHead from '../components/SectionHead';
import SEOHead, { PRIMARY_DOMAIN } from '../components/SEOHead';
import { API_URL, fetchWithTimeout } from '../utils/api';

const STEPS = [
  { title: 'Upload', desc: 'Drop a PDF, PNG or JPG. We count the pages right in your browser.' },
  { title: 'Configure', desc: 'Copies, colour, sides. The price updates as you tap.' },
  { title: 'Pay', desc: 'UPI, GPay, Paytm or card through Razorpay.' },
  { title: 'Collect', desc: 'Your prints, neatly separated, waiting at Java Canteen.' },
];

const FAQS = [
  { q: 'Which file formats do you support?', a: 'We support PDF, PNG, and JPG/JPEG files.' },
  { q: 'Where do I collect my prints?', a: 'All print orders are collected at Java Canteen. Make sure to check your chosen time slot.' },
  { q: 'What is the cutoff time for same-day delivery?', a: 'Orders must be placed at least 1 minute before a delivery slot begins (cutoff is 6:59 AM for morning, 11:40 AM for afternoon). Orders placed after cutoff are delivered on the next session.' },
  { q: 'Are my files kept private?', a: 'Yes! Your documents are kept strictly confidential, processed securely for printing, and automatically removed after order completion.' },
  { q: 'How do I order double-sided prints?', a: 'When configuring your files, simply toggle the Layout option from Single Sided to Double Sided. The live estimate adjusts automatically.' },
];

const Home: React.FC = () => {
  const [pricing, setPricing] = useState<any>(null);
  const [activeBanner, setActiveBanner] = useState<any>(null);
  const [isBannerDismissed, setIsBannerDismissed] = useState<boolean>(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(0);
  const [isPageLoading, setIsPageLoading] = useState(true);

  const homeSchema = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "ZapPrints",
      "url": PRIMARY_DOMAIN,
      "description": "Smart campus online printing and automated printout delivery for SRM KTR students at Java Canteen.",
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${PRIMARY_DOMAIN}/order`,
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "ZapPrints",
      "url": PRIMARY_DOMAIN,
      "logo": `${PRIMARY_DOMAIN}/zap%20prints%20logo.png`,
      "sameAs": [
        "https://wa.me/917904447870"
      ]
    }
  ];

  useEffect(() => {
    // Fetch dynamic prices and active business controls
    fetchWithTimeout(`${API_URL}/config`)
      .then(res => res.json())
      .then(data => {
        if (data.activeBanner) {
          setActiveBanner(data.activeBanner);
        }
        const rules = data.pricingRules || [];
        const bwRate = rules.find((r: any) => r.ruleKey === 'bw_page')?.price || 3;
        const colorRate = rules.find((r: any) => r.ruleKey === 'color_page')?.price || 12;
        const bindingRate = rules.find((r: any) => r.ruleKey === 'soft_binding')?.price || 35;

        setPricing({
          bw: bwRate,
          color: colorRate,
          binding: bindingRate,
          photoBorderless: 45,
          photoBordered: 40,
          polaroid: 25
        });
      })
      .catch(err => console.error('Failed to load config', err))
      .finally(() => {
        setIsPageLoading(false);
      });
  }, []);

  const toggleFaq = (index: number) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  const bw = pricing?.bw || 3;
  const color = pricing?.color || 12;

  return (
    <div>
      <SEOHead
        title="Online Printing & Printout Delivery for SRM KTR Students | ZapPrints"
        description="Upload documents online, customize B&W or color, duplex or single-sided, and pick up fresh printouts at Java Canteen, SRM KTR campus without waiting in queues."
        canonicalPath="/"
        schema={homeSchema}
      />

      <LoadingScreen isLoading={isPageLoading} minDisplayTimeMs={800} />

      {/* ================= HERO ================= */}
      <section className="hero">
        <div className="container">
          {activeBanner && !isBannerDismissed && (
            <PromoStrip banner={activeBanner} onDismiss={() => setIsBannerDismissed(true)} />
          )}

          <div className="hero-panel">
            <div className="hero-grid">
              <div className="hero-left">
                <div className="hero-pill rise"><span className="dot-live" /> Java Canteen · SRM KTR</div>

                <h1 className="hero-title">
                  <span className="line rise" style={{ '--d': '60ms' } as React.CSSProperties}>Skip the</span>
                  <span className="line rise" style={{ '--d': '140ms' } as React.CSSProperties}>print-shop queue</span>
                  <span className="line rise" style={{ '--d': '220ms' } as React.CSSProperties}>
                    <span className="italic-accent">before class.</span>
                  </span>
                </h1>

                <div className="hero-copy rise" style={{ '--d': '300ms' } as React.CSSProperties}>
                  <p>
                    Upload from your phone or laptop. Set duplex or colour in a tap, then grab fresh prints at <strong>Java Canteen</strong> between classes.
                  </p>
                  <div className="hero-actions">
                    <Link to="/order" className="btn btn-white btn-lg">
                      Start printing <ArrowRight size={18} data-arrow />
                    </Link>
                    <a href="#pricing" className="link-arrow">View pricing <span className="arrow">↓</span></a>
                  </div>
                </div>
              </div>

              <HeroSheets bw={bw} />
            </div>

          </div>
        </div>
      </section>

      <section className="block" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="hero-facts rise" style={{ '--d': '420ms' } as React.CSSProperties}>
            <div><b>₹{bw}</b><span>B&amp;W per page</span></div>
            <div><b>2 / day</b><span>Pickup slots</span></div>
            <div><b>0 min</b><span>Queue time</span></div>
            <div><b>PDF · PNG · JPG</b><span>Accepted files</span></div>
          </div>
        </div>
      </section>

      {/* ================= 01 PRINT MENU ================= */}
      <section id="services" className="block">
        <div className="container">
          <SectionHead num="01" label="Print menu" title="What can you print?" intro="Assignments, project reports, posters and keepsakes." />
          <div className="bento menu">
            <Reveal className="tb tb-gradient tb-a4">
              <div className="tb-top"><span className="n">01</span><span className="tag">Available now</span></div>
              <div>
                <div className="tb-name">A4 documents</div>
                <p className="tb-desc">PDFs and images. Crisp monochrome or sharp full colour, single or duplex.</p>
                <div className="tb-price">From ₹{bw} <small>/ page</small></div>
                <Link to="/order" className="btn btn-white" style={{ marginTop: '1.25rem' }}>Start printing <ArrowRight size={16} data-arrow /></Link>
              </div>
            </Reveal>
            <Reveal delay={80} className="tb tb-tan">
              <div className="tb-top"><span className="n">02</span><span className="tag">Coming soon</span></div>
              <div><div className="tb-name">Photo prints</div><p className="tb-desc">Full-page gloss paper with rich, accurate colour.</p></div>
            </Reveal>
            <Reveal delay={160} className="tb tb-sun">
              <div className="tb-top"><span className="n">03</span><span className="tag">Coming soon</span></div>
              <div><div className="tb-name">Polaroids</div><p className="tb-desc">Instant-style keepsakes with white borders.</p></div>
            </Reveal>
            <Reveal delay={240} className="tb tb-sunk tb-wide">
              <div className="tb-top"><span className="n">04</span><span className="tag">Coming soon</span></div>
              <div><div className="tb-name">Soft binding</div><p className="tb-desc">Lab records and term projects with protective clear sheets.</p></div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ================= 02 HOW IT WORKS ================= */}
      <section id="how-it-works" className="block">
        <div className="container">
          <SectionHead title="Four taps. No queue." intro="From file to fresh prints at Java Canteen." />
          <div className="bento steps4">
            {STEPS.map((s, i) => (
              <Reveal key={s.title} delay={i * 80} className={`tb step-card ${i === 3 ? 'tb-orange' : 'tb-white'}`}>
                <div className="step-num">0{i + 1}</div>
                <div>
                  <h3>{s.title}</h3>
                  <p className="tb-desc">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 03 PRICING ================= */}
      <section id="pricing" className="block">
        <div className="container">
          <SectionHead num="03" label="Pricing" title="Student rates. Nothing hidden." intro="Pay only for what you print." />
          <div className="bento prices2">
            <Reveal className="tb tb-ink pp">
              <div className="tb-top"><span className="n">B&amp;W</span><span className="tag">Single or duplex</span></div>
              <div><div className="pp-amt"><sup>₹</sup>{bw}<small>/ page</small></div><div className="tb-name" style={{ fontSize: '1.5rem' }}>Black &amp; white</div></div>
            </Reveal>
            <Reveal delay={100} className="tb tb-orange pp">
              <div className="tb-top"><span className="n">Colour</span><span className="tag">Single or duplex</span></div>
              <div><div className="pp-amt"><sup>₹</sup>{color}<small>/ page</small></div><div className="tb-name" style={{ fontSize: '1.5rem' }}>Full colour</div></div>
            </Reveal>
          </div>
          <Reveal>
            <p className="price-note">Soft binding and photo prints are coming soon.</p>
          </Reveal>
        </div>
      </section>

      {/* ================= 04 PICKUP ================= */}
      <section className="block">
        <div className="container">
          <SectionHead title="Two pickups every day." intro="Prints reach Java Canteen twice daily. Order before the cutoff to collect between sessions." />
          <div className="bento slots2">
            <Reveal className="tb tb-tan">
              <div className="tb-top"><span className="n">Morning</span><span className="tag">Cutoff 6:59 AM</span></div>
              <div className="when">7:00 – 7:50 <small>AM</small></div>
            </Reveal>
            <Reveal delay={100} className="tb tb-sun">
              <div className="tb-top"><span className="n">Afternoon</span><span className="tag">Cutoff 11:40 AM</span></div>
              <div className="when">12:00 – 12:30 <small>PM</small></div>
            </Reveal>
          </div>
          <Reveal>
            <p className="price-note"><Link to="/srm-ktr-printing" className="link-arrow">Full SRM KTR schedule &amp; guide <span className="arrow">→</span></Link></p>
          </Reveal>
        </div>
      </section>

      {/* ================= 05 WHY ================= */}
      <section className="block">
        <div className="container">
          <SectionHead title="Built for the bell." />
          <div className="bento why2">
            <Reveal className="tb tb-white why-quote">
              <div className="tb-top"><span className="n">Student feedback</span></div>
              <blockquote>Saved my lab submission! Picked up my record sheet at Java Canteen five minutes before class.</blockquote>
              <span className="mono">SRM student</span>
            </Reveal>
            <Reveal delay={80} className="tb tb-tan">
              <div className="tb-name">Zero wait time</div>
              <p className="tb-desc">No lines before exams or lab classes. Pay online, then pick up.</p>
            </Reveal>
            <Reveal delay={160} className="tb tb-sun">
              <div className="tb-name">File privacy</div>
              <p className="tb-desc">Encrypted, printed automatically, deleted on completion.</p>
            </Reveal>
            <Reveal delay={240} className="tb tb-ink why-wide">
              <div className="tb-name">Fast turnaround</div>
              <p className="tb-desc">Order before the cutoff and your prints are ready on schedule.</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ================= 06 FAQ ================= */}
      <section id="faq" className="block">
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <Reveal className="text-center" delay={0}>
            <div style={{ marginBottom: '3rem' }}>
              <h2 className="sec-title" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}>Quick answers.</h2>
              <p className="sec-intro" style={{ margin: '1rem auto' }}>Still stuck? Message us on WhatsApp and we&apos;ll sort it.</p>
              <a href="https://wa.me/917904447870" target="_blank" rel="noreferrer" className="link-arrow" style={{ justifyContent: 'center' }}>WhatsApp us <span className="arrow">→</span></a>
            </div>
          </Reveal>
          <div className="faq">
            {FAQS.map((faq, idx) => (
              <div key={idx} className={`faq-item ${faqOpen === idx ? 'open' : ''}`}>
                <button type="button" className="faq-q" aria-expanded={faqOpen === idx} onClick={() => toggleFaq(idx)}>
                  <span className="n">0{idx + 1}</span>
                  <span>{faq.q}</span>
                  <span className="pm" aria-hidden="true" />
                </button>
                <div className="faq-a"><div><p>{faq.a}</p></div></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="cta" id="contact">
        <div className="container">
          <div className="cta-panel">
            <h2>Ready to print <span className="italic-accent">smartly?</span></h2>
            <div>
              <p>Upload your files, set your copies, collect at Java Canteen. Bulk orders or lab manuals? Message us on WhatsApp.</p>
              <div className="cta-actions">
                <Link to="/order" className="btn btn-white btn-lg">
                  Start printing <ArrowRight size={18} data-arrow />
                </Link>
                <a href="https://wa.me/917904447870" target="_blank" rel="noreferrer" className="link-arrow">
                  WhatsApp +91 7904447870 <span className="arrow">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

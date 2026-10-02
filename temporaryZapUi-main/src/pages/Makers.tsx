import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import './Makers.css';

interface MakerItem {
  id: string;
  index: string;
  name: string;
  category: string;
  contributions: string[];
}

const MAKERS: MakerItem[] = [
  {
    id: 'muhuntha',
    index: '01',
    name: 'MUHUNTHA',
    category: 'Architecture · Full-Stack & Print Agent Engineering · Product Direction',
    contributions: [
      'Frontend development',
      'Backend development',
      'Print Agent development',
      'Creative direction',
      'System architecture and technical decisions',
      'Product development and overall integration',
      'Business and operational decisions',
      'Overall project direction'
    ]
  },
  {
    id: 'mukesh',
    index: '02',
    name: 'MUKESH',
    category: 'Database Architecture & Data Integration',
    contributions: [
      'Database design and implementation',
      'Backend development',
      'Database integration and data management'
    ]
  },
  {
    id: 'mohith',
    index: '03',
    name: 'MOHITH',
    category: 'Backend & Print Hardware Workflow Integration',
    contributions: [
      'Backend development',
      'Print Agent development',
      'Printing workflow integration'
    ]
  },
  {
    id: 'devananth',
    index: '04',
    name: 'DEVANANTH',
    category: 'UI/UX Design & Creative Experience',
    contributions: [
      'UI/UX design',
      'Creative contributions'
    ]
  },
  {
    id: 'alwyn',
    index: '05',
    name: 'ALWYN',
    category: 'Print Agent Engineering & Data Flow Integration',
    contributions: [
      'Print Agent development',
      'Database development and integration',
      'Support for printing workflow and data management'
    ]
  }
];

const Makers: React.FC = () => {
  useEffect(() => {
    document.title = 'Makers // ZapPrints Core Roster';
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const muhuntha = MAKERS[0];
  const mukesh = MAKERS[1];
  const mohith = MAKERS[2];
  const devananth = MAKERS[3];
  const alwyn = MAKERS[4];

  return (
    <div className="makers-noir-page">
      <SEOHead
        title="Makers // ZapPrints Core Engineering &amp; Design Roster"
        description="The builders behind ZapPrints — crafting real-time hardware daemons, high-frequency print pipelines, and fluid campus interfaces."
        canonicalPath="/makers"
      />
      <div className="makers-grid-bg" aria-hidden="true" />
      <div className="makers-laser-glow" aria-hidden="true" />

      <div className="makers-noir-container">
        {/* ── Top Meta Header ── */}
        <div className="makers-meta-bar">
          <div className="makers-meta-left">
            <span className="makers-meta-dot" />
            <span className="makers-meta-tag">[ CORE ARCHIVE // 001 ]</span>
            <span>ZapPrints Engineering &amp; Design Roster</span>
          </div>
          <div>EST. 2026 // CAMPUS INFRASTRUCTURE</div>
        </div>

        {/* ── Monumental Editorial Hero ── */}
        <header className="makers-editorial-hero">
          <div className="makers-hero-row-top">
            <h1 className="makers-hero-title-massive">
              THE <span className="accent-char">MAKERS.</span>
            </h1>
            <div className="makers-hero-aside">
              <span className="makers-hero-aside-mono">// ARCHITECTURE &amp; CRAFT</span>
              <p className="makers-hero-aside-text">
                The five builders behind ZapPrints — crafting real-time hardware daemons, high-frequency print pipelines, and fluid human interfaces from scratch.
              </p>
            </div>
          </div>
        </header>

        {/* ── Dedication Vignette (Mom & Dad) ── */}
        <section className="makers-dedication-vignette" aria-label="Dedication to Parents">
          <div className="makers-dedication-kicker">
            <span>[ IMPRINT // 00 ]</span>
            <span>·</span>
            <span>HONORARY DEDICATION</span>
          </div>
          <h2 className="makers-dedication-heading">First, to Mom &amp; Dad.</h2>
          <p className="makers-dedication-body">
            &ldquo;Thank you for trusting my idea, believing in me, and supporting me enough to turn it into something real.
            <span className="highlight-line">This wouldn&apos;t have started without you. ❤️</span>&rdquo;
          </p>
        </section>

        {/* ── Personal Gratitude Vignette (Lunar) ── */}
        <section className="makers-lunar-vignette" aria-label="Special Gratitude to Lunar">
          <div className="makers-lunar-bg-glow" aria-hidden="true" />
          <div className="makers-lunar-kicker">
            <span className="makers-lunar-moon-icon">🌙</span>
            <span>[ IMPRINT // 00-B ]</span>
            <span>·</span>
            <span>PERSONAL GRATITUDE</span>
          </div>
          <div className="makers-lunar-content">
            <h2 className="makers-lunar-heading">
              And to Lunar.
            </h2>
            <p className="makers-lunar-body">
              &ldquo;Thank you for pushing me to keep working and believing in me through every failure. For always reminding me: 
              <span className="makers-lunar-quote-highlight">
                &lsquo;It&apos;s okay Muhuntha, try again. You can do it.&rsquo;
              </span>
              Whenever I fell down or felt like giving up, you gave me the hope to get back up and the encouragement to keep building.&rdquo;
            </p>
          </div>
        </section>

        {/* ── Team Section Header ── */}
        <div className="makers-section-divider">
          <span>// ROSTER OF CONTRIBUTORS</span>
          <span>[ 05 INDEPENDENT ARCHITECTS ]</span>
        </div>

        {/* ── Continuous Editorial Layouts (5 Distinct Compositions) ── */}
        <div className="makers-editorial-roster">
          {/* 01. MUHUNTHA — Monumental Full-Width Anchor */}
          <article className="maker-block-muhuntha" id={`maker-${muhuntha.id}`}>
            <div className="maker-muhuntha-top">
              <div className="maker-muhuntha-name-wrap">
                <span className="maker-index-label">[ {muhuntha.index} // CHIEF ARCHITECT ]</span>
                <h2 className="maker-display-name-hero">{muhuntha.name}</h2>
              </div>
              <div className="maker-muhuntha-role-box">
                {muhuntha.category}
              </div>
            </div>

            <div className="maker-muhuntha-grid">
              {muhuntha.contributions.map((item, idx) => (
                <div key={idx} className="maker-contribution-row-kinetic">
                  <span className="maker-kinetic-num">[{String(idx + 1).padStart(2, '0')}]</span>
                  <span className="maker-kinetic-text">{item}</span>
                </div>
              ))}
            </div>
          </article>

          {/* 02 & 03. MUKESH (Data Grid) + MOHITH (Industrial Daemon) — Asymmetric Pair */}
          <div className="makers-dual-asymmetric">
            {/* 02. MUKESH */}
            <article className="maker-block-mukesh" id={`maker-${mukesh.id}`}>
              <div>
                <div className="maker-editorial-header">
                  <span className="maker-index-label">[ {mukesh.index} // DATA ARCHITECTURE ]</span>
                  <h3 className="maker-display-name-mid">{mukesh.name}</h3>
                  <span className="maker-editorial-category">{mukesh.category}</span>
                </div>

                <div className="maker-data-stack">
                  {mukesh.contributions.map((item, idx) => (
                    <div key={idx} className="maker-data-item">
                      <span className="maker-data-item-mono">DB.{String(idx + 1).padStart(2, '0')}</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </article>

            {/* 03. MOHITH */}
            <article className="maker-block-mohith" id={`maker-${mohith.id}`}>
              <div>
                <div className="maker-editorial-header">
                  <span className="maker-index-label">[ {mohith.index} // HARDWARE PIPELINE ]</span>
                  <h3 className="maker-display-name-mid">{mohith.name}</h3>
                  <span className="maker-editorial-category">{mohith.category}</span>
                </div>

                <div className="maker-terminal-box">
                  {mohith.contributions.map((item, idx) => (
                    <div key={idx} className="maker-terminal-line">
                      <span className="maker-terminal-prompt">&gt;&gt;</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          </div>

          {/* 04 & 05. DEVANANTH (Creative Form) + ALWYN (Systems Flow) — Inverted Asymmetric Pair */}
          <div className="makers-dual-asymmetric-inverted">
            {/* 04. DEVANANTH */}
            <article className="maker-block-devananth" id={`maker-${devananth.id}`}>
              <div>
                <div className="maker-editorial-header">
                  <span className="maker-index-label">[ {devananth.index} // CREATIVE EXPERIENCE ]</span>
                  <h3 className="maker-display-name-mid">{devananth.name}</h3>
                  <span className="maker-editorial-category">{devananth.category}</span>
                </div>

                <div className="maker-creative-pills">
                  {devananth.contributions.map((item, idx) => (
                    <div key={idx} className="maker-creative-pill-item">
                      <span className="maker-creative-dot" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </article>

            {/* 05. ALWYN */}
            <article className="maker-block-alwyn" id={`maker-${alwyn.id}`}>
              <div>
                <div className="maker-editorial-header">
                  <span className="maker-index-label">[ {alwyn.index} // DATA &amp; AGENT WORKFLOWS ]</span>
                  <h3 className="maker-display-name-mid">{alwyn.name}</h3>
                  <span className="maker-editorial-category">{alwyn.category}</span>
                </div>

                <div className="maker-blueprint-rows">
                  {alwyn.contributions.map((item, idx) => (
                    <div key={idx} className="maker-blueprint-row">
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          </div>
        </div>

        {/* ── Visual Outro / Signature ── */}
        <footer className="makers-editorial-outro">
          <p className="makers-outro-heart-title">
            Made with ❤️ by the people behind ZapPrints.
          </p>

          <div className="makers-roster-roll">
            <span>Muhuntha</span>
            <span className="makers-roster-slash">/</span>
            <span>Mukesh</span>
            <span className="makers-roster-slash">/</span>
            <span>Mohith</span>
            <span className="makers-roster-slash">/</span>
            <span>Devananth</span>
            <span className="makers-roster-slash">/</span>
            <span>Alwyn</span>
          </div>

          <div className="makers-outro-actions">
            <Link to="/" className="makers-btn-noir-primary">
              <ArrowLeft size={16} />
              <span>Back to ZapPrints</span>
            </Link>
            <Link to="/order" className="makers-btn-noir-secondary">
              <span>Start Printing</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Makers;

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { Home, ArrowLeft, Printer, Sparkles } from 'lucide-react';

interface CutePrinter404Props {
  title?: string;
  message?: string;
  showOrderBtn?: boolean;
}

export const CutePrinter404: React.FC<CutePrinter404Props> = ({
  title = "404 - Page Not Found",
  message = "Looks like this page got jammed in the printer or never made it to the campus print queue!",
  showOrderBtn = true
}) => {
  const reduced = useReducedMotion();
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '75vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2.5rem 1.25rem',
      textAlign: 'center',
      userSelect: 'none',
      position: 'relative',
    }}>
      {/* ── Background Glow ── */}
      <div style={{
        position: 'absolute',
        top: '25%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '320px',
        height: '320px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, color-mix(in srgb, var(--color-accent-light) 12%, transparent) 0%, transparent 70%)',
        filter: 'blur(40px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* ══════════════════════════════════════════
           CUTE PRINTER & 404 PAPER APPARATUS
         ══════════════════════════════════════════ */}
      <div style={{ position: 'relative', width: '280px', height: '230px', marginBottom: '1.75rem', zIndex: 1 }}>
        
        {/* Floating Sparks/Confetti */}
        {!reduced && (
          <>
            <motion.div
              animate={{ y: [-4, 4, -4], rotate: [0, 15, 0], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              style={{ position: 'absolute', top: '10px', left: '15px', color: 'var(--orange)' }}
            >
              <Sparkles size={18} />
            </motion.div>
            <motion.div
              animate={{ y: [4, -5, 4], rotate: [0, -20, 0], opacity: [0.5, 0.9, 0.5] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              style={{ position: 'absolute', top: '25px', right: '15px', color: '#f59e0b' }}
            >
              <Sparkles size={15} />
            </motion.div>
          </>
        )}

        {/* ── 1. The Printed 404 Sheet (Emerging from top slot) ── */}
        <motion.div
          initial={reduced ? { opacity: 1, x: '-50%', y: 0 } : { opacity: 1, x: '-50%', y: 8 }}
          animate={reduced ? { opacity: 1, x: '-50%' } : { opacity: 1, x: '-50%', y: [-10, 0, -10] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            top: '0px',
            left: '50%',
            width: '180px',
            background: '#ffffff',
            borderRadius: '14px 14px 0 0',
            padding: '14px 14px 28px',
            border: '1.5px solid rgba(42,31,26,0.14)',
            boxShadow: '0 14px 30px -6px rgba(42,31,26,0.15), 0 2px 8px rgba(42,31,26,0.08)',
            zIndex: 1,
          }}
        >
          {/* Paper Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1.5px dashed rgba(42,31,26,0.18)', paddingBottom: '6px', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.62rem', fontWeight: 800, color: 'var(--orange)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>ZAPPRINTS</span>
            <span style={{ fontSize: '0.52rem', color: '#7a6a62', fontFamily: 'monospace', fontWeight: 800 }}>#404-ERR</span>
          </div>

          {/* 404 Big Stamp */}
          <div style={{ fontSize: '2.6rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.06em', lineHeight: 1, margin: '2px 0 3px' }}>
            404
          </div>

          <div style={{ fontSize: '0.64rem', fontWeight: 800, color: '#ef4444', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '8px' }}>
            Document Not Found
          </div>

          {/* Barcode lines graphic */}
          <div style={{ display: 'flex', gap: '2px', height: '14px', alignItems: 'center', justifyContent: 'center', opacity: 0.85 }}>
            {[3, 1, 4, 2, 5, 2, 1, 4, 2, 3, 5, 1, 2, 4, 3, 2, 1].map((w, i) => (
              <div key={i} style={{ width: `${w}px`, height: '100%', background: '#0f172a', borderRadius: '1px' }} />
            ))}
          </div>
        </motion.div>

        {/* ── 2. The Cute Printer Body ── */}
        <div style={{
          position: 'absolute',
          bottom: '0px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '240px',
          height: '115px',
          background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
          borderRadius: '20px',
          boxShadow: '0 20px 40px -8px rgba(15,23,42,0.4), 0 4px 12px rgba(15,23,42,0.15)',
          border: '1px solid rgba(255,255,255,0.1)',
          zIndex: 3,
          padding: '10px 14px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          {/* Top Paper Ejection Slot */}
          <div style={{
            position: 'absolute',
            top: '-7px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '190px',
            height: '10px',
            background: '#0a0f1d',
            borderRadius: '6px',
            border: '1px solid rgba(255,255,255,0.12)',
            boxShadow: 'inset 0 3px 6px rgba(0,0,0,0.8)',
          }} />

          {/* Printer Front Face */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px' }}>
            {/* Zap Prints logo mark */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: 'var(--orange)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Printer size={10} style={{ color: '#ffffff' }} />
              </div>
              <span style={{ fontSize: '0.62rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '0.04em' }}>ZapPrints</span>
            </div>

            {/* Cute blinking status LED */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <motion.div
                animate={reduced ? {} : { opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--color-accent-light)', boxShadow: '0 0 8px var(--color-accent-light)' }}
              />
              <span style={{ fontSize: '0.58rem', fontWeight: 700, color: '#94a3b8' }}>ONLINE</span>
            </div>
          </div>

          {/* Cute Face Screen */}
          <div style={{
            background: '#020617',
            borderRadius: '10px',
            padding: '7px 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(255,255,255,0.06)',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.8)',
          }}>
            {/* Cute Animated Eyes & Expression */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <motion.div
                animate={reduced ? {} : { scaleY: [1, 1, 0.1, 1] }}
                transition={{ duration: 3.5, repeat: Infinity, times: [0, 0.9, 0.95, 1] }}
                style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#38bdf8', boxShadow: '0 0 6px #38bdf8' }}
              />
              <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.08em', fontFamily: 'monospace' }}>
                404 JAM
              </span>
              <motion.div
                animate={reduced ? {} : { scaleY: [1, 1, 0.1, 1] }}
                transition={{ duration: 3.5, repeat: Infinity, times: [0, 0.9, 0.95, 1] }}
                style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#38bdf8', boxShadow: '0 0 6px #38bdf8' }}
              />
            </div>
          </div>

          {/* Bottom Tray & Accent Strip */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ width: '40px', height: '3px', background: 'rgba(255,255,255,0.1)', borderRadius: '99px' }} />
            <div style={{ fontSize: '0.52rem', color: '#64748b', letterSpacing: '0.06em', fontWeight: 600 }}>CAMPUS STATION 01</div>
            <div style={{ width: '40px', height: '3px', background: 'rgba(255,255,255,0.1)', borderRadius: '99px' }} />
          </div>
        </div>

        {/* Printer Shadow */}
        <div style={{
          position: 'absolute',
          bottom: '-12px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '210px',
          height: '14px',
          background: 'rgba(15,23,42,0.18)',
          borderRadius: '50%',
          filter: 'blur(6px)',
          zIndex: 0,
        }} />
      </div>

      {/* ══════════════════════════════════════════
           TITLE, DESCRIPTION & ACTION BUTTONS
         ══════════════════════════════════════════ */}
      <h1 style={{
        fontSize: 'clamp(1.6rem, 4vw, 2.1rem)',
        fontWeight: 800,
        color: '#0f172a',
        letterSpacing: '-0.03em',
        marginBottom: '0.5rem',
        zIndex: 1
      }}>
        {title}
      </h1>

      <p style={{
        fontSize: '0.95rem',
        color: '#64748b',
        maxWidth: '440px',
        lineHeight: 1.55,
        marginBottom: '1.75rem',
        zIndex: 1
      }}>
        {message}
      </p>

      {/* Navigation Buttons */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem',
        flexWrap: 'wrap',
        zIndex: 1
      }}>
        <button
          onClick={() => navigate(-1)}
          className="btn"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.7rem 1.3rem',
            borderRadius: '99px',
            border: '1px solid rgba(42,31,26,0.12)',
            background: '#ffffff',
            color: '#0f172a',
            fontSize: '0.88rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(42,31,26,0.06)',
            transition: 'all 0.2s ease',
          }}
        >
          <ArrowLeft size={16} /> Go Back
        </button>

        <Link
          to="/"
          className="btn"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.7rem 1.4rem',
            borderRadius: '99px',
            background: '#0a0a0a',
            color: '#ffffff',
            fontSize: '0.88rem',
            fontWeight: 700,
            textDecoration: 'none',
            boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
            transition: 'all 0.2s ease',
          }}
        >
          <Home size={16} /> Back to Home
        </Link>

        {showOrderBtn && (
          <Link
            to="/order"
            className="btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.7rem 1.4rem',
              borderRadius: '99px',
              background: 'var(--orange)',
              color: '#ffffff',
              fontSize: '0.88rem',
              fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 4px 14px color-mix(in srgb, var(--orange) 25%, transparent)',
              transition: 'all 0.2s ease',
            }}
          >
            <Printer size={16} /> Print a Document
          </Link>
        )}
      </div>

      {/* Helpful links row */}
      <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1.25rem', fontSize: '0.82rem', color: '#7a6a62', zIndex: 1 }}>
        <Link to="/orders" style={{ color: '#7a6a62', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
          My Orders
        </Link>
        <span>•</span>
        <Link to="/#pricing" style={{ color: '#7a6a62', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
          Pricing
        </Link>
        <span>•</span>
        <Link to="/#faq" style={{ color: '#7a6a62', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
          Help & FAQ
        </Link>
      </div>
    </div>
  );
};

export const NotFound: React.FC = () => {
  return <CutePrinter404 />;
};

export default NotFound;

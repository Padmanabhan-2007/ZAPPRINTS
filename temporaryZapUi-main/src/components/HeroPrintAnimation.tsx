import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'motion/react';
import { Check, MapPin, Clock, FileText, Printer } from 'lucide-react';

/* ── Status stages ── */
const STAGES = [
  { id: 'upload',   label: 'File Uploaded',   sub: 'DBMS_Notes.pdf · 2 pages',  icon: FileText },
  { id: 'print',    label: 'Printing Now',    sub: 'B&W · A4 · Duplex',          icon: Printer  },
  { id: 'ready',    label: 'Ready for Pickup', sub: 'Java Canteen · 7:00 AM',     icon: MapPin   },
];

export const HeroPrintAnimation: React.FC = () => {
  const reduced = useReducedMotion();
  const [stage, setStage] = useState(0);
  const [progress, setProgress] = useState(0);

  /* Cycle through stages */
  useEffect(() => {
    if (reduced) return;
    const interval = setInterval(() => {
      setStage(s => (s + 1) % STAGES.length);
      setProgress(0);
    }, 3000);
    return () => clearInterval(interval);
  }, [reduced]);

  /* Animate progress bar */
  useEffect(() => {
    if (reduced || stage !== 1) return;
    setProgress(0);
    const start = Date.now();
    const dur = 3000;
    const raf = () => {
      const pct = Math.min(100, ((Date.now() - start) / dur) * 100);
      setProgress(pct);
      if (pct < 100) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [stage, reduced]);

  return (
    <div
      className="hero-animation-container"
      style={{
        position: 'relative',
        width: '100%',
        height: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
      }}
    >
      {/* ── Ambient glow ── */}
      <div style={{
        position: 'absolute', top: '10%', right: '5%',
        width: '240px', height: '240px', borderRadius: '50%',
        background: 'radial-gradient(circle, color-mix(in srgb, var(--color-accent-light) 11%, transparent) 0%, transparent 65%)',
        filter: 'blur(30px)', pointerEvents: 'none',
      }} />

      {/* ══════════════════════════════════════════
           MAIN ORDER CARD (Squarer Aspect Ratio)
         ══════════════════════════════════════════ */}
      <motion.div
        initial={reduced ? {} : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: '100%',
          maxWidth: '390px',
          background: '#ffffff',
          borderRadius: '24px',
          border: '1px solid rgba(42,31,26,0.09)',
          boxShadow: '0 20px 50px -12px rgba(42,31,26,0.12), 0 4px 16px rgba(42,31,26,0.05)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* ── Card top accent strip ── */}
        <div style={{
          height: '4px',
          background: 'linear-gradient(90deg, #0a0a0a 0%, var(--orange) 100%)',
        }} />

        {/* ── Card header ── */}
        <div style={{
          padding: '14px 20px 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(42,31,26,0.07)',
        }}>
          <div>
            <div style={{ fontSize: '0.66rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#7a6a62', marginBottom: '2px' }}>
              Print Order
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
              #ZAP-2847
            </div>
          </div>

          {/* Live badge */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            padding: '4px 10px', borderRadius: '99px',
            background: stage === 2 ? 'color-mix(in srgb, var(--color-accent-light) 10%, transparent)' : 'rgba(42,31,26,0.05)',
            border: `1px solid ${stage === 2 ? 'color-mix(in srgb, var(--color-accent-light) 25%, transparent)' : 'rgba(42,31,26,0.1)'}`,
            transition: 'all 0.5s ease',
          }}>
            {reduced || stage !== 2 ? (
              <motion.div
                animate={!reduced && stage === 1 ? { opacity: [1, 0.3, 1] } : {}}
                transition={{ duration: 1.2, repeat: Infinity }}
                style={{ width: '6px', height: '6px', borderRadius: '50%', background: stage === 2 ? 'var(--orange)' : '#f59e0b', flexShrink: 0 }}
              />
            ) : (
              <Check size={11} style={{ color: 'var(--orange)' }} />
            )}
            <span style={{
              fontSize: '0.66rem', fontWeight: 700,
              color: stage === 2 ? 'var(--orange)' : '#7a6a62',
              transition: 'color 0.4s ease',
            }}>
              {stage === 0 ? 'Processing' : stage === 1 ? 'Printing' : 'Ready!'}
            </span>
          </div>
        </div>

        {/* ── File info ── */}
        <div style={{
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          borderBottom: '1px solid rgba(42,31,26,0.07)',
          background: 'rgba(248,248,246,0.5)',
        }}>
          {/* File icon */}
          <div style={{
            width: '40px', height: '48px', borderRadius: '7px',
            background: 'linear-gradient(160deg, #f8fafc 0%, #f1f5f9 100%)',
            border: '1px solid rgba(42,31,26,0.10)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, position: 'relative',
            boxShadow: '0 2px 6px rgba(42,31,26,0.05)',
          }}>
            <FileText size={17} style={{ color: '#0f172a' }} />
            <div style={{ fontSize: '0.4rem', fontWeight: 800, color: 'var(--orange)', letterSpacing: '0.05em', marginTop: '1px' }}>PDF</div>
            {/* Dog-ear */}
            <div style={{ position: 'absolute', top: 0, right: 0, width: '10px', height: '10px', background: '#e2e8f0', borderRadius: '0 7px 0 5px', borderLeft: '1px solid rgba(42,31,26,0.08)', borderBottom: '1px solid rgba(42,31,26,0.08)' }} />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', marginBottom: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              DBMS_Notes.pdf
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {['2 pages', 'A4', 'B&W', 'Duplex'].map(tag => (
                <span key={tag} style={{
                  fontSize: '0.62rem', fontWeight: 600, color: '#7a6a62',
                  background: 'rgba(42,31,26,0.06)',
                  padding: '1.5px 7px', borderRadius: '99px',
                  border: '1px solid rgba(42,31,26,0.08)',
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em' }}>₹6</div>
            <div style={{ fontSize: '0.58rem', color: '#7a6a62', fontWeight: 500 }}>₹3 × 2</div>
          </div>
        </div>

        {/* ── Animated Status Timeline ── */}
        <div style={{ padding: '14px 20px 16px' }}>
          
          {/* Steps */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0', position: 'relative' }}>
            {/* Connecting track */}
            <div style={{
              position: 'absolute',
              top: '13px',
              left: '15px',
              right: '15px',
              height: '2px',
              background: 'rgba(42,31,26,0.07)',
              borderRadius: '99px',
              zIndex: 0,
            }}>
              <motion.div
                animate={{ width: stage === 0 ? '0%' : stage === 1 ? '50%' : '100%' }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                style={{ height: '100%', background: 'linear-gradient(90deg, #0a0a0a, var(--orange))', borderRadius: '99px' }}
              />
            </div>

            {STAGES.map((s, i) => {
              const done = i < stage;
              const active = i === stage;
              return (
                <div key={s.id} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', position: 'relative', zIndex: 1 }}>
                  {/* Circle */}
                  <motion.div
                    animate={{
                      background: done ? 'var(--orange)' : active ? '#0a0a0a' : '#ffffff',
                      borderColor: done ? 'var(--orange)' : active ? '#0a0a0a' : 'rgba(42,31,26,0.18)',
                      scale: active ? 1.12 : 1,
                    }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      width: '26px', height: '26px', borderRadius: '50%',
                      border: '2px solid',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: active ? '0 0 0 3px rgba(10,10,10,0.08)' : done ? '0 0 0 3px color-mix(in srgb, var(--orange) 12%, transparent)' : 'none',
                    }}
                  >
                    <AnimatePresence mode="wait">
                      {done ? (
                        <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300 }}>
                          <Check size={12} style={{ color: '#ffffff' }} />
                        </motion.div>
                      ) : (
                        <motion.div key="dot" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                          <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: active ? '#ffffff' : 'rgba(42,31,26,0.25)' }} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Label */}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      fontSize: '0.63rem', fontWeight: 700,
                      color: done || active ? '#0f172a' : '#b0a097',
                      transition: 'color 0.4s',
                      lineHeight: 1.2,
                    }}>
                      {s.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Active stage detail ── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={stage}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25 }}
              style={{
                marginTop: '12px',
                padding: '10px 14px',
                background: 'rgba(248,248,246,0.8)',
                borderRadius: '12px',
                border: '1px solid rgba(42,31,26,0.07)',
              }}
            >
              {stage === 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(42,31,26,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <FileText size={14} style={{ color: '#7a6a62' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#0f172a' }}>File received</div>
                    <div style={{ fontSize: '0.62rem', color: '#7a6a62', marginTop: '1px' }}>Queued for next print batch</div>
                  </div>
                  <div style={{ marginLeft: 'auto' }}>
                    {!reduced && (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                        style={{ width: '14px', height: '14px', borderRadius: '50%', border: '2px solid rgba(42,31,26,0.12)', borderTopColor: '#0f172a' }}
                      />
                    )}
                  </div>
                </div>
              )}

              {stage === 1 && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(10,10,10,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Printer size={14} style={{ color: '#0f172a' }} />
                      </div>
                      <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#0f172a' }}>Printing…</div>
                    </div>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#0f172a' }}>
                      {reduced ? '68' : Math.round(progress)}%
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div style={{ height: '5px', background: 'rgba(42,31,26,0.07)', borderRadius: '99px', overflow: 'hidden' }}>
                    <motion.div
                      animate={{ width: reduced ? '68%' : `${progress}%` }}
                      transition={{ ease: 'linear', duration: 0.1 }}
                      style={{
                        height: '100%',
                        background: 'linear-gradient(90deg, #0a0a0a 0%, var(--orange) 100%)',
                        borderRadius: '99px',
                      }}
                    />
                  </div>
                  <div style={{ fontSize: '0.58rem', color: '#7a6a62', marginTop: '5px' }}>
                    Estimated: under 2 minutes
                  </div>
                </div>
              )}

              {stage === 2 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'color-mix(in srgb, var(--color-accent-light) 12%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid color-mix(in srgb, var(--color-accent-light) 20%, transparent)' }}>
                    <Check size={14} style={{ color: 'var(--orange)' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#0f172a' }}>Your prints are ready!</div>
                    <div style={{ fontSize: '0.62rem', color: '#7a6a62', marginTop: '1px' }}>Collect at Java Canteen · 7:00 AM slot</div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Pickup info footer ── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '11px 20px',
          borderTop: '1px solid rgba(42,31,26,0.07)',
          background: 'rgba(248,248,246,0.4)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '24px', height: '24px', borderRadius: '7px', background: 'color-mix(in srgb, var(--orange) 10%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MapPin size={12} style={{ color: 'var(--orange)' }} />
            </div>
            <div>
              <div style={{ fontSize: '0.66rem', fontWeight: 700, color: '#0f172a' }}>Java Canteen</div>
              <div style={{ fontSize: '0.55rem', color: '#7a6a62' }}>Pickup point</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '24px', height: '24px', borderRadius: '7px', background: 'rgba(42,31,26,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={12} style={{ color: '#7a6a62' }} />
            </div>
            <div>
              <div style={{ fontSize: '0.66rem', fontWeight: 700, color: '#0f172a' }}>7:00 – 7:50 AM</div>
              <div style={{ fontSize: '0.55rem', color: '#7a6a62' }}>Morning slot</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HeroPrintAnimation;


import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';

interface LoadingScreenProps {
  isLoading?: boolean;
  message?: string;
  subMessage?: string;
  onFinished?: () => void;
  minDisplayTimeMs?: number;
}

const statusPhrases = [
  'Warming up the rollers',
  'Loading paper',
  'Counting pages',
  'Aligning the printhead',
  'Almost off the press',
];

/**
 * Full-screen loader: a printer prints a sheet line by line while a big percentage counts up.
 * When loading finishes the whole screen lifts away like a sheet being torn off.
 * Same props as before; the animation itself is CSS (see `.pl-*` in global.css).
 */
export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  isLoading = true,
  message = 'Preparing your prints',
  subMessage,
  onFinished,
  minDisplayTimeMs = 1200,
}) => {
  const reduced = useReducedMotion();
  const [show, setShow] = useState(isLoading);
  const [phrase, setPhrase] = useState(0);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setShow(false);
        if (onFinished) onFinished();
      }, minDisplayTimeMs);
      return () => clearTimeout(timer);
    } else {
      setShow(true);
    }
  }, [isLoading, minDisplayTimeMs, onFinished]);

  // Rotate status phrases
  useEffect(() => {
    if (!show) return;
    const id = setInterval(() => setPhrase((p) => (p + 1) % statusPhrases.length), 1300);
    return () => clearInterval(id);
  }, [show]);

  // Percentage: eases toward 92 while loading, snaps to 100 once the page is ready
  useEffect(() => {
    if (!show) return;
    if (!isLoading) {
      setPct(100);
      return;
    }
    const id = setInterval(() => setPct((p) => (p >= 92 ? p : p + Math.max(1, Math.round((92 - p) * 0.08)))), 90);
    return () => clearInterval(id);
  }, [show, isLoading]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="pl-screen"
          role="status"
          aria-live="polite"
          aria-label="Loading"
          initial={{ y: 0 }}
          exit={reduced ? { opacity: 0, transition: { duration: 0.3 } } : { y: '-100%', transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] } }}
        >
          <div className="pl-top">
            <span className="pl-brand">ZAP<span>PRINTS</span></span>
            <span className="pl-msg">{message}</span>
          </div>

          <div className="pl-stage" aria-hidden="true">
            <div className="pl-printer">
              <div className="pl-lid" />
              <div className="pl-body">
                <span className="pl-label">ZP-01</span>
                <span className="pl-leds"><i /><i /></span>
                <span className="pl-slot" />
              </div>
              <div className="pl-paper">
                <div className="pl-sheet">
                  <b className="pl-ink pl-t" style={{ ['--i' as any]: 0 }}>Order slip</b>
                  <span className="pl-ink pl-l" style={{ ['--i' as any]: 1, width: '92%' }} />
                  <span className="pl-ink pl-l" style={{ ['--i' as any]: 2, width: '78%' }} />
                  <span className="pl-ink pl-l hl" style={{ ['--i' as any]: 3, width: '60%' }} />
                  <span className="pl-ink pl-l" style={{ ['--i' as any]: 4, width: '88%' }} />
                  <span className="pl-ink pl-l" style={{ ['--i' as any]: 5, width: '44%' }} />
                  <span className="pl-ink pl-block" style={{ ['--i' as any]: 6 }} />
                </div>
              </div>
            </div>
            <div className="pl-shadow" />
          </div>

          <div className="pl-bottom">
            <div className="pl-count"><b>{String(Math.min(pct, 100)).padStart(2, '0')}</b><span>%</span></div>
            <div className="pl-status">
              <AnimatePresence mode="wait">
                <motion.span
                  key={subMessage || phrase}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                >
                  {subMessage || statusPhrases[phrase]}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;

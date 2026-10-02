import React, { useEffect, useRef, useState } from 'react';
import { applyTheme, getSavedTheme, THEMES, type ThemeId } from '../utils/theme';

/** Palette picker. Selecting a theme cross-fades every accent colour on the site. */
const ThemeSwitcher: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const [current, setCurrent] = useState<ThemeId>(getSavedTheme());
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('touchstart', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('touchstart', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const choose = (id: ThemeId) => {
    setCurrent(id);
    applyTheme(id);
    setOpen(false);
  };

  const active = THEMES.find((t) => t.id === current) ?? THEMES[0];

  return (
    <div className="theme-switch" ref={ref}>
      <button
        type="button"
        className={`theme-btn ${compact ? 'compact' : ''}`}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={`Colour theme: ${active.name}`}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="theme-dot" />
        {!compact && <span>{active.name}</span>}
      </button>

      {open && (
        <div className="theme-menu" role="group" aria-label="Choose colour theme">
          {THEMES.map((t) => (
            <button key={t.id} type="button" className="theme-opt" aria-pressed={t.id === current} onClick={() => choose(t.id)}>
              <span className="sw" style={{ background: `radial-gradient(at 20% 100%, ${t.colors[0]}, ${t.colors[1]} 50%, ${t.colors[2]})` }} />
              <span>
                <b>{t.name}</b>
                <small>{t.hint}</small>
              </span>
              <span className="chk" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher;

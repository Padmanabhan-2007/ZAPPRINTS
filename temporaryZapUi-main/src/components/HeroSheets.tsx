import React from 'react';

/**
 * Hero visual: a fan of three printed sheets (lab record, colour poster, lecture notes)
 * with a price sticker and a pickup tag. Static; the stack fans out slightly on hover.
 */
const HeroSheets: React.FC<{ bw: number }> = ({ bw }) => (
  <div className="sheets rise" style={{ '--d': '300ms' } as React.CSSProperties} aria-hidden="true">
    {/* Back-left: lab record table */}
    <div className="sheet s1">
      <div className="sh-meta">Lab record · CSE 204</div>
      <div className="sh-title">Experiment 07</div>
      <div className="sh-table">
        {Array.from({ length: 18 }).map((_, i) => (
          <span key={i} className={i < 3 ? 'th' : ''} />
        ))}
      </div>
      <div className="sh-line" style={{ width: '82%' }} />
      <div className="sh-line" style={{ width: '64%' }} />
    </div>

    {/* Back-right: colour poster */}
    <div className="sheet s2">
      <div className="sh-poster">
        <b>TECH<br />FEST</b>
        <i />
      </div>
      <div className="sh-swatches"><span /><span /><span /><span /></div>
      <div className="sh-line" style={{ width: '70%' }} />
      <div className="sh-line" style={{ width: '48%' }} />
    </div>

    {/* Front: lecture notes */}
    <div className="sheet s3">
      <div className="sh-meta">Unit 3 · Normalisation</div>
      <div className="sh-title">DBMS Notes</div>
      <div className="sh-line" style={{ width: '96%' }} />
      <div className="sh-line" style={{ width: '90%' }} />
      <div className="sh-line hl" style={{ width: '74%' }} />
      <div className="sh-line" style={{ width: '93%' }} />
      <div className="sh-line" style={{ width: '58%' }} />
      <div className="sh-gap" />
      <div className="sh-line" style={{ width: '88%' }} />
      <div className="sh-line" style={{ width: '95%' }} />
      <div className="sh-line" style={{ width: '40%' }} />
    </div>

    <div className="sticker"><b>₹{bw}</b><span>per page</span></div>
    <div className="pickup-tag"><i /> Ready · Java Canteen · 7:00 AM</div>
  </div>
);

export default HeroSheets;

import React from 'react';
import { X } from 'lucide-react';

interface PromoStripProps {
  banner: any;
  onDismiss: () => void;
}

/**
 * Announcement banner from GET /config → activeBanner.
 * Same data + same link-safety rules as before; only the presentation changed.
 */
const PromoStrip: React.FC<PromoStripProps> = ({ banner, onDismiss }) => {
  const rawLink = banner.ctaLink ? String(banner.ctaLink).trim() : '';
  const isSafe =
    rawLink.startsWith('/') || rawLink.startsWith('#') || rawLink.startsWith('http://') || rawLink.startsWith('https://');
  const safeHref = isSafe ? rawLink : '#';

  return (
    <div className="strip" role="status">
      <div className="strip-main">
        {banner.offerValue && <span className="strip-badge">{banner.offerValue}</span>}
        <b>{banner.title}</b>
        <span>{banner.message}</span>
      </div>
      <div className="strip-actions">
        {banner.ctaText && (
          <a
            href={safeHref}
            target={safeHref.startsWith('http') ? '_blank' : undefined}
            rel={safeHref.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="link-arrow"
          >
            {banner.ctaText} <span className="arrow">→</span>
          </a>
        )}
        <button type="button" className="strip-close" onClick={onDismiss} aria-label="Dismiss announcement">
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default PromoStrip;

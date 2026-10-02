import React, { useEffect, useState } from 'react';
import GlowCursor from './GlowCursor/GlowCursor';
import { getSavedTheme } from '../utils/theme';

const THEME_MAPPING = {
  sunset: { primary: '#C96A24', secondary: '#F2C94C' },
  cobalt: { primary: '#1747D1', secondary: '#F2C94C' },
  lime: { primary: '#9CFF2E', secondary: '#D8FF5A' },
  cosmic: { primary: '#6D28D9', secondary: '#A855F7' },
  mono: { primary: '#FFFFFF', secondary: '#BDBDBD' }
};

const GlobalGlowCursor: React.FC = () => {
  const [activeTheme, setActiveTheme] = useState<keyof typeof THEME_MAPPING>(getSavedTheme() as keyof typeof THEME_MAPPING);

  useEffect(() => {
    // 1. Initial check (in case it drifted from getSavedTheme)
    const initialTheme = document.documentElement.getAttribute('data-theme') as keyof typeof THEME_MAPPING;
    if (initialTheme && THEME_MAPPING[initialTheme]) {
      setActiveTheme(initialTheme);
    }

    // 2. Observe changes to `data-theme` directly from the DOM!
    // This perfectly couples with the existing `ThemeSwitcher` without rewriting context
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
          const newTheme = document.documentElement.getAttribute('data-theme') as keyof typeof THEME_MAPPING;
          if (newTheme && THEME_MAPPING[newTheme]) {
            setActiveTheme(newTheme);
          }
        }
      }
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    return () => observer.disconnect();
  }, []);

  const config = THEME_MAPPING[activeTheme] || THEME_MAPPING.sunset;

  return (
    <GlowCursor 
      primary={config.primary} 
      secondary={config.secondary} 
      trailLength={36} 
      trailWidth={10} 
    />
  );
};

export default GlobalGlowCursor;

export const THEMES = [
  { id: 'sunset', name: 'Sunset', hint: 'Warm burnt orange', colors: ['#f8e95b', '#be722a', '#4a210a'] },
  { id: 'cobalt', name: 'Cobalt Sky', hint: 'Deep blue, warm yellow pop', colors: ['#8fd8ff', '#1f4fe0', '#081664'] },
  { id: 'lime', name: 'Lime Night', hint: 'Black & electric lime', colors: ['#c8ff2e', '#2f5e12', '#080b06'] },
  { id: 'cosmic', name: 'Cosmic', hint: 'Deep space violet', colors: ['#c9a6ff', '#6230d8', '#1d0f52'] },
  { id: 'mono', name: 'Mono', hint: 'Black & white', colors: ['#9a9a9a', '#464646', '#111111'] },
] as const;

export type ThemeId = (typeof THEMES)[number]['id'];

const KEY = 'zap_theme';

export const getSavedTheme = (): ThemeId => {
  try {
    const v = localStorage.getItem(KEY);
    return (THEMES.find((t) => t.id === v)?.id ?? 'sunset') as ThemeId;
  } catch {
    return 'sunset';
  }
};

/** Sets <html data-theme>; CSS custom properties cross-fade the whole site. */
export const applyTheme = (id: ThemeId, persist = true): void => {
  document.documentElement.setAttribute('data-theme', id);
  if (!persist) return;
  try {
    localStorage.setItem(KEY, id);
  } catch {
    /* storage unavailable (private mode) — theme still applies for this visit */
  }
};

/** Call once before first render so there is no flash of the wrong palette. */
export const initTheme = (): void => applyTheme(getSavedTheme(), false);

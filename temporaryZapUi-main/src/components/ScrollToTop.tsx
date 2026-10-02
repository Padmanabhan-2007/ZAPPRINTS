import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Ensures that upon route navigation in React Router, the window scroll position
 * resets cleanly to the top (0, 0) without awkward jumping or preserving previous scroll offsets.
 */
export const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

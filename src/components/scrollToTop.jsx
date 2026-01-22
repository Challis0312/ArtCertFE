import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**************************************************************************************************/

/**
 * @file        scrollToTop.jsx
 * @description Scrolls the window to top on route changes. 
 *              If there's a hash (#id) in the URL, attempt to scroll to that element instead.
 * 
 * @enterprise  UNIVERSITY OF MELBOURNE
 * @author      [Faaez Ahmed Kamal]
 * @created     09/10/2025
 * @license     -- tbd
 */

export default function ScrollToTop() {
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    
    // If navigating to an anchor, scroll that into view after paint
    if (hash) {
      const id = hash.replace('#', '');
      const timer = setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return;
        }

        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      }, 0);
      return () => clearTimeout(timer);
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [pathname, hash, key]);

  return null;
}

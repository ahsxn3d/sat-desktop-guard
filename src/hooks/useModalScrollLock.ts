import { useEffect } from 'react';

let lockCount = 0;
let originalOverflow = '';
let originalPaddingRight = '';

export function useModalScrollLock(isOpen: boolean) {
  useEffect(() => {
    if (!isOpen) return;

    if (lockCount === 0) {
      originalOverflow = document.body.style.overflow;
      originalPaddingRight = document.body.style.paddingRight;

      // Prevent scrollbar layout jump if scrollbar is present
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }

      // Lock document and body scrolling
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';

      // Pause Lenis smooth scroll while modal is active
      if (typeof window !== 'undefined' && (window as any).__lenis) {
        try {
          (window as any).__lenis.stop();
        } catch {
          // Ignore if lenis is not ready
        }
      }
    }
    lockCount++;

    return () => {
      lockCount--;
      if (lockCount <= 0) {
        lockCount = 0;
        document.body.style.overflow = originalOverflow || '';
        document.documentElement.style.overflow = '';
        document.body.style.paddingRight = originalPaddingRight || '';

        // Resume Lenis smooth scroll
        if (typeof window !== 'undefined' && (window as any).__lenis) {
          try {
            (window as any).__lenis.start();
          } catch {
            // Ignore if lenis is not ready
          }
        }
      }
    };
  }, [isOpen]);
}

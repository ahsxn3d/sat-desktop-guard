'use client';

import React, { useEffect } from 'react';
import { SessionProvider } from 'next-auth/react';

export function Providers({ children }: { children: React.ReactNode }) {
  // Ensure any leftover data-theme attributes or stored themes are cleaned up
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.removeAttribute('data-theme');
      try {
        localStorage.removeItem('sat_tracker_theme');
      } catch (e) {
        // ignore
      }
    }
  }, []);

  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}

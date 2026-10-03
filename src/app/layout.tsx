import type { Metadata, Viewport } from 'next';
import { Providers } from '@/components/Providers';
import { SmoothScroll } from '@/components/SmoothScroll';
import { ZenBotanicalsBackground } from '@/components/ZenBotanicalsBackground';
import '../index.css';

export const metadata: Metadata = {
  title: 'SAT Tracker | The Anti-Burnout Rulebook',
  description:
    'Structured anti-burnout SAT study plan with 90-minute daily cap timer, weekly pacing, mistake autopsy, and Bluebook arena tracker.',
  openGraph: {
    title: 'SAT Tracker — The Anti-Burnout Rulebook',
    description:
      'Structured anti-burnout SAT study plan with 90-minute daily cap timer, weekly pacing, mistake autopsy, and Bluebook arena tracker.',
    type: 'website',
  },
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Fraunces:ital,opsz,wght@0,9..144,600;0,9..144,700;0,9..144,800;0,9..144,900;1,9..144,700&family=JetBrains+Mono:wght@500;600;700;800&family=Outfit:wght@500;600;700;800;900&family=Plus+Jakarta+Sans:wght@500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#d7e5d2] text-[#122810] antialiased selection:bg-emerald-600 selection:text-white relative">
        <SmoothScroll />
        <ZenBotanicalsBackground />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

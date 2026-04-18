import type { Metadata, Viewport } from 'next';
import { IBM_Plex_Sans_Arabic, IBM_Plex_Mono, Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';

const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-arabic',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-latin',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ملاكي — مساعدك الذكي بالعربي',
  description:
    'منصة ذكاء اصطناعي عربية تجمع الكاتب والمبرمج والمصمم في مكان واحد.',
  keywords: ['ذكاء اصطناعي', 'عربي', 'كتابة', 'برمجة', 'تصميم', 'Malaky', 'ملاكي'],
  authors: [{ name: 'قصي كنعان' }],
  openGraph: {
    title: 'ملاكي — مساعدك الذكي بالعربي',
    description: 'ثلاثة أوضاع ذكية: الكاتب، المبرمج، والمصمم. كلها بالعربي.',
    locale: 'ar_SA',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#07070B',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${plexArabic.variable} ${inter.variable} ${spaceGrotesk.variable} ${plexMono.variable} dark`}
    >
      <body className="min-h-screen bg-background text-foreground antialiased">{children}</body>
    </html>
  );
}

import type { Metadata, Viewport } from 'next';
import { IBM_Plex_Sans_Arabic, IBM_Plex_Mono, Inter, Amiri } from 'next/font/google';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
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

// Display font — classical Arabic calligraphy for brand + headings
const amiri = Amiri({
  subsets: ['arabic', 'latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
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
  description: 'The sovereign AI agent of the Arab world.',
  keywords: ['ذكاء اصطناعي', 'عربي', 'Malaky', 'ملاكي'],
  authors: [{ name: 'قصي كنعان' }],
  openGraph: {
    title: 'ملاكي — مساعدك الذكي بالعربي',
    description: 'The sovereign AI agent of the Arab world.',
    locale: 'ar_SA',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#0B0906',
  width: 'device-width',
  initialScale: 1,
};

// Synchronous theme script prevents a flash of the wrong theme on load by
// applying the stored preference before first paint.
const THEME_INIT = `
(function(){try{
  var k=localStorage.getItem('malaky_theme');
  var c=(k==='light'||k==='dark'||k==='auto')?k:'dark';
  var r=c==='auto'?(matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'):c;
  var h=document.documentElement;
  h.classList.remove('light','dark');
  h.classList.add(r);
}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${plexArabic.variable} ${inter.variable} ${amiri.variable} ${plexMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}

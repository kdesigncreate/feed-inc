import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
// import { PerformanceOptimizer } from '@/components/PerformanceOptimizer';
// import ErrorBoundary from '@/components/ErrorBoundary';

// Configure Noto Sans JP with optimized preloading
const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-noto-sans-jp",
  weight: ["400", "700"], // Reduced weights to minimize unused preloads
  display: 'swap',
  preload: false, // Disable automatic preload to prevent warnings
  fallback: ['ui-sans-serif', 'system-ui', 'sans-serif'],
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: "プロモーション企画・制作会社 | リアル×デジタル支援 | 株式会社フィード",
  description: "フィードは、リアルとデジタルの両面からプロモーションやPR、ブランディングを支援する専門会社です。企業の成長をサポートする独自の企画・制作を提供しています",
  keywords: "プロモーション, 企画, 制作, デザイン, デジタルマーケティング, ブランディング, PR",
  authors: [{ name: "株式会社フィード" }],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico"
  },
  openGraph: {
    title: "プロモーション企画・制作会社 | 株式会社フィード",
    description: "リアルとデジタルの両面からプロモーションやPR、ブランディングを支援",
    url: "https://www.feed-inc.com/",
    siteName: "株式会社フィード",
    locale: "ja_JP",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link rel="canonical" href="https://www.feed-inc.com/" />
        <meta name="format-detection" content="telephone=no" />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <meta httpEquiv="x-dns-prefetch-control" content="off" />
      </head>
      <body className={`${notoSansJP.variable} font-noto-sans-jp antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

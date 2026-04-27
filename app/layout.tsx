import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const pixelFont = localFont({
  src: './fonts/pixel.ttf',
  variable: '--font-pixel',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://msh-google.vercel.app'),
  title: 'Not Google - مش جوجل',
  description: 'IR Practical Project Implementation 2026',
  openGraph: {
    title: 'Not Google - مش جوجل',
    description: 'IR Practical Project Implementation 2026',
    url: 'https://msh-google.vercel.app',
    siteName: 'Not Google - مش جوجل',
    images: [
      {
        url: '/og.jpg',
        width: 1200,
        height: 630,
        alt: 'Not Google - مش جوجل',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Not Google - مش جوجل',
    description: 'IR Practical Project Implementation 2026',
    images: ['/og.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className='h-full antialiased' suppressHydrationWarning suppressContentEditableWarning>
      <head />
      <body className={`${pixelFont.variable} min-h-full flex flex-col`}>{children}</body>
    </html>
  );
}

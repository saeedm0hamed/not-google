import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const pixelFont = localFont({
  src: './fonts/pixel.ttf',
  variable: '--font-pixel',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://sae8d-not-google.hf.space'),
  title: 'Not Google - مش جوجل',
  description: 'IR Practical Project Implementation 2026',
  icons: {
    icon: '/g.svg',
  },
  openGraph: {
    title: 'Not Google - مش جوجل',
    description: 'IR Practical Project Implementation 2026',
    images: [
      {
        url: '/og.jpg',
        width: 1200,
        height: 630,
        alt: 'Not Google - Retro Search',
      },
    ],
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

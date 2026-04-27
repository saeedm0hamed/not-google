import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const pixelFont = localFont({
  src: './fonts/pixel.ttf',
  variable: '--font-pixel',
});

export const metadata: Metadata = {
  title: 'Google - 1997 Retro Style',
  description: 'Google - 1997 Retro Style Search Engine',
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

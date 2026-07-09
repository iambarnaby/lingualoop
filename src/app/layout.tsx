import type { Metadata } from 'next';
import { Fraunces, DM_Sans, Newsreader } from 'next/font/google';
import Sidebar from '@/components/Sidebar';
import './globals.css';

const fraunces = Fraunces({
  variable: '--font-fraunces',
  subsets: ['latin'],
  display: 'swap',
});

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  display: 'swap',
});

const newsreader = Newsreader({
  variable: '--font-newsreader',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'LinguaLoop — Story-Driven Fluency',
  description: 'Learn languages through TPRS stories and common phrase practice.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${dmSans.variable} ${newsreader.variable} h-full antialiased`}
    >
      <body className="min-h-full flex">
        <Sidebar />
        <main className="flex-1 ml-[260px] min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}

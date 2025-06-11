import { Footer } from '@/globals/Footer/Component';
import { Header } from '@/globals/Header/Component';
import { Providers } from '@/providers';
import { getServerSideUrl } from '@/utilities/getServerSideUrl';
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph';
import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { draftMode } from 'next/headers';
import React from 'react';
import './styles.css';

const inter = Inter({ subsets: ['latin'] });

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode();

  // TODO: Does the html element need "suppressHydrationWarning"?
  return (
    <html lang="en" className={inter.className}>
      <head>
        <meta name="apple-mobile-web-app-title" content="NJSIG" />
      </head>
      <body className="flex flex-col min-h-screen bg-background text-foreground">
        <Providers>
          <Header />
          <main className="flex flex-col grow">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideUrl()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: 'NJSIG',
  },
};

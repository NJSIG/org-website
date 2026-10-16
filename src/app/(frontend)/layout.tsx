import { AdminBar } from '@/components/AdminBar';
import { Analytics } from '@/components/Analytics';
import { Footer } from '@/globals/Footer/Component';
import { Header } from '@/globals/Header/Component';
import { Providers } from '@/providers';
import '@/styles/app.styles.css';
import { getServerSideUrl } from '@/utilities/getServerSideUrl';
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph';
import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { draftMode } from 'next/headers';
import React from 'react';

const inter = Inter({ subsets: ['latin'] });

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode();

  return (
    <html lang="en" className={inter.className}>
      <head>
        <meta name="apple-mobile-web-app-title" content="NJSIG" />
      </head>
      <body className="bg-background text-foreground flex min-h-screen flex-col">
        <Providers>
          <Analytics />
          <AdminBar adminBarProps={{ preview: isEnabled }} />
          <Header />
          <main className="flex grow flex-col">{children}</main>
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

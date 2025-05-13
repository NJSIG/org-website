import { Footer } from '@/globals/Footer/Component';
import { Header } from '@/globals/Header/Component';
import { Providers } from '@/providers';
import { draftMode } from 'next/headers';
import React from 'react';
import './styles.css';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode();

  // TODO: Does the html element need "suppressHydrationWarning"?
  return (
    <html lang="en">
      <head>
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
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

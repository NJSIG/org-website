'use client';
import { useHeaderTheme } from '@/providers/HeaderTheme';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { Logo } from '@/components/Logo';
import type { Header } from '@/payload-types';
import { cn } from '@/utilities/cn';
import Link from 'next/link';

interface HeaderClientProps {
  data: Header;
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>('dark');
  const { headerTheme, setHeaderTheme } = useHeaderTheme();
  const pathname = usePathname();

  const baseStyles = 'w-full h-20';
  const darkStyles = 'bg-azure-to-r text-foreground-inverted';
  const lightStyles = 'bg-white text-foreground';

  // TODO: Do we really need to set the theme on every route change?
  // useEffect(() => {
  //   setHeaderTheme(null);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [pathname]);

  useEffect(() => {
    console.log('Set theme to:', headerTheme);
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme]);

  return (
    <header
      className={cn(baseStyles, theme === 'dark' ? darkStyles : lightStyles)}
      {...(theme ? { 'data-theme': theme } : {})}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4 xl:px-0">
        <Link href="/">
          <Logo style="wordmark" theme="dark" width={150} />
        </Link>
      </div>
    </header>
  );
};

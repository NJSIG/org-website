'use client';
import { useHeaderTheme } from '@/providers/HeaderTheme';
import React, { useEffect, useState } from 'react';

import { Button } from '@/components/Button';
import { Logo } from '@/components/Logo';
import type { Header } from '@/payload-types';
import { Theme } from '@/providers/Theme/types';
import { cn } from '@/utilities/cn';
import Link from 'next/link';

interface HeaderClientProps {
  data: Header;
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const { headerTheme } = useHeaderTheme();
  const [theme, setTheme] = useState<Theme | null>('dark');

  const { navGroups, ctaButtons } = data;

  const baseStyles = 'w-full h-20';
  const darkStyles = 'bg-azure-to-r text-foreground-inverted dark';
  const lightStyles = 'bg-white text-foreground';

  // TODO: Do we really need to set the theme on every route change?
  // const { headerTheme, setHeaderTheme } = useHeaderTheme();
  // const pathname = usePathname();
  // useEffect(() => {
  //   setHeaderTheme(null);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [pathname]);

  useEffect(() => {
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
          <Logo style="wordmark" theme={theme} width={150} />
        </Link>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2"></div>
          {ctaButtons &&
            ctaButtons.map(
              (ctaButton) => ctaButton.link && <Button link={ctaButton.link} key={ctaButton.id} />,
            )}
        </div>
      </div>
    </header>
  );
};

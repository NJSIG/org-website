'use client';
import { useHeaderTheme } from '@/providers/HeaderTheme';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import type { Header } from '@/payload-types';
import { cn } from '@/utilities/cn';

interface HeaderClientProps {
  data: Header;
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null);
  const { headerTheme, setHeaderTheme } = useHeaderTheme();
  const pathname = usePathname();

  const baseStyles = 'w-full h-20';
  const darkStyles = 'bg-azure-to-r';
  const lightStyles = 'bg-white';

  useEffect(() => {
    setHeaderTheme(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme]);

  return (
    <header
      className={cn(baseStyles, theme === 'dark' ? darkStyles : lightStyles)}
      {...(theme ? { 'data-theme': theme } : {})}
    ></header>
  );
};

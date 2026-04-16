'use client';

import { Templates } from '@/fields/DynamicBlocks/types';
import { useHeaderTheme } from '@/providers/HeaderThemeProvider';
import React, { useEffect } from 'react';

type PageClientProps = {
  template?: Templates;
};

const PageClient: React.FC<PageClientProps> = () => {
  const { setHeaderTheme } = useHeaderTheme();

  useEffect(() => {
    setHeaderTheme('dark');
  }, [setHeaderTheme]);

  return <React.Fragment />;
};

export default PageClient;

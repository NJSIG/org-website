'use client';

import { Templates } from '@/fields/dynamicBlocks/types';
import { useHeaderTheme } from '@/providers/HeaderTheme';
import { useSubfundTheme } from '@/providers/SubfundTheme';
import React, { useEffect } from 'react';

type PageClientProps = {
  template?: Templates;
};

const PageClient: React.FC<PageClientProps> = (props) => {
  const { setHeaderTheme } = useHeaderTheme();
  const { setSubfundTheme } = useSubfundTheme();

  useEffect(() => {
    setHeaderTheme('dark');
    setSubfundTheme(null);
  }, [setHeaderTheme, setSubfundTheme]);

  return <React.Fragment />;
};

export default PageClient;

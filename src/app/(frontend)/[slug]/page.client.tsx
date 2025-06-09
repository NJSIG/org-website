'use client';

import { SubfundTheme, Templates } from '@/fields/dynamicBlocks/types';
import { useHeaderTheme } from '@/providers/HeaderTheme';
import { useSubfundTheme } from '@/providers/SubfundTheme';
import React, { useEffect } from 'react';

type PageClientProps = {
  template?: Templates;
  subfund?: SubfundTheme | undefined | null;
};

const PageClient: React.FC<PageClientProps> = (props) => {
  const { template = 'default', subfund = null } = props;

  const { setHeaderTheme } = useHeaderTheme();
  const { setSubfundTheme } = useSubfundTheme();

  useEffect(() => {
    if (template === 'subfund') {
      setHeaderTheme('light');
    } else {
      setHeaderTheme('dark');
    }
  }, [template, setHeaderTheme]);

  useEffect(() => {
    if (template === 'subfund') {
      setSubfundTheme(subfund);
    } else {
      setSubfundTheme(null);
    }
  }, [subfund, template, setSubfundTheme]);

  return <React.Fragment />;
};

export default PageClient;

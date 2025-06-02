'use client';

import canUseDom from '@/utilities/canUseDom';
import { createContext, use, useCallback, useState } from 'react';
import { SubfundTheme } from '../Theme/types';

interface ContextType {
  subfundTheme?: SubfundTheme | null;
  setSubfundTheme: (subfundTheme: SubfundTheme | null) => void;
}

const initialContext: ContextType = {
  subfundTheme: undefined,
  setSubfundTheme: () => null,
};

const SubfundThemeContext = createContext(initialContext);

export const SubfundThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [subfundTheme, setThemeState] = useState<SubfundTheme | undefined | null>(
    canUseDom
      ? (document.documentElement.getAttribute('data-subfund-theme') as SubfundTheme)
      : undefined,
  );

  const setSubfundTheme = useCallback((themeToSet: SubfundTheme | null) => {
    setThemeState(themeToSet);
  }, []);

  return (
    <SubfundThemeContext value={{ subfundTheme, setSubfundTheme }}>{children}</SubfundThemeContext>
  );
};

export const useSubfundTheme = (): ContextType => use(SubfundThemeContext);

'use client';

import canUseDom from '@/utilities/canUseDom';
import { createContext, use, useCallback, useState } from 'react';
import { Theme } from '../Theme/types';

interface ContextType {
  headerTheme?: Theme | null;
  setHeaderTheme: (theme: Theme | null) => void;
}

const initialContext: ContextType = {
  headerTheme: undefined,
  setHeaderTheme: () => null,
};

const HeaderThemeContext = createContext(initialContext);

export const HeaderThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [headerTheme, setThemeState] = useState<Theme | undefined | null>(
    canUseDom ? (document.documentElement.getAttribute('data-theme') as Theme) : undefined,
  );

  const setHeaderTheme = useCallback((themeToSet: Theme | null) => {
    setThemeState(themeToSet);
  }, []);

  return (
    <HeaderThemeContext value={{ headerTheme, setHeaderTheme }}>{children}</HeaderThemeContext>
  );
};

export const useHeaderTheme = (): ContextType => use(HeaderThemeContext);

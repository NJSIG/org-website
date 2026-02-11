'use client';

import { createContext, useContext } from 'react';
import { PlausibleConfig } from './types';

const PlausibleConfigContext = createContext<PlausibleConfig | undefined>(undefined);

export function PlausibleConfigProvider({
  config,
  children,
}: {
  config: PlausibleConfig | undefined;
  children: React.ReactNode;
}) {
  return (
    <PlausibleConfigContext.Provider value={config}>{children}</PlausibleConfigContext.Provider>
  );
}

export function usePlausibleConfig() {
  return useContext(PlausibleConfigContext);
}

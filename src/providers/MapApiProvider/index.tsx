'use client';

import React, { createContext, useContext } from 'react';

const MapApiKeyContext = createContext<string>('');

export function MapApiProvider({
  apiKey,
  children,
}: {
  apiKey: string;
  children: React.ReactNode;
}) {
  return <MapApiKeyContext.Provider value={apiKey}>{children}</MapApiKeyContext.Provider>;
}

export function useMapApiKey() {
  return useContext(MapApiKeyContext);
}

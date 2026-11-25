'use client';

import { useSyncExternalStore } from 'react';

type ScreenSize = {
  width: number | undefined;
  height: number | undefined;
};

const serverSnapshot: ScreenSize = { width: undefined, height: undefined };

let snapshot = serverSnapshot;

const subscribe = (callback: () => void) => {
  window.addEventListener('resize', callback);

  return () => window.removeEventListener('resize', callback);
};

const getSnapshot = (): ScreenSize => {
  const { innerWidth: width, innerHeight: height } = window;

  if (snapshot.width !== width || snapshot.height !== height) {
    snapshot = { width, height };
  }

  return snapshot;
};

const getServerSnapshot = () => serverSnapshot;

export const useScreenSize = () => ({
  screenSize: useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot),
});

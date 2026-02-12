'use client';

import { usePlausibleConfig } from '@/providers/PlausibleConfigProvider';
import { useEffect } from 'react';

export const Analytics: React.FC = () => {
  const config = usePlausibleConfig();

  useEffect(() => {
    if (config === undefined) {
      console.warn('Plausible analytics is not configured, skipping initialization.');
      return;
    }

    // The Plausible tracker is client side only and appears to export location
    // at a top level, Next.JS SSR doesn't like that so we're doing a dynamic
    // import of the tracking function, this will only run once in the effect.

    (async () => {
      try {
        const { init } = await import('@plausible-analytics/tracker');

        init({
          domain: config.domain,
          endpoint: new URL('/api/event', config.host).toString(),
          outboundLinks: true,
          fileDownloads: true,
          formSubmissions: true,
          captureOnLocalhost: config.captureOnLocalhost,
          customProperties: (eventName): Record<string, string> => {
            return eventName === 'pageview' ? { title: document.title } : {};
          },
        });
      } catch (error) {
        // Prevent unhandled promise rejections if the import or init call fails
        console.error('Failed to initialize Plausible analytics:', error);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

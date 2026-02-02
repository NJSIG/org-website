'use client';

import { useEffect } from 'react';

export const Analytics: React.FC = () => {
  useEffect(() => {
    const domain = process.env.NEXT_PUBLIC_TRACKING_DOMAIN;
    const endpoint = process.env.NEXT_PUBLIC_PLAUSIBLE_ENDPOINT;

    if (!domain || !endpoint) {
      return;
    }

    // The Plausible tracker is client side only and appears to export location
    // at a top level, Next.JS SSR doesn't like that so were doing a dynamic
    // import of the tracking function, this will only run once in the effect.

    (async () => {
      const { init } = await import('@plausible-analytics/tracker');

      init({
        domain,
        endpoint,
        outboundLinks: true,
        fileDownloads: true,
        formSubmissions: true,
        captureOnLocalhost: true,
        customProperties: (eventName): Record<string, string> => {
          return eventName === 'pageview' ? { title: document.title } : {};
        },
      });
    })();
  }, []);

  return null;
};

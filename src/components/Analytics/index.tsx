'use client';

import { useEffect } from 'react';

export const Analytics: React.FC = () => {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  const host = process.env.NEXT_PUBLIC_PLAUSIBLE_HOST;
  const captureOnLocalhost = process.env.NEXT_PUBLIC_PLAUSIBLE_ON_LOCALHOST === 'true';

  useEffect(() => {
    if (!domain || !host) {
      return;
    }

    // The Plausible tracker is client side only and appears to export location
    // at a top level, Next.JS SSR doesn't like that so we're doing a dynamic
    // import of the tracking function, this will only run once in the effect.

    (async () => {
      try {
        const { init } = await import('@plausible-analytics/tracker');

        init({
          domain,
          endpoint: `${host}/api/event`,
          outboundLinks: true,
          fileDownloads: true,
          formSubmissions: true,
          captureOnLocalhost,
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

'use client';

import { useEffect } from 'react';

export const Analytics: React.FC = () => {
  useEffect(() => {
    const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
    const PLAUSIBLE_HOST = process.env.NEXT_PUBLIC_PLAUSIBLE_HOST;
    const PLAUSIBLE_ON_LOCALHOST = process.env.NEXT_PUBLIC_PLAUSIBLE_ON_LOCALHOST;

    console.group('Plausible Config');
    console.log('NEXT_PUBLIC_PLAUSIBLE_DOMAIN', PLAUSIBLE_DOMAIN);
    console.log('NEXT_PUBLIC_PLAUSIBLE_HOST', PLAUSIBLE_HOST);
    console.log('NEXT_PUBLIC_PLAUSIBLE_ON_LOCALHOST', PLAUSIBLE_ON_LOCALHOST);
    console.groupEnd();

    if (!PLAUSIBLE_DOMAIN || !PLAUSIBLE_HOST) {
      console.warn('Plausible analytics is not configured properly.');
      return;
    }

    // The Plausible tracker is client side only and appears to export location
    // at a top level, Next.JS SSR doesn't like that so we're doing a dynamic
    // import of the tracking function, this will only run once in the effect.

    (async () => {
      try {
        const { init } = await import('@plausible-analytics/tracker');

        init({
          domain: PLAUSIBLE_DOMAIN,
          endpoint: new URL('/api/event', PLAUSIBLE_HOST).toString(),
          outboundLinks: true,
          fileDownloads: true,
          formSubmissions: true,
          captureOnLocalhost: PLAUSIBLE_ON_LOCALHOST === 'true',
          customProperties: (eventName): Record<string, string> => {
            return eventName === 'pageview' ? { title: document.title } : {};
          },
        });
      } catch (error) {
        // Prevent unhandled promise rejections if the import or init call fails
        console.error('Failed to initialize Plausible analytics:', error);
      }
    })();
  }, []);

  return null;
};

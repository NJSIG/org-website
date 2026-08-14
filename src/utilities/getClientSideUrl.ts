import canUseDom from './canUseDom';

export const getClientSideUrl = () => {
  if (canUseDom) {
    const protocol = window.location.protocol;
    const domain = window.location.hostname;
    const port = window.location.port;

    console.log('Client Side URL - Can use DOM:', { protocol, domain, port });

    return `${protocol}//${domain}${port ? `:${port}` : ''}`;
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  console.log(
    'Client Side URL - Fallback to NEXT_PUBLIC_SERVER_URL:',
    process.env.NEXT_PUBLIC_SERVER_URL || '',
  );

  return process.env.NEXT_PUBLIC_SERVER_URL || '';
};

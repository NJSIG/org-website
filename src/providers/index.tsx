import { z } from 'zod';
import { HeaderThemeProvider } from './HeaderThemeProvider';
import { MapApiProvider } from './MapApiProvider';
import { PlausibleConfigProvider } from './PlausibleConfigProvider';
import { PlausibleConfigSchema } from './PlausibleConfigProvider/types';

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const mapsApiKey = process.env.NEXT_PUBLIC_MAPS_API_KEY || '';
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  const plausibleHost = process.env.NEXT_PUBLIC_PLAUSIBLE_HOST;
  const plausibleOnLocalhost = process.env.NEXT_PUBLIC_PLAUSIBLE_ON_LOCALHOST;

  const plausibleConfig = PlausibleConfigSchema.safeParse({
    domain: plausibleDomain,
    host: plausibleHost,
    captureOnLocalhost: plausibleOnLocalhost,
  });

  if (!plausibleConfig.success) {
    console.warn(
      'Invalid Plausible analytics configuration:',
      z.prettifyError(plausibleConfig.error),
    );
  }

  return (
    <PlausibleConfigProvider config={plausibleConfig.success ? plausibleConfig.data : undefined}>
      <MapApiProvider apiKey={mapsApiKey}>
        <HeaderThemeProvider>{children}</HeaderThemeProvider>
      </MapApiProvider>
    </PlausibleConfigProvider>
  );
};

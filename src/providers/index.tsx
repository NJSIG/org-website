import { HeaderThemeProvider } from './HeaderThemeProvider';
import { MapApiProvider } from './MapApiProvider';
import { PlausibleConfigProvider } from './PlausibleConfigProvider';
import { PlausibleConfigSchema } from './PlausibleConfigProvider/types';

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const mapsApiKey = process.env.NEXT_PUBLIC_MAPS_API_KEY || '';
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  const plausibleHost = process.env.NEXT_PUBLIC_PLAUSIBLE_HOST;
  const plausibleOnLocalhost = process.env.NEXT_PUBLIC_PLAUSIBLE_ON_LOCALHOST;

  let plausibleConfig = undefined;

  try {
    plausibleConfig = PlausibleConfigSchema.parse({
      domain: plausibleDomain,
      host: plausibleHost,
      captureOnLocalhost: plausibleOnLocalhost,
    });
  } catch (e) {
    console.warn('Plausible analytics is not configured properly:', e);
  }

  return (
    <PlausibleConfigProvider config={plausibleConfig}>
      <MapApiProvider apiKey={mapsApiKey}>
        <HeaderThemeProvider>{children}</HeaderThemeProvider>
      </MapApiProvider>
    </PlausibleConfigProvider>
  );
};

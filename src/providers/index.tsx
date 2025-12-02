import { HeaderThemeProvider } from './HeaderTheme';
import { MapApiProvider } from './MapApiProvider';

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const mapsApiKey = process.env.NEXT_PUBLIC_MAPS_API_KEY || '';

  return (
    <MapApiProvider apiKey={mapsApiKey}>
      <HeaderThemeProvider>{children}</HeaderThemeProvider>
    </MapApiProvider>
  );
};

import { MapApiProvider } from './MapApiProvider';

export const AdminProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const mapsApiKey = process.env.NEXT_PUBLIC_MAPS_API_KEY || '';

  return <MapApiProvider apiKey={mapsApiKey}>{children}</MapApiProvider>;
};

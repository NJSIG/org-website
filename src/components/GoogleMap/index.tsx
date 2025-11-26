import { GoogleMapClient, type MapClientProps } from './client';

export type MapProps = Omit<MapClientProps, 'apiKey'>;

/**
 * Server Component wrapper for GoogleMap.
 * Reads the API key from environment variables and passes it to the client component.
 * This ensures the API key is always available without needing to pass it as a prop.
 */
export function GoogleMap(props: MapProps) {
  const apiKey = process.env.NEXT_PUBLIC_MAPS_API_KEY || '';

  return <GoogleMapClient {...props} apiKey={apiKey} />;
}

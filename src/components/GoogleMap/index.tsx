import { GoogleMapClient, type MapClientProps } from './client';

export type MapProps = Omit<MapClientProps, 'apiKey'>;

export function GoogleMap(props: MapProps) {
  const apiKey = process.env.NEXT_PUBLIC_MAPS_API_KEY;

  if (!apiKey) {
    console.warn('Google Maps API key is not defined');
  }

  return <GoogleMapClient {...props} apiKey={apiKey || ''} />;
}

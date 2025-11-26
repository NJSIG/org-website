import { GoogleMapClient, type MapClientProps } from './client';

export type MapProps = Omit<MapClientProps, 'apiKey'>;

export function GoogleMap(props: MapProps) {
  const apiKey = process.env.NEXT_PUBLIC_MAPS_API_KEY;

  return <GoogleMapClient {...props} apiKey={apiKey || ''} />;
}

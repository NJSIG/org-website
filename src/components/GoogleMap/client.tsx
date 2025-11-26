'use client';

import { cn } from '@/utilities/cn';
import { MapPinXIcon } from 'lucide-react';

type LocationAddress = {
  name?: unknown;
  streetAddress?: unknown;
  streetAddress2?: unknown;
  city?: unknown;
  state?: unknown;
  zipCode?: unknown;
};

export type MapClientProps = {
  apiKey: string;
  location: LocationAddress;
  mode?: 'place' | 'view' | 'directions' | 'streetView' | 'search';
  height?: number;
  width?: number;
  admin?: boolean;
  containerClassName?: string;
  placeholderClassName?: string;
};

const defaultLocation: LocationAddress = {
  name: 'New Jersey Schools Insurance Group',
  streetAddress: '6000 Midlantic Drive',
  streetAddress2: 'Suite 300',
  city: 'Mount Laurel',
  state: 'NJ',
  zipCode: '08054',
};

export const GoogleMapClient = (props: MapClientProps) => {
  const {
    apiKey: apiKeyFromProps,
    mode = 'place',
    location = defaultLocation,
    height: heightFromProps = 400,
    width: widthFromProps,
    admin = false,
    containerClassName,
    placeholderClassName,
  } = props;

  // Fallback to direct env variable access if apiKey is not provided
  const apiKey = apiKeyFromProps || (typeof window !== 'undefined' ? '' : process.env.NEXT_PUBLIC_MAPS_API_KEY || '');
  
  const height = heightFromProps && heightFromProps >= 200 ? heightFromProps : 200;
  const width = widthFromProps && widthFromProps >= 200 ? widthFromProps : undefined;

  const query = Object.entries(location)
    // Filter out empty values
    .filter(([, value]) => Boolean(value))
    // Merge streetAddress and streetAddress2 if both are present
    .reduce((acc, [key, value]) => {
      if (key === 'streetAddress' || key === 'streetAddress2') {
        if (value) {
          acc.push(encodeURIComponent(value as string));
        }
      } else if (key !== 'streetAddress2') {
        acc.push(encodeURIComponent(value as string));
      }
      return acc;
    }, [] as string[])
    .join(',');
  
  const src = `https://www.google.com/maps/embed/v1/${mode}?key=${apiKey}&q=${query}`;
  const hasValidData = apiKey !== '' && location !== null && query !== '';

  return (
    <div
      className={cn({ 'njsig__map-container': admin, '': !admin }, containerClassName)}
      style={admin ? { height: `${height}px`, width: width ? `${width}px` : '100%' } : {}}
    >
      {hasValidData ? (
        <iframe
          width={width || '100%'}
          height={height}
          frameBorder="0"
          style={{ border: 0 }}
          referrerPolicy="no-referrer-when-downgrade"
          src={src}
          allowFullScreen
        ></iframe>
      ) : (
        <div
          className={cn(
            { 'njsig__map-container njsig__map-container__placeholder': admin, '': !admin },
            placeholderClassName,
          )}
          style={{ height: `${height}px`, width: width ? `${width}px` : '100%' }}
        >
          <MapPinXIcon size={48} />
        </div>
      )}
    </div>
  );
};

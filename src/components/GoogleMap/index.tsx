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

type MapProps = {
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

export const GoogleMap = (props: MapProps) => {
  const {
    mode = 'place',
    location = defaultLocation,
    height: heightFromProps = 400,
    width: widthFromProps,
    admin = false,
    containerClassName,
    placeholderClassName,
  } = props;

  const apiKey = process.env.NEXT_PUBLIC_MAPS_API_KEY;
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

  return (
    <div
      className={cn({ 'njsig__map-container': admin, '': !admin }, containerClassName)}
      style={admin ? { height: `${height}px`, width: width ? `${width}px` : '100%' } : {}}
    >
      {apiKey !== '' && location !== null && query !== '' ? (
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

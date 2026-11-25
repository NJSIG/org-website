'use client';

import { GoogleMap } from '@/components/GoogleMap';
import { useFormFields } from '@payloadcms/ui';
import { useEffect, useMemo, useState } from 'react';

type Props = {
  locationField?: string;
  collectionSlug?: string;
};

type LocationData = {
  name?: string;
  streetAddress?: string;
  streetAddress2?: string;
  city?: string;
  state?: string;
  zipCode?: string;
};

export const MapComponent: React.FC<Props> = ({
  locationField = 'location',
  collectionSlug = 'locations',
}) => {
  const formData = useFormFields(([fields]) => ({
    // Location Collection Fields
    name: fields.name,
    streetAddress: fields.streetAddress,
    streetAddress2: fields.streetAddress2,
    city: fields.city,
    state: fields.state,
    zipCode: fields.zipCode,
    // Location Relationship Field
    relatedLocation: fields[locationField],
  }));

  const formDataValues = useMemo(() => {
    return {
      name: (formData.name?.value || '') as string,
      streetAddress: (formData.streetAddress?.value || '') as string,
      streetAddress2: (formData.streetAddress2?.value || '') as string,
      city: (formData.city?.value || '') as string,
      state: (formData.state?.value || '') as string,
      zipCode: (formData.zipCode?.value || '') as string,
      relatedLocation: (formData.relatedLocation?.value || '') as string,
    };
  }, [
    formData.name?.value,
    formData.streetAddress?.value,
    formData.streetAddress2?.value,
    formData.city?.value,
    formData.state?.value,
    formData.zipCode?.value,
    formData.relatedLocation?.value,
  ]);

  const [fetched, setFetched] = useState<{
    id: string;
    collection: string;
    location: LocationData;
  } | null>(null);

  const relatedId = formDataValues.relatedLocation;

  useEffect(() => {
    if (!relatedId) {
      return;
    }

    let active = true;

    fetchLocationData(collectionSlug, relatedId).then((data) => {
      if (active) {
        setFetched({
          id: relatedId,
          collection: collectionSlug,
          location: {
            name: data.name || '',
            streetAddress: data.streetAddress || '',
            streetAddress2: data.streetAddress2 || '',
            city: data.city || '',
            state: data.state || '',
            zipCode: data.zipCode || '',
          },
        });
      }
    });

    return () => {
      active = false;
    };
  }, [collectionSlug, relatedId]);

  const location: LocationData = relatedId
    ? fetched?.id === relatedId && fetched.collection === collectionSlug
      ? fetched.location
      : {}
    : {
        name: formDataValues.name,
        streetAddress: formDataValues.streetAddress,
        streetAddress2: formDataValues.streetAddress2,
        city: formDataValues.city,
        state: formDataValues.state,
        zipCode: formDataValues.zipCode,
      };

  return <GoogleMap height={400} location={location} admin={true} />;
};

async function fetchLocationData(
  collectionSlug: string,
  locationID: string,
): Promise<LocationData> {
  try {
    const response = await fetch(`/api/${collectionSlug}/${locationID}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching location data:', error);
  }

  return {};
}

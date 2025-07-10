'use client';

import { GoogleMap } from '@/components/GoogleMap';
import { useFormFields } from '@payloadcms/ui';

type Props = {
  locationField?: string;
};

type LocationData = {
  name?: string;
  streetAddress?: string;
  streetAddress2?: string;
  city?: string;
  state?: string;
  zipCode?: string;
};

export const MapComponent: React.FC<Props> = ({ locationField = 'location' }) => {
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

  console.log('Form Data', formData);

  const location: LocationData = {
    name: (formData.name?.value || '') as string,
    streetAddress: (formData.streetAddress?.value || '') as string,
    streetAddress2: (formData.streetAddress2?.value || '') as string,
    city: (formData.city?.value || '') as string,
    state: (formData.state?.value || '') as string,
    zipCode: (formData.zipCode?.value || '') as string,
  };

  console.log('Location', location);

  return <GoogleMap height={400} location={location} admin={true} />;
};

'use client';

import { GoogleMap } from '@/components/GoogleMap';
import { useFormFields } from '@payloadcms/ui';

export const MapComponent: React.FC = () => {
  const name = useFormFields(([fields]) => fields.name);
  const streetAddress = useFormFields(([fields]) => fields.streetAddress);
  const streetAddress2 = useFormFields(([fields]) => fields.streetAddress2);
  const city = useFormFields(([fields]) => fields.city);
  const state = useFormFields(([fields]) => fields.state);
  const zipCode = useFormFields(([fields]) => fields.zipCode);

  return (
    <GoogleMap
      height={400}
      location={{
        name: name.value,
        streetAddress: streetAddress.value,
        streetAddress2: streetAddress2.value,
        city: city.value,
        state: state.value,
        zipCode: zipCode.value,
      }}
      admin={true}
    />
  );
};

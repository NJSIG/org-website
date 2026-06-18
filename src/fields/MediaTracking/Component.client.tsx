'use client';

import { useField } from '@payloadcms/ui';
import { JSONFieldClientComponent } from 'payload';

export const MediaTrackingFieldClientComponent: JSONFieldClientComponent = ({ path }) => {
  const { value } = useField({ path });

  return (
    <div>
      <h3>Media Usage Tracking</h3>
      <pre>{JSON.stringify(value, null, 2)}</pre>
    </div>
  );
};

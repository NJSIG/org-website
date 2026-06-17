import { JSONField } from 'payload';
import { schema } from './schema';

type MediaTrackingField = (label?: string) => JSONField;

export const mediaTrackingField: MediaTrackingField = (label = 'Media Usage Tracking') => {
  const jsonField: JSONField = {
    name: 'consumers',
    label,
    type: 'json',
    jsonSchema: {
      uri: 'urn:njsig:schemas:media-usage:v1',
      fileMatch: ['urn:njsig:schemas:media-usage:v1'],
      schema,
    },
    defaultValue: [],
    admin: {
      // TODO: Add a custom component to display the usage data in a more user-friendly way
    },
  };

  return jsonField;
};

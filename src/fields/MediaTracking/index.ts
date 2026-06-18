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
      readOnly: true,
      components: {
        Field: {
          path: '@/fields/MediaTracking/Component#MediaTrackingFieldComponent',
        },
      },
    },
  };

  return jsonField;
};

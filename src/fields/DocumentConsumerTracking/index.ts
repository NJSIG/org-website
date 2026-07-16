import { JSONField } from 'payload';
import { schema } from './schema';

type DocumentConsumerTrackingField = (label?: string) => JSONField;

export const documentConsumerTrackingField: DocumentConsumerTrackingField = (
  label = 'Document Usage Tracking',
) => {
  const jsonField: JSONField = {
    name: 'consumers',
    label,
    type: 'json',
    jsonSchema: {
      uri: 'urn:njsig:schemas:document-usage:v1',
      fileMatch: ['urn:njsig:schemas:document-usage:v1'],
      schema,
    },
    defaultValue: [],
    admin: {
      readOnly: true,
      components: {
        Field: {
          path: '@/fields/DocumentConsumerTracking/Component#DocumentConsumerTrackingFieldComponent',
        },
      },
    },
  };

  return jsonField;
};

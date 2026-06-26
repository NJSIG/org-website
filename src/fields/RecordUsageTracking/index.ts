import { JSONField } from 'payload';
import { schema } from './schema';

type RecordUsageTrackingField = (label?: string) => JSONField;

export const recordUsageTrackingField: RecordUsageTrackingField = (
  label = 'Record Usage Tracking',
) => {
  const jsonField: JSONField = {
    name: 'consumers',
    label,
    type: 'json',
    jsonSchema: {
      uri: 'urn:njsig:schemas:record-usage:v1',
      fileMatch: ['urn:njsig:schemas:record-usage:v1'],
      schema,
    },
    defaultValue: [],
    admin: {
      readOnly: true,
      components: {
        Field: {
          path: '@/fields/RecordUsageTracking/Component#RecordUsageTrackingFieldComponent',
        },
      },
    },
  };

  return jsonField;
};

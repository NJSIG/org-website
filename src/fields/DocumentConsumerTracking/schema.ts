import { JSONField } from 'payload';

export const schema: NonNullable<JSONField['jsonSchema']>['schema'] = {
  $id: 'urn:njsig:schemas:document-usage:v1',
  title: 'Consumers',
  description: 'A document consuming a tracked document',
  type: 'array',
  items: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        description: 'The unique identifier of the consumer',
      },
      titleField: {
        type: 'string',
        description: 'The field in the consumer document that is used as the title',
      },
      title: {
        type: 'string',
        description: 'The title of the consumer document',
      },
      collectionSlug: {
        type: 'string',
        description: 'The slug of the collection',
      },
      instances: {
        type: 'array',
        description: 'The path to the field in the consumer document that is consuming the record',
        items: {
          type: 'string',
        },
      },
    },
    required: ['id', 'titleField', 'title', 'collectionSlug', 'instances'],
  },
};

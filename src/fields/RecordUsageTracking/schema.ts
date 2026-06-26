import { JSONField } from 'payload';

export const schema: NonNullable<JSONField['jsonSchema']>['schema'] = {
  $id: 'urn:njsig:schemas:record-usage:v1',
  title: 'Consumers',
  description: 'A document consuming a record',
  type: 'array',
  items: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        description: 'The unique identifier of the consumer',
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
    required: ['id', 'title', 'collectionSlug', 'instances'],
  },
};

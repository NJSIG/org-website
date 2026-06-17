import { JSONField } from 'payload';

export const schema: NonNullable<JSONField['jsonSchema']>['schema'] = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  $id: 'urn:njsig:schemas:media-usage:v1',
  title: 'Consumers',
  description: 'A document consuming a media file',
  type: 'array',
  items: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        description: 'The unique identifier of the consumer',
      },
      name: {
        type: 'string',
        description: 'The nice name of the consumer',
      },
      collectionSlug: {
        type: 'string',
        description: 'The slug of the collection',
      },
    },
    required: ['id', 'name', 'collectionSlug'],
  },
};

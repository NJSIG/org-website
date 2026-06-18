import { JSONField } from 'payload';

export const schema: NonNullable<JSONField['jsonSchema']>['schema'] = {
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
      collectionSlug: {
        type: 'string',
        description: 'The slug of the collection',
      },
      instances: {
        type: 'array',
        description: 'The path to the field in the consumer document that is consuming the media',
        items: {
          type: 'string',
        },
      },
    },
    required: ['id', 'collectionSlug', 'instances'],
  },
};

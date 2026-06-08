import { admin, anyone } from '@/access';
import { slugField } from '@/fields/Slug';
import { CollectionConfig } from 'payload';

export const EventTypes: CollectionConfig<'event-types'> = {
  slug: 'event-types',
  access: {
    create: admin,
    delete: admin,
    read: anyone,
    update: admin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'order',
      type: 'number',
      required: true,
      admin: {
        description:
          'Determines the order of event types in dropdowns and lists. Lower numbers appear first.',
      },
    },
    ...slugField('name', {
      slugOverrides: {
        admin: {
          position: undefined,
        },
      },
    }),
  ],
  defaultSort: 'name',
  defaultPopulate: {
    name: true,
    slug: true,
  },
  admin: {
    defaultColumns: ['name', 'slug', 'order'],
    useAsTitle: 'name',
    group: 'Administration',
  },
};

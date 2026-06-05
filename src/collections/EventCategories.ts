import { admin, anyone } from '@/access';
import { slugField } from '@/fields/Slug';
import { CollectionConfig } from 'payload';

export const EventCategories: CollectionConfig<'event-categories'> = {
  slug: 'event-categories',
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
    defaultColumns: ['name', 'slug'],
    useAsTitle: 'name',
    group: 'Administration',
  },
};

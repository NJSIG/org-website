import { admin, editorOrPublished } from '@/access';
import { slugField } from '@/fields/slug';
import { CollectionConfig } from 'payload';

export const EventCategories: CollectionConfig<'event-categories'> = {
  slug: 'event-categories',
  access: {
    create: admin,
    delete: admin,
    read: editorOrPublished,
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
  admin: {
    defaultColumns: ['name', 'slug'],
    useAsTitle: 'name',
  },
};

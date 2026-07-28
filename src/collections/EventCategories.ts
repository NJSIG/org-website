import { admin, anyone } from '@/access';
import { slugField } from '@/fields/Slug';
import { CollectionConfig, TextFieldSingleValidation } from 'payload';

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
        required: true,
        admin: {
          position: undefined,
        },
      },
    }),
    {
      name: 'linkToSubfund',
      type: 'checkbox',
      label: 'Link to Sub-fund',
      defaultValue: false,
      admin: {
        description:
          'If checked, events in this category will display a link to the defined sub-fund.',
      },
    },
    {
      name: 'subfundSlug',
      type: 'text',
      label: 'Sub-fund Slug',
      validate: ((value, { siblingData }) => {
        const linkToSubfund = (siblingData as { linkToSubfund?: boolean })?.linkToSubfund;

        if (linkToSubfund && !value) {
          return 'Sub-fund slug is required when linking to a sub-fund.';
        }
        return true;
      }) as TextFieldSingleValidation,
      admin: {
        description: 'The slug defined in the sub-fund collection.',
        condition: (_, siblingData) => {
          const linkToSubfund = (siblingData as { linkToSubfund?: boolean })?.linkToSubfund;

          return linkToSubfund === true;
        },
      },
    },
  ],
  defaultSort: 'name',
  defaultPopulate: {
    name: true,
    slug: true,
  },
  admin: {
    defaultColumns: ['name', 'slug', 'linkToSubfund', 'subfundSlug'],
    useAsTitle: 'name',
    group: 'Administration',
  },
};

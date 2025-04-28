import { admin, anyone } from '@/access';
import { linkField } from '@/fields/link';
import { GlobalConfig } from 'payload';
import { revalidateHeaderHook } from './hooks/revalidateHeaderHook';

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: anyone,
    update: admin,
  },
  fields: [
    {
      name: 'navGroups',
      label: 'Navigation',
      type: 'array',
      fields: [
        {
          name: 'buttonText',
          type: 'text',
          required: true,
        },
        {
          name: 'callout',
          type: 'group',
          fields: [
            {
              name: 'title',
              label: 'Callout Title',
              type: 'text',
              required: true,
              maxLength: 100,
            },
            {
              name: 'text',
              label: 'Callout Text',
              type: 'textarea',
              required: true,
              maxLength: 300,
            },
            linkField({
              appearances: false,
              destinations: ['reference'],
              disableNewTab: true,
            }),
          ],
          admin: {
            hideGutter: true,
          },
        },
        // TODO: Add fields for navigation blocks
      ],
      admin: {
        components: {
          RowLabel: '@/globals/Header/NavRowLabel', // Custom row label component for the array field
        },
      },
    },
    // TODO: Add fields for cta buttons
  ],
  hooks: {
    afterChange: [revalidateHeaderHook],
  },
};

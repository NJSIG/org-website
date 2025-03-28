import { anyone } from '@/access/anyone';
import { linkGroupField } from '@/fields/linkGroup';
import { GlobalConfig } from 'payload';
import { revalidateFooterHook } from './hooks/revalidateFooterHook';

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: anyone, // Allow anyone to read the footer settings
  },
  fields: [
    {
      name: 'navGroups',
      type: 'array',
      maxRows: 6,
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          label: 'Group Label',
        },
        linkGroupField({
          appearances: false,
          overrides: {
            minRows: 1,
          },
        }),
      ],
      admin: {
        description: 'Add up to 6 navigation groups for the footer.',
        components: {
          RowLabel: '@/globals/Footer/GroupRowLabel', // Custom row label component for the array field
        },
      },
    },
    linkGroupField({
      appearances: false,
      overrides: {
        name: 'policyLinks',
        admin: {
          description: 'Add links to privacy policy, terms of use, etc.',
        },
      },
    }),
  ],
  hooks: {
    afterChange: [revalidateFooterHook],
  },
};

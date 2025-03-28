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
        {
          name: 'links',
          type: 'array',
          label: 'Links',
          minRows: 1,
          fields: [
            linkField({
              appearances: false,
            }),
          ],
          admin: {
            initCollapsed: true,
          },
        },
      ],
      admin: {
        description: 'Add up to 6 navigation groups for the footer.',
        components: {
          RowLabel: '@/globals/Footer/GroupRowLabel', // Custom row label component for the array field
        },
      },
    },
  ],
  hooks: {
    afterChange: [revalidateFooterHook],
  },
};

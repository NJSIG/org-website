import { anyone } from '@/access/anyone';
import { GlobalConfig } from 'payload';

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
          fields: [],
        },
      ],
      admin: {
        initCollapsed: true,
        description: 'Add up to 6 navigation groups for the footer.',
        components: {
          RowLabel: '@/globals/Footer/GroupRowLabel', // Custom row label component for the array field
        },
      },
    },
  ],
};

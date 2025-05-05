import { admin, anyone } from '@/access';
import { linkGroupField } from '@/fields/linkGroup';
import { GlobalConfig } from 'payload';
import { revalidateFooterHook } from './hooks/revalidateFooterHook';

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: anyone,
    update: admin,
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
          RowLabel: '@/globals/Footer/admin/NavGroupLabel',
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

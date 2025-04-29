import { admin, anyone } from '@/access';
import { linkField } from '@/fields/link';
import { lucideIconField } from '@/fields/lucideIcon';
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
          name: 'label',
          type: 'text',
          required: true,
          admin: {
            description:
              'Group label for the navigation links, will be displayed as the button text in the header.',
          },
        },
        {
          name: 'callout',
          type: 'group',
          fields: [
            {
              name: 'title',
              label: 'Title',
              type: 'text',
              required: true,
              maxLength: 100,
            },
            {
              name: 'text',
              label: 'Text',
              type: 'textarea',
              required: true,
              maxLength: 300,
            },
            linkField({
              appearances: false,
              destinations: ['reference'],
              disableNewTab: true,
              overrides: {
                name: 'Callout Link',
              },
            }),
          ],
          admin: {
            hideGutter: true,
            description:
              'Callouts occupy the first column of a navigation group, they display descriptive copy and a call to action.',
          },
        },
        {
          name: 'links',
          type: 'array',
          fields: [
            linkField({
              appearances: false,
              destinations: ['reference'],
              disableNewTab: true,
              disableLabel: true,
              overrides: {
                fields: [
                  {
                    type: 'row',
                    fields: [
                      lucideIconField({
                        overrides: {
                          label: 'Link Icon',
                        },
                      }),
                      {
                        name: 'linkTitle',
                        type: 'text',
                        required: true,
                        maxLength: 80,
                        admin: {
                          description:
                            'The primary link text should be a page title or concise label.',
                          width: '70%',
                        },
                      },
                    ],
                  },
                  {
                    name: 'linkDescription',
                    type: 'textarea',
                    required: false,
                    maxLength: 200,
                    admin: {
                      description:
                        'The secondary link text should be a short description of the link.',
                    },
                  },
                ],
              },
            }),
          ],
          admin: {
            initCollapsed: true,
            // TODO: Custom Row Label
          },
        },
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

import { admin, anyone } from '@/access';
import { linkField } from '@/fields/link';
import { linkGroupField } from '@/fields/linkGroup';
import { lucideIconPickerField } from '@/fields/lucideIconPicker';
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
      labels: {
        singular: 'Navigation Group',
        plural: 'Navigation Groups',
      },
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
              type: 'text',
              required: true,
              maxLength: 100,
            },
            {
              name: 'text',
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
                      lucideIconPickerField({
                        overrides: {
                          name: 'linkIcon',
                          label: 'Link Icon',
                          admin: {
                            width: '30%',
                          },
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
            description: 'Links are displayed using grid layout from left to right, top to bottom.',
            components: {
              RowLabel: '@/globals/Header/admin/NavLinkLabel',
            },
          },
        },
      ],
      admin: {
        components: {
          RowLabel: '@/globals/Header/admin/NavGroupLabel',
        },
      },
    },
    linkGroupField({
      appearances: ['cta'],
      variants: {
        styles: ['flat'],
        colors: ['primary', 'accent'],
        sizes: ['small'],
        icons: ['before'],
      },
      destinations: ['reference'],
      disableNewTab: true,
      overrides: {
        name: 'ctaButtons',
        label: 'Call to Action Buttons',
        labels: {
          singular: 'Call to Action Button',
          plural: 'Call to Action Buttons',
        },
        maxRows: 3,
      },
    }),
  ],
  hooks: {
    afterChange: [revalidateHeaderHook],
  },
};

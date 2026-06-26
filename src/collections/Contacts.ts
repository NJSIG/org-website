import { anyone, editor } from '@/access';
import { createUpdateConsumedRecordHook } from '@/fields/hooks/updateConsumedRecordHook';
import { patternField } from '@/fields/Pattern';
import { CollectionConfig } from 'payload';

export enum ContactTypeValues {
  NJSIG = 'njsig',
  Broker = 'broker',
  Trustee = 'trustee',
}

export const Contacts: CollectionConfig<'contacts'> = {
  slug: 'contacts',
  access: {
    create: editor,
    delete: editor,
    read: anyone,
    update: editor,
  },
  trash: true,
  folders: true,
  admin: {
    defaultColumns: ['portrait', 'type', 'name', 'title', 'organization'],
    useAsTitle: 'name',
  },
  // This config controls what's populated by default when a page is referenced
  // https://payloadcms.com/docs/queries/select#defaultpopulate-collection-config-property
  // Type safe if the collection slug generic is passed to `CollectionConfig` - `CollectionConfig<'pages'>
  defaultPopulate: {
    portrait: true,
    type: true,
    name: true,
    title: true,
    organization: true,
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          type: 'group',
          fields: [
            {
              name: 'portrait',
              type: 'upload',
              relationTo: 'contact-portraits',
              admin: {
                description:
                  'Portraits should be square and at least 250x250 pixels. A placeholder will be used if no image is assigned to this contact.',
              },
              hooks: {
                afterChange: [createUpdateConsumedRecordHook('name')],
              },
            },
            {
              name: 'type',
              type: 'select',
              required: true,
              options: [
                { label: 'NJSIG', value: ContactTypeValues.NJSIG },
                { label: 'Broker', value: ContactTypeValues.Broker },
                { label: 'Trustee', value: ContactTypeValues.Trustee },
              ],
              admin: {
                isClearable: false,
                description:
                  'The user type helps differentiate between NJSIG staff, brokers, and trustees.',
              },
            },
          ],
          admin: {
            width: '30%',
          },
        },
        {
          type: 'group',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
              admin: {
                description: 'The full name of the contact person.',
              },
            },
            {
              name: 'title',
              type: 'text',
              localized: true,
              admin: {
                description: "The contact person's job title.",
              },
            },
            {
              name: 'organization',
              type: 'text',
              admin: {
                description: 'The organization the contact person is affiliated with.',
                condition: (_, siblingData) => siblingData?.type !== ContactTypeValues.NJSIG, // Only show organization field for non-NJSIG contacts
              },
            },
            {
              name: 'email',
              type: 'email',
              required: true,
              unique: true,
              access: {
                create: editor,
                read: editor,
                update: editor,
              },
            },
            {
              type: 'row',
              fields: [
                patternField({
                  overrides: {
                    name: 'phone',
                    type: 'text',
                    access: {
                      create: editor,
                      read: editor,
                      update: editor,
                    },
                    admin: {
                      placeholder: '% 20',
                    },
                  },
                  pattern: {
                    format: '+1 (###) ### ####',
                    prefix: '% ',
                    allowEmptyFormatting: true,
                    mask: '_',
                  },
                }),
                patternField({
                  overrides: {
                    name: 'extension',
                    type: 'text',
                    access: {
                      create: editor,
                      read: editor,
                      update: editor,
                    },
                  },
                  pattern: {
                    format: '####',
                    prefix: '',
                    allowEmptyFormatting: true,
                    mask: '_',
                  },
                }),
              ],
            },
          ],
        },
      ],
    },
  ],
};

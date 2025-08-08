import { editor, editorOrPublished } from '@/access';
import { patternField } from '@/fields/pattern';
import { CollectionConfig } from 'payload';

export const Contacts: CollectionConfig<'contacts'> = {
  slug: 'contacts',
  access: {
    create: editor,
    delete: editor,
    read: editorOrPublished,
    update: editor,
  },
  admin: {
    defaultColumns: ['portrait', 'type', 'name', 'title'],
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
                  'Portraits should be square and at least 250x250 pixels. A placeholder will be used if not image is assigned to this contact.',
              },
            },
            {
              name: 'type',
              type: 'select',
              required: true,
              options: [
                { label: 'NJSIG', value: 'njsig' },
                { label: 'Broker', value: 'broker' },
              ],
              admin: {
                isClearable: false,
                description:
                  'The user type helps differentiate between NJSIG staff and external brokers.',
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
              admin: {
                description:
                  "The contact person's job title. If not provided, the contact type will be used.",
              },
            },
            {
              name: 'email',
              type: 'email',
              required: true,
              unique: true,
            },
            {
              type: 'row',
              fields: [
                patternField({
                  overrides: {
                    name: 'phone',
                    type: 'text',
                    required: true,
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

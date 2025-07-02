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
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'portrait',
          type: 'upload',
          relationTo: 'contact-portraits',
          admin: {
            description:
              'Portraits should be square and at least 250x250 pixels. A placeholder will be used if not image is assigned to this contact.',
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
  admin: {
    defaultColumns: ['portrait', 'name', 'email', 'phone', 'extension'],
    useAsTitle: 'name',
  },
};

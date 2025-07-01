import { editor, editorOrPublished } from '@/access';
import { patternField } from '@/fields/pattern';
import { CollectionConfig } from 'payload';

export const NJSIGContacts: CollectionConfig<'njsig-contacts'> = {
  slug: 'njsig-contacts',
  access: {
    create: editor,
    delete: editor,
    read: editorOrPublished,
    update: editor,
  },
  labels: {
    singular: 'NJSIG Contact',
    plural: 'NJSIG Contacts',
  },
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
  admin: {
    defaultColumns: ['name', 'email', 'phone', 'extension'],
    useAsTitle: 'name',
  },
};

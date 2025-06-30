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
        ...patternField(
          {
            name: 'phone',
            type: 'text',
            required: true,
            admin: {
              placeholder: '% 20',
            },
          },
          {
            format: '+1 (###) ### ####',
            prefix: '% ',
            allowEmptyFormatting: true,
            mask: '_',
          },
        ),
        ...patternField(
          {
            name: 'extension',
            type: 'text',
          },
          {
            format: '####',
            prefix: '',
            allowEmptyFormatting: true,
            mask: '_',
          },
        ),
      ],
    },
  ],
  admin: {
    defaultColumns: ['name', 'email', 'phone', 'extension'],
    useAsTitle: 'name',
  },
};

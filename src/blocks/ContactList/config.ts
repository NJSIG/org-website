import { Block } from 'payload';

export const ContactList: Block = {
  slug: 'contactList',
  interfaceName: 'ContactListBlock',
  admin: {
    group: 'Lists',
    images: {
      thumbnail: {
        url: '/blocks/contact-list/thumb.png',
        alt: 'Contact List',
      },
      icon: {
        url: '/blocks/contact-list/icon.svg',
        alt: 'Contact List',
      },
    },
  },
  fields: [
    {
      name: 'board',
      type: 'relationship',
      relationTo: 'contacts',
      hasMany: true,
      admin: {
        description: 'Drag contacts to rearrange their order in the list.',
      },
    },
    {
      name: 'columns',
      type: 'select',
      required: true,
      options: [
        { label: '2 Columns', value: '2' },
        { label: '3 Columns', value: '3' },
      ],
      defaultValue: '2',
      admin: {
        isClearable: false,
        description:
          'Choose the number of columns for the contact list. The layout will automatically adjust to the screen width.',
      },
    },
    {
      name: 'squareGrid',
      type: 'checkbox',
      label: 'Include a placeholder to maintain a square grid layout?',
    },
  ],
};

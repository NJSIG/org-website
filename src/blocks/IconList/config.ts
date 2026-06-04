import { lucideIconPickerField } from '@/fields/LucideIconPicker';
import { Block } from 'payload';

export const IconList: Block = {
  slug: 'iconList',
  interfaceName: 'IconListBlock',
  admin: {
    group: 'Lists',
    images: {
      thumbnail: {
        url: '/blocks/icon-list/thumb.png',
        alt: 'Icon List',
      },
      icon: {
        url: '/blocks/icon-list/icon.svg',
        alt: 'Icon List',
      },
    },
  },
  fields: [
    {
      name: 'columns',
      type: 'select',
      defaultValue: 'two',
      options: [
        { label: '1 Column', value: 'one' },
        { label: '2 Columns', value: 'two' },
      ],
      admin: {
        description:
          'A two column layout will display odd items in the left column and even items in the right column. Two columns will stack as one column on smaller screens.',
      },
    },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      fields: [
        lucideIconPickerField({
          overrides: {
            name: 'icon',
            required: true,
          },
        }),
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'text',
          type: 'textarea',
        },
      ],
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/blocks/IconList/ItemLabel',
        },
      },
    },
  ],
};

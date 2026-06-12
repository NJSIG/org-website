import { Block } from 'payload';

export const EmphasizedList: Block = {
  slug: 'emphasizedList',
  interfaceName: 'EmphasizedListBlock',
  admin: {
    group: 'Lists',
    images: {
      thumbnail: {
        url: '/blocks/emphasized-list/thumb.png',
        alt: 'Emphasized List',
      },
      icon: {
        url: '/blocks/emphasized-list/icon.svg',
        alt: 'Emphasized List',
      },
    },
  },
  fields: [
    {
      name: 'bullColor',
      label: 'Bullet Color',
      type: 'select',
      options: [
        { label: 'Primary', value: 'primary' },
        { label: 'Accent', value: 'accent' },
      ],
      defaultValue: 'primary',
      admin: {
        description: 'Select the color of the triangular bullets',
      },
    },
    {
      name: 'listItems',
      type: 'array',
      minRows: 1,
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'content',
          type: 'textarea',
          required: true,
        },
      ],
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/blocks/EmphasizedList/ItemLabel',
        },
      },
    },
  ],
};

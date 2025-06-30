import { Block } from 'payload';

export const EmphasizedList: Block = {
  slug: 'emphasizedList',
  interfaceName: 'EmphasizedListBlock',
  imageURL: '/blocks/emphasized-list.png',
  imageAltText: 'Emphasized List Block',
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

import { Block, Field } from 'payload';

const columnField: Field[] = [
  {
    name: 'visibility',
    type: 'select',
    required: true,
    defaultValue: 'mobile',
    options: [
      { label: 'Desktop Only', value: 'desktop' },
      { label: 'Tablet & Larger', value: 'tablet' },
      { label: 'Mobile & Larger', value: 'mobile' },
    ],
    admin: {
      isClearable: false,
    },
  },
  {
    name: 'colBlocks',
    label: 'Column Blocks',
    labels: {
      singular: 'Column Block',
      plural: 'Column Blocks',
    },
    type: 'blocks',
    blocks: [],
    blockReferences: ['sectionContent', 'sectionTitle', 'cmsButton'],
  },
];

export const SectionColumns: Block = {
  slug: 'sectionCols',
  interfaceName: 'SectionColumnsBlock',
  imageURL: '/blocks/section/section-columns.png',
  imageAltText: 'Section Columns Block',
  labels: {
    singular: 'Section Columns',
    plural: 'Section Columns',
  },
  fields: [
    {
      name: 'vertAlign',
      label: 'Vertical Alignment',
      type: 'select',
      required: true,
      defaultValue: 'top',
      options: [
        { label: 'Top', value: 'top' },
        { label: 'Center', value: 'center' },
        { label: 'Bottom', value: 'bottom' },
      ],
      admin: {
        isClearable: false,
        description:
          'This setting determines how columns with different heights are aligned vertically.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          type: 'group',
          name: 'colOne',
          label: 'Column One (Left)',
          fields: [...columnField],
          admin: {
            width: '50%',
          },
        },
        {
          type: 'group',
          name: 'colTwo',
          label: 'Column Two (Right)',
          fields: [...columnField],
          admin: {
            width: '50%',
          },
        },
      ],
    },
  ],
};

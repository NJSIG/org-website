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
    blockReferences: [
      'cmsButton',
      'collectionList',
      'emphasizedList',
      'imageCallout',
      'optimizedImage',
      'sectionContent',
      'sectionTitle',
    ],
  },
];

export const SectionColumns: Block = {
  slug: 'sectionCols',
  interfaceName: 'SectionColumnsBlock',
  admin: {
    group: 'Layout',
    images: {
      thumbnail: {
        url: '/blocks/section-columns/thumb.png',
        alt: 'Section Columns',
      },
      icon: {
        url: '/blocks/section-columns/icon.svg',
        alt: 'Section Columns',
      },
    },
  },
  labels: {
    singular: 'Section Columns',
    plural: 'Section Columns',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'widths',
          label: 'Column Widths',
          type: 'select',
          required: true,
          defaultValue: 'fifty-fifty',
          options: [
            { label: '30 / 70', value: 'thirty-seventy' },
            { label: '40 / 60', value: 'forty-sixty' },
            { label: '50 / 50', value: 'fifty-fifty' },
            { label: '60 / 40', value: 'sixty-forty' },
            { label: '70 / 30', value: 'seventy-thirty' },
          ],
          admin: {
            isClearable: false,
            description:
              'Columns will take the full width of the page when stacked on small screens.',
          },
        },
        {
          name: 'stackAt',
          label: 'Stack Columns On',
          type: 'select',
          required: true,
          defaultValue: 'mobile',
          options: [
            { label: 'Mobile', value: 'mobile' },
            { label: 'Tablet', value: 'tablet' },
            { label: 'Desktop', value: 'desktop' },
          ],
          admin: {
            isClearable: false,
            description: 'Columns will stack on the selected breakpoint and smaller.',
          },
        },
      ],
    },
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
            hideGutter: true,
          },
        },
        {
          type: 'group',
          name: 'colTwo',
          label: 'Column Two (Right)',
          fields: [...columnField],
          admin: {
            width: '50%',
            hideGutter: true,
          },
        },
      ],
    },
  ],
};

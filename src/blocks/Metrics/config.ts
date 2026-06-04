import { lucideIconPickerField } from '@/fields/LucideIconPicker';
import { Block } from 'payload';

export const Metrics: Block = {
  slug: 'metrics',
  labels: {
    singular: 'Metrics',
    plural: 'Metrics',
  },
  interfaceName: 'MetricsBlock',
  admin: {
    group: 'Lists',
    images: {
      thumbnail: {
        url: '/blocks/metrics/thumb.png',
        alt: 'Metrics',
      },
      icon: {
        url: '/blocks/metrics/icon.svg',
        alt: 'Metrics',
      },
    },
  },
  fields: [
    {
      name: 'columns',
      type: 'select',
      defaultValue: 'four',
      options: [
        { label: 'One Column', value: 'one' },
        { label: 'Two Columns', value: 'two' },
        { label: 'Three Columns', value: 'three' },
        { label: 'Four Columns', value: 'four' },
      ],
      admin: {
        description:
          'The number of columns to display. On smaller screens, the layout will adjust to fit the screen size.',
      },
    },
    {
      type: 'array',
      name: 'items',
      minRows: 1,
      maxRows: 8,
      fields: [
        lucideIconPickerField({
          overrides: {
            name: 'icon',
            required: true,
          },
        }),
        {
          name: 'iconBackgroundColor',
          type: 'select',
          required: true,
          options: [
            { label: 'Azure Midtone (NJSIG)', value: 'azureMidtone' },
            { label: 'Cerulean Midtone (ERIC North)', value: 'ceruleanMidtone' },
            { label: 'Glacial Midtone (BACCEIC)', value: 'glacialMidtone' },
            { label: 'Raspberry Midtone (NJEIF)', value: 'raspberryMidtone' },
            { label: 'Sea Green Midtone (CAIP)', value: 'seaGreenMidtone' },
            { label: 'Sushi Midtone (ERIC South)', value: 'sushiMidtone' },
            { label: 'Tahiti Gold Midtone (MOCSSIF)', value: 'tahitiGoldMidtone' },
            { label: 'Trendy Pink Midtone (ERIC West)', value: 'trendyPinkMidtone' },
          ],
          admin: {
            description: 'The background color for the icon.',
            isClearable: false,
          },
        },
        {
          name: 'value',
          type: 'number',
          required: true,
          admin: {
            description: 'The numeric metric value to display.',
          },
        },
        {
          name: 'label',
          type: 'text',
          required: true,
          admin: {
            description: 'The label to display below the metric value.',
          },
        },
      ],
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/blocks/Metrics/ItemLabel',
        },
      },
    },
  ],
};

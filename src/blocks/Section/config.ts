import { Block } from 'payload';
import {
  SectionBlockFilters,
  SectionBlockSlugs,
  SectionWidthOptions,
  SectionWidths,
} from './types';

const widthOptions: SectionWidthOptions = {
  narrow: { label: 'Narrow', value: 'narrow' },
  normal: { label: 'Normal', value: 'normal' },
  wide: { label: 'Wide', value: 'wide' },
};

const allSectionBlocks: SectionBlockSlugs[] = [
  'cmsButton',
  'emphasizedList',
  'eventTiles',
  'iconList',
  'imageCallout',
  'metrics',
  'optimizedImage',
  'relatedCards',
  'sectionCols',
  'sectionContent',
  'sectionTitle',
];

const sectionBlockFilters: SectionBlockFilters = {
  narrow: [
    'cmsButton',
    'emphasizedList',
    'eventTiles',
    'iconList',
    'imageCallout',
    'metrics',
    'optimizedImage',
    'sectionContent',
    'sectionTitle',
  ],
  normal: allSectionBlocks,
  wide: allSectionBlocks,
};

export const Section: Block = {
  slug: 'section',
  interfaceName: 'SectionBlock',
  imageURL: '/blocks/section.png',
  imageAltText: 'Section Block',
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'contentWidth',
          type: 'select',
          required: true,
          defaultValue: 'normal',
          options: Object.values(widthOptions),
          admin: {
            isClearable: false,
          },
        },
        {
          name: 'backgroundStyle',
          type: 'select',
          required: true,
          defaultValue: 'default',
          options: [
            { label: 'Default', value: 'default' },
            { label: 'Azure Gradient (Dark)', value: 'azureGradient' },
            { label: 'Azure (Light)', value: 'azureLight' },
          ],
          admin: {
            description: 'Some styles will enforce local dark mode for better contrast.',
            isClearable: false,
          },
        },
      ],
    },
    {
      type: 'blocks',
      name: 'sectionBlocks',
      required: true,
      blocks: [],
      blockReferences: allSectionBlocks,
      filterOptions: ({ siblingData: _siblingData }) => {
        const siblingData = _siblingData as { contentWidth?: SectionWidths } | undefined;

        if (siblingData?.contentWidth) {
          return sectionBlockFilters[siblingData.contentWidth] || [];
        }

        return [];
      },
      defaultValue: [{ blockType: 'sectionTitle' }],
    },
  ],
};

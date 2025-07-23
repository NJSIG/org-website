import { Block } from 'payload';

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
          options: [
            { label: 'Normal', value: 'normal' },
            { label: 'Wide', value: 'wide' },
          ],
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
      blockReferences: [
        'sectionCols',
        'sectionContent',
        'sectionTitle',
        'cmsButton',
        'optimizedImage',
        'emphasizedList',
        'eventCards',
      ],
      defaultValue: [{ blockType: 'sectionTitle' }],
    },
  ],
};
